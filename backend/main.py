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
DB_PATH = os.environ.get("BRANDRISE_DB", os.path.join(BASE_DIR, "brandrise.db"))
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
JWT_SECRET = os.environ.get("JWT_SECRET", "brandrise-super-secret-change-me")
JWT_ALGO = "HS256"
TOKEN_TTL_DAYS = 7
PBKDF2_ITERATIONS = 210_000

app = FastAPI(title="BrandRise API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@contextmanager
def db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with db_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                business TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT DEFAULT '',
                created_at INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password_hash TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
            """
        )
        seed_admin(conn)


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


def seed_admin(conn):
    count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if count == 0:
        conn.execute(
            "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
            (ADMIN_USERNAME, hash_password(ADMIN_PASSWORD), int(time.time() * 1000)),
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
    return {"ok": True, "service": "brandrise-api"}


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
    with db_conn() as conn:
        conn.execute(
            "INSERT INTO leads (id, name, business, phone, message, created_at) "
            "VALUES (:id, :name, :business, :phone, :message, :created_at)",
            row,
        )
    return row


@app.post("/api/auth/login", response_model=LoginOut)
def login(creds: LoginIn):
    with db_conn() as conn:
        row = conn.execute(
            "SELECT username, password_hash FROM users WHERE username = ?",
            (creds.username.strip(),),
        ).fetchone()
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
def change_password(
    payload: ChangePasswordIn, username: str = Depends(auth_dep)
):
    with db_conn() as conn:
        row = conn.execute(
            "SELECT username, password_hash FROM users WHERE username = ?",
            (username,),
        ).fetchone()
        if not row or not verify_password(payload.old_password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Old password is incorrect",
            )
        conn.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (hash_password(payload.new_password), username),
        )
    return {"ok": True, "message": "Password updated"}


@app.get("/api/leads", response_model=list[LeadOut])
def list_leads(_: str = Depends(auth_dep)):
    with db_conn() as conn:
        rows = conn.execute("SELECT * FROM leads ORDER BY created_at DESC").fetchall()
    return [dict(r) for r in rows]


@app.get("/api/leads/stats", response_model=dict)
def lead_stats(_: str = Depends(auth_dep)):
    with db_conn() as conn:
        total = conn.execute("SELECT COUNT(*) FROM leads").fetchone()[0]
        today = conn.execute(
            "SELECT COUNT(*) FROM leads WHERE created_at > ?",
            (
                int(
                    datetime.now(timezone.utc)
                    .replace(hour=0, minute=0, second=0, microsecond=0)
                    .timestamp()
                )
                * 1000,
            ),
        ).fetchone()[0]
    return {"total": total, "today": today}