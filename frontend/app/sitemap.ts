import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://quraherbs.in";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const productSlugs = [
    "glow-radiant-plus",
    "avocado-night-cream",
    "tea-tree-pureveil-cleanser",
    "red-wine-glow-cleanser",
    "spf-50-sunscreen",
    "vitamin-c-serum",
    "hair-shine-serum",
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const categorySlugs = [
    "oily-skin",
    "dry-skin",
    "sensitive-skin",
    "combination-skin",
    "hair-care",
    "normal-skin",
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const journalSlugs = [
    "how-to-use-your-night-cream",
    "the-hair-reset",
  ];

  const journalRoutes: MetadataRoute.Sitemap = journalSlugs.map((slug) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const policyRoutes: MetadataRoute.Sitemap = [
    "/privacy",
    "/terms",
    "/shipping",
    "/refund",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...journalRoutes,
    ...policyRoutes,
  ];
}
