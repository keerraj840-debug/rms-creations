-- ============================================================
-- Migration: 20261016230000_fix_admin_permissions_and_banners.sql
-- Purpose  : 1. Harden and fix public.is_admin() to support direct
--               JWT email checks (rmsgifthampers@gmail.com), metadata
--               role claims, and email-based public.users lookup.
--            2. Allow auth_user_id self-linking in public.users on login.
--            3. Re-affirm banner_images RLS policies with exact admin check.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- SECTION 1: Fix and enhance public.is_admin()
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- 1. Direct match on primary store admin email from verified JWT claims
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) IN ('rmsgifthampers@gmail.com')
    -- 2. Metadata role claim
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    -- 3. Database users record matched by auth_user_id OR email
    OR EXISTS (
      SELECT 1
      FROM   public.users
      WHERE  (
               auth_user_id = auth.uid()
               OR (email IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
             )
        AND  role        = 'admin'
        AND  is_active   = true
    )
  );
$$;

-- ────────────────────────────────────────────────────────────
-- SECTION 2: Allow users to link their auth_user_id on login
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (
    auth_user_id = auth.uid()
    OR (email IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  USING (
    auth_user_id = auth.uid()
    OR (email IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
    OR (auth_user_id = auth.uid() AND is_active = true)
    OR (email IS NOT NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email') AND is_active = true)
  );

-- ────────────────────────────────────────────────────────────
-- SECTION 3: Sync admin role and link existing auth users
-- ────────────────────────────────────────────────────────────
UPDATE public.users
SET role = 'admin', is_active = true
WHERE LOWER(email) = 'rmsgifthampers@gmail.com';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    UPDATE public.users u
    SET auth_user_id = a.id
    FROM auth.users a
    WHERE LOWER(u.email) = LOWER(a.email)
      AND (u.auth_user_id IS NULL OR u.auth_user_id != a.id);
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- SECTION 4: Re-affirm banner_images RLS policies
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banner_images_public_read"   ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_insert"  ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_update"  ON public.banner_images;
DROP POLICY IF EXISTS "banner_images_admin_delete"  ON public.banner_images;

CREATE POLICY "banner_images_public_read"
  ON public.banner_images
  FOR SELECT
  USING (true);

CREATE POLICY "banner_images_admin_insert"
  ON public.banner_images
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "banner_images_admin_update"
  ON public.banner_images
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "banner_images_admin_delete"
  ON public.banner_images
  FOR DELETE
  USING (public.is_admin());
