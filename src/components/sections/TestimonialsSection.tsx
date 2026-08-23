"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewID: string;
  reviewEN: string;
  trip: string;
  approved: boolean;
  avatar?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "TEST-01",
    name: "Rian Dewantara",
    role: "Travel Enthusiast",
    rating: 5,
    reviewID: "Pelayanan KlikTravel sangat luar biasa! Itinerary terencana dengan sangat rapi dan pilihan hotel sangat strategis.",
    reviewEN: "KlikTravel's service was outstanding! The itinerary was beautifully planned and the hotel choices were extremely strategic.",
    trip: "Tokyo Explorer Open Trip",
    approved: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
  },
  {
    id: "TEST-02",
    name: "Amelia Putri",
    role: "Corporate Executive",
    rating: 5,
    reviewID: "Perjalanan private ke Labuan Bajo sangat berkesan. Seluruh kru ramah dan pelayanan sangat memuaskan!",
    reviewEN: "Our private trip to Labuan Bajo was unforgettable. All crew members were warm and the service was super satisfying!",
    trip: "Labuan Bajo Private Trip",
    approved: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
  },
  {
    id: "TEST-03",
    name: "Dimas Wijaya",
    role: "Verified Traveler",
    rating: 5,
    reviewID: "Pelayanan ramah dan profesional dari awal konsultasi hingga akhir perjalanan. Kami bisa menikmati liburan keluarga tanpa rasa khawatir.",
    reviewEN: "Friendly and professional service from consultation to departure. We enjoyed our family retreat with zero stress.",
    trip: "Swiss Alps & Europe Trip",
    approved: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  }
];

export function TestimonialsSection() {
  const { locale } = useLanguage();
  const [list, setList] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      setIsLoading(true);
      try {
        const apiData = await apiFetch<TestimonialItem[]>("/testimonials").catch(() => null);
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const approvedOnly = apiData.filter((t) => t.approved !== false);
          if (approvedOnly.length > 0) {
            setList(approvedOnly);
            setIsLoading(false);
            return;
          }
        }

        const saved = localStorage.getItem("klik_admin_testimonials");
        if (saved) {
          const parsed = JSON.parse(saved) as TestimonialItem[];
          const approvedOnly = parsed.filter((t) => t.approved);
          if (approvedOnly.length > 0) {
            setList(approvedOnly);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Suppress errors and fallback to defaults
      }
      
      // Fallback to curated default testimonials if API and localStorage are empty
      setList(DEFAULT_TESTIMONIALS);
      setIsLoading(false);
    }

    fetchTestimonials();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollOffset = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollOffset : scrollLeft + scrollOffset;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-ivory text-foreground py-16 relative z-10 border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (list.length === 0) {
    return null;
  }

  return (
    <section className="bg-ivory text-foreground py-24 md:py-32 relative z-10 border-t border-charcoal/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs uppercase tracking-[0.35em] text-[#0284C7] font-semibold block mb-3"
            >
              {locale === "id" ? "ULASAN PELANGGAN" : "GUEST TESTIMONIALS"}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-[#0F2C59] tracking-tight leading-tight mb-4"
            >
              {locale === "id" ? "Pengalaman Bersama Klik Travel" : "Experience with Klik Travel"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-foreground/70 text-base md:text-lg font-light leading-relaxed"
            >
              {locale === "id"
                ? "Dengarkan langsung pengalaman berkesan dari para traveler yang telah mempercayakan perjalanan berharga mereka bersama Klik Travel ID."
                : "Hear directly from travelers who have trusted Klik Travel ID to curate their extraordinary life journeys."}
            </motion.p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => handleScroll("left")}
              className="p-4 rounded-full border border-[#0F2C59]/10 text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-4 rounded-full border border-[#0F2C59]/10 text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Wrapper */}
        <div
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8"
        >
          {list.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-charcoal/10 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden shrink-0 w-[85vw] sm:w-[45vw] md:w-[31vw] snap-center min-h-[320px]"
            >
              {/* Background Accent Quote Icon */}
              <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-100 group-hover:text-amber-100/60 transition-colors duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-sans text-gray-700 text-sm md:text-base leading-relaxed mb-8 italic font-light">
                  "{locale === "id" ? item.reviewID : item.reviewEN}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="relative z-10 flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-md bg-slate-50 flex items-center justify-center">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F2C59] to-[#0284C7] text-white flex items-center justify-center font-serif text-lg font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sans font-bold text-[#0F2C59] text-base truncate">
                      {item.name}
                    </h4>
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  </div>
                  <p className="font-sans text-[11px] text-[#A89053] font-semibold uppercase tracking-wider truncate mt-0.5">
                    {item.trip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
