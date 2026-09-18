import hashlib
import hmac
import os
import secrets
import sqlite3
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_URL = os.environ.get("BRANDRISE_DB", os.path.join(BASE_DIR, "brandrise.db"))
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
JWT_SECRET = os.environ.get("JWT_SECRET", "brandrise-super-secret-change-me")
JWT_ALGO = "HS256"
TOKEN_TTL_DAYS = 7
PBKDF2_ITERATIONS = 210_000

IS_POSTGRES = (DB_URL or "").startswith(("postgres://", "postgresql://"))


class DB:
    """Halka adapter — SQLite (local) aur Postgres (Neon) dono par chalta hai."""

    def __init__(self, url: str):
        self.is_pg = url.startswith(("postgres://", "postgresql://"))
        self.conn = None
        if self.is_pg:
            import psycopg

            self.engine = psycopg
            self.conn = psycopg.connect(url)
            self.conn.autocommit = True
        else:
            self.conn = sqlite3.connect(url)
            self.conn.row_factory = sqlite3.Row
        self.url = url

    def close(self):
        try:
            self.conn.close()
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        if not self.is_pg:
            self.conn.commit()
        self.close()

    def _sql(self, query: str) -> str:
        return query.replace("?", "%s") if self.is_pg else query

    def execute(self, query: str, params: tuple | list | None = None):
        cur = self.conn.cursor()
        cur.execute(self._sql(query), params or ())
        return cur

    def rows(self, query: str, params: tuple | list | None = None) -> list[dict]:
        cur = self.execute(query, params)
        if self.is_pg:
            cols = [d.name for d in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
        return [dict(r) for r in cur.fetchall()]

    def one(self, query: str, params: tuple | list | None = None) -> dict | None:
        rows = self.rows(query, params)
        return rows[0] if rows else None

    def scalar(self, query: str, params: tuple | list | None = None):
        cur = self.execute(query, params)
        row = cur.fetchone()
        if not row:
            return None
        return row[0] if self.is_pg else list(row)[0]

    def execmany(self, query: str, items: list[tuple]):
        cur = self.conn.cursor()
        cur.executemany(self._sql(query), items) if not self.is_pg else None
        if self.is_pg:
            for item in items:
                cur.execute(self._sql(query), item)


def init_db():
    with DB(DB_URL) as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                business TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT DEFAULT '',
                created_at BIGINT NOT NULL
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                created_at BIGINT NOT NULL
            )
            """
        )
        seed_admin(db)


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), bytes.fromhex(salt), PBKDF2_ITERATIONS
    ).hex()
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iterations, salt, digest = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        check = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt), int(iterations)
        ).hex()
        return hmac.compare_digest(check, digest)
    except (ValueError, TypeError):
        return False


def seed_admin(db: DB):
    count = db.scalar("SELECT COUNT(*) FROM users")
    if count == 0:
        db.execute(
            "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
            (ADMIN_USERNAME, hash_password(ADMIN_PASSWORD), int(time.time() * 1000)),
        )


app = FastAPI(title="BrandRise API", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class LeadIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    business: str = Field(min_length=1, max_length=160)
    phone: str = Field(min_length=5, max_length=30)
    message: str = Field(default="", max_length=2000)


class LeadOut(BaseModel):
    id: str
    name: str
    business: str
    phone: str
    message: str
    created_at: int


class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    token: str
    expires_at: int


class ChangePasswordIn(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8, max_length=128)


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "brandrise-api",
        "db": "postgres" if IS_POSTGRES else "sqlite",
    }


@app.post("/api/leads", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
def create_lead(lead: LeadIn):
    row = {
        "id": uuid.uuid4().hex,
        "name": lead.name.strip(),
        "business": lead.business.strip(),
        "phone": lead.phone.strip(),
        "message": lead.message.strip(),
        "created_at": int(time.time() * 1000),
    }
    with DB(DB_URL) as db:
        db.execute(
            "INSERT INTO leads (id, name, business, phone, message, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            tuple(row.values()),
        )
    return row


@app.post("/api/auth/login", response_model=LoginOut)
def login(creds: LoginIn):
    with DB(DB_URL) as db:
        row = db.one(
            "SELECT username, password_hash FROM users WHERE username = ?",
            (creds.username.strip(),),
        )
    if not row or not verify_password(creds.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    expires_at = int(
        (datetime.now(timezone.utc) + timedelta(days=TOKEN_TTL_DAYS)).timestamp()
    )
    token = jwt.encode(
        {"sub": row["username"], "exp": expires_at},
        JWT_SECRET,
        algorithm=JWT_ALGO,
    )
    return {"token": token, "expires_at": expires_at}


def require_auth(authorization: str | None) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token"
        )
    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    return payload.get("sub", "")


def auth_dep(authorization: str | None = Header(default=None)) -> str:
    return require_auth(authorization)


@app.post("/api/auth/change-password")
def change_password(payload: ChangePasswordIn, username: str = Depends(auth_dep)):
    with DB(DB_URL) as db:
        row = db.one(
            "SELECT username, password_hash FROM users WHERE username = ?",
            (username,),
        )
        if not row or not verify_password(payload.old_password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Old password is incorrect",
            )
        db.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (hash_password(payload.new_password), username),
        )
    return {"ok": True, "message": "Password updated"}


@app.get("/api/leads", response_model=list[LeadOut])
def list_leads(_: str = Depends(auth_dep)):
    with DB(DB_URL) as db:
        return db.rows("SELECT * FROM leads ORDER BY created_at DESC")


@app.get("/api/leads/stats", response_model=dict)
def lead_stats(_: str = Depends(auth_dep)):
    start_of_day = int(
        datetime.now(timezone.utc)
        .replace(hour=0, minute=0, second=0, microsecond=0)
        .timestamp()
    ) * 1000
    with DB(DB_URL) as db:
        total = db.scalar("SELECT COUNT(*) FROM leads")
        today = db.scalar("SELECT COUNT(*) FROM leads WHERE created_at > ?", (start_of_day,))
    return {"total": total, "today": today}