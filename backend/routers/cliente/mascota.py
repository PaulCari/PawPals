"""
RUTAS DEL CLIENTE – MASCOTAS
-----------------------------
Permite al cliente administrar el registro de sus mascotas y sus datos
vinculados: especie, alergias, condiciones de salud, recetas médicas, etc.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, Request
from utils import globals, keygen
from utils.db import get_db
from sqlalchemy.orm import Session, joinedload
from models import (
    Cliente,
    Especie,
    RegistroMascota,
    PedidoEspecializado,
    AlergiaMascota,
    AlergiaEspecie,
    CondicionSalud,
    RecetaMedica,
)
import os
from datetime import datetime

router = APIRouter(prefix="/cliente/mascotas", tags=["Mascotas del Cliente"])


# ---------------------------------------------------------------------------
#  FUNCIÓN AUXILIAR PARA CONSTRUIR URL COMPLETA
# ---------------------------------------------------------------------------
def construir_url_imagen(request: Request, ruta_local: str | None):
    """Construye URL completa para imágenes desde ruta local"""
    if not ruta_local:
        return None

    # Remover 'static/' si está al inicio
    ruta_limpia = ruta_local.replace("static/", "").replace("static\\", "")

    base_url = str(request.base_url).rstrip("/")

    return f"{base_url}/static/{ruta_limpia}"


# ---------------------------------------------------------------------------
# GET /cliente/mascotas/{cliente_id}
# ---------------------------------------------------------------------------
@router.get("/{cliente_id}")
def listar_mascotas_cliente(
    cliente_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    mascotas = (
        db.query(RegistroMascota)
        .join(Especie)
        .filter(
            RegistroMascota.cliente_id == cliente_id,
            RegistroMascota.estado_registro == "A",
        )
        .all()
    )

    if not mascotas:
        return {"mensaje": "El cliente no tiene mascotas registradas."}

    resultado = []

    for m in mascotas:
        especie_nombre = m.especie.nombre if m.especie else "Sin especie"

        # 🔥 Foto por defecto según especie
        if not m.foto:
            if "perro" in especie_nombre.lower():
                ruta_foto = "static/imagenes/cliente/perro.png"
            elif "gato" in especie_nombre.lower():
                ruta_foto = "static/imagenes/cliente/gato.png"
            else:
                ruta_foto = "static/imagenes/cliente/user.png"
        else:
            ruta_foto = m.foto

        foto_url = construir_url_imagen(request, ruta_foto)

        resultado.append(
            {
                "id": str(m.id),
                "nombre": m.nombre,
                "especie": especie_nombre,
                "raza": m.raza,
                "edad": m.edad,
                "peso": float(m.peso) if m.peso else None,
                "foto": foto_url,
            }
        )

    return {"total": len(resultado), "mascotas": resultado}


# ---------------------------------------------------------------------------
# POST /cliente/mascotas/{cliente_id}
# ---------------------------------------------------------------------------
@router.post("/{cliente_id}")
def registrar_mascota(
    cliente_id: str,
    request: Request,
    nombre: str = Form(...),
    especie_id: str = Form(...),
    raza: str = Form(...),
    edad: int = Form(...),
    sexo: str = Form(..., description="Sexo: M (macho) / H (hembra)"),
    db: Session = Depends(get_db),
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    especie = db.query(Especie).filter(Especie.id == especie_id).first()

    if not especie:
        raise HTTPException(status_code=404, detail="Especie no encontrada.")

    if sexo not in ["M", "H"]:
        raise HTTPException(
            status_code=400, detail="El sexo debe ser 'M' (macho) o 'H' (hembra)."
        )

    mascota_id = keygen.generate_uint64_key()
    especie_nombre = especie.nombre.lower()

    # 🔥 Foto por defecto según especie
    if "perro" in especie_nombre:
        foto_path = "static/imagenes/cliente/perro.png"
    elif "gato" in especie_nombre:
        foto_path = "static/imagenes/cliente/gato.png"
    else:
        foto_path = "static/imagenes/cliente/user.png"

    mascota = RegistroMascota(
        id=mascota_id,
        cliente_id=cliente_id,
        nombre=nombre,
        especie_id=especie_id,
        raza=raza,
        edad=edad,
        sexo=sexo,
        cambio_edad=datetime.now().date(),
        foto=foto_path,
        estado_registro="A",
    )

    db.add(mascota)
    db.commit()

    foto_url = construir_url_imagen(request, mascota.foto)

    return {
        "mensaje": "Mascota registrada exitosamente.",
        "mascota": {
            "id": str(mascota.id),
            "nombre": mascota.nombre,
            "especie": especie.nombre,
            "raza": mascota.raza,
            "edad": mascota.edad,
            "sexo": mascota.sexo,
            "foto": foto_url,
        },
    }


# ---------------------------------------------------------------------------
# GET /cliente/mascotas/detalle/{mascota_id}
# ---------------------------------------------------------------------------
@router.get("/detalle/{mascota_id}")
def obtener_detalle_mascota(
    mascota_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    mascota = (
        db.query(RegistroMascota)
        .options(
            joinedload(RegistroMascota.especie),
            joinedload(RegistroMascota.alergia_mascota),
            joinedload(RegistroMascota.condicion_salud),
            joinedload(RegistroMascota.receta_medica),
        )
        .filter(RegistroMascota.id == mascota_id, RegistroMascota.estado_registro == "A")
        .first()
    )

    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota no encontrada o inactiva.")

    especie_nombre = mascota.especie.nombre if mascota.especie else "Sin especie"

    if not mascota.foto:
        if "perro" in especie_nombre.lower():
            ruta_foto = "static/imagenes/cliente/perro.png"
        elif "gato" in especie_nombre.lower():
            ruta_foto = "static/imagenes/cliente/gato.png"
        else:
            ruta_foto = "static/imagenes/cliente/user.png"
    else:
        ruta_foto = mascota.foto

    foto_url = construir_url_imagen(request, ruta_foto)

    alergias = [
        {
            "id": str(a.id),
            "alergia": a.alergia_especie.nombre if a.alergia_especie else None,
            "severidad": a.severidad,
        }
        for a in mascota.alergia_mascota
    ]

    condiciones = [
        {
            "id": str(c.id),
            "nombre": c.nombre,
            "fecha": c.fecha.isoformat() if c.fecha else None,
            "estado_registro": c.estado_registro,
        }
        for c in mascota.condicion_salud
    ]

    recetas = [
        {
            "id": str(r.id),
            "fecha": r.fecha.isoformat() if r.fecha else None,
            "archivo": r.archivo,
            "estado_registro": r.estado_registro,
        }
        for r in mascota.receta_medica
    ]

    return {
        "id": str(mascota.id),
        "nombre": mascota.nombre,
        "especie": especie_nombre,
        "raza": mascota.raza,
        "edad": mascota.edad,
        "peso": float(mascota.peso) if mascota.peso else None,
        "foto": foto_url,
        "alergias": alergias,
        "condiciones_salud": condiciones,
        "recetas_medicas": recetas,
        "observaciones": mascota.observaciones,
    }

# ---------------------------------------------------------------------------
# PUT /cliente/mascotas/{mascota_id} - 🔥 ENDPOINT ACTUALIZADO
# ---------------------------------------------------------------------------
@router.put("/{mascota_id}")
def actualizar_mascota(
    mascota_id: str,
    request: Request,
    nombre: Optional[str] = Form(None),
    edad: Optional[int] = Form(None),
    peso: Optional[float] = Form(None),
    raza: Optional[str] = Form(None),
    observaciones: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None),  # 🔥 FOTO OPCIONAL
    db: Session = Depends(get_db),
):
    """
    Actualiza los datos de una mascota existente.
    Permite actualizar: nombre, edad, peso, raza, observaciones y foto.
    """
    try:
        print(f"📥 Recibiendo actualización para mascota: {mascota_id}")
        
        # Buscar la mascota
        mascota = (
            db.query(RegistroMascota)
            .filter(RegistroMascota.id == mascota_id)
            .first()
        )
        
        if not mascota:
            raise HTTPException(status_code=404, detail="Mascota no encontrada.")
        
        # Actualizar campos si se proporcionan
        if nombre:
            mascota.nombre = nombre
        
        if edad is not None:
            mascota.edad = edad
        
        if peso is not None:
            mascota.peso = peso
        
        if raza:
            mascota.raza = raza
        
        if observaciones is not None:
            mascota.observaciones = observaciones
        
        # 🔥 MANEJO DE FOTO
        if foto:
            print(f"📸 Procesando nueva foto: {foto.filename}")
            
            uploads_dir = globals.MASCOTA
            os.makedirs(uploads_dir, exist_ok=True)
            
            file_extension = os.path.splitext(foto.filename)[1]
            filename = f"pet_{mascota_id}_{int(datetime.now().timestamp())}{file_extension}"
            file_path = os.path.join(uploads_dir, filename)
            
            with open(file_path, "wb") as f:
                f.write(foto.file.read())
            
            mascota.foto = file_path
        
        # Guardar cambios
        db.commit()
        db.refresh(mascota)
        
        foto_url = construir_url_imagen(request, mascota.foto)

        return {
            "mensaje": "Mascota actualizada correctamente.",
            "mascota": {
                "id": str(mascota.id),
                "nombre": mascota.nombre,
                "edad": mascota.edad,
                "peso": float(mascota.peso) if mascota.peso else None,
                "raza": mascota.raza,
                "observaciones": mascota.observaciones,
                "foto": foto_url,
            },
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"❌ Error al actualizar mascota: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar mascota: {str(e)}"
        )

# ---------------------------------------------------------------------------
# DELETE /cliente/mascotas/{mascota_id}
# ---------------------------------------------------------------------------
@router.delete("/{mascota_id}")
def eliminar_mascota(
    mascota_id: str,
    db: Session = Depends(get_db),
):
    mascota = (
        db.query(RegistroMascota)
        .filter(RegistroMascota.id == mascota_id)
        .first()
    )

    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota no encontrada.")

    mascota.estado_registro = "I"
    db.commit()

    return {"mensaje": "Mascota eliminada correctamente.", "mascota_id": str(mascota_id)}