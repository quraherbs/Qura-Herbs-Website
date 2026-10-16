import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/order-success", "/api/"],
      },
    ],
    sitemap: "https://quraherbs.in/sitemap.xml",
  };
}
