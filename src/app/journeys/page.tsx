import React from "react";
import { Metadata } from "next";
import { JourneysClient } from "./JourneysClient";
import { journeys } from "@/data/journeys";

export const metadata: Metadata = {
  title: "Paket Wisata & Open Trip Hemat - Santai | Klik Travel ID",
  description: "Daftar paket liburan dan open trip terfavorit. Pilih itinerary fleksibel untuk jalan-jalan bareng teman atau private trip bareng keluarga tercinta.",
  alternates: {
    canonical: "/journeys",
  },
  openGraph: {
    title: "Paket Wisata & Open Trip Hemat - Santai | Klik Travel ID",
    description: "Daftar paket liburan dan open trip terfavorit. Pilih itinerary fleksibel untuk jalan-jalan bareng teman atau private trip bareng keluarga tercinta.",
    url: "https://kliktravel.id/journeys",
    type: "website",
  },
};

export default function JourneysListingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Paket Wisata & Open Trip - Klik Travel ID",
    "description": "Daftar paket liburan dan open trip terfavorit dari Klik Travel ID.",
    "itemListElement": journeys.map((journey, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TouristTrip",
        "name": journey.title,
        "description": journey.introDescription,
        "url": `https://kliktravel.id/journeys/${journey.slug}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "IDR",
          "price": journey.priceRaw
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JourneysClient />
    </>
  );
}
