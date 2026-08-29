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
      <section class="relative overflow-hidden bg-gradient-to-b from-[#fdf8fa] via-[#fff5f8] to-white py-8 md:py-12">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            Beautiful Gift Hampers
          </div>

          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#433535] sm:text-4xl lg:text-5xl">
            Hampers for <br class="hidden sm:inline" />
            <span class="font-serif italic font-normal text-rose-500 underline decoration-pink-300 decoration-wavy decoration-1 underline-offset-8">Every Occasion</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6d4d4d] sm:text-base">
            Browse thoughtfully chosen gift hampers for birthdays, festivals, and special moments. They are easy to order and beautifully packed.
          </p>
        </div>
      </section>

      <!-- COLLECTION GRID SECTION -->
      <section class="bg-gradient-to-b from-white via-[#fdf8fa] to-[#f9f0f3] py-8 md:py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let category of categories" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-rose-100/80 bg-white/80 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
            >
              <!-- Card Image & Overlay Banner -->
              <div class="relative overflow-hidden">
                <img 
                  [src]="category.image" 
                  [alt]="category.title" 
                  class="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"></div>
                <span class="absolute top-4 left-4 rounded-full border border-white/20 bg-white/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#433535] shadow-sm backdrop-blur-md">
                  {{ category.tag }}
                </span>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h2 class="text-xl font-bold tracking-tight text-[#433535] group-hover:text-rose-600 transition-colors duration-300">
                    {{ category.title }}
                  </h2>
                  <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">
                    {{ category.description }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="mt-5 flex flex-wrap items-center gap-2.5">
                  <a 
                    [routerLink]="category.directRoute ? category.directRoute : ['/hampers', category.slug]" 
                    class="inline-flex flex-1 items-center justify-center rounded-full bg-rose-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-rose-600 hover:shadow-lg active:scale-95"
                  >
                    See More
                  </a>
                  <a 
                    [href]="category.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-700 transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 active:scale-95"
                  >
                    <span>💬</span>
                    <span>Order Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Consultation Banner -->
          <div class="mt-8 rounded-[2rem] border border-rose-200/60 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 p-6 text-white shadow-xl lg:p-8">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              <div class="lg:col-span-8">
                <span class="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wider text-white border border-white/20 backdrop-blur-md">
                  Need Something Special?
                </span>
                <h3 class="mt-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  Looking for a special theme or budget?
                </h3>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-pink-100 sm:text-base">
                  Our team can create a custom hamper with your favorite style, colors, and gifts for any special occasion.
                </p>
              </div>
              <div class="lg:col-span-4 lg:flex lg:justify-end">
                <a 
                  href="https://wa.me/919284905118?text=Hello!%20I%20want%20to%20inquire%20about%20a%20fully%20customized%20gift%20hamper." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-600 shadow-lg transition-all duration-300 hover:bg-rose-50 hover:shadow-xl sm:w-auto active:scale-95"
                >
                  <span>💬 Chat with Us</span>
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
      tag: '🌺 Ganesh Utsav 2026',
      description: 'Sacred pooja kits and dry fruit hampers in leakproof partitioned boxes. Starting at ₹99 & ₹149.',
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