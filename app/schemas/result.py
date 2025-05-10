from pydantic import BaseModel

class AnalysisResult(BaseModel):
    status: str
    message: str
    image: str
    damage_level: str
    
class ResultCreate(BaseModel):
    image_path: str
    result_mask_path: str
    damage_level: str
    user_id: int
