import { DestinationDetailClient } from "./DestinationDetailClient";

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main>
      <DestinationDetailClient slug={slug} />
    </main>
  );
}
