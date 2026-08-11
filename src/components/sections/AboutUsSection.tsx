"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function AboutUsSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="py-20 md:py-24 bg-white text-foreground relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="max-w-3xl relative z-10"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#0284C7] block mb-3">
              {t("about_tag")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8 text-[#0F2C59]">
              {t("about_title")}
            </h2>
            <div className="space-y-6 text-foreground/80 font-sans text-base md:text-lg font-light leading-relaxed">
              <p>
                {locale === "id" ? (
                  <>
                    Klik Travel adalah penyedia layanan perjalanan wisata yang hadir untuk mewujudkan impian liburan Anda menjadi pengalaman yang mudah, aman, nyaman, dan berkesan. Bernaung di bawah <strong>PT Bersama Jelajah Dunia</strong>, kami melayani berbagai kebutuhan perjalanan, mulai dari open trip, private trip, corporate gathering, hingga incentive tour untuk perusahaan.
                  </>
                ) : (
                  <>
                    Klik Travel is a premier tour and travel service provider operating under <strong>PT Bersama Jelajah Dunia</strong>. We exist to transform your dream vacations into seamless, safe, luxurious, and memorable experiences, covering open trips, bespoke private trips, corporate gatherings, and corporate incentive tours.
                  </>
                )}
              </p>
              <p>
                {locale === "id" ? (
                  <>
                    Dengan jaringan mitra yang luas dan tim yang berpengalaman, Klik Travel menghadirkan berbagai pilihan destinasi favorit di Indonesia maupun mancanegara, seperti Belitung, Labuan Bajo, Banyuwangi, Thailand, Vietnam, China, Korea Selatan, Jepang, dan masih banyak lagi.
                  </>
                ) : (
                  <>
                    Supported by an extensive network of partners and seasoned travel experts, Klik Travel offers curated travel destinations across Indonesia and around the globe—including Belitung, Labuan Bajo, Banyuwangi, Thailand, Vietnam, China, South Korea, Japan, and beyond.
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* Transparent Watermark Logo */}
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 0.12, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="w-full md:w-1/3 flex justify-center md:justify-end shrink-0 relative mt-8 md:mt-0 pointer-events-none select-none"
          >
            <img 
              src="/kliktravelid.png" 
              alt="Klik Travel ID Watermark" 
              className="w-64 md:w-72 lg:w-96 h-auto object-contain filter drop-shadow-xl"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
