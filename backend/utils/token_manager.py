# backend/utils/token_manager.py

import jwt
from datetime import datetime, timedelta

SECRET_KEY = "mi_clave_secreta_super_segura_2024"  # ← Cámbiala en producción
ALGORITHM = "HS256"

def generar_token(user_id: int, rol_id: int, duracion_horas: int = 12) -> str:
    """
    Genera un token JWT con ID de usuario y rol.
    """
    payload = {
        "user_id": str(user_id),  # ← Convertir a string
        "rol_id": rol_id,
        "exp": datetime.utcnow() + timedelta(hours=duracion_horas)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decodificar_token(token: str) -> dict:
    """
    Decodifica y valida un token JWT.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expirado")
    except jwt.InvalidTokenError:
        raise Exception("Token inválido")