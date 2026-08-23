"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { useLanguage } from "@/context/LanguageContext";

export function IndonesiaHero() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 1000], ["0%", "20%"]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-charcoal">
      {/* Background Video */}
      <motion.div 
        style={{ y: videoY }}
        className="absolute inset-0 z-0"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-110"
        >
          <source src="/hero-compressed.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/35" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-28 xs:pt-32 sm:pt-40 md:justify-center md:pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col items-center justify-start md:justify-center text-center px-6"
        >
          <span className="font-mono text-[8px] xs:text-[10px] md:text-[11px] tracking-[0.2em] xs:tracking-[0.4em] whitespace-nowrap uppercase text-white font-semibold mb-6 px-4 xs:px-5 py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
            {t("hero_subtitle")}
          </span>

          <Heading variant="display" className="text-white drop-shadow-lg !text-[28px] xs:!text-[34px] md:!text-7xl lg:!text-[8.5rem] !leading-tight md:!leading-none">
            {t("hero_heading_1")} <br />
            <span className="font-sans font-light italic tracking-tight uppercase text-white/90">{t("hero_heading_2")}</span>
          </Heading>

          <Text variant="large" className="text-white/90 font-light max-w-lg balance mt-8 drop-shadow-md">
            {t("hero_description")}
          </Text>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mt-10 pointer-events-auto"
          >
            <Link 
              href="/destinations"
              className="inline-block rounded-full bg-earth text-white px-5 py-2 text-[10px] md:px-8 md:py-3.5 md:text-xs tracking-[0.2em] uppercase font-sans shadow-xl hover:bg-earth-dark transition-all duration-300 font-semibold text-center"
            >
              {t("hero_btn_start")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center"
      >
        <div className="w-[1px] h-16 bg-white/30 overflow-hidden relative">
          <motion.div 
            className="w-full h-1/2 bg-white absolute top-0"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
