# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from utils.db import engine

# --- IMPORTAMOS EL SEMBRADOR DE DATOS ---
from seed_data import seed_database 

# Routers generales
from routers import (
    auth,
    nutricionista,
    repartidor,
)

# Routers cliente
from routers.cliente import (
    cliente,
    mascota,
    pedido,
    perfil,
    platos_mascotas,
    subscripciones as cliente_subscripciones,
)

# Routers admin
from routers.admin import (
    pedidos as admin_pedidos,
    platos as admin_platos,
    repartidores as admin_repartidores,
    subscripciones as admin_subscripciones,
)

from models import Base

# 1. CREAR TABLAS (Si no existen)
print("--- Intentando crear tablas en la base de datos 'mascotas'... ---")
Base.metadata.create_all(bind=engine)
print("--- Proceso de creación de tablas finalizado. ---")

# 2. POBLAR LA BASE DE DATOS (Roles, Categorías, Platos e Imágenes)
print("🌱 --- Ejecutando Seed Data (Sembrando datos)... ---")
try:
    seed_database()
    print("✅ --- Seed Data finalizado correctamente. ---")
except Exception as e:
    print(f"⚠️ Hubo un error al sembrar los datos: {e}")

app = FastAPI(title="API Mascota")

# ✅ CONFIGURACIÓN CRÍTICA DE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Desarrollo: acepta todo
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
    expose_headers=["*"]
)

# Servir archivos estáticos (Imágenes)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir routers
app.include_router(auth.router)
app.include_router(nutricionista.router)
app.include_router(repartidor.router)
app.include_router(platos_mascotas.router)
app.include_router(cliente.router)
app.include_router(mascota.router)
app.include_router(pedido.router)
app.include_router(perfil.router)
app.include_router(cliente_subscripciones.router)
app.include_router(admin_pedidos.router)
app.include_router(admin_platos.router)
app.include_router(admin_repartidores.router)
app.include_router(admin_subscripciones.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend Mascota iniciado correctamente"}