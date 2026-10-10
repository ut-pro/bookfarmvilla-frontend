import type { MetadataRoute } from "next";

const SITE_URL = "https://www.bookfarmvilla.com";
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/vendors`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...[
      "CATERER",
      "PHOTOGRAPHER",
      "DJ",
      "DECORATOR",
      "OTHER_SERVICES",
    ].map((category) => ({
      url: `${SITE_URL}/vendors?category=${category}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/properties`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookie-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const propertyTypePages: MetadataRoute.Sitemap = [
    "WEDDING_LAWN",
    "VILLA",
    "FARMHOUSE",
  ].map((type) => ({
    url: `${SITE_URL}/properties?type=${type}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...propertyTypePages];
}
