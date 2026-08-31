"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  MapPin, 
  Compass, 
  BookOpen, 
  FileText, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { localizedRegions } from "@/data/destinations";
import { localizedJourneys } from "@/data/journeys";
import { useLanguage } from "@/context/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  category: "destination" | "journey" | "page";
  categoryLabel: string;
  subtitle?: string;
  url: string;
  image?: string;
  badge?: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { locale } = useLanguage();
  const router = useRouter();
  const isEn = locale === "en";

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard navigation & Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Build Search Index
  const searchIndex = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Static Pages
    const staticPages = [
      {
        title: isEn ? "Home Page" : "Beranda Utama",
        subtitle: isEn ? "Klik Travel ID Main Portal" : "Portal utama Klik Travel ID",
        url: "/",
        badge: "Page"
      },
      {
        title: isEn ? "Open Trip Catalog" : "Katalog Open Trip",
        subtitle: isEn ? "Join scheduled group departures" : "Daftar perjalanan open trip gabungan",
        url: "/journeys",
        badge: "Open Trip"
      },
      {
        title: isEn ? "Private Trip & Custom Tour" : "Private Trip & Custom Tour",
        subtitle: isEn ? "Custom tailored travel for family & groups" : "Rancang perjalanan privat keluarga & grup",
        url: "/private-trip",
        badge: "Private"
      },
      {
        title: isEn ? "All Destinations" : "Semua Destinasi Wisata",
        subtitle: isEn ? "Browse Indonesia & International regions" : "Jelajahi wilayah wisata Indonesia & Dunia",
        url: "/destinations",
        badge: "Explore"
      },
      {
        title: isEn ? "About Us" : "Tentang Kami",
        subtitle: isEn ? "Meet our team & story" : "Mengenal sahabat perjalanan Klik Travel ID",
        url: "/about",
        badge: "Info"
      },

      {
        title: isEn ? "Trip Consultation & Inquiry" : "Konsultasi & Inquiry Perjalanan",
        subtitle: isEn ? "Direct consultation with travel specialists" : "Formulir & WhatsApp konsultasi perjalanan",
        url: "/inquire",
        badge: "Form"
      },
      {
        title: isEn ? "Frequently Asked Questions (FAQ)" : "Pertanyaan Umum (FAQ)",
        subtitle: isEn ? "Common queries regarding bookings & trips" : "Informasi seputar pemesanan & perjalanan",
        url: "/faq",
        badge: "Help"
      },
      {
        title: isEn ? "Contact Us" : "Kontak Kami",
        subtitle: isEn ? "Get in touch with Klik Travel ID" : "Hubungi tim layanan pelanggan kami",
        url: "/contact",
        badge: "Contact"
      },
      {
        title: isEn ? "Terms & Conditions" : "Syarat & Ketentuan",
        subtitle: isEn ? "Service terms & booking policies" : "Ketentuan layanan & aturan pemesanan",
        url: "/terms",
        badge: "Legal"
      },
      {
        title: isEn ? "Privacy Policy" : "Kebijakan Privasi",
        subtitle: isEn ? "How we protect your data" : "Perlindungan data pengguna",
        url: "/privacy",
        badge: "Legal"
      }
    ];

    staticPages.forEach((p, idx) => {
      items.push({
        id: `page-${idx}`,
        title: p.title,
        category: "page",
        categoryLabel: isEn ? "Pages & Info" : "Halaman & Informasi",
        subtitle: p.subtitle,
        url: p.url,
        badge: p.badge
      });
    });

    // 2. Destinations & Sub-destinations
    const regions = localizedRegions[locale] || localizedRegions["id"] || [];
    regions.forEach((region) => {
      items.push({
        id: `region-${region.slug}`,
        title: region.name,
        category: "destination",
        categoryLabel: isEn ? "Destinations" : "Destinasi Wisata",
        subtitle: region.subtitle || (isEn ? `Explore ${region.name}` : `Jelajahi wisata ${region.name}`),
        url: `/destinations/${region.slug}`,
        image: region.image,
        badge: "Region"
      });

      if (region.subDestinations) {
        region.subDestinations.forEach((sub) => {
          items.push({
            id: `sub-${region.slug}-${sub.slug}`,
            title: `${sub.name} (${region.name})`,
            category: "destination",
            categoryLabel: isEn ? "Destinations" : "Destinasi Wisata",
            subtitle: isEn ? `Popular spot in ${region.name}` : `Destinasi populer di ${region.name}`,
            url: `/destinations/${region.slug}/${sub.slug}`,
            image: sub.image || region.image,
            badge: "Spot"
          });
        });
      }
    });

    // 3. Journeys (Open Trips)
    const journeysList = localizedJourneys[locale] || localizedJourneys["id"] || [];
    journeysList.forEach((j) => {
      items.push({
        id: `journey-${j.id || j.slug}`,
        title: j.title,
        category: "journey",
        categoryLabel: isEn ? "Open Trips" : "Paket Open Trip",
        subtitle: `${j.destination} • ${j.durationLabel} • ${j.price}`,
        url: `/journeys/${j.slug}`,
        image: j.image,
        badge: j.travelStyle || "Trip"
      });
    });



    // Strict Filter: Remove any admin routes if any exist
    return items.filter((item) => !item.url.startsWith("/admin") && !item.url.includes("admin"));
  }, [locale, isEn]);

  // Filtered Search Results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show curated suggestions when empty query
      return searchIndex.filter(i => 
        i.url === "/journeys" || 
        i.url === "/private-trip" || 
        i.url === "/destinations/indonesia" || 
        i.url === "/destinations/japan" ||
        i.url === "/destinations/korea"
      );
    }

    return searchIndex.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
      const matchBadge = item.badge ? item.badge.toLowerCase().includes(q) : false;
      return matchTitle || matchSubtitle || matchBadge;
    });
  }, [query, searchIndex]);

  const handleSelectResult = (url: string) => {
    onClose();
    router.push(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "destination":
        return <MapPin size={16} className="text-[#0284C7]" />;
      case "journey":
        return <Compass size={16} className="text-amber-500" />;
      default:
        return <FileText size={16} className="text-purple-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Header */}
            <div className="relative border-b border-slate-100 p-4 sm:p-5 flex items-center gap-3 bg-slate-50/50">
              <Search size={22} className="text-slate-400 shrink-0 ml-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={isEn ? "Search destinations, open trips..." : "Cari destinasi, paket open trip..."}
                className="w-full bg-transparent font-sans text-base sm:text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="ml-1 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-header / Quick Hint */}
            <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-100 flex items-center justify-between text-[11px] font-sans text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles size={12} className="text-[#0284C7]" />
                {query ? (
                  isEn ? `Found ${filteredResults.length} matches` : `Menampilkan ${filteredResults.length} hasil`
                ) : (
                  isEn ? "Recommended Searches" : "Rekomendasi Pencarian Popular"
                )}
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-slate-400 uppercase">
                [ESC] Close
              </span>
            </div>

            {/* Search Results List */}
            <div className="overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 space-y-1">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => handleSelectResult(item.url)}
                    className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 hover:bg-sky-50/80 cursor-pointer ${
                      idx === selectedIndex ? "bg-sky-50/80 border border-sky-200/60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      {/* Image or Icon */}
                      {item.image ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center shrink-0 border border-slate-200/60 transition-colors">
                          {getCategoryIcon(item.category)}
                        </div>
                      )}

                      {/* Text details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-sans text-sm font-bold text-[#0F2C59] truncate group-hover:text-[#0284C7] transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#0284C7]/10 group-hover:text-[#0284C7] shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="font-sans text-xs text-slate-500 truncate font-light">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0284C7] group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search size={22} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#0F2C59]">
                    {isEn ? "No matching results found" : "Pencarian tidak ditemukan"}
                  </h4>
                  <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto">
                    {isEn
                      ? `We couldn't find anything matching "${query}". Try searching for Bali, Bromo, Open Trip, or Private Trip.`
                      : `Tidak ada hasil untuk "${query}". Coba kata kunci lain seperti Bali, Bromo, Open Trip, atau Private Trip.`}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                Klik Travel ID Search
              </span>
              <Link
                href="/inquire"
                onClick={onClose}
                className="font-bold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 transition-colors"
              >
                <span>{isEn ? "Need Custom Help?" : "Butuh Bantuan Kustom?"}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
