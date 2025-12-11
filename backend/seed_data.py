# backend/seed_data.py

from utils.db import SessionLocal, engine
from models import Categoria, Especie, PlatoCombinado, Rol, Base, MembresiaSubscripcion
from utils import keygen

def seed_database():
    db = SessionLocal()
    try:
        print("🏗️  Verificando tablas...")
        Base.metadata.create_all(bind=engine)

        # --- 1. ROLES ---
        print("👤 Verificando roles...")
        roles = [
            {'id': 1, 'nombre': 'Admin', 'desc': 'Administrador del sistema'},
            {'id': 2, 'nombre': 'Cliente', 'desc': 'Usuario cliente de la aplicación'},
            {'id': 3, 'nombre': 'Nutricionista', 'desc': 'Profesional de nutrición animal'},
            {'id': 4, 'nombre': 'Repartidor', 'desc': 'Encargado de las entregas'}
        ]
        for r_data in roles:
            if not db.query(Rol).filter(Rol.id == r_data['id']).first():
                db.add(Rol(id=r_data['id'], nombre=r_data['nombre'], estado_registro='A', descripcion=r_data['desc']))

        # --- 2. MEMBRESÍA ---
        if not db.query(MembresiaSubscripcion).filter(MembresiaSubscripcion.id == 1).first():
            db.add(MembresiaSubscripcion(id=1, nombre="Gratuita", duracion=365, precio=0.00, estado_registro="A", descripcion="Plan por defecto"))

        db.commit()

        # --- 3. CATEGORÍAS ---
        print("📂 Verificando categorías...")
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

        # --- 4. ESPECIES ---
        print("🐾 Verificando especies...")
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
        
        # --- 5. PLATOS ---
        print("🍽️  Insertando TODOS los platos...")

        # Borramos platos anteriores para corregir rutas
        db.query(PlatoCombinado).delete()
        db.commit()

        lista_platos = []

        # A. Platos BARF (Rutas corregidas con "imagenes/plato/...")
        lista_platos.extend([
            {
                "nombre": "BARF Pollo Balanceado", "precio": 28.00,
                "categoria": "Platos caseros", "especie": "Perro",
                "descripcion": "Dieta BARF de pollo con vísceras y vegetales.",
                "ingredientes": "Pollo, hueso carnoso, hígado",
                "imagen": "/barf_pollo.png" 
            },
            {
                "nombre": "BARF Ternera Premium", "precio": 32.00,
                "categoria": "Platos caseros", "especie": "Perro",
                "descripcion": "Cortes finos de ternera con probióticos naturales.",
                "ingredientes": "Ternera, corazón, espinaca",
                "imagen": "/barf_ternera.png"
            },
            {
                "nombre": "BARF Pato para Gato", "precio": 30.00,
                "categoria": "Platos caseros", "especie": "Gato",
                "descripcion": "Dieta especial rica en taurina para gatos.",
                "ingredientes": "Pato, hígado, taurina",
                "imagen": "/barf_pato_gato.png"
            }
        ])

        # B. Platos genéricos
        nombres_genericos = [
            "Estofado de Cordero", "Pastel de Carne", "Galletas de Hígado", "Sopa de Pollo", 
            "Mix de Verduras", "Salmón al Vapor", "Albóndigas de Res", "Puré de Calabaza", 
            "Helado para Perros", "Snack de Pescado", "Arroz con Pavo", "Menú Degustación",
            "Trozos de Conejo", "Yogurt Natural", "Hueso Recreativo", "Filete de Merluza",
            "Batido Energético"
        ]

        # Hasta imagen17.png (según tu carpeta)
        for i in range(1, 18):  
            nombre_plato = nombres_genericos[i-1]
            if i <= 5: cat = "Platos caseros"
            elif i <= 10: cat = "Ensaladas"
            elif i <= 15: cat = "Postres"
            else: cat = "Bebidas"
            esp = "Perro" if i % 2 == 0 else "Gato"

            lista_platos.append({
                "nombre": nombre_plato,
                "precio": float(10 + i),
                "categoria": cat,
                "especie": esp,
                "descripcion": f"Delicioso {nombre_plato.lower()} preparado con ingredientes frescos.",
                "ingredientes": "Ingredientes naturales seleccionados",
                # RUTA CORREGIDA: Agregamos "imagenes/plato/"
                "imagen": f"/imagen{i}.png"
            })

        # Insertar en BD
        for p in lista_platos:
            cat_id = ids_categorias.get(p["categoria"])
            esp_id = ids_especies.get(p["especie"])

            if cat_id and esp_id:
                nuevo_plato = PlatoCombinado(
                    id=keygen.generate_uint64_key(),
                    nombre=p["nombre"], precio=p["precio"],
                    categoria_id=cat_id,
                    especie_id=esp_id,
                    descripcion=p["descripcion"], 
                    ingredientes=p["ingredientes"], 
                    imagen=p["imagen"],
                    publicado=1, estado_registro="A",
                    incluye_plato=1, es_crudo=0, creado_nutricionista=1
                )
                db.add(nuevo_plato)

        db.commit()
        print(f"✅ ¡Se insertaron {len(lista_platos)} platos correctamente!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error al sembrar datos: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()