// app/(screens)/brands/[slug]/page.tsx

import { Metadata } from "next";
import { slugify } from "@/util/slugify";
import IndustryProductsPage from "./IndustryProductsPage";
import Script from "next/script";

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
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/industries/${slug}`,
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params; // ✅ Await the params Promise
  const decodedSlug = decodeURIComponent(slug);
  console.log("🚀 ~ Industry Page ~ decodedSlug:", decodedSlug);

  // Fetch industry info from API
  const industryRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/industry/${decodedSlug}`,
    { cache: "no-store" }
  );
  console.log("🚀 ~ Page ~ industryRes:", industryRes);

  let industryName = decodedSlug; // fallback
  if (industryRes.ok) {
    const data = await industryRes.json();
    industryName = data.industry || decodedSlug;
  }

  // Build breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jaypeeassociates.co.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industries",
        item: "https://jaypeeassociates.co.in/industries",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: industryName, // dynamic
        item: `https://jaypeeassociates.co.in/industries/${slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-industry"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IndustryProductsPage slug={slug} />
    </>
  );
}