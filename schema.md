# Database Guide & Data Models — RMS Creations

> **What is this document?**  
> This document explains how data is organized in the database (Supabase) for **RMS Creations**. It explains each table, what it stores in plain English, and how tables connect together.

---

## 1. Simple Overview of the Database

The database acts like a collection of organized spreadsheets. Here is what the main tables do:

* **`products`**: The gift hampers and festive boxes you see on the website (e.g. "Ganpati Deluxe Hamper", "Birthday Pink Box").
* **`product_details`**: The smaller individual items that go inside the boxes (e.g. "Cashew Jar 200g", "Brass Diya", "Handmade Candle").
* **`product_mappings`**: The list that connects products to their contents. For example, it records that "Ganpati Deluxe Box" contains 1 Brass Diya and 1 Cashew Jar.
* **`categories`**: The sections of the website (e.g., "Ganpati Hampers", "Girls Hampers", "Return Gifts").
* **`purchase_order`**: Customer purchase orders and inquiries with order numbers, contact details, payment modes, shipping address, status lifecycle, and payable amounts. (Migrated from legacy `orders`).
* **`purchase_order_details`**: The specific items, hampers, quantities, and sale prices included in each customer order. (Migrated from legacy `order_items`).
* **`users`**: User and admin accounts (stores names, emails, and roles).
* **`app_settings`**: Store contact numbers, WhatsApp phone number, and maintenance mode toggle.
* **`banner_images`**: Big promotional pictures shown at the top of the home page.

---

## 2. Table Details (What Each Table Stores)

### 2.1 `products` (Gift Boxes & Hampers)
Stores all hampers displayed on the store.

| Column | What it stores (in plain English) |
|--------|-----------------------------------|
| `id` | Unique ID number for each hamper |
| `name` | Hamper name (e.g. "Ganpati Pooja Kit") |
| `description` | Description of the hamper and why it is special |
| `images` | List of photo links for the hamper |
| `category_id` | Which category it belongs to |
| `gender` | Audience tag (`all`, `female`, `male`, or `kids`) |
| `is_active` | `true` if visible to customers; `false` if hidden (draft) |
| `creation_date` | When the product was added |

---

### 2.2 `product_details` (Individual Items / Inclusions)
Stores single items that can be bundled into gift boxes.

| Column | What it stores (in plain English) |
|--------|-----------------------------------|
| `id` | Unique ID for the item |
| `name` | Item name (e.g. "Scented Candle", "Brass Diya") |
| `description` | Notes on the item |
| `price` | Individual price |
| `stock_quantity` | How many pieces are left in inventory |
| `is_active` | Whether this item is currently available |

---

### 2.3 `product_mappings` (What goes into each box)
Links a hamper to its items.

| Column | What it stores (in plain English) |
|--------|-----------------------------------|
| `id` | Unique ID for this mapping |
| `product_id` | Which hamper this belongs to |
| `product_detail_id` | Which single item is included |
| `quantity` | How many pieces of that item are in the box (e.g. 2 Diyas) |
| `is_active` | Active flag |

---

### 2.4 `categories` (Store Sections)
Organizes the website into clean sections.

| Column | What it stores (in plain English) |
|--------|-----------------------------------|
| `id` | Category ID |
| `name` | Category title (e.g. "Ganpati Specials", "Return Gifts") |
| `image` | Banner photo for the category |
| `description` | Short explanation of this collection |
| `is_active` | Whether this category is shown on the website |

---

### 2.5 `purchase_order` & `purchase_order_details` (Customer Purchases)

#### `purchase_order`
Primary order header table storing customer purchases, WhatsApp inquiries, payments, and order fulfillment status.

| Column | Type | What it stores (in plain English) |
|--------|------|-----------------------------------|
| `purchase_order_id` | `BIGINT PRIMARY KEY` | Order unique ID |
| `purchase_order_no` | `VARCHAR(100)` | Customer order tracking code (e.g. `ORD-58593`) |
| `purchase_order_date` | `TIMESTAMPTZ` | Timestamp when order was placed |
| `purchase_order_status` | `VARCHAR(50)` | Status lifecycle (`pending`, `confirmed`, `accepted`, `shipped`, `delivered`, `cancelled`) |
| `payment_mode` | `VARCHAR(100)` | Payment method (e.g. WhatsApp / COD, UPI, Card) |
| `customer_id` | `BIGINT` | Customer user account ID (if registered) |
| `contact_no` | `VARCHAR(50)` | Phone or WhatsApp contact number |
| `shipping_type` | `VARCHAR(100)` | Shipping method (Standard, Express, Concierge) |
| `shipping_address` | `TEXT` | Street delivery address |
| `shipping_state` | `VARCHAR(100)` | Delivery state |
| `shipping_country` | `VARCHAR(100)` | Delivery country (defaults to India) |
| `shipping_pin_code` | `VARCHAR(20)` | Postal / PIN code |
| `item_taxable_amount` | `NUMERIC(12,2)` | Taxable item subtotal |
| `item_tax_amount` | `NUMERIC(12,2)` | Tax amount on items |
| `delivery_amount` | `NUMERIC(12,2)` | Shipping / delivery charge |
| `delivery_tax_amount` | `NUMERIC(12,2)` | Tax on delivery |
| `total_amount` | `NUMERIC(12,2)` | Pre-discount / subtotal amount |
| `rounding_amount` | `NUMERIC(12,2)` | Decimal rounding adjustment |
| `payable_amount` | `NUMERIC(12,2)` | Final amount payable in Rupees (`₹`) |
| `transaction_no` | `VARCHAR(100)` | Bank or gateway transaction reference |
| `transaction_status` | `VARCHAR(50)` | Payment status (Success, Pending, Failed) |
| `utr_no` | `VARCHAR(100)` | UPI / Bank UTR transfer number |
| `order_acceptance_date` | `TIMESTAMPTZ` | Date order accepted by store admin |
| `order_accepted_by` | `BIGINT` | Admin user ID who accepted the order |
| `order_shipping_date` | `TIMESTAMPTZ` | Date parcel dispatched |
| `order_shipped_by` | `BIGINT` | Admin user ID who dispatched the parcel |
| `order_delivery_date` | `TIMESTAMPTZ` | Date parcel delivered to customer |
| `order_delivered_by` | `BIGINT` | Admin user ID or courier confirming delivery |
| `cancellation_remark` | `TEXT` | Reason if order is cancelled |
| `shipping_remark` | `TEXT` | Courier / packaging notes |
| `hon_points` | `INTEGER` | Loyalty reward points earned/applied |
| `refund_remark` | `TEXT` | Refund notes if applicable |
| `delivery_remark` | `TEXT` | Special courier delivery instructions |
| `is_active` | `BOOLEAN` | Active status flag |
| `creation_date` | `TIMESTAMPTZ` | Record creation timestamp |
| `created_by` | `BIGINT` | User ID who created the record |
| `updation_date` | `TIMESTAMPTZ` | Last update timestamp |
| `updated_by` | `BIGINT` | User ID who last updated the record |

#### `purchase_order_details`
Line items table recording each item purchased in an order.

| Column | Type | What it stores (in plain English) |
|--------|------|-----------------------------------|
| `purchase_order_details_id` | `BIGINT PRIMARY KEY` | Line item unique ID |
| `purchase_order_id` | `BIGINT REFERENCES purchase_order` | Foreign key linking to parent purchase order |
| `item_id` | `BIGINT` | Purchased product or hamper ID (references `products.id`) |
| `item_sale_price` | `NUMERIC(12,2)` | Sale price per unit in Rupees (`₹`) |
| `item_quantity` | `INTEGER` | Number of units purchased |
| `item_tax_rate` | `NUMERIC(5,2)` | Tax rate applied (percentage) |
| `item_tax` | `NUMERIC(12,2)` | Tax amount for this line item |
| `item_taxable` | `NUMERIC(12,2)` | Taxable value for this line item |
| `item_total` | `NUMERIC(12,2)` | Total price for this line item (`quantity * price`) |
| `item_rating` | `INTEGER` | Customer review score (1–5 stars) |
| `item_rating_description` | `TEXT` | Customer review comment |
| `is_active` | `BOOLEAN` | Active line item flag |
| `creation_date` | `TIMESTAMPTZ` | Record creation timestamp |
| `created_by` | `BIGINT` | User ID who created the line item |
| `updation_date` | `TIMESTAMPTZ` | Last update timestamp |
| `updated_by` | `BIGINT` | User ID who updated the line item |

*(Note: Historical data from legacy tables `orders` and `order_items` has been migrated into `purchase_order` and `purchase_order_details`. Legacy tables are preserved intact for rollback safety.)*

---

### 2.6 `app_settings` (Store Settings)
Controls contact info and store status.

| Column | What it stores (in plain English) |
|--------|-----------------------------------|
| `id` | Settings ID |
| `is_app_live` | Whether the website is open for customers |
| `under_maintenance` | Turn on if doing updates to show a friendly "Back Soon" screen |
| `contact_no` | Main store phone number |
| `whatsapp_no` | WhatsApp number where orders are received |
| `support_email` | Help email address |
| `address` | Physical boutique studio address |

---

## 3. Storage Folders (Where Photos are Kept)

* **`products` folder:** Keeps all cropped photos of gift hampers.
* **`banner_images` folder:** Keeps festive hero banners and promotional posters.
