"use client";

import React, { useState } from "react";
import { ListingFilter } from "@/components/journeys/ListingFilter";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { localizedJourneys } from "@/data/journeys";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function JourneysClient() {
  const { t, locale } = useLanguage();
  const journeys = localizedJourneys[locale];

  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const filteredJourneys = journeys.filter((j) => {
    // Destination filter
    const matchDest = selectedDestination === "all" || 
      (selectedDestination === "komodo" && j.slug.includes("komodo")) ||
      (selectedDestination === "java" && j.slug.includes("java")) ||
      (selectedDestination === "bali" && j.slug.includes("bali")) ||
      (selectedDestination === "sumatra" && j.slug.includes("sumatra"));
      
    // Style filter
    const matchStyle = selectedStyle === "all" || 
      (selectedStyle === "marine" && (j.travelStyle.toLowerCase().includes("marine") || j.travelStyle.toLowerCase().includes("bahari"))) ||
      (selectedStyle === "cultural" && (j.travelStyle.toLowerCase().includes("cultural") || j.travelStyle.toLowerCase().includes("budaya"))) ||
      (selectedStyle === "wellness" && j.travelStyle.toLowerCase().includes("wellness")) ||
      (selectedStyle === "active" && (j.travelStyle.toLowerCase().includes("active") || j.travelStyle.toLowerCase().includes("aktif")));

    // Month filter
    const matchMonth = selectedMonth === "all" || 
      (selectedMonth === "jul" && j.travelMonth.toLowerCase().includes("jul")) ||
      (selectedMonth === "aug" && (j.travelMonth.toLowerCase().includes("aug") || j.travelMonth.toLowerCase().includes("agu"))) ||
      (selectedMonth === "nov" && j.travelMonth.toLowerCase().includes("nov")) ||
      (selectedMonth === "dec" && (j.travelMonth.toLowerCase().includes("dec") || j.travelMonth.toLowerCase().includes("des")));

    return matchDest && matchStyle && matchMonth;
  });

  return (
    <div className="bg-ivory text-foreground min-h-screen font-sans selection:bg-[#0284C7] selection:text-white pb-32">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center mb-16 md:mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800"
            alt="Cinematic Journey Hero"
            className="w-full h-full object-cover scale-105 filter brightness-[0.65]"
          />
          {/* Gradient to fade seamlessly into the ivory background */}
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-black/20 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center md:text-left pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-white/80 font-bold block mb-4">
              {locale === "id" ? "PENGALAMAN EKSKLUSIF" : "EDITORIAL TRAVEL EXPERIENCES"}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-normal text-white tracking-wide mb-8 leading-tight drop-shadow-sm">
              {t("journeys_title")}
            </h1>
            <p className="font-serif italic text-lg md:text-2xl text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
              {t("journeys_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Listing & Filter Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <ListingFilter 
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          totalCount={filteredJourneys.length}
        />
        
        {/* Asymmetric Grid Wrapper */}
        <div className="grid grid-cols-12 gap-y-24 md:gap-y-40 gap-x-8 md:gap-x-12 items-center min-h-[400px]">
          {filteredJourneys.length > 0 ? (
            filteredJourneys.map((journey, index) => (
              <JourneyCard key={journey.id} journey={journey} index={index} />
            ))
          ) : (
            <div className="col-span-12 text-center py-20">
              <p className="font-serif italic text-xl text-charcoal/50">
                {locale === "id" ? "Tidak ada perjalanan yang sesuai dengan filter Anda." : "No journeys match your selected filters."}
              </p>
              <button 
                onClick={() => {
                  setSelectedDestination("all");
                  setSelectedStyle("all");
                  setSelectedMonth("all");
                }}
                className="mt-6 font-mono text-[10px] tracking-widest uppercase text-[#0284C7] hover:text-[#0F2C59] underline underline-offset-4"
              >
                {locale === "id" ? "Reset Filter" : "Clear Filters"}
              </button>
            </div>
          )}
        </div>

        {/* Load More Continuation */}
        {filteredJourneys.length > 0 && (
          <div className="mt-32 pt-16 border-t border-charcoal/10 flex justify-center">
            <button className="group flex flex-col items-center space-y-4 text-charcoal hover:text-[#0284C7] transition-colors duration-300">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-semibold">
                {t("journeys_load_more")}
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="group-hover:translate-y-2 transition-transform duration-300">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" />
              </svg>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
