"""
RUTAS DEL CLIENTE – SUBSCRIPCIONES Y MEMBRESÍAS
------------------------------------------------
Permite al cliente consultar los planes disponibles, suscribirse a uno,
ver su suscripción activa y cancelar su membresía si lo desea.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Form # <--- IMPORTANTE: Se agregó Form
from sqlalchemy.orm import Session, joinedload
from utils.db import get_db
from models import MembresiaSubscripcion, Cliente

router = APIRouter(prefix="/cliente/subscripciones", tags=["Subscripciones del Cliente"])


# ---------------------------------------------------------------------------
# GET /cliente/subscripciones
# ---------------------------------------------------------------------------
# Lista todos los planes de membresía activos disponibles.
@router.get("/")
def listar_planes_activos(db: Session = Depends(get_db)):
    planes = db.query(MembresiaSubscripcion).filter(
        MembresiaSubscripcion.estado_registro == "A"
    ).all()
    
    resultado = []
    for p in planes:
        # Convertimos la cadena de beneficios en una lista si existe
        lista_beneficios = p.beneficios.split(',') if p.beneficios else []
        
        resultado.append({
            "id": str(p.id),
            "nombre": p.nombre,
            "duracion": p.duracion,
            "precio": float(p.precio),
            "descripcion": p.descripcion,
            "beneficios": lista_beneficios
        })
    
    return resultado


# ---------------------------------------------------------------------------
# GET /cliente/subscripciones/{subscripcion_id}
# ---------------------------------------------------------------------------
# Obtiene los detalles de un plan específico.
@router.get("/{subscripcion_id}")
def obtener_detalle_plan(subscripcion_id: str, db: Session = Depends(get_db)):
    plan = db.query(MembresiaSubscripcion).filter(
        MembresiaSubscripcion.id == subscripcion_id,
        MembresiaSubscripcion.estado_registro == "A"
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan de suscripción no encontrado.")
    
    return {
        "id": str(plan.id),
        "nombre": plan.nombre,
        "precio": float(plan.precio),
        "duracion_dias": plan.duracion,
        "descripcion": plan.descripcion,
        "beneficios": plan.beneficios.split(',') if plan.beneficios else []
    }


# ---------------------------------------------------------------------------
# GET /cliente/subscripciones/{cliente_id}/actual
# ---------------------------------------------------------------------------
# Devuelve la membresía actual del cliente.
@router.get("/{cliente_id}/actual")
def obtener_subscripcion_actual(cliente_id: str, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).options(joinedload(Cliente.membresia_subscripcion)).filter(
        Cliente.id == cliente_id
    ).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    membresia = cliente.membresia_subscripcion
    
    if not membresia:
        return {"mensaje": "El cliente no tiene una suscripción activa.", "activa": False}
        
    return {
        "activa": True,
        "plan": {
            "id": str(membresia.id),
            "nombre": membresia.nombre,
            "precio": float(membresia.precio),
            "duracion_dias": membresia.duracion,
            "descripcion": membresia.descripcion
        }
    }


# ---------------------------------------------------------------------------
# POST /cliente/subscripciones/{cliente_id}/suscribirse
# ---------------------------------------------------------------------------
# Permite al cliente suscribirse a un plan.
# CORREGIDO: Se eliminó {subscripcion_id} de la ruta y se usa Form para recibir el ID.
@router.post("/{cliente_id}/suscribirse")
def suscribirse_plan(
    cliente_id: str, 
    plan_id: str = Form(...), # <--- Recibe el ID del plan desde el cuerpo (FormData)
    db: Session = Depends(get_db)
):
    # 1. Verificar Cliente
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    # 2. Verificar Plan
    plan = db.query(MembresiaSubscripcion).filter(
        MembresiaSubscripcion.id == plan_id,
        MembresiaSubscripcion.estado_registro == "A"
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="El plan seleccionado no existe o no está activo.")
    
    # 3. Actualizar suscripción
    # Nota: Aquí normalmente iría la lógica de pasarela de pago antes de asignar
    cliente.membresia_subscripcion_id = plan.id
    db.commit()
    
    return {
        "mensaje": f"Suscripción actualizada exitosamente al plan {plan.nombre}.",
        "plan_id": str(plan.id),
        "nombre_plan": plan.nombre
    }


# ---------------------------------------------------------------------------
# DELETE /cliente/subscripciones/{cliente_id}/cancelar
# ---------------------------------------------------------------------------
# Cancela la suscripción actual del cliente (o lo regresa al plan básico/gratuito).
@router.delete("/{cliente_id}/cancelar")
def cancelar_subscripcion(cliente_id: str, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    if not cliente.membresia_subscripcion_id:
        raise HTTPException(status_code=400, detail="El cliente no tiene ninguna suscripción activa para cancelar.")

    # Opción B (Recomendada si usas Freemium): Setear al Plan Básico (ID 1)
    plan_basico = db.query(MembresiaSubscripcion).filter(MembresiaSubscripcion.id == 1).first()
    
    if plan_basico:
        cliente.membresia_subscripcion_id = 1
        mensaje = "Suscripción cancelada. Has regresado al plan Básico."
    else:
        cliente.membresia_subscripcion_id = None
        mensaje = "Suscripción cancelada. No tienes ningún plan activo."

    db.commit()
    
    return {"mensaje": mensaje}