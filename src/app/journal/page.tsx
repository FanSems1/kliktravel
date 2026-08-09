import React from "react";
import { Metadata } from "next";
import { JournalClient } from "./JournalClient";

export const metadata: Metadata = {
  title: "Travel Journal | Klik Travel ID",
  description: "Read curated travel stories, destination guides, and behind-the-scenes insights from our travel specialists.",
  openGraph: {
    title: "Travel Journal | Klik Travel ID",
    description: "Read curated travel stories, destination guides, and behind-the-scenes insights from our travel specialists.",
    url: "https://kliktravel.id/journal",
    type: "website"
  }
};

export default function JournalPage() {
  return <JournalClient />;;
}
