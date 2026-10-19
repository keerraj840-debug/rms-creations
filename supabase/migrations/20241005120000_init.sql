-- 20241005120000_init.sql

-- Initial Supabase schema (no foreign keys, audit columns)

-- users
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT,
  email         TEXT UNIQUE,
  phone_no      TEXT,
  role          TEXT CHECK (role IN ('admin','customer')),
  gender        TEXT CHECK (gender IN ('male','female','other')),
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- categories
CREATE TABLE categories (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT,
  image         TEXT,
  description   TEXT,
  price         NUMERIC,
  gender        TEXT,
  from_date     DATE,
  to_date       DATE,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- products
CREATE TABLE products (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT,
  description   TEXT,
  images        TEXT[],
  category_id   BIGINT,
  gender        TEXT,
  from_date     DATE,
  to_date       DATE,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- banner_images
CREATE TABLE banner_images (
  id                     BIGSERIAL PRIMARY KEY,
  name                   TEXT,
  image                  TEXT,
  navigate_to_url_on_click TEXT,
  from_date              DATE,
  to_date                DATE,
  is_active              BOOLEAN DEFAULT true,
  creation_date          TIMESTAMPTZ DEFAULT now(),
  created_by             BIGINT,
  updation_date          TIMESTAMPTZ DEFAULT now(),
  updated_by             BIGINT
);

-- app_settings
CREATE TABLE app_settings (
  id               BIGSERIAL PRIMARY KEY,
  is_app_live      BOOLEAN,
  under_maintenance BOOLEAN,
  contact_no       TEXT,
  support_no       TEXT,
  support_email    TEXT,
  contact_email    TEXT,
  address          TEXT,
  whatsapp_no      TEXT,
  is_active        BOOLEAN DEFAULT true,
  creation_date    TIMESTAMPTZ DEFAULT now(),
  created_by       BIGINT,
  updation_date    TIMESTAMPTZ DEFAULT now(),
  updated_by       BIGINT
);

-- orders
CREATE TABLE orders (
  id            BIGSERIAL PRIMARY KEY,
  order_no      TEXT UNIQUE,
  order_total   NUMERIC,
  customer_id   BIGINT,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- order_items
CREATE TABLE order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT,
  product_id    BIGINT,
  price         NUMERIC,
  quantity      INTEGER,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- addresses
CREATE TABLE addresses (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT,
  address_line1 TEXT,
  address_line2 TEXT,
  city          TEXT,
  state         TEXT,
  postal_code   TEXT,
  country       TEXT,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- product_details
CREATE TABLE product_details (
  id            BIGSERIAL PRIMARY KEY,
  product_id    BIGINT,
  name          TEXT,
  description   TEXT,
  price         NUMERIC,
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);

-- user_activity_log
CREATE TABLE user_activity_log (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT,
  action        TEXT,
  entity        TEXT,
  entity_id     BIGINT,
  timestamp     TIMESTAMPTZ DEFAULT now(),
  is_active     BOOLEAN DEFAULT true,
  creation_date TIMESTAMPTZ DEFAULT now(),
  created_by    BIGINT,
  updation_date TIMESTAMPTZ DEFAULT now(),
  updated_by    BIGINT
);
