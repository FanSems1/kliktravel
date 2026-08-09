"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-ivory" />
      
      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 z-10 lg:mix-blend-difference text-charcoal lg:text-ivory">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <Heading variant="utility" className="mb-6 lg:text-ivory/70 text-charcoal/70">
                {locale === "id" ? "Standar Baru Perjalanan" : "The New Standard of Travel"}
              </Heading>
              <Heading variant="display" className="mb-8 relative z-20">
                {locale === "id" ? (
                  <>
                    Melampaui <br />
                    <span className="italic lg:text-ivory/80 text-charcoal/80">Batas</span>
                  </>
                ) : (
                  <>
                    Beyond <br />
                    <span className="italic lg:text-ivory/80 text-charcoal/80">Boundaries</span>
                  </>
                )}
              </Heading>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative mt-12 lg:mt-0 lg:-ml-32 z-0">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <EditorialImage 
                aspectRatio="3/4" 
                label="HERO_PRIMARY"
                coordinates="45.92° N, 6.86° E"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="w-full max-w-7xl mx-auto flex justify-between items-end mt-24 text-charcoal/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="font-mono text-xs tracking-widest uppercase">
          {locale === "id" ? "Gulir untuk menjelajah" : "Scroll to explore"}
        </span>
        <span className="font-mono text-xs tracking-widest uppercase">Vol. 1</span>
      </motion.div>
    </section>
  );
}
