"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, AlertTriangle } from "lucide-react";

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

const defaultFeaturedImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000";

export function DestinationsClient() {
  const { t, locale } = useLanguage();
  const [regions, setRegions] = useState<RegionDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function loadRegions() {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
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
              let subName = s.name || s.nameId || s.nameEn || "";
              if (subName.includes("||")) {
                subName = subName.split("||")[0];
              }
              return {
                name: subName,
                slug: s.slug
              };
            });

            return {
              id: r.id || r.key || r.slug,
              name: r.name ? r.name.split("||")[0] : r.slug,
              slug: r.slug,
              subtitle: r.subtitle || "",
              featuredImageGradient: gradient,
              image: image || regionHeroImages[r.slug] || regionHeroImages[r.key] || defaultFeaturedImage,
              subDestinations
            };
          });
          setRegions(mapped);
          setIsLoading(false);
          return;
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error("DestinationsClient: Failed to load regions", err);
        setIsError(true);
      }
      setRegions([]);
      setIsLoading(false);
    }
    loadRegions();
  }, [locale]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % regions.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + regions.length) % regions.length);
  };

  const currentRegion = regions[activeIndex];

  // Animation variants for the card transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="bg-ivory text-foreground min-h-screen font-sans selection:bg-[#A89053] selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Decorative atmospheric background blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-200/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none z-0" />

      <main className="pt-32 pb-24 relative z-10 flex-1 flex flex-col justify-center">
        {/* Intro Banner */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-10 shrink-0">
          <span className="font-mono text-xs uppercase tracking-[0.3em] font-semibold text-[#0284C7] block mb-3">
            Nusantara Terkurasi
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0F2C59] tracking-tight mb-6">
            DESTINASI
          </h1>
          <p className="font-sans italic text-base md:text-lg text-[#0F2C59]/80 font-light leading-relaxed max-w-xl mx-auto px-4">
            &ldquo;Indonesia bukanlah satu destinasi. Ini adalah ribuan cara untuk mengembara.&rdquo;
          </p>
        </section>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError || regions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto shrink-0">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 border border-amber-100 shadow-sm animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <h2 className="font-serif text-2xl text-[#0F2C59] mb-3 font-semibold leading-tight">
              {locale === "id" ? "Layanan Sedang Pemeliharaan" : "Service Under Maintenance"}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              {locale === "id" 
                ? "Kami sedang melakukan pemeliharaan sistem berkala untuk meningkatkan kualitas layanan. Silakan coba kembali dalam beberapa saat." 
                : "We are currently performing scheduled system maintenance to improve our services. Please check back in a few moments."}
            </p>
          </div>
        ) : currentRegion ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6 space-y-8">
            
            {/* Horizontal Slider Area */}
            <div className="relative w-full flex items-center justify-center">
              
              {/* Navigation Left */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:left-4 z-20 p-3 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-lg border border-slate-100 hover:scale-105 transition-all cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Central Card Wrapper */}
              <div className="w-full max-w-md aspect-[4/5] sm:aspect-[4/5] rounded-[36px] overflow-hidden relative shadow-2xl border border-charcoal/5 flex items-center justify-center bg-slate-50">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full cursor-pointer group"
                  >
                    <Link href={`/destinations/${currentRegion.slug}`} className="block w-full h-full">
                      <img 
                        src={currentRegion.image || defaultFeaturedImage} 
                        alt={currentRegion.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-widest drop-shadow-lg text-center uppercase">
                          {currentRegion.name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Right */}
              <button
                onClick={handleNext}
                className="absolute right-0 md:right-4 z-20 p-3 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-lg border border-slate-100 hover:scale-105 transition-all cursor-pointer backdrop-blur-sm"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Bottom details dynamically animated */}
            <div className="text-center space-y-3 max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <p className="font-sans text-xs md:text-sm text-foreground/50 tracking-wider uppercase font-medium">
                    {currentRegion.subtitle}
                  </p>
                  
                  <Link 
                    href={`/destinations/${currentRegion.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#A89053] hover:text-[#A89053]/85 transition-colors font-bold mt-1 group"
                  >
                    <span>JELAJAHI PERJALANAN</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Navigation Dot Ribbon */}
            <div className="flex items-center gap-2 pt-2">
              {regions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex 
                      ? "w-8 bg-[#A89053]" 
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  title={regions[idx].name}
                />
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-slate-500">No destinations found</p>
          </div>
        )}
      </main>
    </div>
  );
}

