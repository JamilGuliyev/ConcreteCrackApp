from app.ml_model.predict import run_inference
from app.schemas.result import AnalysisResult
import os

def analyze_crack(image_path: str) -> AnalysisResult:
    # Прогон через модель
    prediction = run_inference(image_path)
    
    # Примерная структура возврата от модели (адаптируй под конкретный output модели)
    damage_level = prediction.get("damage_level", "unknown")
    status = "success" if damage_level else "failed"
    message = "Анализ успешно завершен" if status == "success" else "Ошибка при анализе"
    
    return AnalysisResult(
        status=status,
        message=message,
        image=os.path.basename(image_path),
        damage_level=damage_level
    )
