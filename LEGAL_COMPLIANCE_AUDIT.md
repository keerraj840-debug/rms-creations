# Comprehensive Legal, Policies, Privacy & Customer Support Audit
## Angular + Supabase | India Jurisdiction | Production Launch Readiness

**Date:** October 16, 2026  
**Auditor:** Senior Product Compliance Auditor, Privacy Specialist & Angular Architecture Engineer  
**Entity:** RMS Creations Studio (Trade Name: *RMS Gift Hampers*)  
**Principal Studio Address:** Plot 42, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703, India  
**Official Communications:** `rmsgifthampers@gmail.com` | Concierge & Helpline: `+91 92849 05118`  
**Applicable Legal Frameworks Evaluated:**
- Consumer Protection Act, 2019 & Consumer Protection (E-Commerce) Rules, 2020
- Information Technology Act, 2000 & Intermediary Guidelines Rules, 2021
- Digital Personal Data Protection Act, 2023 (DPDP Act 2023)
- Indian Contract Act, 1872 & Sale of Goods Act, 1930
- Copyright Act, 1957

---

## 1. Full Website Discovery & Policy Routes

| Document / Policy | Route / Location | Pre-Audit Finding | Remediation Implemented | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Terms of Service** | `/terms` (aliases: `/terms-of-service`, `/policies`) | Formerly only a 2-sentence snippet in an modal dialog. No dedicated routable page. | Built comprehensive dedicated page with Contract Act 1872 age-gate (18+), handcrafted goods disclaimers, clear pricing, COD/UPI terms, and Navi Mumbai/Maharashtra jurisdiction. | ✅ **COMPLETED & TESTED** |
| **Privacy Policy** | `/privacy` (alias: `/privacy-policy`) | Truncated modal text; did not detail DPDP Act 2023 rights, categories of data, or sub-processors. | Full statutory policy outlining Supabase storage, zero sale of personal data, user rectification & deletion rights, and transactional email/WhatsApp handling. | ✅ **COMPLETED & TESTED** |
| **Shipping & Delivery Policy** | `/shipping-policy` | Missing entirely as a dedicated policy; fragmented across product description lines. | Complete delivery policy detailing local Mumbai metro (24–48h) vs Pan-India (3–7 days), Free doorstep shipping threshold (₹499+), and transit damage reporting. | ✅ **COMPLETED & TESTED** |
| **Cancellation, Return & Refund Policy** | `/refund-policy` (alias: `/cancellation-policy`) | Missing dedicated page. Customers had no clarity on custom hamper vs pre-curated returns. | Comprehensive policy specifying pre-dispatch cancellation, handcrafted/gourmet food hygiene return exceptions, 48h damaged parcel reporting, and 5–7 day UPI/bank refunds. | ✅ **COMPLETED & TESTED** |
| **Consumer Grievance Redressal** | `/grievance` | Missing mandatory statutory officer disclosures mandated under Rule 4(4) & Rule 5(3)(a) of Consumer Protection (E-Commerce) Rules, 2020. | Complete Grievance Officer disclosure with designated email, telephone/WhatsApp, working hours, 48h acknowledgment, and 30-day redressal timelines. | ✅ **COMPLETED & TESTED** |
| **Contact & Customer Support** | `/contact` | Working WhatsApp links and email, but lacked statutory legal disclosures. | Linked to live store settings, interactive FAQ accordion, and WhatsApp concierge quick starters. | ✅ **COMPLETED & TESTED** |
| **US Legal Remnants (DMCA / FTC / ROSCA)** | `site-layout.component.ts` | Contained references to US Digital Millennium Copyright Act (DMCA) and US FTC / ROSCA rules. | Stripped all US-specific statutory references. Aligned with Indian Copyright Act 1957 and Consumer Protection Act 2019. | ✅ **COMPLETED & TESTED** |

---

## 2. Terms and Conditions Audit

### Verified Real-World Journey & Business Operations
1. **Contract Formation:**
   - **Pre-curated Hampers:** Standard cart checkout creates a binding order upon successful submission.
   - **Bespoke Hampers (`/build-hamper`):** Submissions represent non-binding requests for quote and artisan consultation. No payment is taken until customer reviews and explicitly approves the individualized quotation.
2. **Age Gate:** Enforces 18+ requirement on registration per Section 11 of the Indian Contract Act, 1872.
3. **Pricing & Taxes:** Transparent display of item prices in INR (₹), inclusive of applicable taxes, with delivery charges clearly broken down prior to submission.
4. **Governing Law:** Explicitly designates laws of India and exclusive territorial jurisdiction of competent courts in Navi Mumbai / Thane / Mumbai, Maharashtra.

---

## 3. Privacy Policy & Supabase Data Architecture

### Data Ingestion Audit
- **Supabase Auth (`auth.users`):** Stores customer email, encrypted password hashes (Argon2/bcrypt), and user metadata. Passwords are never visible or accessible in plaintext.
- **Customer Profiles (`public.users`):** Full name, email, contact phone number, gender, date of birth. Enforces Row Level Security (RLS) so customers can only access their own profile.
- **Customer Addresses (`public.customer_addresses`):** Full street address, landmark, city, state, and 6-digit postal PIN code.
- **Custom Hamper Requests (`public.custom_hamper_requests`):** Customer name, contact number, occasion, recipient theme, uploaded photo references, and design notes.
- **Purchase Orders (`public.orders`, `public.order_items`):** Historical order lines, payment status, parcel weight, and delivery addresses.

### DPDP Act 2023 & IT Act 2000 Verification
1. **Zero Sale of Personal Data:** Explicitly stated in customer-facing policies.
2. **Sub-processors:** Disclosed Supabase (cloud database), Resend/SMTP (transactional emails), and WhatsApp Business API (concierge chat).
3. **Data Security Safeguards:** PostgreSQL Row Level Security (RLS), JWT authenticated sessions, and HTTPS transport encryption. Frontend never exposes Supabase service-role keys.
4. **Data Subject Rights:** Customers can view and update addresses and profiles in `/my-account`, or request account deactivation/deletion via the Grievance Officer.

---

## 4. Cancellation, Refund & Shipping Disclosures

### E-Commerce Realities & Consumer Protection Rules, 2020
- **Cancellation Window:** Allowed free of charge prior to parcel dispatch for catalogue items. For custom/personalized hampers, permitted only before artisan assembly begins.
- **Non-returnable Items:** Food/gourmet items (chocolates, dry fruits, sweets) are non-returnable upon delivery due to hygiene and perishable nature, compliant with e-commerce norms.
- **Defective / Damaged Goods:** Customers can report damage with photos/unboxing video within 48 hours for immediate free replacement or refund.
- **Refund Timelines:** 5 to 7 business days credited directly to original UPI VPA or bank account. COD refunds processed via direct UPI/NEFT upon customer providing details.
- **Delivery Geography & Charges:** Doorstep delivery across India. Free shipping on orders ₹499+; flat ₹50 on orders below ₹499. Local metro deliveries in 24–48 hours; Pan-India in 3–7 business days.

---

## 5. Pre-Purchase & Registration Disclosures

1. **Checkout Pre-Purchase Disclosure:**
   - Added legal agreement notice directly beneath the "Place Order" button on `/checkout`:
     *"By placing this order, you agree to our Terms of Service, Privacy Policy, and Cancellation & Refund Policy."* with direct, routable links opening in a new tab.
2. **Registration Age & Terms Disclosure:**
   - Enhanced the 18+ age gate on `/register` with clickable links to `/terms` and `/privacy`.
3. **Login Legal Notice:**
   - Added transparent notice linking to Terms and Privacy Policy on `/login`.

---

## 6. Technical Verification & Test Results

- **Unit & Integration Tests:** **21/21 test suites passed (102/102 tests passed)** via Vitest (`npm test -- --watch=false`).
- **Production Build:** Compiled cleanly with zero errors via Angular CLI (`npm run build`).
- **Route Accessibility:** Verified direct routing and navigation for `/terms`, `/privacy`, `/shipping-policy`, `/refund-policy`, `/cancellation-policy`, and `/grievance`.

---

## 7. Business-Owner Decisions & Recommended Legal Review

### Business-Owner Action Items Before Launch
1. **Formal Business Registration Confirmation:** Ensure the entity name ("RMS Creations Studio" / "RMS Gift Hampers") matches the bank account receiving UPI transfers (`7350120467@upi`).
2. **GST Registration Status:** If annual turnover exceeds statutory thresholds (₹40 Lakhs for goods in Maharashtra / ₹20 Lakhs for interstate e-commerce), display the GSTIN in the footer.
3. **Food Safety (FSSAI):** If selling pre-packaged gourmet food items or dry fruits under RMS branding, ensure appropriate FSSAI registration/license details are displayed.

### Items for Qualified Legal Review
- Final review of limitation of liability caps and intellectual property protection clauses by an attorney qualified in Indian e-commerce law.

---

## 8. Launch Status

| Policy / Area | Verification Level | Status |
| :--- | :--- | :--- |
| **Terms of Service** | Code, UI, Routing & Statutory Terms Verified | ✅ **READY FOR REVIEW** |
| **Privacy Policy (DPDP Act 2023)** | Database RLS, Storage & Customer Rights Verified | ✅ **READY FOR REVIEW** |
| **Shipping & Delivery Policy** | PIN Checker, Charges & Timelines Verified | ✅ **READY FOR REVIEW** |
| **Cancellation & Refund Policy** | Order Workflow, Transit Damage & UPI Refunds Verified | ✅ **READY FOR REVIEW** |
| **Grievance Redressal Officer** | Contact, Address & Response Timelines Published | ✅ **READY FOR REVIEW** |
| **Checkout & Auth Disclosures** | Direct Clickable Links & Age-Gate Integrated | ✅ **READY FOR REVIEW** |
