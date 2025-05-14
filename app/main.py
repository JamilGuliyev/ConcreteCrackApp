from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, auth
import uvicorn
from app.routes import history



app = FastAPI(
    title="Concrete Crack Analysis",
    description="API for automated analysis of concrete damage from images",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history.router, prefix="/api")

app.include_router(auth.router, prefix="/auth")
app.include_router(upload.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")


@app.get("/")
async def root():
    return {"message": "Concrete Crack Detection API is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)