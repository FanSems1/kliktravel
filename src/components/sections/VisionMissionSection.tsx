"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const missions = [
  {
    number: "01",
    titleID: "Pelayanan Prima",
    titleEN: "Stellar Service",
    textID: "Mengutamakan kepuasan dan kenyamanan pelanggan di setiap perjalanan.",
    textEN: "Prioritizing client satisfaction and comfort across every single tour.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600",
  },
  {
    number: "02",
    titleID: "Harga Kompetitif",
    titleEN: "Competitive Rates",
    textID: "Paket wisata domestik & internasional berkualitas dengan harga terjangkau.",
    textEN: "High-quality domestic & international travel packages at friendly rates.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600",
  },
  {
    number: "03",
    titleID: "Kemitraan Profesional",
    titleEN: "Professional Partnerships",
    textID: "Bekerja sama dengan mitra terpercaya untuk pengalaman perjalanan terbaik.",
    textEN: "Collaborating with premium trusted operators to ensure exceptional experiences.",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=600",
  },
  {
    number: "04",
    titleID: "Inovasi Digital",
    titleEN: "Digital Innovation",
    textID: "Pemesanan perjalanan lebih mudah dan praktis melalui layanan digital.",
    textEN: "Seamless and convenient tour booking via smart digital platforms.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600",
  },
  {
    number: "05",
    titleID: "Sahabat Perjalanan",
    titleEN: "Your Travel Companion",
    textID: "Menjadi teman perjalanan yang dapat dipercaya untuk setiap momen liburan.",
    textEN: "Being the reliable travel companion for all your unforgettable holiday moments.",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=600",
  },
];

type Tab = "visi" | "misi";

export function VisionMissionSection() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("visi");
  const [missionIndex, setMissionIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const goNext = () => { setDir(1); setMissionIndex((p) => (p + 1) % missions.length); };
  const goPrev = () => { setDir(-1); setMissionIndex((p) => (p - 1 + missions.length) % missions.length); };
  const m = missions[missionIndex];

  const missionVariants = {
    initial: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 })
  };

  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC] relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16"
      >

        {/* Header + Tabs in one row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-[#0F2C59] tracking-tight">
            {t("vision_title")}
          </h2>

          {/* Tab switcher */}
          <div className="flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            {(["visi", "misi"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "text-white"
                    : "text-[#0F2C59]/50 hover:text-[#0F2C59]"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="vm-tab"
                    className="absolute inset-0 bg-[#0F2C59] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "visi" ? t("vision_tab_vision") : t("vision_tab_mission")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">

          {/* VISI */}
          {activeTab === "visi" && (
            <motion.div
              key="visi"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                {/* Image side */}
                <div className="relative h-52 md:h-auto md:min-h-[280px]">
                  <img
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=900"
                    alt="Travel scenery"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F2C59]/60 to-[#0F2C59]/20 md:bg-gradient-to-r md:from-transparent md:to-[#0F2C59]/30" />
                </div>

                {/* Text side */}
                <div className="bg-[#0F2C59] p-8 md:p-10 flex flex-col justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.15),transparent_60%)]" />
                  <div className="relative z-10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#38BDF8] block mb-4">
                      {t("vision_tab_vision")}
                    </span>
                    <p className="font-serif text-lg md:text-xl text-white/95 leading-relaxed">
                      {locale === "id"
                        ? "Menjadi perusahaan tour & travel terpercaya di Indonesia yang menghadirkan pengalaman perjalanan berkualitas, aman, dan berkesan bagi setiap pelanggan."
                        : "To become the most trusted tour & travel company in Indonesia, rendering high-quality, secure, and memorable journeys for every single client."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MISI */}
          {activeTab === "misi" && (
            <motion.div
              key="misi"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <div className="relative flex items-center gap-3 md:gap-5">

                {/* Prev */}
                <button
                  onClick={goPrev}
                  className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 bg-white hover:bg-[#0F2C59] hover:border-[#0F2C59] text-[#0F2C59]/50 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Card */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence custom={dir} mode="wait">
                    <motion.div
                      key={missionIndex}
                      custom={dir}
                      variants={missionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white"
                    >
                      {/* Image */}
                      <div className="relative h-44 md:h-auto md:col-span-2">
                        <img
                          src={m.image}
                          alt={locale === "id" ? m.titleID : m.titleEN}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/30 to-transparent" />
                        {/* Number badge */}
                        <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4 md:left-4 bg-[#0F2C59] text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                          {m.number} / 05
                        </div>
                      </div>

                      {/* Text */}
                      <div className="p-6 md:p-8 md:col-span-3 flex flex-col justify-center">
                        <h3 className="font-sans font-bold text-lg md:text-xl text-[#0F2C59] mb-2">
                          {locale === "id" ? m.titleID : m.titleEN}
                        </h3>
                        <p className="font-sans text-sm md:text-base text-[#0F2C59]/70 font-light leading-relaxed">
                          {locale === "id" ? m.textID : m.textEN}
                        </p>

                        {/* Progress */}
                        <div className="flex items-center gap-2 mt-5">
                          {missions.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full transition-all duration-400 ${
                                i === missionIndex
                                  ? "w-8 bg-[#0284C7]"
                                  : "w-3 bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Next */}
                <button
                  onClick={goNext}
                  className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 bg-white hover:bg-[#0F2C59] hover:border-[#0F2C59] text-[#0F2C59]/50 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </motion.div>
    </section>
  );
}
