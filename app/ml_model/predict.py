import requests
import logging

logging.basicConfig(level=logging.INFO)

def run_inference(image_path: str):
    api_base = "http://localhost:12333"
    crack_url = f"{api_base}/classify-crack-presence"
    concrete_url = f"{api_base}/classify-concrete-type"

    try:
        # Отправка изображения на crack-presence API
        with open(image_path, "rb") as f:
            files = {'file': (image_path, f, 'image/jpeg')}
            crack_response = requests.post(crack_url, files=files)
            crack_response.raise_for_status()
            crack_data = crack_response.json()
            logging.info(f"Crack API response: {crack_data}")

        # Повторная отправка изображения на concrete-type API
        with open(image_path, "rb") as f:
            files = {'file': (image_path, f, 'image/jpeg')}
            concrete_response = requests.post(concrete_url, files=files)
            concrete_response.raise_for_status()
            concrete_data = concrete_response.json()
            logging.info(f"Concrete API response: {concrete_data}")

        return {
            "status": "success",
            "message": "Анализ завершён",
            "image": image_path,
            "damage_level": "cracked" if crack_data.get("crack_presence") == 1 else "non-cracked",
            "concrete_class": concrete_data.get("class", "неизвестен")
        }

    except Exception as e:
        logging.exception("Ошибка при инференсе:")
        return {
            "status": "error",
            "message": str(e),
            "image": image_path,
            "damage_level": "unknown",
            "concrete_class": "unknown"
        }
