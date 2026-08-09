import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JourneysClient } from "./JourneysClient";

export const metadata = {
  title: "Curated Journeys | Klik Travel ID",
  description: "Curated journeys for those who want to see the world differently. Discover highly-crafted editorial travel experiences across the Indonesian archipelago.",
};

export default function JourneysListingPage() {
  return <JourneysClient />;
}
