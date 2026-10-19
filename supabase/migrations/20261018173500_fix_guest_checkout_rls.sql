-- Migration: Fix Guest & Customer Checkout RLS Policies
-- Enables seamless order placement for both authenticated customers and guest shoppers
-- while keeping strict admin-only restrictions for UPDATE and DELETE operations.

-- 1. purchase_order INSERT policy
DROP POLICY IF EXISTS "po_insert" ON public.purchase_order;

CREATE POLICY "po_insert" ON public.purchase_order
  FOR INSERT
  WITH CHECK (
    -- Order initial status guardrail: only allow new orders with confirmed or pending status
    (purchase_order_status IS NULL OR purchase_order_status IN ('confirmed', 'pending'))
    AND (
      -- Case A: Authenticated user placing order (customer_id matches user record, or is null, or admin)
      (
        auth.uid() IS NOT NULL
        AND (
          public.is_admin()
          OR customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1)
          OR customer_id IS NULL
        )
      )
      -- Case B: Guest shopper placing order without logging in
      OR (
        auth.uid() IS NULL
        AND customer_id IS NULL
      )
    )
  );

-- 2. purchase_order_details INSERT policy
DROP POLICY IF EXISTS "pod_insert" ON public.purchase_order_details;

CREATE POLICY "pod_insert" ON public.purchase_order_details
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR purchase_order_id IN (
      SELECT po.purchase_order_id
      FROM   public.purchase_order po
      WHERE (
        (po.customer_id IS NOT NULL AND po.customer_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1))
        OR (po.customer_id IS NULL AND po.creation_date >= (now() - interval '2 hours'))
      )
    )
  );

-- 3. order_notification_outbox INSERT policy
DROP POLICY IF EXISTS "outbox_insert_auth" ON public.order_notification_outbox;
DROP POLICY IF EXISTS "outbox_insert_order" ON public.order_notification_outbox;

CREATE POLICY "outbox_insert_order" ON public.order_notification_outbox
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR auth.uid() IS NOT NULL
    OR event_type IN ('order_created', 'status_updated')
  );
