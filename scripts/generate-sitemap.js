const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function generateSitemap() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const siteUrl = 'https://www.munfa.uz';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Static routes
  const staticRoutes = ['', '/about', '/products', '/contact'];

  // Fetch dynamic product routes
  const { data: products } = await supabase.from('products').select('slug');
  const productRoutes = products ? products.map(p => `/products/${p.slug}`) : [];

  const allRoutes = [...staticRoutes, ...productRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully in public/sitemap.xml');

  // Also write to a file for vite-ssg to use during build
  fs.writeFileSync('scripts/routes.json', JSON.stringify(allRoutes));
  console.log('Routes exported to scripts/routes.json');

  // Also generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
  fs.writeFileSync('public/robots.txt', robots);
  console.log('robots.txt generated successfully in public/robots.txt');
}

generateSitemap();
