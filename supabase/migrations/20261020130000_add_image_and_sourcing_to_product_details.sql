-- 20261020130000_add_image_and_sourcing_to_product_details.sql
-- Add image, sourcing platform, and price tracking columns to product_details

ALTER TABLE public.product_details ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.product_details ADD COLUMN IF NOT EXISTS sourcing_platform TEXT;
ALTER TABLE public.product_details ADD COLUMN IF NOT EXISTS sourcing_price NUMERIC;
ALTER TABLE public.product_details ADD COLUMN IF NOT EXISTS sourcing_url TEXT;

COMMENT ON COLUMN public.product_details.image IS 'URL of the item image or inclusion photo';
COMMENT ON COLUMN public.product_details.sourcing_platform IS 'Name of the cheapest online platform (e.g. Meesho, IndiaMART, JioMart, Amazon)';
COMMENT ON COLUMN public.product_details.sourcing_price IS 'Cost per unit when sourced from cheapest platform';
COMMENT ON COLUMN public.product_details.sourcing_url IS 'Direct link to buy or reorder the item from cheapest supplier';
