from fastapi import APIRouter, UploadFile, File, Depends
from app.services.inference import analyze_crack
from app.services.storage import save_uploaded_image
from app.schemas.result import AnalysisResult

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def upload_image(file: UploadFile = File(...)):
    filepath = await save_uploaded_image(file)
    result = analyze_crack(filepath)
    return result