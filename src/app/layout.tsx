import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Travel & Tours",
  description: "An international luxury travel editorial experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans min-h-screen bg-ivory text-foreground antialiased flex flex-col selection:bg-[#A89053] selection:text-white`}
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
