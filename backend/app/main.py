from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import summary

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summary.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "SummarizeIt API is running"} 