import os
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

app = FastAPI(title="BrandRise API", version="1.0.0")

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
    if creds.username != ADMIN_USERNAME or creds.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    expires_at = int(
        (datetime.now(timezone.utc) + timedelta(days=TOKEN_TTL_DAYS)).timestamp()
    )
    token = jwt.encode(
        {"sub": creds.username, "exp": expires_at},
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
            (int(datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()) * 1000,),
        ).fetchone()[0]
    return {"total": total, "today": today}