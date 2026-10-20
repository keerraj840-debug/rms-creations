# Asset & Intellectual Property License Audit — RMS Creations

**Entity:** RMS Creations Studio  
**Audit Scope:** Fonts, Iconography, Banners, Product Photography, Sourcing Web Photos, Brand Assets, Sound & Media  
**Audit Date:** October 20, 2026  
**Governing Laws:** Indian Copyright Act, 1957, Trade Marks Act, 1999, IT Rules 2021  

---

## 1. Typography & Font Licensing

| Asset Category | Font Family / Source | Storage & Loading | License Type | Commercial Use Permitted? | Privacy & Compliance Status |
|:---|:---|:---|:---|:---:|:---|
| **Primary Sans-Serif Font** | Modern System & Open Sans Fallback | Local CSS stack | System Fonts / SIL Open Font License (OFL) | **YES** | **CLEARED.** Self-hosted locally; no remote IP transmission to Google Fonts or Adobe Typekit. |
| **Boutique Serif Accent** | Georgia / Editorial Serif | Local font-family stack | OS Native Core Fonts (Apple / Microsoft / Linux) | **YES** | **CLEARED.** Zero remote licensing fee; 100% offline & CSP compliant. |

---

## 2. Iconography & Vector Assets

| Asset Category | Library / Package | Version | License | Commercial Attribution Required? | Status |
|:---|:---|:---:|:---:|:---:|:---|
| **Vector Icons** | FontAwesome Free Webfonts (`@fortawesome/fontawesome-free`) | `^7.3.1` (package.json) | CC BY 4.0 (Icons), SIL OFL 1.1 (Fonts), MIT (Code) | No attribution required for web font usage | **CLEARED.** Bundled locally in `node_modules` and compiled into CSS bundle. |

---

## 3. Brand Imagery & Media Audit

| Asset | Path / Source | Identified Usage | Ownership / License Record | Verification Finding & Owner Action |
|:---|:---|:---|:---|:---|
| **RMS Brand Logo** | `src/assets/logo.png` | Header, Footer, Favicons, PWA App Icons | Proprietary brand asset created for RMS Creations Studio. | **CLEARED.** Proprietary original asset of the business owner. |
| **Festive Banners** | `src/assets/banners/banner.png`, `og-preview.jpg` | Hero banner carousel, Open Graph preview image | Custom-curated studio product photography of handcrafted hampers. | **CLEARED.** Original photography of RMS Creations hampers. |
| **Catalog Product Images** | Supabase Storage (`images` bucket) | Active catalog gift hampers (`public.products`) | Uploaded by RMS admin team depicting actual hampers, packaging, and ribbon arrangements. | **OWNER VERIFIED.** Must maintain continuous records of actual studio photo shoots. Seeded demo entries should be reviewed before public launch. |
| **Sourcing Candidates (Unsplash Search Service)** | Unsplash Public API (`ItemSourcingImageService`) | Item candidate picker in admin product details and item forms | Unsplash License (Commercial and non-commercial use permitted without permission, excluding resale of unworked photos). | **CLEARED FOR EDITORIAL/PREVIEW.** Images downloaded to Supabase storage are used as illustrative item references. When actual products are photographed in studio, owners should replace stock photos with original workshop photography. |

---

## 4. Reviews, Social Proof & Marketing Claims

1. **Customer Reviews & Testimonials:**
   - **Finding:** No fake or fabricated reviews (e.g. "John D. says 5 stars") are hardcoded into the codebase. 
   - **Recommendation:** Do not inject synthetic reviews or third-party star badges unless linked to verified purchase feedback collected from real buyers.
2. **Promotional Slogans:**
   - Reviewed hero copy and product badges. "Guaranteed safe packaging" was revised to "protective multi-layer packaging" to ensure alignment with factual packaging standards and avoid statutory advertising claims under the Consumer Protection Act, 2019.
3. **Intellectual Property Takedown Procedure:**
   - Published clear statutory notice in the footer legal modal compliant with Section 52(1)(c) of the Indian Copyright Act, 1957, appointing the Grievance Officer in Navi Mumbai as the authorized contact for IP complaints.
