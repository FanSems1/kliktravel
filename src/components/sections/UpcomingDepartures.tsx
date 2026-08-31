"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Departure {
  num: string;
  title: string;
  subtitle: string;
  durationID: string;
  durationEN: string;
  datesID: string;
  datesEN: string;
  airline: string;
  price: string;
}

const DEPARTURES: Departure[] = [
  {
    num: "01",
    title: "3STAN AUTUMN EXPEDITION",
    subtitle: "Uzbekistan, Kyrgyzstan & Kazakhstan",
    durationID: "9 Hari",
    durationEN: "9 Days",
    datesID: "18 — 26 Okt 2026",
    datesEN: "18 — 26 Oct 2026",
    airline: "Qatar Airways",
    price: "IDR 29,5 JT"
  },
  {
    num: "02",
    title: "RAJA AMPAT PRIVATE SAILING",
    subtitle: "Raja Ampat, Papua Barat",
    durationID: "7 Hari",
    durationEN: "7 Days",
    datesID: "12 — 19 Nov 2026",
    datesEN: "12 — 19 Nov 2026",
    airline: "Garuda Indonesia",
    price: "IDR 42,0 JT"
  },
  {
    num: "03",
    title: "TURKEY AUTUMN ENCHANTMENT",
    subtitle: "Istanbul, Cappadocia & Pamukkale",
    durationID: "10 Hari",
    durationEN: "10 Days",
    datesID: "01 — 10 Des 2026",
    datesEN: "01 — 10 Dec 2026",
    airline: "Turkish Airlines",
    price: "IDR 34,5 JT"
  },
  {
    num: "04",
    title: "KYOTO AUTUMN LEAVES",
    subtitle: "Kyoto, Nara & Gunung Fuji",
    durationID: "8 Hari",
    durationEN: "8 Days",
    datesID: "15 — 22 Des 2026",
    datesEN: "15 — 22 Dec 2026",
    airline: "Japan Airlines",
    price: "IDR 38,0 JT"
  }
];

export function UpcomingDepartures() {
  const { t, locale } = useLanguage();

  return (
    <section className="bg-charcoal text-white py-24 md:py-36 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
          <div>
            <span className="typography-caption !text-white/50 block mb-4">
              {t("departures_tag")}
            </span>
            <h2 className="typography-section text-white">
              {t("departures_title")}
            </h2>
          </div>
          <div>
            <Link 
              href="/destinations" 
              className="inline-block border-b border-white/30 hover:border-white pb-1 typography-button !text-white/80 hover:!text-white transition-all duration-300"
            >
              {locale === "id" ? "Lihat Semua Perjalanan" : "View All Journeys"}
            </Link>
          </div>
        </div>

        {/* Horizontal Editorial Rows */}
        <div className="flex flex-col border-t border-white/10">
          {DEPARTURES.map((departure) => (
            <motion.div
              key={departure.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group border-b border-white/10 py-8 md:py-10 cursor-pointer transition-all duration-500 hover:bg-white/5 hover:px-6 rounded"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                
                {/* Number */}
                <div className="col-span-2 md:col-span-1 font-mono text-sm text-white/40 group-hover:text-sky-300 transition-colors">
                  [{departure.num}]
                </div>

                {/* Image Placeholder Thumbnail */}
                <div className="col-span-10 md:col-span-2 relative aspect-[16/10] overflow-hidden rounded bg-white/10 hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-white/10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay" />
                </div>

                {/* Tour Info */}
                <div className="col-span-12 sm:col-span-6 md:col-span-5 flex flex-col justify-center">
                  <h3 className="typography-package-title !text-white group-hover:!text-sky-200 transition-colors">
                    {departure.title}
                  </h3>
                  <p className="typography-caption !text-white/60 mt-1">
                    {departure.subtitle} • <span className="text-white/40">{locale === "id" ? departure.durationID : departure.durationEN}</span>
                  </p>
                </div>

                {/* Dates & Airline */}
                <div className="col-span-6 md:col-span-2 typography-caption !text-white/50 hidden md:flex flex-col">
                  <span>{locale === "id" ? departure.datesID : departure.datesEN}</span>
                  <span className="text-[10px] text-white/30 uppercase mt-0.5">{departure.airline}</span>
                </div>

                {/* Price & Action Arrow */}
                <div className="col-span-12 sm:col-span-4 md:col-span-2 flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0">
                  <div className="typography-price !text-[#38BDF8]">
                    {locale === "id" ? departure.price : departure.price.replace("JT", "M")}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-charcoal transition-all duration-300">
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
