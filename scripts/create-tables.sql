-- Script SQL para crear las tablas en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de logs
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insertar roles por defecto
INSERT INTO roles (id, name, description, permissions, is_system, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Administrador', 'Acceso completo a todos los módulos del sistema', 
 '[{"module": "dashboard", "actions": ["view"]}, {"module": "products", "actions": ["view", "create", "edit", "delete"]}, {"module": "clients", "actions": ["view", "create", "edit", "delete"]}, {"module": "sales", "actions": ["view", "create", "edit", "delete", "cancel"]}, {"module": "payments", "actions": ["view", "create", "edit", "delete"]}, {"module": "roles", "actions": ["view", "create", "edit", "delete"]}, {"module": "logs", "actions": ["view"]}]', 
 true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Administrador', 'Gestión de productos, clientes y ventas', 
 '[{"module": "dashboard", "actions": ["view"]}, {"module": "products", "actions": ["view", "create", "edit", "delete"]}, {"module": "clients", "actions": ["view", "create", "edit", "delete"]}, {"module": "sales", "actions": ["view", "create", "edit", "delete", "cancel"]}, {"module": "payments", "actions": ["view", "create", "edit", "delete"]}, {"module": "logs", "actions": ["view"]}]', 
 true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Vendedor', 'Creación de ventas y gestión de abonos', 
 '[{"module": "dashboard", "actions": ["view"]}, {"module": "products", "actions": ["view"]}, {"module": "clients", "actions": ["view", "create", "edit"]}, {"module": "sales", "actions": ["view", "create", "edit"]}, {"module": "payments", "actions": ["view", "create", "edit"]}]', 
 true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar usuario Diego
INSERT INTO users (id, name, email, password, role, permissions, is_active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Diego Admin', 'diego@zonat.com', 'admin123', 'superadmin', 
 '[{"module": "dashboard", "actions": ["view"]}, {"module": "products", "actions": ["view", "create", "edit", "delete"]}, {"module": "clients", "actions": ["view", "create", "edit", "delete"]}, {"module": "sales", "actions": ["view", "create", "edit", "delete", "cancel"]}, {"module": "payments", "actions": ["view", "create", "edit", "delete"]}, {"module": "roles", "actions": ["view", "create", "edit", "delete"]}, {"module": "logs", "actions": ["view"]}]', 
 true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_roles_system ON roles(is_system);
