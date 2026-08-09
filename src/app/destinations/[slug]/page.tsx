import { notFound } from "next/navigation";
import { indonesianRegions } from "@/data/destinations";
import { DestinationDetailClient } from "./DestinationDetailClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function generateStaticParams() {
  return indonesianRegions.map((region) => ({
    slug: region.slug,
  }));
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);

  if (!region) {
    notFound();
  }

  return (
    <main>
      <DestinationDetailClient slug={slug} />
    </main>
  );
}
