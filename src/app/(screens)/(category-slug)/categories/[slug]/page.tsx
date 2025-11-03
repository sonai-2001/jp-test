// app/(screens)/categories/[slug]/page.tsx

import { Metadata } from "next";
import Script from "next/script";
import CategoryProductsClient from "./CategoryProductsClient";
import { slugify } from "@/util/slugify";

interface PageProps {
  params: Promise<{ slug: string }>; // ✅ Updated: params is now a Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // ✅ Optional: searchParams might also be a Promise
}

// ✅ SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ Fixed: await the params Promise
  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seo/${slugify(decodedSlug)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch SEO data");
    }

    const seo = await res.json();

    return {
      title: seo.metaTitle || `${decodedSlug} products`,
      description: seo.metaDescription || "Default category description.",
      alternates: {
        canonical:
          seo.canonicalUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${slug}`,
      },
      robots: seo.robots || "index, follow",
      openGraph: {
        title: seo.ogTitle || seo.metaTitle,
        description: seo.ogDescription || seo.metaDescription,
        url:
          seo.canonicalUrl ||
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${slug}`,
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
      title: "Category Products",
      description: "Browse products by category",
    };
  }
}

// ✅ Page Component
export default async function Page({ params }: PageProps) {
  const { slug } = await params; // ✅ Fixed: await the params Promise
  const decodedSlug = decodeURIComponent(slug);
  console.log("🚀 ~ Page ~ decodedSlug:", decodedSlug)

  // Fetch category info from API
  const categoryRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/category/${decodedSlug}`,
    { cache: "no-store" }
  );
  console.log("🚀 ~ Page ~ categoryRes:", categoryRes)

  let categoryName = decodedSlug; // fallback
  if (categoryRes.ok) {
    const data = await categoryRes.json();
    categoryName = data.category || decodedSlug;
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
        name: "Categories",
        item: "https://jaypeeassociates.co.in/categories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName, // dynamic
        item: `https://jaypeeassociates.co.in/categories/${slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryProductsClient slug={slug} />
    </>
  );
}