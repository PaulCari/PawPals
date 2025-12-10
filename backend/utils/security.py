# backend/utils/security.py

from passlib.context import CryptContext

# ✅ CAMBIO: Ahora usamos 'argon2' como el método principal.
# Es más moderno y no tiene los problemas de compilación de bcrypt en Windows.
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si la contraseña en texto plano coincide con la contraseña hasheada.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Genera un hash de una contraseña en texto plano usando Argon2.
    """
    return pwd_context.hash(password)