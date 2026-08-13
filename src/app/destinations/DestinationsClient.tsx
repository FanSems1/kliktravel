"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";
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

const defaultFeaturedImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2000";

export function DestinationsClient() {
  const { t, locale } = useLanguage();
  const [regions, setRegions] = useState<RegionDestination[]>(localizedRegions[locale] || []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRegions() {
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
        }
      } catch (err) {
        console.error("DestinationsClient: Failed to load regions", err);
      }
      setRegions(localizedRegions[locale] || []);
      setIsLoading(false);
    }
    loadRegions();
  }, [locale]);

  // Dynamically partition regions into the editorial grid layout
  const indonesiaRegion = regions.find((r) => r.slug === "indonesia") || regions[0];
  const otherRegions = regions.filter((r) => r.id !== indonesiaRegion?.id);

  const row2Left = otherRegions[0];
  const row2Right = otherRegions[1];
  const row3Banner = otherRegions[2];
  const row4Left = otherRegions[3];
  const row4Right = otherRegions[4];
  const remainingRegions = otherRegions.slice(5);

  return (
    <div className="bg-ivory text-foreground min-h-screen font-sans selection:bg-[#A89053] selection:text-white relative overflow-hidden">
      {/* Decorative atmospheric background blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-3xl pointer-events-none z-0" />

      <main className="pt-32 pb-32 relative z-10">
        {/* Intro Banner */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-24 md:mb-36">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/60 font-semibold block mb-4">
            {t("destinations_page_tag")}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-foreground tracking-wide mb-6">
            {t("destinations_page_heading")}
          </h1>
          <p className="font-serif italic text-lg md:text-2xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {t("destinations_page_quote")}
          </p>
        </section>

        {/* Asymmetric Editorial Destinations Section */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 space-y-24 md:space-y-36">
          
          {/* Row 1: Primary Hero (Centered Card) */}
          {indonesiaRegion && (
            <div className="flex justify-center">
              <Link 
                href={`/destinations/${indonesiaRegion.slug}`}
                className="group w-full max-w-xl block text-center cursor-pointer"
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                  <img src={indonesiaRegion.image || defaultFeaturedImage} alt={indonesiaRegion.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-4xl md:text-6xl text-white font-normal tracking-wide drop-shadow-md group-hover:tracking-widest transition-all duration-500">
                      {indonesiaRegion.name.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-sans text-xs md:text-sm text-foreground/60 tracking-widest uppercase font-light">
                    {indonesiaRegion.subtitle}
                  </p>
                  <span className="inline-block font-mono text-[9px] tracking-[0.3em] uppercase text-[#A89053] mt-2 group-hover:translate-x-1 transition-transform">
                    {t("destinations_explore_journeys")}
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Row 2: Secondary Left & Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            {row2Left && (
              <Link
                href={`/destinations/${row2Left.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                  <img src={row2Left.image || defaultFeaturedImage} alt={row2Left.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="font-serif text-3xl md:text-5xl text-white font-normal block mb-2">
                      {row2Left.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80 line-clamp-1">
                      {row2Left.subDestinations.map(s => s.name).join(" • ")}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {row2Right && (
              <Link
                href={`/destinations/${row2Right.slug}`}
                className="md:col-span-6 group block cursor-pointer md:mt-16"
              >
                <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                  <img src={row2Right.image || defaultFeaturedImage} alt={row2Right.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="font-serif text-3xl md:text-5xl text-white font-normal block mb-2">
                      {row2Right.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80 line-clamp-1">
                      {row2Right.subDestinations.map(s => s.name).join(" • ")}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Row 3: Large Wide Banner */}
          {row3Banner && (
            <Link
              href={`/destinations/${row3Banner.slug}`}
              className="group block cursor-pointer"
            >
              <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] border border-charcoal/10">
                <img src={row3Banner.image || defaultFeaturedImage} alt={row3Banner.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                  <span className="font-serif text-3xl md:text-6xl text-white font-normal tracking-wide mb-3">
                    {row3Banner.name.toUpperCase()}
                  </span>
                  <p className="font-sans text-xs md:text-sm text-white/80 tracking-widest uppercase font-light max-w-lg line-clamp-2">
                    {row3Banner.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Row 4: Two grid items */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            {row4Left && (
              <Link
                href={`/destinations/${row4Left.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                  <img src={row4Left.image || defaultFeaturedImage} alt={row4Left.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="font-serif text-3xl text-white font-normal block mb-1">
                      {row4Left.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80 line-clamp-1">
                      {row4Left.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {row4Right && (
              <Link
                href={`/destinations/${row4Right.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                  <img src={row4Right.image || defaultFeaturedImage} alt={row4Right.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="font-serif text-3xl text-white font-normal block mb-1">
                      {row4Right.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80 line-clamp-1">
                      {row4Right.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Row 5: Remaining Regions */}
          {remainingRegions.length > 0 && (
            <div className="pt-12 border-t border-charcoal/10">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block text-center mb-12">
                {t("destinations_uncharted")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {remainingRegions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/destinations/${region.slug}`}
                    className="group block cursor-pointer"
                  >
                    <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10">
                      <img src={region.image || defaultFeaturedImage} alt={region.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
                      <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <span className="font-serif text-3xl text-white font-normal block mb-2">
                          {region.name}
                        </span>
                        <p className="font-sans text-xs text-white/80 leading-relaxed font-light mb-4 line-clamp-2">
                          {region.subtitle}
                        </p>
                        <span className="inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89053] font-semibold group-hover:translate-x-1 transition-transform">
                          DISCOVER →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
