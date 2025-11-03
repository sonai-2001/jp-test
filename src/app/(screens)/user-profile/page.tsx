import { Metadata } from "next";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import UserProfile from "./UserProfilePage";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const slug = StaticPageSlug.UserProfile;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`,
    { cache: "no-store" }
  );
  const seo = await res.json();

  return {
    title: seo.metaTitle || StaticPageSlug.UserProfile,
    description: seo.metaDescription || StaticPageSlug.UserProfile,
    alternates: {
      canonical:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/${StaticPageSlug.UserProfile}`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/${StaticPageSlug.UserProfile}`,
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

export default function UserProfileBreadCrumb() {
  // Since this is a static page with no dynamic params, we can ignore the props
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
        name: "User Profile",
        item: "https://jaypeeassociates.co.in/user-profile",
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
      <UserProfile />
    </>
  );
}
