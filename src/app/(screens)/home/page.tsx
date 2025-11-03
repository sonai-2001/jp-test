import { Metadata } from "next";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import HomePage from "./HomePage";

export async function generateMetadata(): Promise<Metadata> {
  const slug = StaticPageSlug.Home;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`,
    { cache: "no-store" }
  );
  const seo = await res.json();

  return {
    title: seo.metaTitle || "Home",
    description: seo.metaDescription || "Home Page.",
    alternates: {
      canonical:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
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

export default function Page() {
  return <HomePage />;
}