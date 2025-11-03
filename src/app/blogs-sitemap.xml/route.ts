import { slugify } from '@/util/slugify';
import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
    // Move fetchArticles function inside the GET handler
    const fetchArticles = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/get_all_post/v1/get_all_post`
        );
        return (await response.json()) || [];
    };

    const articles = await fetchArticles();
    console.log('articles', articles);

    // Adjust this mapping based on your actual API response structure
    const blogUrlsXml = articles.map((article: any) => `
        <url>
            <loc>${SITE_URL}/blogs/${slugify(article.title)}</loc>
            <lastmod>${article.modified || article.date}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    `).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${blogUrlsXml}
    </urlset>`;

    return new NextResponse(sitemap, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}