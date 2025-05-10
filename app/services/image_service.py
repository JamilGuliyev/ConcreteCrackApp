from app.models.result import Result
from app.schemas.result import ResultCreate
from sqlalchemy.orm import Session

def create_result(db: Session, result_data: ResultCreate, user_id: int):
    result = Result(**result_data.dict(), user_id=user_id)
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

def get_user_results(db: Session, user_id: int):
    return db.query(Result).filter(Result.user_id == user_id).all()
