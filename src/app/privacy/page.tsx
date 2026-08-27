import React from "react";
import { Metadata } from "next";
import { PrivacyClient } from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Klik Travel ID",
  description: "Kebijakan privasi Klik Travel ID. Informasi mengenai cara kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Kebijakan Privasi | Klik Travel ID",
    description: "Informasi mengenai cara kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
    url: "https://kliktravel.id/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Kebijakan Privasi - Klik Travel ID",
    "description": "Kebijakan privasi Klik Travel ID. Informasi mengenai cara kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
    "url": "https://kliktravel.id/privacy",
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
      <PrivacyClient />
    </>
  );
}
