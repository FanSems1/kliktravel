"use client";

import React from "react";
import { ShieldCheck, Compass, HeartHandshake, Award, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function WhyChooseUsSection() {
  const { t, locale } = useLanguage();

  const whyChooseUs = [
    {
      icon: <Award className="w-5 h-5" />,
      title: locale === "id" ? "Harga Terbaik" : "Best Price Guarantee",
      description: locale === "id"
        ? "Paket wisata kompetitif tanpa mengurangi kualitas pelayanan."
        : "Competitive travel packages without compromising service quality."
    },
    {
      icon: <Compass className="w-5 h-5" />,
      title: locale === "id" ? "Destinasi Lengkap" : "Diverse Destinations",
      description: locale === "id"
        ? "Melayani rute favorit di Indonesia dan mancanegara."
        : "Serving all favorite routes across Indonesia and internationally."
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: locale === "id" ? "Pelayanan Ramah" : "Stellar Service",
      description: locale === "id"
        ? "Tim profesional siap melayani dari awal hingga akhir."
        : "Dedicated professional team ready to assist from start to finish."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: locale === "id" ? "Aman & Terpercaya" : "Safe & Trustworthy",
      description: locale === "id"
        ? "Didukung tim berlisensi dan mitra terakreditasi."
        : "Fully licensed travel guides and accredited field operators."
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: locale === "id" ? "Pemesanan Mudah" : "Easy Booking",
      description: locale === "id"
        ? "Reservasi digital real-time cepat tanpa ribet."
        : "Fast, real-time online reservation with zero hassle."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <section className="py-16 md:py-20 bg-[#FAF6EE] text-foreground relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#0284C7] block mb-3">
            {t("why_tag")}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F2C59] tracking-tight">
            {t("why_title")}
          </h2>
        </motion.div>

        {/* Compact Horizontal Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {whyChooseUs.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="group flex flex-col items-center text-center"
            >
              {/* Small Clean Icon */}
              <div className="w-11 h-11 rounded-xl bg-earth/10 flex items-center justify-center text-earth-dark group-hover:bg-[#0F2C59] group-hover:text-white transition-all duration-500 mb-4 shadow-sm">
                {item.icon}
              </div>
              
              {/* Text Info */}
              <h4 className="font-serif text-lg font-medium text-[#0F2C59] mb-2">{item.title}</h4>
              <p className="font-sans text-xs text-foreground/70 font-light leading-relaxed px-1">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
