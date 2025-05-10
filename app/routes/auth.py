from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Login not yet implemented"}

@router.post("/register")
async def register():
    return {"message": "Register not yet implemented"}
