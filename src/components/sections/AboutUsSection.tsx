"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function AboutUsSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="typography-section-spacing bg-white text-foreground relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* About Intro Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl relative z-10"
          >
            <span className="typography-caption !text-[#0284C7] block mb-4">
              {t("about_tag")}
            </span>
            <h2 className="typography-section text-[#0F2C59] tracking-tight mb-6">
              {t("about_title")}
            </h2>
            <div className="space-y-6 typography-body text-[#0F2C59]/80">
              <p>
                {locale === "id" ? (
                  <>
                    Klik Travel adalah penyedia layanan perjalanan wisata yang hadir untuk mewujudkan impian liburan Anda menjadi pengalaman yang mudah, aman, nyaman, dan berkesan. Bernaung di bawah <strong>PT Bersama Jelajah Dunia</strong>, kami melayani berbagai kebutuhan perjalanan, mulai dari open trip, private trip, corporate gathering, hingga incentive tour untuk perusahaan.
                  </>
                ) : (
                  <>
                    Klik Travel is a tour and travel service provider operating under <strong>PT Bersama Jelajah Dunia</strong>. We exist to transform your dream vacations into seamless, safe, comfortable, and memorable experiences, covering open trips, private trips, corporate gatherings, and corporate incentive tours.
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.12 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/3 flex justify-center lg:justify-end shrink-0 relative mt-8 lg:mt-0 pointer-events-none select-none lg:translate-x-12"
          >
            <img 
              src="/kliktravelid.png" 
              alt="Klik Travel ID Watermark" 
              className="w-48 md:w-64 lg:w-80 h-auto object-contain filter drop-shadow-xl"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
