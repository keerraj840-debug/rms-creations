-- Migration: 20261011190000_custom_hamper_requests.sql
-- Dedicated tables for Build Your Own Hamper custom consultation requests

-- 1. Create custom_hamper_requests table
CREATE TABLE IF NOT EXISTS custom_hamper_requests (
  id BIGSERIAL PRIMARY KEY,
  request_no TEXT UNIQUE NOT NULL,
  customer_id BIGINT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Awaiting Customer', 'Quotation Prepared', 'Accepted', 'Declined', 'Completed')),
  occasion TEXT,
  theme TEXT,
  recipient_gender TEXT DEFAULT 'Unisex',
  personal_message TEXT,
  customer_notes TEXT,
  estimated_catalogue_total NUMERIC DEFAULT 0,
  quoted_total NUMERIC,
  quoted_delivery_charge NUMERIC DEFAULT 0,
  admin_response TEXT,
  admin_notes TEXT,
  reviewed_by BIGINT,
  reviewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  converted_purchase_order_id BIGINT,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);

-- 2. Create custom_hamper_request_items table
CREATE TABLE IF NOT EXISTS custom_hamper_request_items (
  id BIGSERIAL PRIMARY KEY,
  request_id BIGINT REFERENCES custom_hamper_requests(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('catalogue_product', 'catalogue_inclusion', 'custom_requested')),
  product_id BIGINT,
  inclusion_item_id BIGINT,
  item_name TEXT NOT NULL,
  item_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_snapshot NUMERIC,
  admin_confirmed_price NUMERIC,
  reference_image_url TEXT,
  is_confirmed_catalogue BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  updation_date TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for fast retrieval and query performance
CREATE INDEX IF NOT EXISTS idx_chr_request_no ON custom_hamper_requests(request_no);
CREATE INDEX IF NOT EXISTS idx_chr_customer_id ON custom_hamper_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_chr_status ON custom_hamper_requests(status);
CREATE INDEX IF NOT EXISTS idx_chr_creation_date ON custom_hamper_requests(creation_date DESC);
CREATE INDEX IF NOT EXISTS idx_chri_request_id ON custom_hamper_request_items(request_id);
