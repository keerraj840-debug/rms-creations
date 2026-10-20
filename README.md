# RMS Creations — Handcrafted Gift Hampers & Gifting Studio

> **Production E-Commerce Platform**  
> Serving customers across India with bespoke gift hampers, festive collections, wedding favors, and custom partitioned gift boxes.  
> **Tech Stack:** Angular 19+ (Standalone Architecture), Supabase (PostgreSQL + Auth + Storage), Tailwind CSS v4, TypeScript, Vitest, Progressive Web App (PWA).

---

## Features

- **Storefront & Catalog:** Filterable product catalog with live stock status, categorized gifts, price sorting, and responsive grid/list switcher.
- **Custom Hamper Studio (`/build-hamper`):** Interactive gift box builder where customers choose box styles, partitions, items, and accessories with dynamic live price tally.
- **Unified Cart & 1-Step Draggable Checkout (`/cart`):** Seamless cart with weight-based postal PIN calculation, saved address selector, Cash/UPI on Delivery (COD), and interactive swipe-to-order confirmation.
- **Postal Serviceability Checker:** Validates 6-digit PIN codes in real time against serviceable regional delivery tables in Supabase.
- **Order Tracking (`/my-orders`):** Order status tracking through each fulfillment milestone (Confirmed, In Assembly, Dispatched, Delivered) with direct WhatsApp concierge sync.
- **Customer Account (`/my-account`):** Profile management, multiple saved delivery destinations, and order history.
- **Admin Management Studio (`/admin`):** Full CRUD for products, single inclusion items, categories, hero banners, order processing with double-confirmation dialogs, custom hamper quotes, delivery PINs, and store settings.
- **Indian Statutory Compliance:** Built under the Consumer Protection (E-Commerce) Rules 2020, Information Technology Rules 2021, and the Digital Personal Data Protection (DPDP) Act 2023 with Google Consent Mode v2.
- **PWA Ready:** Installable on iOS, Android, and Desktop with offline asset caching and service worker lifecycle management.

---

## Getting Started

### Prerequisites

- **Node.js:** v18.19.0 or higher (v20+ recommended)
- **Package Manager:** `npm` (v10+)
- **Supabase Account:** Active Supabase project with database migrations applied.

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd rms-creations
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (or use `.env.example` as a template):

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key-here

# Optional: Admin Service Key (For backend migration/maintenance scripts only; never bundled in frontend)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Generate the Angular environment configuration by running:

```bash
node scripts/generate-env.mjs
```

This script generates `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your verified configuration.

### 3. Local Development Server

Run the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

---

## Quality & Testing

### Running Unit Tests

The test suite is powered by **Vitest** via `@angular/build`:

```bash
# Run all tests once
npm test -- --watch=false

# Run tests in interactive watch mode
npm test
```

**Quality Metric:** 100% pass rate across 30 test suites and 194 unit tests covering auth guards, PIN calculations, cart state, image compression, cookie consent, and outbox notifications.

### Production Build

To build the optimized production artifacts:

```bash
npm run build
```

The compiled bundle will be output to the `dist/rms-creations` directory. The pre-build hook automatically verifies environment secrets and syncs version metadata across `package.json`, `version.json`, and service workers.

---

## Database Migrations (Supabase)

Database schema and migration files are located in `supabase/migrations/`:

```bash
# Apply migrations using Supabase CLI
supabase db push
# or run SQL files directly in the Supabase SQL Editor
```

Key database tables:
- `products` — Gift hampers catalog
- `product_items` — Single items included in hampers
- `product_categories` — Gift categories
- `purchase_order` & `purchase_order_details` — Customer orders
- `customer_addresses` — Saved shipping addresses
- `pincode_availability` — Regional postal codes and delivery fees
- `custom_hampers` — Bespoke hamper consultation requests
- `notification_outbox` — Reliable notification delivery queue
- `banners` — Promotional hero carousels
- `store_settings` — WhatsApp number and contact details

**Row Level Security (RLS):** Enabled and enforced on 100% of public tables.

---

## Deployment Instructions

### Netlify Deployment

1. Set the build command:
   ```bash
   npm run build
   ```
2. Set the publish directory:
   ```
   dist/rms-creations/browser
   ```
3. Configure environment variables in Netlify site settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. The included `_redirects` and `netlify.toml` file automatically manages SPA routing (redirecting all paths to `index.html`).

---

## License & Attribution

Copyright © 2026 RMS Creations. All Rights Reserved.  
For licensing details regarding third-party fonts, icons, and media, refer to [`ASSET_LICENSE_AUDIT.md`](./ASSET_LICENSE_AUDIT.md).
