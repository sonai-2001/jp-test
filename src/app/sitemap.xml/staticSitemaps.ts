import { staticPages } from "../admin/seo/staticPages";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL;


// Set custom settings for some pages if you want
const customSettings = {
    "": { priority: 1.0, changefreq: "daily" },
    "home": { priority: 1.0, changefreq: "daily" },
    "faq": { priority: 0.8, changefreq: "monthly" },
    "privacy-policy": { priority: 0.8, changefreq: "monthly" },
    "terms-condition": { priority: 0.8, changefreq: "monthly" },
    "contactus": { priority: 0.8, changefreq: "monthly" },
    "shipping-policy": { priority: 0.8, changefreq: "monthly" },
    "catalogues": { priority: 0.8, changefreq: "monthly" },
    "request-product-quotes": { priority: 0.8, changefreq: "monthly" },
    "blogs": { priority: 0.9, changefreq: "weekly" },
  } as const;
  
  export const staticUrls = staticPages.map(({ slug }) => {
    const urlPath = slug === ""  ? "/" : `/${slug}/`;
    const settings = (customSettings as Record<string, { priority: number; changefreq: string }>)[slug] || { priority: 0.7, changefreq: "monthly" };
  
    return {
      loc: `${SITE_URL}${urlPath}`,
      lastmod: new Date().toISOString().split("T")[0],
      ...settings,
    };
  });