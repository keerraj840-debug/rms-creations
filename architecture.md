# System Architecture & Code Map — RMS Creations

> **What is this document?**  
> This document explains how the code for **RMS Creations** is organized, where different files live, and how data moves when a customer or store owner uses the website.

---

## 1. How the System Fits Together

```
  1. CUSTOMER'S DEVICE (Mobile or Laptop)
     Visits the website to browse hampers, pooja kits, or track orders.
                       │
                       ▼
  2. ANGULAR FRONTEND (src/app/)
     Shows pages, handles button clicks, switches light/dark mode,
     and creates WhatsApp message links.
                       │
                       ▼
  3. SUPABASE CLOUD (Database & Files)
     Stores product details, orders, store settings, and uploaded photos.
```

---

## 2. Where to Find Files in the Codebase

Here is a simple map of where things live:

* **`src/app/pages/` — The Screens (What Users See):**
  * `home-page.component.ts` — The main home page.
  * `ganpati-hampers-page.component.ts` — Ganesh festival pooja kit showcase.
  * `hampers-page.component.ts` & `folder-gallery-page.component.ts` — Gift hamper catalogs.
  * `return-gift-page.component.ts` & `return-gift-detail-page.component.ts` — Bulk gifts with discount calculator.
  * `gallery-page.component.ts` — Photo lookbook.
  * `contact-page.component.ts` — Contact details and form.
  * `admin-dashboard-page.component.ts` — Store owner's summary dashboard.
  * `admin-products-page.component.ts` & `admin-product-form-page.component.ts` — Product catalog manager and editor.
  * `admin-orders-page.component.ts` — Customer orders manager.
  * `admin-settings-page.component.ts` — Store settings and phone number editor.

* **`src/app/services/` — The Helpers:**
  * `supabase.service.ts` — Connects to Supabase to fetch or save products, images, and orders.
  * `theme.service.ts` — Remembers whether the user preferred Light Mode or Dark Mode.
  * `auth.guard.ts` — Protects `/admin` pages so only the owner can enter.

* **`src/app/shared/` — Reusable Parts:**
  * `site-layout.component.ts` — The header, top announcement bar, and footer used across customer pages.
  * `order-tracking.service.ts` — The pop-up box where customers type their order number to track packages.
  * `ui/` — Small reusable building blocks like buttons, cards, pop-ups, and inputs.

* **`src/styles.css` — Colors & Styling:**
  * Contains the warm terracotta, chocolate brown, and peach rose color palette and night theme rules.

* **`supabase/migrations/` — Database Setup:**
  * SQL files that create the database tables in Supabase.

---

## 3. How Data Moves

### When a Customer Orders on WhatsApp:
1. Customer finds a gift box they want on the website.
2. They click **"Order on WhatsApp"**.
3. The website creates a friendly pre-written message containing the hamper name, price, and link.
4. WhatsApp opens with this message ready to send to the store owner's number.
5. The store owner chats with the customer, confirms payment, and logs the order into the admin panel.

### When a Customer Tracks an Order:
1. Customer clicks **"Track Order"** at the top of the website.
2. They type their Order Number (like `RMS-10294`) or phone number.
3. The website checks the `orders` table in Supabase.
4. The pop-up shows where the box is (e.g. "Packing", "Dispatched", or "Delivered").

### When the Store Owner Adds a New Gift Box:
1. Owner opens `/admin/products/new`.
2. Types in the name and price, and picks which single items are included.
3. Uploads a photo and crops it into a neat square.
4. Clicks Save — the website saves the photo in Supabase Storage and records the new hamper in the database.
5. The new gift box immediately appears on the website for customers to see.
