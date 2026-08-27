import React from "react";
import { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "Tentang Kami | Sahabat Perjalanan Liburanmu - Klik Travel ID",
  description: "Klik Travel ID hadir membantu kamu menikmati momen liburan tanpa ribet. Agen travel terpercaya dengan pendampingan tour leader ramah dan berpengalaman.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Tentang Kami | Sahabat Perjalanan Liburanmu - Klik Travel ID",
    description: "Klik Travel ID hadir membantu kamu menikmati momen liburan tanpa ribet. Agen travel terpercaya dengan pendampingan tour leader ramah dan berpengalaman.",
    url: "https://kliktravel.id/about",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Tentang Kami - Klik Travel ID",
    "description": "Klik Travel ID hadir membantu kamu menikmati momen liburan tanpa ribet. Agen travel terpercaya dengan pendampingan tour leader ramah dan berpengalaman.",
    "url": "https://kliktravel.id/about",
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
      <AboutClient />
    </>
  );
}
