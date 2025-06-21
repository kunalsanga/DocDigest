from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import summary

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "https://doc-digest-chi.vercel.app"  # Deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summary.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "SummarizeIt API is running"} 