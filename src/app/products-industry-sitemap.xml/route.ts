import { connectToDatabase } from '@/lib/mongodb';
import Industry from '@/models/Industry';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  await connectToDatabase();
  const industries = await Industry.find().select('slug updatedAt');

  const brandUrlsXml = industries.map((industry: any) => `
    <url>
      <loc>${SITE_URL}/industries/${industry.slug}</loc>
      <lastmod>${industry.updatedAt.toISOString().split('T')[0]}</lastmod>
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