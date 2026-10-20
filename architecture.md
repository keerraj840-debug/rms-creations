# System Architecture & Code Map — RMS Creations

> **System Overview:**  
> **RMS Creations** is a modern, responsive Angular 19+ and Supabase e-commerce application serving customers across India with handcrafted gift hampers, festive boxes, and custom gift curation.

---

## 1. High-Level Architecture

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 CUSTOMER & ADMIN CLIENT                     │
  │     (Mobile Responsive Web App / Progressive Web App)       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                   ANGULAR 19+ FRONTEND                      │
  │  - Standalone Components & Router                           │
  │  - Smart Gifting Finder & Live Catalog                      │
  │  - Custom Hamper Studio (Partitioned Box Builder)           │
  │  - Unified Cart & 1-Step Draggable Swipe Checkout           │
  │  - PinCodeAvailabilityService & Dynamic Postal Rates        │
  │  - Reliable Notification Outbox Pipeline                    │
  │  - Cookie Consent Manager (DPDP Act 2023 & Consent Mode v2) │
  │  - Tailwind CSS v4 Luxury Theme Engine                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                  SUPABASE BACKEND PLATFORM                  │
  │  - PostgreSQL Database with 100% Active Row Level Security │
  │  - Supabase Auth (Email/Password, Session Tokens)           │
  │  - Supabase Storage (Optimized WebP Product Assets)         │
  │  - Order Fulfillment & Notification Queue Processing        │
  └─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Canonical Page Inventory

### `src/app/pages/` — Routed Customer & Admin Views

| Route | Component | Purpose |
|:---|:---|:---|
| `/` | `home-page.component.ts` | Brand showcase, dynamic hero carousel, recipient/budget finder, bestsellers, and collections browser. |
| `/shop` | `shop-page.component.ts` | Filterable, searchable product catalog with live stock, category chips, sorting, and compact grid/list toggle. |
| `/product/:id` | `product-detail-page.component.ts` | Detailed hamper specifications, item inclusion list, interactive 6-digit PIN delivery check, and card note customization. |
| `/cart` | `cart-page.component.ts` | **Unified Cart & Instant Checkout**: Real-time weight/PIN delivery rate calculator, saved address picker, COD/UPI modes, and draggable swipe-to-order button. |
| `/build-hamper` | `build-hamper-page.component.ts` | **Custom Hamper Studio**: Interactive box selection, multi-item visual builder, partition grid manager, live cost tally, and order request submission. |
| `/my-custom-hampers` | `my-custom-hampers-page.component.ts` | Customer dashboard tracking status, quotes, and revisions for bespoke hamper requests. |
| `/my-orders` | `my-orders-page.component.ts` | Live tracking of customer orders, status milestones (Confirmed, In Assembly, Dispatched, Delivered), and invoice lookup. |
| `/my-account` | `my-account-page.component.ts` | Customer profile management, multiple saved delivery addresses, password update, and data controls. |
| `/gallery` | `gallery-page.component.ts` | Editorial lookbook and high-resolution photo gallery of completed studio gift hampers. |
| `/contact` | `contact-page.component.ts` | Direct studio WhatsApp concierge, customer inquiry form, telephone support, and FAQ. |
| `/terms`, `/privacy`, `/cookies`, `/shipping-policy`, `/refund-policy`, `/grievance` | `policy-page.component.ts` | Comprehensive Indian e-commerce compliance portal (Consumer Protection Rules 2020, DPDP Act 2023, IT Rules 2021). |
| `/login`, `/register`, `/forgot-password` | `auth/*` | Secure customer authentication and session management. |
| `/admin/*` | `admin-*` | Store administrative suite: Dashboard, Products, Inclusions, Categories, Orders, Custom Hampers, Banners, PIN Coverage, Users, and Settings. |

### `src/app/services/` — Core Business Logic & State

- `supabase.service.ts` — Singleton Supabase client handling queries, auth sessions, and storage uploads.
- `cart.service.ts` — Reactive cart state with persistent storage, item quantity management, and delivery fee sync.
- `pin-code-availability.service.ts` — Real-time postal verification, regional delivery fee resolution, and speed estimation.
- `notification-outbox.service.ts` — Fault-tolerant outbox queue ensuring customer and admin order notifications are reliably sent.
- `cookie-consent.service.ts` — DPDP Act 2023 consent tracking and Google Consent Mode v2 integration.
- `customer-address.service.ts` — CRUD operations for customer saved delivery addresses in Supabase.
- `custom-hamper.service.ts` — Bespoke hamper creation, item catalog fetching, and quote management.
- `theme.service.ts` — Persistent luxury light/dark mode preference toggle.
- `pwa.service.ts` — Service worker registration, offline caching, and PWA install prompt coordination.
- `auth.guard.ts` & `unauth.guard.ts` — Route guards securing admin and account endpoints.

### `src/app/shared/` — Common Architecture

- `site-layout.component.ts` — Global master template with sticky header, responsive navigation, app drawer, bottom mobile nav, and editorial luxury footer.
- `admin-layout.component.ts` — Administrative dashboard shell with collapsible sidebar and top status bar.
- `ui/` — Atomic UI components: `swipe-button`, `file-upload` (with client-side image compression and cropping), `modal`, `toast-container`, `cookie-consent`, and `empty-state`.

---

## 3. Order & Checkout Lifecycle

1. **Discovery & Customization:** Customer selects a pre-curated hamper from `/shop` or builds a custom partitioned gift box on `/build-hamper`.
2. **Item Personalization:** Optional gift note message and recipient details are recorded per item.
3. **Cart & Postal Validation:** On `/cart`, customer enters their 6-digit delivery PIN code. `PinCodeAvailabilityService` queries the database for serviceability and calculates weight-based courier rates.
4. **Single-Action Confirmation:** Customer reviews order breakdown, agrees to statutory terms, and slides the interactive draggable `app-swipe-button`.
5. **Atomic Order Creation:**
   - Creates `purchase_order` and itemized `purchase_order_details` records in Supabase.
   - Enqueues dual notifications (Store Admin + Customer) in `notification_outbox`.
   - Caches customer profile and delivery address for future 1-click checkouts.
   - Clears cart and renders double confirmation modal with instant WhatsApp tracking link.
