from fastapi import APIRouter
from app.routes import auth, upload, analyses  # Убрали history, добавили analyses

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(upload.router, prefix="/images", tags=["images"])
router.include_router(analyses.router, prefix="/analyses", tags=["analyses"])  # Добавили analyses