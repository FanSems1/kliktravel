"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { WaveTransition } from "@/components/ui/WaveTransition";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setSelectedImageIndex(null);
    setIsZoomed(false);
  };

  const prevLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! === 0 ? moments.length - 1 : prev! - 1));
    setIsZoomed(false);
  };

  const nextLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! === moments.length - 1 ? 0 : prev! + 1));
    setIsZoomed(false);
  };

  // Keyboard navigation for escape key and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightboxImage();
      if (e.key === "ArrowRight") nextLightboxImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        let data: any[] | null = null;
        try {
          data = await apiFetch<any[]>("/gallery");
        } catch (err) {
          try {
            data = await apiFetch<any[]>("/admin/gallery");
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
    <section ref={sectionRef} className="relative bg-white overflow-hidden z-10">

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
            <span className="typography-caption !text-charcoal/60 block mb-4">
              {t("cta_tag")}
            </span>
            <h2 className="typography-section text-charcoal uppercase tracking-[0.15em] font-normal whitespace-nowrap">
              {locale === "id" ? "Momen Bersama Kami" : "Our Moments Together"}
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
              onClick={() => openLightbox(idx)}
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

                {/* Zoom hover indicator */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Maximize2 size={16} />
                </div>

                {/* Centered Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center z-10">
                  <h3 className="typography-card !text-white tracking-[0.15em] uppercase font-light leading-relaxed drop-shadow-md">
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
              className="btn-primary"
            >
              {locale === "id" ? "Jelajahi Perjalanan" : "Explore Journeys"}
            </Link>
            <a
              href="https://wa.me/6281230011027"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-charcoal/20 hover:bg-charcoal/5 text-charcoal text-center"
            >
              {locale === "id" ? "Hubungi Travel Expert Kami" : "Talk to Our Travel Expert"}
            </a>
          </div>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 select-none"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight size={28} />
            </button>

            {/* Image & Caption Container */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`relative w-full max-h-[75vh] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-charcoal/20 transition-all duration-300 ${
                  isZoomed ? "max-h-[85vh] scale-[1.15] md:scale-[1.25] overflow-auto cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={moments[selectedImageIndex].image}
                  alt={locale === "id" ? moments[selectedImageIndex].titleID : moments[selectedImageIndex].titleEN}
                  className={`w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isZoomed ? "object-cover scale-150" : "object-contain"
                  }`}
                />
              </div>
              
              {!isZoomed && (
                <div className="text-white max-w-xl mt-6 transition-all duration-300">
                  <span className="typography-caption !text-[#0284C7] block mb-2">
                    {locale === "id" ? "Detail Momen" : "Moment Detail"}
                  </span>
                  <h3 className="typography-card !text-white tracking-[0.1em] uppercase font-light leading-relaxed">
                    {locale === "id" ? moments[selectedImageIndex].titleID : moments[selectedImageIndex].titleEN}
                  </h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave transition into the footer */}
      <WaveTransition colorClass="text-charcoal" className="bg-ivory mt-12" />
    </section>
  );
}
