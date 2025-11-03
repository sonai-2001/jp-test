import Category from '@/models/Category';
import { connectToDatabase } from '@/lib/mongodb';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find().select('slug updatedAt');

  const brandUrlsXml = categories.map((category: any) => `
    <url>
      <loc>${SITE_URL}/categories/${category.slug}</loc>
      <lastmod>${category.updatedAt.toISOString().split('T')[0]}</lastmod>
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