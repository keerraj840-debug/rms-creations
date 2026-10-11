# Product Requirements Document (PRD) — RMS Creations

> **What is this document?**  
> This document explains what **RMS Creations** is, why it was built, who it is for, how it works, and what features it has. Everything is written in simple, clear, everyday language so anyone can understand it.

---

## 1. What is RMS Creations?

**RMS Creations** is an online shop and digital catalog for custom gift hampers, festive pooja kits, and bulk return gifts. 

Normally, small boutique businesses take orders through Instagram DMs or phone calls, which can be messy and confusing. RMS Creations solves this problem by giving customers a clean, beautiful website where they can:
1. Browse high-quality photos of ready-made gift hampers and pooja kits.
2. See clear prices, package contents, and bulk discounts.
3. Tap one button to chat directly on **WhatsApp** with the shop owner to place their order or ask for custom items.
4. Track their existing order status in real time using their phone number or order ID.

At the same time, the shop owner gets a private **Admin Panel** where they can easily add new gifts, upload photos, change prices, and manage incoming orders.

---

## 2. Who is this website for?

### 1. People Buying Festival & Birthday Gifts
* **Who they are:** Regular customers looking for thoughtful gifts for festivals (like Ganesh Chaturthi, Diwali), birthdays, or anniversaries.
* **What they care about:** Beautiful packaging, good quality items inside, safe delivery, and knowing what is included.
* **How they use the site:** They visit the website on their phone, look through the hampers, click **"Order on WhatsApp"**, and chat directly with the seller to pay and confirm delivery.

### 2. People Buying in Bulk (Return Gifts for Events)
* **Who they are:** People organizing weddings, housewarmings, baby showers, or birthday parties who need 20 to 100+ small gifts.
* **What they care about:** Getting bulk discounts, seeing per-piece prices, adding custom name tags, and fast quotes.
* **How they use the site:** They go to the **Return Gifts** page, adjust the quantity, see the discounted price per piece, and send a ready-made quote request to the seller on WhatsApp.

### 3. The Shop Owner (Store Admin)
* **Who they are:** The owner and team running RMS Creations.
* **What they care about:** Being able to quickly upload photos from their phone, create new hampers, manage stock, and see all customer orders in one place.
* **How they use the site:** They log into `/admin` with their email and password to update products, set maintenance mode if needed, and change order statuses (e.g. from "Packing" to "Dispatched").

---

## 3. How the Website Works (Customer Pages)

### 3.1 Home Page (`/`)
* **Welcome Banner:** A clean, attractive headline showing what RMS Creations does, with quick trust badges ("100% Customized Gifting", "Direct Chat on WhatsApp", "Luxury Packaging").
* **Festival Highlight:** A special spotlight section for active festivals (for example, Ganpati Pooja Kits starting at ₹99).
* **Featured Collections:** Quick cards for Girls Hampers, Boys Hampers, Chocolate Hampers, and Pooja Kits.
* **Customer Reviews:** Real reviews from happy customers with 5-star ratings.
* **Common Questions (FAQ):** Simple answers to questions like "Can I change items in a box?", "How long does delivery take?", and "Do you take bulk orders?".

### 3.2 Ganpati Hampers & Pooja Kits (`/ganpati-hampers`)
* Shows ready-made Pooja Kits for Ganesh Utsav.
* Explains why the boxes are safe and spill-proof (each dry fruit or pooja item has its own separate slot so nothing leaks or mixes).
* Shows clear prices for each kit (₹99, ₹149, ₹249, ₹499).
* Each kit has a direct **"Order on WhatsApp"** button that sends the exact kit name to the seller.

### 3.3 Hampers Catalog (`/hampers` and `/hampers/:slug`)
* A photo gallery of gift boxes categorized by type (Girls, Boys, Chocolates, etc.).
* Customers can click any category to see all boxes, zoom into pictures, and check what items are included inside.

### 3.4 Return Gifts Page (`/return-gifts` and details)
* Designed specifically for party and event planners.
* **Bulk Discount Calculator:** Shows how the price drops when you buy more (e.g., 25 pieces gets a 5% discount, 50 pieces gets 10% off).
* Customers can type their required quantity and instantly get a WhatsApp quote button with all numbers filled in.

### 3.5 Photo Lookbook Gallery (`/gallery`)
* A photo wall showing actual pictures of packed boxes, ribbons, client unboxing photos, and past deliveries.

### 3.6 Special Offers (`/top-offers`)
* Displays limited-time deals, festive combos, and sale bundles.

### 3.7 Contact Page (`/contact`)
* Has the boutique's phone number, direct WhatsApp link, email, studio address, and working hours.
* Includes a simple contact form if someone prefers to send a message on the site.

### 3.8 Order Tracker (Available on every page)
* A small pop-up box that opens when you click "Track Order" in the top menu.
* Customers enter their **Order Number** (like `RMS-10294`) or phone number.
* It shows a simple progress bar with 5 steps:
  1. Order Received
  2. Confirmed
  3. Being Handcrafted & Packed
  4. Out for Delivery / Tracking Number Ready
  5. Delivered

---

## 4. How the Admin Panel Works (For the Shop Owner)

The shop owner visits `/admin` and logs in with their private password. Here is what they can do:

### 4.1 Dashboard Overview (`/admin`)
* Shows simple daily counts:
  * Total Products online
  * Active Hampers
  * Recent customer orders
  * Items running low on stock
* Has a button to quickly add a new product or refresh live numbers.

### 4.2 Products (`/admin/products`)
* Lists all products with their photos, prices, and whether they are currently visible to customers (On/Off toggle).
* **New Product Form (`/admin/products/new`):**
  * Type in name, price, description, and category.
  * Pick which items go inside the box (e.g. 1 Scented Candle + 1 Dry Fruit Jar).
  * Upload photos with a built-in **photo cropper** so pictures always look square and neat on mobile phones.
  * Turn "Live on Store" ON or OFF anytime.

### 4.3 Items Catalog (`/admin/items`)
* This is a list of the smaller individual items that go into boxes (e.g. Cashew Jar 200g, Brass Diya, Chocolates, Scented Candle).
* Lets the owner keep track of how many pieces are in stock so they don't run out during festival season.

### 4.4 Categories (`/admin/categories`)
* Lets the owner create new sections (e.g., "Diwali Hampers", "Wedding Gifts", "Rakhi Specials").

### 4.5 Orders (`/admin/orders`)
* Shows all customer orders with customer name, phone number, total amount, and what they bought.
* Lets the owner change order status (e.g., from "Packing" to "Dispatched").
* Has a green WhatsApp button to quickly message the customer their tracking update.

### 4.6 Store Settings (`/admin/settings`)
* Lets the owner change the WhatsApp phone number, support email, and store address shown on the website.
* Includes an emergency **"Under Maintenance"** switch if the store needs to temporarily pause new orders.

---

## 5. How the Order Process Works in Real Life

Here is the step-by-step customer journey:

1. **Customer visits website** on their mobile phone or laptop.
2. **Browses gift hampers** and finds one they love.
3. **Clicks "Order on WhatsApp"**.
4. WhatsApp automatically opens on their phone with a friendly message ready to send:
   > *"Hello RMS Gift Hampers! I want to order [Hamper Name] (₹[Price]). Please tell me how to pay and when it can be delivered."*
5. **Seller replies on WhatsApp**, confirms payment (UPI / Google Pay), and confirms the delivery address.
6. **Seller saves the order** in the Admin panel.
7. **Customer tracks order anytime** using the website's Order Tracker.

---

## 6. What Makes this Website Good for Customers?

* **Super Fast on Phones:** Loads in about 1 second without lag.
* **Very Easy to Use:** No long sign-up forms or passwords required for customers.
* **Warm and Pretty Look:** Feels like a high-end gift shop with soft colors, clear pictures, and readable text.
* **Works in Light and Dark Mode:** Easy on the eyes day or night.
* **Zero Confusion:** Clear prices, clear contents, and instant WhatsApp chat.
