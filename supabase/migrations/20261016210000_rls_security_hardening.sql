-- ============================================================
-- Migration: 20261016210000_rls_security_hardening.sql
-- Purpose  : Enforce true Row Level Security across all tables.
--            Replaces permissive USING(true) policies with
--            principle-of-least-privilege policies keyed on
--            auth.uid() and users.auth_user_id column.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- SECTION 0 — Helper: is_admin() security-definer function
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.users
    WHERE  auth_user_id = auth.uid()
      AND  role        = 'admin'
      AND  is_active   = true
  );
$$;

-- ────────────────────────────────────────────────────────────
-- SECTION 1 — users table
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own"    ON public.users;
DROP POLICY IF EXISTS "users_insert_own"    ON public.users;
DROP POLICY IF EXISTS "users_update_own"    ON public.users;
DROP POLICY IF EXISTS "users_admin_all"     ON public.users;
DROP POLICY IF EXISTS "users_admin_delete"  ON public.users;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT
  WITH CHECK (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  USING (auth_user_id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (public.is_admin())
    OR (auth_user_id = auth.uid() AND role = 'customer' AND is_active = true)
  );

CREATE POLICY "users_admin_delete" ON public.users
  FOR DELETE
  USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 2 — purchase_order: replace USING(true) policies
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow all read on purchase_order"   ON public.purchase_order;
DROP POLICY IF EXISTS "Allow all insert on purchase_order" ON public.purchase_order;
DROP POLICY IF EXISTS "Allow all update on purchase_order" ON public.purchase_order;
DROP POLICY IF EXISTS "Allow all delete on purchase_order" ON public.purchase_order;

CREATE POLICY "po_select" ON public.purchase_order
  FOR SELECT
  USING (
    public.is_admin()
    OR customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "po_insert" ON public.purchase_order
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      public.is_admin()
      OR customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
      OR (customer_id IS NULL AND auth.uid() IS NOT NULL)
    )
  );

CREATE POLICY "po_update_admin" ON public.purchase_order
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "po_delete_admin" ON public.purchase_order
  FOR DELETE
  USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 3 — purchase_order_details: replace USING(true)
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow all read on purchase_order_details"   ON public.purchase_order_details;
DROP POLICY IF EXISTS "Allow all insert on purchase_order_details" ON public.purchase_order_details;
DROP POLICY IF EXISTS "Allow all update on purchase_order_details" ON public.purchase_order_details;
DROP POLICY IF EXISTS "Allow all delete on purchase_order_details" ON public.purchase_order_details;

CREATE POLICY "pod_select" ON public.purchase_order_details
  FOR SELECT
  USING (
    public.is_admin()
    OR purchase_order_id IN (
      SELECT po.purchase_order_id
      FROM   public.purchase_order po
      JOIN   public.users u ON u.id = po.customer_id
      WHERE  u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "pod_insert" ON public.purchase_order_details
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR purchase_order_id IN (
      SELECT po.purchase_order_id
      FROM   public.purchase_order po
      JOIN   public.users u ON u.id = po.customer_id
      WHERE  u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "pod_update_admin" ON public.purchase_order_details
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pod_delete_admin" ON public.purchase_order_details
  FOR DELETE
  USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 4 — customer_address
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.customer_address ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ca_select" ON public.customer_address;
DROP POLICY IF EXISTS "ca_insert" ON public.customer_address;
DROP POLICY IF EXISTS "ca_update" ON public.customer_address;
DROP POLICY IF EXISTS "ca_delete" ON public.customer_address;

CREATE POLICY "ca_select" ON public.customer_address
  FOR SELECT
  USING (
    public.is_admin()
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "ca_insert" ON public.customer_address
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "ca_update" ON public.customer_address
  FOR UPDATE
  USING (
    public.is_admin()
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  )
  WITH CHECK (
    public.is_admin()
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "ca_delete" ON public.customer_address
  FOR DELETE
  USING (
    public.is_admin()
    OR user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

-- ────────────────────────────────────────────────────────────
-- SECTION 5 — custom_hamper_requests
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.custom_hamper_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chr_select" ON public.custom_hamper_requests;
DROP POLICY IF EXISTS "chr_insert" ON public.custom_hamper_requests;
DROP POLICY IF EXISTS "chr_update" ON public.custom_hamper_requests;
DROP POLICY IF EXISTS "chr_delete" ON public.custom_hamper_requests;

CREATE POLICY "chr_select" ON public.custom_hamper_requests
  FOR SELECT
  USING (
    public.is_admin()
    OR customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "chr_insert" ON public.custom_hamper_requests
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR (auth.uid() IS NOT NULL AND (
      customer_id IS NULL
      OR customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
    ))
    OR (auth.uid() IS NULL AND customer_id IS NULL)
  );

CREATE POLICY "chr_update" ON public.custom_hamper_requests
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "chr_delete" ON public.custom_hamper_requests
  FOR DELETE
  USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 6 — custom_hamper_request_items
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.custom_hamper_request_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chri_select"        ON public.custom_hamper_request_items;
DROP POLICY IF EXISTS "chri_insert"        ON public.custom_hamper_request_items;
DROP POLICY IF EXISTS "chri_update_admin"  ON public.custom_hamper_request_items;
DROP POLICY IF EXISTS "chri_delete_admin"  ON public.custom_hamper_request_items;

CREATE POLICY "chri_select" ON public.custom_hamper_request_items
  FOR SELECT
  USING (
    public.is_admin()
    OR request_id IN (
      SELECT id FROM public.custom_hamper_requests chr
      WHERE chr.customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
    )
  );

CREATE POLICY "chri_insert" ON public.custom_hamper_request_items
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR request_id IN (
      SELECT id FROM public.custom_hamper_requests chr
      WHERE chr.customer_id IS NULL
         OR chr.customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
    )
  );

CREATE POLICY "chri_update_admin" ON public.custom_hamper_request_items
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "chri_delete_admin" ON public.custom_hamper_request_items
  FOR DELETE
  USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 7 — order_notification_outbox: restrict public read
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public read outbox items"     ON public.order_notification_outbox;
DROP POLICY IF EXISTS "Allow authenticated outbox inserts" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "Allow service outbox update"        ON public.order_notification_outbox;

CREATE POLICY "outbox_select_admin" ON public.order_notification_outbox
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "outbox_insert_auth" ON public.order_notification_outbox
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "outbox_update_admin" ON public.order_notification_outbox
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 8 — Catalog / config tables: public read, admin write
-- ────────────────────────────────────────────────────────────

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_public_read"   ON public.categories;
DROP POLICY IF EXISTS "categories_admin_insert"  ON public.categories;
DROP POLICY IF EXISTS "categories_admin_update"  ON public.categories;
DROP POLICY IF EXISTS "categories_admin_delete"  ON public.categories;
CREATE POLICY "categories_public_read"  ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "categories_admin_update" ON public.categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "categories_admin_delete" ON public.categories FOR DELETE USING (public.is_admin());

-- products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_public_read"   ON public.products;
DROP POLICY IF EXISTS "products_admin_insert"  ON public.products;
DROP POLICY IF EXISTS "products_admin_update"  ON public.products;
DROP POLICY IF EXISTS "products_admin_delete"  ON public.products;
CREATE POLICY "products_public_read"  ON public.products FOR SELECT USING (true);
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE USING (public.is_admin());

-- product_details
ALTER TABLE public.product_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "product_details_public_read"   ON public.product_details;
DROP POLICY IF EXISTS "product_details_admin_insert"  ON public.product_details;
DROP POLICY IF EXISTS "product_details_admin_update"  ON public.product_details;
DROP POLICY IF EXISTS "product_details_admin_delete"  ON public.product_details;
CREATE POLICY "product_details_public_read"  ON public.product_details FOR SELECT USING (true);
CREATE POLICY "product_details_admin_insert" ON public.product_details FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "product_details_admin_update" ON public.product_details FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "product_details_admin_delete" ON public.product_details FOR DELETE USING (public.is_admin());

-- banner_images
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "banner_images_public_read"   ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_insert"  ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_update"  ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_delete"  ON public.banner_images;
CREATE POLICY "banner_images_public_read"  ON public.banner_images FOR SELECT USING (true);
CREATE POLICY "banner_images_admin_insert" ON public.banner_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "banner_images_admin_update" ON public.banner_images FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "banner_images_admin_delete" ON public.banner_images FOR DELETE USING (public.is_admin());

-- app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "app_settings_public_read"   ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_insert"  ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_update"  ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_delete"  ON public.app_settings;
CREATE POLICY "app_settings_public_read"  ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "app_settings_admin_insert" ON public.app_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "app_settings_admin_update" ON public.app_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "app_settings_admin_delete" ON public.app_settings FOR DELETE USING (public.is_admin());

-- pin_code_availability
ALTER TABLE public.pin_code_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pca_public_read"   ON public.pin_code_availability;
DROP POLICY IF EXISTS "pca_admin_insert"  ON public.pin_code_availability;
DROP POLICY IF EXISTS "pca_admin_update"  ON public.pin_code_availability;
DROP POLICY IF EXISTS "pca_admin_delete"  ON public.pin_code_availability;
CREATE POLICY "pca_public_read"  ON public.pin_code_availability FOR SELECT USING (true);
CREATE POLICY "pca_admin_insert" ON public.pin_code_availability FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "pca_admin_update" ON public.pin_code_availability FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pca_admin_delete" ON public.pin_code_availability FOR DELETE USING (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- SECTION 9 — user_activity_log
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ual_insert_auth"   ON public.user_activity_log;
DROP POLICY IF EXISTS "ual_select_admin"  ON public.user_activity_log;
DROP POLICY IF EXISTS "ual_admin_update"  ON public.user_activity_log;
CREATE POLICY "ual_insert_auth"  ON public.user_activity_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ual_select_admin" ON public.user_activity_log FOR SELECT USING (public.is_admin());
CREATE POLICY "ual_admin_update" ON public.user_activity_log FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
