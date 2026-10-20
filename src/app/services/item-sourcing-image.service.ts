import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ImageProcessorService } from '../shared/ui/image-processor.service';

export interface OnlineImageCandidate {
  id: string;
  title: string;
  thumbUrl: string;
  originalUrl: string;
  source: 'Wikimedia Commons' | 'Wikipedia' | 'Direct URL';
  width?: number;
  height?: number;
}

export interface PlatformComparisonItem {
  id: 'google_shopping' | 'meesho' | 'indiamart' | 'jiomart' | 'amazon' | 'flipkart' | 'blinkit';
  name: string;
  badge: string;
  tagline: string;
  searchUrl: string;
  icon: string;
  accentColor: string;
  isRecommended: boolean;
  recommendationReason?: string;
}

export interface PlatformSourcingMeta {
  category: 'craft_pooja' | 'packaging_decor' | 'confectionery_fmcg' | 'dry_fruits' | 'candles_fragrance' | 'general';
  categoryLabel: string;
  topRecommendation: string;
  sourcingTip: string;
  platforms: PlatformComparisonItem[];
}

export interface ItemMetadataParseResult {
  cleanDescription: string;
  image?: string;
  sourcingPlatform?: string;
  sourcingPrice?: number;
  sourcingUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemSourcingImageService {
  private supabase = inject(SupabaseService);
  private imageProcessor = inject(ImageProcessorService);

  /**
   * Cleans item name for high-accuracy image queries
   * e.g. "Brass Pooja Diya (2.5 inch) 100g" -> "Brass Pooja Diya"
   */
  cleanSearchQuery(rawName: string): string {
    if (!rawName) return '';
    return rawName
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\b\d+(\.\d+)?\s*(g|gm|gms|kg|ml|l|ltr|pcs|pc|inch|in|cm|mm|pack|set)\b/gi, ' ')
      .replace(/["'#*]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Search online royalty-free, high-quality images via Wikimedia Commons and Wikipedia APIs.
   * Completely open CORS, zero API key requirement, fast and reliable.
   */
  async searchOnlineImages(rawQuery: string): Promise<OnlineImageCandidate[]> {
    const cleaned = this.cleanSearchQuery(rawQuery);
    const query = cleaned || rawQuery?.trim();
    if (!query) return [];

    const results: OnlineImageCandidate[] = [];
    const seenUrls = new Set<string>();

    try {
      const qEncoded = encodeURIComponent(query);

      // Query 1: Wikimedia Commons File Search (high resolution royalty-free product photos)
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${qEncoded}&gsrlimit=16&prop=imageinfo&iiprop=url|thumburl|dimensions&iiurlwidth=600&format=json&origin=*`;

      // Query 2: Wikipedia Article Thumbnail Search
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${qEncoded}&gsrlimit=8&prop=pageimages&pithumbsize=600&pilimit=8&format=json&origin=*`;

      const [commonsRes, wikiRes] = await Promise.allSettled([
        fetch(commonsUrl).then(r => (r.ok ? r.json() : null)),
        fetch(wikiUrl).then(r => (r.ok ? r.json() : null))
      ]);

      // 1. Process Commons Results
      if (commonsRes.status === 'fulfilled' && commonsRes.value?.query?.pages) {
        const pages = Object.values(commonsRes.value.query.pages) as any[];
        for (const page of pages) {
          const info = page.imageinfo?.[0];
          const thumb = info?.thumburl || info?.url;
          if (!thumb) continue;

          // Filter out svgs, pdf pages, tiffs, and audio
          const lower = thumb.toLowerCase();
          if (
            lower.endsWith('.svg.png') ||
            lower.includes('.pdf') ||
            lower.includes('.djvu') ||
            lower.includes('.tif')
          ) {
            continue;
          }

          if (!seenUrls.has(thumb)) {
            seenUrls.add(thumb);
            const rawTitle = (page.title || '')
              .replace(/^File:/i, '')
              .replace(/\.[^.]+$/, '')
              .replace(/_/g, ' ');

            results.push({
              id: `commons-${page.pageid || Math.random()}`,
              title: rawTitle.length > 50 ? `${rawTitle.slice(0, 47)}...` : rawTitle,
              thumbUrl: thumb,
              originalUrl: info.url || thumb,
              source: 'Wikimedia Commons',
              width: info.width,
              height: info.height
            });
          }
        }
      }

      // 2. Process Wikipedia Results
      if (wikiRes.status === 'fulfilled' && wikiRes.value?.query?.pages) {
        const pages = Object.values(wikiRes.value.query.pages) as any[];
        for (const page of pages) {
          const thumb = page.thumbnail?.source;
          if (!thumb) continue;

          if (!seenUrls.has(thumb)) {
            seenUrls.add(thumb);
            results.push({
              id: `wiki-${page.pageid || Math.random()}`,
              title: page.title || 'Product Image',
              thumbUrl: thumb,
              originalUrl: thumb.replace(/\/thumb\//, '/').replace(/\/[^/]+$/, ''),
              source: 'Wikipedia',
              width: page.thumbnail?.width,
              height: page.thumbnail?.height
            });
          }
        }
      }
    } catch (err) {
      console.warn('ItemSourcingImageService: Image search error', err);
    }

    return results;
  }

  /**
   * Intelligently detects the item category and returns the cheapest online sourcing platforms
   * with direct price-asc deep links, smart recommendations, and buying tips.
   */
  getCheapestPlatforms(itemName: string, customPrice?: number | null): PlatformSourcingMeta {
    const raw = (itemName || '').toLowerCase();
    const clean = this.cleanSearchQuery(itemName);
    const q = encodeURIComponent(clean || itemName || 'hamper item');

    // 1. Determine Category
    let category: PlatformSourcingMeta['category'] = 'general';
    let categoryLabel = 'General Hamper Item';
    let topRecommendation = 'Google Shopping / Meesho';
    let sourcingTip = 'Compare on Google Shopping sorted by lowest price to view offers from all Indian stores.';

    const isConfectionery = /(chocolate|ferrero|cadbury|kitkat|cookie|biscuit|candy|sweet|mithai|ladoo|snack|namkeen|syrup|honey)/i.test(raw);
    const isDryFruits = /(cashew|kaju|almond|badam|pista|pistachio|raisin|kismis|walnut|akhrot|anjeer|fig|makhana|dry fruit|nuts)/i.test(raw);
    const isCraftPooja = /(diya|brass|pooja|puja|idol|murti|aarti|camphor|kapoor|chandan|kumkum|haldi|kalash|rangoli|incense|agarbatti|dhoop)/i.test(raw);
    const isCandle = /(candle|wax|scented|fragrance|aroma|diffuser|soap|bath|potpourri)/i.test(raw);
    const isPackaging = /(box|ribbon|basket|tray|net|cellophane|shred|potli|tin|jar|container|bag|tag|straw|jute|satin|wrap|crate)/i.test(raw);

    if (isConfectionery) {
      category = 'confectionery_fmcg';
      categoryLabel = 'Chocolates & Confectionery';
      topRecommendation = '👑 JioMart & DMart (15-30% below MRP)';
      sourcingTip = 'JioMart and DMart offer 15-30% discount on Cadbury & Ferrero Rocher packs, whereas Amazon often charges full MRP unless ordering carton quantities.';
    } else if (isDryFruits) {
      category = 'dry_fruits';
      categoryLabel = 'Dry Fruits & Nuts';
      topRecommendation = '👑 JioMart / Wholesale APMC Mandi / Amazon Bulk 1kg';
      sourcingTip = 'Buy 1kg or 500g wholesale packs on JioMart or Amazon Bulk and repack into individual 100g/200g jars to reduce cost by ~40%.';
    } else if (isCraftPooja) {
      category = 'craft_pooja';
      categoryLabel = 'Pooja & Brass Handicrafts';
      topRecommendation = '👑 Meesho (Small Lots) & IndiaMART (Bulk 50+)';
      sourcingTip = 'Meesho offers brass diyas and pooja items at ₹15-₹35 with free shipping. On Amazon, identical items often cost ₹99-₹199.';
    } else if (isCandle) {
      category = 'candles_fragrance';
      categoryLabel = 'Candles & Aroma Products';
      topRecommendation = '👑 Meesho Wholesale & IndiaMART';
      sourcingTip = 'Scented soy and tealight candles cost as low as ₹5-₹12 per piece on Meesho wholesale packs.';
    } else if (isPackaging) {
      category = 'packaging_decor';
      categoryLabel = 'Packaging, Boxes & Ribbons';
      topRecommendation = '👑 IndiaMART & Meesho';
      sourcingTip = 'Ribbon rolls and hamper boxes are 60-70% cheaper when ordered directly from Surat/Moradabad wholesale vendors on IndiaMART or Meesho.';
    }

    // 2. Build Platform Links
    const platforms: PlatformComparisonItem[] = [
      {
        id: 'google_shopping',
        name: 'Google Shopping',
        badge: 'Lowest Price Aggregator',
        tagline: 'Compares Flipkart, JioMart, Meesho, Shopsy & Amazon in real-time (Price: Low to High)',
        searchUrl: `https://www.google.com/search?tbm=shop&q=${q}&tbs=p_ord:p`,
        icon: 'fa-brands fa-google',
        accentColor: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40',
        isRecommended: true,
        recommendationReason: 'Shows the single cheapest seller across all of India at the top.'
      },
      {
        id: 'meesho',
        name: 'Meesho',
        badge: 'Cheapest Reseller / Retail',
        tagline: 'Lowest prices for single-unit crafts, diyas, ribbons, boxes & home accessories (Zero Shipping)',
        searchUrl: `https://www.meesho.com/search?q=${q}+wholesale`,
        icon: 'fa-solid fa-bag-shopping',
        accentColor: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800/40',
        isRecommended: isCraftPooja || isPackaging || isCandle,
        recommendationReason: 'Typically 40-70% cheaper than Amazon India for hamper inclusions.'
      },
      {
        id: 'indiamart',
        name: 'IndiaMART',
        badge: 'Factory Direct B2B Wholesale',
        tagline: 'Direct factory quotes from manufacturers (Lowest bulk cost for 20+ pieces)',
        searchUrl: `https://dir.indiamart.com/search.mp?ss=${q}&price_sort=asc`,
        icon: 'fa-solid fa-industry',
        accentColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
        isRecommended: isPackaging || isCraftPooja,
        recommendationReason: 'Unbeatable rates when buying cartons of boxes, jars, or diyas.'
      },
      {
        id: 'jiomart',
        name: 'JioMart',
        badge: 'Best for FMCG & Chocolates',
        tagline: 'Wholesale retail grocery discounts on Ferrero, Cadbury, nuts & branded sweets',
        searchUrl: `https://www.jiomart.com/search/${q}`,
        icon: 'fa-solid fa-basket-shopping',
        accentColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40',
        isRecommended: isConfectionery || isDryFruits,
        recommendationReason: 'Consistent 15-25% below MRP with free delivery.'
      },
      {
        id: 'amazon',
        name: 'Amazon India',
        badge: 'Fast Prime Delivery',
        tagline: 'Sorted by Price (Low to High). Excellent for branded items, bulk multipacks & Next-Day delivery',
        searchUrl: `https://www.amazon.in/s?k=${q}&s=price-asc-rank`,
        icon: 'fa-brands fa-amazon',
        accentColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
        isRecommended: false,
        recommendationReason: 'Best for express 1-day delivery when hampers need rush assembling.'
      },
      {
        id: 'flipkart',
        name: 'Flipkart',
        badge: 'Shopsy / SuperSaver',
        tagline: 'Sorted by lowest price. Good discounts during festival sale events',
        searchUrl: `https://www.flipkart.com/search?q=${q}&sort=price_asc`,
        icon: 'fa-solid fa-cart-shopping',
        accentColor: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40',
        isRecommended: false
      }
    ];

    return {
      category,
      categoryLabel,
      topRecommendation,
      sourcingTip,
      platforms
    };
  }

  /**
   * Calculates profit margin when selling this item inside hampers
   */
  calculateMargin(itemPrice: number | null | undefined, sourcingCost: number | null | undefined): {
    profit: number;
    marginPercent: number;
    isProfitable: boolean;
  } {
    const sell = Number(itemPrice) || 0;
    const cost = Number(sourcingCost) || 0;
    const profit = sell - cost;
    const marginPercent = sell > 0 ? Math.round((profit / sell) * 100) : 0;
    return {
      profit,
      marginPercent,
      isProfitable: profit >= 0
    };
  }

  /**
   * Resilient metadata parser for description string
   * Supports backward-compatible metadata tags like <!--rms-meta:{"image":"...","sourcing_platform":"..."}-->
   */
  extractMetadataFromDescription(description?: string | null): ItemMetadataParseResult {
    if (!description) {
      return { cleanDescription: '' };
    }

    const metaTagRegex = /<!--rms-item-meta:([\s\S]*?)-->/;
    const match = description.match(metaTagRegex);

    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        const cleanDescription = description.replace(metaTagRegex, '').trim();
        return {
          cleanDescription,
          image: parsed.image || undefined,
          sourcingPlatform: parsed.sourcingPlatform || undefined,
          sourcingPrice: parsed.sourcingPrice != null ? Number(parsed.sourcingPrice) : undefined,
          sourcingUrl: parsed.sourcingUrl || undefined
        };
      } catch {
        // Fall through
      }
    }

    return { cleanDescription: description.trim() };
  }

  /**
   * Embeds metadata into description string transparently without breaking customer view
   */
  embedMetadataIntoDescription(
    cleanDescription: string,
    meta: { image?: string; sourcingPlatform?: string; sourcingPrice?: number; sourcingUrl?: string }
  ): string {
    const base = (cleanDescription || '').replace(/<!--rms-item-meta:[\s\S]*?-->/g, '').trim();
    const hasMeta = Boolean(meta.image || meta.sourcingPlatform || meta.sourcingPrice != null || meta.sourcingUrl);
    if (!hasMeta) return base;

    const payload = JSON.stringify({
      image: meta.image || undefined,
      sourcingPlatform: meta.sourcingPlatform || undefined,
      sourcingPrice: meta.sourcingPrice != null ? Number(meta.sourcingPrice) : undefined,
      sourcingUrl: meta.sourcingUrl || undefined
    });

    return base ? `${base}\n\n<!--rms-item-meta:${payload}-->` : `<!--rms-item-meta:${payload}-->`;
  }

  /**
   * Downloads an external image via fetch or canvas, standardizes to valid image/jpeg,
   * optimizes to <= 1MB, and saves to our Supabase storage bucket.
   * STRICT: Always uploads to our own Supabase Storage bucket. Never saves raw external links.
   */
  async uploadOnlineImageToStorage(
    imageUrl: string,
    itemName: string
  ): Promise<{ success: boolean; url: string; error?: string }> {
    if (!imageUrl) {
      return { success: false, url: '', error: 'No image URL provided.' };
    }

    // If it's already a Supabase storage image, return directly
    if (imageUrl.includes('supabase.co/storage')) {
      return { success: true, url: imageUrl };
    }

    try {
      let jpegBlob: Blob | null = null;

      // Primary Strategy: Render through HTML5 Canvas into a clean, sanitized JPEG
      // This completely strips any XSS or malformed headers and standardizes to image/jpeg
      if (typeof document !== 'undefined') {
        jpegBlob = await new Promise<Blob | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDim = 800;
              let w = img.naturalWidth || img.width || 400;
              let h = img.naturalHeight || img.height || 400;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(null);
              ctx.drawImage(img, 0, 0, w, h);
              canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = imageUrl;
        });
      }

      // Secondary Strategy: Direct fetch if canvas was not able to load
      if (!jpegBlob) {
        try {
          const res = await fetch(imageUrl, { mode: 'cors' });
          if (res.ok) {
            const rawBlob = await res.blob();
            // Convert to JPEG via canvas
            if (rawBlob && typeof document !== 'undefined') {
              jpegBlob = await this.convertBlobToJpeg(rawBlob);
            } else if (rawBlob) {
              jpegBlob = rawBlob;
            }
          }
        } catch {
          // Ignore
        }
      }

      if (!jpegBlob || jpegBlob.size === 0) {
        return {
          success: false,
          url: '',
          error: 'Could not download external image to RMS storage. Please choose another image or upload directly.'
        };
      }

      const slug = (itemName || 'item')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 25);
      const fileName = `item_${Date.now()}_${slug || 'hamper'}.jpg`;
      const file = new File([jpegBlob], fileName, { type: 'image/jpeg' });

      // Validate & optimize via ImageProcessor
      const optimized = await this.imageProcessor.processAndOptimize(file, fileName, 1, file.size);

      // Upload to RMS Creations Supabase storage bucket ('images')
      const uploadRes = await this.supabase.uploadFile('images', fileName, optimized.file);
      if (uploadRes.data && !uploadRes.error) {
        return { success: true, url: uploadRes.data };
      }

      return {
        success: false,
        url: '',
        error: uploadRes.error?.message || 'Failed to upload image file to RMS storage.'
      };
    } catch (err: any) {
      return {
        success: false,
        url: '',
        error: err?.message || 'Error processing and saving image to RMS storage.'
      };
    }
  }

  private convertBlobToJpeg(blob: Blob): Promise<Blob | null> {
    return new Promise((resolve) => {
      try {
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.naturalWidth || img.width || 400;
          let h = img.naturalHeight || img.height || 400;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
        img.src = objectUrl;
      } catch {
        resolve(null);
      }
    });
  }
}
