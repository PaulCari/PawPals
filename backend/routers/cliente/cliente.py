# backend/routers/cliente/cliente.py - VERSIÓN CORREGIDA

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form
from utils import keygen, globals
from sqlalchemy.orm import joinedload, Session
from utils.db import get_db
import os  
from models import Cliente, Direccion, Notificacion
router = APIRouter(prefix="/cliente", tags=["Cliente"])

# ---------------------------------------------------------------------------
# GET /cliente/id/{cliente_id}
# ---------------------------------------------------------------------------
@router.get("/id/{cliente_id}")
def obtener_perfil_cliente(cliente_id: str, db: Session = Depends(get_db)):
    """
    Obtiene el perfil completo de un cliente.
    """
    print(f"📥 Obteniendo perfil para cliente: {cliente_id}")
    
    cliente = (
        db.query(Cliente)
        .options(
            joinedload(Cliente.cuenta_usuario),
            joinedload(Cliente.membresia_subscripcion),
            joinedload(Cliente.direccion)
        )
        .filter(Cliente.id == cliente_id, Cliente.estado_registro == "A")
        .first()
    )

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    cuenta = cliente.cuenta_usuario
    membresia = cliente.membresia_subscripcion
    
    # 🔥 CORRECCIÓN: Construir URL completa para la foto
    foto_url = None
    if cliente.foto:
        # Limpiar ruta: eliminar 'static/' del inicio si existe
        foto_path = cliente.foto.replace('static/', '').replace('static\\', '')
        foto_url = f"{globals.CLIENTE}{os.path.basename(foto_path)}"
    
    direcciones = [
        {
            "id": str(d.id),
            "nombre": d.nombre,
            "referencia": d.referencia,
            "latitud": float(d.latitud),
            "longitud": float(d.longitud),
            "es_principal": bool(d.es_principal),
        }
        for d in cliente.direccion if d.estado_registro == "A"
    ]

    response = {
        "id": str(cliente.id),
        "nombre": cliente.nombre,
        "telefono": cliente.telefono,
        "correo": cuenta.correo_electronico if cuenta else None,
        "foto": foto_url,
        "membresia_activa": {
            "id": str(membresia.id),
            "nombre": membresia.nombre,
            "duracion": membresia.duracion,
            "precio": float(membresia.precio),
        } if membresia else None,
        "direcciones": direcciones,
    }
    
    print(f"✅ Perfil obtenido: {cliente.nombre}")
    return response

# ---------------------------------------------------------------------------
# PUT /cliente/{cliente_id} - VERSIÓN CORREGIDA
# ---------------------------------------------------------------------------
@router.put("/{cliente_id}")
def actualizar_datos_cliente(
    cliente_id: str,
    nombre: str = Form(...),
    telefono: str = Form(...),
    foto: UploadFile | None = None,
    db: Session = Depends(get_db),
):
    """
    Actualiza los datos del cliente.
    El correo NO se puede modificar.
    """
    print(f"💾 Actualizando cliente: {cliente_id}")
    print(f"   Nombre: {nombre}")
    print(f"   Teléfono: {telefono}")
    print(f"   Foto: {'Sí' if foto else 'No'}")
    
    # Buscar cliente
    cliente = (
        db.query(Cliente)
        .options(joinedload(Cliente.cuenta_usuario))
        .filter(Cliente.id == cliente_id)
        .first()
    )
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    # Actualizar datos básicos
    cliente.nombre = nombre.strip()
    cliente.telefono = telefono.strip()

    # 🔥 MANEJO DE FOTO MEJORADO
    if foto:
        try:
            # Crear directorio si no existe
            uploads_dir = globals.CLIENTE
            os.makedirs(uploads_dir, exist_ok=True)

            # Generar nombre único
            filename = f"cliente_{cliente_id}_{foto.filename}"
            file_path = os.path.join(uploads_dir, filename)

            # Guardar archivo
            with open(file_path, "wb") as f:
                f.write(foto.file.read())
            
            # Guardar solo la ruta relativa
            cliente.foto = file_path
            print(f"✅ Foto guardada: {file_path}")
            
        except Exception as e:
            print(f"❌ Error al guardar foto: {str(e)}")
            # No fallar si hay error con la foto
            pass
    else:
        # Si no se envía foto, mantener la actual o usar default
        if not cliente.foto:
            cliente.foto = os.path.join(globals.CLIENTE, "user.png")

    # Guardar cambios
    try:
        db.commit()
        db.refresh(cliente)
        print("✅ Cliente actualizado correctamente")
    except Exception as e:
        db.rollback()
        print(f"❌ Error al guardar: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al actualizar el cliente.")

    # Construir URL de foto
    foto_url = None
    if cliente.foto:
        foto_path = cliente.foto.replace('static/', '').replace('static\\', '')
        foto_url = f"{globals.CLIENTE}{os.path.basename(foto_path)}"

    return {
        "mensaje": "Datos del cliente actualizados correctamente.",
        "cliente": {
            "id": str(cliente.id),
            "nombre": cliente.nombre,
            "telefono": cliente.telefono,
            "correo": cliente.cuenta_usuario.correo_electronico if cliente.cuenta_usuario else None,
            "foto": foto_url,
        },
    }

# ---------------------------------------------------------------------------
# GET /cliente/{cliente_id}/membresia
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}/membresia")
def obtener_membresia_cliente(cliente_id: str, db: Session = Depends(get_db)):
    cliente = (
        db.query(Cliente)
        .options(joinedload(Cliente.membresia_subscripcion))
        .filter(Cliente.id == cliente_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    membresia = cliente.membresia_subscripcion
    if not membresia:
        return {"mensaje": "El cliente no tiene membresía activa."}

    return {
        "id": str(membresia.id),
        "nombre": membresia.nombre,
        "duracion_dias": membresia.duracion,
        "precio": float(membresia.precio),
        "descripcion": membresia.descripcion,
        "beneficios": membresia.beneficios,
    }

# ---------------------------------------------------------------------------
# POST /cliente/{cliente_id}/direccion
# ---------------------------------------------------------------------------
@router.post("/{cliente_id}/direccion")
def crear_direccion(
    cliente_id: str,
    nombre: str = Form(...),
    latitud: float = Form(...),
    longitud: float = Form(...),
    referencia: str = Form(None),
    es_principal: bool = Form(False),
    db: Session = Depends(get_db),
):
    try:
        print(f"🔥 Recibiendo dirección para cliente {cliente_id}")
        print(f"   Nombre: {nombre}")
        print(f"   Lat/Lng: {latitud}, {longitud}")
        print(f"   Es principal: {es_principal}")
        
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado.")
        
        print(f"✅ Cliente encontrado: {cliente.nombre}")
        
        if es_principal:
            print("🔄 Desmarcando otras direcciones principales...")
            db.query(Direccion).filter(
                Direccion.cliente_id == cliente_id
            ).update({"es_principal": False})
            db.flush()
        
        direccion_id = keygen.generate_uint64_key()
        print(f"🆔 ID generado: {direccion_id}")
        
        direccion = Direccion(
            id=direccion_id,
            cliente_id=cliente_id,
            nombre=nombre,
            latitud=latitud,
            longitud=longitud,
            referencia=referencia if referencia else "",
            es_principal=es_principal,
            estado_registro="A",
        )
        
        print("💾 Agregando dirección a la sesión...")
        db.add(direccion)
        
        print("🔄 Haciendo flush...")
        db.flush()
        
        print("✅ Haciendo commit...")
        db.commit()
        
        print("🔄 Refrescando objeto...")
        db.refresh(direccion)
        
        print(f"✅ Dirección guardada exitosamente: {direccion.id}")
        
        return {
            "mensaje": "Dirección registrada correctamente.",
            "direccion": {
                "id": str(direccion.id),
                "nombre": direccion.nombre,
                "latitud": float(direccion.latitud),
                "longitud": float(direccion.longitud),
                "referencia": direccion.referencia,
                "es_principal": bool(direccion.es_principal),
            },
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"❌ ERROR al crear dirección: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error al guardar dirección: {str(e)}"
        )

# ---------------------------------------------------------------------------
# GET /cliente/{cliente_id}/direcciones
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}/direcciones")
def listar_direcciones(
    cliente_id: str,
    db: Session = Depends(get_db),
):
    print(f"🗺 Listando direcciones para cliente: {cliente_id}")
    
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    direcciones = (
        db.query(Direccion)
        .filter(Direccion.cliente_id == cliente_id, Direccion.estado_registro == "A")
        .order_by(Direccion.es_principal.desc())
        .all()
    )
    
    resultado = [
        {
            "id": str(d.id),
            "nombre": d.nombre,
            "latitud": float(d.latitud),
            "longitud": float(d.longitud),
            "referencia": d.referencia,
            "es_principal": bool(d.es_principal),
        }
        for d in direcciones
    ]
    
    print(f"📤 Direcciones encontradas: {len(resultado)}")
    
    return {
        "total": len(resultado),
        "direcciones": resultado
    }
# ---------------------------------------------------------------------------
# GET /cliente/{cliente_id}/membresia
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}/membresia")
def obtener_membresia_cliente(cliente_id: str, db: Session = Depends(get_db)):
    cliente = (
        db.query(Cliente)
        .options(joinedload(Cliente.membresia_subscripcion))
        .filter(Cliente.id == cliente_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    membresia = cliente.membresia_subscripcion
    if not membresia:
        return {"mensaje": "El cliente no tiene membresía activa."}

    return {
        "id": str(membresia.id),
        "nombre": membresia.nombre,
        "duracion_dias": membresia.duracion,
        "precio": float(membresia.precio),
        "descripcion": membresia.descripcion,
        "beneficios": membresia.beneficios,
    }

# ---------------------------------------------------------------------------
# POST /cliente/{cliente_id}/direccion
# ---------------------------------------------------------------------------
@router.post("/{cliente_id}/direccion")
def crear_direccion(
    cliente_id: str,
    nombre: str = Form(...),
    latitud: float = Form(...),
    longitud: float = Form(...),
    referencia: str = Form(None),
    es_principal: bool = Form(False),
    db: Session = Depends(get_db),
):
    try:
        print(f"🔥 Recibiendo dirección para cliente {cliente_id}")
        print(f"   Nombre: {nombre}")
        print(f"   Lat/Lng: {latitud}, {longitud}")
        print(f"   Es principal: {es_principal}")
        
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado.")
        
        print(f"✅ Cliente encontrado: {cliente.nombre}")
        
        if es_principal:
            print("🔄 Desmarcando otras direcciones principales...")
            db.query(Direccion).filter(
                Direccion.cliente_id == cliente_id
            ).update({"es_principal": False})
            db.flush()
        
        direccion_id = keygen.generate_uint64_key()
        print(f"🆔 ID generado: {direccion_id}")
        
        direccion = Direccion(
            id=direccion_id,
            cliente_id=cliente_id,
            nombre=nombre,
            latitud=latitud,
            longitud=longitud,
            referencia=referencia if referencia else "",
            es_principal=es_principal,
            estado_registro="A",
        )
        
        print("💾 Agregando dirección a la sesión...")
        db.add(direccion)
        
        print("🔄 Haciendo flush...")
        db.flush()
        
        print("✅ Haciendo commit...")
        db.commit()
        
        print("🔄 Refrescando objeto...")
        db.refresh(direccion)
        
        print(f"✅ Dirección guardada exitosamente: {direccion.id}")
        
        return {
            "mensaje": "Dirección registrada correctamente.",
            "direccion": {
                "id": str(direccion.id),
                "nombre": direccion.nombre,
                "latitud": float(direccion.latitud),
                "longitud": float(direccion.longitud),
                "referencia": direccion.referencia,
                "es_principal": bool(direccion.es_principal),
            },
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"❌ ERROR al crear dirección: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error al guardar dirección: {str(e)}"
        )

# ---------------------------------------------------------------------------
# GET /cliente/{cliente_id}/direcciones
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}/direcciones")
def listar_direcciones(
    cliente_id: str,
    db: Session = Depends(get_db),
):
    print(f"🗺 Listando direcciones para cliente: {cliente_id}")
    
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    direcciones = (
        db.query(Direccion)
        .filter(Direccion.cliente_id == cliente_id, Direccion.estado_registro == "A")
        .order_by(Direccion.es_principal.desc())
        .all()
    )
    
    resultado = [
        {
            "id": str(d.id),
            "nombre": d.nombre,
            "latitud": float(d.latitud),
            "longitud": float(d.longitud),
            "referencia": d.referencia,
            "es_principal": bool(d.es_principal),
        }
        for d in direcciones
    ]
    
    print(f"📤 Direcciones encontradas: {len(resultado)}")
    
    return {
        "total": len(resultado),
        "direcciones": resultado
    }

# ---------------------------------------------------------------------------
# PUT /cliente/direccion/{direccion_id}
# ---------------------------------------------------------------------------
@router.put("/direccion/{direccion_id}")
def actualizar_direccion(
    direccion_id: str,
    nombre: str = Form(None),
    latitud: float = Form(None),
    longitud: float = Form(None),
    referencia: str = Form(None),
    es_principal: bool = Form(None),
    db: Session = Depends(get_db),
):
    direccion = db.query(Direccion).filter(
        Direccion.id == direccion_id, 
        Direccion.estado_registro == "A"
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada o inactiva.")
    
    if nombre:
        direccion.nombre = nombre
    if referencia is not None:  # ✅ Permitir cadena vacía
        direccion.referencia = referencia
    if latitud is not None:
        direccion.latitud = latitud
    if longitud is not None:
        direccion.longitud = longitud
    
    if es_principal is not None:
        if es_principal:
            # Desmarcar todas las demás del mismo cliente
            db.query(Direccion).filter(
                Direccion.cliente_id == direccion.cliente_id,
                Direccion.id != direccion_id
            ).update({"es_principal": False})
        direccion.es_principal = es_principal

    db.commit()
    db.refresh(direccion)
    
    return {
        "mensaje": "Dirección actualizada correctamente.",
        "direccion": {
            "id": str(direccion.id),
            "nombre": direccion.nombre,
            "latitud": float(direccion.latitud),
            "longitud": float(direccion.longitud),
            "referencia": direccion.referencia,
            "es_principal": bool(direccion.es_principal),
        },
    }

# ---------------------------------------------------------------------------
# DELETE /cliente/direccion/{direccion_id}
# ---------------------------------------------------------------------------
@router.delete("/direccion/{direccion_id}")
def eliminar_direccion(
    direccion_id: str,
    db: Session = Depends(get_db),
):
    direccion = db.query(Direccion).filter(
        Direccion.id == direccion_id, 
        Direccion.estado_registro == "A"
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada o ya inactiva.")
    
    cliente_id = direccion.cliente_id
    era_principal = direccion.es_principal
    
    # Marcar como inactiva
    direccion.estado_registro = "I"
    direccion.es_principal = False
    db.commit()
    
    # Si era principal, asignar otra
    if era_principal:
        nueva_principal = (
            db.query(Direccion)
            .filter(Direccion.cliente_id == cliente_id, Direccion.estado_registro == "A")
            .order_by(Direccion.id.desc())
            .first()
        )
        
        if nueva_principal:
            nueva_principal.es_principal = True
            db.commit()
            
            return {
                "mensaje": "Dirección eliminada. Se ha reasignado una nueva dirección principal.",
                "nueva_principal": {
                    "id": str(nueva_principal.id),
                    "nombre": nueva_principal.nombre,
                    "referencia": nueva_principal.referencia,
                    "latitud": float(nueva_principal.latitud),
                    "longitud": float(nueva_principal.longitud),
                },
            }
    
    return {"mensaje": "Dirección eliminada correctamente."}
@router.get("/{cliente_id}/notificaciones")
def listar_notificaciones(cliente_id: str, db: Session = Depends(get_db)):
    """
    Lista las notificaciones del cliente ordenadas por fecha.
    """
    notificaciones = (
        db.query(Notificacion)
        .filter(Notificacion.cliente_id == cliente_id)
        .order_by(Notificacion.fecha.desc())
        .all()
    )
    
    return [
        {
            "id": str(n.id),
            "titulo": n.titulo,
            "mensaje": n.mensaje,
            "fecha": n.fecha.isoformat(),
            "leido": bool(n.leido),
            "tipo": n.tipo,
            "referencia_id": n.referencia_id
        }
        for n in notificaciones
    ]