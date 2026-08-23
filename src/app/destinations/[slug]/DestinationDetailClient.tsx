"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, Clock, Loader2, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";

const regionHeroImages: Record<string, string> = {
  indonesia: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2000",
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000",
  tailen: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000",
  vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000",
  korea: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000",
  china: "https://images.unsplash.com/photo-1547989453-11e67ffb3885?q=80&w=2000",
  swiss: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000",
  india: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000",
  others: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000",
};

const subDestinationImages: Record<string, string> = {
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
  bromo: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800",
  "labuan-bajo": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
  "raja-ampat": "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=800",
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

const defaultFeaturedImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000";

interface DestinationDetailClientProps {
  slug: string;
}

export function DestinationDetailClient({ slug }: DestinationDetailClientProps) {
  const { locale } = useLanguage();
  const [region, setRegion] = useState<RegionDestination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openTripsMap, setOpenTripsMap] = useState<Record<string, { status?: string; price?: string; duration?: string; image?: string }>>({});
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatRupiah = (value: string): string => {
    const numberString = value.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    const num = parseInt(numberString, 10);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num).replace(/IDR/g, "Rp").trim();
  };

  const parseNumericPrice = (priceStr?: string): number | null => {
    if (!priceStr) return null;
    const cleanStr = priceStr.replace(/[^0-9]/g, "");
    if (!cleanStr) return null;
    const val = parseInt(cleanStr, 10);
    return isNaN(val) ? null : val;
  };

  const filteredSubDestinations = region
    ? region.subDestinations.filter((sub) => {
        const otInfo = openTripsMap[sub.slug.toLowerCase()];
        const priceNum = parseNumericPrice(otInfo?.price);

        if (minPriceInput) {
          const minVal = parseInt(minPriceInput, 10);
          if (!isNaN(minVal) && (priceNum === null || priceNum < minVal)) {
            return false;
          }
        }

        if (maxPriceInput) {
          const maxVal = parseInt(maxPriceInput, 10);
          if (!isNaN(maxVal) && (priceNum === null || priceNum > maxVal)) {
            return false;
          }
        }

        return true;
      })
    : [];

  useEffect(() => {
    async function loadRegion() {
      try {
        const data = await apiFetch<any>(`/destinations/${slug}?locale=${locale}`).catch(() => null);
        if (data) {
          let gradient = data.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
          let image = "";
          if (gradient.includes("||")) {
            const parts = gradient.split("||");
            gradient = parts[0];
            image = parts[1];
          }

          const subDestinations = (data.subDestinations || []).map((s: any) => {
            let subName = s.name || s.nameId || s.nameEn || "";
            let subImage = "";
            if (subName.includes("||")) {
              const parts = subName.split("||");
              subName = parts[0];
              subImage = parts[1];
            }
            return {
              name: subName,
              slug: s.slug,
              image: subImage
            };
          });

          // Fetch open trips to match seat capacity
          const openTrips = await apiFetch<any[]>(`/open-trips?locale=${locale}`).catch(() => []);
          if (Array.isArray(openTrips)) {
            const map: Record<string, any> = {};
            openTrips.forEach((ot) => {
              const c = locale === "en" ? ot.contentEn : ot.contentId;
              const otSubSlug = (c?.subSlug || ot.subSlug || ot.slug || "").toLowerCase();
              if (otSubSlug) {
                map[otSubSlug] = {
                  status: c?.status || ot.status || "Available",
                  price: c?.price || ot.price,
                  duration: c?.duration || ot.duration,
                  image: ot.featuredImage || ot.image || c?.featuredImage || c?.image,
                };
              }
            });
            setOpenTripsMap(map);
          }

          setRegion({
            id: data.id || data.key || data.slug,
            name: data.name ? data.name.split("||")[0] : data.slug,
            slug: data.slug,
            subtitle: data.subtitle || "",
            featuredImageGradient: gradient,
            image: image || regionHeroImages[data.slug] || regionHeroImages[data.key] || defaultFeaturedImage,
            subDestinations
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("DestinationDetailClient: Failed to load region", err);
      }

      // Fallback
      const staticRegion = localizedRegions[locale].find((r) => r.slug === slug) || null;
      setRegion(staticRegion);
      setIsLoading(false);
    }
    loadRegion();
  }, [slug, locale]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-[#0F2C59] mb-4">Destination Not Found</h2>
        <Link href="/destinations" className="text-[#0284C7] hover:underline font-medium text-sm">
          Return to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-foreground min-h-screen font-sans selection:bg-[#A89053] selection:text-white">
      {/* Cinematic Hero */}
      <section className="relative w-full h-screen overflow-hidden">
        {region.image ? (
          <img 
            src={region.image} 
            alt={region.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : regionHeroImages[region.slug] ? (
          <img 
            src={regionHeroImages[region.slug]} 
            alt={region.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-tr ${region.featuredImageGradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60 z-[1]" />
        <div className="absolute inset-0 bg-black/25 z-[1]" />
        <div className="absolute inset-0 image-texture opacity-35 mix-blend-overlay z-[2]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-16 z-[3]">
          <h1 className="font-serif text-5xl md:text-8xl text-white font-normal tracking-wider mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {region.name.toUpperCase()}
          </h1>
          <p className="font-sans text-sm md:text-lg text-white max-w-2xl font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {region.subtitle}
          </p>
        </div>
      </section>

      {/* Explore Sub-Destinations / Carousel Section */}
      <main className="w-full">
        {/* Top Header & Filter Pills */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-8 text-left flex flex-col items-start w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-[#0F2C59] mb-4 tracking-tight">
            Explore {region.name}
          </h2>
          <p className="font-sans text-[#0F2C59]/70 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
            Ready to start your own getaway in {region.name}? From legendary history to award-winning nature, {region.name} has so much to explore.
          </p>

          {/* Premium Minimalist Price Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full border-t border-[#0F2C59]/10 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#0F2C59] flex items-center gap-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#0284C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {locale === "id" ? "Filter Harga:" : "Filter Price:"}
              </span>

              <div className="relative">
                <input
                  type="text"
                  value={minPriceInput ? formatRupiah(minPriceInput) : ""}
                  onChange={(e) => setMinPriceInput(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={locale === "id" ? "Harga Min (Rp)" : "Min Price (Rp)"}
                  className="bg-white border border-[#0F2C59]/15 rounded-xl px-4 py-2.5 text-[#0F2C59] font-sans text-xs focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] w-44 transition-all placeholder:text-[#0F2C59]/40 shadow-sm"
                />
              </div>

              <span className="text-xs text-[#0F2C59]/40 font-medium">—</span>

              <div className="relative">
                <input
                  type="text"
                  value={maxPriceInput ? formatRupiah(maxPriceInput) : ""}
                  onChange={(e) => setMaxPriceInput(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={locale === "id" ? "Harga Max (Rp)" : "Max Price (Rp)"}
                  className="bg-white border border-[#0F2C59]/15 rounded-xl px-4 py-2.5 text-[#0F2C59] font-sans text-xs focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] w-44 transition-all placeholder:text-[#0F2C59]/40 shadow-sm"
                />
              </div>

              {(minPriceInput || maxPriceInput) && (
                <button
                  onClick={() => {
                    setMinPriceInput("");
                    setMaxPriceInput("");
                  }}
                  className="font-sans font-bold text-[11px] uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 cursor-pointer flex items-center justify-center shrink-0"
                >
                  {locale === "id" ? "HAPUS FILTER" : "CLEAR FILTER"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="w-full pb-24 relative overflow-hidden">
          
          <div className="max-w-[1600px] mx-auto relative">
            
            {/* Left/Right Buttons */}
            {filteredSubDestinations.length > 2 && (
              <div className="absolute left-2 md:left-8 top-[35%] -translate-y-1/2 z-20 pointer-events-none w-full max-w-[1600px] flex justify-between px-2 md:px-0">
                <button 
                  onClick={scrollLeft}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white border border-[#0F2C59]/10 rounded-full flex items-center justify-center text-[#0F2C59] shadow-md hover:bg-gray-50 transition-colors pointer-events-auto shrink-0"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </button>
                <button 
                  onClick={scrollRight}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white border border-[#0F2C59]/10 rounded-full flex items-center justify-center text-[#0F2C59] shadow-md hover:bg-gray-50 transition-colors pointer-events-auto shrink-0 mr-4 md:mr-16"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </button>
              </div>
            )}

            {filteredSubDestinations.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-[#0F2C59]/10 rounded-3xl shadow-sm">
                <p className="font-sans text-[#0F2C59]/60 text-sm mb-6 leading-relaxed">
                  {locale === "id"
                    ? "Tidak ada paket tour yang sesuai dengan filter harga Anda."
                    : "No tour packages found matching your price criteria."}
                </p>
                <button
                  onClick={() => {
                    setMinPriceInput("");
                    setMaxPriceInput("");
                  }}
                  className="bg-[#0F2C59] hover:bg-[#0284C7] text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-full shadow-md transition-all cursor-pointer inline-block"
                >
                  {locale === "id" ? "RESET FILTER" : "RESET FILTER"}
                </button>
              </div>
            ) : (
              /* Sub-Destinations Grid/Carousel Container */
              <div 
                ref={scrollContainerRef}
                className={
                  filteredSubDestinations.length <= 2
                    ? "flex flex-wrap justify-start gap-6 md:gap-8 pb-8 px-6 md:px-12 max-w-7xl mx-auto"
                    : "grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[50vw] md:auto-cols-[35vw] lg:auto-cols-[25vw] overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-none no-scrollbar scroll-smooth px-6 md:px-12 max-w-7xl mx-auto"
                }
              >
                {filteredSubDestinations.map((sub, idx) => {
                  const mockImages = [
                    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800",
                    "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
                    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800",
                  ];
                  const otInfo = openTripsMap[sub.slug.toLowerCase()];
                  const image = otInfo?.image || sub.image || subDestinationImages[sub.slug] || mockImages[idx % mockImages.length];

                  return (
                    <Link 
                      href={`/destinations/${region.slug}/${sub.slug}`}
                      key={sub.slug || idx} 
                      className={`snap-start shrink-0 flex flex-col group cursor-pointer ${
                        filteredSubDestinations.length <= 2 ? "w-full max-w-sm" : "w-full"
                      }`}
                    >
                      {/* Card Image */}
                      <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden mb-6 bg-charcoal shadow-md border border-slate-100">
                        <img 
                          src={image} 
                          alt={sub.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        
                        <div className="absolute bottom-0 left-0 bg-[#0284C7] text-white text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider px-4 md:px-5 py-2 md:py-2.5">
                          {locale === "id" ? "PAKET TOUR" : "TOUR PACKAGE"}
                        </div>

                        {otInfo?.status && (
                          <div className={`absolute top-3 right-3 backdrop-blur-md border text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 ${
                            otInfo.status === "Closed" || otInfo.status === "inactive"
                              ? "bg-rose-950/80 text-rose-200 border-rose-500/30"
                              : otInfo.status === "Draft" || otInfo.status === "draft"
                              ? "bg-slate-900/80 text-slate-300 border-slate-700"
                              : "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              otInfo.status === "Closed" || otInfo.status === "inactive" ? "bg-rose-400" : "bg-emerald-400"
                            }`} />
                            <span>{otInfo.status.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Card Text */}
                      <h3 className="font-sans font-bold text-lg md:text-xl text-[#0F2C59] leading-snug mb-2 group-hover:text-[#0284C7] transition-colors pr-4">
                        {locale === "id" ? `Paket Tour ${sub.name}` : `${sub.name} Tour Package`}
                      </h3>

                      {otInfo?.price && (
                        <p className="font-sans font-bold text-sm md:text-base text-[#0284C7] mb-3">
                          {(() => {
                            const trimmed = otInfo.price.trim();
                            if (/^(mulai|from|rp|usd|idr)/i.test(trimmed)) {
                              return trimmed;
                            }
                            return locale === "en" ? `From Rp ${trimmed}` : `Mulai Rp ${trimmed}`;
                          })()}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-[#0F2C59]/80 font-sans text-xs md:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                        <span>{locale === "id" ? "Tersedia beberapa tanggal keberangkatan" : "Multiple departure dates available"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* View All Button */}
            <div className="mt-16 text-center">
              <Link 
                href="/destinations"
                className="inline-block bg-transparent text-[#0F2C59] font-sans text-xs md:text-sm font-bold uppercase tracking-widest py-4 md:py-5 px-8 md:px-12 rounded-full border border-[#0F2C59] hover:bg-[#0F2C59]/5 transition-colors duration-300"
              >
                {locale === "id" ? "LIHAT SEMUA DESTINASI" : "CHECK ALL DESTINATIONS"}
              </Link>
            </div>
            
          </div>
        </div>

        {/* Booking / CTA Section */}
        <div className="w-full bg-[#0F2C59] text-white py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0284C7]/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            <span className="text-[#38BDF8] font-sans text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
              {locale === "id" ? "Mulai Petualangan Anda" : "Start Your Adventure"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal tracking-wide mb-6">
              {locale === "id" ? `Rencanakan Liburan ke ${region.name}` : `Plan a Holiday to ${region.name}`}
            </h2>
            <p className="font-sans text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              {locale === "id" 
                ? `Dapatkan paket tour eksklusif, rekomendasi akomodasi terbaik, dan itinerary yang disesuaikan khusus untuk Anda. Konsultasikan impian liburan Anda bersama Klik Travel ID.`
                : `Get exclusive tour packages, top accommodation recommendations, and customized itineraries tailored just for you. Consult your dream vacation with Klik Travel ID.`}
            </p>
            
            <a 
              href={`https://wa.me/6281230011027?text=${encodeURIComponent(
                locale === "id"
                  ? `Halo Klik Travel ID, saya tertarik untuk merencanakan liburan ke ${region.name}. Mohon informasi paket tour dan ketersediaannya.`
                  : `Hello Klik Travel ID, I am interested in planning a vacation to ${region.name}. Please provide details on tour packages and availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-8 md:px-10 rounded-full font-sans font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(18,140,126,0.4)] hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              <span>{locale === "id" ? "Pesan via WhatsApp" : "Book via WhatsApp"}</span>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
