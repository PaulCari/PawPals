"""
RUTAS DE AUTENTICACIÓN Y GESTIÓN DE SESIONES
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from utils.db import get_db
from pydantic import BaseModel
from utils import keygen, security, token_manager
from models import CuentaUsuario, Cliente, UsuarioRol, Rol
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Autenticación"])

class RegisterRequest(BaseModel):
    nombre: str
    correo: str
    contrasena: str

class LoginRequest(BaseModel):
    correo: str
    contrasena: str

# ---------------------------------------------------------------------------
# POST /auth/register
# ---------------------------------------------------------------------------
@router.post("/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario con rol de cliente.
    """
    nombre = data.nombre
    correo = data.correo
    contrasena = data.contrasena

    print(f"🔥 Recibiendo registro: {nombre}, {correo}")

    # Verificar si el correo ya existe
    existe = db.query(CuentaUsuario).filter(
        CuentaUsuario.correo_electronico == correo
    ).first()
    
    if existe:
        print(f"❌ El correo {correo} ya está registrado")
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")

    try:
        # Generar ID único
        user_id = keygen.generate_uint64_key()
        print(f"✅ ID generado: {user_id}")

        # Hashear contraseña
        hashed_pass = security.get_password_hash(contrasena)
        print(f"✅ Contraseña hasheada")

        # Crear cuenta de usuario
        nueva_cuenta = CuentaUsuario(
            id=user_id,
            correo_electronico=correo,
            nombre_usuario=nombre,
            contrasena=hashed_pass,
            estado_registro="A",
        )
        db.add(nueva_cuenta)
        db.flush()
        print(f"✅ Cuenta de usuario creada")

        # ✅ BUSCAR ROL DE CLIENTE (id = 2)
        rol_cliente = db.query(Rol).filter(Rol.id == 2).first()
        if not rol_cliente:
            print(f"❌ ERROR: No existe el rol con id=2 (cliente)")
            raise HTTPException(status_code=500, detail="Rol de cliente no configurado en el sistema.")

        # Asignar rol de cliente (id = 2)
        usuario_rol = UsuarioRol(
            id=keygen.generate_uint64_key(),
            cuenta_usuario_id=user_id,
            rol_id=2,
            estado_registro="A",
        )
        db.add(usuario_rol)
        print(f"✅ Rol asignado")

        # Crear perfil de cliente
        nuevo_cliente = Cliente(
            id=keygen.generate_uint64_key(),
            cuenta_usuario_id=user_id,
            nombre=nombre,
            estado_registro="A",
        )
        db.add(nuevo_cliente)
        print(f"✅ Perfil de cliente creado")

        # Guardar todo
        db.commit()
        print(f"✅ Registro completado exitosamente")

        # Generar token
        token = token_manager.generar_token(user_id, 2)

        return {
            "mensaje": "Cuenta creada exitosamente.",
            "token": token,
            "usuario": {
                "id": str(user_id),
                "nombre": nombre,
                "correo": correo,
                "rol_id": 2,
            }
        }

    except Exception as e:
        db.rollback()
        print(f"❌ ERROR EN REGISTRO: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Error al crear la cuenta: {str(e)}"
        )

# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------
@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    correo = data.correo
    contrasena = data.contrasena

    usuario = db.query(CuentaUsuario).filter(
        CuentaUsuario.correo_electronico == correo
    ).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Correo no registrado.")
    
    if usuario.estado_registro != "A":
        raise HTTPException(status_code=403, detail="La cuenta no está activa.")
    
    if not security.verify_password(contrasena, usuario.contrasena):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta.")

    usuario_rol = db.query(UsuarioRol).filter(
        UsuarioRol.cuenta_usuario_id == usuario.id
    ).first()
    
    if not usuario_rol or usuario_rol.rol_id is None:
        raise HTTPException(status_code=400, detail="No se ha asignado un rol al usuario.")

    rol_id = usuario_rol.rol_id
    token = token_manager.generar_token(usuario.id, rol_id)

    usuario.ultimo_acceso = datetime.now()
    db.commit()

    return {
        "mensaje": "Inicio de sesión exitoso.",
        "token": token,
        "usuario": {
            "id": str(usuario.id),
            "nombre": usuario.nombre_usuario,
            "correo": usuario.correo_electronico,
            "rol_id": rol_id,
        },
    }

# ---------------------------------------------------------------------------
# POST /auth/logout
# ---------------------------------------------------------------------------
@router.post("/logout")
def logout_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado.")
    
    token = auth_header.split(" ")[1]
    
    try:
        token_manager.decodificar_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")
    
    return {"mensaje": "Sesión cerrada exitosamente."}