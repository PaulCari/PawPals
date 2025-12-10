# backend/seed_data.py (VERSIÓN FINAL)

from utils.db import SessionLocal
from models import Categoria, Especie, PlatoCombinado, Rol 
from utils import keygen

def seed_database():
    db = SessionLocal()
    try:
        from models import Base
        from utils.db import engine
        Base.metadata.create_all(bind=engine)

        print("👤 Insertando roles...")
        roles = [
            {'id': 1, 'nombre': 'admin', 'desc': 'Administrador del sistema'},
            {'id': 2, 'nombre': 'cliente', 'desc': 'Usuario cliente de la aplicación'},
            {'id': 3, 'nombre': 'nutricionista', 'desc': 'Profesional de nutrición animal'},
            {'id': 4, 'nombre': 'repartidor', 'desc': 'Encargado de las entregas'}
        ]
        
        for r_data in roles:
            existing = db.query(Rol).filter(Rol.id == r_data['id']).first()
            if not existing:
                rol = Rol(
                    id=r_data['id'],  # <-- Usamos el ID fijo del diccionario
                    nombre=r_data['nombre'], 
                    estado_registro='A', 
                    descripcion=r_data['desc']
                )
                db.add(rol)
                print(f"  ✅ Rol '{rol.nombre}' agregado con ID {rol.id}")
            else:
                 print(f"  ⚠️  Rol '{existing.nombre}' ya existe con ID {existing.id}")

        db.commit()

        print("📂 Insertando categorías...")
        nombres_categorias = ["Platos caseros", "Ensaladas", "Postres", "Bebidas"]
        ids_categorias = {}
        for nombre_cat in nombres_categorias:
            existing = db.query(Categoria).filter(Categoria.nombre == nombre_cat).first()
            if not existing:
                nueva_cat = Categoria(id=keygen.generate_uint64_key(), nombre=nombre_cat, estado_registro="A")
                db.add(nueva_cat)
                db.flush()
                ids_categorias[nombre_cat] = nueva_cat.id
            else:
                ids_categorias[nombre_cat] = existing.id
        db.commit()

        print("\n🐾 Insertando especies...")
        nombres_especies = ["Perro", "Gato"]
        ids_especies = {}
        for nombre_esp in nombres_especies:
            existing = db.query(Especie).filter(Especie.nombre == nombre_esp).first()
            if not existing:
                nueva_esp = Especie(id=keygen.generate_uint64_key(), nombre=nombre_esp, estado_registro="A")
                db.add(nueva_esp)
                db.flush()
                ids_especies[nombre_esp] = nueva_esp.id
            else:
                ids_especies[nombre_esp] = existing.id
        db.commit()
        
        print("\n🍽️  Insertando platos de ejemplo...")
        platos = [
            { "nombre": "BARF Pollo Balanceado", "precio": 28.00, "categoria": "Platos caseros", "especie": "Perro", "descripcion": "Dieta BARF a base de pollo con vísceras...", "imagen": "barf_pollo.png" },
            { "nombre": "BARF Ternera Premium", "precio": 32.00, "categoria": "Platos caseros", "especie": "Perro", "descripcion": "Dieta BARF de ternera con corazón de res...", "imagen": "barf_ternera.png" },
            { "nombre": "BARF Pato para Gato", "precio": 30.00, "categoria": "Platos caseros", "especie": "Gato", "descripcion": "Dieta BARF especial para gatos con carne de pato.", "imagen": "barf_pato_gato.png" }
        ]
        
        db.query(PlatoCombinado).delete()
        db.commit()

        for plato_data in platos:
            plato = PlatoCombinado(
                id=keygen.generate_uint64_key(),
                nombre=plato_data["nombre"],
                precio=plato_data["precio"],
                categoria_id=ids_categorias.get(plato_data["categoria"]),
                especie_id=ids_especies.get(plato_data["especie"]),
                descripcion=plato_data["descripcion"],
                imagen=plato_data["imagen"],
                publicado=1, estado_registro="A", incluye_plato=1, es_crudo=0, creado_nutricionista=0
            )
            db.add(plato)
        db.commit()
        print("\n✅ ¡Datos de ejemplo insertados correctamente!")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error al insertar datos: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Iniciando inserción de datos de ejemplo...\n")
    seed_database()