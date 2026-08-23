import { Metadata } from "next";
import { IndonesiaHero } from "@/components/sections/IndonesiaHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DreamHolidaySelector } from "@/components/sections/DreamHolidaySelector";
import { FeaturedJourneys } from "@/components/sections/FeaturedJourneys";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { AboutUsSection } from "@/components/sections/AboutUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Klik Travel ID | Paket Wisata & Open Trip Indonesia - Luar Negeri",
  description: "Rencanakan liburan impianmu bersama Klik Travel ID. Dari pantai eksotis Bali & Labuan Bajo, suasana romantis Korea & Jepang, hingga sudut indah Eropa dengan harga jujur dan itinerary nyaman.",
  alternates: {
    canonical: "https://kliktravel.id",
  },
  openGraph: {
    title: "Klik Travel ID | Agen Travel Terpercaya untuk Paket Wisata & Open Trip",
    description: "Rencanakan liburan impianmu bersama Klik Travel ID. Dari pantai eksotis Bali & Labuan Bajo, suasana romantis Korea & Jepang, hingga sudut indah Eropa dengan harga jujur dan itinerary nyaman.",
    url: "https://kliktravel.id",
    siteName: "Klik Travel ID",
    images: [
      {
        url: "https://kliktravel.id/og-image.jpg",
        width: 1200,
        height: 630,
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klik Travel ID | Paket Wisata & Open Trips Pilihan",
    description: "Menyediakan paket wisata terpercaya, open trip seru, dan private tour kustom melintasi kepulauan Indonesia dan mancanegara.",
    images: ["https://kliktravel.id/twitter-image.jpg"],
  }
};

export default function Home() {
  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kliktravel.id/#organization",
        "name": "Klik Travel ID",
        "url": "https://kliktravel.id",
        "logo": "https://kliktravel.id/logo.png",
        "description": "Quality travel curation focusing on local journeys and authentic experiences."
      },
      {
        "@type": "WebSite",
        "@id": "https://kliktravel.id/#website",
        "url": "https://kliktravel.id",
        "name": "Klik Travel ID",
        "publisher": {
          "@id": "https://kliktravel.id/#organization"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="sr-only">Journeys Beyond The Ordinary</h1>

      {/* 01 - Hero */}
      <IndonesiaHero />

      {/* 02 - Pilihan Layanan (Open Trip & Private Trip) */}
      <ServicesSection />

      {/* 03 - Destinasi & Paket Wisata */}
      <DreamHolidaySelector />
      <FeaturedJourneys />

      {/* 04 - Kenapa Klik Travel? */}
      <WhyChooseUsSection />

      {/* 05 - Tentang Kami (Termasuk Visi & Misi) */}
      <AboutUsSection />

      {/* 06 - Testimonial */}
      <TestimonialsSection />

      {/* 07 - Gallery / Video & CTA WhatsApp */}
      <FinalCTA />
    </>
  );
}
