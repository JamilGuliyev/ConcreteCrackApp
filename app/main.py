from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, upload, analyses
from app.routes import router as main_router
import uvicorn

# Сначала создаем экземпляр FastAPI
app = FastAPI(
    title="Concrete Crack Analysis",
    description="API for automated analysis of concrete damage from images",
    version="1.0.0"
)

# Затем добавляем middleware и роутеры
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(main_router)
app.include_router(auth.router, prefix="/api/auth")
app.include_router(upload.router, prefix="/api/images")
app.include_router(analyses.router, prefix="/api/analyses")

# Базовый эндпоинт
@app.get("/")
async def root():
    return {"message": "Concrete Crack Detection API is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)