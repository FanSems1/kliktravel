import React from "react";
import { Metadata } from "next";
import { journalArticles } from "@/data/journal";
import { JournalArticleDetailClient } from "@/components/journal/JournalArticleDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((j) => j.slug === slug);

  const title = article ? `${article.titleID} | Klik Travel ID Journal` : "Jurnal Perjalanan | Klik Travel ID";
  const description = article ? article.excerptID : "Baca artikel dan jurnal perjalanan pilihan Klik Travel ID.";

  return {
    title,
    description,
    alternates: {
      canonical: `/journal/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kliktravel.id/journal/${slug}`,
      type: "article",
      images: article ? [{ url: article.image }] : [],
    },
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = journalArticles.find((j) => j.slug === slug);

  // Parse custom date from "14 Jul 2026" or similar format to standard ISO
  let publishDate = new Date().toISOString();
  if (article?.dateEN) {
    try {
      publishDate = new Date(article.dateEN).toISOString();
    } catch (e) {
      console.error(e);
    }
  }

  const jsonLd = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.titleID,
    "description": article.excerptID,
    "image": article.image,
    "datePublished": publishDate,
    "author": {
      "@type": "Organization",
      "name": "Klik Travel ID"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Klik Travel ID",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kliktravel.id/logo.png"
      }
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <main>
        <JournalArticleDetailClient slug={slug} />
      </main>
    </>
  );
}
