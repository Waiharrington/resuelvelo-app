# Resuélvelo App

Plataforma de servicios y empleo para Venezuela. Conecta personas que necesitan servicios con prestadores de servicio verificados.

## 🚀 Stack Tecnológico

- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL (Supabase) - Schema: `resuelve`
- **Autenticación**: JWT + Supabase Auth
- **Tiempo real**: Socket.IO

## 📁 Estructura del Proyecto

```
resuelve-app/
├── backend/                    # API del servidor
│   ├── src/
│   │   ├── config/            # Configuración (Supabase, DB)
│   │   ├── controllers/       # Controladores REST
│   │   ├── middleware/        # Middleware (Auth)
│   │   ├── routes/           # Rutas API
│   │   └── utils/            # Utilidades
│   ├── prisma/
│   │   └── migrations/       # Scripts SQL
│   ├── .env.example          # Plantilla de variables
│   └── package.json
├── mobile/                    # App React Native
│   ├── src/
│   │   ├── api/              # Configuración API
│   │   ├── components/       # Componentes UI
│   │   ├── contexts/         # Contextos (Auth)
│   │   ├── navigation/       # Navegación
│   │   └── screens/          # Pantallas
│   ├── app.json
│   └── package.json
├── docs/                      # Documentación
├── scripts/                   # Scripts de instalación
└── SUPER_PLAN.md             # Plan maestro
```

## 🛠️ Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Expo CLI (para app móvil)

### 1. Clonar el proyecto
```bash
git clone [URL_DEL_REPOSITORIO]
cd resuelve-app
```

### 2. Instalar backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables
npx prisma generate
```

### 3. Configurar Supabase

#### a) Obtener credenciales
Ve a tu dashboard de Supabase y obtén:
- Project URL
- Anon Key  
- Service Role Key
- Database Connection String

#### b) Ejecutar SQL
Ve al SQL Editor de Supabase y ejecuta:
`backend/prisma/migrations/001_init.sql`

#### c) Configurar .env
Edita `backend/.env` con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?search_path=resuelve"
SUPABASE_URL="https://[REF].supabase.co"
SUPABASE_ANON_KEY="[KEY]"
SUPABASE_SERVICE_ROLE_KEY="[KEY]"
JWT_SECRET="[SECRETO-FUERTE]"
```

### 4. Iniciar backend
```bash
npm run dev
```

### 5. Instalar app móvil
```bash
cd ../mobile
npm install
npx expo start
```

## 📊 Base de Datos

Schema: `resuelve` (multitenant)

### Tablas principales
| Tabla | Descripción |
|-------|-------------|
| users | Usuarios del sistema |
| provider_verifications | Verificación de prestadores |
| categories | Categorías de servicios |
| posts | Publicaciones de necesidades |
| offers | Ofertas de prestadores |
| transactions | Transacciones financieras |
| reviews | Reseñas y calificaciones |
| incidents | Incidentes y disputas |
| messages | Chat en tiempo real |
| wallets | Billeteras de usuarios |

## 🔐 Autenticación

- Registro con email/teléfono
- Login con JWT
- Roles: client, provider, admin
- Verificación de prestadores

## 📱 Funcionalidades

### Clientes
- Crear publicaciones de necesidades
- Recibir ofertas de prestadores
- Elegir prestador ganador
- Chat en tiempo real
- Calificar servicio

### Prestadores
- Verificar identidad
- Recibir notificaciones
- Enviar ofertas
- Ejecutar servicios
- Recibir pagos

### Admin
- Dashboard con métricas
- Gestionar usuarios
- Aprobar verificaciones
- Resolver disputas

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- JWT con expiración
- Rate limiting
- Validación de inputs
- SQL injection protection

## 📚 Documentación

- [SUPER_PLAN.md](SUPER_PLAN.md) - Plan maestro del proyecto
- [AGENTS.md](AGENTS.md) - Agentes de desarrollo
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) - Guía de Supabase
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Esquema de BD

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Add nueva feature'`)
4. Push al branch (`git push origin feature/nueva-feature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE)

## 📞 Soporte

- Email: [tu-email@ejemplo.com]
- Issues: [GitHub Issues](URL_DEL_REPOSITORIO/issues)
