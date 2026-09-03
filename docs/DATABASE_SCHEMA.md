# Esquema de Base de Datos - Resuélvelo App

## Schema: `resuelve`

Todas las tablas están en el schema `resuelve` para el sistema multitenant.

---

## users
Tabla principal de usuarios del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | VARCHAR(255) | Email (único) |
| phone | VARCHAR(20) | Teléfono (único) |
| password_hash | VARCHAR(255) | Hash de contraseña |
| full_name | VARCHAR(255) | Nombre completo |
| user_type | VARCHAR(20) | Tipo: client, provider, admin |
| avatar_url | TEXT | URL del avatar |
| location | JSONB | Ubicación (lat, lng, address) |
| is_verified | BOOLEAN | Verificado por admin |
| is_active | BOOLEAN | Cuenta activa |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

## provider_verifications
Verificación de prestadores de servicio.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| provider_id | UUID | Referencia a users (único) |
| id_document_url | TEXT | URL del documento de identidad |
| proof_of_address_url | TEXT | URL del comprobante de domicilio |
| references | JSONB | Referencias personales |
| criminal_record_url | TEXT | URL de antecedentes penales |
| psychological_test_score | INTEGER | Puntuación del test psicológico |
| verification_status | VARCHAR(20) | Estado: pending, approved, rejected |
| verified_at | TIMESTAMP | Fecha de verificación |

---

## categories
Categorías de servicios disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(255) | Nombre (único) |
| description | TEXT | Descripción |
| icon | VARCHAR(100) | Nombre del ícono |
| is_active | BOOLEAN | Categoría activa |

**Categorías por defecto:**
- Transporte
- Instalaciones
- Reparaciones
- Belleza
- Limpieza
- Freelance
- Hogar
- Otros

---

## posts
Publicaciones de necesidades de clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| client_id | UUID | Referencia a users |
| category_id | UUID | Referencia a categories |
| title | VARCHAR(255) | Título de la publicación |
| description | TEXT | Descripción detallada |
| photos_urls | JSONB | URLs de fotos |
| location | JSONB | Ubicación del servicio |
| budget | DECIMAL(10,2) | Presupuesto en USD |
| deadline | TIMESTAMP | Fecha límite |
| status | VARCHAR(20) | Estado: active, closed, completed, cancelled |

---

## offers
Ofertas de prestadores a publicaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| post_id | UUID | Referencia a posts |
| provider_id | UUID | Referencia a users |
| price | DECIMAL(10,2) | Precio ofrecido |
| message | TEXT | Mensaje del prestador |
| status | VARCHAR(20) | Estado: pending, accepted, rejected, withdrawn |

---

## transactions
Transacciones financieras completadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| post_id | UUID | Referencia a posts |
| client_id | UUID | Referencia a users (cliente) |
| provider_id | UUID | Referencia a users (prestador) |
| amount | DECIMAL(10,2) | Monto total |
| commission | DECIMAL(10,2) | Comisión de la plataforma (10%) |
| insurance_fee | DECIMAL(10,2) | Cuota de seguro ($3) |
| status | VARCHAR(20) | Estado: pending, in_progress, completed, disputed, refunded |
| completed_at | TIMESTAMP | Fecha de completado |

---

## reviews
Reseñas y calificaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| transaction_id | UUID | Referencia a transactions (único) |
| reviewer_id | UUID | Referencia a users (quien reseña) |
| reviewee_id | UUID | Referencia a users (quien es reseñado) |
| rating | INTEGER | Calificación 1-5 |
| comment | TEXT | Comentario |

---

## incidents
Incidentes y disputas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| transaction_id | UUID | Referencia a transactions (único) |
| reporter_id | UUID | Referencia a users (quien reporta) |
| description | TEXT | Descripción del incidente |
| evidence_urls | JSONB | URLs de evidencias |
| status | VARCHAR(20) | Estado: open, investigating, resolved, closed |
| resolution | TEXT | Resolución del admin |

---

## messages
Mensajes del chat en tiempo real.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| sender_id | UUID | Referencia a users (remitente) |
| receiver_id | UUID | Referencia a users (destinatario) |
| content | TEXT | Contenido del mensaje |
| read | BOOLEAN | Leído o no |
| created_at | TIMESTAMP | Fecha de envío |

---

## insurance_fund
Movimientos del fondo de seguro.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| user_id | UUID | Referencia a users |
| amount | DECIMAL(10,2) | Monto |
| type | VARCHAR(20) | Tipo: charge, payout |
| description | TEXT | Descripción |

---

## wallets
Billeteras de usuarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| user_id | UUID | Referencia a users (único) |
| balance | DECIMAL(10,2) | Saldo actual |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

## Relaciones

```
users ─┬─ provider_verifications (1:1)
       ├─ posts (1:N) como client
       ├─ offers (1:N) como provider
       ├─ transactions (1:N) como client/provider
       ├─ reviews (1:N) como reviewer/reviewee
       ├─ messages (1:N) como sender/receiver
       └─ wallets (1:1)

posts ─┬─ offers (1:N)
       └─ transactions (0..1)

categories ── posts (1:N)

transactions ─┬─ reviews (0..1)
              └─ incidents (0..1)
```

---

## Índices

- `idx_users_email` - Búsqueda por email
- `idx_users_phone` - Búsqueda por teléfono
- `idx_users_type` - Filtrado por tipo de usuario
- `idx_posts_client` - Publicaciones por cliente
- `idx_posts_category` - Filtrado por categoría
- `idx_posts_status` - Filtrado por estado
- `idx_offers_post` - Ofertas por publicación
- `idx_offers_provider` - Ofertas por prestador
- `idx_transactions_post` - Transacciones por publicación
- `idx_transactions_client` - Transacciones por cliente
- `idx_transactions_provider` - Transacciones por prestador
- `idx_messages_sender` - Mensajes por remitente
- `idx_messages_receiver` - Mensajes por destinatario
