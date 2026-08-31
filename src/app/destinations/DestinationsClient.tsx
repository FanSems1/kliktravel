"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Compass } from "lucide-react";

const regionHeroImages: Record<string, string> = {
  indonesia: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2000",
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000",
  tailen: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000",
  vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000",
  korea: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000",
  china: "https://images.unsplash.com/photo-1547989453-11e67ffb3885?q=80&w=2000",
  hongkong: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=2000",
  swiss: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000",
  india: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000",
  others: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000",
};

const defaultFeaturedImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000";

const subDestinationImages: Record<string, string> = {
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
  bromo: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800",
  "labuan-bajo": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
  "raja-ampat": "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=800",
  bintan: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800",
  phuket: "https://images.unsplash.com/photo-1581023773539-755d78a8bc84?q=80&w=800",
  "chiang-mai": "https://images.unsplash.com/photo-1590243455953-62588147dff5?q=80&w=800",
  hanoi: "https://images.unsplash.com/photo-1596766468761-db1d5f2a1b94?q=80&w=800",
  "ho-chi-minh": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800",
  "da-nang": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800",
  seoul: "https://images.unsplash.com/photo-1538678235213-982eb4b7261a?q=80&w=800",
  busan: "https://images.unsplash.com/photo-1601627918341-a67b93df2bb5?q=80&w=800",
  jeju: "https://images.unsplash.com/photo-1582862908861-122e23b2dc0b?q=80&w=800",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
  osaka: "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=800",
  beijing: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=800",
  shanghai: "https://images.unsplash.com/photo-1474181487882-5abf3f016c2d?q=80&w=800",
  chengdu: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6858f?q=80&w=800",
  jaipur: "https://images.unsplash.com/photo-1599661559875-1dc9a9b24479?q=80&w=800",
  europe: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800",
  america: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800",
  hongkong: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=800",
  macau: "https://images.unsplash.com/photo-1558285516-f002a281d2a5?q=80&w=800",
  shenzhen: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?q=80&w=800",
};

export function DestinationsClient() {
  const { t, locale } = useLanguage();
  const [regions, setRegions] = useState<RegionDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openTripsMap, setOpenTripsMap] = useState<Record<string, { image?: string }>>({});
  const itemsPerPage = 9;

  const isIndo = locale === "id";

  useEffect(() => {
    async function loadRegions() {
      setIsLoading(true);
      const fallbacks = localizedRegions[locale === "en" ? "en" : "id"] || localizedRegions.id;
      
      try {
        const [data, dataEn] = await Promise.all([
          apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null),
          locale !== "en" ? apiFetch<any[]>(`/destinations?locale=en`).catch(() => []) : Promise.resolve(null)
        ]);

        // Fetch open trips and journeys to match sub-destinations featured images dynamically
        const [openTrips, journeys] = await Promise.all([
          apiFetch<any[]>(`/open-trips?locale=${locale}`).catch(() => []),
          apiFetch<any[]>(`/journeys?locale=${locale}`).catch(() => [])
        ]);

        const combinedTrips = [
          ...(openTrips && Array.isArray(openTrips) ? openTrips : []),
          ...(journeys && Array.isArray(journeys) ? journeys : [])
        ];

        const otMap: Record<string, { image?: string }> = {};
        if (combinedTrips.length > 0) {
          combinedTrips.forEach((ot) => {
            const cId = ot.contentId || ot.contentID || {};
            const cEn = ot.contentEn || ot.contentEN || {};
            const c = locale === "en" ? (Object.keys(cEn).length > 0 ? cEn : cId) : (Object.keys(cId).length > 0 ? cId : cEn);
            
            const otSubSlug = (ot.subSlug || c?.subSlug || cId?.subSlug || cEn?.subSlug || ot.slug || "").toLowerCase();
            const otImage = ot.featuredImage || ot.image || c?.featuredImage || c?.image || cId?.featuredImage || cEn?.featuredImage || "";

            if (otSubSlug) {
              otMap[otSubSlug] = {
                image: otImage,
              };
            }
          });
          setOpenTripsMap(otMap);
        }

        const imageMap: Record<string, string> = {};
        if (dataEn && Array.isArray(dataEn)) {
          dataEn.forEach((r: any) => {
            const enSubs = r.subDestinations || [];
            enSubs.forEach((s: any) => {
              const nameFields = [s.name, s.nameId, s.nameEn].filter(Boolean);
              const fieldWithImage = nameFields.find((n: string) => typeof n === "string" && n.includes("||"));
              if (fieldWithImage) {
                const parts = fieldWithImage.split("||");
                imageMap[s.slug] = parts[1];
              }
            });
          });
        }

        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: RegionDestination[] = data.map((r) => {
            let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
            let image = "";
            if (gradient.includes("||")) {
              const parts = gradient.split("||");
              gradient = parts[0];
              image = parts[1];
            }

            const subDestinations = (r.subDestinations || []).map((s: any) => {
              let subName = "";
              let subImage = imageMap[s.slug] || "";

              const nameFields = [s.name, s.nameId, s.nameEn].filter(Boolean);
              const fieldWithImage = nameFields.find((n: string) => typeof n === "string" && n.includes("||"));
              if (fieldWithImage) {
                const parts = fieldWithImage.split("||");
                if (!subImage) {
                  subImage = parts[1];
                }
              }

              const localeName = locale === "en" 
                ? (s.nameEn || s.nameId || s.name || "") 
                : (s.nameId || s.nameEn || s.name || "");
              subName = localeName.split("||")[0].trim();

              return {
                name: subName,
                slug: s.slug,
                image: subImage || s.image || ""
              };
            });

            return {
              id: r.id || r.key || r.slug,
              name: r.name ? r.name.split("||")[0] : r.slug,
              slug: r.slug,
              subtitle: r.subtitle || "",
              featuredImageGradient: gradient,
              image: image || regionHeroImages[r.slug?.toLowerCase()] || regionHeroImages[r.key?.toLowerCase()] || defaultFeaturedImage,
              subDestinations
            };
          });
          setRegions(mapped);
        } else {
          // Use fallback localized regions if API returns empty
          const mappedFallbacks = fallbacks.map(f => ({
            ...f,
            image: f.image || regionHeroImages[f.slug?.toLowerCase()] || defaultFeaturedImage
          }));
          setRegions(mappedFallbacks);
        }
      } catch (err) {
        console.error("DestinationsClient: Failed to load regions", err);
        const mappedFallbacks = fallbacks.map(f => ({
          ...f,
          image: f.image || regionHeroImages[f.slug?.toLowerCase()] || defaultFeaturedImage
        }));
        setRegions(mappedFallbacks);
      } finally {
        setIsLoading(false);
      }
    }

    loadRegions();
  }, [locale]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(regions.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRegions = regions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen font-sans flex flex-col justify-between selection:bg-[#0284C7] selection:text-white">
      <main className="pb-24 flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[55vh] md:h-[65vh] flex items-center mb-16 bg-slate-900 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000" 
              alt="Destinasi Wisata Pilihan" 
              className="w-full h-full object-cover object-center scale-105 select-none"
            />
            {/* Elegant Double Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          </div>

          {/* Hero Content aligned exactly like in the picture */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16">
            <div className="max-w-3xl text-left">
              <span className="typography-caption !text-white/90 block mb-3">
                {isIndo ? "JELAJAHI DUNIA BERSAMA KAMI" : "EXPLORE THE WORLD WITH US"}
              </span>
              <h1 className="typography-hero !text-white tracking-wide mb-5 drop-shadow-md">
                {isIndo ? "Destinasi Wisata Pilihan" : "Curated Destinations"}
              </h1>
              <p className="typography-body !text-white/95 !italic max-w-2xl">
                {isIndo 
                  ? "Temukan keindahan tak terbatas dari berbagai belahan nusantara hingga destinasi internasional impian Anda." 
                  : "Discover infinite beauty from exotic archipelago gems to your dream international getaways."}
              </p>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <section className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                {isIndo ? "Memuat Destinasi..." : "Loading Destinations..."}
              </p>
            </div>
          ) : (
            <>
              {/* Section Header above Cards */}
              <div className="mb-12 text-center md:text-left">
                <span className="typography-caption !text-[#0284C7] block mb-2">
                  {isIndo ? "PENGALAMAN TERKURASI" : "CURATED EXPERIENCES"}
                </span>
                <h2 className="typography-section text-[#0F2C59] tracking-tight mb-3">
                  {isIndo ? "Pilih Destinasi Impian Anda" : "Choose Your Dream Destination"}
                </h2>
                <p className="typography-body text-slate-500 max-w-2xl">
                  {isIndo 
                    ? "Temukan berbagai pilihan paket open trip dan private tour eksklusif di lokasi-lokasi terpopuler dunia." 
                    : "Discover a wide selection of exclusive open trips and private tours in the world's most popular locations."}
                </p>
              </div>

              {/* 3-Column Responsive Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {currentRegions.map((region) => (
                    <div
                      key={region.id}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                    >
                      {/* Image Thumbnail Header */}
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <img
                          src={region.image || defaultFeaturedImage}
                          alt={region.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        {/* Sub-destinations Badge */}
                        {region.subDestinations && region.subDestinations.length > 0 && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-sm flex items-center gap-1.5">
                            <MapPin size={12} className="text-[#0284C7]" />
                            <span className="font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                              {region.subDestinations.length} {isIndo ? "Lokasi" : "Spots"}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-6 right-6">
                          <h2 className="typography-card !text-white uppercase tracking-wide drop-shadow-md">
                            {region.name}
                          </h2>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <p className="typography-body text-slate-600 line-clamp-3">
                          {region.subtitle}
                        </p>

                        {/* Sub-destinations Highlights: Interactive Mini-Card Slider */}
                        {region.subDestinations && region.subDestinations.length > 0 && (
                          <div className="space-y-2.5 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                                <Compass size={12} className="text-[#0284C7]" />
                                {isIndo ? "Sorotan Destinasi:" : "Destination Highlights:"}
                              </span>
                              <span className="font-mono text-[9px] text-[#0284C7] font-semibold">
                                {region.subDestinations.length} {isIndo ? "Spot" : "Spots"}
                              </span>
                            </div>

                            {/* Mini Visual Cards Horizontal Slider */}
                            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar snap-x snap-mandatory -mx-1 px-1">
                              {region.subDestinations.map((sub, idx) => {
                                const otInfo = openTripsMap[sub.slug?.toLowerCase() || ""];
                                const spotImage = otInfo?.image || sub.image || "";

                                return (
                                  <Link
                                    key={idx}
                                    href={`/destinations/${region.slug}/${sub.slug}`}
                                    className="group/spot shrink-0 w-[125px] aspect-[4/3] rounded-xl overflow-hidden relative shadow-sm border border-slate-200/80 bg-slate-900 snap-start transition-transform duration-300 hover:scale-[1.03] flex items-center justify-center"
                                  >
                                    {spotImage ? (
                                      <img
                                        src={spotImage}
                                        alt={sub.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover/spot:scale-110 transition-transform duration-500 opacity-90"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE] to-[#7DD3FC] flex items-center justify-center p-2 text-center">
                                        <span className="text-[#0F2C59]/40 font-sans text-[8px] uppercase tracking-wider font-bold">
                                          TBA
                                        </span>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                                      <span className="font-sans text-[10px] font-bold text-white leading-tight uppercase tracking-tight block truncate drop-shadow-sm group-hover/spot:text-[#38BDF8] transition-colors">
                                        {sub.name}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Card CTA Link */}
                        <div className="pt-4 border-t border-slate-100">
                          <Link
                            href={`/destinations/${region.slug}`}
                            className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-slate-50 hover:bg-[#0284C7] text-slate-700 hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-all group/btn"
                          >
                            <span>{isIndo ? "Jelajahi Perjalanan" : "Explore Journeys"}</span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Sleek Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-16 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Item counter */}
                  <span className="font-mono text-xs text-slate-500 font-medium">
                    {isIndo 
                      ? `Menampilkan ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, regions.length)} dari ${regions.length} Destinasi`
                      : `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, regions.length)} of ${regions.length} Destinations`}
                  </span>

                  {/* Page Controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      title={isIndo ? "Sebelumnya" : "Previous"}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                            pageNum === currentPage
                              ? "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      title={isIndo ? "Selanjutnya" : "Next"}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
