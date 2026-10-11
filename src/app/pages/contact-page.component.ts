import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell transition-colors duration-300">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#1E1916] dark:via-[#1A1614] dark:to-[#141210] py-12 md:py-18 transition-colors duration-300">
        <!-- Ambient Decorative Glows -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Text Content -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#57251C] bg-[#FFFDFC]/90 dark:bg-[#2A221E]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Concierge & Bespoke Inquiries
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] sm:text-5xl lg:text-6xl leading-[1.15]">
                Let Us Curate <br />
                <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#E89382] underline decoration-[#EB9D8E] dark:decoration-[#C56D5B] decoration-wavy decoration-1 underline-offset-8">Your Perfect Gift</span>
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
                Whether you need a single bespoke hamper, festive kits, or bulk celebration return gifts, our design team is here to assist you.
              </p>

              <!-- Highlight Note Box -->
              <div class="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC]/90 dark:bg-[#231C18]/90 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F6F3] dark:bg-[#1E1916] text-lg text-[#C56D5B] dark:text-[#EB9D8E] border border-[#D9C3B9]/40 dark:border-[#382C26]">
                  <i class="fa-solid fa-bolt"></i>
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-sm">
                  <strong class="text-[#57251C] dark:text-[#F3ECE8]">Bespoke Hamper Design Studio:</strong> Use our online Build Your Own Hamper studio for real-time item simulation, custom requests, and personal artisan quotations.
                </p>
              </div>

              <!-- CTA Button -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  [href]="'https://wa.me/' + settings.whatsapp_no + '?text=Hello%20RMS%20Gift%20Hampers!%20I%20have%20an%20inquiry%20regarding%20gift%20hampers.'" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-lg shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 active:scale-95"
                >
                  <i class="fa-brands fa-whatsapp text-lg"></i>
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <!-- Right Hero Image Showcase -->
            <div class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                <img 
                  src="assets/banners/cta-banner.png" 
                  alt="Contact RMS gift hampers concierge" 
                  class="relative h-auto w-full rounded-[2rem] border-8 border-[#FFFDFC] dark:border-[#231C18] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DIRECT CONTACT CARDS & CONCIERGE CHANNELS -->
      <section class="bg-[#F7F6F3] dark:bg-[#1A1614] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Get In Touch</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Choose Your Preferred Channel</h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              Reach out directly on WhatsApp for immediate styling or send an email for formal bulk quotes.
            </p>
          </div>

          <div class="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <!-- WhatsApp Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-100/40 dark:bg-emerald-950/20 blur-2xl transition-all duration-300 group-hover:bg-emerald-200/50"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#1E1916] border border-[#D9C3B9]/40 dark:border-[#382C26] text-2xl text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">WhatsApp Concierge</h3>
                  <span class="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Instant</span>
                </div>
                <p class="mt-2 text-base font-bold text-[#9C4738] dark:text-[#E89382]">{{ settings.contact_no }}</p>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                  Ideal for urgent orders, bespoke image previews, custom budget quotes, and instant confirmations.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  [href]="'https://wa.me/' + settings.whatsapp_no + '?text=Hello%20RMS%20Gift%20Hampers!%20I%20have%20a%20question.'" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-lg active:scale-95"
                >
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Email Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-2xl transition-all duration-300 group-hover:bg-[#DD8776]/35"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#1E1916] border border-[#D9C3B9]/40 dark:border-[#382C26] text-2xl text-[#9C4738] dark:text-[#EB9D8E] transition-transform duration-300 group-hover:scale-110">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Email Studio</h3>
                  <span class="inline-flex items-center rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Corporate & Bulk</span>
                </div>
                <p class="mt-2 text-base font-bold text-[#9C4738] dark:text-[#E89382]">{{ settings.contact_email }}</p>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                  Perfect for corporate partnerships, bulk event order quotes, detailed custom briefs, and formal requests.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  [href]="'mailto:' + settings.contact_email" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] dark:text-[#F3ECE8] transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#342A25] active:scale-95 shadow-sm"
                >
                  <span>Send Email Inquiry</span>
                </a>
              </div>
            </div>
          </div>

          <!-- QUICK WHATSAPP PRESETS -->
          <div class="mt-10 mx-auto max-w-4xl rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-8 shadow-sm">
            <h3 class="text-center font-serif text-lg font-bold text-[#57251C] dark:text-[#F3ECE8]">Quick WhatsApp Starters</h3>
            <p class="mt-1 text-center text-xs text-[#57251C]/75 dark:text-[#D9C3B9]">Click any option below to launch a pre-formatted chat message directly with our customer support team:</p>
            
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <a 
                *ngFor="let preset of quickPresets" 
                [href]="preset.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 dark:border-[#382C26] bg-[#F7F6F3] dark:bg-[#1E1916] px-4 py-2.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] transition-all hover:border-[#C56D5B] hover:bg-[#FFFDFC] dark:hover:bg-[#2A221E] hover:shadow-sm"
              >
                <i [class]="preset.iconClass + ' text-[#9C4738] dark:text-[#EB9D8E]'"></i>
                <span>{{ preset.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FREQUENTLY ASKED QUESTIONS -->
      <section class="bg-[#FFFDFC] dark:bg-[#141210] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div class="text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Help Center</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Frequently Asked Questions</h2>
          </div>

          <div class="mt-10 space-y-4">
            <div 
              *ngFor="let faq of faqs; let i = index" 
              class="rounded-2xl border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#F7F6F3] dark:bg-[#1A1614] transition-all"
            >
              <button 
                type="button" 
                (click)="toggleFaq(i)"
                class="flex w-full items-center justify-between p-6 text-left font-serif font-bold text-[#57251C] dark:text-[#F3ECE8]"
              >
                <span class="text-base sm:text-lg">{{ faq.question }}</span>
                <span class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFFDFC] dark:bg-[#231C18] text-[#9C4738] dark:text-[#E89382] border border-[#D9C3B9]/40 dark:border-[#382C26] shadow-sm transition-transform duration-300" [class.rotate-180]="openFaqIndex === i">
                  ↓
                </span>
              </button>
              <div 
                *ngIf="openFaqIndex === i" 
                class="px-6 pb-6 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] border-t border-[#D9C3B9]/30 dark:border-[#382C26] pt-4"
              >
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </app-site-layout>
  `
})
export class ContactPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);

  openFaqIndex: number | null = 0;

  settings: any = {
    whatsapp_no: '919284905118',
    contact_no: '+91 92849 05118',
    contact_email: 'rmsgifthampers@gmail.com',
    address: 'Maharashtra, India'
  };

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Contact RMS Gift Hampers',
      description: 'Get in touch with RMS Gift Hampers for custom hamper enquiries, bulk orders, and delivery help on WhatsApp or email.',
      keywords: 'contact gift hampers, custom hamper enquiry, bulk gifting, whatsapp gift hampers',
      slug: 'contact'
    });
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
      answer: 'Browse any collection on our store and click "Order Online" to checkout directly with Cash on Delivery (COD) or Free 0% UPI to 7350120467. For bespoke theme styling, launch our online "Build Your Own Hamper" studio to customize your gift box and submit for quotation.'
    },
    {
      question: 'Can I choose specific items to include in a hamper?',
      answer: 'Absolutely! Every hamper can be fully customized with chocolates, luxury keepsakes, personal notes, plushies, skincare items, or festive items according to your vision.'
    },
    {
      question: 'Do you cater to corporate or bulk event return gifts?',
      answer: 'Yes, we curate custom bulk hampers for corporate events, weddings, baby showers, and birthday parties. Reach out via WhatsApp or Email for volume pricing.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery times depend on your location and customization requirements. Contact us on WhatsApp with your pin code and needed delivery date for exact estimates.'
    }
  ];

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}