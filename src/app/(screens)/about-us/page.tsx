import { Metadata } from "next";
import Script from "next/script";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import AboutUsPage from "./AboutUsPage";

export async function generateMetadata(): Promise<Metadata> {
  const slug = StaticPageSlug.AboutUs;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`, {
    cache: "no-store",
  });
  const seo = await res.json();

  return {
    title: seo.metaTitle || "About Us",
    description: seo.metaDescription || "Learn more about us.",
    alternates: {
      canonical: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url: seo.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
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

export default function AboutUs() {
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
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://jaypeeassociates.co.in/about-us",
      },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutUsPage />
    </>
  );
}