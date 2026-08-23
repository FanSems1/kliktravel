import React from "react";
import { Metadata } from "next";
import { InquireClient } from "./InquireClient";

export const metadata: Metadata = {
  title: "Konsultasi & Inquiry Perjalanan | Klik Travel ID",
  description: "Hubungi tim konsultan spesialis Klik Travel ID untuk konsultasi paket wisata, open trip, dan perancangan private trip eksklusif.",
  alternates: {
    canonical: "/inquire",
  },
  openGraph: {
    title: "Konsultasi & Inquiry Perjalanan | Klik Travel ID",
    description: "Hubungi tim konsultan spesialis Klik Travel ID untuk konsultasi paket wisata.",
    url: "https://kliktravel.id/inquire",
    type: "website",
  },
};

export default function InquirePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Konsultasi & Inquiry Perjalanan - Klik Travel ID",
    "description": "Formulir konsultasi dan pemesanan perjalanan Klik Travel ID.",
    "url": "https://kliktravel.id/inquire",
    "publisher": {
      "@type": "Organization",
      "name": "Klik Travel ID",
      "logo": "https://kliktravel.id/logo.png"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InquireClient />
    </>
  );
}
