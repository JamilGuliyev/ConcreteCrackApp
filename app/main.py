from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app.routes import auth, upload, analyses
from app.routes import router as main_router
from app.routes import history
import uvicorn

# Создаем экземпляр FastAPI
app = FastAPI(
    title="Concrete Crack Analysis",
    description="API for automated analysis of concrete damage from images",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Добавляем OAuth2 схему
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Новый эндпоинт для проверки токена
@app.get("/api/verify-token")
async def verify_token(token: str = Depends(oauth2_scheme)):
    """
    Проверка валидности JWT токена.
    В реальной реализации здесь должна быть проверка подписи токена.
    """
    # Временная заглушка - всегда возвращает успех при наличии токена
    # В продакшене замените на реальную проверку!
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )
    return {"status": "valid", "token": token}

# Подключаем роутеры
app.include_router(main_router)
app.include_router(auth.router, prefix="/api/auth")
app.include_router(upload.router, prefix="/api/images")
app.include_router(analyses.router, prefix="/api/analyses")

app.include_router(history.router, prefix="/api", tags=["history"])

# Базовый эндпоинт
@app.get("/")
async def root():
    return {"message": "Concrete Crack Detection API is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)