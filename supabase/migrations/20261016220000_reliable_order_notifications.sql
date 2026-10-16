-- ==============================================================================
-- Migration: 20261016220000_reliable_order_notifications.sql
-- Production-Grade Transactional Notification Outbox & Trigger System
-- Features: Strict RLS, Atomic Idempotency Keys, Multi-Recipient Support,
-- Dynamic Admin Settings Lookup, and Real Status Lifecycle Tracking.
-- ==============================================================================

-- 1. Create order_notification_outbox table (if not exists)
CREATE TABLE IF NOT EXISTS public.order_notification_outbox (
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

-- 2. Performance & Idempotency Indexes
CREATE INDEX IF NOT EXISTS idx_ono_status_pending ON public.order_notification_outbox(status, created_at) WHERE status IN ('pending', 'processing', 'failed');
CREATE INDEX IF NOT EXISTS idx_ono_order_no ON public.order_notification_outbox(purchase_order_no);
CREATE INDEX IF NOT EXISTS idx_ono_idempotency_key ON public.order_notification_outbox(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_ono_recipient_email ON public.order_notification_outbox(recipient_email);

-- 3. Strict Row Level Security (RLS)
ALTER TABLE public.order_notification_outbox ENABLE ROW LEVEL SECURITY;

-- Clean existing broad policies
DROP POLICY IF EXISTS "Allow public read outbox items" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "Allow authenticated outbox inserts" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "Allow service outbox update" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "ono_admin_all" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "ono_customer_select" ON public.order_notification_outbox;

-- Admins can view and manage all notification entries
CREATE POLICY "ono_admin_all"
  ON public.order_notification_outbox
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authenticated customers can ONLY inspect their OWN notifications
CREATE POLICY "ono_customer_select"
  ON public.order_notification_outbox
  FOR SELECT
  TO authenticated
  USING (
    recipient_email = auth.jwt() ->> 'email'
  );

-- 4. Database Trigger Function for Transactional Outbox Enqueueing
CREATE OR REPLACE FUNCTION public.trg_purchase_order_notification_outbox()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_email TEXT;
  v_customer_name TEXT;
  v_item_summary TEXT;
  v_admin_email TEXT := 'rmsgifthampers@gmail.com';
  v_created_admin_key TEXT;
  v_created_customer_key TEXT;
  v_updated_customer_key TEXT;
  v_status_title TEXT;
  v_status_explainer TEXT;
  v_setting_email TEXT;
BEGIN
  -- A. Resolve Admin Email dynamically from app_settings if configured
  BEGIN
    SELECT COALESCE(support_email, contact_email) INTO v_setting_email
    FROM public.app_settings
    WHERE is_active = true
    LIMIT 1;

    IF v_setting_email IS NOT NULL AND v_setting_email LIKE '%@%' THEN
      v_admin_email := trim(v_setting_email);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_admin_email := 'rmsgifthampers@gmail.com';
  END;

  -- B. Resolve Customer Details
  -- Step 1: Try resolving from users table if customer_id is provided
  IF NEW.customer_id IS NOT NULL THEN
    SELECT email, name INTO v_customer_email, v_customer_name
    FROM public.users
    WHERE id = NEW.customer_id;
  END IF;

  -- Step 2: Fallback to metadata in shipping_remark if users table didn't have it
  IF v_customer_email IS NULL OR v_customer_email NOT LIKE '%@%' THEN
    v_customer_email := substring(NEW.shipping_remark from 'Email:\s*([^|]+)');
  END IF;

  IF v_customer_name IS NULL OR length(trim(v_customer_name)) = 0 THEN
    v_customer_name := substring(NEW.shipping_remark from 'Customer:\s*([^|]+)');
  END IF;

  -- Sensible clean fallbacks
  v_customer_name := COALESCE(trim(v_customer_name), 'Valued Customer');
  v_customer_email := trim(v_customer_email);
  v_item_summary := COALESCE(substring(NEW.shipping_remark from 'Item:\s*(.+)'), 'Handcrafted Gift Hamper');

  -- =========================================================================
  -- CASE 1: NEW ORDER INSERTION
  -- =========================================================================
  IF (TG_OP = 'INSERT') THEN
    v_created_admin_key := 'created_admin_' || NEW.purchase_order_no;
    v_created_customer_key := 'created_customer_' || NEW.purchase_order_no;

    -- Notification 1: Administrator Alert
    INSERT INTO public.order_notification_outbox (
      event_type, purchase_order_id, purchase_order_no, recipient_role,
      recipient_email, recipient_name, subject, template_data, idempotency_key
    ) VALUES (
      'order_created', NEW.purchase_order_id, NEW.purchase_order_no, 'admin',
      v_admin_email, 'RMS Admin Team',
      '🔔 New Order Received: #' || NEW.purchase_order_no || ' (₹' || NEW.payable_amount || ')',
      jsonb_build_object(
        'orderNo', NEW.purchase_order_no,
        'customerName', v_customer_name,
        'customerEmail', COALESCE(v_customer_email, 'No email recorded'),
        'customerPhone', COALESCE(NEW.contact_no, ''),
        'itemSummary', v_item_summary,
        'totalAmount', NEW.payable_amount,
        'paymentMode', COALESCE(NEW.payment_mode, 'Cash on Delivery'),
        'shippingAddress', COALESCE(NEW.shipping_address, ''),
        'pinCode', COALESCE(NEW.shipping_pin_code, ''),
        'orderDate', COALESCE(NEW.purchase_order_date, NEW.creation_date, now())
      ),
      v_created_admin_key
    ) ON CONFLICT (idempotency_key) DO NOTHING;

    -- Notification 2: Customer Order Confirmation (only if valid email)
    IF (v_customer_email IS NOT NULL AND v_customer_email LIKE '%@%') THEN
      INSERT INTO public.order_notification_outbox (
        event_type, purchase_order_id, purchase_order_no, recipient_role,
        recipient_email, recipient_name, subject, template_data, idempotency_key
      ) VALUES (
        'order_created', NEW.purchase_order_id, NEW.purchase_order_no, 'customer',
        v_customer_email, v_customer_name,
        '✨ Order Confirmation #' || NEW.purchase_order_no || ' - RMS Creations',
        jsonb_build_object(
          'orderNo', NEW.purchase_order_no,
          'customerName', v_customer_name,
          'itemSummary', v_item_summary,
          'totalAmount', NEW.payable_amount,
          'paymentMode', COALESCE(NEW.payment_mode, 'Cash on Delivery'),
          'shippingAddress', COALESCE(NEW.shipping_address, ''),
          'orderDate', COALESCE(NEW.purchase_order_date, NEW.creation_date, now())
        ),
        v_created_customer_key
      ) ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;

  -- =========================================================================
  -- CASE 2: ORDER STATUS UPDATED BY ADMIN
  -- =========================================================================
  ELSIF (TG_OP = 'UPDATE' AND (OLD.purchase_order_status IS DISTINCT FROM NEW.purchase_order_status)) THEN
    
    -- Map status to human-friendly title and explanation
    CASE lower(COALESCE(NEW.purchase_order_status, ''))
      WHEN 'confirmed' THEN
        v_status_title := 'Confirmed';
        v_status_explainer := 'Your order has been verified and confirmed. Our team is preparing your gift hamper.';
      WHEN 'accepted' THEN
        v_status_title := 'Accepted';
        v_status_explainer := 'Your order has been accepted and is currently in our artisan handcrafted packaging queue.';
      WHEN 'packed' THEN
        v_status_title := 'Packed & Ready';
        v_status_explainer := 'Your gift hamper has been hand-assembled, partitioned, ribbon-wrapped, and is ready for courier dispatch.';
      WHEN 'shipped' THEN
        v_status_title := 'Dispatched / Shipped';
        v_status_explainer := 'Your package has been dispatched! Courier tracking details are provided below.';
      WHEN 'delivered' THEN
        v_status_title := 'Delivered';
        v_status_explainer := 'Your gift hamper has been delivered successfully. Thank you for choosing RMS Creations!';
      WHEN 'cancelled' THEN
        v_status_title := 'Cancelled';
        v_status_explainer := 'Your order has been cancelled. If you have any questions, our support team is ready to assist.';
      ELSE
        v_status_title := initcap(COALESCE(NEW.purchase_order_status, 'Updated'));
        v_status_explainer := 'Your order status has been updated to ' || v_status_title || '.';
    END CASE;

    v_updated_customer_key := 'status_upd_' || NEW.purchase_order_no || '_' || lower(COALESCE(NEW.purchase_order_status, 'updated')) || '_' || floor(extract(epoch from now()));

    IF (v_customer_email IS NOT NULL AND v_customer_email LIKE '%@%') THEN
      INSERT INTO public.order_notification_outbox (
        event_type, purchase_order_id, purchase_order_no, recipient_role,
        recipient_email, recipient_name, subject, template_data, idempotency_key
      ) VALUES (
        'order_status_updated', NEW.purchase_order_id, NEW.purchase_order_no, 'customer',
        v_customer_email, v_customer_name,
        '📦 Order #' || NEW.purchase_order_no || ' Status Update: ' || v_status_title,
        jsonb_build_object(
          'orderNo', NEW.purchase_order_no,
          'customerName', v_customer_name,
          'newStatus', v_status_title,
          'oldStatus', initcap(COALESCE(OLD.purchase_order_status, 'Pending')),
          'statusExplainer', v_status_explainer,
          'totalAmount', NEW.payable_amount,
          'utrNo', COALESCE(NEW.utr_no, ''),
          'trackingRemark', COALESCE(NEW.shipping_remark, NEW.cancellation_remark, ''),
          'updateDate', now()
        ),
        v_updated_customer_key
      ) ON CONFLICT (idempotency_key) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger to purchase_order Table
DROP TRIGGER IF EXISTS trg_po_notification_outbox ON public.purchase_order;
CREATE TRIGGER trg_po_notification_outbox
AFTER INSERT OR UPDATE ON public.purchase_order
FOR EACH ROW EXECUTE FUNCTION public.trg_purchase_order_notification_outbox();
