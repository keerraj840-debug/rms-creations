-- 20261019230500_set_ratnagiri_taluka_pincodes_30.sql
-- Set Ratnagiri Taluka postal PIN codes to ₹30 base delivery charge

INSERT INTO pin_code_availability (
  pca_pin_code,
  pca_delivery_charges,
  pca_is_available,
  pca_state,
  pca_district,
  pca_delivery_charges_above_1kg,
  courier_service,
  is_active
)
VALUES
  ('415612', 30, true, 'Maharashtra', 'Ratnagiri (City / H.O / Kuwarbav)', 20, 'Local Express Delivery', true),
  ('415613', 30, true, 'Maharashtra', 'Ratnagiri (Shirgaon / Mirya)', 20, 'Local Express Delivery', true),
  ('415615', 30, true, 'Maharashtra', 'Ratnagiri (Hatkhamba / Pali)', 20, 'Local Express Delivery', true),
  ('415616', 30, true, 'Maharashtra', 'Ratnagiri (Pawas / Bhatye / Golap)', 20, 'Local Express Delivery', true),
  ('415617', 30, true, 'Maharashtra', 'Ratnagiri (Jaigad / Ganpatipule)', 20, 'Local Express Delivery', true),
  ('415620', 30, true, 'Maharashtra', 'Ratnagiri (Kotawade / Malgund)', 20, 'Local Express Delivery', true),
  ('415629', 30, true, 'Maharashtra', 'Ratnagiri (Tiware / Kondye)', 20, 'Local Express Delivery', true),
  ('415639', 30, true, 'Maharashtra', 'Ratnagiri (Zadgaon / MIDC)', 20, 'Local Express Delivery', true),
  ('415640', 30, true, 'Maharashtra', 'Ratnagiri (Ranpar / Finolex)', 20, 'Local Express Delivery', true)
ON CONFLICT (pca_pin_code) DO UPDATE SET
  pca_delivery_charges = 30,
  pca_delivery_charges_above_1kg = 20,
  pca_is_available = true,
  pca_state = 'Maharashtra',
  pca_district = EXCLUDED.pca_district,
  courier_service = 'Local Express Delivery',
  is_active = true,
  updation_date = now();
