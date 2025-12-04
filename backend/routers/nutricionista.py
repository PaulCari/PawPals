"""
RUTAS DEL NUTRICIONISTA – REVISIÓN Y APROBACIÓN DE PEDIDOS
------------------------------------------------------------
Permite al nutricionista revisar, aprobar o sugerir modificaciones en
pedidos especializados de los clientes.

Incluye:
- Consulta de pedidos especializados pendientes de revisión
- Revisión de recetas médicas y archivos adjuntos
- Aprobación o rechazo de pedidos especializados
- Creación de platos personalizados para mascotas específicas
- Registro de observaciones y recomendaciones

Notas:
- IDs en formato `str` (por BIGINT).
- Las claves nuevas (por ejemplo, de platos creados) se generan con
  utils.keygen.generate_uint64_key().
- Los platos creados por nutricionista se guardan con:
  creado_nutricionista = 1 y publicado = 0 (por defecto).
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session
from utils import keygen, globals
from db.connection import get_db
# Importar todos los modelos desde el archivo único
from models import (
    PedidoEspecializado,
    RegistroMascota,
    Cliente,
    Pedido
)

router = APIRouter(prefix="/nutricionista", tags=["Nutricionista"])


# ---------------------------------------------------------------------------
# GET /nutricionista/pedidos/pendientes
# ---------------------------------------------------------------------------
# Lista los pedidos especializados pendientes de revisión.
# Muestra información de la mascota, cliente, objetivo de dieta y fecha de solicitud.
@router.get("/pedidos/pendientes")
def listar_pedidos_pendientes(db: Session = Depends(get_db)):

    pedidos = (
        db.query(PedidoEspecializado)
        .join(RegistroMascota, RegistroMascota.id == PedidoEspecializado.registro_mascota_id)
        .join(Cliente, Cliente.id == RegistroMascota.cliente_id)
        .join(Pedido, Pedido.id == PedidoEspecializado.pedido_id)
        .filter(PedidoEspecializado.estado_registro == "A")   # Activo / pendiente
        .all()
    )

    return [
        {
            "pedido_especializado_id": p.id,
            "fecha_solicitud": p.pedido.fecha,
            "objetivo_dieta": p.objetivo_dieta,
            "mascota": {
                "id": p.registro_mascota.id,
                "nombre": p.registro_mascota.nombre,
                "especie": p.registro_mascota.especie.nombre if p.registro_mascota.especie else None
            },
            "cliente": {
                "id": p.registro_mascota.cliente.id,
                "nombre": p.registro_mascota.cliente.nombre
            }
        }
        for p in pedidos
    ]


# ---------------------------------------------------------------------------
# GET /nutricionista/pedidos/{pedido_id}
# ---------------------------------------------------------------------------
# Devuelve los detalles de un pedido especializado específico:
# mascota, archivos adjuntos, receta médica, y observaciones previas.
@router.get("/pedidos/{pedido_id}")
def obtener_detalle_pedido_especializado(pedido_id: str, db: Session = Depends(get_db)):

    pedido = (
        db.query(PedidoEspecializado)
        .filter(PedidoEspecializado.id == pedido_id)
        .first()
    )

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido especializado no encontrado")

    mascota = pedido.registro_mascota
    cliente = mascota.cliente
    receta = pedido.receta_medica[0] if pedido.receta_medica else None

    return {
        "pedido_especializado_id": pedido.id,
        "pedido_id": pedido.pedido_id,
        "fecha_solicitud": pedido.pedido.fecha if pedido.pedido else None,
        "objetivo_dieta": pedido.objetivo_dieta,
        "indicaciones_adicionales": pedido.indicaciones_adicionales,
        "archivo_adicional": pedido.archivo_adicional,

        "mascota": {
            "id": mascota.id,
            "nombre": mascota.nombre,
            "edad": mascota.edad,
            "especie": mascota.especie.nombre if mascota.especie else None,
            "foto": mascota.foto
        },

        "cliente": {
            "id": cliente.id,
            "nombre": cliente.nombre,
            "foto": cliente.foto
        },

        "receta_medica": {
            "archivo": receta.archivo,
            "fecha": receta.fecha
        } if receta else None
    }

from pydantic import BaseModel
class RevisionInput(BaseModel):
    observaciones: str | None = None
    recomendaciones: str | None = None
    aprobado: bool

# ---------------------------------------------------------------------------
# POST /nutricionista/pedidos/{pedido_id}/revisar
# ---------------------------------------------------------------------------
# Permite al nutricionista registrar una revisión:
# Campos: observaciones, recomendaciones, aprobado (bool).
# Si se aprueba, se actualiza el estado del pedido especializado.
@router.post("/pedidos/{pedido_id}/revisar")
def revisar_pedido_especializado(
    pedido_id: str,
    data: RevisionInput,
    db: Session = Depends(get_db)
):

    pedido = (
        db.query(PedidoEspecializado)
        .filter(PedidoEspecializado.id == pedido_id)
        .first()
    )

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido especializado no encontrado")

    # Guardamos observaciones y recomendaciones usando los campos existentes
    if data.observaciones:
        pedido.indicaciones_adicionales = data.observaciones

    if data.recomendaciones:
        pedido.objetivo_dieta = data.recomendaciones

    # Cambiar estado según aprobación
    pedido.estado_registro = "A" if data.aprobado else "I"

    db.commit()

    return {
        "mensaje": "Revisión registrada correctamente",
        "pedido_id": pedido_id,
        "aprobado": data.aprobado
    }

import os
import shutil
import datetime
from fastapi import UploadFile
os.makedirs(UPLOAD_DIR, exist_ok=True)
# ---------------------------------------------------------------------------
# POST /nutricionista/pedidos/{pedido_id}/receta
# ---------------------------------------------------------------------------
# Adjunta o actualiza una receta médica relacionada a un pedido especializado.
# Permite subir un archivo (PDF, imagen, etc.) que se guarda en el servidor.
@router.post("/pedidos/{pedido_id}/receta")
def subir_receta_medica(
    pedido_id: str,
    archivo: UploadFile,
    db: Session = Depends(get_db)
):
    pedido = (
        db.query(PedidoEspecializado)
        .filter(PedidoEspecializado.id == pedido_id)
        .first()
    )

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido especializado no encontrado")

    # Guardar archivo en el servidor
    filename = f"receta_{pedido_id}_{archivo.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # Revisar si ya existe una receta asociada
    receta_existente = (
        db.query(RecetaMedica)
        .filter(RecetaMedica.pedido_especializado_id == pedido_id)
        .first()
    )

    if receta_existente:
        # Actualizar archivo
        receta_existente.archivo = file_path
        receta_existente.fecha = datetime.datetime.now()
        db.commit()

        return {
            "mensaje": "Receta médica actualizada correctamente",
            "archivo": file_path
        }

    # Crear nueva receta médica
    nueva_id = keygen.generate_uint64_key()

    nueva_receta = RecetaMedica(
        id=nueva_id,
        registro_mascota_id=pedido.registro_mascota_id,
        pedido_especializado_id=pedido.id,
        archivo=file_path,
        fecha=datetime.datetime.now(),
        estado_registro="A"
    )

    db.add(nueva_receta)
    db.commit()

    return {
        "mensaje": "Receta médica registrada correctamente",
        "archivo": file_path
    }


# ---------------------------------------------------------------------------
# POST /nutricionista/platos/personalizados
# ---------------------------------------------------------------------------
# Crea un nuevo plato personalizado asociado a una mascota específica.
# Campos: nombre, descripcion, precio, especie_id, registro_mascota_id, imagen (opcional).
# Estos platos no se publican globalmente.
@router.post("/platos/personalizados")
def crear_plato_personalizado(imagen: UploadFile = None):
    pass


# ---------------------------------------------------------------------------
# GET /nutricionista/platos/personalizados/{mascota_id}
# ---------------------------------------------------------------------------
# Lista los platos personalizados creados para una mascota específica.
@router.get("/platos/personalizados/{mascota_id}")
def listar_platos_personalizados(mascota_id: str):
    pass


# ---------------------------------------------------------------------------
# GET /nutricionista/historial
# ---------------------------------------------------------------------------
# Devuelve el historial de pedidos revisados por el nutricionista.
# Incluye fecha, mascota, cliente y resultado (aprobado/rechazado).
@router.get("/historial")
def listar_historial_revisiones():
    pass
