-- Migration: 20261016200000_order_notification_outbox.sql
-- Transactional Notification Outbox & Trigger System for Reliable Order Notifications

-- 1. Create order_notification_outbox table
CREATE TABLE IF NOT EXISTS order_notification_outbox (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('order_created', 'order_status_updated', 'custom_quote_prepared')),
  purchase_order_id BIGINT,
  purchase_order_no TEXT NOT NULL,
  recipient_role TEXT NOT NULL CHECK (recipient_role IN ('admin', 'customer')),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  last_error TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  provider_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);

-- 2. Indexes for fast processing queue and audit lookup
CREATE INDEX IF NOT EXISTS idx_ono_status ON order_notification_outbox(status, created_at) WHERE status IN ('pending', 'failed');
CREATE INDEX IF NOT EXISTS idx_ono_order_no ON order_notification_outbox(purchase_order_no);
CREATE INDEX IF NOT EXISTS idx_ono_idempotency ON order_notification_outbox(idempotency_key);

-- 3. RLS Policies: Allow authenticated and anon read/insert, keep update for service role or admin
ALTER TABLE order_notification_outbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read outbox items" ON order_notification_outbox;
CREATE POLICY "Allow public read outbox items"
  ON order_notification_outbox FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated outbox inserts" ON order_notification_outbox;
CREATE POLICY "Allow authenticated outbox inserts"
  ON order_notification_outbox FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service outbox update" ON order_notification_outbox;
CREATE POLICY "Allow service outbox update"
  ON order_notification_outbox FOR UPDATE
  USING (true);

-- 4. Automatic Database Trigger to Enforce Outbox Record Creation on New Orders & Status Changes
CREATE OR REPLACE FUNCTION trg_purchase_order_notification_outbox()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_email TEXT;
  v_customer_name TEXT;
  v_item_summary TEXT;
  v_admin_email TEXT := 'rmsgifthampers@gmail.com';
  v_created_admin_key TEXT;
  v_created_customer_key TEXT;
  v_updated_customer_key TEXT;
BEGIN
  -- Extract customer email and name from shipping_remark if available
  v_customer_name := COALESCE(
    substring(NEW.shipping_remark from 'Customer:\s*([^|]+)'),
    'Valued Customer'
  );
  v_customer_email := COALESCE(
    substring(NEW.shipping_remark from 'Email:\s*([^|]+)'),
    'contact@rmscreations.com'
  );
  v_item_summary := COALESCE(
    substring(NEW.shipping_remark from 'Item:\s*(.+)'),
    'RMS Handcrafted Gift Hamper'
  );

  -- CASE A: NEW ORDER INSERTION
  IF (TG_OP = 'INSERT') THEN
    v_created_admin_key := 'created_admin_' || NEW.purchase_order_no;
    v_created_customer_key := 'created_customer_' || NEW.purchase_order_no;

    -- Outbox Entry 1: Admin Alert
    INSERT INTO order_notification_outbox (
      event_type, purchase_order_id, purchase_order_no, recipient_role,
      recipient_email, recipient_name, subject, template_data, idempotency_key
    ) VALUES (
      'order_created', NEW.purchase_order_id, NEW.purchase_order_no, 'admin',
      v_admin_email, 'RMS Admin Team',
      '🔔 New Order Received: #' || NEW.purchase_order_no || ' (₹' || NEW.payable_amount || ')',
      jsonb_build_object(
        'orderNo', NEW.purchase_order_no,
        'customerName', trim(v_customer_name),
        'customerEmail', trim(v_customer_email),
        'customerPhone', COALESCE(NEW.contact_no, ''),
        'itemSummary', trim(v_item_summary),
        'totalAmount', NEW.payable_amount,
        'paymentMode', COALESCE(NEW.payment_mode, 'Cash on Delivery'),
        'shippingAddress', COALESCE(NEW.shipping_address, ''),
        'pinCode', COALESCE(NEW.shipping_pin_code, ''),
        'orderDate', NEW.creation_date
      ),
      v_created_admin_key
    ) ON CONFLICT (idempotency_key) DO NOTHING;

    -- Outbox Entry 2: Customer Confirmation
    IF (v_customer_email IS NOT NULL AND v_customer_email LIKE '%@%') THEN
      INSERT INTO order_notification_outbox (
        event_type, purchase_order_id, purchase_order_no, recipient_role,
        recipient_email, recipient_name, subject, template_data, idempotency_key
      ) VALUES (
        'order_created', NEW.purchase_order_id, NEW.purchase_order_no, 'customer',
        trim(v_customer_email), trim(v_customer_name),
        '✨ Order Confirmation #' || NEW.purchase_order_no || ' - RMS Creations',
        jsonb_build_object(
          'orderNo', NEW.purchase_order_no,
          'customerName', trim(v_customer_name),
          'itemSummary', trim(v_item_summary),
          'totalAmount', NEW.payable_amount,
          'paymentMode', COALESCE(NEW.payment_mode, 'Cash on Delivery'),
          'shippingAddress', COALESCE(NEW.shipping_address, ''),
          'orderDate', NEW.creation_date
        ),
        v_created_customer_key
      ) ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;

  -- CASE B: ORDER STATUS UPDATE
  ELSIF (TG_OP = 'UPDATE' AND (OLD.purchase_order_status IS DISTINCT FROM NEW.purchase_order_status)) THEN
    v_updated_customer_key := 'status_upd_' || NEW.purchase_order_no || '_' || COALESCE(NEW.purchase_order_status, 'updated') || '_' || floor(extract(epoch from now()));

    IF (v_customer_email IS NOT NULL AND v_customer_email LIKE '%@%') THEN
      INSERT INTO order_notification_outbox (
        event_type, purchase_order_id, purchase_order_no, recipient_role,
        recipient_email, recipient_name, subject, template_data, idempotency_key
      ) VALUES (
        'order_status_updated', NEW.purchase_order_id, NEW.purchase_order_no, 'customer',
        trim(v_customer_email), trim(v_customer_name),
        '📦 Order #' || NEW.purchase_order_no || ' Status Update: ' || initcap(COALESCE(NEW.purchase_order_status, 'Updated')),
        jsonb_build_object(
          'orderNo', NEW.purchase_order_no,
          'customerName', trim(v_customer_name),
          'newStatus', COALESCE(NEW.purchase_order_status, 'Updated'),
          'oldStatus', COALESCE(OLD.purchase_order_status, 'Pending'),
          'totalAmount', NEW.payable_amount,
          'utrNo', COALESCE(NEW.utr_no, ''),
          'trackingRemark', COALESCE(NEW.cancellation_remark, NEW.shipping_remark, ''),
          'updateDate', now()
        ),
        v_updated_customer_key
      ) ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to purchase_order table
DROP TRIGGER IF EXISTS trg_po_notification_outbox ON purchase_order;
CREATE TRIGGER trg_po_notification_outbox
AFTER INSERT OR UPDATE ON purchase_order
FOR EACH ROW EXECUTE FUNCTION trg_purchase_order_notification_outbox();
