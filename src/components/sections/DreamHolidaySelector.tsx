"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Compass, Milestone, CalendarDays, Plane, Clock, Flame, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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

  const destinations = [
    { nameID: "China", nameEN: "China", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070", slug: "china" },
    { nameID: "Eropa", nameEN: "Europe", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2070", slug: "europe" },
    { nameID: "Indonesia", nameEN: "Indonesia", image: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=2070", slug: "indonesia" },
    { nameID: "Jepang", nameEN: "Japan", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092", slug: "japan" },
    { nameID: "Korea", nameEN: "Korea", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2074", slug: "korea" },
    { nameID: "Thailand", nameEN: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070", slug: "thailand" },
  ];

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

  const departures: DepartureSchedule[] = [
    {
      id: "1",
      titleID: "Ekspedisi Berlayar Phinisi Komodo",
      titleEN: "Komodo Phinisi Sailing Expedition",
      destinationID: "Labuan Bajo, Indonesia",
      destinationEN: "Labuan Bajo, Indonesia",
      datesID: "12 — 16 AGU 2026",
      datesEN: "12 — 16 AUG 2026",
      periodKey: "agu-sep",
      airline: "Garuda Indonesia",
      durationID: "5 Hari 4 Malam",
      durationEN: "5 Days 4 Nights",
      statusType: "guaranteed",
      price: "IDR 24.5 JT",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200"
    },
    {
      id: "2",
      titleID: "Dedaunan Musim Gugur di Kyoto & Gunung Fuji",
      titleEN: "Autumn Leaves in Kyoto & Mount Fuji",
      destinationID: "Jepang",
      destinationEN: "Japan",
      datesID: "10 — 17 NOV 2026",
      datesEN: "10 — 17 NOV 2026",
      periodKey: "okt-nov",
      airline: "Japan Airlines",
      durationID: "8 Hari 7 Malam",
      durationEN: "8 Days 7 Nights",
      statusType: "limited",
      price: "IDR 28.9 JT",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200"
    },
    {
      id: "3",
      titleID: "Keajaiban Musim Dingin Harbin & Festival Es",
      titleEN: "Winter Wonder Harbin & Ice Festival",
      destinationID: "Harbin & Beijing, China",
      destinationEN: "Harbin & Beijing, China",
      datesID: "20 — 28 DES 2026",
      datesEN: "20 — 28 DEC 2026",
      periodKey: "des",
      airline: "Cathay Pacific",
      durationID: "9 Hari 8 Malam",
      durationEN: "9 Days 8 Nights",
      statusType: "bestseller",
      price: "IDR 31.5 JT",
      image: "https://images.unsplash.com/photo-1508804185872-d7bad1006fc5?q=80&w=1200"
    },
    {
      id: "4",
      titleID: "Penyembuhan Spiritual & Sacred Bali",
      titleEN: "Spiritual Healing & Sacred Bali Retreat",
      destinationID: "Ubud & Sidemen, Indonesia",
      destinationEN: "Ubud & Sidemen, Indonesia",
      datesID: "04 — 09 DES 2026",
      datesEN: "04 — 09 DEC 2026",
      periodKey: "des",
      airline: "Garuda Indonesia",
      durationID: "6 Hari 5 Malam",
      durationEN: "6 Days 5 Nights",
      statusType: "promo",
      price: "IDR 15.5 JT",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200"
    },
    {
      id: "5",
      titleID: "Pulau Jeju & Seoul Nuansa Musim Gugur",
      titleEN: "Jeju Island & Seoul Autumn Palette",
      destinationID: "Korea Selatan",
      destinationEN: "South Korea",
      datesID: "15 — 22 OKT 2026",
      datesEN: "15 — 22 OCT 2026",
      periodKey: "okt-nov",
      airline: "Korean Air",
      durationID: "8 Hari 7 Malam",
      durationEN: "8 Days 7 Nights",
      statusType: "guaranteed",
      price: "IDR 22.0 JT",
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200"
    },
    {
      id: "6",
      titleID: "Ekspedisi Agung Bunga Sakura 2027",
      titleEN: "Sakura Blossom Grand Expedition 2027",
      destinationID: "Tokyo, Kyoto & Osaka, Jepang",
      destinationEN: "Tokyo, Kyoto & Osaka, Japan",
      datesID: "02 — 10 APR 2027",
      datesEN: "02 — 10 APR 2027",
      periodKey: "spring",
      airline: "Singapore Airlines",
      durationID: "9 Hari 8 Malam",
      durationEN: "9 Days 8 Nights",
      statusType: "promo",
      price: "IDR 34.8 JT",
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200"
    }
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
    <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
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
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#A89053] font-bold block mb-3">
              {t("dream_tag")}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-serif text-[#0F2C59] tracking-tight leading-tight">
              {t("dream_title")}
            </h2>
          </div>
          
          {/* Right: Description & Action */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center w-full gap-8 xl:gap-12 xl:ml-12">
            <p className="text-sm md:text-base text-[#0F2C59]/75 max-w-2xl font-sans font-light leading-relaxed">
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
                      guaranteed: locale === "id" ? "PASTI JALAN" : "GUARANTEED",
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

                            {/* Status Badge Top Right */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full font-sans text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${statusStyles[item.statusType]}`}>
                              {item.statusType === "guaranteed" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                              )}
                              {item.statusType === "limited" && (
                                <Flame className="w-3 h-3 text-[#F59E0B]" />
                              )}
                              <span>{statusLabel}</span>
                            </div>

                            {/* Airline Tag Bottom Left */}
                            <div className="absolute bottom-3 left-4 text-white/90 font-sans text-[11px] font-medium flex items-center gap-1.5 drop-shadow-md">
                              <Plane className="w-3.5 h-3.5 text-[#38BDF8]" />
                              <span>{item.airline}</span>
                            </div>
                          </div>

                          {/* Card Content Body */}
                          <div className="p-6 md:p-7">
                            <span className="font-mono text-[10px] tracking-[0.25em] text-[#A89053] font-bold uppercase block mb-1">
                              {destination}
                            </span>
                            <h3 className="font-serif text-xl md:text-2xl font-normal text-[#0F2C59] leading-snug mb-3 group-hover:text-[#0284C7] transition-colors">
                              {title}
                            </h3>
                            
                            <div className="flex items-center gap-3 font-sans text-xs text-[#0F2C59]/70 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#0F2C59]/50" />
                                <span>{duration}</span>
                              </div>
                              <span>•</span>
                              <span>{t("dream_card_small_group")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Price & Direct Booking CTA */}
                        <div className="px-6 md:px-7 pb-6 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-2">
                          <div>
                            <span className="font-sans text-[9px] uppercase tracking-widest text-[#0F2C59]/50 block">
                              {t("dream_card_from")}
                            </span>
                            <span className="font-serif text-lg md:text-xl font-bold text-[#0F2C59]">
                              {displayPrice}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/628123456789?text=${encodeURIComponent(
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
                    <h4 className="font-serif text-2xl md:text-3xl">
                      {t("dream_custom_banner_title")}
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-white/80 font-light mt-1 max-w-xl">
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
