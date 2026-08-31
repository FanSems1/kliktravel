import { MetadataRoute } from "next";
import { indonesianRegions } from "@/data/destinations";
import { journeys } from "@/data/journeys";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kliktravel.id";
  const now = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journeys`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/private-trip`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/inquire`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 2. Dynamic Region Routes (/destinations/[slug])
  const regionRoutes: MetadataRoute.Sitemap = indonesianRegions.map((region) => ({
    url: `${baseUrl}/destinations/${region.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Dynamic Sub-Destination Routes (/destinations/[slug]/[subSlug])
  const subDestinationRoutes: MetadataRoute.Sitemap = indonesianRegions.flatMap((region) =>
    region.subDestinations.map((sub) => ({
      url: `${baseUrl}/destinations/${region.slug}/${sub.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  );

  // 4. Dynamic Journey Packages (/journeys/[slug])
  const journeyRoutes: MetadataRoute.Sitemap = journeys.map((journey) => ({
    url: `${baseUrl}/journeys/${journey.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...regionRoutes,
    ...subDestinationRoutes,
    ...journeyRoutes,
  ];
}
