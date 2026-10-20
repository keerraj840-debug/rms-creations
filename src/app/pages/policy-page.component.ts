import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { CookieConsentService } from '../services/cookie-consent.service';

export type PolicySection = 'terms' | 'privacy' | 'cookies' | 'shipping' | 'refunds' | 'grievance';

@Component({
  selector: 'app-policy-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">

        <!-- MAIN CONTENT WITH SMART FLUID 2-COLUMN LAYOUT -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

          <!-- Sleek Header Row with Instant Grievance Support CTA -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                Customer Policies &amp; Help
              </h1>
              
            </div>
            <a
              routerLink="/contact"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-95 shrink-0"
            >
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>Need Help? WhatsApp: +91 92849 05118</span>
            </a>
          </div>
          
          <!-- MOBILE TABS SEGMENTED BAR -->
          <div class="lg:hidden mb-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
            <button
              type="button"
              *ngFor="let tab of tabs"
              (click)="selectTab(tab.id)"
              [class]="activeTab === tab.id
                ? 'bg-[#9C4738] text-white font-bold shadow-xs'
                : 'bg-white dark:bg-[#1E1916] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 font-medium'"
              class="min-h-[38px] px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <i [class]="tab.icon + ' mr-1 text-[11px]'"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- DESKTOP STICKY SIDEBAR NAVIGATION (4 COLS) -->
            <aside class="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 shadow-xs space-y-1.5">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] px-3 pb-2 border-b border-[#EADFD2]/60 dark:border-white/10">
                  Policy Navigator
                </p>

                <button
                  type="button"
                  *ngFor="let tab of tabs"
                  (click)="selectTab(tab.id)"
                  [class]="activeTab === tab.id
                    ? 'bg-[#FAF7F2] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-4 border-[#9C4738]'
                    : 'text-[#4A3C31] dark:text-[#D9C3B9] hover:bg-[#FAF7F2]/60 dark:hover:bg-white/5 font-medium border-l-4 border-transparent'"
                  class="w-full px-3 py-2.5 rounded-xl text-left text-xs transition flex items-center gap-3 cursor-pointer"
                >
                  <i [class]="tab.icon + ' text-sm w-4 text-center shrink-0'"></i>
                  <div class="min-w-0">
                    <span class="block truncate">{{ tab.label }}</span>
                    <span class="block text-[10px] text-[#7A6C5E] dark:text-[#C5A393] font-normal truncate">{{ tab.sub }}</span>
                  </div>
                </button>
              </div>

              <!-- Quick Statutory Card -->
              <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2">
                <span class="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <i class="fa-solid fa-building-circle-check text-amber-600"></i>
                  <span>Registered Studio Identity</span>
                </span>
                <p class="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong>RMS Creations Studio</strong><br />
                  Inquiries: rmsgifthampers&#64;gmail.com<br />
                  Helpline / WhatsApp: +91 92849 05118
                </p>
              </div>
            </aside>

            <!-- RIGHT CONTENT AREA (8 COLS) -->
            <article class="lg:col-span-8 bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-10 shadow-xs space-y-8">

              <!-- ========================================== -->
              <!-- 1. TERMS AND CONDITIONS                    -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'terms'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    Contract of Sale &amp; Usage
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Terms and Conditions of Service
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Governed by the Indian Contract Act, 1872, and the Consumer Protection (E-Commerce) Rules, 2020.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base">1. Business Identity &amp; Platform Scope</h3>
                  <p>
                    These Terms of Service constitute a legally binding agreement between you ("Customer", "User", or "Recipient") and <strong>RMS Creations Studio</strong> (operating under the trade name <strong>RMS Gift Hampers</strong>), having its principal operational studio at 
                  </p>
                  <p>
                    By accessing, browsing, registering on, or placing an order through this website, you confirm your acceptance of these Terms, along with our Privacy Policy and Cancellation &amp; Refund Policy.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">2. User Eligibility &amp; Age Requirements</h3>
                  <p>
                    In compliance with Section 11 of the Indian Contract Act, 1872, you must be at least 18 years of age and competent to enter into a contract to register an account, checkout, or enter into commercial transactions on this website. If you are under 18 years of age, you may browse the website solely under the supervision of a parent or legal guardian.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">3. Handcrafted Product Characteristics &amp; Inclusions</h3>
                  <p>
                    RMS Creations curates handcrafted, artisanal gift hampers, festive pooja boxes, and event favors. Because our gift hampers are individually assembled by hand, minor variations in ribbon tying, arrangement, box texture, or packaging trims represent the authentic characteristics of handmade gifting and shall not be deemed defects.
                  </p>
                  <p>
                    All gourmet items (dry fruits, chocolates, sweets) are sourced from licensed, quality-checked suppliers and sealed for transit hygiene.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">4. Pricing, Taxes &amp; Transparent Delivery Fees</h3>
                  <p>
                    All prices are quoted in <strong>Indian National Rupees (INR ₹)</strong> and are inclusive of all applicable taxes. Delivery charges are calculated transparently based on your destination postal PIN code and shipment weight, and are explicitly disclosed to you before order confirmation. There are no hidden fees or surprise markups.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">5. Order Placement &amp; Bespoke Consultation Studio</h3>
                  <p>
                    <strong>Standard Catalogue Orders:</strong> Placing an order through our shopping cart constitutes an offer to purchase. Order acceptance is confirmed when an official Order ID is generated and communicated via on-screen confirmation, email, and WhatsApp notification.
                  </p>
                  <p>
                    <strong>Build Your Own Hamper Studio:</strong> When you create a custom hamper, you can order directly through our cart, chat on WhatsApp, or request a custom bulk quote. For quote requests, no payment is charged until you review and approve your hamper with our team.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">6. Payment Methods &amp; Safety</h3>
                  <p>
                    We provide two secure, customer-friendly payment channels:
                  </p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Cash on Delivery (COD):</strong> Pay cash directly to the delivery courier upon safe parcel receipt.</li>
                    <li><strong>Online UPI Transfer:</strong> Direct payment via standard Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM) to our verified merchant account <strong>7350120467&#64;upi</strong>.</li>
                  </ul>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">7. Intellectual Property</h3>
                  <p>
                    All brand logos, photography, styling lookbooks, hamper compositions, and software source code on this website are the exclusive intellectual property of RMS Creations Studio protected under the Indian Copyright Act, 1957, and Trademarks Act, 1999. Unauthorized reproduction or commercial imitation is strictly prohibited.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">8. Governing Law &amp; Jurisdiction</h3>
                  <p>
                    These Terms and all disputes arising hereunder shall be governed by and construed in accordance with the <strong>laws of India</strong>. Subject to our Grievance Redressal process, the competent courts located in <strong>Navi Mumbai / Thane / Mumbai, Maharashtra</strong> shall have exclusive territorial jurisdiction.
                  </p>
                </div>
              </section>

              <!-- ========================================== -->
              <!-- 2. PRIVACY POLICY                          -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'privacy'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    Data Protection &amp; Security
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Privacy Policy &amp; Data Governance
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Aligned with the Digital Personal Data Protection Act, 2023 (DPDP Act 2023) and Information Technology Act, 2000.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base">1. Commitment to Customer Privacy</h3>
                  <p>
                    At RMS Creations Studio, we treat your personal information with utmost sanctity. We collect only what is strictly required to fulfill your gifting orders, customize hampers, communicate delivery updates, and safeguard your account.
                  </p>
                  <p class="font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                    We do not sell, rent, monetise, or distribute customer personal information to third-party advertising brokers or data aggregators.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">2. Personal Data We Collect</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Account Credentials:</strong> Full name, email address, hashed passwords (safely managed via Supabase Auth), mobile phone number, date of birth, and gender.</li>
                    <li><strong>Delivery &amp; Logistics Data:</strong> Recipient name, complete shipping address, postal landmark, city, state, pin code, and delivery contact phone.</li>
                    <li><strong>Order Records:</strong> Items selected, custom gift card greeting messages, total order value, payment method, and dispatch timestamps.</li>
                    <li><strong>Custom Hamper Media:</strong> Photos or reference images voluntarily uploaded by you to assist our artisans in custom hamper curation.</li>
                  </ul>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">3. Legal Grounds &amp; Purpose of Processing</h3>
                  <p>
                    In accordance with the DPDP Act 2023, data is processed on lawful grounds of contractual fulfillment and explicit consent for:
                  </p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>Assembling and dispatching orders to the recipient's doorstep.</li>
                    <li>Transmitting automated transactional confirmations and courier dispatch notifications.</li>
                    <li>Facilitating customer-initiated support via WhatsApp support or email.</li>
                    <li>Preventing duplicate orders and unauthorized access through Row Level Security (RLS).</li>
                  </ul>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">4. Third-Party Service Providers</h3>
                  <p>
                    Data is shared strictly with essential operational partners:
                  </p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Courier &amp; Logistics Partners:</strong> Recipient shipping details are shared solely to effectuate parcel transit.</li>
                    <li><strong>Database &amp; Cloud Infrastructure:</strong> Hosted securely on Supabase with encrypted data stores and PostgreSQL Row Level Security.</li>
                    <li><strong>Transactional Communications:</strong> Email delivery via Resend/SMTP infrastructure; instant customer order updates via WhatsApp Business API.</li>
                  </ul>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">5. Privacy Rights &amp; Data Deletion</h3>
                  <p>
                    You possess full sovereignty over your personal data:
                  </p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Access &amp; Rectification:</strong> Edit your profile details and saved delivery addresses anytime in <a routerLink="/my-account" class="text-[#9C4738] dark:text-[#EB9D8E] font-bold underline">My Account</a>.</li>
                    <li><strong>Account Erasure:</strong> Request deactivation or deletion of your profile data by contacting our Grievance Officer at <strong>rmsgifthampers&#64;gmail.com</strong>. Historical commercial tax invoices are retained strictly as required by Indian taxation statutes.</li>
                    <li><strong>Marketing Opt-out:</strong> Unsubscribe from promotional announcements at any time using our footer opt-out tool. Essential transactional order receipts will still be delivered.</li>
                  </ul>
                </div>
              </section>

              <!-- ========================================== -->
              <!-- 2B. COOKIE & TRACKING POLICY               -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'cookies'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    Browser Storage &amp; Transparency
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Cookie &amp; Local Storage Policy
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Transparent disclosure of cookies and browser storage technologies under India's DPDP Act, 2023.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base">1. What Technologies We Use</h3>
                  <p>
                    RMS Creations uses browser storage (localStorage and sessionStorage) and limited cookies to deliver a fast, secure, and personalized gift hamper shopping journey. We do not sell tracking profiles or partner with cross-app behavioural data brokers.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">2. Verified Storage &amp; Cookie Inventory</h3>
                  <div class="overflow-x-auto rounded-2xl border border-[#EADFD2] dark:border-white/10">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead class="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#EADFD2] dark:border-white/10 text-[#2E2825] dark:text-[#F4F1ED] font-bold">
                        <tr>
                          <th class="p-3">Key / Cookie</th>
                          <th class="p-3">Provider / Type</th>
                          <th class="p-3">Category</th>
                          <th class="p-3">Purpose</th>
                          <th class="p-3">Duration</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-[#EADFD2]/60 dark:divide-white/10 text-[#4A3C31] dark:text-[#D9C3B9]">
                        <tr>
                          <td class="p-3 font-mono font-semibold">sb-*-auth-token</td>
                          <td class="p-3">Supabase Auth</td>
                          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">Strictly Essential</span></td>
                          <td class="p-3">Authenticates customer logins and protects order history</td>
                          <td class="p-3">Session / Refresh Token</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-semibold">rms_shopping_cart</td>
                          <td class="p-3">RMS Creations</td>
                          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">Strictly Essential</span></td>
                          <td class="p-3">Persists cart contents so items are not lost while browsing</td>
                          <td class="p-3">Persistent LocalStorage</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-semibold">rms_theme_mode</td>
                          <td class="p-3">RMS Creations</td>
                          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">Strictly Essential</span></td>
                          <td class="p-3">Remembers your light or dark mode display preference</td>
                          <td class="p-3">Persistent LocalStorage</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-semibold">rms_cookie_consent_v1</td>
                          <td class="p-3">RMS Creations</td>
                          <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">Strictly Essential</span></td>
                          <td class="p-3">Stores your affirmative consent and preferences</td>
                          <td class="p-3">Persistent LocalStorage</td>
                        </tr>
                        <tr>
                          <td class="p-3 font-mono font-semibold">_ga, _ga_*</td>
                          <td class="p-3">Google Analytics 4</td>
                          <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">Optional Analytics</span></td>
                          <td class="p-3">Measures aggregate visits and popular hamper interactions</td>
                          <td class="p-3">Up to 2 years (Disabled by default without consent)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">3. Managing Your Preferences</h3>
                  <p>
                    Under India's Digital Personal Data Protection Act, 2023, you can grant or withdraw consent for non-essential analytics tracking at any time:
                  </p>
                  <div class="pt-2">
                    <button
                      type="button"
                      (click)="cookieConsentService.openPreferences()"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9C4738] hover:bg-[#7E3528] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <i class="fa-solid fa-sliders"></i>
                      <span>Open Cookie Preferences</span>
                    </button>
                  </div>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] pt-1">
                    You can also block or clear cookies directly in your browser settings (Chrome, Safari, Firefox, Edge). Note that blocking essential storage will prevent signing into your account or adding hampers to your bag.
                  </p>
                </div>
              </section>

              <!-- ========================================== -->
              <!-- 3. SHIPPING & DELIVERY POLICY              -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'shipping'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    Logistics &amp; Dispatch
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Shipping and Delivery Policy
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Safe transit, doorstep fulfillment, and delivery estimates across India.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base">1. Delivery Coverage &amp; PIN Code Verification</h3>
                  <p>
                    RMS Creations delivers gift hampers across all serviceable postal PIN codes in India. Every product page and checkout step features our real-time PIN code delivery checker so you can instantly verify serviceability before ordering.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">2. Delivery Charges &amp; Postal Calculation</h3>
                  <div class="p-3.5 bg-[#FAF7F2] dark:bg-white/5 rounded-2xl border border-[#EADFD2] dark:border-white/10 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">Pan-India Courier Delivery:</span>
                      <span class="font-bold text-[#9C4738] dark:text-[#EB9D8E]">Calculated by PIN Code &amp; Parcel Weight</span>
                    </div>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] pt-1">
                      Delivery fees are dynamically calculated starting from ₹49 based on destination postal PIN code, distance, and total package weight to ensure secure, insured transport.
                    </p>
                  </div>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">3. Dispatch &amp; Estimated Delivery Timelines</h3>
                  <ul class="list-disc pl-5 space-y-1.5">
                    <li><strong>Mumbai, Navi Mumbai &amp; Thane (Local Hub):</strong> Orders are dispatched within 24 hours. Doorstep delivery takes <strong>24 to 48 hours</strong>.</li>
                    <li><strong>Maharashtra &amp; Major Indian Metros:</strong> Delivery takes <strong>2 to 4 business days</strong> following dispatch.</li>
                    <li><strong>Rest of India (Tier 2/3 Cities &amp; Regions):</strong> Delivery takes <strong>3 to 7 business days</strong> depending on courier network accessibility.</li>
                  </ul>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] italic">
                    Note: During high-volume festive seasons (Ganpati Festival, Diwali, Raksha Bandhan), customers are encouraged to order 4 to 5 days in advance to prevent courier holiday congestion.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">4. Protective Packing &amp; Transit Safety</h3>
                  <p>
                    Every gift hamper is packaged with multi-layer bubble wrap, protective corrugated outer cartons, and tamper-resistant seals to ensure delicate mementos, glass containers, and dry fruits arrive in immaculate condition.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">5. Shipment Tracking</h3>
                  <p>
                    Once dispatched, your AWB consignment tracking number is automatically emailed and sent to your registered WhatsApp. You can also view live status updates directly on our <a routerLink="/my-orders" class="text-[#9C4738] dark:text-[#EB9D8E] font-bold underline">My Orders</a> dashboard.
                  </p>
                </div>
              </section>

              <!-- ========================================== -->
              <!-- 4. CANCELLATION, REFUND & RETURN POLICY    -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'refunds'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    Returns &amp; Reimbursement
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Cancellation, Return &amp; Refund Policy
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Clear policies tailored to handcrafted goods, food hygiene, and personalized items.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base">1. Order Cancellation Policy</h3>
                  <p>
                    <strong>Standard Catalogue Hampers:</strong> You may cancel your order without cancellation fee at any time <strong>prior to shipment dispatch</strong>. To cancel, please contact our support team immediately on WhatsApp (<strong>+91 92849 05118</strong>) or email <strong>rmsgifthampers&#64;gmail.com</strong> with your Order ID.
                  </p>
                  <p>
                    <strong>Custom &amp; Personalized Hampers:</strong> Because bespoke hampers involve personalized printing, names, and perishable ingredients, cancellation is permitted only <strong>prior to the commencement of artisan assembly</strong>. Once personalized materials or food seals are assembled, custom orders cannot be cancelled.
                  </p>
                  <p>
                    Orders that have already been handed over to the courier partner cannot be cancelled in transit.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">2. Return Eligibility</h3>
                  <p>
                    In accordance with standard hygiene and safety norms under Indian e-commerce consumer guidelines, gift hampers containing food items (chocolates, sweets, dry fruits) or custom keepsakes are <strong>non-returnable once safely delivered in sound condition</strong>.
                  </p>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">3. Transit Damage, Defective or Incorrect Items</h3>
                  <p>
                    Your satisfaction is our solemn promise. If your parcel arrives damaged, opened, defective, or missing items:
                  </p>
                  <ol class="list-decimal pl-5 space-y-1.5">
                    <li>Notify our support team within <strong>48 hours</strong> of parcel delivery.</li>
                    <li>Share photos or a short unboxing video illustrating the damage alongside the outer courier label via WhatsApp (<strong>+91 92849 05118</strong>) or email.</li>
                    <li>Upon swift review by our quality team, we will immediately arrange either an <strong>expedited replacement dispatched via courier</strong> or a <strong>full/partial refund</strong> per your preference.</li>
                  </ol>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">4. Refund Processing Timelines &amp; Methods</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>UPI &amp; Online Payments:</strong> Refunds are credited directly back to your original source UPI VPA or bank account within <strong>5 to 7 business days</strong>.</li>
                    <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds for verified returns on COD orders are credited via direct UPI or NEFT upon customer providing bank details to our official support team.</li>
                    <li>You will receive an email confirmation and reference transaction ID immediately upon refund initiation.</li>
                  </ul>
                </div>
              </section>

              <!-- ========================================== -->
              <!-- 5. GRIEVANCE REDRESSAL OFFICER             -->
              <!-- ========================================== -->
              <section *ngIf="activeTab === 'grievance'" class="space-y-6">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Statutory E-Commerce Compliance
                  </span>
                  <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    Consumer Grievance Redressal
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Mandatory publication under Rule 4(4) and Rule 5(3)(a) of Consumer Protection (E-Commerce) Rules, 2020.
                  </p>
                </div>

                <div class="space-y-4 text-xs sm:text-sm text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
                  <p>
                    RMS Creations Studio is committed to prompt, fair, and empathetic resolution of all customer concerns. In strict compliance with the <strong>Consumer Protection Act, 2019</strong>, the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, and the <strong>Information Technology (Intermediary Guidelines) Rules, 2021</strong>, we have appointed a dedicated Grievance Redressal Officer.
                  </p>

                  <!-- Statutory Officer Card -->
                  <div class="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 space-y-3">
                    <div class="flex items-center gap-2.5 pb-2 border-b border-[#EADFD2]/60 dark:border-white/10">
                      <i class="fa-solid fa-user-shield text-lg text-[#9C4738] dark:text-[#EB9D8E]"></i>
                      <div>
                        <h4 class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Nodal &amp; Grievance Redressal Officer</h4>
                        <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Consumer Affairs &amp; Regulatory Compliance</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Entity Name:</span>
                        <p class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">RMS Creations Studio</p>
                      </div>
                      <div>
                        <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Designated Email:</span>
                        <a href="mailto:supportrmsgifthampers@gmail.com" class="font-semibold text-[#9C4738] dark:text-[#EB9D8E] hover:underline">supportrmsgifthampers&#64;gmail.com</a>
                      </div>
                      <div>
                        <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Dedicated Telephone / WhatsApp:</span>
                        <p class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">+91 92849 05118</p>
                      </div>
                      <div>
                        <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Operational Working Hours:</span>
                        <p class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">Mon – Sat: 10:00 AM – 7:00 PM IST</p>
                      </div>
                      <div class="sm:col-span-2">
                        <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Official Postal Address for Legal Service:</span>
                        <p class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">
                          RMS Creations Studio, 
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-sm sm:text-base pt-2">Statutory Escalation &amp; Resolution Timelines</h3>
                  <ul class="list-disc pl-5 space-y-1.5">
                    <li><strong>Acknowledgment:</strong> Every grievance ticket or consumer inquiry submitted via email or WhatsApp is formally acknowledged within <strong>48 hours</strong> with a unique tracking reference.</li>
                    <li><strong>Redressal:</strong> Grievances are investigated and resolved within <strong>30 days</strong> from the date of receipt.</li>
                  </ul>

                  <p class="pt-2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                    If your concern remains unresolved after 30 days, consumers have the legal right under Indian law to approach the National Consumer Helpline (NCH) at <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" class="text-[#9C4738] underline">consumerhelpline.gov.in</a> or toll-free at 1915.
                  </p>
                </div>
              </section>

            </article>

          </div>
        </main>

      </div>
    </app-site-layout>
  `
})
export class PolicyPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly cookieConsentService = inject(CookieConsentService);

  activeTab: PolicySection = 'terms';

  readonly tabs: { id: PolicySection; label: string; sub: string; icon: string }[] = [
    { id: 'terms', label: 'Terms & Conditions', sub: 'Contract of sale, age gate, usage', icon: 'fa-solid fa-file-contract' },
    { id: 'privacy', label: 'Privacy Policy', sub: 'DPDP Act 2023, data security, rights', icon: 'fa-solid fa-user-shield' },
    { id: 'cookies', label: 'Cookie Policy', sub: 'Storage, analytics, and consent choices', icon: 'fa-solid fa-cookie-bite' },
    { id: 'shipping', label: 'Shipping & Delivery', sub: 'Pan-India transit, local timelines, fees', icon: 'fa-solid fa-truck-fast' },
    { id: 'refunds', label: 'Cancellation & Refunds', sub: 'Returns, transit damage, refund timeline', icon: 'fa-solid fa-arrow-rotate-left' },
    { id: 'grievance', label: 'Grievance Officer', sub: 'E-commerce rules 2020 compliance', icon: 'fa-solid fa-scale-balanced' }
  ];

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data['section']) {
        this.activeTab = data['section'];
      }
      this.updateSeo();
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab'] && this.isValidTab(params['tab'])) {
        this.activeTab = params['tab'];
        this.updateSeo();
      }
    });
  }

  selectTab(tab: PolicySection) {
    this.activeTab = tab;
    this.updateSeo();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
    this.cdr.markForCheck();
  }

  private isValidTab(tab: string): tab is PolicySection {
    return ['terms', 'privacy', 'cookies', 'shipping', 'refunds', 'grievance'].includes(tab);
  }

  private updateSeo() {
    const metaMap: Record<PolicySection, { title: string; desc: string }> = {
      terms: {
        title: 'Terms of Service | RMS Gift Hampers',
        desc: 'Read the official terms and conditions of purchase, customer responsibilities, and service policies for RMS Gift Hampers.'
      },
      privacy: {
        title: 'Privacy Policy | RMS Gift Hampers',
        desc: 'Learn how RMS Creations Studio protects your personal data in accordance with India DPDP Act 2023 and IT Act 2000.'
      },
      cookies: {
        title: 'Cookie & Tracking Policy | RMS Gift Hampers',
        desc: 'Understand how RMS Creations uses local storage, session storage, and analytics cookies, and manage your preferences.'
      },
      shipping: {
        title: 'Shipping & Delivery Policy | RMS Gift Hampers',
        desc: 'Explore delivery timelines, postal courier rates, packaging standards, and pan-India courier fulfillment.'
      },
      refunds: {
        title: 'Cancellation & Refund Policy | RMS Gift Hampers',
        desc: 'Understand order cancellation rules, transit damage claims, and prompt UPI/bank refund timelines.'
      },
      grievance: {
        title: 'Consumer Grievance Redressal | RMS Gift Hampers',
        desc: 'Statutory contact details of the Grievance Redressal Officer under Consumer Protection (E-Commerce) Rules 2020.'
      }
    };

    const current = metaMap[this.activeTab] || metaMap.terms;
    this.seo.setPageMetadata({
      title: current.title,
      description: current.desc,
      keywords: 'rms gift hampers legal, privacy policy, terms and conditions, refund policy, grievance officer',
      slug: this.activeTab
    });

    if (this.seo?.setBreadcrumbSchema) {
      this.seo.setBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Customer Policies', url: '/policy' },
        { name: current.title.split('|')[0].trim(), url: `/policy?tab=${this.activeTab}` }
      ]);
    }
  }
}
