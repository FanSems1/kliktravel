import React from "react";
import { Metadata } from "next";
import { JournalClient } from "./JournalClient";
import { journalArticles } from "@/data/journal";

export const metadata: Metadata = {
  title: "Catatan Perjalanan & Tips Liburan Seru | Klik Travel ID",
  description: "Panduan wisata, inspirasi tempat liburan, tips hemat traveling, dan cerita perjalanan menarik mengelilingi destinasi indah Indonesia dan dunia.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "Catatan Perjalanan & Tips Liburan Seru | Klik Travel ID",
    description: "Panduan wisata, inspirasi tempat liburan, tips hemat traveling, dan cerita perjalanan menarik mengelilingi destinasi indah Indonesia dan dunia.",
    url: "https://kliktravel.id/journal",
    type: "website"
  }
};

export default function JournalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Travel Journal - Klik Travel ID",
    "description": "Panduan wisata, inspirasi tempat liburan, tips hemat traveling, dan cerita perjalanan menarik mengelilingi destinasi indah Indonesia dan dunia.",
    "url": "https://kliktravel.id/journal",
    "blogPost": journalArticles.map((article) => ({
      "@type": "BlogPosting",
      "headline": article.titleID,
      "description": article.excerptID,
      "image": article.image,
      "datePublished": new Date(article.dateEN).toISOString(),
      "url": `https://kliktravel.id/journal/${article.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JournalClient />
    </>
  );
}
