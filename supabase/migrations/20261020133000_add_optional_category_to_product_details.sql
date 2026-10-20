-- 20261020133000_add_optional_category_to_product_details.sql
-- Add optional category column to product_details (hamper items may or may not have categories)

ALTER TABLE public.product_details ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN public.product_details.category IS 'Optional classification category for hamper inclusion items (e.g. Dry Fruits & Nuts, Sweets & Snacks, Pooja & Diyas, Packaging & Keepsakes, etc.)';
