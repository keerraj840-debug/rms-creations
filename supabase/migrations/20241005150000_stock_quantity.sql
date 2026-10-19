-- Add stock_quantity column to product_details (optional, can be null or integer)
ALTER TABLE product_details ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;
