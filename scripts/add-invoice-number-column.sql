-- Script para agregar la columna invoice_number a la tabla sales
-- Ejecutar en Supabase SQL Editor

-- Agregar la columna invoice_number si no existe
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);

-- Crear un índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(invoice_number);

-- Actualizar las ventas existentes con números de factura secuenciales
-- Esto asigna números 001, 002, 003, etc. basado en la fecha de creación
WITH numbered_sales AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM sales
  WHERE invoice_number IS NULL
)
UPDATE sales 
SET invoice_number = '#' || LPAD(numbered_sales.row_num::text, 3, '0')
FROM numbered_sales 
WHERE sales.id = numbered_sales.id;

