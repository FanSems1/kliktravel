import { redirect } from "next/navigation";
import { journeys } from "@/data/journeys";
import { getJourneyDestinationUrl } from "@/lib/utils";

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
  const targetUrl = getJourneyDestinationUrl(journey || { slug });

  return {
    title: journey ? `${journey.title} — ${journey.destination} | Klik Travel ID` : "Detail Perjalanan | Klik Travel ID",
    description: journey ? journey.introDescription : "Paket liburan dan open trip terfavorit dengan itinerary santai dan nyaman bersama Klik Travel ID.",
    alternates: {
      canonical: `https://kliktravel.id${targetUrl}`
    },
    openGraph: {
      title: journey ? `${journey.title} | Klik Travel ID` : "Detail Perjalanan",
      description: journey ? journey.introDescription : "Paket liburan dan open trip terfavorit.",
      url: `https://kliktravel.id${targetUrl}`,
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
  const targetUrl = getJourneyDestinationUrl(journey || { slug });
  
  redirect(targetUrl);
}
