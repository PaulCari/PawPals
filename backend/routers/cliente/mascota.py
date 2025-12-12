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
    Consulta,
    Nutricionista,
    PlatoPersonal,
    PlatoCombinado
)
import os
from datetime import datetime


router = APIRouter(prefix="/cliente/mascotas", tags=["Mascotas del Cliente"])


# ---------------------------------------------------------------------------
# 🔥 FUNCIÓN AUXILIAR PARA CONSTRUIR URL COMPLETA
# ---------------------------------------------------------------------------
def construir_url_imagen(request: Request, ruta_local: str | None):
    """Construye URL completa para imágenes desde ruta local"""
    if not ruta_local:
        return None

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
            joinedload(RegistroMascota.alergia_mascota).joinedload(AlergiaMascota.alergia_especie),
            joinedload(RegistroMascota.condicion_salud),
            joinedload(RegistroMascota.receta_medica),
            joinedload(RegistroMascota.consulta).joinedload(Consulta.nutricionista),
            joinedload(RegistroMascota.plato_personal).joinedload(PlatoPersonal.plato_combinado)
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

    # -------------------------------
    # Alergias
    # -------------------------------
    alergias = [
        {
            "id": str(a.id),
            "alergia": a.alergia_especie.nombre if a.alergia_especie else "Desconocida",
            "severidad": a.severidad,
        }
        for a in mascota.alergia_mascota
    ]

    # -------------------------------
    # Condiciones de salud
    # -------------------------------
    condiciones = [
        {
            "id": str(c.id),
            "nombre": c.nombre,
            "fecha": c.fecha.isoformat() if c.fecha else None,
            "estado_registro": c.estado_registro,
        }
        for c in mascota.condicion_salud
    ]

    # -------------------------------
    # Recetas médicas
    # -------------------------------
    recetas = [
        {
            "id": str(r.id),
            "fecha": r.fecha.isoformat() if r.fecha else None,
            "archivo": r.archivo,
            "estado_registro": r.estado_registro,
        }
        for r in mascota.receta_medica
    ]

    # -------------------------------
    # Historial nutricional (consultas)
    # -------------------------------
    historial_consultas = []
    consultas_ordenadas = sorted(mascota.consulta, key=lambda x: x.fecha, reverse=True)

    for c in consultas_ordenadas:
        historial_consultas.append({
            "id": str(c.id),
            "fecha": c.fecha.isoformat(),
            "nutricionista": c.nutricionista.nombre if c.nutricionista else "Especialista",
            "diagnostico": c.observaciones,
            "plan_nutricional": c.recomendaciones
        })

    # -------------------------------
    # Menús personalizados (platos)
    # -------------------------------
    menus_asignados = []
    for pp in mascota.plato_personal:
        plato = pp.plato_combinado
        if plato:
            menus_asignados.append({
                "id": str(plato.id),
                "nombre": plato.nombre,
                "descripcion": plato.descripcion,
                "precio": float(plato.precio),
                "imagen": plato.imagen
            })

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
        "historial_nutricional": historial_consultas,
        "menus_personalizados": menus_asignados,
        "observaciones": mascota.observaciones,
    }


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
