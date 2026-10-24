import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://igwbbfrhgyrfavvkpheh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tooz3bkl3NXwLVgKMlT4zA_yZWxdYbZ';
const BASE_URL = 'https://rmsgifthampers.com';

const STATIC_ROUTES = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: 'shop', priority: '0.9', changefreq: 'daily' },
  { url: 'build-hamper', priority: '0.9', changefreq: 'weekly' },
  { url: 'gallery', priority: '0.8', changefreq: 'weekly' },
  { url: 'contact', priority: '0.8', changefreq: 'weekly' },
  { url: 'terms', priority: '0.5', changefreq: 'monthly' },
  { url: 'privacy', priority: '0.5', changefreq: 'monthly' },
  { url: 'shipping-policy', priority: '0.5', changefreq: 'monthly' },
  { url: 'refund-policy', priority: '0.5', changefreq: 'monthly' },
  { url: 'grievance', priority: '0.5', changefreq: 'monthly' },
];

async function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  let products = [];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('products').select('id, name');
    if (!error && Array.isArray(data)) {
      products = data;
    }
  } catch (err) {
    console.warn('[Sitemap] Could not connect to Supabase; keeping existing product list.', err?.message);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of STATIC_ROUTES) {
    const loc = route.url ? `${BASE_URL}/${route.url}` : `${BASE_URL}/`;
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
  }

  for (const product of products) {
    xml += `  <url>\n    <loc>${BASE_URL}/product/${product.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  xml += `</urlset>\n`;

  const sitemapPath = path.resolve('src/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ [Sitemap] Generated with ${STATIC_ROUTES.length} static routes and ${products.length} product URLs -> src/sitemap.xml`);
}

generateSitemap();
