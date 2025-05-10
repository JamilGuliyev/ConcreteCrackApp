import shutil
from fastapi import UploadFile
import os
from uuid import uuid4

UPLOAD_DIR = "static/uploads"

async def save_uploaded_image(file: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path
