-- Remove the direct relationship from product_details
ALTER TABLE product_details DROP COLUMN IF EXISTS product_id;

-- Create the mapping table (Many-to-Many) without Foreign Keys as requested
CREATE TABLE product_mappings (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT,
  product_detail_id BIGINT,
  quantity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);
