from fastapi import APIRouter
from app.routes import auth, upload

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(upload.router, prefix="/images", tags=["images"])
