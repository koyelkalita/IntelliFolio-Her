from fastapi import FastAPI
from app.auth.routes import auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "Welcome to IntelliFolio-Her FastAPI backend!"}
