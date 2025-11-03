import Product from '@/models/Product';
import { connectToDatabase } from '@/lib/mongodb';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().select('slug updatedAt');

  const productUrlsXml = products.map((product: any) => `
    <url>
      <loc>${SITE_URL}/products/${product.slug}</loc>
      <lastmod>${product.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${productUrlsXml}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}