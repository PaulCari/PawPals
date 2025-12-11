# backend/routers/cliente/carrito.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session, joinedload
from utils.db import get_db
from models import Cliente, Pedido, DetallePedido, PlatoCombinado
from utils import keygen
from datetime import datetime

router = APIRouter(prefix="/cliente/carrito", tags=["Carrito de Compras"])

def get_or_create_cart(cliente_id: str, db: Session) -> Pedido:
    """Busca un pedido en estado 'carrito' para el cliente. Si no existe, lo crea."""
    cart = db.query(Pedido).filter_by(cliente_id=cliente_id, estado="carrito").first()
    if not cart:
        cart = Pedido(
            id=keygen.generate_uint64_key(),
            cliente_id=cliente_id,
            fecha=datetime.utcnow(),
            total=0.0,
            estado="carrito",
            incluye_plato=True
        )
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.post("/agregar")
def agregar_al_carrito(
    cliente_id: str = Body(...),
    plato_id: str = Body(...),
    cantidad: int = Body(1),
    db: Session = Depends(get_db)
):
    """Agrega un producto al carrito del cliente o actualiza su cantidad."""
    cart = get_or_create_cart(cliente_id, db)
    plato = db.query(PlatoCombinado).filter(PlatoCombinado.id == plato_id).first()
    if not plato:
        raise HTTPException(status_code=404, detail="Plato no encontrado")

    detalle_existente = db.query(DetallePedido).filter_by(pedido_id=cart.id, plato_combinado_id=plato_id).first()

    if detalle_existente:
        detalle_existente.cantidad += cantidad
    else:
        nuevo_detalle = DetallePedido(
            id=keygen.generate_uint64_key(),
            pedido_id=cart.id,
            plato_combinado_id=plato_id,
            cantidad=cantidad,
            subtotal=0 # El subtotal se recalcula siempre
        )
        db.add(nuevo_detalle)
    
    # Recalcular el total del carrito
    detalles = db.query(DetallePedido).options(joinedload(DetallePedido.plato_combinado)).filter_by(pedido_id=cart.id).all()
    cart.total = sum(d.plato_combinado.precio * d.cantidad for d in detalles)
    db.commit()
    
    return {"mensaje": "Producto agregado al carrito", "total_carrito": float(cart.total)}

@router.get("/{cliente_id}")
def ver_carrito(cliente_id: str, db: Session = Depends(get_db)):
    """Muestra el contenido del carrito actual de un cliente."""
    cart = db.query(Pedido).filter_by(cliente_id=cliente_id, estado="carrito").options(joinedload(Pedido.detalle_pedido).joinedload(DetallePedido.plato_combinado)).first()
    
    if not cart or not cart.detalle_pedido:
        return {"items": [], "total": 0.0}
        
    items = [{
        "detalle_id": str(d.id),
        "plato_id": str(d.plato_combinado.id),
        "nombre": d.plato_combinado.nombre,
        "cantidad": d.cantidad,
        "precio_unitario": float(d.plato_combinado.precio),
        "subtotal": float(d.plato_combinado.precio * d.cantidad),
        "imagen": d.plato_combinado.imagen, # Pasamos el nombre del archivo de imagen
    } for d in cart.detalle_pedido]
    
    return {"items": items, "total": float(cart.total)}

# (Más adelante se pueden añadir endpoints para eliminar items o vaciar el carrito)