from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ai import router as ai_router
from app.api.crud import router as crud_router
from app.api.portfolio import router as portfolio_router
from app.db import models  # Import models to register them with SQLAlchemy
from app.db.database import engine, init_db
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IntelliFolio-Her")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(ai_router)
app.include_router(crud_router)
app.include_router(portfolio_router)
