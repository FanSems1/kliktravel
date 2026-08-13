import React from "react";
import { JournalArticleDetailClient } from "@/components/journal/JournalArticleDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <JournalArticleDetailClient slug={slug} />;
}
