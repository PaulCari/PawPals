from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from utils.db import engine

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

# --- AÑADE ESTAS LÍNEAS PARA CREAR LAS TABLAS ---
from models import Base  # Importa la Base desde tu models.py

print("--- Intentando crear tablas en la base de datos 'mascotas'... ---")
Base.metadata.create_all(bind=engine)
print("--- Proceso de creación de tablas finalizado. ---")
# --- FIN DEL CÓDIGO AÑADIDO ---


app = FastAPI(title="API Mascota")

# 🟢 Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# 🧩 Incluir routers
# Routers generales
app.include_router(auth.router)
app.include_router(nutricionista.router)
app.include_router(repartidor.router)

# Routers cliente
app.include_router(platos_mascotas.router)
app.include_router(cliente.router)
app.include_router(mascota.router)
app.include_router(pedido.router)
app.include_router(perfil.router)
app.include_router(cliente_subscripciones.router)

# Routers admin
app.include_router(admin_pedidos.router)
app.include_router(admin_platos.router)
app.include_router(admin_repartidores.router)
app.include_router(admin_subscripciones.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Backend Mascota iniciado correctamente"}