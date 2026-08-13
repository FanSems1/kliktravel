import { SubDestinationDetailClient } from "./SubDestinationDetailClient";

export default async function SubDestinationDetailPage({ params }: { params: Promise<{ slug: string, subSlug: string }> }) {
  const { slug, subSlug } = await params;

  return (
    <main>
      <SubDestinationDetailClient slug={slug} subSlug={subSlug} />
    </main>
  );
}
