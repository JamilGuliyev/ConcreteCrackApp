from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AnalysisResult(BaseModel):
    status: str
    message: str
    image: str
    damage_level: str
    concrete_class: str  # <-- оставляем как есть


class ResultCreate(BaseModel):
    image_path: str
    result_mask_path: str
    damage_level: str
    user_id: int


# ✅ Для истории анализов (GET /api/history)
class AnalysisResultOut(BaseModel):
    id: int
    filename: str
    damage_level: str
    concrete_class: Optional[str] = None
    analyzed_at: datetime
    title: Optional[str] = None  # ← новое поле для редактируемого названия

    class Config:
        orm_mode = True


# ✅ Для редактирования названия анализа (PUT /api/history/{id}/title)
class ResultTitleUpdate(BaseModel):
    title: str