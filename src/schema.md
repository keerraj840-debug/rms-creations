# Database Schema (No Foreign Keys)

All tables share the same audit columns (5 columns):
- `is_active` BOOLEAN DEFAULT true
- `creation_date` TIMESTAMP WITH TIME ZONE DEFAULT now()
- `created_by` BIGINT (user id who created the row)
- `updation_date` TIMESTAMP WITH TIME ZONE DEFAULT now()
- `updated_by` BIGINT (user id who last updated the row)

Each table also has an auto‑incrementing primary key `id` (BIGSERIAL).

---
## 1. users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone_no TEXT,
  role TEXT CHECK (role IN ('admin','customer')),
  gender TEXT CHECK (gender IN ('male','female','other')),
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 2. categories
```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  image TEXT,
  description TEXT,
  price NUMERIC,
  gender TEXT,
  from_date DATE,
  to_date DATE,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 3. products
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  images TEXT[],
  category_id BIGINT, -- plain column, no FK
  gender TEXT,
  from_date DATE,
  to_date DATE,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 4. banner_images
```sql
CREATE TABLE banner_images (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  image TEXT,
  navigate_to_url_on_click TEXT,
  from_date DATE,
  to_date DATE,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 5. app_settings
```sql
CREATE TABLE app_settings (
  id BIGSERIAL PRIMARY KEY,
  is_app_live BOOLEAN,
  under_maintenance BOOLEAN,
  contact_no TEXT,
  support_no TEXT,
  support_email TEXT,
  contact_email TEXT,
  address TEXT,
  whatsapp_no TEXT,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 6. orders
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_no TEXT UNIQUE,
  order_total NUMERIC,
  customer_id BIGINT, -- plain reference, no FK
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 7. order_items
```sql
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  price NUMERIC,
  quantity INTEGER,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 8. addresses
```sql
CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 9. product_details
```sql
CREATE TABLE product_details (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT,
  name TEXT,
  description TEXT,
  price NUMERIC,
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
## 10. user_activity_log
```sql
CREATE TABLE user_activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  action TEXT,
  entity TEXT,
  entity_id BIGINT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT,
  updation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by BIGINT
);
```
---
**Notes**
- No foreign‑key constraints are defined; columns that would normally reference another table are plain `BIGINT` fields.
- Every table includes the five mandatory audit columns plus an `id` primary key.
- These definitions can be executed in Supabase SQL editor to create the schema.
