import React from "react";
import { Metadata } from "next";
import { TermsClient } from "./TermsClient";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Klik Travel ID",
  description: "Syarat dan ketentuan Klik Travel ID. Aturan, hak, dan kewajiban yang berlaku untuk pengguna layanan Klik Travel ID.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Syarat & Ketentuan | Klik Travel ID",
    description: "Aturan, hak, dan kewajiban yang berlaku untuk pengguna layanan Klik Travel ID.",
    url: "https://kliktravel.id/terms",
    type: "website",
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Syarat & Ketentuan - Klik Travel ID",
    "description": "Syarat dan ketentuan Klik Travel ID. Aturan, hak, dan kewajiban yang berlaku untuk pengguna layanan Klik Travel ID.",
    "url": "https://kliktravel.id/terms",
    "publisher": {
      "@type": "Organization",
      "name": "Klik Travel ID",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kliktravel.id/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsClient />
    </>
  );
}
