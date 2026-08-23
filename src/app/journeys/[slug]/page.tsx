import { notFound } from "next/navigation";
import { journeys } from "@/data/journeys";
import { JourneyDetailClient } from "@/components/journeys/detail/JourneyDetailClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Pre-render all journey pages at build time
export async function generateStaticParams() {
  return journeys.map((journey) => ({
    slug: journey.slug,
  }));
}

// Dynamically generate SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = journeys.find((j) => j.slug === slug);

  return {
    title: journey ? `${journey.title} — ${journey.destination} | Klik Travel ID` : "Detail Perjalanan | Klik Travel ID",
    description: journey ? journey.introDescription : "Paket liburan dan open trip terfavorit dengan itinerary santai dan nyaman bersama Klik Travel ID.",
    alternates: {
      canonical: `https://kliktravel.id/journeys/${slug}`
    },
    openGraph: {
      title: journey ? `${journey.title} | Klik Travel ID` : "Detail Perjalanan",
      description: journey ? journey.introDescription : "Paket liburan dan open trip terfavorit.",
      url: `https://kliktravel.id/journeys/${slug}`,
      siteName: "Klik Travel ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: journey ? `${journey.title} | Klik Travel ID` : "Detail Perjalanan",
      description: journey ? journey.introDescription : "Paket liburan dan open trip terfavorit.",
    }
  };
}

export default async function JourneyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = journeys.find((j) => j.slug === slug);

  // Schema.org Structured Data
  const jsonLd = journey ? {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": journey.title,
    "description": journey.introDescription,
    "touristType": journey.travelStyle,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": journey.priceRaw,
      "url": `https://kliktravel.id/journeys/${journey.slug}`
    },
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": journey.itinerary.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TouristAttraction",
          "name": item.title,
          "description": item.description
        }
      }))
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <main className="bg-ivory text-foreground font-sans min-h-screen">
        <JourneyDetailClient slug={slug} />
      </main>
    </>
  );
}
