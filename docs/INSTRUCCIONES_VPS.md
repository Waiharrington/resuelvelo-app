# Instrucciones para Configurar Resuélvelo en tu VPS

## Resumen de lo que necesitas hacer

### 1. Obtener el JWT_SECRET de tu VPS

Conéctate por SSH a tu VPS y ejecuta:

```bash
ssh root@62.171.160.75
cat /root/supabase/docker/.env | grep JWT_SECRET
```

Copia el valor y reemplaza `[OBTENER-DEL-VPS]` en el archivo `backend/.env`

---

### 2. Crear el esquema `resuelve` en la BD

#### Opción A: Desde tu máquina local (recomendado)

```bash
# Conectarse al VPS por SSH
ssh root@62.171.160.75

# Ejecutar el SQL de bootstrap
psql -U postgres -d postgres -f /ruta/al/archivo/resuelve-schema-bootstrap.sql

# Ejecutar el SQL de tablas
psql -U postgres -d postgres -f /ruta/al/archivo/resuelve-create-tables.sql
```

#### Opción B: Desde el SQL Editor de Supabase

1. Ve a https://supabase.somosdostudio.com
2. Abre el SQL Editor
3. Ejecuta primero `resuelve-schema-bootstrap.sql`
4. Luego ejecuta `resuelve-create-tables.sql`

---

### 3. Agregar esquema a PGRST_DB_SCHEMAS

**Esto lo haces TÚ en el VPS:**

```bash
ssh root@62.171.160.75

# Editar docker-compose.yml
cd /root/supabase/docker
nano docker-compose.yml
```

Busca la línea `PGRST_DB_SCHEMAS` y agrega `resuelve` a la lista:

```
PGRST_DB_SCHEMAS=public,auth,resuelve
```

**NO toques nada más en el docker-compose.yml**

Reinicia PostgREST:

```bash
docker restart postgrest
```

---

### 4. Verificar la conexión

Una vez configurado todo, ejecuta en tu máquina local:

```bash
cd "C:\Users\Waiha\Resuelve App\backend"
npm run dev
```

Deberías ver:
```
Server running on port 3000
Database connected successfully
```

---

### 5. Credenciales Configuradas

| Campo | Valor |
|-------|-------|
| URL | https://supabase.somosdostudio.com |
| Anon Key | `eyJhbGci...` (ya está en .env) |
| Database | `postgresql://postgres:***@62.171.160.75:5432/postgres` |
| Schema | `resuelve` |

---

### ⚠️ RECORDATORIOS IMPORTANTES

1. **NO uses la service_role key** en el frontend
2. **NO toques el docker-compose.yml** excepto para agregar el esquema
3. **NO reinicies Supabase completo**, solo postgREST si agregas un esquema
4. **RLS se habilitará después** cuando configuremos las políticas

---

## Archivos SQL Creados

| Archivo | Descripción |
|---------|-------------|
| `resuelve-schema-bootstrap.sql` | Crea el esquema y permisos |
| `resuelve-create-tables.sql` | Crea todas las tablas e índices |

---

## Siguientes Pasos

1. ✅ Ejecutar SQL en el VPS
2. ✅ Agregar esquema a PGRST_DB_SCHEMAS
3. ✅ Configurar JWT_SECRET en .env
4. ✅ Iniciar backend con `npm run dev`
5. 🔜 Configurar RLS policies
6. 🔜 Probar endpoints
