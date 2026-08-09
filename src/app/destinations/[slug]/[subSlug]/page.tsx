import { notFound } from "next/navigation";
import { indonesianRegions } from "@/data/destinations";
import { SubDestinationDetailClient } from "./SubDestinationDetailClient";

export async function generateStaticParams() {
  const params: { slug: string; subSlug: string }[] = [];
  indonesianRegions.forEach((region) => {
    region.subDestinations.forEach((sub) => {
      params.push({ slug: region.slug, subSlug: sub.slug });
    });
  });
  return params;
}

export default async function SubDestinationDetailPage({ params }: { params: Promise<{ slug: string, subSlug: string }> }) {
  const { slug, subSlug } = await params;
  const region = indonesianRegions.find((r) => r.slug === slug);
  const subDestination = region?.subDestinations.find((s) => s.slug === subSlug);

  if (!region || !subDestination) {
    notFound();
  }

  return (
    <main>
      <SubDestinationDetailClient slug={slug} subSlug={subSlug} />
    </main>
  );
}
