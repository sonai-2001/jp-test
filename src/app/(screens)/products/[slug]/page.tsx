// app/(screens)/products/[slug]/page.tsx

import { Metadata } from "next";
import Script from "next/script";
import ProductPageClient from "./ProductPageClient";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const seoRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`,
    { cache: "no-store" }
  );
  const seo = await seoRes.json();
  console.log("seo", seo);

  return {
    title: seo.metaTitle || slug,
    description: seo.metaDescription || "Default product description.",
    alternates: {
      canonical:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
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
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 🚀 Fetch product data (includes category + brand)
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
    { cache: "no-store" }
  );

  let productData = null;
  if (productRes.ok) {
    productData = await productRes.json();
  }

  // 📈 Fetch SEO data for meta description fallback
  const seoRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`,
    { cache: "no-store" }
  );
  const seoData = await seoRes.json();

  // 🔁 Fallback logic for description
  const productDescription =
    seoData?.metaDescription ||
    productData?.description ||
    "";

  // 🖼️ Ensure image is array (even if single)
  const productImages = Array.isArray(productData?.images)
    ? productData.images
    : productData?.image
      ? [productData.image]
      : [];

  // 🧩 Build Breadcrumb JSON-LD
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
        name: productData?.category || "Category",
        item: `https://jaypeeassociates.co.in/categories/${productData?.categorySlug || "category"}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: productData?.ProductName || slug,
        item: `https://jaypeeassociates.co.in/products/${slug}`,
      },
    ],
  };

  // 🧩 Build Product Schema JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData?.ProductName || slug,
    image: productImages.length > 0 ? productImages : ["/placeholder-image.jpg"], // fallback image if none
    description: productDescription,
    brand: {
      "@type": "Brand",
      name: "Jaypee Associates",
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 4.8,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: "Arjun Das",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 137,
    },
  };

  return (
    <>
      {/* 🍞 Breadcrumb Schema */}
      <Script
        id="breadcrumb-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 🛒 Product Schema */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* 💡 Render client component */}
      <ProductPageClient slug={slug} />
    </>
  );
}