"""
RUTAS DEL NUTRICIONISTA – REVISIÓN Y APROBACIÓN DE PEDIDOS
------------------------------------------------------------
Implementación completa de la lógica de negocio para nutricionistas.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body, Query
from sqlalchemy.orm import Session, joinedload
from models import Notificacion, RegistroMascota
from datetime import datetime
from utils import keygen, globals
from utils.db import get_db
from models import (
    PedidoEspecializado, Pedido, Cliente, RegistroMascota, 
    AlergiaMascota, CondicionSalud, PreferenciaAlimentaria, 
    DescripcionAlergias, RecetaMedica, Consulta, Nutricionista,
    PlatoCombinado, PlatoPersonal, Especie
)
from pydantic import BaseModel
from datetime import datetime
from typing import List 
from pydantic import BaseModel
import os

router = APIRouter(prefix="/nutricionista", tags=["Nutricionista"])

# --- Esquemas de Validación (Pydantic) ---
class RevisionSchema(BaseModel):
    observaciones: str
    recomendaciones: str
    aprobado: bool
class ItemMix(BaseModel):
    id: str
    cantidad: int # Por si quiere poner "2 porciones de pollo"

class CrearMixSchema(BaseModel):
    registro_mascota_id: str
    nombre_mix: str
    items: List[ItemMix]
    precio_total: float
    descripcion: str
# ---------------------------------------------------------------------------
# GET /nutricionista/items/buscar
# ---------------------------------------------------------------------------
@router.get("/items/buscar")
def buscar_items_para_dieta(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    """
    Busca productos (platos existentes o ingredientes base) por nombre.
    """
    items = (
        db.query(PlatoCombinado)
        .filter(
            PlatoCombinado.nombre.ilike(f"%{q}%"),
            PlatoCombinado.estado_registro == "A"
        )
        .limit(10)
        .all()
    )
    
    return [
        {
            "id": str(i.id),
            "nombre": i.nombre,
            "precio": float(i.precio),
            "categoria": i.categoria.nombre if i.categoria else "General",
            "imagen": i.imagen
        }
        for i in items
    ]

# ---------------------------------------------------------------------------
# POST /nutricionista/platos/mix
# ---------------------------------------------------------------------------
@router.post("/platos/mix")
def crear_plato_mix(data: CrearMixSchema, db: Session = Depends(get_db)):
    """
    Crea un plato personalizado compuesto por varios items seleccionados
    y notifica al cliente.
    """
    # 1. Crear el nuevo Plato Combinado (El Mix)
    mix_id = keygen.generate_uint64_key()
    
    nuevo_plato = PlatoCombinado(
        id=mix_id,
        nombre=data.nombre_mix,
        descripcion=data.descripcion, # Ej: "Mix de Pollo + Hígado + Arroz"
        precio=data.precio_total,
        incluye_plato=1,
        es_crudo=1,
        publicado=0, # Oculto al público general
        creado_nutricionista=1,
        estado_registro="A"
    )
    db.add(nuevo_plato)
    db.flush()

    # 2. Vincular a la Mascota (PlatoPersonal)
    link = PlatoPersonal(
        id=keygen.generate_uint64_key(),
        plato_combinado_id=mix_id,
        registro_mascota_id=data.registro_mascota_id
    )
    db.add(link)

    # 3. ✅ CREAR NOTIFICACIÓN AUTOMÁTICA
    # Primero buscamos la mascota para obtener el ID del dueño (cliente_id)
    mascota = db.query(RegistroMascota).filter(RegistroMascota.id == data.registro_mascota_id).first()
    
    if mascota:
        nueva_notificacion = Notificacion(
            id=keygen.generate_uint64_key(),
            cliente_id=mascota.cliente_id,
            titulo="¡Dieta Lista! 🥗",
            mensaje=f"El menú personalizado para {mascota.nombre} está listo. Toca aquí para ver y comprar.",
            fecha=datetime.now(),
            leido=0, # 0 = No leído
            tipo="DIETA_LISTA", # Tipo de acción para la App
            referencia_id=str(mascota.id) # Guardamos el ID de la mascota para redirigir al perfil
        )
        db.add(nueva_notificacion)

    # Guardar todo (Plato, Link y Notificación)
    db.commit()

    return {"mensaje": "Mix personalizado creado y notificación enviada.", "plato_id": str(mix_id)}

# ---------------------------------------------------------------------------
# GET /nutricionista/pedidos/pendientes
# ---------------------------------------------------------------------------
@router.get("/pedidos/pendientes")
def listar_pedidos_pendientes(db: Session = Depends(get_db)):
    """
    Lista todos los pedidos especializados que requieren atención.
    Filtra pedidos activos cuyo estado en la tabla Pedido sea 'pendiente'.
    """
    pedidos = (
        db.query(PedidoEspecializado)
        .join(Pedido)
        .options(
            joinedload(PedidoEspecializado.pedido).joinedload(Pedido.cliente),
            joinedload(PedidoEspecializado.registro_mascota).joinedload(RegistroMascota.especie),
        )
        .filter(PedidoEspecializado.estado_registro == "A")
        .filter(Pedido.estado == "pendiente") 
        .order_by(Pedido.fecha.desc())
        .all()
    )

    resultado = []
    for p in pedidos:
        cliente = p.pedido.cliente
        mascota = p.registro_mascota
        
        resultado.append({
            "id": str(p.id), # ID de la solicitud (PedidoEspecializado)
            "pedido_id": str(p.pedido_id),
            "fecha": p.pedido.fecha.isoformat(),
            "cliente": {
                "nombre": cliente.nombre if cliente else "Desconocido",
                "telefono": cliente.telefono if cliente else "",
                "foto": cliente.foto
            },
            "mascota": {
                "nombre": mascota.nombre if mascota else "Desconocido",
                "especie": mascota.especie.nombre if mascota and mascota.especie else "",
                "raza": mascota.raza if mascota else "",
                "foto": mascota.foto
            },
            "objetivo": p.objetivo_dieta,
            "frecuencia": p.frecuencia_cantidad,
            "consulta_requerida": bool(p.consulta_nutricionista)
        })

    return {"total": len(resultado), "solicitudes": resultado}

@router.get("/pacientes")
def listar_pacientes_con_historial(db: Session = Depends(get_db)):
    """
    Lista las mascotas que ya han tenido al menos una consulta con nutricionista.
    """
    # Buscamos mascotas que tengan relación con la tabla 'consulta'
    pacientes = (
        db.query(RegistroMascota)
        .join(Consulta) # Esto filtra solo los que tienen consultas
        .options(
            joinedload(RegistroMascota.cliente),
            joinedload(RegistroMascota.especie),
            joinedload(RegistroMascota.consulta) # Cargamos consultas para sacar la fecha de la última
        )
        .distinct() # Evita duplicados si tiene muchas consultas
        .all()
    )

    resultado = []
    for p in pacientes:
        # Obtener la fecha de la última consulta
        ultima_consulta = max(p.consulta, key=lambda x: x.fecha) if p.consulta else None
        
        resultado.append({
            "id": str(p.id),
            "nombre": p.nombre,
            "especie": p.especie.nombre if p.especie else "N/A",
            "raza": p.raza,
            "foto": p.foto,
            "cliente": p.cliente.nombre if p.cliente else "Desconocido",
            "total_consultas": len(p.consulta),
            "ultima_atencion": ultima_consulta.fecha.isoformat() if ultima_consulta else None
        })

    return {"total": len(resultado), "pacientes": resultado}

# ---------------------------------------------------------------------------
# GET /nutricionista/pedidos/{pedido_id}
# ---------------------------------------------------------------------------
@router.get("/pedidos/{pedido_id}")
def obtener_detalle_pedido_especializado(pedido_id: str, db: Session = Depends(get_db)):
    """
    Devuelve el expediente clínico completo de la mascota vinculada a la solicitud.
    Recibe el ID de la tabla `pedido_especializado`.
    """
    # 1. Buscar la solicitud especializada
    pedido_esp = (
        db.query(PedidoEspecializado)
        .options(
            joinedload(PedidoEspecializado.pedido).joinedload(Pedido.cliente),
            joinedload(PedidoEspecializado.registro_mascota).joinedload(RegistroMascota.especie),
            joinedload(PedidoEspecializado.receta_medica),
        )
        .filter(PedidoEspecializado.id == pedido_id)
        .first()
    )

    if not pedido_esp:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")

    mascota = pedido_esp.registro_mascota
    pedido = pedido_esp.pedido

    # 2. Cargar historial clínico detallado de la mascota
    alergias = db.query(AlergiaMascota).options(joinedload(AlergiaMascota.alergia_especie)).filter(AlergiaMascota.registro_mascota_id == mascota.id).all()
    condiciones = db.query(CondicionSalud).filter(CondicionSalud.registro_mascota_id == mascota.id).all()
    preferencias = db.query(PreferenciaAlimentaria).filter(PreferenciaAlimentaria.registro_mascota_id == mascota.id).all()
    desc_alergias = db.query(DescripcionAlergias).filter(DescripcionAlergias.registro_mascota_id == mascota.id).order_by(DescripcionAlergias.fecha.desc()).first()

    # 3. Construir respuesta estructurada
    return {
        "id": str(pedido_esp.id),
        "pedido": {
            "id": str(pedido.id),
            "fecha": pedido.fecha.isoformat(),
            "estado": pedido.estado,
            "cliente": {
                "id": str(pedido.cliente.id),
                "nombre": pedido.cliente.nombre,
                "telefono": pedido.cliente.telefono,
            }
        },
        "pedido_especializado": {
            "objetivo_dieta": pedido_esp.objetivo_dieta,
            "frecuencia_cantidad": pedido_esp.frecuencia_cantidad,
            "indicaciones": pedido_esp.indicaciones_adicionales,
            "archivo_adicional": pedido_esp.archivo_adicional
        },
        "mascota": {
            "id": str(mascota.id),
            "nombre": mascota.nombre,
            "especie": mascota.especie.nombre if mascota.especie else "",
            "raza": mascota.raza,
            "edad": mascota.edad,
            "peso": float(mascota.peso) if mascota.peso else 0,
            "sexo": mascota.sexo,
            "foto": mascota.foto
        },
        "detalles_nutricionales": {
            "alergias": [
                {"id": str(a.id), "alergia": a.alergia_especie.nombre, "severidad": a.severidad} 
                for a in alergias if a.alergia_especie
            ],
            "descripcion_alergias": desc_alergias.descripcion if desc_alergias else None,
            "condiciones_salud": [c.nombre for c in condiciones],
            "preferencias": [p.nombre for p in preferencias]
        },
        "archivos": {
            "recetas": [r.archivo for r in pedido_esp.receta_medica]
        }
    }


# ---------------------------------------------------------------------------
# POST /nutricionista/pedidos/{pedido_id}/revisar
# ---------------------------------------------------------------------------
@router.post("/pedidos/{pedido_id}/revisar")
def revisar_pedido_especializado(
    pedido_id: str,
    revision: RevisionSchema,
    db: Session = Depends(get_db)
):
    """
    Guarda la revisión profesional:
    1. Crea registro en 'Consulta'.
    2. Actualiza el estado del pedido a 'atendido' (si se aprueba) u 'observado'.
    """
    # Buscar solicitud
    pedido_esp = db.query(PedidoEspecializado).filter(PedidoEspecializado.id == pedido_id).first()
    if not pedido_esp:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")

    # Asignar al primer nutricionista disponible (en producción usaríamos el token del usuario logueado)
    nutri = db.query(Nutricionista).first()
    nutri_id = nutri.id if nutri else None

    # 1. Crear Consulta Médica
    nueva_consulta = Consulta(
        id=keygen.generate_uint64_key(),
        registro_mascota_id=pedido_esp.registro_mascota_id,
        nutricionista_id=nutri_id,
        fecha=datetime.now(),
        observaciones=revision.observaciones,
        recomendaciones=revision.recomendaciones,
        estado_registro="A"
    )
    db.add(nueva_consulta)

    # 2. Actualizar estado del pedido
    pedido = db.query(Pedido).filter(Pedido.id == pedido_esp.pedido_id).first()
    if pedido:
        pedido.estado = "atendido" if revision.aprobado else "observado"

    db.commit()

    return {
        "mensaje": "Revisión guardada exitosamente.",
        "consulta_id": str(nueva_consulta.id),
        "nuevo_estado_pedido": pedido.estado
    }


# ---------------------------------------------------------------------------
# POST /nutricionista/pedidos/{pedido_id}/receta
# ---------------------------------------------------------------------------
@router.post("/pedidos/{pedido_id}/receta")
def subir_receta_medica(
    pedido_id: str,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Sube un archivo de receta médica y lo vincula al pedido especializado.
    """
    pedido_esp = db.query(PedidoEspecializado).filter(PedidoEspecializado.id == pedido_id).first()
    if not pedido_esp:
        raise HTTPException(status_code=404, detail="Pedido especializado no encontrado.")

    # Guardar archivo
    uploads_dir = os.path.join("static", "uploads", "recetas")
    os.makedirs(uploads_dir, exist_ok=True)
    
    filename = f"receta_{pedido_id}_{archivo.filename}"
    file_path = os.path.join(uploads_dir, filename)
    
    with open(file_path, "wb") as f:
        f.write(archivo.file.read())

    # Crear registro en BD
    nueva_receta = RecetaMedica(
        id=keygen.generate_uint64_key(),
        registro_mascota_id=pedido_esp.registro_mascota_id,
        pedido_especializado_id=pedido_esp.id,
        fecha=datetime.now(),
        archivo=file_path,
        estado_registro="A"
    )
    db.add(nueva_receta)
    db.commit()

    return {"mensaje": "Receta subida correctamente.", "archivo": file_path}


# ---------------------------------------------------------------------------
# POST /nutricionista/platos/personalizados
# ---------------------------------------------------------------------------
@router.post("/platos/personalizados")
def crear_plato_personalizado(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    especie_id: str = Form(...),
    registro_mascota_id: str = Form(..., description="ID de la mascota específica"),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Crea un plato exclusivo para una mascota.
    """
    # 1. Crear el plato combinado (oculto al público)
    plato_id = keygen.generate_uint64_key()
    
    imagen_path = None
    if imagen:
        uploads_dir = os.path.join("static", "uploads", "platos_personalizados")
        os.makedirs(uploads_dir, exist_ok=True)
        imagen_path = os.path.join(uploads_dir, f"plato_{plato_id}_{imagen.filename}")
        with open(imagen_path, "wb") as f:
            f.write(imagen.file.read())

    nuevo_plato = PlatoCombinado(
        id=plato_id,
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        especie_id=especie_id,
        imagen=imagen_path,
        incluye_plato=1,
        es_crudo=1,
        publicado=0, # Oculto en el menú general
        creado_nutricionista=1, # Flag importante
        estado_registro="A"
    )
    db.add(nuevo_plato)
    db.flush()

    # 2. Vincularlo específicamente a la mascota
    link = PlatoPersonal(
        id=keygen.generate_uint64_key(),
        plato_combinado_id=plato_id,
        registro_mascota_id=registro_mascota_id
    )
    db.add(link)
    db.commit()

    return {
        "mensaje": "Plato personalizado creado.",
        "plato_id": str(plato_id),
        "nombre": nombre
    }


# ---------------------------------------------------------------------------
# GET /nutricionista/platos/personalizados/{mascota_id}
# ---------------------------------------------------------------------------
@router.get("/platos/personalizados/{mascota_id}")
def listar_platos_personalizados(mascota_id: str, db: Session = Depends(get_db)):
    """
    Lista los platos únicos creados para una mascota.
    """
    platos_personales = (
        db.query(PlatoPersonal)
        .options(joinedload(PlatoPersonal.plato_combinado))
        .filter(PlatoPersonal.registro_mascota_id == mascota_id)
        .all()
    )

    resultado = []
    for pp in platos_personales:
        plato = pp.plato_combinado
        resultado.append({
            "id": str(plato.id),
            "nombre": plato.nombre,
            "descripcion": plato.descripcion,
            "precio": float(plato.precio),
            "imagen": plato.imagen
        })

    return {"total": len(resultado), "platos": resultado}


# ---------------------------------------------------------------------------
# GET /nutricionista/historial
# ---------------------------------------------------------------------------
@router.get("/historial")
def listar_historial_revisiones(db: Session = Depends(get_db)):
    """
    Lista el historial de consultas realizadas por los nutricionistas.
    """
    consultas = (
        db.query(Consulta)
        .options(
            joinedload(Consulta.registro_mascota).joinedload(RegistroMascota.cliente),
            joinedload(Consulta.nutricionista)
        )
        .order_by(Consulta.fecha.desc())
        .all()
    )

    resultado = []
    for c in consultas:
        mascota = c.registro_mascota
        cliente = mascota.cliente if mascota else None
        
        resultado.append({
            "consulta_id": str(c.id),
            "fecha": c.fecha.isoformat(),
            "mascota": mascota.nombre if mascota else "Desconocido",
            "cliente": cliente.nombre if cliente else "Desconocido",
            "observaciones": c.observaciones,
            "nutricionista": c.nutricionista.nombre if c.nutricionista else "Sin asignar"
        })

    return {"total": len(resultado), "historial": resultado}