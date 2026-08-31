"use client";

import React from "react";
import { Users, Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function ServicesSection() {
  const { t, locale } = useLanguage();

  const openTripFeatures = locale === "id" ? [
    "Jadwal keberangkatan tersedia dan terbatas",
    "Pilihan destinasi beragam",
    "Harga lebih terjangkau",
    "Bertemu dan berbagi pengalaman dengan traveler lainnya"
  ] : [
    "Departure schedule is available and limited",
    "Diverse destination choices",
    "More affordable pricing",
    "Meet and share experiences with other travelers"
  ];

  const privateTripFeatures = locale === "id" ? [
    "Jadwal dan itinerary fleksibel",
    "Tidak bergabung dengan peserta lain",
    "Cocok untuk keluarga, teman, komunitas, dan corporate",
    "Perjalanan dapat disesuaikan dengan kebutuhan"
  ] : [
    "Flexible schedule and itinerary",
    "No merging with other participants",
    "Ideal for families, friends, communities, and corporate groups",
    "Trips can be tailored to your requirements"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <section className="typography-section-spacing bg-[#0F2C59] text-white relative overflow-hidden">
      
      {/* Background Subtle Pattern/Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.05),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="typography-caption !text-[#38BDF8] block mb-4">
            {t("services_tag")}
          </span>
          <h2 className="typography-section text-white tracking-tight mb-4">
            {t("services_title")}
          </h2>
          <p className="typography-body text-white/70">
            {t("services_desc")}
          </p>
        </motion.div>

        {/* Separated Transparent Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
        >
          
          {/* Card 1: Open Trip */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between min-h-[500px] p-8 md:p-12 transition-all duration-500 hover:shadow-[#38BDF8]/10 hover:border-white/20 cursor-pointer"
          >
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200"
              alt="Open Trip"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            {/* Dark/Blur Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/95 via-[#0F2C59]/80 to-[#0F2C59]/40 backdrop-blur-[2px] transition-all duration-500 group-hover:backdrop-blur-0 group-hover:bg-[#0F2C59]/70" />
            
            {/* Floating Card Content */}
            <div className="relative z-10 flex flex-col h-full justify-between flex-1">
              <div>
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#0284C7] group-hover:border-[#0284C7]/30">
                  <Users className="w-6 h-6" />
                </div>
                
                <h3 className="typography-card text-white tracking-wide mb-4">Open Trip</h3>
                <p className="typography-body text-white/80 mb-8 min-h-[60px]">
                  {locale === "id" 
                    ? "Bergabung dengan perjalanan yang sudah terjadwal dan nikmati liburan bersama peserta lainnya. Pilihan destinasi menarik dengan harga yang lebih terjangkau."
                    : "Join scheduled group trips and enjoy vacations with other participants. Attractive destination choices at more affordable prices."}
                </p>
                
                {/* Checklist */}
                <ul className="space-y-4 mb-12">
                  {openTripFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-[3px] w-4 h-4 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="typography-body !text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Button */}
              <Link 
                href="/destinations" 
                className="typography-button inline-flex items-center gap-3 !text-[#38BDF8] group-hover:text-white transition-colors duration-300 w-max mt-auto"
              >
                <span>{locale === "id" ? "Jelajahi Open Trip" : "Explore Open Trip"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
          
          {/* Card 2: Private Trip */}
          <motion.div 
            variants={itemVariants}
            className="group relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between min-h-[500px] p-8 md:p-12 transition-all duration-500 hover:shadow-[#38BDF8]/10 hover:border-white/20 cursor-pointer"
          >
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200"
              alt="Private Trip"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            {/* Dark/Blur Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/95 via-[#0F2C59]/80 to-[#0F2C59]/40 backdrop-blur-[2px] transition-all duration-500 group-hover:backdrop-blur-0 group-hover:bg-[#0F2C59]/70" />
            
            {/* Floating Card Content */}
            <div className="relative z-10 flex flex-col h-full justify-between flex-1">
              <div>
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-[#0284C7] group-hover:border-[#0284C7]/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <h3 className="typography-card text-white tracking-wide mb-4">Private Trip</h3>
                <p className="typography-body text-white/80 mb-8 min-h-[60px]">
                  {locale === "id" 
                    ? "Rencanakan perjalanan sesuai kebutuhan Anda. Tentukan destinasi, tanggal, itinerary, dan jumlah peserta sesuai keinginan."
                    : "Plan travel according to your needs. Set the destination, dates, itinerary, and number of participants to your liking."}
                </p>
                
                {/* Checklist */}
                <ul className="space-y-4 mb-12">
                  {privateTripFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-[3px] w-4 h-4 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="typography-body !text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Button */}
              <Link 
                href="/private-trip" 
                className="typography-button inline-flex items-center gap-3 !text-[#38BDF8] group-hover:text-white transition-colors duration-300 w-max mt-auto"
              >
                <span>{locale === "id" ? "Rancang Private Trip" : "Design Private Trip"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Final Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-24 text-center max-w-3xl mx-auto border-t border-white/10 pt-14"
        >
          <p className="typography-card !italic text-white mb-4">
            {locale === "id" 
              ? "\"Kami percaya bahwa setiap perjalanan adalah sebuah cerita.\""
              : "\"We believe that every single journey is an individual story.\""}
          </p>
          <p className="typography-body !text-white/70 uppercase tracking-[0.2em]">
            {locale === "id" 
              ? "Kami berkomitmen memberikan pelayanan terbaik, harga yang kompetitif, dan pengalaman yang aman."
              : "We are committed to providing the best service, competitive rates, and a safe travel experience."}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
