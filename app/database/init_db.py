from app.database.models import Base, engine
from app.models import user, result  # Не меняй порядок!

print("Создание таблиц...")
Base.metadata.create_all(bind=engine)
print("Готово!")