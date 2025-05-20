from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.models import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    damage_level = Column(String, nullable=False)
    concrete_class = Column(String, nullable=True)  # ← 🔥 добавлено
    analyzed_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_path = Column(String, nullable=True)

    owner = relationship("User", back_populates="results")
