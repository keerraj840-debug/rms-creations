import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-12 md:py-18">
        <!-- Ambient Decorative Glows -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Text Content -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Concierge & Bespoke Inquiries
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                Let Us Curate <br />
                <span class="font-serif italic font-normal text-[#C56D5B] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Your Perfect Gift</span>
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
                Whether you need a single bespoke hamper, festive kits, or bulk celebration return gifts, our design team is here to assist you.
              </p>

              <!-- Highlight Note Box -->
              <div class="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl text-[#57251C] border border-[#D9C3B9]/40">
                  ⚡
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#57251C]/80 sm:text-sm">
                  <strong class="text-[#57251C]">Direct Stylist Access:</strong> WhatsApp is the fastest way to get real-time basket previews, item customizations, and immediate dispatch confirmations.
                </p>
              </div>

              <!-- CTA Button -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20place%20an%20order." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full bg-[#57251C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-lg shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 active:scale-95"
                >
                  <span>💬 Start WhatsApp Chat</span>
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
                  class="relative h-auto w-full rounded-[2rem] border-8 border-[#FFFDFC] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DIRECT CONTACT CARDS & CONCIERGE CHANNELS -->
      <section class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Get In Touch</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">Choose Your Preferred Channel</h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
              Reach out directly on WhatsApp for immediate styling or send an email for formal bulk quotes.
            </p>
          </div>

          <div class="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <!-- WhatsApp Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-100/40 blur-2xl transition-all duration-300 group-hover:bg-emerald-200/50"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] border border-[#D9C3B9]/40 text-3xl transition-transform duration-300 group-hover:scale-110">
                  💬
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="font-serif text-2xl font-bold text-[#57251C]">WhatsApp Concierge</h3>
                  <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">Instant</span>
                </div>
                <p class="mt-2 text-base font-bold text-[#9C4738]">+91 9284905118</p>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/75">
                  Ideal for urgent orders, bespoke image previews, custom budget quotes, and instant confirmations.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20have%20a%20question." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] hover:shadow-lg active:scale-95"
                >
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Email Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#EB9D8E]/25 blur-2xl transition-all duration-300 group-hover:bg-[#DD8776]/35"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] border border-[#D9C3B9]/40 text-3xl transition-transform duration-300 group-hover:scale-110">
                  ✉️
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="font-serif text-2xl font-bold text-[#57251C]">Email Studio</h3>
                  <span class="inline-flex items-center rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Corporate & Bulk</span>
                </div>
                <p class="mt-2 text-base font-bold text-[#9C4738]">rmsgifthampers&#64;gmail.com</p>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/75">
                  Perfect for corporate partnerships, bulk event order quotes, detailed custom briefs, and formal requests.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  href="mailto:rmsgifthampers@gmail.com" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95 shadow-sm"
                >
                  <span>Send Email Inquiry</span>
                </a>
              </div>
            </div>
          </div>

          <!-- QUICK WHATSAPP PRESETS -->
          <div class="mt-10 mx-auto max-w-4xl rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] p-8 shadow-sm">
            <h3 class="text-center font-serif text-lg font-bold text-[#57251C]">Quick WhatsApp Starters</h3>
            <p class="mt-1 text-center text-xs text-[#57251C]/75">Click any option below to launch a pre-formatted chat message directly with our stylists:</p>
            
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <a 
                *ngFor="let preset of quickPresets" 
                [href]="preset.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 bg-[#F7F6F3] px-4 py-2.5 text-xs font-bold text-[#57251C] transition-all hover:border-[#C56D5B] hover:bg-[#FFFDFC] hover:shadow-sm"
              >
                <span>{{ preset.icon }}</span>
                <span>{{ preset.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FREQUENTLY ASKED QUESTIONS -->
      <section class="bg-[#FFFDFC] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div class="text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Help Center</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">Frequently Asked Questions</h2>
          </div>

          <div class="mt-10 space-y-4">
            <div 
              *ngFor="let faq of faqs; let i = index" 
              class="rounded-2xl border border-[#D9C3B9]/50 bg-[#F7F6F3] transition-all"
            >
              <button 
                type="button" 
                (click)="toggleFaq(i)"
                class="flex w-full items-center justify-between p-6 text-left font-serif font-bold text-[#57251C]"
              >
                <span class="text-base sm:text-lg">{{ faq.question }}</span>
                <span class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFFDFC] text-[#9C4738] border border-[#D9C3B9]/40 shadow-sm transition-transform duration-300" [class.rotate-180]="openFaqIndex === i">
                  ↓
                </span>
              </button>
              <div 
                *ngIf="openFaqIndex === i" 
                class="px-6 pb-6 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 border-t border-[#D9C3B9]/30 pt-4"
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
  openFaqIndex: number | null = 0;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Contact RMS Gift Hampers',
      description: 'Get in touch with RMS Gift Hampers for custom hamper enquiries, bulk orders, and delivery help on WhatsApp or email.',
      keywords: 'contact gift hampers, custom hamper enquiry, bulk gifting, whatsapp gift hampers',
      slug: 'contact'
    });
  }

  quickPresets = [
    {
      icon: '🎁',
      label: 'Order Custom Hamper',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20want%20to%20order%20a%20custom%20gift%20hamper.'
    },
    {
      icon: '💼',
      label: 'Corporate Bulk Inquiry',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20want%20to%20inquire%20about%20corporate%20bulk%20gifting.'
    },
    {
      icon: '🚚',
      label: 'Check Delivery Timeline',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20would%20like%20to%20check%20delivery%20timelines.'
    },
    {
      icon: '🎀',
      label: 'Event Return Gifts',
      link: 'https://wa.me/919284905118?text=Hello%20RMS!%20I%20need%20information%20on%20party%20return%20gifts.'
    }
  ];

  faqs = [
    {
      question: 'How do I place an order for a custom gift hamper?',
      answer: 'The simplest way is to click "Start WhatsApp Chat". Share your preferred budget, occasion, recipient preferences, and date. We will send live photo suggestions and build a custom design for you.'
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