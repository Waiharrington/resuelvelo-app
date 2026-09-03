# Configuración de Supabase - Resuélvelo App

## Estructura Multitenant

Tu proyecto utiliza un esquema multitenant donde cada aplicación tiene su propio schema en la misma base de datos.

- **Schema**: `resuelve`
- **Base de datos**: PostgreSQL (Supabase)

## Pasos para Configurar

### 1. Obtener Credenciales de Supabase

Ve a tu dashboard de Supabase y obtén:
- Project URL
- Anon Key
- Service Role Key
- Database Connection String

### 2. Configurar Variables de Entorno

Edita el archivo `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres?search_path=resuelve"
SUPABASE_URL="https://[TU-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[TU-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[TU-SERVICE-ROLE-KEY]"
JWT_SECRET="[GENERAR-SECRETO-FUERTE]"
```

### 3. Ejecutar SQL de Configuración

Ve al SQL Editor de Supabase y ejecuta el contenido de:
`backend/prisma/migrations/001_init.sql`

Esto creará:
- Schema `resuelve`
- Todas las tablas necesarias
- Índices para optimización
- Categorías por defecto

### 4. Verificar la Instalación

Ejecuta en el SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'resuelve' 
ORDER BY table_name;
```

Deberías ver las tablas:
- categories
- incidents
- insurance_fund
- messages
- offers
- posts
- provider_verifications
- reviews
- transactions
- users
- wallets

### 5. Generar Cliente Prisma

```bash
cd backend
npx prisma generate
```

### 6. Iniciar el Servidor

```bash
npm run dev
```

## Estructura de Tablas

```
resuelve
├── users              # Usuarios de la plataforma
├── provider_verifications  # Verificación de prestadores
├── categories         # Categorías de servicios
├── posts              # Publicaciones de necesidades
├── offers             # Ofertas de prestadores
├── transactions       # Transacciones financieras
├── reviews            # Reseñas y calificaciones
├── incidents          # Incidentes y disputas
├── messages           # Mensajes del chat
├── insurance_fund     # Fondo de seguro
└── wallets            # Billeteras de usuarios
```

## Troubleshooting

### Error: Schema not found
Asegúrate de ejecutar el SQL de creación del schema primero.

### Error: Permission denied
Ejecuta los comandos GRANT que están en el script SQL.

### Error: Connection refused
Verifica que la URL de conexión en `.env` sea correcta.

## Seguridad

- Las Service Role Keys deben mantenerse secretas
- Nunca expongas las keys en el código del cliente
- Usa HTTPS en producción
- Implementa Row Level Security (RLS) para producción
