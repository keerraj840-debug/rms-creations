# Comprehensive Legal, Privacy & Compliance Audit — RMS Creations

**Entity:** RMS Creations Studio (Operating as **RMS Gift Hampers**)  
**Location:** Plot 42, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703, India  
**Helpline / WhatsApp:** +91 92849 05118  
**Official Email:** rmsgifthampers@gmail.com  
**Audit Scope:** Entire Customer Storefront, Instant Checkout, Custom Hamper Studio, Admin Management Portal, Supabase Database & Auth  
**Audit Date:** October 20, 2026  

---

## 1. Statutory Frameworks Evaluated

1. **Consumer Protection Act, 2019 & Consumer Protection (E-Commerce) Rules, 2020:**
   - Clear entity identity, address, phone, email, and customer care details.
   - Mandatory appointment and publication of Grievance Redressal Officer (Rule 4(4) and Rule 5(3)(a)).
   - Mandatory 48-hour acknowledgment and 30-day resolution timeline.
   - Transparent disclosure of total price, delivery fees, return/refund conditions, and courier timelines.
   - Prohibition on misleading claims, fake reviews, or arbitrary cancellation fees.
2. **Digital Personal Data Protection Act, 2023 (DPDP Act 2023):**
   - Consent notice provided at or before data collection (Section 5).
   - Clear purpose limitation and data minimization (Section 6).
   - Affirmative consent for non-essential tracking (Google Analytics 4).
   - Right to access, correct, and erase personal data (Sections 11 & 12).
   - Easy withdrawal of consent.
3. **Information Technology Act, 2000 & IT (Intermediary Guidelines) Rules, 2021:**
   - Removal of US DMCA legacy references; replacement with Section 52(1)(c) of Indian Copyright Act, 1957 and IT Rules 2021.
   - Published Nodal Contact and statutory takedown mechanism with 36-hour compliance capability.
4. **Indian Contract Act, 1872:**
   - Competence to contract (Section 11) requiring parties to be of the age of majority (18+).

---

## 2. Compliance Audit Findings & Remediation Summary

| Ref ID | Category | Compliance Area | Severity | Initial Finding / Risk | Remediation Implemented | Verification Method | Status |
|:---|:---|:---|:---:|:---|:---|:---|:---:|
| **CMP-01** | Privacy & Tracking | Cookie Consent & GA4 Tracking | **High** | GA4 (`G-RMSCREATION`) loaded unconditionally on page load without prior user consent, risking non-compliance under DPDP Act 2023. | Built `CookieConsentService` and `CookieConsentComponent`. Implemented Google Consent Mode v2 with default denied. GA4 is activated only upon explicit consent. Choice persisted in `localStorage`. | Unit tests passing (`cookie-consent.service.spec.ts`); verified gtag default denied in `index.html`. | **REMEDIATED** |
| **CMP-02** | Legal Jurisdiction | US DMCA vs Indian Copyright Act | **High** | `site-layout.component.ts` contained US-centric "DMCA Designated Agent" modal, inapplicable to an Indian gifting entity. | Replaced with statutory notice under **Indian Copyright Act, 1957 (Section 52(1)(c))** and **IT Rules 2021**, listing the Grievance Officer in Navi Mumbai. | Inspected modal template and legal notice copy. | **REMEDIATED** |
| **CMP-03** | Consumer Protection | Pre-Purchase Legal Notice in Cart | **High** | Direct swipe-to-order checkout in `cart-page.component.ts` lacked pre-purchase consent notice linking to Terms, Privacy, and Refunds. | Added statutory agreement text under both desktop and mobile swipe buttons with secure links to `/terms`, `/privacy`, and `/refund-policy`. | Inspected template; verified responsive layout on desktop and mobile. | **REMEDIATED** |
| **CMP-04** | Data Minimization | Mandatory Gender in Registration | **Medium** | Registration form marked `gender` as mandatory (`Validators.required`, `*`), collecting unnecessary personal data. | Made `gender` strictly optional; removed validator. Added clear explanatory text under Date of Birth explaining Indian Contract Act 1872 age verification. | Unit test suites run; verified form accepts submission without gender selected. | **REMEDIATED** |
| **CMP-05** | Transparency | Missing Cookie Policy Tab & Route | **Medium** | No dedicated Cookie Policy section existed in `policy-page.component.ts` or routes. | Added `cookies` tab, routing for `/cookies` and `/cookie-policy`, complete inventory table of cookies/localStorage, and a 1-click "Open Cookie Preferences" button. | Verified routing and unit tests (`policy-page.spec.ts`). | **REMEDIATED** |
| **CMP-06** | Advertising Norms | Absolute Guarantee Claim | **Low** | `home-page.component.ts` claimed "guaranteed safe packaging", which could be construed as an absolute warranty under CCPA advertising norms. | Refined copy to "protective multi-layer packaging" to accurately describe corrugated and bubble-wrap packaging standards. | Verified copy in `home-page.component.ts`. | **REMEDIATED** |
| **CMP-07** | Security & Referrers | External Link Attributes | **Medium** | Multiple `target="_blank"` anchor tags lacked `rel="noopener noreferrer"`, exposing potential reverse tabnabbing security risks. | Added `rel="noopener noreferrer"` across all external links and policy new-tab anchors. | Verified across codebase with ripgrep. | **REMEDIATED** |

---

## 3. Statutory Grievance Redressal Architecture

In strict compliance with **Rule 4(4) and Rule 5(3)(a) of the Consumer Protection (E-Commerce) Rules, 2020**, the following details are permanently displayed on the website (`/grievance`, `/policy?tab=grievance`, and footer links):

- **Entity Name:** RMS Creations Studio (Trade Name: RMS Gift Hampers)
- **Nodal / Grievance Redressal Officer:** Legal & Grievance Officer, RMS Creations
- **Physical Studio Address:** Plot 42, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703, India
- **Dedicated Email:** supportrmsgifthampers@gmail.com / rmsgifthampers@gmail.com
- **Direct Phone / WhatsApp:** +91 92849 05118 (Mon–Sat, 10:00 AM – 7:00 PM IST)
- **Acknowledgment Window:** Within 48 hours of complaint receipt with unique ticket reference.
- **Resolution Window:** Investigation and final redressal within 30 days.
- **Statutory Consumer Escalation:** National Consumer Helpline (NCH) toll-free: `1915` or `consumerhelpline.gov.in`.

---

## 4. Policy Page Audit & Verification

1. **Terms & Conditions (`/terms`):**
   - Incorporates business identity, age gate (18+ under Indian Contract Act 1872), order acceptance, cancellation conditions, pricing transparency, and Navi Mumbai / Maharashtra jurisdiction for dispute resolution.
2. **Privacy Policy (`/privacy`):**
   - Compliant with DPDP Act 2023. Explains data categories collected, lawful processing purposes, storage with Supabase, zero third-party sale of personal information, customer deletion rights, and contact details.
3. **Cookie & Storage Policy (`/cookies`):**
   - Fully documents `sb-*-auth-token`, `rms_shopping_cart`, `rms_theme_mode`, `rms_cookie_consent_v1`, and optional `_ga` cookies. Provides direct interactive button to modify tracking preferences at any time.
4. **Cancellation & Refund Policy (`/refund-policy`):**
   - Differentiates standard catalogue hampers from customized hampers. Explains 48-hour transit damage reporting window with photo/video proof requirement. Formally states 5 to 7 business day refund timeline for UPI/bank transfers.
