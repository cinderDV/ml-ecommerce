-- ============================================================
-- REESTRUCTURACIÓN DE CATEGORÍAS WOOCOMMERCE
-- Muebles Latina — ec-ml-pruebas.rkldev.xyz
-- ============================================================
--
-- ESTRUCTURA OBJETIVO:
--
-- SOFÁS (id 46, renombrada)
-- ├── Sofá Living (NUEVA)
-- └── Sofá Cama Funcional (id 77, movida aquí)
--
-- SECCIONALES (id 47)
-- ├── Seccional Latina (id 68) ✓
-- ├── Seccional Mustang (id 69) ✓
-- ├── Seccional Mustang Intercambiable (id 71) ✓
-- ├── Seccional Funcional (id 78, movida aquí)
-- └── Otros Seccionales (NUEVA)
--
-- CAMAS (id 59) ✓
-- POLTRONAS (id 58) ✓
-- POUF (id 60) ✓
--
-- CATEGORÍAS A ELIMINAR (18):
-- 0 (SÓFAS anomalía), 15 (Sofas Chile), 20 (Sofás Seccionales),
-- 34 (Sofás Seccionales Mustang), 46 subcats (64,65,66,67),
-- 48+hijas (49,50,51), 57+hijas (62,63), 61 (COLCHONES),
-- 70 (Seccional Mustang Incorporado), 96 (Mueble auxiliar)
-- ============================================================

-- ============================
-- PASO 1: Crear subcategorías
-- ============================

-- "Sofá Living" bajo SOFÁS (46)
INSERT INTO wp_terms (name, slug, term_group) VALUES ('Sofá Living', 'sofa-living', 0);
SET @sofa_living_tid = LAST_INSERT_ID();
INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (@sofa_living_tid, 'product_cat', '', 46, 0);
SET @sofa_living_ttid = LAST_INSERT_ID();

-- "Otros Seccionales" bajo SECCIONALES (47)
INSERT INTO wp_terms (name, slug, term_group) VALUES ('Otros Seccionales', 'otros-seccionales', 0);
SET @otros_secc_tid = LAST_INSERT_ID();
INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count)
VALUES (@otros_secc_tid, 'product_cat', '', 47, 0);
SET @otros_secc_ttid = LAST_INSERT_ID();

-- ============================
-- PASO 2: Renombrar y mover
-- ============================

-- Liberar slug 'sofas' (actualmente en Sofas Chile id 15)
UPDATE wp_terms SET slug = 'sofas-chile-borrar' WHERE term_id = 15;

-- SOFAS (46) → SOFÁS, slug limpio
UPDATE wp_terms SET name = 'SOFÁS', slug = 'sofas' WHERE term_id = 46;

-- SOFA FUNCIONAL (77) → "Sofá Cama Funcional", hija de SOFÁS (46)
UPDATE wp_terms SET name = 'Sofá Cama Funcional', slug = 'sofa-cama-funcional' WHERE term_id = 77;
UPDATE wp_term_taxonomy SET parent = 46 WHERE term_id = 77 AND taxonomy = 'product_cat';

-- SECCIONAL FUNCIONAL (78) → hija de SECCIONALES (47)
UPDATE wp_term_taxonomy SET parent = 47 WHERE term_id = 78 AND taxonomy = 'product_cat';
- SOFA FUNCIONAL (77) → "Sofá Cama Funcional", hija de SOFÁS (46)
UPDATE wp_terms SET name = 'Sofá Cama Funcional', slug = 'sofa-cama-funcional' WHERE term_id = 77;
UPDATE wp_term_taxonomy SET parent = 46 WHERE term_id = 77 AND taxonomy = 'product_cat';

-- SECCIONAL FUNCIONAL (78) → hija de SECCIONALES (47)
UPDATE wp_term_taxonomy SET parent = 47 WHERE term_id = 78 AND taxonomy = 'product_cat';

-- ====================================
-- PASO 3: Reasignar productos
-- ====================================

-- 3a. Productos de Sofas Chile (ttid 15) → dividir entre Sofá Living y Otros Seccionales
--     Sofás regulares → Sofá Living:
--       2782 Juego de living Deco 3-1-1
--       1959 Sofá Chesterfield Capitone Brabante LARGE
--       187  Sofá Living Estocolmo
--       175  Sofá Chesterfield Capitone Brabante
DELETE FROM wp_term_relationships WHERE object_id IN (2782, 1959, 187, 175) AND term_taxonomy_id = 15;
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES
  (2782, @sofa_living_ttid, 0),
  (1959, @sofa_living_ttid, 0),
  (187,  @sofa_living_ttid, 0),
  (175,  @sofa_living_ttid, 0);

--     Seccionales → Otros Seccionales:
--       2231 Seccional Cozy Lounge
--       1638 SECCIONAL FELPA ESTOCOLMO CHICO
DELETE FROM wp_term_relationships WHERE object_id IN (2231, 1638) AND term_taxonomy_id = 15;
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES
  (2231, @otros_secc_ttid, 0),
  (1638, @otros_secc_ttid, 0);

-- 3b. Producto directo de SOFAS (ttid 46) → Sofá Living
--       305 Sofa Lino 3 Cuerpos Deco
DELETE FROM wp_term_relationships WHERE object_id = 305 AND term_taxonomy_id = 46;
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES
  (305, @sofa_living_ttid, 0);

-- 3c. Producto de Sofás Seccionales Mustang (ttid 34) → SECCIONAL MUSTANG (ttid 69)
--       181 Sofá Seccional Mustang Grande Incorporado
DELETE FROM wp_term_relationships WHERE object_id = 181 AND term_taxonomy_id IN (34, 20);
INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES
  (181, 69, 0);

-- 3d. Seccional Style U (2766) está directo en SECCIONALES (47) → Otros Seccionales
DELETE FROM wp_term_relationships WHERE object_id = 2766 AND term_taxonomy_id = 47;
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) VALUES
  (2766, @otros_secc_ttid, 0);

-- 3e. Seccional Mustang Chico Felpa (2615) tiene asignación dual 47+69 → quitar 47
DELETE FROM wp_term_relationships WHERE object_id = 2615 AND term_taxonomy_id = 47;

-- ====================================
-- PASO 4: Eliminar categorías basura
-- ====================================

-- IDs a eliminar:
-- 15  Sofas Chile (ya vacía)
-- 20  Sofás Seccionales
-- 34  └─ Sofás Seccionales Mustang
-- 48  Juegos de Living (vieja)
-- 49  └─ Juegos de Living Deco
-- 50  └─ Juegos de Living Estocolmo
-- 51  └─ Juegos de Living Carrè
-- 57  JUEGOS DE LIVING (duplicado)
-- 62  └─ LIVING DECO 3-1-1
-- 63  └─ LIVING ESTOCOLMO 3-1-1
-- 61  COLCHONES (vacía)
-- 64  SOFA 3 CUERPOS LATINA (vacía, bajo viejo SOFAS)
-- 65  SOFA 3 CUERPOS ESTOCOLMO (vacía)
-- 66  SOFA 3 CUERPOS CHESTERFIELD (vacía)
-- 67  SOFA 3 CUERPOS LINEAL (vacía)
-- 70  SECCIONAL MUSTANG INCORPORADO (vacía)
-- 96  Mueble auxiliar (vacía)

SET @borrar = '15,20,34,48,49,50,51,57,62,63,61,64,65,66,67,70,96';

DELETE FROM wp_term_relationships
  WHERE term_taxonomy_id IN (15,20,34,48,49,50,51,57,62,63,61,64,65,66,67,70,96);

DELETE FROM wp_term_taxonomy
  WHERE term_id IN (15,20,34,48,49,50,51,57,62,63,61,64,65,66,67,70,96);

DELETE FROM wp_terms
  WHERE term_id IN (15,20,34,48,49,50,51,57,62,63,61,64,65,66,67,70,96);

-- Limpiar anomalía term_id = 0 (SÓFAS, slug sofas-4)
DELETE FROM wp_term_taxonomy WHERE term_taxonomy_id = 0;
DELETE FROM wp_terms WHERE term_id = 0 AND slug = 'sofas-4';

-- ====================================
-- PASO 5: Recalcular conteos
-- ====================================
UPDATE wp_term_taxonomy tt
SET count = (
  SELECT COUNT(DISTINCT tr.object_id)
  FROM wp_term_relationships tr
  JOIN wp_posts p ON p.ID = tr.object_id
  WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
    AND p.post_type IN ('product', 'product_variation')
    AND p.post_status = 'publish'
)
WHERE tt.taxonomy = 'product_cat';

-- ====================================
-- PASO 6: Limpiar caché de WooCommerce
-- ====================================
DELETE FROM wp_options WHERE option_name LIKE '_transient_wc_%';
DELETE FROM wp_options WHERE option_name LIKE '_transient_timeout_wc_%';

-- ====================================
-- VERIFICACIÓN FINAL
-- ====================================
SELECT
  CASE WHEN tt.parent = 0 THEN t.name ELSE CONCAT('  └─ ', t.name) END AS categoria,
  t.slug,
  tt.parent,
  tt.count AS productos
FROM wp_terms t
JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'product_cat'
ORDER BY
  CASE WHEN tt.parent = 0 THEN t.term_id ELSE tt.parent END,
  tt.parent,
  t.name;
