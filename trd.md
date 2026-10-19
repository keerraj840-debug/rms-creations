# Technical Requirements Document (TRD) — RMS Creations

> **What is this document?**  
> This document explains the technology behind **RMS Creations**. It explains what programming tools are used, how the website runs, where data and photos are stored, and how everything connects together. It is written in simple, clear language with technical details explained plainly.

---

## 1. Quick Summary of the Technology

Think of the website in three simple parts:

1. **The Frontend (What customers see in their browser):**  
   Built using **Angular 22** and styled with **Tailwind CSS**. It runs fast on phones, tablets, and computers, displaying product pictures, prices, and buttons smoothly.
2. **The Fast Page Loader (Server-Side Rendering / SSR):**  
   Uses **Node.js** and **Express**. When someone opens a link or shares a product on WhatsApp, the server quickly builds the page HTML so it loads in around 1 second and shows preview cards on Google and WhatsApp.
3. **The Database & Cloud Storage (Supabase):**  
   Stores all product names, prices, orders, user accounts, and uploaded photos safely in the cloud using **Supabase** (powered by PostgreSQL).

```
   [Customer's Phone / Laptop]
               │
               ▼
   [Angular 22 Website] ◄─── Loads pages fast with Server-Side Rendering
               │
               ▼
   [Supabase Cloud Database] ─── Stores products, photos, and orders safely
```

---

## 2. Tools & Frameworks Used

| Tool | Version | What it is used for |
|------|---------|---------------------|
| **Angular** | v22 | The main framework that powers all pages and buttons. |
| **Angular SSR + Express** | v22 / v5 | Prepares pages on the server so they open immediately without lag. |
| **Supabase Client** | v2 | Connects the website to the cloud database and image storage. |
| **Tailwind CSS** | v4 | The styling tool used to color buttons, space cards, and handle night mode. |
| **Image Cropper (`ngx-image-cropper`)** | v9 | Lets the admin crop hamper photos into neat squares before uploading. |
| **TypeScript** | v6 | The coding language used for Angular to make sure code is safe and error-free. |

---

## 3. How the Pages are Structured

The website has two main sections:
1. **Public Customer Pages** (anyone can open these without logging in)
2. **Admin Panel Pages** (only the store owner can open these after logging in)

### 3.1 Public Customer Pages
* `/` — The main Home Page with the hero showcase, festive banners, and reviews.
* `/ganpati-hampers` — Special Ganesh festival pooja kit offerings.
* `/hampers` — Full catalog of gift boxes.
* `/hampers/:slug` — Specific category view (like Girls Hampers or Chocolate Boxes).
* `/return-gifts` — Bulk gifting page with automatic volume discount calculator.
* `/gallery` — Lookbook showing photos of real hampers and packaging.
* `/top-offers` — Sale combos and festive deals.
* `/contact` — Phone numbers, WhatsApp link, studio address, and contact form.

### 3.2 Private Admin Pages (Protected by Password)
When you try to open `/admin`, the website checks if you are logged in as an administrator. If not, it redirects you to `/login`.
* `/admin` — Main dashboard showing summary numbers and live orders.
* `/admin/products` — List of all products with edit and turn-off switches.
* `/admin/products/new` — Form to add a new hamper with photo upload and item selections.
* `/admin/items` — Catalog of single items (like Dry Fruit Jars, Candles) and their stock counts.
* `/admin/categories` — Manager for website categories.
* `/admin/orders` — Customer orders list with status updates.
* `/admin/settings` — Phone numbers, WhatsApp number, and store maintenance toggle.

---

## 4. How Data & Photos are Stored (Supabase Database)

All website data lives in Supabase in neat tables (like spreadsheets):

1. **`products` table:**  
   Stores the name of the hamper, description, list of photo URLs, category, price, and whether it is currently visible to customers (`is_active`).
2. **`product_details` table:**  
   Stores the individual items that can go into hampers (like Cashew Jar 200g, Brass Diya) along with how many pieces are in stock.
3. **`product_mappings` table:**  
   Connects products to their included items. For example, it remembers that "Ganpati Deluxe Hamper" has 1 Pooja Box + 1 Dry Fruit Box inside it.
4. **`orders` table:**  
   Stores placed customer orders, including order number (like `RMS-10294`), customer details, total amount, and order status (e.g., Pending, Confirmed, Assembling, Dispatched, Delivered).
5. **`app_settings` table:**  
   Stores the store's WhatsApp number, phone number, email, and whether the store is open or temporarily in maintenance mode.
6. **`banner_images` table:**  
   Stores festival banners and hero slides.

### Where Photos are Stored:
Photos are uploaded to a secure cloud bucket in Supabase called **`products`**. Before uploading, the image is cropped into a neat square so customer pages always load fast and look tidy.

---

## 5. Security & Safety Rules

1. **Passwords and Login:**  
   Customer accounts and admin logins are handled securely by Supabase. Passwords are never saved as plain text.
2. **Admin-Only Pages:**  
   Only users with the role `admin` can open the `/admin` screens. If a normal visitor tries to open it, they are sent back to the login screen.
3. **Safe Keys:**  
   Only the safe public anonymous key is used in browser code. Secret admin keys are never exposed on the web.
4. **Phone and Mobile Safety:**  
   The website is tested to ensure that customer data entered in the order tracker or contact form is clean and safe from spam.

---

## 6. How to Run the Website Locally (For Developers)

```bash
# 1. Start the local development server
ng serve

# 2. Open in your browser
http://localhost:4200

# 3. Test building the production version
ng build
```
