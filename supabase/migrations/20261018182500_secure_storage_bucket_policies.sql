-- Migration: 20261018182500_secure_storage_bucket_policies.sql
-- Description: Restrict INSERT, UPDATE, DELETE on storage.objects to Admins only.

DROP POLICY IF EXISTS "Auth Users Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Users Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Users Delete" ON storage.objects;

-- Admins only can upload, update, or delete objects in storage
CREATE POLICY "admin_storage_insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images' AND is_admin());

CREATE POLICY "admin_storage_update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND is_admin())
  WITH CHECK (bucket_id = 'images' AND is_admin());

CREATE POLICY "admin_storage_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' AND is_admin());
