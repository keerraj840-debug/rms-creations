-- 20261011170000_customer_auth_address_pincode.sql
-- 1. Add date_of_birth, auth_user_id to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;

-- 2. Add weight_kg to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg NUMERIC DEFAULT 0.5;

-- 3. Create customer_address table
CREATE TABLE IF NOT EXISTS customer_address (
  customer_address_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  address_type TEXT DEFAULT 'Home',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  pin_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);

-- 4. Create pin_code_availability table
CREATE TABLE IF NOT EXISTS pin_code_availability (
  pca_id BIGSERIAL PRIMARY KEY,
  pca_pin_code TEXT UNIQUE NOT NULL,
  pca_delivery_charges NUMERIC NOT NULL DEFAULT 49,
  pca_is_available BOOLEAN NOT NULL DEFAULT true,
  pca_state TEXT,
  pca_district TEXT,
  pca_delivery_charges_above_1kg NUMERIC NOT NULL DEFAULT 29,
  courier_service TEXT DEFAULT 'Express Courier',
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);

-- 5. Seed standard serviceable PIN codes
INSERT INTO pin_code_availability (pca_pin_code, pca_delivery_charges, pca_is_available, pca_state, pca_district, pca_delivery_charges_above_1kg, courier_service)
VALUES
  ('411001', 49, true, 'Maharashtra', 'Pune', 29, 'Delhivery Express'),
  ('411038', 49, true, 'Maharashtra', 'Pune (Kothrud)', 29, 'Delhivery Express'),
  ('400001', 49, true, 'Maharashtra', 'Mumbai', 29, 'BlueDart Express'),
  ('400050', 49, true, 'Maharashtra', 'Mumbai (Bandra)', 29, 'BlueDart Express'),
  ('400601', 49, true, 'Maharashtra', 'Thane', 29, 'Delhivery Express'),
  ('422001', 49, true, 'Maharashtra', 'Nashik', 29, 'Speed Post / Courier'),
  ('440001', 49, true, 'Maharashtra', 'Nagpur', 29, 'Speed Post / Courier'),
  ('416001', 49, true, 'Maharashtra', 'Kolhapur', 29, 'Delhivery Express'),
  ('431001', 49, true, 'Maharashtra', 'Chhatrapati Sambhajinagar', 29, 'Speed Post / Courier'),
  ('110001', 69, true, 'Delhi', 'New Delhi', 39, 'BlueDart Express'),
  ('560001', 69, true, 'Karnataka', 'Bengaluru', 39, 'Delhivery Express'),
  ('500001', 69, true, 'Telangana', 'Hyderabad', 39, 'Delhivery Express'),
  ('380001', 59, true, 'Gujarat', 'Ahmedabad', 35, 'BlueDart Express')
ON CONFLICT (pca_pin_code) DO NOTHING;
