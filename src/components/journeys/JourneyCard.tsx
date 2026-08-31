"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Journey } from "@/data/journeys";
import { useLanguage } from "@/context/LanguageContext";
import { getJourneyDestinationUrl } from "@/lib/utils";

interface JourneyCardProps {
  journey: Journey;
  index: number;
}

export function JourneyCard({ journey, index }: JourneyCardProps) {
  const { t } = useLanguage();
  const layoutType = index % 5;
  const detailUrl = getJourneyDestinationUrl(journey);

  const cardVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  // Common inner content details
  const details = (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-center gap-2">
        {(journey.durationLabel || journey.dates) && (
          <span className="typography-caption !text-charcoal/60 block mb-1">
            {[journey.durationLabel, journey.dates].filter(Boolean).join(" • ")}
          </span>
        )}
        {journey.status && (
          <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shrink-0 ${
            journey.status === "Closed" || journey.status === "inactive" || journey.status === "CLOSED"
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : journey.status === "Draft" || journey.status === "draft" || journey.status === "DRAFT"
                ? "bg-slate-100 text-slate-500 border border-slate-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}>
            {journey.status}
          </span>
        )}
      </div>
      
      <h3 className="typography-card text-foreground group-hover:text-[#0284C7] transition-colors duration-300 flex items-center justify-between">
        <span>{journey.title}</span>
        <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#0284C7] ml-4" />
      </h3>
      
      {(journey.destination || journey.travelStyle) && (
        <p className="typography-caption !text-[#0284C7] block mt-1">
          {[journey.destination, journey.travelStyle].filter(Boolean).join(" — ")}
        </p>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-charcoal/10 mt-3">
        <span className="typography-price !text-sm text-foreground/90">
          {journey.price}
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold flex items-center space-x-1">
          <span>{t("journeys_view_journey") || "EXPLORE"}</span>
          <ArrowRight size={10} />
        </span>
      </div>
    </div>
  );

  // 1. TOUR 01: Large horizontal image + text underneath
  if (layoutType === 0) {
    return (
      <motion.div 
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="col-span-12 md:col-span-8 group block"
      >
        <Link href={detailUrl} className="cursor-pointer">
          <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative shadow-lg">
            <img src={journey.image} alt={journey.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
          </div>
          <div className="mt-6 md:mt-8 max-w-xl">
            {details}
          </div>
        </Link>
      </motion.div>
    );
  }

  // 2. TOUR 02: Vertical image + info beside it
  if (layoutType === 1) {
    return (
      <motion.div 
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="col-span-12 group block"
      >
        <Link href={detailUrl} className="cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center">
          <div className="col-span-12 md:col-span-5">
            <div className="w-full aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden relative shadow-xl">
              <img src={journey.image} alt={journey.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 max-w-md">
            {details}
            {journey.introDescription && (
              <p className="typography-body text-foreground/70 mt-4 md:mt-5 line-clamp-3">
                {journey.introDescription}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // 3. TOUR 03: Full-width image with floating information
  if (layoutType === 2) {
    return (
      <motion.div 
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="col-span-12 group block"
      >
        <Link href={detailUrl} className="cursor-pointer relative block">
          {/* Image wrapper with overflow hidden */}
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden relative shadow-2xl">
            <img src={journey.image} alt={journey.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500" />
          </div>
          
          {/* Floating content positioned relative to the Link wrapper, not the overflow-hidden div */}
          <div className="relative mt-6 mx-4 md:mx-0 md:absolute md:bottom-12 md:left-12 md:right-auto md:w-[480px] z-20 bg-white/95 backdrop-blur-xl rounded-2xl p-5 md:p-8 shadow-2xl border border-white/20 transform md:group-hover:-translate-y-2 transition-transform duration-500">
            {details}
          </div>
        </Link>
      </motion.div>
    );
  }

  // 4. TOUR 04: Asymmetric split layout
  if (layoutType === 3) {
    return (
      <motion.div 
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="col-span-12 md:col-span-7 md:ml-auto group block"
      >
        <Link href={detailUrl} className="cursor-pointer">
          <div className="w-full md:w-[95%] aspect-[4/3] rounded-3xl overflow-hidden relative shadow-lg md:ml-auto">
            <img src={journey.image} alt={journey.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="mt-6 md:mt-8 max-w-md mx-4 md:mx-0 md:ml-12">
            {details}
          </div>
        </Link>
      </motion.div>
    );
  }

  // 5. TOUR 05: Minimal image + oversized typography
  return (
    <motion.div 
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="col-span-12 group block"
    >
      <Link href={detailUrl} className="cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
        <div className="col-span-12 md:col-span-4">
          <div className="w-full aspect-square rounded-full overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-shadow duration-500 max-w-[300px] mx-auto md:mx-0">
            <img src={journey.image} alt={journey.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-8 flex flex-col justify-center">
          {(journey.durationLabel || journey.dates || journey.travelStyle) && (
            <span className="typography-caption !text-[#0284C7] block mb-3">
              {[journey.durationLabel, journey.dates, journey.travelStyle].filter(Boolean).join(" • ")}
            </span>
          )}
          <h3 className="typography-hero text-foreground group-hover:text-[#0284C7] group-hover:translate-x-2 transition-all duration-300 flex items-center justify-between border-b border-charcoal/10 pb-6 mb-6">
            <span>{journey.title}</span>
            <ArrowRight size={32} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#0284C7]" />
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-charcoal/60">
              {journey.destination || ""}
            </span>
            <span className="typography-price !text-base text-foreground/90">
              {journey.price}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
