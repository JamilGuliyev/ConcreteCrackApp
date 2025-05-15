from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Annotated

from app.services.inference import analyze_crack
from app.services.storage import save_uploaded_image
from app.schemas.result import AnalysisResult
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.result import Result
from app.database.db import get_db

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def upload_image(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    file: UploadFile = File(...)
):
    """
    Upload an image for concrete crack analysis.
    Saves the image, analyzes it, and stores results in database.
    """
    try:
        # Сохраняем файл и получаем результат анализа
        filepath = await save_uploaded_image(file)
        result = analyze_crack(filepath)
        
        # Сохраняем в базу
        db_result = Result(
            filename=file.filename,
            damage_level=result.damage_level,
            analyzed_at=datetime.now(),
            user_id=current_user.id,
            image_path=filepath
        )
        db.add(db_result)
        db.commit()
        db.refresh(db_result)
        
        return {
            **result.model_dump(),
            "analysis_id": db_result.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )