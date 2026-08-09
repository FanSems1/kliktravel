import { PrivateTripClient } from "./PrivateTripClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Trip | Klik Travel ID",
  description: "Rancang perjalanan eksklusif yang disesuaikan sepenuhnya dengan impian Anda bersama Klik Travel ID.",
};

export default function PrivateTripPage() {
  return <PrivateTripClient />;
}
