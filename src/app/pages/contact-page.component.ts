import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-20">

        <!-- MAIN SMART WORKSPACE (FLUID 2-COLUMN DESKTOP SPLIT) -->
        <main class=" mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <div class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                We are online &amp; ready to help
              </div>
              <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                Contact Us &amp; WhatsApp Support
              </h1>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                Custom hampers, festival bulk orders, or order status inquiries
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a
                [href]="'https://wa.me/' + settings.whatsapp_no + '?text=Hello%20RMS%20Gift%20Hampers!%20I%20have%20an%20inquiry.'"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition active:scale-95"
              >
                <i class="fa-brands fa-whatsapp text-sm"></i>
                <span>Chat on WhatsApp</span>
              </a>
              <a
                [href]="'tel:' + settings.whatsapp_no"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] shadow-2xs hover:border-[#9C4738] transition"
              >
                <i class="fa-solid fa-phone text-xs"></i>
                <span>+91 92849 05118</span>
              </a>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- LEFT 7 COLUMNS: INSTANT CONCIERGE CHANNELS & QUICK MESSAGE FORM -->
            <div class="lg:col-span-7 space-y-6">

              <!-- Direct Channels Card Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- WhatsApp Channel -->
                <div class="p-5 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div class="flex items-start justify-between">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-lg">
                      <i class="fa-brands fa-whatsapp"></i>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Fastest &bull; ~5 Mins
                    </span>
                  </div>

                  <div>
                    <h3 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">WhatsApp Support</h3>
                    <p class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">{{ settings.contact_no }}</p>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-1 leading-relaxed">
                      Instant replies for urgent orders, custom photos, live quotes, and delivery tracking.
                    </p>
                  </div>

                  <a
                    [href]="'https://wa.me/' + settings.whatsapp_no + '?text=Hello%20RMS%20Creations!%20I%20have%20an%20inquiry.'"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>Start Chat</span>
                  </a>
                </div>

                <!-- Email Channel -->
                <div class="p-5 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs flex flex-col justify-between space-y-3">
                  <div class="flex items-start justify-between">
                    <div class="w-10 h-10 rounded-2xl bg-[#FAF7F2] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-lg">
                      <i class="fa-solid fa-envelope"></i>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">
                      Corporate &amp; Bulk
                    </span>
                  </div>

                  <div>
                    <h3 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">Email Studio</h3>
                    <p class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] mt-0.5 truncate">{{ settings.contact_email }}</p>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-1 leading-relaxed">
                      For corporate tie-ups, invoice inquiries, formal proposals, and event quotations.
                    </p>
                  </div>

                  <a
                    [href]="'mailto:' + settings.contact_email"
                    class="w-full py-2.5 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-envelope text-xs"></i>
                    <span>Send Email</span>
                  </a>
                </div>

              </div>

              <!-- 1-Click WhatsApp Conversation Starters -->
              <div class="p-5 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-3">
                <div class="flex items-center gap-2 pb-2 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-solid fa-bolt text-amber-500 text-sm"></i>
                  <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                    1-Click WhatsApp Starters
                  </h3>
                  <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] ml-auto">Pre-formatted templates</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    *ngFor="let preset of quickPresets"
                    [href]="preset.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] hover:bg-white dark:hover:bg-white/5 transition flex items-center gap-3 cursor-pointer group"
                  >
                    <i [class]="preset.iconClass + ' text-[#9C4738] dark:text-[#EB9D8E] text-sm group-hover:scale-110 transition-transform'"></i>
                    <div class="min-w-0">
                      <span class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] block truncate">{{ preset.label }}</span>
                      <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] block truncate">Launch direct chat &rarr;</span>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Quick Message Form -->
              <div class="p-6 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div>
                    <h3 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      Send an Inquiry
                    </h3>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Leave your details and our team will get back to you promptly.</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E]">
                    Quick Support
                  </span>
                </div>

                <div *ngIf="inquirySent" class="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-base"></i>
                    <span>Thank you! Your inquiry has been sent. Our team will reply shortly.</span>
                  </div>
                  <button (click)="inquirySent = false" class="text-xs underline text-emerald-800">Send Another</button>
                </div>

                <form *ngIf="!inquirySent" (ngSubmit)="sendInquiry()" class="space-y-3.5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Your Name <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="inquiryName"
                        name="inquiryName"
                        required
                        placeholder="e.g. Radhika Sharma"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        WhatsApp Number <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        [(ngModel)]="inquiryPhone"
                        name="inquiryPhone"
                        required
                        placeholder="10-digit mobile number"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Inquiry Category
                    </label>
                    <select
                      [(ngModel)]="inquiryCategory"
                      name="inquiryCategory"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none cursor-pointer"
                    >
                      <option value="Custom Hamper Inquiry">Custom Hamper / Build Your Own</option>
                      <option value="Corporate Bulk Order">Corporate Bulk Order / Event Favours</option>
                      <option value="Delivery Status Inquiry">Delivery Status / Pin Code Availability</option>
                      <option value="General Question">General Gifting Question</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Message or Requirements <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      [(ngModel)]="inquiryMessage"
                      name="inquiryMessage"
                      rows="3"
                      required
                      placeholder="Tell us what you're looking for, desired delivery date, budget per hamper, etc."
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] resize-none"
                    ></textarea>
                  </div>

                  <div class="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="submit"
                      [disabled]="!inquiryName.trim() || !inquiryPhone.trim() || !inquiryMessage.trim()"
                      class="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <i class="fa-brands fa-whatsapp text-sm"></i>
                      <span>Send via WhatsApp</span>
                    </button>

                    <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] text-center">
                      Opens WhatsApp with your pre-filled inquiry.
                    </span>
                  </div>
                </form>
              </div>

            </div>

            <!-- RIGHT 5 COLUMNS: STUDIO ADDRESS, GRIEVANCE OFFICER & FAQS -->
            <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

              <!-- Physical Studio Address & Hours Card -->
              <div class="p-6 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-3.5">
                <div class="flex items-center gap-2 pb-2.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-solid fa-location-dot text-[#9C4738] text-sm"></i>
                  <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                    Studio &amp; Operational Hub
                  </h3>
                </div>

                <div class="space-y-2 text-xs">
                  <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">RMS Creations Studio</p>
                  <p class="text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                    Plot 42, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703, India.
                  </p>
                  <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between text-[11px]">
                    <span class="text-[#7A6C5E] dark:text-[#C5A393]">Studio Hours:</span>
                    <strong class="text-[#2E2825] dark:text-[#F4F1ED]">Mon – Sat: 10:00 AM – 7:00 PM IST</strong>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Sector+15+Vashi+Navi+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline pt-1"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>View on Google Maps &rarr;</span>
                </a>
              </div>

              <!-- Statutory Grievance Redressal Card -->
              <div class="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <i class="fa-solid fa-scale-balanced text-amber-600"></i>
                  <span>Consumer Grievance Redressal</span>
                </div>
                <p class="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  In compliance with Rule 4(4) of Consumer Protection (E-Commerce) Rules, 2020: Every consumer grievance is acknowledged within <strong>48 hours</strong> and resolved within <strong>30 days</strong>.
                </p>
                <div class="pt-1 flex items-center justify-between text-[10px] font-bold text-amber-900 dark:text-amber-200">
                  <a routerLink="/grievance" class="underline hover:text-[#9C4738]">View Grievance Officer Details &rarr;</a>
                  <a routerLink="/refund-policy" class="underline hover:text-[#9C4738]">Refund &amp; Return Policy</a>
                </div>
              </div>

              <!-- Interactive FAQ Accordion -->
              <div class="p-6 rounded-3xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-3">
                <div class="flex items-center justify-between pb-2.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-question text-[#9C4738] text-sm"></i>
                    <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                      FAQs
                    </h3>
                  </div>
                  <span class="text-[10px] text-[#7A6C5E] font-medium">Quick Answers</span>
                </div>

                <div class="space-y-2">
                  <div
                    *ngFor="let faq of faqs; let i = index"
                    class="rounded-xl border border-[#EADFD2]/70 dark:border-white/10 overflow-hidden bg-[#FAF7F2] dark:bg-[#251F1C] transition-all"
                  >
                    <button
                      type="button"
                      (click)="toggleFaq(i)"
                      class="flex w-full items-center justify-between p-3 text-left font-serif font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED] cursor-pointer"
                    >
                      <span class="pr-2">{{ faq.question }}</span>
                      <span class="text-xs text-[#9C4738] shrink-0 font-mono">{{ openFaqIndex === i ? '−' : '+' }}</span>
                    </button>
                    <div
                      *ngIf="openFaqIndex === i"
                      class="px-3 pb-3 pt-1 text-[11px] leading-relaxed text-[#7A6C5E] dark:text-[#C5A393] border-t border-[#EADFD2]/60 dark:border-white/10"
                    >
                      {{ faq.answer }}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>

      </div>
    </app-site-layout>
  `
})
export class ContactPageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);

  openFaqIndex: number | null = 0;

  settings: any = {
    whatsapp_no: '919284905118',
    contact_no: '+91 92849 05118',
    contact_email: 'rmsgifthampers@gmail.com',
    address: 'RMS Creations Studio, Plot 42, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703, India'
  };

  inquiryName = '';
  inquiryPhone = '';
  inquiryCategory = 'Custom Hamper Inquiry';
  inquiryMessage = '';
  inquirySent = false;

  quickPresets = [
    {
      iconClass: 'fa-solid fa-gift',
      label: 'Custom Hamper Inquiry',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20want%20to%20inquire%20about%20a%20custom%20gift%20hamper.'
    },
    {
      iconClass: 'fa-solid fa-briefcase',
      label: 'Corporate Bulk Inquiry',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20want%20to%20inquire%20about%20corporate%20bulk%20gifting.'
    },
    {
      iconClass: 'fa-solid fa-truck-fast',
      label: 'Check Delivery Timeline',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20would%20like%20to%20check%20delivery%20timelines.'
    },
    {
      iconClass: 'fa-solid fa-ribbon',
      label: 'Event Return Gifts',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20need%20information%20on%20party%20return%20gifts.'
    }
  ];

  faqs = [
    {
      question: 'How do I place an order for a gift hamper?',
      answer: 'Browse any collection on our store and click "Order Online" or "Add to Cart" to checkout with Cash on Delivery (COD) or Free 0% UPI. For bespoke personalized styling, launch our online "Build Your Own Hamper" studio to customize your box.'
    },
    {
      question: 'Can I choose specific items to include in a hamper?',
      answer: 'Yes! Every hamper can be fully customized with chocolates, luxury keepsakes, personalized notes, plushies, skincare items, or festive items according to your vision.'
    },
    {
      question: 'Do you cater to corporate or bulk event return gifts?',
      answer: 'Yes, we curate bulk hampers for corporate events, weddings, baby showers, and birthdays. Message us on WhatsApp or Email for tier discounts.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Local Mumbai/Navi Mumbai/Thane takes 24–48 hours. Major Indian cities take 2–4 business days, and rest of India takes 3–7 business days.'
    }
  ];

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Contact RMS Creations | WhatsApp Concierge & Support',
      description: 'Get in touch with RMS Creations studio in Vashi, Navi Mumbai for bespoke hamper inquiries, bulk orders, and delivery assistance.',
      keywords: 'contact rms creations, custom hamper enquiry, whatsapp concierge, vashi navi mumbai, bulk hampers Mumbai',
      slug: 'contact'
    });

    this.seo.setBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Contact Studio', url: '/contact' }
    ]);

    this.seo.setFaqSchema(this.faqs);

    this.loadLiveSettings();
  }

  async loadLiveSettings() {
    try {
      const { data } = await this.supabase.from('app_settings').select('*').single();
      if (data) {
        this.settings = {
          whatsapp_no: data.whatsapp_no || this.settings.whatsapp_no,
          contact_no: data.contact_no || this.settings.contact_no,
          contact_email: data.contact_email || this.settings.contact_email,
          address: data.address || this.settings.address
        };
      }
    } catch {
      // Keep defaults
    } finally {
      this.cdr.markForCheck();
    }
  }

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  sendInquiry() {
    if (!this.inquiryName.trim() || !this.inquiryPhone.trim() || !this.inquiryMessage.trim()) return;

    const formattedText = `Hello RMS Creations! My name is ${encodeURIComponent(this.inquiryName)} (${encodeURIComponent(this.inquiryPhone)}). Regarding: ${encodeURIComponent(this.inquiryCategory)}. Inquiry: ${encodeURIComponent(this.inquiryMessage)}`;
    const url = `https://wa.me/${this.settings.whatsapp_no}?text=${formattedText}`;

    this.inquirySent = true;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  ngOnDestroy() {
    this.seo.removeJsonLd('faq-json-ld');
    this.seo.removeJsonLd('breadcrumbs-json-ld');
  }
}
