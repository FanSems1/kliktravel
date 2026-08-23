import { Metadata } from "next";
import { indonesianRegions } from "@/data/destinations";
import { SubDestinationDetailClient } from "./SubDestinationDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, subSlug: string }> }): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);
  const sub = region?.subDestinations.find((s) => s.slug === subSlug);

  const subName = sub ? sub.name : subSlug.toUpperCase();
  const regionName = region ? region.name : slug.toUpperCase();

  const title = `Paket Tour ${subName} (${regionName}) | Klik Travel ID`;
  const description = `Jelajahi keindahan ${subName} di ${regionName}. Dapatkan informasi itinerary, harga promo open trip, dan layanan private tour eksklusif bersama Klik Travel ID.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/destinations/${slug}/${subSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kliktravel.id/destinations/${slug}/${subSlug}`,
      type: "website",
    },
  };
}

export default async function SubDestinationDetailPage({ params }: { params: Promise<{ slug: string, subSlug: string }> }) {
  const { slug, subSlug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);
  const sub = region?.subDestinations.find((s) => s.slug === subSlug);

  const subName = sub ? sub.name : subSlug;
  const regionName = region ? region.name : slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": "https://kliktravel.id"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Destinasi",
            "item": "https://kliktravel.id/destinations"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": regionName,
            "item": `https://kliktravel.id/destinations/${slug}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": subName,
            "item": `https://kliktravel.id/destinations/${slug}/${subSlug}`
          }
        ]
      },
      {
        "@type": "TouristTrip",
        "name": `Paket Wisata ${subName}`,
        "description": `Perjalanan wisata terkurasi menuju ${subName}, ${regionName}.`,
        "url": `https://kliktravel.id/destinations/${slug}/${subSlug}`,
        "touristType": "Adventure & Leisure"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <SubDestinationDetailClient slug={slug} subSlug={subSlug} />
      </main>
    </>
  );
}
