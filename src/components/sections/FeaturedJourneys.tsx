"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ArrowRight, Compass, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { localizedRegions } from "@/data/destinations";

const DEFAULT_COUNTRIES = ["Indonesia", "Thailand", "Vietnam", "Korea", "Jepang", "China", "India", "Lainnya"];

const countryLabels: Record<string, Record<"id" | "en", string>> = {
  "Indonesia": { id: "Indonesia", en: "Indonesia" },
  "Thailand": { id: "Thailand", en: "Thailand" },
  "Vietnam": { id: "Vietnam", en: "Vietnam" },
  "Korea": { id: "Korea", en: "Korea" },
  "Jepang": { id: "Jepang", en: "Japan" },
  "China": { id: "China", en: "China" },
  "India": { id: "India", en: "India" },
  "Hongkong": { id: "Hong Kong", en: "Hong Kong" },
  "Lainnya": { id: "Lainnya", en: "Others" }
};

interface Tour {
  id: string;
  titleID: string;
  titleEN: string;
  subtitleID: string;
  subtitleEN: string;
  daysID: string;
  daysEN: string;
  price: string;
  image: string;
  datesID: string;
  datesEN: string;
  slug?: string;
  regionSlug?: string;
  status?: string;
}

const TOUR_DATA: Record<string, Tour[]> = {};

export function FeaturedJourneys() {
  const { t, locale } = useLanguage();
  const [countries, setCountries] = useState<string[]>([]);
  const [activeCountry, setActiveCountry] = useState("");
  const [tourMap, setTourMap] = useState<Record<string, Tour[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Helper to translate country name gracefully
  const getCountryLabel = (countryName: string) => {
    if (countryLabels[countryName]) {
      return countryLabels[countryName][locale];
    }
    return countryName;
  };

  useEffect(() => {
    // Clear old static cache from previous version if it contains static keys
    try {
      const savedTours = localStorage.getItem("klik_admin_featured_tours");
      if (savedTours && savedTours.includes("id-1")) {
        localStorage.removeItem("klik_admin_featured_tours");
      }
      const savedDests = localStorage.getItem("klik_admin_destinations");
      if (savedDests && (savedDests.includes("Indonesia") || savedDests.includes("Thailand"))) {
        localStorage.removeItem("klik_admin_destinations");
      }
    } catch (e) {}

    async function fetchJourneys() {
      setIsLoading(true);
      setIsError(false);
      try {
        const [apiTrips, apiDestinations] = await Promise.all([
          apiFetch<any[]>("/open-trips").catch(() => null),
          apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null),
        ]);

        // 1. Resolve dynamic destinations list matching navbar/header data source
        let rawDestinations: any[] = [];
        if (apiDestinations && Array.isArray(apiDestinations) && apiDestinations.length > 0) {
          rawDestinations = apiDestinations;
        } else {
          try {
            const saved = localStorage.getItem("klik_admin_destinations");
            if (saved) {
              rawDestinations = JSON.parse(saved);
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Extract active destination names dynamically
        const resolvedDestNames = rawDestinations
          .map((d: any) => {
            let name = d.name ? d.name.split("||")[0].trim() : d.slug;
            return name;
          })
          .filter(Boolean);

        const finalCountries = resolvedDestNames.length > 0 ? resolvedDestNames : [];
        setCountries(finalCountries);

        if (finalCountries.length > 0) {
          if (!activeCountry || !finalCountries.includes(activeCountry)) {
            setActiveCountry(finalCountries[0]);
          }
        }

        if (apiTrips && Array.isArray(apiTrips) && apiTrips.length > 0) {
          // Build destination lookup map (slug/id -> region name)
          const destLookup: Record<string, string> = {};
          rawDestinations.forEach((d) => {
            const name = d.name ? d.name.split("||")[0].trim() : "";
            const slug = (d.slug || "").toLowerCase();
            const id = (d.id || d.key || "").toLowerCase();
            if (slug) destLookup[slug] = name;
            if (id) destLookup[id] = name;
          });

          // Initialize group buckets for each dynamic country
          const grouped: Record<string, Tour[]> = {};
          finalCountries.forEach((name) => {
            grouped[name] = [];
          });

          apiTrips.forEach((p) => {
            if (p.status === "Draft" || p.status === "draft") {
              return;
            }
            let rawPrice = p.price || "Hubungi Kami";
            let displayPrice = "";
            if (rawPrice !== undefined && rawPrice !== null && rawPrice !== "") {
              const priceStr = String(rawPrice).trim();
              if (priceStr && priceStr !== "Hubungi Kami") {
                const cleanNum = priceStr.replace(/[^0-9]/g, "");
                if (cleanNum && !priceStr.toLowerCase().includes("rp") && !priceStr.toLowerCase().includes("idr")) {
                  const num = Number(cleanNum);
                  if (num >= 1000) {
                    const isMulai = priceStr.toLowerCase().includes("mulai");
                    displayPrice = `${isMulai ? "Mulai " : ""}Rp ${num.toLocaleString("id-ID")}`;
                  } else {
                    displayPrice = priceStr;
                  }
                } else {
                  displayPrice = priceStr;
                }
              } else {
                displayPrice = priceStr;
              }
            }
            if (!displayPrice) {
              displayPrice = "Hubungi Kami";
            }

            const mappedTour: Tour = {
              id: p.id || p.slug || Math.random().toString(),
              titleID: p.name || "",
              titleEN: p.nameEN || p.name || "",
              subtitleID: p.tagline || "",
              subtitleEN: p.taglineEN || p.tagline || "",
              daysID: p.duration || "5 HARI",
              daysEN: p.duration || "5 DAYS",
              price: displayPrice,
              image: p.featuredImage || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
              datesID: (() => {
                const d = (p.departureDate || p.datesID || p.departureDates || "").trim();
                if (!d) return "TBA";
                if (d === "-" || d.toLowerCase() === "everyday" || d.toLowerCase() === "daily" || d.toLowerCase() === "setiap hari") {
                  return "Berangkat Setiap Hari";
                }
                if (d.includes(",") || d.includes(";") || d.length > 30) {
                  return "Pilihan Tanggal Keberangkatan";
                }
                return d;
              })(),
              datesEN: (() => {
                const d = (p.departureDateEN || p.departureDate || p.datesEN || p.departureDates || "").trim();
                if (!d) return "TBA";
                if (d === "-" || d.toLowerCase() === "everyday" || d.toLowerCase() === "daily" || d.toLowerCase() === "setiap hari") {
                  return "Daily Departure";
                }
                if (d.includes(",") || d.includes(";") || d.length > 30) {
                  return "Multiple Departure Dates Available";
                }
                return d;
              })(),
              slug: p.slug || p.subSlug || "",
              regionSlug: p.regionSlug || "indonesia",
              status: p.status || "Available"
            };

            const rSlug = (p.regionSlug || "").toLowerCase().trim();
            const rName = (p.regionName || p.destinationID || "").toLowerCase().trim();
            const resolvedName = (destLookup[rSlug] || "").toLowerCase().trim();

            let matchedCountry = "";
            for (const destName of finalCountries) {
              const dLower = destName.toLowerCase();
              if (
                rSlug === dLower ||
                rName === dLower ||
                resolvedName === dLower ||
                (dLower === "jepang" && (rSlug === "japan" || rName === "japan" || resolvedName === "japan")) ||
                (dLower === "korea" && (rSlug === "korea" || rName === "seoul" || resolvedName === "korea"))
              ) {
                matchedCountry = destName;
                break;
              }
            }

            if (matchedCountry) {
              grouped[matchedCountry].push(mappedTour);
            } else {
              const fallbackKey = finalCountries.find(n => n.toLowerCase() === "lainnya" || n.toLowerCase() === "others") || finalCountries[finalCountries.length - 1] || "Lainnya";
              if (!grouped[fallbackKey]) {
                grouped[fallbackKey] = [];
              }
              grouped[fallbackKey].push(mappedTour);
            }
          });

          setTourMap(grouped);
          localStorage.setItem("klik_admin_featured_tours", JSON.stringify(grouped));
        } else {
          const saved = localStorage.getItem("klik_admin_featured_tours");
          if (saved) {
            setTourMap(JSON.parse(saved));
          } else {
            setTourMap({});
          }
        }
      } catch (err) {
        console.error("FeaturedJourneys: Failed to load dynamic trips", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJourneys();
  }, [locale]);

  const currentTours = tourMap[activeCountry] || [];
  const mainTour = currentTours[0];
  const secondaryTours = currentTours.slice(1, 3);

  const getDetailUrl = (tour: Tour) => {
    if (tour.regionSlug && tour.slug) {
      return `/destinations/${tour.regionSlug}/${tour.slug}`;
    }
    const region = activeCountry === "Jepang" ? "japan" : activeCountry.toLowerCase();
    return `/destinations/${region}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <section className="bg-ivory py-24 md:py-36 relative z-10 border-b border-charcoal/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header & Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal font-semibold block mb-4">
              {t("featured_tag")}
            </span>
            <Heading variant="editorial" className="!text-[#0F2C59] tracking-tight mb-4">
              {t("featured_title")}
            </Heading>
            <Text variant="large" className="text-foreground/70 font-light max-w-xl">
              {locale === "id" 
                ? "Pilihan destinasi menarik untuk menemani liburan yang lebih mudah, aman, nyaman dan berkesan"
                : "Curated journeys designed around places, people and experiences worth remembering."}
            </Text>
          </div>
        </motion.div>

        {/* Custom scrollable tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 mb-12 border-b border-charcoal/10"
        >
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`snap-start whitespace-nowrap pb-4 font-sans text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 relative ${
                activeCountry === country 
                ? "text-charcoal font-bold" 
                : "text-foreground/70 hover:text-foreground font-medium"
              }`}
            >
              {getCountryLabel(country)}
              {activeCountry === country && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#A89053]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content Container with Animation */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Skeleton */}
              <div className="flex md:hidden overflow-x-auto scrollbar-none pb-8 -mx-6 px-6 gap-6 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="shrink-0 w-[85vw] sm:w-[60vw]">
                    <div className="w-full aspect-[4/3] bg-slate-200 rounded-xl mb-6" />
                    <div className="h-4 bg-slate-200 w-1/3 rounded mb-3" />
                    <div className="h-6 bg-slate-200 w-3/4 rounded mb-3" />
                    <div className="h-4 bg-slate-200 w-full rounded mb-2" />
                    <div className="h-4 bg-slate-200 w-2/3 rounded" />
                  </div>
                ))}
              </div>

              {/* Desktop Skeleton */}
              <div className="hidden md:grid md:grid-cols-12 md:gap-12 md:items-stretch animate-pulse">
                <div className="md:col-span-7 flex flex-col h-full w-full">
                  <div className="w-full aspect-[16/11] bg-slate-200 rounded-xl mb-6" />
                  <div className="h-4 bg-slate-200 w-1/4 rounded mb-3" />
                  <div className="h-8 bg-slate-200 w-3/4 rounded mb-3" />
                  <div className="h-4 bg-slate-200 w-full rounded mb-2" />
                  <div className="h-4 bg-slate-200 w-2/3 rounded" />
                </div>
                <div className="md:col-span-5 flex md:flex-col justify-between md:aspect-[80/77] gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-6 items-center w-full">
                      <div className="w-5/12 aspect-square bg-slate-200 rounded-xl shrink-0" />
                      <div className="w-7/12 flex flex-col">
                        <div className="h-3 bg-slate-200 w-1/3 rounded mb-2" />
                        <div className="h-6 bg-slate-200 w-3/4 rounded mb-2" />
                        <div className="h-4 bg-slate-200 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-6 border border-amber-100 shadow-sm animate-pulse">
                <AlertTriangle size={32} />
              </div>
              <h3 className="typography-card !text-[#0F2C59] font-bold mb-3">
                {locale === "id" ? "Layanan Sedang Pemeliharaan" : "Service Under Maintenance"}
              </h3>
              <p className="typography-body text-foreground/75 leading-relaxed max-w-md">
                {locale === "id"
                  ? "Kami sedang melakukan pemeliharaan sistem berkala. Jadwal paket wisata pilihan Anda akan kembali tampil segera."
                  : "We are currently conducting scheduled system maintenance. Featured travel packages will be available shortly."}
              </p>
            </motion.div>
          ) : currentTours.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="typography-card !text-[#0F2C59] font-bold mb-3">
                {locale === "id" ? "Belum Ada Jadwal Keberangkatan" : "No Scheduled Departures Yet"}
              </h3>
              <p className="typography-body text-foreground/75 leading-relaxed max-w-md mb-8">
                {locale === "id" 
                  ? `Saat ini belum ada paket tour open trip aktif untuk wilayah ${getCountryLabel(activeCountry)}. Silakan hubungi kami untuk merancang perjalanan privat kustom impian Anda.`
                  : `Currently, there are no active open trip packages for ${getCountryLabel(activeCountry)}. Please contact us to customize your private dream getaway.`}
              </p>
              <a 
                href={`https://wa.me/6281230011027?text=${encodeURIComponent(
                  locale === "id" 
                    ? `Halo Klik Travel ID, saya tertarik dengan perjalanan kustom ke ${getCountryLabel(activeCountry)}. Mohon info selengkapnya.` 
                    : `Hello Klik Travel ID, I am interested in a custom trip to ${getCountryLabel(activeCountry)}. Please provide more details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2.5 hover:scale-[1.02] cursor-pointer"
              >
                <span>{locale === "id" ? "Konsultasi Private Trip" : "Consult Custom Trip"}</span>
              </a>
            </motion.div>
          ) : (
            <motion.div
              key={activeCountry}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Mobile & Tablet Carousel (< 1024px) */}
              <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 -mx-6 px-6 gap-6">
                {currentTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    variants={cardVariants}
                    className="shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] snap-center"
                  >
                    <Link href={getDetailUrl(tour)} className="group cursor-pointer flex flex-col w-full h-full">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-5 bg-charcoal/10 shadow-lg">
                        <img src={tour.image} alt={locale === "id" ? tour.titleID : tour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                        
                        {/* Floating Top Badge */}
                        <div className="absolute top-5 left-5 z-20 font-mono text-[9px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                          {getCountryLabel(activeCountry)} // {locale === "id" ? tour.daysID : tour.daysEN}
                        </div>
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-center pr-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-charcoal/80 mb-3 uppercase tracking-wider">
                          <span>{locale === "id" ? tour.datesID : tour.datesEN}</span>
                          <span>•</span>
                          <span className="typography-price text-[#A89053]">{locale === "id" ? tour.price : tour.price.replace("JT", "M")}</span>
                        </div>
                        
                        <h3 className="typography-package-title mb-3 group-hover:text-[#A89053] transition-colors duration-300">
                          {locale === "id" ? tour.titleID : tour.titleEN}
                        </h3>
                        <p className="typography-body mb-6 line-clamp-2">
                          {locale === "id" ? tour.subtitleID : tour.subtitleEN}
                        </p>
                        <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-[#0284C7] font-semibold mt-auto group-hover:text-[#0F2C59] transition-colors">
                          {t("featured_explore_details")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Magazine Split Grid (>= 1024px) */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                
                {/* Main Story (Left) */}
                {mainTour && (
                  <motion.div 
                    variants={cardVariants}
                    className={currentTours.length === 1 ? "lg:col-span-8 lg:col-start-3" : "lg:col-span-7"}
                  >
                    <Link href={getDetailUrl(mainTour)} className="group cursor-pointer flex flex-col w-full">
                      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-6 bg-charcoal/10 shadow-lg">
                        <img src={mainTour.image} alt={locale === "id" ? mainTour.titleID : mainTour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                        
                        {/* Floating Top Badge */}
                        <div className="absolute top-5 left-5 z-20 font-mono text-[9px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                          {getCountryLabel(activeCountry)} // {locale === "id" ? mainTour.daysID : mainTour.daysEN}
                        </div>

                        {/* Hover Prompt */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 hidden lg:flex">
                          <div className="bg-white/90 backdrop-blur-sm text-charcoal text-[10px] tracking-[0.2em] uppercase py-3.5 px-8 rounded-full shadow-xl">
                            {locale === "id" ? "Lihat Rencana Perjalanan" : "View Itinerary"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-start pr-4 lg:pr-8">
                        <div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm font-mono text-charcoal/80 mb-3 uppercase tracking-wider">
                          <span>{locale === "id" ? mainTour.datesID : mainTour.datesEN}</span>
                          <span>•</span>
                          <span className="typography-price text-[#A89053] !text-lg lg:!text-xl">{locale === "id" ? mainTour.price : mainTour.price.replace("JT", "M")}</span>
                          {mainTour.status && (
                            <>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-normal uppercase ${
                                mainTour.status === "Closed" || mainTour.status === "inactive"
                                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}>
                                {mainTour.status}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="typography-package-title mb-3 group-hover:text-[#A89053] transition-colors duration-300">
                          {locale === "id" ? mainTour.titleID : mainTour.titleEN}
                        </h3>
                        <p className="typography-body mb-6 line-clamp-2">
                          {locale === "id" ? mainTour.subtitleID : mainTour.subtitleEN}
                        </p>
                        <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-[#0284C7] font-semibold mt-auto group-hover:text-[#0F2C59] transition-colors">
                          {t("featured_explore_details")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Secondary Stories (Right) */}
                {secondaryTours.length > 0 && (
                  <div className="lg:col-span-5 flex flex-col justify-start gap-8 lg:gap-10">
                    {secondaryTours.map((tour) => (
                      <motion.div 
                        key={tour.id} 
                        variants={cardVariants}
                        className="w-full"
                      >
                        <Link href={getDetailUrl(tour)} className="group cursor-pointer flex flex-col xl:flex-row gap-5 xl:gap-6 xl:items-center w-full">
                          <div className="relative w-full xl:w-5/12 aspect-[16/10] xl:aspect-square overflow-hidden rounded-xl bg-charcoal/10 shrink-0 shadow-md">
                            <img src={tour.image} alt={locale === "id" ? tour.titleID : tour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
                            
                            <div className="absolute top-4 right-4 z-20 font-mono text-[8px] tracking-[0.2em] uppercase text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10 hidden xl:block">
                              {locale === "id" ? tour.daysID : tour.daysEN}
                            </div>
                          </div>
                          
                          <div className="w-full xl:w-7/12 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-charcoal/77 mb-2 uppercase tracking-wider">
                              <span>{locale === "id" ? tour.datesID : tour.datesEN}</span>
                              {tour.status && (
                                <>
                                  <span>•</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-normal uppercase ${
                                    tour.status === "Closed" || tour.status === "inactive"
                                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  }`}>
                                    {tour.status}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <h3 className="typography-package-title mb-2 group-hover:text-[#A89053] transition-colors duration-300">
                              {locale === "id" ? tour.titleID : tour.titleEN}
                            </h3>
                            
                            <div className="typography-price text-[#A89053] mb-4">
                              {locale === "id" ? tour.price : tour.price.replace("JT", "M")}
                            </div>

                            <div className="flex items-center text-[9px] font-mono uppercase tracking-widest text-foreground/50 group-hover:text-[#0284C7] transition-colors">
                              {t("featured_explore_details")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Hide scrollbar completely but maintain functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
