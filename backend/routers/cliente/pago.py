# backend/routers/cliente/pago.py

"""
RUTAS DEL CLIENTE – PROCESAMIENTO DE PAGOS
------------------------------------------
Permite al cliente realizar pagos de pedidos mediante
diferentes métodos (Yape, Plin, etc.) y subir comprobantes.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from utils.db import get_db
from utils import keygen, globals
from models import Pedido, Pago, PasarelaPago
from datetime import datetime
import os

router = APIRouter(prefix="/cliente/pedido", tags=["Pagos del Cliente"])

# ---------------------------------------------------------------------------
# POST /cliente/pedido/{pedido_id}/pagar
# ---------------------------------------------------------------------------
# Procesa el pago de un pedido y sube el comprobante
@router.post("/{pedido_id}/pagar")
def procesar_pago(
    pedido_id: str,
    pasarela_pago_id: str = Form(..., description="ID del método de pago (1=Yape, 2=Plin)"),
    comprobante: UploadFile = File(None, description="Imagen del comprobante de pago"),
    db: Session = Depends(get_db),
):
    """
    Procesa el pago de un pedido.
    Crea un registro de pago y guarda el comprobante.
    """
    # Verificar que el pedido existe
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")
    
    # Verificar que el pedido no esté ya pagado
    pago_existente = db.query(Pago).filter(Pago.pedido_id == pedido_id).first()
    if pago_existente:
        raise HTTPException(status_code=400, detail="Este pedido ya tiene un pago registrado.")
    
    # Verificar que la pasarela de pago existe
    pasarela = db.query(PasarelaPago).filter(PasarelaPago.id == pasarela_pago_id).first()
    if not pasarela:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado.")
    
    # Guardar comprobante si se proporcionó
    referencia_pago = None
    if comprobante:
        uploads_dir = os.path.join("static", "uploads", "comprobantes")
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Generar nombre único para el archivo
        extension = os.path.splitext(comprobante.filename)[1]
        filename = f"comprobante_{pedido_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{extension}"
        file_path = os.path.join(uploads_dir, filename)
        
        # Guardar archivo
        with open(file_path, "wb") as f:
            f.write(comprobante.file.read())
        
        referencia_pago = file_path
        print(f"✅ Comprobante guardado en: {file_path}")
    
    # Crear registro de pago
    pago_id = keygen.generate_uint64_key()
    pago = Pago(
        id=pago_id,
        pedido_id=pedido_id,
        monto=pedido.total,
        fecha=datetime.now(),
        estado="pendiente",  # El admin debe verificar el comprobante
        pasarela_pago_id=pasarela_pago_id,
        referencia_pago=referencia_pago,
    )
    
    db.add(pago)
    
    # Actualizar estado del pedido
    pedido.estado = "en_preparacion"
    
    db.commit()
    db.refresh(pago)
    
    print(f"✅ Pago registrado: {pago_id}")
    
    return {
        "mensaje": "Pago procesado correctamente. Tu pedido está siendo verificado.",
        "pago_id": str(pago.id),
        "pedido_id": str(pedido.id),
        "monto": float(pago.monto),
        "estado": pago.estado,
        "metodo_pago": pasarela.nombre if pasarela else None,
    }


# ---------------------------------------------------------------------------
# GET /cliente/{cliente_id}/pagos
# ---------------------------------------------------------------------------
# Lista todos los pagos realizados por un cliente
@router.get("/{cliente_id}/pagos")
def listar_pagos_cliente(
    cliente_id: str,
    db: Session = Depends(get_db),
):
    """
    Devuelve el historial de pagos de un cliente.
    """
    pagos = (
        db.query(Pago)
        .join(Pedido)
        .options(
            joinedload(Pago.pedido),
            joinedload(Pago.pasarela_pago)
        )
        .filter(Pedido.cliente_id == cliente_id)
        .order_by(Pago.fecha.desc())
        .all()
    )
    
    if not pagos:
        return {"mensaje": "No se encontraron pagos para este cliente."}
    
    resultado = []
    for p in pagos:
        resultado.append({
            "pago_id": str(p.id),
            "pedido_id": str(p.pedido_id),
            "monto": float(p.monto),
            "fecha": p.fecha.isoformat(),
            "estado": p.estado,
            "metodo_pago": p.pasarela_pago.nombre if p.pasarela_pago else None,
            "comprobante": p.referencia_pago,
        })
    
    return {"total": len(resultado), "pagos": resultado}


# ---------------------------------------------------------------------------
# GET /cliente/pago/{pago_id}/estado
# ---------------------------------------------------------------------------
# Verifica el estado de un pago específico
@router.get("/pago/{pago_id}/estado")
def verificar_estado_pago(
    pago_id: str,
    db: Session = Depends(get_db),
):
    """
    Verifica el estado actual de un pago.
    """
    pago = (
        db.query(Pago)
        .options(
            joinedload(Pago.pedido),
            joinedload(Pago.pasarela_pago)
        )
        .filter(Pago.id == pago_id)
        .first()
    )
    
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado.")
    
    return {
        "pago_id": str(pago.id),
        "pedido_id": str(pago.pedido_id),
        "monto": float(pago.monto),
        "fecha": pago.fecha.isoformat(),
        "estado": pago.estado,
        "metodo_pago": pago.pasarela_pago.nombre if pago.pasarela_pago else None,
        "estado_pedido": pago.pedido.estado if pago.pedido else None,
    }