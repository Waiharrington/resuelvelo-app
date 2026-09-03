# SUPER PLAN DE DESARROLLO - APP RESUÉLVELO
## Plataforma de Servicios y Empleo para Venezuela

---

## 1. VISIÓN DEL PROYECTO

**Resuélvelo** es una aplicación móvil y web que conecta personas que necesitan servicios (clientes) con prestadores de servicio verificados. Funciona como un marketplace tipo Fiverr pero adaptado al mercado venezolano, con sistema de verificación, seguro y protección para ambas partes.

### Objetivos Principales:
- Conectar oferta y demanda de servicios locales
- Verificar la identidad y confiabilidad de los prestadores
- Proteger a ambas partes con un sistema de seguro
- Facilitar pagos seguros y resolución de conflictos

---

## 2. STACK TECNOLÓGICO

### Frontend (App Móvil):
- **React Native** con Expo (desarrollo rápido, multiplataforma)
- **TypeScript** para tipado estático
- **Tailwind CSS** (NativeWind) para estilos
- **React Navigation** para navegación
- **Expo Notifications** para push notifications

### Backend:
- **Node.js** con Express.js
- **TypeScript**
- **Supabase** (Base de datos PostgreSQL + Auth + Storage + Realtime)
- **Prisma** como ORM

### Servicios Externos:
- **Supabase Auth** - Autenticación (email, teléfono, Google)
- **Supabase Storage** - Almacenamiento de fotos/documentos
- **Supabase Realtime** - Chat en tiempo real
- **Mercado Pago / PagoMóvil** - Procesamiento de pagos
- **Firebase Cloud Messaging** - Notificaciones push
- **Twilio** - Verificación SMS

---

## 3. ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│                    APP RESUÉLVELO                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │   FRONTEND   │    │   BACKEND    │                  │
│  │ React Native │◄──►│  Node.js +   │                  │
│  │    Expo      │    │  Express     │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│                    ┌────────▼────────┐                  │
│                    │    SUPABASE     │                  │
│                    │  PostgreSQL +   │                  │
│                    │  Auth + Storage │                  │
│                    └─────────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. MÓDULOS DE LA APLICACIÓN

### MÓDULO 1: AUTENTICACIÓN Y PERFILES
- Registro con email/teléfono/Google
- Tipos de usuario: Cliente, Prestador, Admin
- Perfil completo con foto, descripción, ubicación
- Verificación de identidad (cédula, antecedentes, test psicológico)

### MÓDULO 2: PUBLICACIONES Y NECESIDADES
- Crear publicación de necesidad (servicio requerido)
- Categorías: Transporte, Instalaciones, Reparaciones, Belleza, etc.
- Fotos, descripción, ubicación, fecha límite, presupuesto
- Geolocalización para servicios cercanos

### MÓDULO 3: SISTEMA DE OFERTAS
- Prestadores envían ofertas con precio
- Sistema de bloqueo automático (máx 3-5 ofertas)
- Cliente elige al prestador ganador
- Notificaciones en tiempo real

### MÓDULO 4: VERIFICACIÓN DE PRESTADORES
- Documento de identidad (cédula)
- Comprobante de domicilio
- Referencias personales (2 mínimo)
- Antecedentes penales
- Test psicológico en línea
- Sistema de aprobación/rechazo por admin

### MÓDULO 5: SISTEMA DE SEGURO Y PROTECCIÓN
- Cobro mensual de $3 USD por usuario
- Fondo de protección para conflictos
- Registro de incidentes
- Sistema de penalidades (suspensión, multas)

### MÓDULO 6: CHAT Y COMUNICACIÓN
- Chat en tiempo real entre cliente y prestador
- Sistema de notificaciones
- Historial de conversaciones
- Soporte de emergencia

### MÓDULO 7: PAGOS Y FACTURACIÓN
- Wallet de la plataforma
- Depósitos y retiros
- Comisión por transacción
- Historial de pagos

### MÓDULO 8: RESEÑAS Y CALIFICACIONES
- Calificación 1-5 estrellas
- Comentarios textuales
- Historial de trabajos del prestador
- Badge de confiabilidad

### MÓDULO 9: ADMIN Y DASHBOARD
- Panel de administración
- Gestión de usuarios
- Monitoreo de transacciones
- Reportes y estadísticas

---

## 5. BASE DE DATOS - TABLAS PRINCIPALES

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  user_type VARCHAR(20) CHECK (user_type IN ('client', 'provider', 'admin')),
  avatar_url TEXT,
  location JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Verificación de Prestadores
CREATE TABLE provider_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES users(id),
  id_document_url TEXT,
  proof_of_address_url TEXT,
  references JSONB,
  criminal_record_url TEXT,
  psychological_test_score INTEGER,
  verification_status VARCHAR(20) DEFAULT 'pending',
  verified_at TIMESTAMP
);

-- Publicaciones de Necesidades
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  category VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  photos_urls JSONB,
  location JSONB,
  budget DECIMAL(10,2),
  deadline TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ofertas
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  provider_id UUID REFERENCES users(id),
  price DECIMAL(10,2),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  client_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  insurance_fee DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reseñas
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Incidentes
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  reporter_id UUID REFERENCES users(id),
  description TEXT,
  evidence_urls JSONB,
  status VARCHAR(20) DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seguro/Fondo
CREATE TABLE insurance_fund (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  type VARCHAR(20), -- 'charge' or 'payout'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. FLUJO DE USUARIO PRINCIPAL

### Flujo 1: Cliente Publica Necesidad
```
1. Cliente crea cuenta / inicia sesión
2. Crea publicación con:
   - Categoría del servicio
   - Título y descripción
   - Fotos (opcional)
   - Ubicación
   - Presupuesto disponible
   - Fecha límite
3. Sistema busca prestadores cercanos
4. Notifica a prestadores disponibles
5. Prestadores envían ofertas
6. Sistema bloquea tras 3-5 ofertas
7. Cliente elige ganador
8. Se establece comunicación (chat)
9. Servicio se ejecuta
10. Cliente califica y paga
```

### Flujo 2: Prestador Ofrece Servicio
```
1. Prestador crea cuenta
2. Completa verificación:
   - Sube cédula
   - Sube comprobante de domicilio
   - Agrega 2 referencias
   - Sube antecedentes penales
   - Realiza test psicológico
3. Admin aprueba verificación
4. Prestador configura perfil y servicios
5. Recibe notificaciones de publicaciones cercanas
6. Envía ofertas
7. Si es elegido, ejecuta servicio
8. Recibe pago (menos comisión)
```

### Flujo 3: Resolución de Conflictos
```
1. Parte reporta incidente
2. Adjunta evidencia
3. Admin revisa caso
4. Se contacta a ambas partes
5. Se toma decisión:
   - A favor del cliente → reembolso
   - A favor del prestador → pago liberado
   - Ambos culpables → reparto
6. Se aplica penalidad si aplica
7. Se actualiza historial
```

---

## 7. CRONOGRAMA DE DESARROLLO

### FASE 1: Fundamentos (Semana 1-2)
- [x] Crear estructura del proyecto
- [ ] Configurar Supabase
- [ ] Implementar autenticación
- [ ] Crear perfiles básicos

### FASE 2: Core Features (Semana 3-4)
- [ ] Sistema de publicaciones
- [ ] Sistema de ofertas
- [ ] Chat en tiempo real
- [ ] Geolocalización

### FASE 3: Verificación y Seguros (Semana 5-6)
- [ ] Sistema de verificación de prestadores
- [ ] Sistema de seguro
- [ ] Gestión de incidentes
- [ ] Sistema de penalidades

### FASE 4: Pagos y Monetización (Semana 7-8)
- [ ] Integración de pagos
- [ ] Wallet de la plataforma
- [ ] Sistema de comisiones
- [ ] Facturación

### FASE 5: Pulido y Lanzamiento (Semana 9-10)
- [ ] Testing completo
- [ ] Optimización de rendimiento
- [ ] Preparación para App Store/Play Store
- [ ] Lanzamiento beta

---

## 8. AGENTES PERSONALIZADOS REQUERIDOS

| Agente | Función | Herramientas |
|--------|---------|--------------|
| `backend-dev` | Desarrollo de API y lógica del servidor | Node.js, Express, Prisma |
| `frontend-dev` | Desarrollo de interfaces React Native | React Native, Expo, TypeScript |
| `database-admin` | Configuración y optimización de BD | Supabase, PostgreSQL |
| `auth-specialist` | Autenticación y verificación | Supabase Auth, JWT |
| `payments-int` | Integración de pagos | PagoMóvil, Mercado Pago |
| `devops-deploy` | Deploy y configuración | Docker, Railway, Vercel |
| `qa-tester` | Testing y aseguramiento de calidad | Jest, Cypress |
| `ui-designer` | Diseño de interfaces | Figma, Tailwind |

---

*Plan creado: 2026-09-02*
*Última actualización: 2026-09-02*
