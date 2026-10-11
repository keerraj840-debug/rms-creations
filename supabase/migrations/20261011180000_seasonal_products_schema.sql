-- Migration: 20261011180000_seasonal_products_schema.sql
-- Add price, selling_price, badge, and is_featured to products table for dynamic product management

ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 199,
  ADD COLUMN IF NOT EXISTS selling_price NUMERIC DEFAULT 199,
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Sync selling_price with price if null
UPDATE products SET selling_price = price WHERE selling_price IS NULL AND price IS NOT NULL;
UPDATE products SET price = selling_price WHERE price IS NULL AND selling_price IS NOT NULL;
