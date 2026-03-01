import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Database URL - defaults to SQLite if PostgreSQL is not available
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./intellifolio.db"
)

# Create engine with appropriate settings
connect_args = {}
engine_kwargs = {
    "echo": os.getenv("DEBUG", "false").lower() == "true",
}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for models
Base = declarative_base()


def get_db():
    """Dependency for FastAPI to inject DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)
    print("[OK] Database initialized successfully")


def drop_db():
    """Drop all tables - CAUTION"""
    confirm = input("Are you sure you want to drop all tables? (yes/no): ")
    if confirm.lower() == "yes":
        Base.metadata.drop_all(bind=engine)
        print("[OK] All tables dropped")
    else:
        print("Cancelled")
