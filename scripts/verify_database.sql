-- Resuélvelo App - Database Verification Script
-- Execute this script to verify the database setup

-- 1. Check schema exists
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'resuelve';

-- 2. List all tables in resuelve schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'resuelve' 
ORDER BY table_name;

-- 3. Check columns for each table
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'resuelve'
ORDER BY table_name, ordinal_position;

-- 4. Check constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'resuelve'
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Check indexes
SELECT 
    indexname, 
    tablename, 
    indexdef
FROM pg_indexes
WHERE schemaname = 'resuelve'
ORDER BY tablename, indexname;

-- 6. Check categories (default data)
SELECT * FROM resuelve.categories;

-- 7. Count tables
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'resuelve';
