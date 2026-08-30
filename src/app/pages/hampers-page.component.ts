import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';

@Component({
  selector: 'app-hampers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="hamper-page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-12 md:py-18">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-[#DD8776]/20 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
            Curated Gift Collections
          </div>

          <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
            Bespoke Hampers for <br class="hidden sm:inline" />
            <span class="font-serif italic font-normal text-[#C56D5B] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Every Special Occasion</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#57251C]/80 sm:text-base">
            Explore our artisanal gift hampers designed for festive celebrations, birthdays, anniversaries, and joyful moments.
          </p>
        </div>
      </section>

      <!-- COLLECTION GRID SECTION -->
      <section class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let category of categories" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Overlay Banner -->
              <div class="relative overflow-hidden">
                <img 
                  [src]="category.image" 
                  [alt]="category.title" 
                  class="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"></div>
                <span class="absolute top-4 left-4 rounded-full border border-[#D9C3B9]/40 bg-[#FFFDFC]/95 px-3.5 py-1 text-xs font-bold tracking-wide text-[#57251C] shadow-sm backdrop-blur-md">
                  {{ category.tag }}
                </span>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 class="font-serif text-xl font-bold tracking-tight text-[#57251C] group-hover:text-[#9C4738] transition-colors duration-300">
                    {{ category.title }}
                  </h2>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">
                    {{ category.description }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex flex-wrap items-center gap-2.5">
                  <a 
                    [routerLink]="category.directRoute ? category.directRoute : ['/hampers', category.slug]" 
                    class="inline-flex flex-1 items-center justify-center rounded-full bg-[#57251C] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-sm transition-all duration-300 hover:bg-[#9C4738] hover:shadow-md active:scale-95"
                  >
                    Explore Range
                  </a>
                  <a 
                    [href]="category.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#57251C] transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95"
                  >
                    <span>💬 Order</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Consultation Banner -->
          <div class="mt-12 rounded-[2.5rem] border border-[#D9C3B9]/30 bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] p-8 text-[#FFFDFC] shadow-xl lg:p-12">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              <div class="lg:col-span-8">
                <span class="inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/20 backdrop-blur-md">
                  Custom Hamper Studio
                </span>
                <h3 class="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDFC]">
                  Looking for a custom theme, item combination, or budget?
                </h3>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-[#D9C3B9] sm:text-base">
                  Our gifting specialists assemble bespoke hampers tailored exactly to your colors, favorite items, and price points.
                </p>
              </div>
              <div class="lg:col-span-4 lg:flex lg:justify-end">
                <a 
                  href="https://wa.me/919284905118?text=Hello!%20I%20want%20to%20inquire%20about%20a%20fully%20customized%20gift%20hamper." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-lg transition-all duration-300 hover:bg-[#F7F6F3] hover:scale-105 sm:w-auto active:scale-95"
                >
                  <span>💬 Chat with Stylist</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </app-site-layout>
  `
})
export class HampersPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Gift Hampers for Ganesh Utsav, Girls, Boys and Chocolate Lovers',
      description: 'Explore festive Ganpati pooja kits, and hamper collections for girls, boys, and chocolate lovers with elegant styling at RMS Gift Hampers.',
      keywords: 'ganpati hampers, pooja kits, girls hampers, boys hampers, chocolate hampers, premium gift hampers',
      slug: 'hampers'
    });
  }

  categories = [
    {
      slug: 'ganpati-hampers',
      directRoute: '/ganpati-hampers',
      title: 'Ganpati Hampers & Pooja Kits',
      tag: '🌺 Ganesh Utsav Special',
      description: 'Ready pooja kits with Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum in strong boxes. Starting at ₹99.',
      image: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20Ganpati%20Hampers.'
    },
    {
      slug: 'girls-hampers',
      directRoute: '',
      title: 'Girls Hampers',
      tag: 'Cute & Stylish',
      description: 'Soft, pretty gift boxes filled with sweet treats, little surprises, and lovely accessories.',
      image: 'assets/hampers/girls_hampers/girls_hamper_199.png',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20a%20girls%20hamper.'
    },
    {
      slug: 'boys-hampers',
      directRoute: '',
      title: 'Boys Hampers',
      tag: 'Cool & Modern',
      description: 'Neat and useful gift sets with stylish items, practical extras, and a modern look.',
      image: 'assets/hampers/boys_hampers/boys_hamper_199.png',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20a%20boys%20hamper.'
    },
    {
      slug: 'chocolate-hamper',
      directRoute: '',
      title: 'Chocolate Hampers',
      tag: 'Sweet & Yummy',
      description: 'Delicious chocolate treats and sweet surprises made for birthdays, festivals, and celebrations.',
      image: 'assets/hampers/chocolate_hamper/chocolate.jpeg',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20a%20chocolate%20hamper.'
    }
  ];
}