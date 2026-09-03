-- Create schema for Resuélvelo App
CREATE SCHEMA IF NOT EXISTS resuelve;

-- Set search path
SET search_path TO resuelve;

-- Categories table
CREATE TABLE IF NOT EXISTS resuelve.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS resuelve.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'provider', 'admin')),
    avatar_url TEXT,
    location JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Provider Verifications table
CREATE TABLE IF NOT EXISTS resuelve.provider_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID UNIQUE NOT NULL REFERENCES resuelve.users(id) ON DELETE CASCADE,
    id_document_url TEXT,
    proof_of_address_url TEXT,
    references JSONB,
    criminal_record_url TEXT,
    psychological_test_score INTEGER,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS resuelve.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES resuelve.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES resuelve.categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photos_urls JSONB,
    location JSONB,
    budget DECIMAL(10, 2) NOT NULL,
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Offers table
CREATE TABLE IF NOT EXISTS resuelve.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES resuelve.posts(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES resuelve.users(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS resuelve.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES resuelve.posts(id),
    client_id UUID NOT NULL REFERENCES resuelve.users(id),
    provider_id UUID NOT NULL REFERENCES resuelve.users(id),
    amount DECIMAL(10, 2) NOT NULL,
    commission DECIMAL(10, 2) NOT NULL,
    insurance_fee DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'disputed', 'refunded')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS resuelve.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID UNIQUE NOT NULL REFERENCES resuelve.transactions(id),
    reviewer_id UUID NOT NULL REFERENCES resuelve.users(id),
    reviewee_id UUID NOT NULL REFERENCES resuelve.users(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS resuelve.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID UNIQUE NOT NULL REFERENCES resuelve.transactions(id),
    reporter_id UUID NOT NULL REFERENCES resuelve.users(id),
    description TEXT NOT NULL,
    evidence_urls JSONB,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS resuelve.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES resuelve.users(id),
    receiver_id UUID NOT NULL REFERENCES resuelve.users(id),
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insurance Fund table
CREATE TABLE IF NOT EXISTS resuelve.insurance_fund (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES resuelve.users(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('charge', 'payout')),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS resuelve.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES resuelve.users(id),
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON resuelve.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON resuelve.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_type ON resuelve.users(user_type);
CREATE INDEX IF NOT EXISTS idx_posts_client ON resuelve.posts(client_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON resuelve.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON resuelve.posts(status);
CREATE INDEX IF NOT EXISTS idx_offers_post ON resuelve.offers(post_id);
CREATE INDEX IF NOT EXISTS idx_offers_provider ON resuelve.offers(provider_id);
CREATE INDEX IF NOT EXISTS idx_transactions_post ON resuelve.transactions(post_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client ON resuelve.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON resuelve.transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON resuelve.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON resuelve.messages(receiver_id);

-- Insert default categories
INSERT INTO resuelve.categories (name, description, icon) VALUES
('Transporte', 'Servicios de transporte y taxi', 'car-outline'),
('Instalaciones', 'Instalación de electrodomésticos y equipos', 'construct-outline'),
('Reparaciones', 'Reparaciones de todo tipo', 'build-outline'),
('Belleza', 'Servicios de barbería, peluquería y estética', 'cut-outline'),
('Limpieza', 'Servicios de limpieza del hogar o negocio', 'sparkles-outline'),
('Freelance', 'Servicios profesionales y digitales', 'laptop-outline'),
('Hogar', 'Servicios para el hogar', 'home-outline'),
('Otros', 'Otros servicios', 'ellipsis-horizontal-outline')
ON CONFLICT (name) DO NOTHING;
