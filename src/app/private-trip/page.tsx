import { PrivateTripClient } from "./PrivateTripClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Trip Kustom & Liburan Keluarga | Klik Travel ID",
  description: "Rancang liburan impian tanpa gabung rombongan lain. Bebas atur jadwal, hotel, dan destinasi favorit di Indonesia maupun luar negeri.",
  alternates: {
    canonical: "/private-trip",
  },
  openGraph: {
    title: "Private Trip Kustom & Liburan Keluarga | Klik Travel ID",
    description: "Rancang liburan impian tanpa gabung rombongan lain. Bebas atur jadwal, hotel, dan destinasi favorit di Indonesia maupun luar negeri.",
    url: "https://kliktravel.id/private-trip",
    type: "website"
  }
};

export default function PrivateTripPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Private Trip & Custom Tour Planning",
    "provider": {
      "@type": "Organization",
      "name": "Klik Travel ID"
    },
    "serviceType": "Bespoke Travel Planning",
    "areaServed": "Global",
    "description": "Layanan perancangan liburan privat dan paket tur kustom eksklusif untuk keluarga, grup, atau pasangan."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivateTripClient />
    </>
  );
}
