"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ListingFilter } from "@/components/journeys/ListingFilter";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { localizedJourneys } from "@/data/journeys";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function JourneysClient() {
  const { t, locale } = useLanguage();
  const [journeys, setJourneys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadJourneys() {
      try {
        const data = await apiFetch<any[]>("/admin/journeys").catch(() => []);
        if (data && Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((item: any) => {
            const statusLower = (item.status || "").toLowerCase();
            if (statusLower) {
              return statusLower !== "draft";
            }
            return item.isPublished !== false;
          });
          const formatted = filtered.map((item: any) => {
            const content = locale === "id" ? (item.contentId || item.contentID) : (item.contentEn || item.contentEN);
            const fallbackContent = item.contentId || item.contentID || item.contentEn || item.contentEN || {};
            const activeContent = content || fallbackContent;

            let formattedPrice = activeContent.price || item.priceRaw;
            if (formattedPrice) {
              const cleanNum = formattedPrice.replace(/[^0-9]/g, "");
              if (cleanNum && !formattedPrice.toLowerCase().includes("rp") && !formattedPrice.toLowerCase().includes("idr")) {
                const num = Number(cleanNum);
                if (num >= 1000) {
                  formattedPrice = `Rp ${num.toLocaleString("id-ID")}`;
                }
              }
            }
            if (!formattedPrice) {
              formattedPrice = "Hubungi Kami";
            }

            let durationLabel = (activeContent.durationLabel || "").trim();
            if (!durationLabel) {
              if (Array.isArray(activeContent.itinerary) && activeContent.itinerary.length > 0) {
                const days = activeContent.itinerary.length;
                durationLabel = days > 1 ? `${days} Hari ${days - 1} Malam` : `${days} Hari`;
              } else if (item.durationDays && Number(item.durationDays) > 0 && Number(item.durationDays) <= 100) {
                durationLabel = `${item.durationDays} Hari`;
              } else {
                durationLabel = "";
              }
            }

            let destName = activeContent.destination || item.destination || "";
            if (!destName) {
              const s = (item.slug || "").toLowerCase();
              if (s.includes("seoul") || s.includes("korea")) destName = "Korea";
              else if (s.includes("victoria") || s.includes("hongkong")) destName = "Hong Kong";
              else if (s.includes("komodo") || s.includes("bali")) destName = "Indonesia";
              else if (s.includes("tokyo") || s.includes("japan")) destName = "Jepang";
            }

            return {
              id: item.id,
              slug: item.slug,
              subSlug: item.slug,
              title: activeContent.title || item.slug,
              destination: destName,
              subtitle: activeContent.subtitle || "",
              durationDays: item.durationDays,
              durationLabel: durationLabel,
              dates: activeContent.dates || "",
              airline: activeContent.airline || "",
              price: formattedPrice,
              priceRaw: Number(item.priceRaw) || 0,
              travelMonth: activeContent.travelMonth || "",
              travelStyle: activeContent.travelStyle || "Tour",
              imageGradient: item.imageGradient || "from-[#38BDF8] to-[#0369A1]",
              image: item.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
              introHeading: activeContent.introHeading || "",
              introDescription: activeContent.introDescription || activeContent.subtitle || "",
              isPublished: true,
            };
          });
          setJourneys(formatted);
        } else {
          setJourneys([]);
        }
      } catch (err) {
        console.error("Failed to fetch journeys:", err);
        setJourneys([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadJourneys();
  }, [locale]);

  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // Dynamically derive unique destinations, styles, and months from published journeys
  const uniqueDestinations = Array.from(
    new Set(
      journeys
        .map((j) => j.destination)
        .filter((d) => typeof d === "string" && d.trim() !== "")
    )
  );

  const uniqueStyles = Array.from(
    new Set(
      journeys
        .map((j) => j.travelStyle)
        .filter((s) => typeof s === "string" && s.trim() !== "")
    )
  );

  const uniqueMonths = Array.from(
    new Set(
      journeys
        .map((j) => j.travelMonth)
        .filter((m) => typeof m === "string" && m.trim() !== "")
    )
  );

  const filteredJourneys = journeys.filter((j) => {
    // Status filter
    const matchStatus = j.isPublished !== false;

    // Destination filter
    const matchDest = selectedDestination === "all" || j.destination === selectedDestination;
      
    // Style filter
    const matchStyle = selectedStyle === "all" || j.travelStyle === selectedStyle;

    // Month filter
    const matchMonth = selectedMonth === "all" || j.travelMonth === selectedMonth;

    return matchStatus && matchDest && matchStyle && matchMonth;
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
              {locale === "id" ? "PENGALAMAN TERKURASI" : "EDITORIAL TRAVEL EXPERIENCES"}
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
          destinationsList={uniqueDestinations}
          stylesList={uniqueStyles}
          monthsList={uniqueMonths}
          totalCount={filteredJourneys.length}
        />
        
        {/* Asymmetric Grid Wrapper */}
        <div className="grid grid-cols-12 gap-y-24 md:gap-y-40 gap-x-8 md:gap-x-12 items-center min-h-[400px]">
          {isLoading ? (
            <div className="col-span-12 flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#0284C7] mb-3" size={32} />
              <span className="text-xs text-charcoal/60 font-mono tracking-widest uppercase">Memuat Perjalanan...</span>
            </div>
          ) : filteredJourneys.length > 0 ? (
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
        {!isLoading && filteredJourneys.length > 0 && (
          <div className="mt-32 pt-16 border-t border-charcoal/10 flex justify-center">
            <Link 
              href="/destinations" 
              className="group flex flex-col items-center space-y-4 text-charcoal hover:text-[#0284C7] transition-colors duration-300"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-semibold">
                {t("journeys_load_more")}
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="group-hover:translate-y-2 transition-transform duration-300">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
