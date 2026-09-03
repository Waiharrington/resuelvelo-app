-- Resuélvelo App - Database Setup Script
-- Execute this script in your Supabase SQL Editor or via psql

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS resuelve;

-- 2. Grant permissions (for Supabase)
GRANT USAGE ON SCHEMA resuelve TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA resuelve TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA resuelve TO anon, authenticated, service_role;

-- 3. Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA resuelve GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 4. Create tables
\i 'C:\Users\Waiha\Resuelve App\backend\prisma\migrations\001_init.sql'

-- 5. Verify
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'resuelve' 
ORDER BY table_name;
