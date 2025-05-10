from .db import Base, engine
from app.models import user, result  # <--- Это важно!

print("Создание таблиц...")
Base.metadata.create_all(bind=engine)
print("Готово!")