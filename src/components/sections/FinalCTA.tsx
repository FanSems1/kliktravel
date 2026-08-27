"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { WaveTransition } from "@/components/ui/WaveTransition";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

const DEFAULT_MOMENTS = [
  {
    titleID: "KECERIAAN DI RAJA AMPAT, INDONESIA",
    titleEN: "JOYFUL MOMENTS IN RAJA AMPAT, INDONESIA",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800"
  },
  {
    titleID: "KEBERSAMAAN KELUARGA DI SWISS, EROPA",
    titleEN: "FAMILY GATHERING IN SWISS ALPS, EUROPE",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800"
  },
  {
    titleID: "PETUALANGAN GRUP DI KYOTO, JEPANG",
    titleEN: "GROUP ADVENTURES IN KYOTO, JAPAN",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800"
  },
  {
    titleID: "MOMEN INDAH DI GUNUNG BROMO, INDONESIA",
    titleEN: "SERENE LANDSCAPES AT MOUNT BROMO, INDONESIA",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
  },
  {
    titleID: "EKSPLORASI BUDAYA DI SEOUL, KOREA",
    titleEN: "CULTURAL IMMERSION IN SEOUL, SOUTH KOREA",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800"
  }
];

export function FinalCTA() {
  const { t, locale } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [moments, setMoments] = useState(DEFAULT_MOMENTS);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        let data: any[] | null = null;
        try {
          data = await apiFetch<any[]>("/admin/gallery");
        } catch (err) {
          try {
            data = await apiFetch<any[]>("/gallery");
          } catch (err2) {
            console.warn("Could not fetch from /gallery endpoint, falling back to localStorage", err2);
          }
        }

        if (data && Array.isArray(data)) {
          const ourJourneysItems = data
            .filter((x: any) => x.type === "OUR_JOURNEYS" || x.type === "STOREFRONT" || x.type === "MOMENTS")
            .map((x: any) => ({
              titleID: x.titleID,
              titleEN: x.titleEN || x.titleID,
              image: x.image
            }));
          if (ourJourneysItems.length > 0) {
            setMoments(ourJourneysItems);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load gallery items from API", err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem("klik_admin_gallery_items");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const ourJourneysItems = parsed
              .filter((x: any) => x.type === "OUR_JOURNEYS" || x.type === "STOREFRONT" || x.type === "MOMENTS")
              .map((x: any) => ({
                titleID: x.titleID,
                titleEN: x.titleEN || x.titleID,
                image: x.image
              }));
            if (ourJourneysItems.length > 0) {
              setMoments(ourJourneysItems);
              return;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadGallery();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Parallax Scroll for Background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.4]);

  return (
    <section ref={sectionRef} className="relative bg-ivory overflow-hidden z-10">

      {/* Background Graphic with Parallax */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none"
      >
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[#87CEEB] to-transparent filter blur-3xl translate-x-1/4" />
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-32 md:pt-40 pb-20 relative z-10 flex flex-col">

        {/* Gallery Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-charcoal/10 pb-8 gap-8"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal/60 font-semibold mb-4 block">
              {t("cta_tag")}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-charcoal uppercase tracking-[0.15em] font-normal">
              {locale === "id" ? (
                <>
                  Momen <br className="hidden md:block" /> Bersama Kami
                </>
              ) : (
                <>
                  Our Moments <br className="hidden md:block" /> Together
                </>
              )}
            </h2>
          </div>
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white transition-colors group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white transition-colors group cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 snap-x snap-mandatory scrollbar-none no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth"
        >
          {moments.map((moment, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] flex-none bg-[#F4F4F0] border border-charcoal/10 p-5 md:p-7 shadow-sm group cursor-pointer"
            >
              {/* Framed Image Container */}
              <div className="relative w-full aspect-square overflow-hidden bg-charcoal shadow-inner">
                <img
                  src={moment.image}
                  alt={locale === "id" ? moment.titleID : moment.titleEN}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

                {/* Centered Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <h3 className="text-white font-sans text-sm md:text-base lg:text-lg tracking-[0.15em] uppercase font-light leading-relaxed drop-shadow-md">
                    {locale === "id" ? moment.titleID : moment.titleEN}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 flex flex-col items-center text-center border-t border-charcoal/10 pt-20"
        >
          <Heading variant="editorial" className="text-foreground text-3xl md:text-5xl lg:text-5xl leading-tight mb-12 uppercase font-normal max-w-3xl">
            {locale === "id" ? (
              <>
                Ke mana perjalanan <br />
                Anda berikutnya <br />
                akan membawa Anda?
              </>
            ) : (
              <>
                Where will <br />
                your next <br />
                journey take you?
              </>
            )}
          </Heading>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link
              href="/destinations"
              className="bg-charcoal text-white hover:bg-earth-dark text-xs uppercase tracking-[0.25em] font-sans py-4 px-10 rounded-full shadow-lg transition-all duration-300"
            >
              {locale === "id" ? "Jelajahi Perjalanan" : "Explore Journeys"}
            </Link>
            <a
              href="https://wa.me/6281230011027"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-charcoal/20 hover:border-charcoal hover:bg-charcoal/5 text-charcoal text-xs uppercase tracking-[0.25em] font-sans py-4 px-10 rounded-full transition-all duration-300 text-center"
            >
              {locale === "id" ? "Hubungi Travel Expert Kami" : "Talk to Our Travel Expert"}
            </a>
          </div>
        </motion.div>

      </div>

      {/* Wave transition into the footer */}
      <WaveTransition colorClass="text-charcoal" className="bg-ivory mt-12" />
    </section>
  );
}
