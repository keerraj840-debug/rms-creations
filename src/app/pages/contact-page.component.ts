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
      <section class="relative overflow-hidden bg-gradient-to-b from-[#fdf8fa] via-[#fff5f8] to-white py-16 md:py-24">
        <!-- Ambient Decorative Glows -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Text Content -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Need help? We are here
              </div>

              <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#433535] sm:text-4xl lg:text-5xl">
                Need a gift? <br />
                <span class="font-serif italic font-normal text-rose-500 underline decoration-pink-300 decoration-wavy decoration-1 underline-offset-8">We can help</span>
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#6d4d4d] sm:text-lg">
                Tell us your event, budget, or idea and we will guide you to the right hamper.
              </p>

              <!-- Highlight Note Box -->
              <div class="mt-8 flex items-start gap-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl text-rose-600">
                  ⚡
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#6d4d4d] sm:text-sm">
                  <strong class="text-[#433535]">Fast help:</strong> WhatsApp is the quickest way to check options, share ideas, and confirm delivery.
                </p>
              </div>

              <!-- CTA Button -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20place%20an%20order." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/35 active:scale-95"
                >
                  <span>💬 Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <!-- Right Hero Image Showcase -->
            <div class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-pink-400 to-rose-300 opacity-30 blur-xl transition duration-500 group-hover:opacity-50"></div>
                <img 
                  src="assets/banners/cta-banner.png" 
                  alt="Contact RMS gift hampers concierge" 
                  class="relative h-auto w-full rounded-[2rem] border-8 border-white object-cover shadow-2xl transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DIRECT CONTACT CARDS & CONCIERGE CHANNELS -->
      <section class="bg-gradient-to-b from-white via-[#fdf8fa] to-[#f9f0f3] py-8 md:py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600">Get in touch</span>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#433535] sm:text-3xl">Choose the easiest way to contact us</h2>
            <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d] sm:text-base">
              Pick WhatsApp or email and we will help you quickly.
            </p>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <!-- WhatsApp Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-rose-100/80 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-100/50 blur-2xl transition-all duration-300 group-hover:bg-emerald-200/60"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl transition-transform duration-300 group-hover:scale-110">
                  💬
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="text-2xl font-bold text-[#433535]">WhatsApp Chat</h3>
                  <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200">Instant</span>
                </div>
                <p class="mt-2 text-base font-medium text-emerald-700">+91 9284905118</p>
                <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d]">
                  Ideal for urgent orders, bespoke image previews, custom budget quotes, and instant confirmations.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20have%20a%20question." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg active:scale-95"
                >
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Email Contact Card -->
            <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-rose-100/80 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl">
              <div class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-pink-100/50 blur-2xl transition-all duration-300 group-hover:bg-pink-200/60"></div>
              <div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-3xl transition-transform duration-300 group-hover:scale-110">
                  ✉️
                </div>
                <div class="mt-6 flex items-center justify-between">
                  <h3 class="text-2xl font-bold text-[#433535]">Email Inquiry</h3>
                  <span class="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-200">Corporate & Bulk</span>
                </div>
                <p class="mt-2 text-base font-medium text-rose-700">rmsgifthampers&#64;gmail.com</p>
                <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d]">
                  Perfect for corporate partnerships, bulk event order quotes, detailed custom briefs, and formal requests.
                </p>
              </div>
              <div class="mt-8">
                <a 
                  href="mailto:rmsgifthampers@gmail.com" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-rose-700 transition-all duration-300 hover:bg-rose-100 active:scale-95"
                >
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          <!-- QUICK WHATSAPP PRESETS -->
          <div class="mt-8 mx-auto max-w-4xl rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
            <h3 class="text-center text-lg font-bold text-[#433535]">Quick WhatsApp Starters</h3>
            <p class="mt-1 text-center text-xs text-[#6d4d4d]">Click any option below to launch a pre-formatted chat message:</p>
            
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <a 
                *ngFor="let preset of quickPresets" 
                [href]="preset.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 text-xs font-medium text-rose-700 transition-all hover:border-rose-400 hover:bg-rose-100 hover:shadow-sm"
              >
                <span>{{ preset.icon }}</span>
                <span>{{ preset.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FREQUENTLY ASKED QUESTIONS -->
      <section class="bg-white py-8 md:py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div class="text-center">
            <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600">Help center</span>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#433535] sm:text-3xl">Common questions</h2>
          </div>

          <div class="mt-12 space-y-4">
            <div 
              *ngFor="let faq of faqs; let i = index" 
              class="rounded-2xl border border-rose-100 bg-[#fdf8fa] transition-all"
            >
              <button 
                type="button" 
                (click)="toggleFaq(i)"
                class="flex w-full items-center justify-between p-6 text-left font-bold text-[#433535]"
              >
                <span>{{ faq.question }}</span>
                <span class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm transition-transform duration-300" [class.rotate-180]="openFaqIndex === i">
                  ↓
                </span>
              </button>
              <div 
                *ngIf="openFaqIndex === i" 
                class="px-6 pb-6 text-sm leading-relaxed text-[#6d4d4d] border-t border-rose-100/60 pt-4"
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