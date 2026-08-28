import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getJourneyDestinationUrl(journey: any): string {
  if (!journey) return "/destinations";

  const rSlug = (journey.regionSlug || "").toLowerCase().trim();
  const sSlug = (journey.subSlug || journey.slug || "").toLowerCase().trim();

  if (rSlug && sSlug) {
    return `/destinations/${rSlug}/${sSlug}`;
  }

  const slug = (journey.slug || "").toLowerCase();
  const dest = (journey.destination || "").toLowerCase();

  if (slug.includes("victoria") || slug.includes("hongkong") || dest.includes("hong kong") || dest.includes("hongkong")) {
    return `/destinations/hongkong/${slug || "victoria-peak"}`;
  }
  if (slug.includes("komodo") || slug.includes("sailing") || dest.includes("indonesia") || dest.includes("komodo") || dest.includes("bajo")) {
    return `/destinations/indonesia/${slug}`;
  }
  if (slug.includes("seoul") || slug.includes("jeju") || slug.includes("nami") || dest.includes("korea")) {
    return `/destinations/korea/${slug}`;
  }
  if (slug.includes("jungfrau") || slug.includes("salju") || dest.includes("switzerland") || dest.includes("eropa") || dest.includes("europe")) {
    return `/destinations/others/${slug}`;
  }
  if (slug.includes("tokyo") || slug.includes("kyoto") || slug.includes("osaka") || dest.includes("jepang") || dest.includes("japan")) {
    return `/destinations/japan/${slug}`;
  }

  if (rSlug) {
    return `/destinations/${rSlug}`;
  }
  if (sSlug) {
    return `/destinations/hongkong/${sSlug}`;
  }
  return `/destinations`;
}
