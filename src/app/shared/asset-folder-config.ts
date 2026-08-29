export interface GalleryItem {
  title: string;
  description: string;
  image: string;
  price?: number;
  orderLink?: string;
  route?: string;
}

export interface FolderPageConfig {
  slug: string;
  title: string;
  description: string;
  heroTag: string;
  heroImage: string;
  heroNote: string;
  items: GalleryItem[];
}

export const folderPageConfigs: Record<string, FolderPageConfig> = {
  'girls-hampers': {
    slug: 'girls-hampers',
    title: 'Girls Hampers',
    description: 'Sweet, elegant and beautifully styled gift boxes for girls for every celebration.',
    heroTag: 'Customized gifts for her',
    heroImage: 'assets/hampers/girls_hampers/girls_banner.png',
    heroNote: 'Every hamper is arranged with premium styling and personal touches before dispatch.',
    items: [
      {
        title: 'Girls Hamper ₹99',
        price: 99,
        description: 'A cheerful starter bundle with cute accessories and festive styling.',
        image: 'assets/hampers/girls_hampers/girls_hamper_99.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Girls%20Hamper%20₹99.'
      },
      {
        title: 'Girls Hamper ₹199',
        price: 199,
        description: 'A premium surprise box with more accessories and a luxurious finish.',
        image: 'assets/hampers/girls_hampers/girls_hamper_199.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Girls%20Hamper%20₹199.'
      },
      {
        title: 'Girls Hamper ₹299',
        price: 299,
        description: 'An elevated hamper with extra charm, premium presentation and thoughtful details.',
        image: 'assets/hampers/girls_hampers/girls_hamper_299.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Girls%20Hamper%20₹299.'
      },
      {
        title: 'Girls Hamper ₹799',
        price: 799,
        description: 'A grand hamper collection for special occasions and heartfelt gifting.',
        image: 'assets/hampers/girls_hampers/girls_hamper_799.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Girls%20Hamper%20₹799.'
      }
    ]
  },
  'boys-hampers': {
    slug: 'boys-hampers',
    title: 'Boys Hampers',
    description: 'Stylish and practical gift boxes for boys and young adults.',
    heroTag: 'Special gifts for him',
    heroImage: 'assets/hampers/boys_hampers/boys_banner.png',
    heroNote: 'Designed with a modern look, fun extras and polished wrapping.',
    items: [
      {
        title: 'Boys Hamper ₹199',
        price: 199,
        description: 'A trendy starter hamper with useful accessories and festive packaging.',
        image: 'assets/hampers/boys_hampers/boys_hamper_199.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Boys%20Hamper%20₹199.'
      },
      {
        title: 'Boys Hamper ₹299',
        price: 299,
        description: 'A premium gift box with stronger styling and added surprises.',
        image: 'assets/hampers/boys_hampers/boys_hamper_299.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Boys%20Hamper%20₹299.'
      },
      {
        title: 'Boys Hamper ₹399',
        price: 399,
        description: 'A smart and elegant hamper built for birthdays and special events.',
        image: 'assets/hampers/boys_hampers/boys_hamper_399.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Boys%20Hamper%20₹399.'
      },
      {
        title: 'Boys Hamper ₹499',
        price: 499,
        description: 'A high-value hamper with a richer mix of accessories and presentation.',
        image: 'assets/hampers/boys_hampers/boys_hamper_499.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Boys%20Hamper%20₹499.'
      },
      {
        title: 'Boys Hamper ₹799',
        price: 799,
        description: 'A grand hamper option for celebratory gifting and premium impressions.',
        image: 'assets/hampers/boys_hampers/boys_hamper_799.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20Boys%20Hamper%20₹799.'
      }
    ]
  },
  'chocolate-hamper': {
    slug: 'chocolate-hamper',
    title: 'Chocolate Hampers',
    description: 'Festive, rich and eye-catching chocolate gift boxes for celebrations.',
    heroTag: 'Sweet and indulgent',
    heroImage: 'assets/hampers/chocolate_hamper/chocolate.jpeg',
    heroNote: 'The perfect choice for festivals, gifting and handcrafted presentation.',
    items: [
      {
        title: 'Chocolate Deluxe Box',
        description: 'A classic chocolate hamper with premium presentation and festive appeal.',
        image: 'assets/hampers/chocolate_hamper/chocolate.jpeg',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20a%20Chocolate%20Hamper.'
      }
    ]
  },
  'ganpati-hampers': {
    slug: 'ganpati-hampers',
    title: 'Ganpati Hampers & Pooja Kits',
    description: 'Auspicious Ganpati Pooja Kits and festive dry fruit hampers crafted with 100% pure sacred samagri in partitioned spill-proof boxes.',
    heroTag: 'Ganesh Utsav Specials',
    heroImage: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
    heroNote: 'Compartmentalized packaging ensures zero spillage and pristine sacred purity for Lord Ganesha aarti.',
    items: [
      {
        title: 'Ganpati Essential Pooja Kit ₹99',
        price: 99,
        description: 'Complete sacred samagri: Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum in partitioned eco box.',
        image: 'assets/ganpati-pooja-kit-hamper-2026/99_hamper.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20the%20Ganpati%20Essential%20Pooja%20Kit%20₹99.'
      },
      {
        title: 'Ganpati Deluxe Pooja Kit & Dry Fruits ₹149',
        price: 149,
        description: 'Complete sacred essentials (Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum) + Acrylic Box of Premium Dry Fruits.',
        image: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
        orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20the%20Ganpati%20Deluxe%20Pooja%20Kit%20%26%20Dry%20Fruits%20₹149.'
      }
    ]
  }
};

export const galleryHighlights: GalleryItem[] = [
  {
    title: 'Ganpati Special Deluxe Hamper',
    description: 'Festive pooja kit with premium dry fruits and sacred samagri.',
    image: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
    route: '/ganpati-hampers'
  },
  {
    title: 'Girls Special Hamper',
    description: 'Soft pink textures and elegant accessories.',
    image: 'assets/gallery/girls_199.jpeg',
    route: '/hampers/girls-hampers'
  },
  {
    title: 'Boys Smart Hamper',
    description: 'Cool styling with practical items and premium finishing.',
    image: 'assets/gallery/boys_hamper_199.jpg',
    route: '/hampers/boys-hampers'
  },
  {
    title: 'Chocolate Deluxe Box',
    description: 'A rich chocolate gift box for festive occasions.',
    image: 'assets/gallery/chocolate-hamper.jpeg',
    route: '/hampers/chocolate-hamper'
  }
];