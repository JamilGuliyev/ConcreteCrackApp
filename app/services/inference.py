from app.ml_model.predict import run_inference
from app.schemas.result import AnalysisResult
import os

def analyze_crack(image_path: str) -> AnalysisResult:
    prediction = run_inference(image_path)

    return AnalysisResult(
        status=prediction.get("status", "error"),
        message=prediction.get("message", "Ошибка при анализе"),
        image=os.path.basename(image_path),
        damage_level=prediction.get("damage_level", "unknown"),
        concrete_class=prediction.get("concrete_class", "unknown")  # важно!
    )
