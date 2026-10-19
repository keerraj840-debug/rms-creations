-- Migration: 20261018182000_secure_unprotected_tables_and_functions.sql
-- Description: Enable RLS on addresses, orders, order_items, product_mappings and secure function search_paths.

-- 1. ADDRESSES
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "addresses_admin_all" ON public.addresses;
CREATE POLICY "addresses_admin_all" ON public.addresses
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "addresses_user_select" ON public.addresses;
CREATE POLICY "addresses_user_select" ON public.addresses
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

DROP POLICY IF EXISTS "addresses_user_insert" ON public.addresses;
CREATE POLICY "addresses_user_insert" ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

DROP POLICY IF EXISTS "addresses_user_update" ON public.addresses;
CREATE POLICY "addresses_user_update" ON public.addresses
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  )
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

DROP POLICY IF EXISTS "addresses_user_delete" ON public.addresses;
CREATE POLICY "addresses_user_delete" ON public.addresses
  FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

-- 2. ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all" ON public.orders
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "orders_user_select" ON public.orders;
CREATE POLICY "orders_user_select" ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
  );

-- 3. ORDER ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_admin_all" ON public.order_items;
CREATE POLICY "order_items_admin_all" ON public.order_items
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "order_items_user_select" ON public.order_items;
CREATE POLICY "order_items_user_select" ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
    )
  );

-- 4. PRODUCT MAPPINGS (Catalog relation)
ALTER TABLE public.product_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_mappings_public_select" ON public.product_mappings;
CREATE POLICY "product_mappings_public_select" ON public.product_mappings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "product_mappings_admin_write" ON public.product_mappings;
CREATE POLICY "product_mappings_admin_write" ON public.product_mappings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 5. FUNCTION SEARCH PATH HARDENING
ALTER FUNCTION public.is_admin() SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_purchase_order_notification_outbox() SET search_path = public, pg_temp;
