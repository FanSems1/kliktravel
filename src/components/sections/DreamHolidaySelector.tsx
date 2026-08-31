"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Compass, Milestone, CalendarDays, Plane, Clock, Flame, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

type Tab = "destinasi" | "tipe" | "waktu";

interface DepartureSchedule {
  id: string;
  titleID: string;
  titleEN: string;
  destinationID: string;
  destinationEN: string;
  datesID: string;
  datesEN: string;
  periodKey: "all" | "agu-sep" | "okt-nov" | "des" | "spring";
  airline: string;
  durationID: string;
  durationEN: string;
  statusType: "guaranteed" | "limited" | "promo" | "bestseller";
  price: string;
  image: string;
}

export function DreamHolidaySelector() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("destinasi");
  const [activePeriod, setActivePeriod] = useState<string>("all");

  const [destinations, setDestinations] = useState<any[]>([]);
  const [departures, setDepartures] = useState<DepartureSchedule[]>([]);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch dynamic destinations
      try {
        const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r) => {
            let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
            let image = "";
            if (gradient.includes("||")) {
              const parts = gradient.split("||");
              gradient = parts[0];
              image = parts[1];
            }
            return {
              nameID: r.name ? r.name.split("||")[0] : r.slug,
              nameEN: r.name ? r.name.split("||")[0] : r.slug,
              image: image || r.featuredImage || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
              slug: r.slug,
            };
          });
          setDestinations(mapped);
          localStorage.setItem("klik_admin_destinations_selector", JSON.stringify(mapped));
        } else {
          const saved = localStorage.getItem("klik_admin_destinations_selector");
          if (saved) {
            setDestinations(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.error("DreamHolidaySelector: Failed to load destinations", err);
      }

      // 2. Fetch dynamic departures
      try {
        const openTrips = await apiFetch<any[]>("/open-trips").catch(() => null);
        if (openTrips && Array.isArray(openTrips) && openTrips.length > 0) {
          const mapped = openTrips.map((p) => {
            let periodKey: DepartureSchedule["periodKey"] = "all";
            const dText = (p.departureDate || p.departureDateEN || p.datesID || p.departureDates || "").toLowerCase();
            if (dText.includes("agu") || dText.includes("sep") || dText.includes("aug")) {
              periodKey = "agu-sep";
            } else if (dText.includes("okt") || dText.includes("nov") || dText.includes("oct")) {
              periodKey = "okt-nov";
            } else if (dText.includes("des") || dText.includes("dec")) {
              periodKey = "des";
            } else if (dText.includes("apr") || dText.includes("mei") || dText.includes("spring") || dText.includes("may") || dText.includes("mar")) {
              periodKey = "spring";
            }

            let statusType: DepartureSchedule["statusType"] = "guaranteed";
            if (p.statusType) {
              statusType = p.statusType;
            } else if (p.seatsLeft !== undefined && p.seatsLeft <= 3 && p.seatsLeft > 0) {
              statusType = "limited";
            } else if (p.isPromo) {
              statusType = "promo";
            } else if (p.isBestseller) {
              statusType = "bestseller";
            }

            return {
              id: p.id || p.slug || Math.random().toString(),
              titleID: p.name || "",
              titleEN: p.nameEN || p.name || "",
              destinationID: p.regionName || p.regionSlug || "",
              destinationEN: p.regionName || p.regionSlug || "",
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
              periodKey,
              airline: p.airline || p.airlineName || "",
              durationID: p.duration || "5 Hari 4 Malam",
              durationEN: p.duration || "5 Days 4 Nights",
              statusType,
              price: p.price || "Contact Us",
              image: p.featuredImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
            };
          });
          setDepartures(mapped);
          localStorage.setItem("klik_admin_departures_selector", JSON.stringify(mapped));
        } else {
          const saved = localStorage.getItem("klik_admin_departures_selector");
          if (saved) {
            setDepartures(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.error("DreamHolidaySelector: Failed to load departures", err);
      }
    }

    loadData();
  }, [locale]);

  const tripTypes = [
    { 
      name: locale === "id" ? "Open Trip" : "Open Trip", 
      subtitle: locale === "id" ? "Perjalanan Terjadwal • Join Small Group" : "Scheduled Tours • Join Small Group",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070",
      link: "/destinations"
    },
    { 
      name: locale === "id" ? "Private Trip" : "Private Trip", 
      subtitle: locale === "id" ? "Itinerary Fleksibel • Bebas Tentukan Tanggal & Peserta" : "Flexible Itinerary • Customize Dates & Group Size",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
      link: "/private-trip"
    },
  ];

  const filteredDepartures = activePeriod === "all"
    ? departures
    : departures.filter((d) => d.periodKey === activePeriod);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.25 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284C7]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A89053]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Top Row: Heading, Description & Action Line */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-16"
        >
          {/* Left: Heading */}
          <div>
            <span className="typography-caption block mb-3">
              {t("dream_tag")}
            </span>
            <h2 className="typography-section !text-4xl sm:!text-5xl lg:!text-[3.5rem] tracking-tight leading-tight">
              {t("dream_title")}
            </h2>
          </div>
          
          {/* Right: Description & Action */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center w-full gap-8 xl:gap-12 xl:ml-12">
            <p className="typography-body text-slate-600/90 max-w-2xl">
              {t("dream_desc")}
            </p>
            <div className="flex items-center gap-6 flex-grow w-full mt-4 lg:mt-0">
              <Link href="/destinations" className="font-sans text-[10px] md:text-[11px] tracking-[0.25em] font-bold text-[#0F2C59] uppercase hover:text-[#0284C7] transition-colors whitespace-nowrap flex items-center gap-2 group">
                <span>{t("dream_btn_all_destinations")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="h-[1px] bg-[#A89053]/40 flex-grow min-w-[80px]" />
            </div>
          </div>
        </motion.div>

        {/* Line-Art Tabs Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="w-full border-b border-[#0F2C59]/10 relative flex flex-row justify-between md:justify-center items-end gap-1 sm:gap-6 md:gap-12 lg:gap-16 mb-12 md:mb-16 px-0 md:px-2"
        >
          
          {/* Tab: Destinasi */}
          <button 
            onClick={() => setActiveTab("destinasi")}
            className={`relative flex flex-col items-center justify-end flex-1 md:flex-none px-2 sm:px-8 md:px-12 lg:px-16 pt-6 pb-4 md:pt-8 md:pb-5 transition-all duration-300 rounded-t-2xl md:rounded-t-3xl min-w-[30%] md:min-w-[140px] ${
              activeTab === "destinasi" ? "bg-white shadow-sm border border-b-0 border-[#0F2C59]/10" : "hover:bg-white/50"
            }`}
          >
            <Compass strokeWidth={1.25} className={`w-7 h-7 md:w-9 md:h-9 transition-colors duration-300 ${activeTab === "destinasi" ? "text-[#0F2C59]" : "text-[#0F2C59]/40"}`} />
            <span className={`font-sans text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-bold mt-3 md:mt-4 transition-colors duration-300 text-center ${
              activeTab === "destinasi" ? "text-[#0F2C59]" : "text-[#0F2C59]/50"
            }`}>
              {t("dream_tab_destinasi")}
            </span>
            {activeTab === "destinasi" && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-12 md:w-20 h-[3px] bg-[#0284C7] rounded-full" />
            )}
          </button>
          
          {/* Tab: Tipe Perjalanan */}
          <button 
            onClick={() => setActiveTab("tipe")}
            className={`relative flex flex-col items-center justify-end flex-1 md:flex-none px-2 sm:px-8 md:px-12 lg:px-16 pt-6 pb-4 md:pt-8 md:pb-5 transition-all duration-300 rounded-t-2xl md:rounded-t-3xl min-w-[30%] md:min-w-[140px] ${
              activeTab === "tipe" ? "bg-white shadow-sm border border-b-0 border-[#0F2C59]/10" : "hover:bg-white/50"
            }`}
          >
            <Milestone strokeWidth={1.25} className={`w-7 h-7 md:w-9 md:h-9 transition-colors duration-300 ${activeTab === "tipe" ? "text-[#0F2C59]" : "text-[#0F2C59]/40"}`} />
            <span className={`font-sans text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-bold mt-3 md:mt-4 transition-colors duration-300 text-center ${
              activeTab === "tipe" ? "text-[#0F2C59]" : "text-[#0F2C59]/50"
            }`}>
              {t("dream_tab_tipe")}
            </span>
            {activeTab === "tipe" && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-12 md:w-20 h-[3px] bg-[#0284C7] rounded-full" />
            )}
          </button>
          
          {/* Tab: Waktu Keberangkatan */}
          <button 
            onClick={() => setActiveTab("waktu")}
            className={`relative flex flex-col items-center justify-end flex-1 md:flex-none px-2 sm:px-8 md:px-12 lg:px-16 pt-6 pb-4 md:pt-8 md:pb-5 transition-all duration-300 rounded-t-2xl md:rounded-t-3xl min-w-[30%] md:min-w-[140px] ${
              activeTab === "waktu" ? "bg-white shadow-sm border border-b-0 border-[#0F2C59]/10" : "hover:bg-white/50"
            }`}
          >
            <div className="relative">
              <CalendarDays strokeWidth={1.25} className={`w-7 h-7 md:w-9 md:h-9 transition-colors duration-300 ${activeTab === "waktu" ? "text-[#0F2C59]" : "text-[#0F2C59]/40"}`} />
              <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
            </div>
            <span className={`font-sans text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-bold mt-3 md:mt-4 transition-colors duration-300 text-center leading-tight ${
              activeTab === "waktu" ? "text-[#0F2C59]" : "text-[#0F2C59]/50"
            }`}>
              {t("dream_tab_jadwal")}
            </span>
            {activeTab === "waktu" && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-12 md:w-20 h-[3px] bg-[#0284C7] rounded-full" />
            )}
          </button>

        </motion.div>

        {/* Content Grids */}
        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: DESTINASI */}
            {activeTab === "destinasi" && (
              <motion.div
                key="destinasi"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {destinations.map((dest, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="relative block w-full aspect-[4/3] rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-[#0F2C59]/10"
                    >
                      <img
                        src={dest.image}
                        alt={locale === "id" ? dest.nameID : dest.nameEN}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                          <span className="font-mono text-[9px] tracking-[0.3em] text-white/80 uppercase block mb-1">
                            {t("dream_card_featured")}
                          </span>
                          <h3 className="text-white text-3xl font-serif tracking-wide drop-shadow-md group-hover:translate-x-1 transition-transform">
                            {locale === "id" ? dest.nameID : dest.nameEN}
                          </h3>
                        </div>
                        <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0284C7] transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* TAB 2: TIPE PERJALANAN */}
            {activeTab === "tipe" && (
              <motion.div
                key="tipe"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {tripTypes.map((trip, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Link
                      href={trip.link}
                      className="relative block w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-[#0F2C59]/10"
                    >
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors duration-500" />
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-[#38BDF8] uppercase font-bold mb-2">
                          KLIK TRAVEL EXCLUSIVE
                        </span>
                        <h3 className="text-white text-3xl md:text-5xl font-serif tracking-wide mb-2 drop-shadow-lg">
                          {trip.name}
                        </h3>
                        <p className="text-white/80 font-sans text-xs md:text-sm font-light max-w-md">
                          {trip.subtitle}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* TAB 3: WAKTU KEBERANGKATAN (LUXURY DEPARTURE SCHEDULE) */}
            {activeTab === "waktu" && (
              <motion.div
                key="waktu"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-10"
              >
                {/* Month & Season Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-2 border-b border-[#0F2C59]/10 pb-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#0F2C59]/60 font-semibold uppercase mr-2 hidden sm:inline">
                    {t("dream_filter_title")}
                  </span>
                  
                  {[
                    { id: "all", label: t("dream_filter_all") },
                    { id: "agu-sep", label: t("dream_filter_p1") },
                    { id: "okt-nov", label: t("dream_filter_p2") },
                    { id: "des", label: t("dream_filter_p3") },
                    { id: "spring", label: t("dream_filter_p4") },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePeriod(p.id)}
                      className={`px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all duration-300 ${
                        activePeriod === p.id
                          ? "bg-[#0F2C59] text-white shadow-md shadow-[#0F2C59]/20"
                          : "bg-white text-[#0F2C59]/70 hover:bg-[#0F2C59]/5 border border-[#0F2C59]/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Departure Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDepartures.map((item) => {
                    const statusStyles = {
                      guaranteed: "bg-[#10B981]/15 text-[#047857] border-[#10B981]/30",
                      limited: "bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30",
                      bestseller: "bg-[#0284C7]/15 text-[#0369A1] border-[#0284C7]/30",
                      promo: "bg-[#A89053]/15 text-[#856D34] border-[#A89053]/30",
                    };

                    const title = locale === "id" ? item.titleID : item.titleEN;
                    const destination = locale === "id" ? item.destinationID : item.destinationEN;
                    const dates = locale === "id" ? item.datesID : item.datesEN;
                    const duration = locale === "id" ? item.durationID : item.durationEN;

                    const statusLabel = {
                      guaranteed: locale === "id" ? "AVAILABLE" : "AVAILABLE",
                      limited: locale === "id" ? "SISA 3 SEAT" : "ONLY 3 SEATS LEFT",
                      bestseller: locale === "id" ? "BEST SELLER" : "BEST SELLER",
                      promo: item.id === "6" 
                        ? (locale === "id" ? "PENDAFTARAN DIBUKA" : "OPEN REGISTRATION") 
                        : (locale === "id" ? "PROMO EARLY BIRD" : "EARLY BIRD PROMO")
                    }[item.statusType];

                    const displayPrice = locale === "id" ? item.price : item.price.replace("JT", "M");

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="bg-white rounded-3xl overflow-hidden border border-[#0F2C59]/10 shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Container with Floating Badges */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                            <img
                              src={item.image}
                              alt={title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                            
                            {/* Date Badge Top Left */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0F2C59] px-4 py-1.5 rounded-full font-mono text-[10px] md:text-xs font-bold tracking-wider shadow-sm flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-[#0284C7]" />
                              <span>{dates}</span>
                            </div>

                            {/* Airline Tag Bottom Left */}
                            {item.airline && (
                              <div className="absolute bottom-3 left-4 text-white/90 font-sans text-[11px] font-medium flex items-center gap-1.5 drop-shadow-md">
                                <Plane className="w-3.5 h-3.5 text-[#38BDF8]" />
                                <span>{item.airline}</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content Body */}
                          <div className="p-6 md:p-7">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-mono text-[10px] tracking-[0.25em] text-[#A89053] font-bold uppercase block">
                                {destination}
                              </span>
                              
                              {/* Status Badge */}
                              <div className={`px-2.5 py-0.5 rounded-full font-sans text-[9px] font-bold tracking-wider uppercase border flex items-center gap-1 ${statusStyles[item.statusType]}`}>
                                {item.statusType === "guaranteed" && (
                                  <span className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
                                )}
                                {item.statusType === "limited" && (
                                  <Flame className="w-2.5 h-2.5 text-[#F59E0B]" />
                                )}
                                <span>{statusLabel}</span>
                              </div>
                            </div>
                            <h3 className="typography-package-title mb-3 group-hover:text-[#0284C7] transition-colors">
                              {title}
                            </h3>
                            
                            <div className="flex items-center gap-3 font-sans text-xs text-[#0F2C59]/70 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#0F2C59]/50" />
                                <span>{duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Price & Direct Booking CTA */}
                        <div className="px-6 md:px-7 pb-6 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-2">
                          <div>
                            <span className="typography-caption !text-[9px] text-[#0F2C59]/50 block mb-0.5">
                              {t("dream_card_from")}
                            </span>
                            <span className="typography-price text-[#A89053]">
                              {displayPrice}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/6281230011027?text=${encodeURIComponent(
                              locale === "id"
                                ? `Halo Klik Travel ID, saya ingin menanyakan info seat & itinerary untuk *${title}* jadwal keberangkatan *${dates}*.`
                                : `Hello Klik Travel ID, I'd like to ask about seat availability & itinerary for *${title}* departing on *${dates}*.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0F2C59] hover:bg-[#0284C7] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-colors duration-300 shadow-md flex items-center gap-1.5 group-hover:translate-x-0.5"
                          >
                            <span>{t("dream_card_reserve")}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Callout banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0F2C59] to-[#1E40AF] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#38BDF8] font-bold block mb-1">
                      {t("dream_custom_banner_tag")}
                    </span>
                    <h4 className="typography-section !text-2xl md:!text-3xl text-white">
                      {t("dream_custom_banner_title")}
                    </h4>
                    <p className="typography-body text-white/80 mt-1 max-w-xl">
                      {t("dream_custom_banner_desc")}
                    </p>
                  </div>

                  <Link
                    href="/private-trip"
                    className="shrink-0 bg-white hover:bg-ivory text-[#0F2C59] font-sans font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-colors shadow-lg"
                  >
                    {t("dream_custom_banner_btn")}
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
