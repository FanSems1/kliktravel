"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const testimonialsData = {
  id: [
    {
      text: "Pengalaman private trip ke Jepang bersama Klik Travel sangat luar biasa. Seluruh rute dan jadwal kegiatan disusun sangat rapi, fleksibel, dan sangat perhatian terhadap kenyamanan keluarga kami.",
      name: "Andi Wijaya",
      role: "Verified Traveler",
      trip: "Kyoto & Tokyo Autumn Journey",
      initial: "A",
      rating: 5,
    },
    {
      text: "Sailing Komodo terbaik yang pernah saya rasakan! Fasilitas kapal phinisi sangat mewah, kru profesional, dan hidangan kelas bintang lima setiap harinya. Benar-benar liburan impian.",
      name: "Sarah Lestari",
      role: "Verified Traveler",
      trip: "Luxury Phinisi Sailing Komodo",
      initial: "S",
      rating: 5,
    },
    {
      text: "Layanan eksklusif dari awal konsultasi hingga akhir perjalanan. Kami bisa menikmati liburan keluarga di Swiss Alps tanpa rasa khawatir atau repot sedikitpun. Sangat direkomendasikan!",
      name: "Dimas & Keluarga",
      role: "Verified Traveler",
      trip: "Swiss Alps & Europe Retreat",
      initial: "D",
      rating: 5,
    },
  ],
  en: [
    {
      text: "An absolutely extraordinary private trip to Japan with Klik Travel. The entire itinerary was well-crafted, flexible, and deeply tailored to our family's comfort and preferences.",
      name: "Andi Wijaya",
      role: "Verified Traveler",
      trip: "Kyoto & Tokyo Autumn Journey",
      initial: "A",
      rating: 5,
    },
    {
      text: "The best Komodo sailing trip I have ever experienced! Ultra-luxury phinisi boat facilities, top-tier professional crew, and 5-star meals daily. Truly a dream vacation.",
      name: "Sarah Lestari",
      role: "Verified Traveler",
      trip: "Luxury Phinisi Sailing Komodo",
      initial: "S",
      rating: 5,
    },
    {
      text: "Exclusive, seamless service from consultation to departure. We enjoyed our family retreat in the Swiss Alps with zero stress or hassle. Highly recommended!",
      name: "Dimas & Family",
      role: "Verified Traveler",
      trip: "Swiss Alps & Europe Retreat",
      initial: "D",
      rating: 5,
    },
  ],
};

export function TestimonialsSection() {
  const { locale } = useLanguage();
  const testimonials = testimonialsData[locale] || testimonialsData.id;

  return (
    <section className="bg-ivory text-foreground py-24 md:py-32 relative z-10 border-t border-charcoal/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
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
            {locale === "id" ? "Kisah Impian Yang Terwujud" : "Unforgettable Travel Stories"}
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

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="bg-white rounded-3xl p-8 border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background Accent Quote Icon */}
              <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-100 group-hover:text-amber-100/60 transition-colors duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-sans text-gray-700 text-sm md:text-base leading-relaxed mb-8 italic font-light">
                  "{item.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="relative z-10 flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0F2C59] to-[#0284C7] text-white rounded-full flex items-center justify-center font-serif text-lg font-bold shrink-0 shadow-md">
                  {item.initial}
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
