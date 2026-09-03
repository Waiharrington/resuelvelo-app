-- =============================================================================
-- Resuélvelo App: Bootstrap del esquema aislado
-- =============================================================================
-- Este script crea el esquema `resuelve` y configura permisos básicos.
-- NO modifica public ni esquemas de otros proyectos.
--
-- Ejecutar en tu VPS Self-Hosted Supabase:
--   psql -U postgres -d postgres -f resuelve-schema-bootstrap.sql
--
-- Después de ejecutar, AVÍSAME para:
--   1. Agregar `resuelve` a PGRST_DB_SCHEMAS (en docker-compose.yml)
--   2. Reiniciar PostgREST
-- =============================================================================

BEGIN;

-- 1. Crear el esquema
CREATE SCHEMA IF NOT EXISTS resuelve;

-- 2. Dar permisos básicos a los roles de Supabase
GRANT USAGE ON SCHEMA resuelve TO anon, authenticated, service_role;

-- 3. Permisos para crear tablas (solo para migraciones)
GRANT CREATE ON SCHEMA resuelve TO service_role;

-- 4. Permisos por defecto para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve 
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve 
GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve 
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve 
GRANT USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve 
GRANT USAGE ON SEQUENCES TO service_role;

COMMIT;

-- =============================================================================
-- VERIFICACIÓN (ejecutar después del script)
-- =============================================================================
-- SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'resuelve';
-- Debe devolver: resuelve
-- =============================================================================
