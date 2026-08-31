"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Section } from "@/components/layout/Section";
import { useLanguage } from "@/context/LanguageContext";

export function PhilosophySection() {
  const { t, locale } = useLanguage();

  return (
    <Section className="bg-charcoal text-white overflow-hidden py-32 md:py-48 relative z-20">
      
      {/* =========================================
          BACKGROUND DECORATIONS
          ========================================= */}
      
      {/* Decorative Birds (Top Right) */}
      <motion.svg 
        initial={{ opacity: 0, x: -20, y: 20 }}
        whileInView={{ opacity: 0.15, x: 0, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute top-16 right-8 md:top-32 md:right-32 w-32 md:w-48 text-white z-0 pointer-events-none"
        viewBox="0 0 100 100" fill="currentColor"
      >
        <path d="M80,30 Q85,25 90,30 Q85,27 80,30" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M60,40 Q65,35 70,40 Q65,37 60,40" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M45,20 Q50,15 55,20 Q50,17 45,20" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M20,50 Q28,43 35,50 Q28,46 20,50" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M10,70 Q16,65 22,70 Q16,67 10,70" stroke="currentColor" strokeWidth="1" fill="none"/>
      </motion.svg>

      {/* Decorative Mountain Range (Bottom Left) */}
      <motion.svg 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-[-10%] md:left-[-5%] w-[120vw] md:w-[70vw] h-[40%] text-white z-0 pointer-events-none"
        viewBox="0 0 500 200" fill="none" stroke="currentColor" strokeWidth="0.5" preserveAspectRatio="none"
      >
        {/* Distant Mountain Peak */}
        <path d="M0,200 L0,120 Q50,80 100,100 T200,60 T300,90 T450,20 L500,40 L500,200" />
        {/* Closer Mountain Peak */}
        <path d="M0,200 L0,160 Q80,120 150,150 T280,100 T400,130 T500,90 L500,200" />
        {/* Subtle shading lines */}
        <path d="M50,100 L70,140 M200,60 L220,120 M450,20 L440,80 M280,100 L270,130 M150,150 L160,180" strokeDasharray="1 3" strokeWidth="0.5" />
      </motion.svg>

      {/* Decorative Topography / Waves (Right Side) */}
      <motion.svg 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute top-[10%] right-[-10%] md:right-[-5%] w-[60vw] md:w-[30vw] h-[80%] text-white z-0 pointer-events-none"
        viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="0.5"
      >
        <path d="M0,0 Q100,100 0,200 T0,400" />
        <path d="M20,0 Q120,100 20,200 T20,400" />
        <path d="M40,0 Q140,100 40,200 T40,400" />
        <path d="M60,0 Q160,100 60,200 T60,400" />
        <path d="M80,0 Q180,100 80,200 T80,400" />
        <path d="M100,0 Q200,100 100,200 T100,400" />
        <path d="M120,0 Q220,100 120,200 T120,400" />
      </motion.svg>


      {/* =========================================
          CONTENT
          ========================================= */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="typography-caption !text-white/50 mb-12 block">
            {t("philosophy_tag")}
          </span>

          <h2 className="typography-hero !text-white leading-tight font-sans tracking-tight font-light mb-16 text-balance drop-shadow-sm">
            {locale === "id" ? (
              <>
                Perjalanan seharusnya tidak <br className="hidden md:block" />
                hanya membawa Anda <span className="font-serif italic text-sky-200 font-normal">ke suatu tempat</span>. <br />
                Ia harus meninggalkan <br className="hidden md:block" />
                sesuatu di <span className="font-serif italic text-white font-normal underline decoration-sky-300 decoration-1 underline-offset-8">belakang</span>.
              </>
            ) : (
              <>
                Travel should not <br className="hidden md:block" />
                simply take you <span className="font-serif italic text-sky-200 font-normal">somewhere</span>. <br />
                It should leave <br className="hidden md:block" />
                something <span className="font-serif italic text-white font-normal underline decoration-sky-300 decoration-1 underline-offset-8">behind</span>.
              </>
            )}
          </h2>

          <p className="typography-body !text-white/80 balance mx-auto max-w-xl font-light drop-shadow-sm">
            {t("philosophy_desc")}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
