import { Metadata } from "next";
import Script from "next/script";
import HomePage from "./(screens)/home/HomePage";

export async function generateMetadata(): Promise<Metadata> {
  const slug = "landing-page";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`, {
    cache: "no-store",
  });
  const seo = await res.json();

  return {
    title: seo.metaTitle || "Landing Page",
    description: seo.metaDescription || "Landing Page",
    alternates: {
      canonical: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}`,
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

export default function Home() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jaypeeassociates.co.in/",
      },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-root"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomePage />
    </>
  );
}