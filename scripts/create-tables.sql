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

-- 3. Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  document VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  type VARCHAR(50) NOT NULL CHECK (type IN ('mayorista', 'minorista', 'consumidor_final')),
  credit_limit DECIMAL(15,2) DEFAULT 0,
  current_debt DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  brand VARCHAR(255),
  reference VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  cost DECIMAL(15,2) NOT NULL,
  stock_warehouse INTEGER DEFAULT 0,
  stock_store INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla de logs
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

-- 7. Insertar roles por defecto
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

-- 8. Insertar usuario Diego
INSERT INTO users (id, name, email, password, role, permissions, is_active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Diego Admin', 'diego@zonat.com', 'admin123', 'superadmin', 
 '[{"module": "dashboard", "actions": ["view"]}, {"module": "products", "actions": ["view", "create", "edit", "delete"]}, {"module": "clients", "actions": ["view", "create", "edit", "delete"]}, {"module": "sales", "actions": ["view", "create", "edit", "delete", "cancel"]}, {"module": "payments", "actions": ["view", "create", "edit", "delete"]}, {"module": "roles", "actions": ["view", "create", "edit", "delete"]}, {"module": "logs", "actions": ["view"]}]', 
 true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 9. Insertar categorías de ejemplo
INSERT INTO categories (id, name, description, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Tecnología', 'Productos tecnológicos y electrónicos', 'active', NOW()),
('00000000-0000-0000-0000-000000000002', 'Herramientas', 'Herramientas de trabajo y construcción', 'active', NOW()),
('00000000-0000-0000-0000-000000000003', 'Electrodomésticos', 'Electrodomésticos para el hogar', 'active', NOW()),
('00000000-0000-0000-0000-000000000004', 'Accesorios', 'Accesorios y complementos', 'active', NOW()),
('00000000-0000-0000-0000-000000000005', 'Audio y Video', 'Equipos de audio y video', 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- 10. Insertar productos de ejemplo
INSERT INTO products (id, name, description, category_id, brand, reference, price, cost, stock_warehouse, stock_store, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'SILICONA MÁGICAS 6 LITE', 'Silicona de alta calidad para sellado', '00000000-0000-0000-0000-000000000004', 'Mágicas', '923', 15000.00, 10000.00, 15, 5, 'active', NOW()),
('00000000-0000-0000-0000-000000000002', 'PISTOLA M416 FULL', 'Pistola de silicona profesional', '00000000-0000-0000-0000-000000000002', 'M416', '921', 45000.00, 30000.00, 5, 3, 'active', NOW()),
('00000000-0000-0000-0000-000000000003', 'MÁQUINA VGR 318', 'Máquina de soldar portátil', '00000000-0000-0000-0000-000000000002', 'VGR', '919', 250000.00, 200000.00, 2, 0, 'active', NOW()),
('00000000-0000-0000-0000-000000000004', 'TELEVISOR HARVIC 55 PULGADAS', 'Smart TV 55 pulgadas 4K', '00000000-0000-0000-0000-000000000003', 'Harvic', '112', 1200000.00, 1000000.00, 0, 0, 'active', NOW()),
('00000000-0000-0000-0000-000000000005', 'CELULAR NOTE 14 PRO 256GB', 'Smartphone de gama alta', '00000000-0000-0000-0000-000000000001', 'Note', '990', 800000.00, 650000.00, 0, 0, 'active', NOW()),
('00000000-0000-0000-0000-000000000006', 'POWER BANK V88 30.000 MAH', 'Batería externa de alta capacidad', '00000000-0000-0000-0000-000000000004', 'V88', '9', 85000.00, 60000.00, 10, 6, 'active', NOW()),
('00000000-0000-0000-0000-000000000007', 'VENTILADOR DE MANO', 'Ventilador portátil recargable', '00000000-0000-0000-0000-000000000003', 'CoolAir', '10', 45000.00, 30000.00, 80, 41, 'active', NOW()),
('00000000-0000-0000-0000-000000000008', 'PARLANTE GTS 1248', 'Parlante Bluetooth de alta potencia', '00000000-0000-0000-0000-000000000005', 'GTS', '12', 180000.00, 140000.00, 6, 5, 'active', NOW()),
('00000000-0000-0000-0000-000000000009', 'TELEVISOR HARVIC 43 PULGADAS', 'Smart TV 43 pulgadas Full HD', '00000000-0000-0000-0000-000000000003', 'Harvic', '915', 800000.00, 650000.00, 0, 0, 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- 11. Insertar clientes de ejemplo
INSERT INTO clients (id, name, email, phone, document, address, city, state, type, credit_limit, current_debt, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'TechStore Central', 'contacto@techstorecentral.com', '+52 55 1234 5678', '900123456-7', 'Calle 30 #25-15, Barrio La Palma', 'Sincelejo', 'Sucre', 'mayorista', 50000.00, 12500.00, 'active', NOW()),
('00000000-0000-0000-0000-000000000002', 'ElectroMax', 'ventas@electromax.com', '+52 55 9876 5432', '800987654-3', 'Carrera 15 #20-30, Centro', 'Sincelejo', 'Sucre', 'minorista', 25000.00, 8500.00, 'active', NOW()),
('00000000-0000-0000-0000-000000000003', 'María González', 'maria.gonzalez@email.com', '+52 55 5555 1234', '12345678', 'Calle 25 #15-20, Barrio El Prado', 'Sincelejo', 'Sucre', 'consumidor_final', 0.00, 0.00, 'active', NOW()),
('00000000-0000-0000-0000-000000000004', 'Distribuidora Norte', 'admin@distribuidoranorte.com', '+52 55 4444 7777', '700555666-1', 'Avenida 20 #35-10, Zona Industrial', 'Sincelejo', 'Sucre', 'mayorista', 75000.00, 0.00, 'active', NOW()),
('00000000-0000-0000-0000-000000000005', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+52 55 3333 9999', '87654321', 'Calle 10 #5-15, Barrio San José', 'Sincelejo', 'Sucre', 'consumidor_final', 0.00, 0.00, 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- 12. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_roles_system ON roles(is_system);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_document ON clients(document);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_reference ON products(reference);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- =============================================
-- 7. TABLA DE VENTAS
-- =============================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'credit', 'transfer', 'warranty', 'mixed')),
  invoice_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. TABLA DE ITEMS DE VENTA
-- =============================================
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. TABLA DE PAGOS
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  pending_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  last_payment_amount DECIMAL(12,2),
  last_payment_date TIMESTAMP WITH TIME ZONE,
  last_payment_user VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'completed', 'overdue')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 10. TABLA DE REGISTROS DE PAGO
-- =============================================
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'card')),
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 11. ÍNDICES PARA VENTAS
-- =============================================
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale_id ON payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_records_payment_id ON payment_records(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_payment_date ON payment_records(payment_date);
