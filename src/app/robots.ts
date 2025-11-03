import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/signin",
          "/admin/",
          "/my-cart",
          "/password-recovery",
          "/my-enquiry",
          "/user-profile",
          "/*:-*",
          "/?s=",
          "/*?*",
          "/sitemap",
          "/products/demo-new",
        ],
      },
    ],
    sitemap: "https://jaypeeassociates.co.in/sitemap.xml",
  };
}
