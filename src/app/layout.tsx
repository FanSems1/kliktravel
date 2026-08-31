import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ContactWidget } from "@/components/ui/ContactWidget";
import { ReactNode } from "react";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kliktravel.id"),
  title: "Klik Travel ID | Agent Travel Terpercaya, Paket Wisata & Open Trip",
  description: "Agen travel pilihan untuk paket wisata Indonesia dan luar negeri. Nikmati open trip seru, private tour keluarga, dan petualangan santai ke Bali, Labuan Bajo, Jepang, Korea, hingga Eropa.",
  icons: {
    icon: "/kliktravelid.png",
    shortcut: "/kliktravelid.png",
    apple: "/kliktravelid.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans min-h-screen bg-ivory text-foreground antialiased flex flex-col selection:bg-[#A89053] selection:text-white`}
      >
        <LanguageProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <ContactWidget />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
