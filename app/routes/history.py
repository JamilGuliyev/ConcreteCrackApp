from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.result import Result
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/history")
def get_analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_id == current_user.id).order_by(Result.analyzed_at.desc()).all()
    return [
        {
            "filename": r.filename,
            "damage_level": r.damage_level,
            "analyzed_at": r.analyzed_at.isoformat()
        } for r in results
    ]