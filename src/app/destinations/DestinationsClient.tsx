"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { localizedRegions } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";

export function DestinationsClient() {
  const { t, locale } = useLanguage();
  const regions = localizedRegions[locale];

  const indonesia = regions.find((r) => r.id === "indonesia");
  const thailand = regions.find((r) => r.id === "thailand");
  const vietnam = regions.find((r) => r.id === "vietnam");
  const japan = regions.find((r) => r.id === "japan");
  const korea = regions.find((r) => r.id === "korea");
  const china = regions.find((r) => r.id === "china");
  const remainingRegions = regions.filter(
    (r) => !["indonesia", "thailand", "vietnam", "japan", "korea", "china"].includes(r.id)
  );

  const regionHeroImages: Record<string, string> = {
    indonesia: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2000",
    thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000",
    vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000",
    korea: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000",
    japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000",
    china: "https://images.unsplash.com/photo-1508804185872-d7bad1006fc5?q=80&w=2000",
    india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000",
    others: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000",
  };

  return (
    <div className="bg-ivory text-foreground min-h-screen font-sans selection:bg-[#A89053] selection:text-white">
      <main className="pt-32 pb-32">
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
          
          {/* Row 1: INDONESIA (Centered Medium Card) */}
          {indonesia && (
            <div className="flex justify-center">
              <Link 
                href={`/destinations/${indonesia.slug}`}
                className="group w-full max-w-xl block text-center cursor-pointer"
              >
                <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10`}>
                  <img src={regionHeroImages[indonesia.slug]} alt={indonesia.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-4xl md:text-6xl text-white font-normal tracking-wide drop-shadow-md group-hover:tracking-widest transition-all duration-500">
                      {indonesia.name.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-sans text-xs md:text-sm text-foreground/60 tracking-widest uppercase font-light">
                    {indonesia.subtitle}
                  </p>
                  <span className="inline-block font-mono text-[9px] tracking-[0.3em] uppercase text-[#A89053] mt-2 group-hover:translate-x-1 transition-transform">
                    {t("destinations_explore_journeys")}
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Row 2: THAILAND (Left) & VIETNAM (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            {thailand && (
              <Link
                href={`/destinations/${thailand.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className={`w-full aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10`}>
                  <img src={regionHeroImages[thailand.slug]} alt={thailand.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-8 left-8">
                    <span className="font-serif text-3xl md:text-5xl text-white font-normal block mb-2">
                      {thailand.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80">
                      {thailand.subDestinations.map(s => s.name).join(" • ")}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {vietnam && (
              <Link
                href={`/destinations/${vietnam.slug}`}
                className="md:col-span-6 group block cursor-pointer md:mt-16"
              >
                <div className={`w-full aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10`}>
                  <img src={regionHeroImages[vietnam.slug]} alt={vietnam.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-8 left-8">
                    <span className="font-serif text-3xl md:text-5xl text-white font-normal block mb-2">
                      {vietnam.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80">
                      {vietnam.subDestinations.map(s => s.name).join(" • ")}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Row 3: JAPAN (Large Wide Banner) */}
          {japan && (
            <Link
              href={`/destinations/${japan.slug}`}
              className="group block cursor-pointer"
            >
              <div className={`w-full aspect-[21/9] rounded-3xl overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] border border-charcoal/10`}>
                <img src={regionHeroImages[japan.slug]} alt={japan.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                  <span className="font-serif text-3xl md:text-6xl text-white font-normal tracking-wide mb-3">
                    {japan.name.toUpperCase()}
                  </span>
                  <p className="font-sans text-xs md:text-sm text-white/80 tracking-widest uppercase font-light max-w-lg">
                    {japan.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Row 4: KOREA (Left) & CHINA (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            {korea && (
              <Link
                href={`/destinations/${korea.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10`}>
                  <img src={regionHeroImages[korea.slug]} alt={korea.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-6 left-6">
                    <span className="font-serif text-3xl text-white font-normal block mb-1">
                      {korea.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80">
                      {korea.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {china && (
              <Link
                href={`/destinations/${china.slug}`}
                className="md:col-span-6 group block cursor-pointer"
              >
                <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl transition-transform duration-700 group-hover:scale-[1.02] border border-charcoal/10`}>
                  <img src={regionHeroImages[china.slug]} alt={china.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
                  <div className="absolute bottom-6 left-6">
                    <span className="font-serif text-3xl text-white font-normal block mb-1">
                      {china.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/80">
                      {china.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Row 5: Remaining Regions (Kalimantan, Maluku, Papua) */}
          <div className="pt-12 border-t border-charcoal/10">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block text-center mb-12">
              {t("destinations_uncharted")}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {remainingRegions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/destinations/${region.slug}`}
                  className="group block p-8 rounded-2xl bg-white border border-charcoal/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="font-serif text-2xl text-foreground group-hover:text-[#A89053] transition-colors block mb-2">
                    {region.name}
                  </span>
                  <p className="font-sans text-xs text-foreground/60 leading-relaxed font-light mb-4">
                    {region.subtitle}
                  </p>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89053] font-semibold">
                    DISCOVER →
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
