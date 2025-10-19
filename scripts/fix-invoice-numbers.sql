-- Script para arreglar los números de factura duplicados
-- Ejecutar en Supabase SQL Editor

-- Primero, vamos a ver qué ventas tenemos
SELECT id, created_at, invoice_number 
FROM sales 
ORDER BY created_at ASC;

-- Actualizar las ventas existentes con números únicos secuenciales
-- Esto asigna números 001, 002, 003, etc. basado en la fecha de creación
WITH numbered_sales AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM sales
)
UPDATE sales 
SET invoice_number = '#' || LPAD(numbered_sales.row_num::text, 3, '0')
FROM numbered_sales 
WHERE sales.id = numbered_sales.id;

-- Verificar el resultado
SELECT id, created_at, invoice_number 
FROM sales 
ORDER BY created_at ASC;

