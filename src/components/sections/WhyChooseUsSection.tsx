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
      title: locale === "id" ? "Harga Terbaik" : "Best Prices",
      description: locale === "id"
        ? "Pilihan perjalanan dengan harga kompetitif dan sesuai dengan fasilitas yang didapatkan."
        : "Competitive trip choices matching the facilities provided."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: locale === "id" ? "Aman & Terpercaya" : "Safe & Reliable",
      description: locale === "id"
        ? "Pelayanan yang jelas dan profesional untuk memberikan rasa nyaman sejak pemesanan hingga perjalanan."
        : "Clear and professional service providing peace of mind from booking to destination."
    },
    {
      icon: <Compass className="w-5 h-5" />,
      title: locale === "id" ? "Destinasi Beragam" : "Diverse Destinations",
      description: locale === "id"
        ? "Pilihan destinasi menarik di Indonesia dan mancanegara."
        : "Attractive destination choices across Indonesia and abroad."
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: locale === "id" ? "Layanan Profesional" : "Professional Service",
      description: locale === "id"
        ? "Tim kami siap membantu memberikan informasi dan pelayanan terbaik untuk perjalanan Anda."
        : "Our team is ready to help provide the best information and service for your trip."
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
    <section className="py-16 md:py-20 bg-ivory text-foreground relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="typography-section !text-[#0F2C59] tracking-tight">
            {t("why_title")}
          </h2>
        </motion.div>

        {/* Compact Horizontal Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
              <h4 className="typography-card mb-3">{item.title}</h4>
              <p className="typography-body text-[#0F2C59]/80 px-1">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
