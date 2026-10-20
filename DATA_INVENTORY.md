# Data Inventory & Data Minimization Matrix — RMS Creations

**Platform:** RMS Creations (Online Gift Hampers Studio, Navi Mumbai, India)  
**Jurisdiction:** India (Digital Personal Data Protection Act, 2023 [DPDP Act 2023], Information Technology Act, 2000, Consumer Protection Act, 2019)  
**Last Audit Date:** October 20, 2026  
**Auditor:** Senior Full-Stack & Compliance Engineer  

---

## 1. Verified Data Lifecycle Inventory

| Data Category | Specific Fields Collected | Source / Entry Point | Lawful Purpose (DPDP / IT Act) | Storage Mechanism & Table | Access Controls (Roles & Systems) | Third-Party Sharing | Statutory Retention Schedule | Protection Safeguards |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Account Identity & Authentication** | Full Name, Email Address, Hashed Password | Register Form (`/register`), Login Form (`/login`) | Account establishment, authentication, password recovery | Supabase Auth (`auth.users`) & `public.users` | Customer (Own record), Database Admin (`is_admin()`) | None. Authentication handled directly by Supabase. | Retained for lifetime of customer account. Deleted upon verified erasure request. | Salted Argon2 / bcrypt password hashing; RLS restricted; no passwords logged. |
| **Age Verification** | Date of Birth, Age Gate Confirmation (`age_gate = true`) | Register Form (`/register`), Checkout Form | Verifying legal competence to contract under Section 11 of the Indian Contract Act, 1872 (18+ requirement). | `public.users.date_of_birth` | Customer, Database Admin | None | Account lifetime; deleted upon account erasure. | RLS protected; validated via Angular reactive validator (`minimumAgeValidator(18)`). |
| **Optional Demographic Data** | Gender (`female`, `male`, `other`, `prefer_not_to_say`) | Register Form (Optional field) | Voluntary customer profile personalization (Non-mandatory). | `public.users.gender` | Customer, Database Admin | None | Account lifetime; deleted on request. | Made strictly optional; no longer blocks registration. RLS protected. |
| **Delivery & Logistics Addresses** | Recipient Full Name, Mobile Phone, Street Address, Landmark, City, State, PIN Code | Checkout Page (`/checkout`), Cart Instant Checkout (`/cart`), My Account (`/my-account`) | Physical doorstep transit, parcel dispatch, courier serviceability check | `public.customer_address`, `public.purchase_order` | Customer (Own address), Store Admin, Fulfillment Team | India Post / Domestic Courier API for AWB booking & parcel delivery. | Retained for active orders; archived with commercial tax records for 7 years under Income Tax / GST Act. | Supabase RLS row isolation; PIN code checked via local index without leaking customer PII. |
| **Customer Orders & Invoices** | Order ID, Order No (`RMS-XXXX`), Items selected, Total amount, Payment method (`cod`, `upi`), Order status | Cart Instant Checkout, Checkout Page, Admin Order Management | Contractual fulfillment of sale of goods under Consumer Protection Act 2019 | `public.purchase_order`, `public.purchase_order_details` | Customer (Own orders), Store Admin (`is_admin()`) | Razorpay / UPI gateway (for payment reference IDs); Resend (transactional receipts). | Retained for 7 years to comply with Indian commercial taxation and statutory audit laws. | Row Level Security (RLS) ensures users cannot read or modify other customers' orders. |
| **Custom Hamper Requests & Media** | Hamper items, custom specifications, budget, uploaded reference images | Custom Hamper Studio (`/build-hamper`), My Custom Hampers (`/my-custom-hampers`) | Artisanal customization of bespoke gift hampers, quotes, and assembly | `public.custom_hamper_requests`, `public.custom_hamper_items`, Storage bucket `images` | Requesting Customer, Store Admin | WhatsApp Business API (if customer initiates support inquiry) | Retained for 12 months after fulfillment, or deleted upon customer request. | Public read of images is limited; RLS restricts request records strictly to owning `user_id` or admin. |
| **Customer Inquiries & Support** | Name, WhatsApp Number, Inquiry Category, Message | Contact Page (`/contact`), Floating WhatsApp Button | Pre-sales consultation, custom hamper sizing, corporate tie-up inquiries | Transmitted via WhatsApp link to official studio number (`+91 92849 05118`) | Customer & Studio Support Staff | Meta / WhatsApp Business API | Retained in studio chat history for ongoing customer support. | Stored off-server in official encrypted WhatsApp business channel; consent note displayed. |
| **Cookie & Storage Preferences** | `rms_cookie_consent_v1` (`essential: true`, `analytics: boolean`, timestamp, version) | Cookie Consent Banner (`<app-cookie-consent>`) | Recording affirmative consent under DPDP Act 2023 | Client Browser `localStorage` | Client Browser Only | None | Persisted in client browser until cleared by user or refreshed upon version upgrade. | Client-side isolation; no sensitive PII stored; GA4 dynamically disabled if analytics = false. |
| **Session & Cart State** | Cart items (`rms_shopping_cart`), Guest orders (`rms_my_orders`), Guest profile (`rms_customer_profile`), Theme (`rms_theme_mode`) | Client Browser Shopping Flow | Seamless shopping journey without forcing premature login; accessibility preference | Client Browser `localStorage` | Client Browser Only | None | Retained locally until checkout completion or browser cache clearance. | Sandboxed in browser origin; no passwords, tokens, or financial secrets saved in unencrypted storage. |
| **Aggregate Analytics** | Google Analytics 4 Client ID (`_ga`, `_ga_*`), page views, device type, country/region | Google Analytics 4 Script (`G-RMSCREATION`) | Measuring aggregate platform performance, popular hamper demand, broken links | Google Analytics Server (Google Ireland Ltd.) | Studio Marketing / Management (Aggregated only) | Google LLC (Processor) | Max 2 months or 14 months per GA4 retention settings. | IP anonymization enabled (`anonymize_ip: true`); Google Consent Mode v2 enforces default denied. |

---

## 2. Data Minimization Decisions & Actions

1. **Gender Made Strictly Optional:**
   - **Previous State:** Registration form marked `gender` as mandatory (`Validators.required`, `*` red star).
   - **Remediation:** Removed required validator. Made field label explicitly `Gender (Optional)`. Customers may choose to skip or select "Prefer not to say".
2. **Date of Birth Purpose Articulated:**
   - **Legal Basis:** Stated clearly below the field: *"Required for age verification under the Indian Contract Act, 1872."* This informs users why their birth date is collected rather than presenting an arbitrary required field.
3. **Removal of Unnecessary Logging:**
   - Verified that no authentication passwords, payment tokens, or raw user objects are printed to `console.log` in production bundles.
   - Any API error logging sanitizes PII before output.
4. **Third-Party Data Minimization:**
   - Web fonts are self-hosted locally in `styles.css`. No IP addresses or browser fingerprints are transmitted to Google Fonts servers on page loads.
   - Session replay scripts (Hotjar, FullStory) are completely absent.
5. **Customer Data Isolation (Supabase RLS):**
   - Verified that all 18 tables in Supabase have `rowsecurity: true`.
   - Customer A cannot query or read Customer B's orders, addresses, or profile records.
   - Anon / Public users can only execute authorized INSERT on `purchase_order` for checkout, with zero SELECT access to other orders.
