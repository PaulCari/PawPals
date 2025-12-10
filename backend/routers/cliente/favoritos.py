"""
RUTAS DEL CLIENTE – GESTIÓN DE FAVORITOS
----------------------------------------
Permite al cliente gestionar sus platos favoritos.

Incluye:
- Agregar un plato a favoritos
- Eliminar un plato de favoritos
- Listar todos los platos favoritos del cliente
- Verificar si un plato está en favoritos
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session, joinedload
from utils.db import get_db
from utils import keygen
from models import PlatoFavorito, Cliente, PlatoCombinado
from datetime import datetime

router = APIRouter(prefix="/cliente/favoritos", tags=["Favoritos del Cliente"])

# ---------------------------------------------------------------------------
# POST /cliente/favoritos/{cliente_id}/{plato_id}
# ---------------------------------------------------------------------------
@router.post("/{cliente_id}/{plato_id}")
def agregar_favorito(
    cliente_id: str,
    plato_id: str,
    db: Session = Depends(get_db),
):
    """
    Agrega un plato a la lista de favoritos del cliente.
    Si ya existe, retorna un mensaje indicándolo.
    """
    # Verificar que el cliente existe
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    # Verificar que el plato existe
    plato = db.query(PlatoCombinado).filter(PlatoCombinado.id == plato_id).first()
    if not plato:
        raise HTTPException(status_code=404, detail="Plato no encontrado.")
    
    # Verificar si ya está en favoritos
    favorito_existente = db.query(PlatoFavorito).filter(
        PlatoFavorito.cliente_id == cliente_id,
        PlatoFavorito.plato_combinado_id == plato_id
    ).first()
    
    if favorito_existente:
        return {
            "mensaje": "Este plato ya está en tus favoritos.",
            "ya_existe": True,
            "favorito_id": str(favorito_existente.id)
        }
    
    # Crear nuevo favorito
    nuevo_favorito = PlatoFavorito(
        id=keygen.generate_uint64_key(),
        cliente_id=cliente_id,
        plato_combinado_id=plato_id,
        fecha_agregado=datetime.now()
    )
    
    db.add(nuevo_favorito)
    db.commit()
    db.refresh(nuevo_favorito)
    
    return {
        "mensaje": "Plato agregado a favoritos correctamente.",
        "ya_existe": False,
        "favorito": {
            "id": str(nuevo_favorito.id),
            "plato_id": str(plato_id),
            "plato_nombre": plato.nombre,
            "fecha_agregado": nuevo_favorito.fecha_agregado.isoformat()
        }
    }

# ---------------------------------------------------------------------------
# DELETE /cliente/favoritos/{cliente_id}/{plato_id}
# ---------------------------------------------------------------------------
@router.delete("/{cliente_id}/{plato_id}")
def eliminar_favorito(
    cliente_id: str,
    plato_id: str,
    db: Session = Depends(get_db),
):
    """
    Elimina un plato de la lista de favoritos del cliente.
    """
    favorito = db.query(PlatoFavorito).filter(
        PlatoFavorito.cliente_id == cliente_id,
        PlatoFavorito.plato_combinado_id == plato_id
    ).first()
    
    if not favorito:
        raise HTTPException(
            status_code=404, 
            detail="Este plato no está en tus favoritos."
        )
    
    db.delete(favorito)
    db.commit()
    
    return {
        "mensaje": "Plato eliminado de favoritos correctamente.",
        "plato_id": str(plato_id)
    }

# ---------------------------------------------------------------------------
# GET /cliente/favoritos/{cliente_id}
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}")
def listar_favoritos(
    cliente_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Lista todos los platos favoritos de un cliente.
    Incluye información completa del plato.
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    favoritos = (
        db.query(PlatoFavorito)
        .options(
            joinedload(PlatoFavorito.plato_combinado)
            .joinedload(PlatoCombinado.categoria),
            joinedload(PlatoFavorito.plato_combinado)
            .joinedload(PlatoCombinado.especie),
            joinedload(PlatoFavorito.plato_combinado)
            .joinedload(PlatoCombinado.etiqueta_plato)
        )
        .filter(PlatoFavorito.cliente_id == cliente_id)
        .order_by(PlatoFavorito.fecha_agregado.desc())
        .all()
    )
    
    if not favoritos:
        return {
            "mensaje": "No tienes platos en favoritos aún.",
            "total": 0,
            "favoritos": []
        }
    
    # Construir URL base para imágenes
    base_url = str(request.base_url).rstrip("/")
    
    resultado = []
    for fav in favoritos:
        plato = fav.plato_combinado
        if plato:
            imagen_url = None
            if plato.imagen:
                imagen_url = f"{base_url}/static/imagenes/plato/{plato.imagen}"
            
            resultado.append({
                "favorito_id": str(fav.id),
                "fecha_agregado": fav.fecha_agregado.isoformat(),
                "plato": {
                    "id": str(plato.id),
                    "nombre": plato.nombre,
                    "descripcion": plato.descripcion,
                    "precio": float(plato.precio),
                    "imagen": imagen_url,
                    "categoria": plato.categoria.nombre if plato.categoria else None,
                    "especie": plato.especie.nombre if plato.especie else None,
                    "etiquetas": [ep.etiqueta.nombre for ep in plato.etiqueta_plato]
                }
            })
    
    return {
        "total": len(resultado),
        "favoritos": resultado
    }

# ---------------------------------------------------------------------------
# GET /cliente/favoritos/{cliente_id}/check/{plato_id}
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}/check/{plato_id}")
def verificar_favorito(
    cliente_id: str,
    plato_id: str,
    db: Session = Depends(get_db),
):
    """
    Verifica si un plato específico está en la lista de favoritos del cliente.
    Útil para actualizar el estado del botón de favorito en el frontend.
    """
    favorito = db.query(PlatoFavorito).filter(
        PlatoFavorito.cliente_id == cliente_id,
        PlatoFavorito.plato_combinado_id == plato_id
    ).first()
    
    return {
        "es_favorito": favorito is not None,
        "favorito_id": str(favorito.id) if favorito else None
    }