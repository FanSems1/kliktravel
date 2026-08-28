"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { localizedJourneys, Journey } from "@/data/journeys";
import { ChevronDown, ArrowRight, Check, X, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

interface JourneyDetailClientProps {
  slug: string;
}

export function JourneyDetailClient({ slug }: JourneyDetailClientProps) {
  const { t, locale } = useLanguage();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Fetch Curated Journeys from API
        const apiJourneys = await apiFetch<any[]>(`/journeys?locale=${locale}`).catch(() => []);
        const matchCj = apiJourneys.find((j: any) => j.slug === slug);
        if (matchCj) {
          const cId = matchCj.contentId || {};
          const cEn = matchCj.contentEn || {};
          const active = locale === "en" ? cEn : cId;
          const mapped: Journey = {
            id: matchCj.id,
            slug: matchCj.slug,
            title: active.title || cId.title || matchCj.slug,
            destination: active.destination || cId.destination || "Destination",
            subtitle: active.subtitle || cId.subtitle || "",
            durationDays: matchCj.durationDays || 3,
            durationLabel: active.durationLabel || cId.durationLabel || `${matchCj.durationDays || 3} Days`,
            dates: active.dates || cId.dates || (locale === "id" ? "Sesuai Jadwal" : "Scheduled"),
            airline: active.airline || cId.airline || "Garuda Indonesia",
            price: active.price || cId.price || `Rp ${Number(matchCj.priceRaw || 0).toLocaleString("id-ID")}`,
            priceRaw: Number(matchCj.priceRaw || 0),
            travelMonth: active.travelMonth || cId.travelMonth || "",
            travelStyle: active.travelStyle || cId.travelStyle || "Luxury Tour",
            imageGradient: matchCj.imageGradient || "from-[#38BDF8] to-[#0369A1]",
            image: matchCj.image || "",
            introHeading: active.introHeading || cId.introHeading || active.title || cId.title || "",
            introDescription: active.introDescription || cId.introDescription || active.subtitle || "",
            countriesCount: matchCj.countriesCount || 1,
            chapters: active.chapters || cId.chapters || [],
            itinerary: (active.itinerary || cId.itinerary || []).map((d: any) => ({
              day: d.day,
              title: d.title,
              description: d.description,
              image: d.image,
              images: d.images,
              hotel: d.hotel,
              activities: d.activities
            })),
            highlights: active.highlights || cId.highlights || [],
            accommodations: active.accommodations || cId.accommodations || [],
            flights: active.flights || cId.flights || { airline: "", route: [] },
            inclusions: active.inclusions || cId.inclusions || [],
            exclusions: active.exclusions || cId.exclusions || [],
            faqs: active.faqs || cId.faqs || []
          };
          setJourney(mapped);
          setIsLoading(false);
          return;
        }

        // 2. Fetch Open Trips from API
        const apiOpenTrips = await apiFetch<any[]>(`/open-trips?locale=${locale}`).catch(() => []);
        const matchOt = apiOpenTrips.find((ot: any) => ot.slug === slug);
        if (matchOt) {
          const cId = matchOt.contentId || {};
          const cEn = matchOt.contentEn || {};
          const isEn = locale === "en";
          const activeName = isEn ? (cEn.name || cId.name) : cId.name;
          const activeTagline = isEn ? (cEn.tagline || cId.tagline) : cId.tagline;
          const activeDuration = isEn ? (cEn.duration || cId.duration) : cId.duration;
          const activePrice = isEn ? (cEn.price || cId.price) : cId.price;

          const rawPrice = Number(matchOt.priceRaw || cId.priceRaw || (activePrice ? activePrice.replace(/[^0-9]/g, "") : 0));
          const itin = (cId.itinerary || []).map((d: any) => ({
            day: locale === "id" ? `Hari 0${d.day}` : `Day 0${d.day}`,
            title: isEn ? (d.titleEN || d.title) : d.title,
            description: isEn ? (d.descriptionEN || d.description) : d.description,
            image: d.image,
            images: d.images,
            hotel: d.hotel
          }));

          const mapped: Journey = {
            id: matchOt.id,
            slug: matchOt.slug,
            title: activeName || matchOt.slug,
            destination: cId.regionSlug ? cId.regionSlug.toUpperCase() : "OPEN TRIP",
            subtitle: activeTagline || "",
            durationDays: parseInt(activeDuration) || 3,
            durationLabel: activeDuration || "3 Hari 2 Malam",
            dates: locale === "id" ? "Keberangkatan Setiap Minggu" : "Weekly Departures",
            airline: "Penerbangan Pilihan",
            price: activePrice ? (activePrice.startsWith("Rp") ? activePrice : `Rp ${Number(activePrice).toLocaleString("id-ID")}`) : "Hubungi Kami",
            priceRaw: rawPrice,
            travelMonth: locale === "id" ? "Sepanjang Tahun" : "All Year Round",
            travelStyle: "Open Trip / Group Tour",
            imageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
            image: matchOt.featuredImage || "",
            introHeading: activeName || "",
            introDescription: activeTagline || "",
            countriesCount: 1,
            chapters: [],
            itinerary: itin,
            highlights: (isEn ? (cEn.highlights || cId.highlights) : cId.highlights) || [],
            accommodations: [],
            flights: { airline: "", route: [] },
            inclusions: (isEn ? (cEn.inclusions || cId.inclusions) : cId.inclusions) || [],
            exclusions: (isEn ? (cEn.exclusions || cId.exclusions) : cId.exclusions) || [],
            faqs: []
          };
          setJourney(mapped);
          setIsLoading(false);
          return;
        }

        // 3. Fallback: LocalStorage check for Open Trips
        const savedOtStr = localStorage.getItem("klik_admin_open_trips");
        if (savedOtStr) {
          const savedOt = JSON.parse(savedOtStr);
          const matchSavedOt = savedOt.find((ot: any) => ot.slug === slug);
          if (matchSavedOt) {
            const isEn = locale === "en";
            const mapped: Journey = {
              id: matchSavedOt.id || matchSavedOt.slug,
              slug: matchSavedOt.slug,
              title: isEn ? (matchSavedOt.nameEN || matchSavedOt.name) : matchSavedOt.name,
              destination: matchSavedOt.regionSlug ? matchSavedOt.regionSlug.toUpperCase() : "OPEN TRIP",
              subtitle: isEn ? (matchSavedOt.taglineEN || matchSavedOt.tagline) : matchSavedOt.tagline,
              durationDays: parseInt(matchSavedOt.duration) || 3,
              durationLabel: isEn ? (matchSavedOt.durationEN || matchSavedOt.duration) : matchSavedOt.duration,
              dates: locale === "id" ? "Keberangkatan Setiap Minggu" : "Weekly Departures",
              airline: "Penerbangan Pilihan",
              price: matchSavedOt.price ? (matchSavedOt.price.startsWith("Rp") ? matchSavedOt.price : `Rp ${Number(matchSavedOt.price).toLocaleString("id-ID")}`) : "Hubungi Kami",
              priceRaw: Number(matchSavedOt.priceRaw || 0),
              travelMonth: locale === "id" ? "Sepanjang Tahun" : "All Year Round",
              travelStyle: "Open Trip / Group Tour",
              imageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
              image: matchSavedOt.featuredImage || "",
              introHeading: (isEn ? matchSavedOt.nameEN : matchSavedOt.name) || "",
              introDescription: (isEn ? matchSavedOt.taglineEN : matchSavedOt.tagline) || "",
              countriesCount: 1,
              chapters: [],
              itinerary: (matchSavedOt.itinerary || []).map((d: any) => ({
                day: locale === "id" ? `Hari 0${d.day}` : `Day 0${d.day}`,
                title: isEn ? (d.titleEN || d.title) : d.title,
                description: isEn ? (d.descriptionEN || d.description) : d.description,
                image: d.image,
                images: d.images,
                hotel: d.hotel
              })),
              highlights: (isEn ? (matchSavedOt.highlightsEN || matchSavedOt.highlights) : matchSavedOt.highlights) || [],
              accommodations: [],
              flights: { airline: "", route: [] },
              inclusions: (isEn ? (matchSavedOt.inclusionsEN || matchSavedOt.inclusions) : matchSavedOt.inclusions) || [],
              exclusions: (isEn ? (matchSavedOt.exclusionsEN || matchSavedOt.exclusions) : matchSavedOt.exclusions) || [],
              faqs: []
            };
            setJourney(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("JourneyDetailClient: Failed to fetch API data", err);
      }

      setJourney(null);
      setIsLoading(false);
    }

    loadData();
  }, [slug, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-[#0F2C59] mb-4">
          {locale === "id" ? "Perjalanan Tidak Ditemukan" : "Journey Not Found"}
        </h2>
        <p className="font-sans text-sm text-[#0F2C59]/70 max-w-md mb-8">
          {locale === "id" ? "Paket perjalanan yang Anda cari tidak tersedia atau telah dipindahkan." : "The travel package you are looking for is unavailable or has been moved."}
        </p>
        <Link
          href="/journeys"
          className="inline-flex items-center gap-2 bg-[#0284C7] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#0369a1] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === "id" ? "Lihat Semua Perjalanan" : "View All Journeys"}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">

      {/* 1. HERO CINEMATIC */}
      <section className="relative w-full h-screen overflow-hidden">
        {journey.image ? (
          <img
            src={journey.image}
            alt={journey.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-tr ${journey.imageGradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/50 z-[1]" />
        <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay z-[2]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-16 z-[3]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-serif text-5xl md:text-8xl text-white font-normal tracking-wider mb-6 drop-shadow-md"
          >
            {journey.title.toUpperCase()}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/90 uppercase space-y-2 flex flex-col drop-shadow-sm font-semibold"
          >
            <span>{journey.destination}</span>
            <span>{journey.dates}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 z-[3]"
        >
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase mb-4 drop-shadow-sm">{t("detail_discover_journey")}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative py-24 md:py-36">

        {/* Main Content Column */}
        <div className="col-span-1 lg:col-span-8 space-y-32">

          {/* 2. INTRODUCTION */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-4xl md:text-6xl text-foreground font-normal leading-tight mb-8">
                {journey.introHeading}
              </h2>
              <p className="font-sans text-lg md:text-xl text-foreground/70 font-light leading-relaxed max-w-2xl">
                {journey.introDescription}
              </p>
            </motion.div>
          </section>

          {/* 3. DESTINATION STORY (CHAPTERS) */}
          {journey.chapters && journey.chapters.length > 0 && (
            <section className="space-y-24">
              {journey.chapters.map((chapter) => (
                <div key={chapter.id} className={`flex flex-col ${chapter.layout === "right" ? "md:flex-row-reverse" : chapter.layout === "left" ? "md:flex-row" : ""} gap-8 md:gap-16 items-center`}>
                  <div className={`w-full ${chapter.layout === "full" ? "aspect-[21/9]" : "md:w-1/2 aspect-[4/5]"} rounded-3xl overflow-hidden bg-charcoal/10 relative shadow-xl`}>
                    <div className={`absolute inset-0 bg-gradient-to-tr ${journey.imageGradient} opacity-20`} />
                    <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay" />
                    <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-widest uppercase text-charcoal/40">Story Chapter</div>
                  </div>
                  <div className={`w-full ${chapter.layout === "full" ? "mt-8" : "md:w-1/2"}`}>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-earth-dark block mb-4">{chapter.id}</span>
                    <h3 className="font-serif text-3xl text-foreground mb-4">{chapter.title}</h3>
                    <p className="font-sans text-sm md:text-base text-foreground/70 font-light leading-relaxed">{chapter.text}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* 4. ITINERARY (ACCORDION/TIMELINE WITH PHOTO GALLERY) */}
          {journey.itinerary && journey.itinerary.length > 0 && (
            <section>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-12 border-b border-charcoal/10 pb-4">
                {t("detail_the_itinerary")}
              </span>
              <div className="space-y-2">
                {journey.itinerary.map((item, index) => {
                  const isOpen = activeDay === index;
                  const itemImgs: string[] = (item as any).images && (item as any).images.length > 0
                    ? (item as any).images
                    : ((item as any).image ? ((item as any).image.includes("||") ? (item as any).image.split("||") : [(item as any).image]) : []);

                  return (
                    <div key={index} className="border-b border-charcoal/10 last:border-0 pb-2">
                      <button
                        onClick={() => setActiveDay(isOpen ? null : index)}
                        className="w-full py-6 flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center space-x-6 md:space-x-12">
                          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-earth-dark w-16 font-bold">
                            {item.day}
                          </span>
                          <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-earth-dark transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown className={`text-charcoal/40 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 md:pl-28 pb-8 pr-4 space-y-6">
                              {/* Daily Photos Gallery */}
                              {itemImgs.length > 0 && (
                                <div className={`w-full rounded-2xl overflow-hidden shadow-sm grid ${itemImgs.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                                  {itemImgs.slice(0, 4).map((imgUrl, iIdx) => (
                                    <div key={iIdx} className={`relative aspect-[16/9] overflow-hidden ${itemImgs.length === 3 && iIdx === 0 ? "col-span-2" : ""}`}>
                                      <img src={imgUrl} alt={`${item.title} ${iIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              <p className="font-sans text-sm md:text-base text-foreground/70 leading-relaxed font-light">
                                {item.description}
                              </p>

                              {(item as any).hotel && (
                                <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] px-4 py-2 rounded-xl text-xs font-medium">
                                  <span>Hotel / Akomodasi: {(item as any).hotel}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 5. EXPERIENCE HIGHLIGHTS */}
          {journey.highlights && journey.highlights.length > 0 && (
            <section>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-12 border-b border-charcoal/10 pb-4">
                {t("detail_highlights")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {journey.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-earth-dark mt-2 shrink-0" />
                    <p className="font-serif text-lg text-foreground">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. ACCOMMODATION */}
          {journey.accommodations && journey.accommodations.length > 0 && (
            <section>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-12 border-b border-charcoal/10 pb-4">
                {t("detail_curated_stays")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {journey.accommodations.map((hotel, idx) => (
                  <div key={idx} className="group">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-charcoal/5 mb-4 relative overflow-hidden border border-charcoal/10">
                      <div className="absolute inset-0 image-texture opacity-20" />
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-earth-dark block mb-1">
                      {hotel.city}
                    </span>
                    <h4 className="font-serif text-lg text-foreground mb-1">{hotel.name}</h4>
                    <span className="font-sans text-xs text-charcoal/60 uppercase tracking-widest">{hotel.roomType}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. FLIGHTS */}
          {journey.flights && journey.flights.route && journey.flights.route.length > 0 && (
            <section>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-12 border-b border-charcoal/10 pb-4">
                {t("detail_flight_route")}
              </span>
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-charcoal/10 shadow-sm">
                <span className="font-sans text-xs uppercase tracking-widest text-earth-dark font-semibold block mb-8">
                  {journey.flights.airline}
                </span>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 text-center md:text-left">
                  {journey.flights.route.map((node, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-serif text-xl text-foreground">{node}</span>
                      {idx < journey.flights.route.length - 1 && (
                        <ArrowRight className="text-charcoal/30 hidden md:block" size={20} />
                      )}
                      {idx < journey.flights.route.length - 1 && (
                        <ArrowRight className="text-charcoal/30 block md:hidden rotate-90" size={20} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 8. INCLUSIONS & EXCLUSIONS */}
          {((journey.inclusions && journey.inclusions.length > 0) || (journey.exclusions && journey.exclusions.length > 0)) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {journey.inclusions && journey.inclusions.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-8 border-b border-charcoal/10 pb-4">
                    {t("detail_included")}
                  </span>
                  <ul className="space-y-4">
                    {journey.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-foreground/75 font-light">
                        <Check size={16} className="text-earth-dark mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {journey.exclusions && journey.exclusions.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-8 border-b border-charcoal/10 pb-4">
                    {t("detail_not_included")}
                  </span>
                  <ul className="space-y-4">
                    {journey.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-foreground/75 font-light">
                        <X size={16} className="text-charcoal/30 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* 9. FAQ */}
          {journey.faqs && journey.faqs.length > 0 && (
            <section>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-12 border-b border-charcoal/10 pb-4">
                {t("detail_faqs")}
              </span>
              <div className="space-y-2">
                {journey.faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div key={index} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full p-6 flex items-center justify-between text-left"
                      >
                        <span className="font-serif text-lg text-foreground pr-8">
                          {faq.q}
                        </span>
                        <ChevronDown className={`text-earth-dark shrink-0 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 pt-2 text-sm text-foreground/70 font-light leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Floating Sidebar (Overview & Booking) */}
        <div className="col-span-1 lg:col-span-4 relative">
          <div className="sticky top-32 flex flex-col space-y-12">

            {/* FLOATING INFORMATION OVERVIEW */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/50 block mb-6 border-b border-charcoal/10 pb-4">
                {t("detail_overview")}
              </span>
              <ul className="space-y-6">
                <li className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">{t("detail_duration")}</span>
                  <span className="font-serif text-2xl text-foreground">{journey.durationLabel}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">{t("detail_destinations_count")}</span>
                  <span className="font-serif text-2xl text-foreground">
                    {journey.countriesCount < 2
                      ? (locale === "id" ? "1 Destinasi" : "1 Destination")
                      : `${journey.countriesCount} ${locale === "id" ? "Destinasi" : "Destinations"}`}
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">{t("detail_travel_period")}</span>
                  <span className="font-serif text-2xl text-foreground">{journey.dates}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">{t("detail_starting_price")}</span>
                  <span className="font-serif text-2xl text-foreground">{journey.price}</span>
                </li>
              </ul>
            </div>

            {/* STICKY BOOKING PANEL */}
            <div className="bg-charcoal text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 image-texture opacity-20 mix-blend-overlay" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/60 mb-2">
                  {t("detail_reserve_journey")}
                </span>
                <span className="font-serif text-4xl mb-8">
                  {journey.price}
                </span>
                <Link
                  href="/inquire"
                  className="w-full bg-earth-dark text-white hover:bg-white hover:text-charcoal font-sans text-xs uppercase tracking-[0.25em] py-4 rounded-full transition-colors duration-300 mb-4 font-semibold shadow-lg text-center"
                >
                  {t("detail_request_booking")}
                </Link>
                <Link
                  href="/inquire"
                  className="text-white/60 hover:text-white font-sans text-[10px] uppercase tracking-[0.2em] transition-colors underline underline-offset-4"
                >
                  {t("detail_ask_expert")}
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Syarat & Ketentuan Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="bg-white border border-charcoal/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-charcoal/10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#0284C7] font-bold">
              {locale === "id" ? "REGULASI PERJALANAN" : "TRAVEL REGULATION"}
            </span>
            <h2 className="font-serif font-normal text-2xl md:text-3xl text-foreground">
              {locale === "id" ? "SYARAT DAN KETENTUAN" : "TERMS AND CONDITIONS"}
            </h2>
          </div>

          {/* Wholesaler Note Alert */}
          <div className="bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs md:text-sm rounded-2xl p-4 flex gap-3 items-start mb-8 font-sans">
            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium leading-relaxed">
              {locale === "id"
                ? "Rules (Term and Condition) telah diatur sesuai dengan yang ditetapkan oleh wholesaler dan tidak dapat diganggu gugat."
                : "Rules (Term and Condition) have been set by the wholesaler and are non-negotiable."}
            </span>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-foreground/80 text-xs md:text-sm leading-relaxed">

            {/* 1. Pendaftaran */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-foreground text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-charcoal/5 flex items-center justify-center font-mono text-xs font-bold text-foreground">1</span>
                {locale === "id" ? "Pendaftaran" : "Registration"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id"
                    ? "Konfirmasi pendaftaran tour harus disertai dengan pembayaran DP sebesar Rp 3.000.000 (non-refundable) dan sisanya dapat dicicil 3x sampai pelunasan 30 hari sebelum tanggal keberangkatan."
                    : "Tour registration confirmation must be accompanied by a DP payment of IDR 3,000,000 (non-refundable). The balance can be paid in 3 installments up to 30 days before departure."}
                </li>
                <li>
                  {locale === "id"
                    ? "Harga yang terlampir dalam penawaran paket masih dapat berubah sewaktu-waktu selama tour belum dikonfirmasi."
                    : "Prices enclosed in the package offer are subject to change until the tour is fully confirmed."}
                </li>
                <li>
                  {locale === "id"
                    ? "Itinerary bersifat tidak mengikat dan dapat berubah sewaktu-waktu menyesuaikan kondisi di lapangan atau situasi yang tidak terduga (Force Majeure)."
                    : "Itinerary is non-binding and subject to change to adjust with field conditions or unexpected situations (Force Majeure)."}
                </li>
              </ul>
            </div>

            {/* 2. Pembayaran */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-foreground text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-charcoal/5 flex items-center justify-center font-mono text-xs font-bold text-foreground">2</span>
                {locale === "id" ? "Pembayaran" : "Payment"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id" ? "Pembayaran ditransfer ke nomor rekening berikut:" : "Payments should be transferred to the following account:"}
                  <div className="bg-ivory border border-charcoal/10 rounded-xl p-3 mt-1.5 font-mono text-xs select-all text-foreground flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">BCA 2860475998</span>
                    <span>a.n. PT Bersama Jelajah Dunia</span>
                  </div>
                </li>
                <li>
                  {locale === "id"
                    ? "Pelunasan pembayaran dilakukan maksimal H-30 sebelum keberangkatan."
                    : "Full payment balance must be settled at least 30 days (H-30) prior to departure."}
                </li>
                <li>
                  {locale === "id"
                    ? "Pendaftaran yang dilakukan kurang dari 30 hari sebelum tanggal keberangkatan harus melakukan pembayaran penuh (full payment)."
                    : "Registrations made less than 30 days before departure require immediate full payment."}
                </li>
                <li>
                  {locale === "id"
                    ? "Wajib konfirmasi semua pembayaran dengan mengirimkan bukti transfer."
                    : "All payments must be confirmed by sending transfer receipts."}
                </li>
              </ul>
            </div>

            {/* 3. Pembatalan */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-foreground text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-charcoal/5 flex items-center justify-center font-mono text-xs font-bold text-foreground">3</span>
                {locale === "id" ? "Pembatalan" : "Cancellation"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id" ? "Penalti pembatalan oleh peserta:" : "Cancellation penalties by participant:"}
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      <strong>&gt; 30 hari:</strong> {locale === "id" ? "DP dan pembayaran yang sudah masuk hangus" : "DP and any paid amounts are non-refundable"}
                    </li>
                    <li>
                      <strong>29 - 0 hari:</strong> {locale === "id" ? "Dikenakan biaya 100% dari harga tour" : "Charged 100% of the total tour price"}
                    </li>
                  </ul>
                </li>
                <li>
                  {locale === "id"
                    ? "Pembatalan akibat Force Majeure (bencana alam, cuaca buruk, kerusuhan, wabah penyakit, dll): perjalanan dapat dijadwalkan ulang atau dibatalkan. Tidak ada pengembalian dana atas fasilitas yang tidak terpakai, dan pihak Travel tidak bertanggung jawab atas kerugian/ketidaknyamanan yang terjadi."
                    : "Cancellations due to Force Majeure (natural disasters, severe weather, riots, disease outbreaks, etc.): trips may be rescheduled or cancelled. No refund is provided for unused amenities, and the Travel agency is not liable for any losses/inconveniences."}
                </li>
                <li>
                  {locale === "id"
                    ? "Untuk alasan apa pun pembatalan sepihak oleh peserta, DP dan cicilan yang masuk tetap tidak dapat dikembalikan."
                    : "For any personal reasons of cancellation by the participant, DP and installments remain non-refundable."}
                </li>
              </ul>
            </div>

            {/* 4. Visa */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-foreground text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-charcoal/5 flex items-center justify-center font-mono text-xs font-bold text-foreground">4</span>
                Visa
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id"
                    ? "Penolakan atau keterlambatan penerbitan visa bukan merupakan tanggung jawab pihak travel dan sepenuhnya merupakan hak prerogatif pihak Kedutaan."
                    : "Rejection or delay in visa issuance is entirely under the Embassy's authority and is not the responsibility of the travel agency."}
                </li>
              </ul>
            </div>

          </div>

          {/* Consent Clause Footer */}
          <div className="bg-ivory border border-charcoal/10 rounded-2xl p-4 flex gap-3 items-center mt-8 text-foreground/80 text-xs md:text-sm font-sans font-medium">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {locale === "id"
                ? "Dengan melakukan pendaftaran, peserta dianggap mengerti dan menyetujui syarat dan ketentuan yang berlaku."
                : "By registering, participants are deemed to have understood and agreed to the applicable terms and conditions."}
            </span>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="relative w-full aspect-[21/9] min-h-[500px] overflow-hidden mt-12">
        {journey.image ? (
          <img
            src={journey.image}
            alt={journey.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-tr ${journey.imageGradient}`} />
        )}
        <div className="absolute inset-0 bg-charcoal/60 z-[1]" />
        <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay z-[2]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-[3]">
          <h2 className="font-serif text-5xl md:text-7xl text-white font-normal tracking-wide mb-12 drop-shadow-md">
            {t("detail_ready_to_go")}
          </h2>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link
              href="/inquire"
              className="bg-white text-charcoal hover:bg-earth-dark hover:text-white font-sans text-xs uppercase tracking-[0.25em] py-4 px-10 rounded-full transition-colors duration-300 font-semibold shadow-2xl"
            >
              {t("detail_reserve_button")}
            </Link>
            <Link
              href="/journeys"
              className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-sans text-xs uppercase tracking-[0.25em] py-4 px-10 rounded-full transition-colors duration-300"
            >
              {t("detail_explore_more")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
