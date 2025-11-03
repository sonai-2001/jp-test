import Brand from '@/models/Brand';
import { connectToDatabase } from '@/lib/mongodb';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  await connectToDatabase();
  const brands = await Brand.find().select('slug updatedAt');

  const brandUrlsXml = brands.map((brand: any) => `
    <url>
      <loc>${SITE_URL}/brands/${brand.slug}</loc>
      <lastmod>${brand.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${brandUrlsXml}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}