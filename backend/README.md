# PawPals Backend

Este proyecto es el backend de PawPals, construido con FastAPI.

## Requisitos
- Python 3.10+
- Instalar dependencias necesarias (FastAPI, SQLAlchemy, etc.)

## Instalación de dependencias

1. Abre una terminal en la carpeta `backend`.
2. Instala las dependencias necesarias:
   ```
   pip install fastapi uvicorn sqlalchemy
   ```
## Cómo correr el backend
    
1. Abre una terminal en la carpeta `backend`.
2. Ejecuta el servidor con:
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload

3. El backend estará disponible en [http://localhost:8000](http://localhost:8000)

## Notas
- Los endpoints principales están definidos en los routers dentro de la carpeta `routers`.
- Los archivos estáticos se sirven desde `/static`.
- La base de datos se inicializa automáticamente al iniciar el backend.
