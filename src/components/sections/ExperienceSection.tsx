"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { useLanguage } from "@/context/LanguageContext";

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-ivory text-foreground py-24 md:py-36 relative z-10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Editorial Story */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-charcoal font-semibold block mb-6">
                {t("ethos_tag")}
              </span>
              
              <Heading variant="editorial" className="text-foreground text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight font-normal tracking-tight">
                {t("ethos_heading_1")}
              </Heading>
              
              <h3 className="font-sans text-xs md:text-sm lg:text-base tracking-[0.25em] uppercase text-foreground/60 mb-8 font-medium">
                {t("ethos_heading_2")}
              </h3>
              
              <Text variant="large" className="text-foreground/75 font-light text-base md:text-lg leading-relaxed max-w-xl mb-8">
                {t("ethos_desc_1")}
                <br /><br />
                {t("ethos_desc_2")}
              </Text>
            </motion.div>
          </div>

          {/* Right Column: Sleek Video / Experience Thumbnail */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="relative w-full aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group border border-charcoal/10 bg-charcoal">
                {/* Background Overlay & Texture */}
                <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal/60 to-transparent z-10" />
                <div className="absolute inset-0 image-texture mix-blend-overlay opacity-40 z-10" />
                
                {/* Video Play Button */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <button className="w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-md bg-white/20 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-charcoal hover:scale-110 transition-all duration-300 shadow-xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="ml-1">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </button>
                </div>

                {/* Subtitle / Caption at bottom */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between">
                  <span className="font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/80">
                    {t("ethos_watch_experience")}
                  </span>
                  <span className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-white/60">
                    02:45 MIN
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
