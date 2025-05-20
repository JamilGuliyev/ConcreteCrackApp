from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List

from app.database.db import get_db
from app.models.result import Result
from app.schemas.result import AnalysisResultOut, ResultTitleUpdate
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/history", response_model=List[AnalysisResultOut])
def get_user_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    return db.query(Result).filter(Result.user_id == current_user.id).order_by(Result.analyzed_at.desc()).all()

@router.put("/history/{result_id}/title")
def update_title(
    result_id: int,
    update: ResultTitleUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    result = db.query(Result).filter(Result.id == result_id, Result.user_id == current_user.id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    result.title = update.title
    db.commit()
    return {"message": "Title updated"}