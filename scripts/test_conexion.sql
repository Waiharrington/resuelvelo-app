-- =============================================================================
-- Resuélvelo App: Script de Verificación de Conexión
-- =============================================================================
-- Ejecutar este script para verificar que todo está configurado correctamente.
-- =============================================================================

-- 1. Verificar que el esquema resuelve existe
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'resuelve';

-- 2. Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'resuelve' 
ORDER BY table_name;

-- 3. Verificar columnas de una tabla específica (ej: users)
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'resuelve' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Verificar categorías insertadas
SELECT * FROM resuelve.categories;

-- 5. Verificar permisos del esquema
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.schema_privileges
WHERE table_schema = 'resuelve';

-- 6. Contar tablas
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'resuelve';

-- =============================================================================
-- RESULTADO ESPERADO:
-- - Esquema resuelve existe
-- - 11 tablas creadas
-- - 8 categorías por defecto
-- - Permisos para anon, authenticated, service_role
-- =============================================================================
