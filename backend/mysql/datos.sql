-- 1. Insertar ROLES (con los IDs fijos que tu código espera)
INSERT INTO rol (id, nombre, estado_registro, descripcion) VALUES
(1, 'admin', 'A', 'Administrador del sistema'),
(2, 'cliente', 'A', 'Usuario cliente de la aplicación'),
(3, 'nutricionista', 'A', 'Profesional de nutrición animal'),
(4, 'repartidor', 'A', 'Encargado de las entregas');

-- 2. Insertar ESPECIES
INSERT INTO especie (id, nombre, estado_registro, descripcion) VALUES
(1, 'Perro', 'A', 'Especie canina doméstica'),
(2, 'Gato', 'A', 'Especie felina doméstica');

-- 3. Insertar CATEGORÍAS
INSERT INTO categoria (id, nombre, estado_registro, descripcion) VALUES
(1, 'Platos caseros', 'A', 'Comida casera para mascotas'),
(2, 'Ensaladas', 'A', 'Ensaladas nutritivas'),
(3, 'Postres', 'A', 'Dulces para mascotas'),
(4, 'Bebidas', 'A', 'Bebidas refrescantes');

-- 4. Insertar PLATOS (con los IDs de categoría/especie correctos y SOLO el nombre de la imagen)
INSERT INTO plato_combinado 
(id, nombre, precio, categoria_id, especie_id, descripcion, ingredientes, imagen, publicado, estado_registro, incluye_plato, es_crudo, creado_nutricionista) 
VALUES
(15518080632393833572, 'BARF Pollo Balanceado', 28.00, 1, 1, 
 'Dieta BARF a base de pollo con vísceras, huevo, vegetales y frutas.',
 'pollo, vísceras, huevo, zanahoria',
 'barf_pollo.png', 1, 'A', 1, 0, 0),

(15518080632393833573, 'BARF Ternera Premium', 32.00, 1, 1,
 'Dieta BARF de ternera con corazón de res, costilla, vegetales y probióticos.',
 'ternera, corazón de res, costilla, brócoli',
 'barf_ternera.png', 1, 'A', 1, 0, 0),

(15518080632393833574, 'BARF Pato para Gato', 30.00, 1, 2,
 'Dieta BARF especial para gatos con carne de pato.',
 'pato, hígado de pato, calabacín, zanahoria',
 'barf_pato_gato.png', 1, 'A', 1, 0, 0);
