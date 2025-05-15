from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.result import Result
from app.services.auth_service import get_current_user
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.get("/")
def get_user_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all analyses for current user"""
    try:
        analyses = db.query(Result)\
            .filter(Result.user_id == current_user.id)\
            .order_by(Result.analyzed_at.desc())\
            .all()
        
        return {
            "count": len(analyses),
            "results": [
                {
                    "id": a.id,
                    "filename": a.filename,
                    "damage_level": a.damage_level,
                    "analyzed_at": a.analyzed_at.isoformat(),
                    "image_url": f"/images/{a.id}"  # Пример URL для получения изображения
                }
                for a in analyses
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching analyses: {str(e)}"
        )