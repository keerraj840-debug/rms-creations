import { createClient } from '@supabase/supabase-js';

const url = 'https://igwbbfrhgyrfavvkpheh.supabase.co';
const anonKey = 'sb_publishable_tooz3bkl3NXwLVgKMlT4zA_yZWxdYbZ';

const supabase = createClient(url, anonKey);

const catalogData = [
  // 1. Ganpati Hampers & Pooja Kits (Category ID: 2)
  {
    name: 'Ganpati Essential Pooja Kit (₹99)',
    category_id: 2,
    price: 99,
    selling_price: 99,
    weight_kg: 0.5,
    badge: 'Budget Value',
    is_featured: true,
    gender: 'unisex',
    is_active: true,
    images: ['assets/ganpati-pooja-kit-hamper-2026/99_hamper.png'],
    description: 'All 6 essential pooja items (Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum) neatly packed in a partitioned spill-proof box for home Ganpati aarti and society return gifts.'
  },
  {
    name: 'Ganpati Deluxe Pooja Kit & Dry Fruits Box (₹149)',
    category_id: 2,
    price: 149,
    selling_price: 149,
    weight_kg: 0.8,
    badge: 'Festive Hit',
    is_featured: true,
    gender: 'unisex',
    is_active: true,
    images: ['assets/ganpati-pooja-kit-hamper-2026/149_hamper.png', 'assets/top_offers/ganpati/ganpati.jpg'],
    description: 'Pooja kit with Dhup, Kapoor, Kapus Vaat, Halad, Kumkum plus clean clear box with Kaju, Badam, Manuka dry fruits ready for Bappa prasad offering.'
  },
  {
    name: 'Ganpati Festive Celebration Hamper (₹199)',
    category_id: 2,
    price: 199,
    selling_price: 199,
    weight_kg: 1.0,
    badge: 'Festive Special',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/top_offers/ganpati/ganpati.jpg'],
    description: 'Grand festive hamper with premium brass diya, scented dhoop cones, dry fruit treats, and devotional keepsakes.'
  },

  // 2. Girls Hampers (Category ID: 3)
  {
    name: 'Girls Sweet Treats Mini Hamper (₹99)',
    category_id: 3,
    price: 99,
    selling_price: 99,
    weight_kg: 0.4,
    badge: 'Pocket Friendly',
    is_featured: false,
    gender: 'female',
    is_active: true,
    images: ['assets/hampers/girls_hampers/girls_hamper_99.png', 'assets/gallery/girls_99.jpeg'],
    description: 'Cute pastel gift box with pretty hair accessories, mini stationery delights, and sweet keepsakes.'
  },
  {
    name: 'Girls Pastel Charm Gift Hamper (₹149)',
    category_id: 3,
    price: 149,
    selling_price: 149,
    weight_kg: 0.5,
    badge: 'Popular',
    is_featured: false,
    gender: 'female',
    is_active: true,
    images: ['assets/hampers/girls_hampers/girls_hamper_149.png', 'assets/gallery/girls_149.jpeg'],
    description: 'Charming collection featuring pastel stationery, scented lip balm, chic scrunchie, and aesthetic sticker pack.'
  },
  {
    name: 'Boutique Girls Gift Hamper (₹199)',
    category_id: 3,
    price: 199,
    selling_price: 199,
    weight_kg: 0.6,
    badge: 'Bestseller',
    is_featured: true,
    gender: 'female',
    is_active: true,
    images: ['assets/hampers/girls_hampers/girls_hamper_199.png', 'assets/gallery/girls_199.jpeg'],
    description: 'Aesthetic pastel keepsakes, stationery accessories, beauty treats, and handcrafted surprise packaging.'
  },
  {
    name: 'Girls Premium Glam Hamper (₹299)',
    category_id: 3,
    price: 299,
    selling_price: 299,
    weight_kg: 0.8,
    badge: 'Top Choice',
    is_featured: false,
    gender: 'female',
    is_active: true,
    images: ['assets/hampers/girls_hampers/girls_hamper_299.png', 'assets/gallery/girls_299.jpeg'],
    description: 'Curated self-care and beauty suite with fragrant body mist, pastel jewelry box, and luxury confectionery.'
  },
  {
    name: 'Girls Royal Luxury Hamper Suite (₹799)',
    category_id: 3,
    price: 799,
    selling_price: 799,
    weight_kg: 1.5,
    badge: 'Luxury Suite',
    is_featured: false,
    gender: 'female',
    is_active: true,
    images: ['assets/hampers/girls_hampers/girls_hamper_799.png'],
    description: 'Grand royal luxury gift box featuring boutique lifestyle accessories, scented aroma candle, and gourmet delights.'
  },

  // 3. Boys Hampers (Category ID: 4)
  {
    name: 'Signature Boys Milestone Hamper (₹199)',
    category_id: 4,
    price: 199,
    selling_price: 199,
    weight_kg: 0.6,
    badge: 'Top Choice',
    is_featured: true,
    gender: 'male',
    is_active: true,
    images: ['assets/hampers/boys_hampers/boys_hamper_199.png', 'assets/gallery/boys_hamper_199.jpg'],
    description: 'Modern styling accessories, grooming essentials, pocket planner, and artisanal delights in sleek packaging.'
  },
  {
    name: 'Boys Urban Style Hamper (₹299)',
    category_id: 4,
    price: 299,
    selling_price: 299,
    weight_kg: 0.8,
    badge: 'Bestseller',
    is_featured: false,
    gender: 'male',
    is_active: true,
    images: ['assets/hampers/boys_hampers/boys_hamper_299.png', 'assets/gallery/boys_hamper_299.jpg'],
    description: 'Refined lifestyle gift box with matte metal pen, premium keychain, travel grooming bar, and gourmet treats.'
  },
  {
    name: 'Boys Signature Essentials Box (₹399)',
    category_id: 4,
    price: 399,
    selling_price: 399,
    weight_kg: 1.0,
    badge: 'Premium',
    is_featured: false,
    gender: 'male',
    is_active: true,
    images: ['assets/hampers/boys_hampers/boys_hamper_399.png'],
    description: 'Executive utility essentials including stylish wallet, matte drinkware, and dark chocolate delights.'
  },
  {
    name: 'Boys Deluxe Celebration Hamper (₹499)',
    category_id: 4,
    price: 499,
    selling_price: 499,
    weight_kg: 1.2,
    badge: 'Deluxe Hit',
    is_featured: false,
    gender: 'male',
    is_active: true,
    images: ['assets/hampers/boys_hampers/boys_hamper_499.png'],
    description: 'Complete gentleman celebration box with premium grooming fragrance, personalized card, and imported confectionery.'
  },
  {
    name: 'Boys Executive Luxury Hamper (₹799)',
    category_id: 4,
    price: 799,
    selling_price: 799,
    weight_kg: 1.6,
    badge: 'Executive',
    is_featured: false,
    gender: 'male',
    is_active: true,
    images: ['assets/hampers/boys_hampers/boys_hamper_799.png'],
    description: 'Top-tier luxury hamper with leatherette desk organizer, insulated thermo flask, and artisanal dry fruits box.'
  },

  // 4. Chocolate Hampers (Category ID: 5)
  {
    name: 'Handcrafted Festive Chocolate Hamper (₹299)',
    category_id: 5,
    price: 299,
    selling_price: 299,
    weight_kg: 0.7,
    badge: 'Sweet Special',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/hampers/chocolate_hamper/chocolate.jpeg'],
    description: 'Rich artisanal chocolate bars, praline bites, and festive decorative packaging perfect for all sweet celebrations.'
  },
  {
    name: 'Artisan Truffle & Luxury Chocolate Hamper (₹399)',
    category_id: 5,
    price: 399,
    selling_price: 399,
    weight_kg: 0.9,
    badge: 'Gourmet',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/gallery/chocolate-hamper.jpeg'],
    description: 'Indulgent assortment of dark chocolate truffles, hazelnut clusters, and keepsake golden tin.'
  },

  // 5. Event Favours & Return Gifts (Category ID: 6)
  {
    name: 'Birthday Celebration Return Gift Kit (₹99)',
    category_id: 6,
    price: 99,
    selling_price: 99,
    weight_kg: 0.4,
    badge: 'Kids Favorite',
    is_featured: false,
    gender: 'kids',
    is_active: true,
    images: ['assets/return_gift/birthday_return_gift/birthday_return_gift.jpg'],
    description: 'Exciting kids favor kit with fun stationery, creative stickers, and sweet candies packed in vibrant gift pouches.'
  },
  {
    name: 'Party Favours Gift Pack (₹129)',
    category_id: 6,
    price: 129,
    selling_price: 129,
    weight_kg: 0.5,
    badge: 'Value Pack',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/return_gift/party_return_gifts/party_return_gifts_english.jpg', 'assets/return_gift/party_return_gifts/party_return_gifts_marathi.jpg'],
    description: 'Memorable celebration favors customized with personalized tag cards and delightful festive tokens.'
  },
  {
    name: 'Traditional Wedding Ooti & Shagun Gift (₹199)',
    category_id: 6,
    price: 199,
    selling_price: 199,
    weight_kg: 0.6,
    badge: 'Traditional',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/return_gift/wedding_return_gift/wedding_return_fit_ooti.jpg', 'assets/return_gift/wedding_return_gift/wedding_return_gift_marathi.jpg'],
    description: 'Auspicious wedding gift set featuring traditional ooti pouch, haldi-kumkum pack, supari, and festive memento.'
  },
  {
    name: 'Wedding Guest Welcome Favours (₹149)',
    category_id: 6,
    price: 149,
    selling_price: 149,
    weight_kg: 0.5,
    badge: 'Elegant',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/return_gift/wedding_return_gift/party_return_gift_english.jpg'],
    description: 'Chic wedding token box with fragrant potpourri, brass memento, and heartfelt thank-you card for invited guests.'
  },

  // 6. Friendship Day Collections (Category ID: 7)
  {
    name: 'Friendship Day Celebration Hamper (₹249)',
    category_id: 7,
    price: 249,
    selling_price: 249,
    weight_kg: 0.6,
    badge: 'Seasonal Special',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/top_offers/friendship_day/friendship_day_hamper.jpg'],
    description: 'Cute and cheerful gift set with assorted chocolates, best-friend wristbands, personalized card, and goodies.'
  },
  {
    name: 'Besties Matching Pastel Hamper (₹199)',
    category_id: 7,
    price: 199,
    selling_price: 199,
    weight_kg: 0.5,
    badge: 'Seasonal',
    is_featured: false,
    gender: 'female',
    is_active: true,
    images: ['assets/top_offers/friendship_day/friendship_day_girls.jpg'],
    description: 'Matching BFF keepsakes, cute keychains, mini scented soap, and sweet messages.'
  },
  {
    name: 'Buddies Goodies Gift Box (₹199)',
    category_id: 7,
    price: 199,
    selling_price: 199,
    weight_kg: 0.5,
    badge: 'Seasonal',
    is_featured: false,
    gender: 'male',
    is_active: true,
    images: ['assets/top_offers/friendship_day/friendship_day_boys.jpg'],
    description: 'Cool friend hamper with gaming-themed keepsakes, snack treats, and personalized friendship certificate.'
  },

  // 7. Rakshabandhan Favorites (Category ID: 8)
  {
    name: 'Raksha Bandhan Sibling Special Box (₹299)',
    category_id: 8,
    price: 299,
    selling_price: 299,
    weight_kg: 0.8,
    badge: 'Seasonal Hit',
    is_featured: false,
    gender: 'unisex',
    is_active: true,
    images: ['assets/top_offers/rakshabandhan/rakshabandhan_299.jpg'],
    description: 'Heartfelt hamper with handcrafted designer Rakhi, roli-chawal pack, premium chocolates, and sister-brother keepsake.'
  }
];

async function migrate() {
  console.log('--- Starting Products Migration ---');
  
  // 1. Fetch existing products to avoid duplicates
  const { data: existing, error: fetchErr } = await supabase.from('products').select('id, name');
  if (fetchErr) {
    console.error('Error fetching existing products:', fetchErr);
    process.exit(1);
  }

  const existingMap = new Map();
  existing?.forEach(p => existingMap.set(p.name.trim().toLowerCase(), p.id));
  console.log(`Found ${existing?.length || 0} existing products in database.`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of catalogData) {
    const key = item.name.trim().toLowerCase();
    if (existingMap.has(key)) {
      const existingId = existingMap.get(key);
      const { error: updErr } = await supabase
        .from('products')
        .update({
          price: item.price,
          selling_price: item.selling_price,
          description: item.description,
          images: item.images,
          category_id: item.category_id,
          weight_kg: item.weight_kg,
          badge: item.badge,
          is_featured: item.is_featured,
          gender: item.gender,
          is_active: item.is_active,
          updation_date: new Date().toISOString()
        })
        .eq('id', existingId);

      if (updErr) {
        console.error(`Failed to update product "${item.name}":`, updErr.message);
      } else {
        updatedCount++;
      }
    } else {
      const { data: insData, error: insErr } = await supabase
        .from('products')
        .insert({
          ...item,
          creation_date: new Date().toISOString(),
          updation_date: new Date().toISOString()
        })
        .select();

      if (insErr) {
        console.error(`Failed to insert product "${item.name}":`, insErr.message);
      } else {
        insertedCount++;
        console.log(`Inserted: "${item.name}" (ID: ${insData?.[0]?.id})`);
      }
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`Inserted: ${insertedCount} new products`);
  console.log(`Updated: ${updatedCount} existing products`);
}

migrate();
