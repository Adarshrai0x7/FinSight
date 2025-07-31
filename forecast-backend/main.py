from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(title="Stock Forecasting API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or replace "*" with your frontend URL like "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, OPTIONS etc.
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
