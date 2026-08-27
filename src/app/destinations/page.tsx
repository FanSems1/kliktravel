import React from "react";
import { Metadata } from "next";
import { DestinationsClient } from "./DestinationsClient";
import { indonesianRegions } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinasi Wisata Pilihan Indonesia & Dunia | Klik Travel ID",
  description: "Jelajahi keindahan Indonesia dan dunia. Pilih liburan favoritmu dari Bali, Bromo, Labuan Bajo, Raja Ampat, hingga Thailand, Vietnam, Korea, Jepang, dan Eropa.",
  alternates: {
    canonical: "/destinations",
  },
  openGraph: {
    title: "Destinasi Wisata Pilihan Indonesia & Dunia | Klik Travel ID",
    description: "Jelajahi keindahan Indonesia dan dunia. Pilih liburan favoritmu dari Bali, Bromo, Labuan Bajo, Raja Ampat, hingga Thailand, Vietnam, Korea, Jepang, dan Eropa.",
    url: "https://kliktravel.id/destinations",
    type: "website",
  },
};

export default function DestinationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Destinasi Wisata Pilihan - Klik Travel ID",
    "description": "Daftar wilayah dan negara destinasi wisata yang tersedia di Klik Travel ID.",
    "itemListElement": indonesianRegions.map((region, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TouristDestination",
        "name": region.name,
        "description": region.subtitle,
        "url": `https://kliktravel.id/destinations/${region.slug}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationsClient />
    </>
  );
}
