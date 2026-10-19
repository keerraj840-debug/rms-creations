-- 20241005160000_purchase_order_merge.sql
-- Create purchase_order and purchase_order_details tables and merge existing orders and order_items

-- 1. Create purchase_order table
CREATE TABLE IF NOT EXISTS purchase_order (
  purchase_order_id BIGSERIAL PRIMARY KEY,
  purchase_order_no TEXT UNIQUE,
  purchase_order_date TIMESTAMPTZ DEFAULT now(),
  purchase_order_status TEXT DEFAULT 'pending',
  payment_mode TEXT,
  customer_id BIGINT,
  contact_no TEXT,
  shipping_type TEXT,
  shipping_address TEXT,
  shipping_state TEXT,
  shipping_country TEXT DEFAULT 'India',
  shipping_pin_code TEXT,
  item_taxable_amount NUMERIC DEFAULT 0,
  item_tax_amount NUMERIC DEFAULT 0,
  delivery_amount NUMERIC DEFAULT 0,
  delivery_tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  rounding_amount NUMERIC DEFAULT 0,
  payable_amount NUMERIC NOT NULL DEFAULT 0,
  transaction_no TEXT,
  transaction_status TEXT,
  utr_no TEXT,
  order_acceptance_date TIMESTAMPTZ,
  order_accepted_by BIGINT,
  order_shipping_date TIMESTAMPTZ,
  order_shipped_by BIGINT,
  order_delivery_date TIMESTAMPTZ,
  order_delivered_by BIGINT,
  cancellation_remark TEXT,
  shipping_remark TEXT,
  hon_points NUMERIC DEFAULT 0,
  refund_remark TEXT,
  delivery_remark TEXT,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);

-- 2. Create purchase_order_details table
CREATE TABLE IF NOT EXISTS purchase_order_details (
  purchase_order_details_id BIGSERIAL PRIMARY KEY,
  purchase_order_id BIGINT REFERENCES purchase_order(purchase_order_id) ON DELETE CASCADE,
  item_id BIGINT,
  item_sale_price NUMERIC NOT NULL DEFAULT 0,
  item_quantity INTEGER NOT NULL DEFAULT 1,
  item_tax_rate NUMERIC DEFAULT 0,
  item_tax NUMERIC DEFAULT 0,
  item_taxable NUMERIC DEFAULT 0,
  item_total NUMERIC DEFAULT 0,
  item_rating NUMERIC,
  item_rating_description TEXT,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by BIGINT
);

-- 3. Migrate existing records from orders -> purchase_order
INSERT INTO purchase_order (
  purchase_order_id,
  purchase_order_no,
  purchase_order_date,
  purchase_order_status,
  customer_id,
  total_amount,
  payable_amount,
  is_active,
  creation_date,
  created_by,
  updation_date,
  updated_by
)
SELECT
  o.id,
  o.order_no,
  o.creation_date,
  CASE WHEN o.is_active THEN 'confirmed' ELSE 'pending' END,
  o.customer_id,
  COALESCE(o.order_total, 0),
  COALESCE(o.order_total, 0),
  o.is_active,
  o.creation_date,
  o.created_by,
  o.updation_date,
  o.updated_by
FROM orders o
ON CONFLICT (purchase_order_id) DO NOTHING;

-- 4. Backfill any historical order IDs present in order_items but missing from orders
INSERT INTO purchase_order (
  purchase_order_id,
  purchase_order_no,
  purchase_order_date,
  purchase_order_status,
  total_amount,
  payable_amount,
  is_active,
  creation_date,
  updation_date
)
SELECT
  oi.order_id,
  'HIST-ORD-' || oi.order_id,
  MIN(oi.creation_date),
  'confirmed',
  SUM(COALESCE(oi.price, 0) * COALESCE(oi.quantity, 1)),
  SUM(COALESCE(oi.price, 0) * COALESCE(oi.quantity, 1)),
  true,
  MIN(oi.creation_date),
  MIN(oi.updation_date)
FROM order_items oi
WHERE oi.order_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM purchase_order po WHERE po.purchase_order_id = oi.order_id)
GROUP BY oi.order_id
ON CONFLICT (purchase_order_id) DO NOTHING;

-- 5. Migrate order_items -> purchase_order_details
INSERT INTO purchase_order_details (
  purchase_order_details_id,
  purchase_order_id,
  item_id,
  item_sale_price,
  item_quantity,
  item_total,
  is_active,
  creation_date,
  created_by,
  updation_date,
  updated_by
)
SELECT
  oi.id,
  oi.order_id,
  oi.product_id,
  COALESCE(oi.price, 0),
  COALESCE(oi.quantity, 1),
  COALESCE(oi.price, 0) * COALESCE(oi.quantity, 1),
  COALESCE(oi.is_active, true),
  oi.creation_date,
  oi.created_by,
  oi.updation_date,
  oi.updated_by
FROM order_items oi
WHERE oi.order_id IN (SELECT purchase_order_id FROM purchase_order)
ON CONFLICT (purchase_order_details_id) DO NOTHING;

-- 6. Adjust sequences to prevent ID collisions on future inserts
SELECT setval('purchase_order_purchase_order_id_seq', GREATEST((SELECT COALESCE(MAX(purchase_order_id), 0) FROM purchase_order), 10));
SELECT setval('purchase_order_details_purchase_order_details_id_seq', GREATEST((SELECT COALESCE(MAX(purchase_order_details_id), 0) FROM purchase_order_details), 10));

-- 7. Grant access and enable RLS
ALTER TABLE purchase_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_details ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order' AND policyname = 'Allow all read on purchase_order') THEN
    CREATE POLICY "Allow all read on purchase_order" ON purchase_order FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order' AND policyname = 'Allow all insert on purchase_order') THEN
    CREATE POLICY "Allow all insert on purchase_order" ON purchase_order FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order' AND policyname = 'Allow all update on purchase_order') THEN
    CREATE POLICY "Allow all update on purchase_order" ON purchase_order FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order' AND policyname = 'Allow all delete on purchase_order') THEN
    CREATE POLICY "Allow all delete on purchase_order" ON purchase_order FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order_details' AND policyname = 'Allow all read on purchase_order_details') THEN
    CREATE POLICY "Allow all read on purchase_order_details" ON purchase_order_details FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order_details' AND policyname = 'Allow all insert on purchase_order_details') THEN
    CREATE POLICY "Allow all insert on purchase_order_details" ON purchase_order_details FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order_details' AND policyname = 'Allow all update on purchase_order_details') THEN
    CREATE POLICY "Allow all update on purchase_order_details" ON purchase_order_details FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'purchase_order_details' AND policyname = 'Allow all delete on purchase_order_details') THEN
    CREATE POLICY "Allow all delete on purchase_order_details" ON purchase_order_details FOR DELETE USING (true);
  END IF;
END $$;
