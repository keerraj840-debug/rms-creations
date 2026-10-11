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
    items: []
  },
  'boys-hampers': {
    slug: 'boys-hampers',
    title: 'Boys Hampers',
    description: 'Stylish and practical gift boxes for boys and young adults.',
    heroTag: 'Special gifts for him',
    heroImage: 'assets/hampers/boys_hampers/boys_banner.png',
    heroNote: 'Designed with a modern look, fun extras and polished wrapping.',
    items: []
  },
  'chocolate-hamper': {
    slug: 'chocolate-hamper',
    title: 'Chocolate Hampers',
    description: 'Festive, rich and eye-catching chocolate gift boxes for celebrations.',
    heroTag: 'Sweet and indulgent',
    heroImage: 'assets/hampers/chocolate_hamper/chocolate.jpeg',
    heroNote: 'The perfect choice for festivals, gifting and handcrafted presentation.',
    items: []
  },
  'ganpati-hampers': {
    slug: 'ganpati-hampers',
    title: 'Ganpati Hampers & Pooja Kits',
    description: 'Ready Ganpati Pooja Kits and festive dry fruit hampers with pure pooja items in strong spill-proof boxes.',
    heroTag: 'Ganesh Utsav Specials',
    heroImage: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
    heroNote: 'Neat partitioned box keeps each item separate with zero spilling.',
    items: []
  }
};

export const galleryHighlights: GalleryItem[] = [];