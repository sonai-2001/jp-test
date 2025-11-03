// app/(screens)/brands/[slug]/page.tsx

import { Metadata } from "next";
import { slugify } from "@/util/slugify";
import BrandProductsPage from "./BrandProductsClient";

// Define the correct PageProps interface for App Router
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- SEO METADATA FUNCTION ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params Promise
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    // You may need to adjust the API endpoint for brand SEO
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seo/${slugify(decodedSlug)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch SEO data");
    }

    const seo = await res.json();

    return {
      title: seo.metaTitle || `${slug} products`,
      description: seo.metaDescription || "Browse products by brand.",
      alternates: {
        canonical: seo.canonicalUrl || "",
      },
      robots: seo.robots || "index, follow",
      openGraph: {
        title: seo.ogTitle || seo.metaTitle,
        description: seo.ogDescription || seo.metaDescription,
        url:
          seo.canonicalUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/brands/${slug}`,
        images: seo.ogImage
          ? [
              {
                url: seo.ogImage,
                width: seo.ogImageWidth || 1200,
                height: seo.ogImageHeight || 630,
              },
            ]
          : [],
      },
      twitter: {
        title: seo.twitterTitle || seo.metaTitle,
        description: seo.twitterDescription || seo.metaDescription,
        images: seo.twitterImage ? [seo.twitterImage] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
    return {
      title: "Brand Products",
      description: "Browse products by brand",
    };
  }
}

// --- PAGE COMPONENT ---
export default async function Page({ params }: PageProps) {
  // Await the params Promise to get the actual slug value
  const { slug } = await params;
  
  return <BrandProductsPage slug={slug} />;
}