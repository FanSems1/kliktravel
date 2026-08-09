import { Metadata } from "next";
import { IndonesiaHero } from "@/components/sections/IndonesiaHero";
import { DreamHolidaySelector } from "@/components/sections/DreamHolidaySelector";
import { AboutUsSection } from "@/components/sections/AboutUsSection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedJourneys } from "@/components/sections/FeaturedJourneys";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { WaveTransition } from "@/components/ui/WaveTransition";

export const metadata: Metadata = {
  title: "Klik Travel ID | Journeys Beyond The Ordinary",
  description: "Curating exceptional editorial journeys across the Indonesian archipelago and beyond. Redefining modern luxury travel through thoughtful curation and exclusive access.",
  alternates: {
    canonical: "https://kliktravel.id",
  },
  openGraph: {
    title: "Klik Travel ID | Premium Editorial Journeys",
    description: "Curating exceptional editorial journeys across the Indonesian archipelago and beyond.",
    url: "https://kliktravel.id",
    siteName: "Klik Travel ID",
    images: [
      {
        url: "https://kliktravel.id/og-image.jpg", // Placeholder
        width: 1200,
        height: 630,
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klik Travel ID | Journeys Beyond The Ordinary",
    description: "Curating exceptional editorial journeys across the Indonesian archipelago and beyond.",
    images: ["https://kliktravel.id/twitter-image.jpg"], // Placeholder
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
        "description": "Premium travel curation focusing on editorial journeys and exclusive local experiences."
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

      {/* 
        Visually hidden H1 to fulfill the SEO requirement of a single H1,
        since our Hero uses highly stylized components that don't easily fit a standard H1 tag.
      */}
      <h1 className="sr-only">Journeys Beyond The Ordinary</h1>

      {/* 01 - Hero / Opening Experience */}
      <IndonesiaHero />

      {/* 02 - Dream Holiday Selector */}
      <DreamHolidaySelector />

      {/* 03 - Tentang Kami */}
      <AboutUsSection />

      {/* 04 - Services */}
      <ServicesSection />

      {/* 05 - Organic / Wave Section Transition */}
      <WaveTransition colorClass="text-charcoal" className="bg-ivory" />

      {/* 06 - Featured Journeys */}
      <FeaturedJourneys />

      {/* 07 - Experience / Momen Kebersamaan Customer */}
      <ExperienceSection />

      {/* 08 - Visi & Misi */}
      <VisionMissionSection />

      {/* 09 - Why Choose Us (Keunggulan) */}
      <WhyChooseUsSection />

      {/* 10 - Journal / Travel Stories */}
      {/* <JournalPreview /> */}

      {/* 11 - Final CTA */}
      <FinalCTA />
    </>
  );
}
