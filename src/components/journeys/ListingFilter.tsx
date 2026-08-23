"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ListingFilterProps {
  selectedDestination: string;
  setSelectedDestination: (val: string) => void;
  selectedStyle: string;
  setSelectedStyle: (val: string) => void;
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  destinationsList: string[];
  stylesList: string[];
  monthsList: string[];
  totalCount: number;
}

export function ListingFilter({
  selectedDestination,
  setSelectedDestination,
  selectedStyle,
  setSelectedStyle,
  selectedMonth,
  setSelectedMonth,
  destinationsList = [],
  stylesList = [],
  monthsList = [],
  totalCount
}: ListingFilterProps) {
  const { locale } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState<"destination" | "style" | "month" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const destinations = [
    { value: "all", label: locale === "id" ? "Semua Destinasi" : "All Destinations" },
    ...destinationsList.map((d) => ({ value: d, label: d }))
  ];

  const styles = [
    { value: "all", label: locale === "id" ? "Semua Gaya" : "All Styles" },
    ...stylesList.map((s) => ({ value: s, label: s }))
  ];

  const months = [
    { value: "all", label: locale === "id" ? "Semua Waktu" : "All Months" },
    ...monthsList.map((m) => ({ value: m, label: m }))
  ];

  const handleSelect = (type: "destination" | "style" | "month", value: string) => {
    if (type === "destination") setSelectedDestination(value);
    if (type === "style") setSelectedStyle(value);
    if (type === "month") setSelectedMonth(value);
    setActiveDropdown(null);
  };

  const renderDropdown = (
    type: "destination" | "style" | "month",
    options: { value: string; label: string }[],
    currentValue: string,
    title: string
  ) => {
    const isActive = activeDropdown === type;
    const currentLabel = options.find(o => o.value === currentValue)?.label || title;

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isActive ? null : type)}
          className={`group flex items-center space-x-2 transition-colors px-5 py-2.5 rounded-full border ${
            isActive || currentValue !== "all" 
              ? "bg-[#0284C7] text-white border-[#0284C7] shadow-md" 
              : "bg-white text-charcoal hover:bg-gray-50 border-gray-200 shadow-sm"
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase font-semibold">
            {currentLabel}
          </span>
          <svg 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={`transition-transform duration-300 ${isActive ? "rotate-180" : "group-hover:translate-y-[2px]"}`}
          >
            <path d="M1 1L5 5L9 1" />
          </svg>
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(type, opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm transition-colors flex items-center justify-between ${
                    currentValue === opt.value 
                      ? "bg-sky-50 text-[#0F2C59] font-bold" 
                      : "text-charcoal hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                  {currentValue === opt.value && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full border-b border-gray-200 pb-8 mb-16 relative z-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex flex-wrap items-center gap-3">
          {renderDropdown("destination", destinations, selectedDestination, locale === "id" ? "Destinasi" : "Destination")}
          {renderDropdown("style", styles, selectedStyle, locale === "id" ? "Gaya Perjalanan" : "Travel Style")}
          {renderDropdown("month", months, selectedMonth, locale === "id" ? "Bulan" : "Month")}
        </div>

        {/* Results Counter */}
        <div className="font-sans text-xs tracking-widest uppercase text-charcoal/50 whitespace-nowrap">
          {locale === "id" 
            ? `Menampilkan ${totalCount} Perjalanan` 
            : `Showing ${totalCount} Curated Journeys`}
        </div>
      </div>
    </div>
  );
}
