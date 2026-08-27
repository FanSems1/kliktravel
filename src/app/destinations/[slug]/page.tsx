import { Metadata } from "next";
import { indonesianRegions } from "@/data/destinations";
import { DestinationDetailClient } from "./DestinationDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);
  const title = region ? `Paket Wisata & Tour Ke ${region.name} | Klik Travel ID` : "Destinasi Wisata | Klik Travel ID";
  const description = region ? region.subtitle : "Jelajahi destinasi wisata terbaik bersama Klik Travel ID.";

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kliktravel.id/destinations/${slug}`,
      type: "website",
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);

  const jsonLd = region ? {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": region.name,
    "description": region.subtitle,
    "url": `https://kliktravel.id/destinations/${region.slug}`,
    "itemListElement": region.subDestinations.map((sub, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "TouristAttraction",
        "name": sub.name,
        "url": `https://kliktravel.id/destinations/${region.slug}/${sub.slug}`
      }
    }))
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <main>
        <DestinationDetailClient slug={slug} />
      </main>
    </>
  );
}
