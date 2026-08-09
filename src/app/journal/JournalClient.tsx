"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { journalArticles, JournalArticle } from "@/data/journal";
import { ArrowRight, Clock, Calendar, Compass, Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";

interface GalleryItem {
  id: number;
  image: string;
  locationID: string;
  locationEN: string;
  captionID: string;
  captionEN: string;
  year: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    locationID: "Raja Ampat, Papua Barat",
    locationEN: "Raja Ampat, West Papua",
    captionID: "Keindahan gugusan pulau karang dan air laut jernih yang menjadi surga penyelam.",
    captionEN: "Untouched karst islands surrounded by crystal-clear waters in an underwater paradise.",
    year: "2026"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200",
    locationID: "Gunung Bromo, Jawa Timur",
    locationEN: "Mount Bromo, East Java",
    captionID: "Kabut pagi menembus lautan pasir saat matahari terbit di atas kaldera.",
    captionEN: "Morning mist breaking through the sand sea at dawn over the volcanic caldera.",
    year: "2026"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
    locationID: "Ubud, Bali",
    locationEN: "Ubud, Bali",
    captionID: "Ketenangan terasering sawah hijau yang membentang di pedesaan Ubud.",
    captionEN: "Serene green rice terraces cascading through the peaceful valleys of Ubud.",
    year: "2026"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
    locationID: "Teluk Ha Long, Vietnam",
    locationEN: "Ha Long Bay, Vietnam",
    captionID: "Pelayaran megah di antara pilar-pilar batu kapur kuno yang diselimuti legenda.",
    captionEN: "Cruising amidst towering emerald karst pillars steeped in ancient legends.",
    year: "2025"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200",
    locationID: "Arashiyama, Kyoto",
    locationEN: "Arashiyama, Kyoto",
    captionID: "Pesona musim gugur di tepian sungai bersejarah kota tua Kyoto.",
    captionEN: "Crimson autumn foliage lining the tranquil riverbanks of historic Kyoto.",
    year: "2026"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1508804185872-d7bad1006fc5?q=80&w=1200",
    locationID: "Tembok Besar, China",
    locationEN: "Great Wall of China",
    captionID: "Jejak sejarah membentang di sepanjang pegunungan utara yang megah.",
    captionEN: "Winding stone ramparts tracing the dramatic ridges of northern China.",
    year: "2025"
  }
];

export function JournalClient() {
  const { locale, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // Determine localized categories
  const categories = [
    { key: "ALL", id: "Semua", en: "All" },
    { key: "STORIES", id: "Cerita Perjalanan", en: "Travel Stories" },
    { key: "GUIDES", id: "Panduan Destinasi", en: "Destination Guides" },
    { key: "BEHIND", id: "Catatan Kurator", en: "Behind the Scenes" }
  ];

  // Filter articles
  const filteredArticles = journalArticles.filter((article) => {
    if (activeCategory === "ALL") return true;
    const catObj = categories.find((c) => c.key === activeCategory);
    if (!catObj) return true;
    return (
      article.categoryID === catObj.id || article.categoryEN === catObj.en
    );
  });

  // Spotlight article (usually the featured one)
  const spotlightArticle = journalArticles.find((a) => a.featured) || journalArticles[0];
  const gridArticles = filteredArticles.filter((a) => a.slug !== spotlightArticle.slug || activeCategory !== "ALL");

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setSlideIndex(0);
  };

  const maxSlides = Math.max(0, gridArticles.length - 3);

  const handlePrev = () => {
    setSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideIndex((prev) => Math.min(maxSlides, prev + 1));
  };

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  
  const prevLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! === 0 ? galleryItems.length - 1 : prev! - 1));
  };

  const nextLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! === galleryItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="bg-ivory text-charcoal min-h-screen pb-20 selection:bg-charcoal selection:text-white">
      
      {/* Premium Hero Section */}
      <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000" 
            alt="Klik Travel Journal Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2C59]/65 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-black/30" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pt-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-sky-300 font-semibold mb-6 block"
          >
            {locale === "id" ? "09 — CATATAN PERJALANAN" : "09 — FIELD JOURNAL"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-white font-normal tracking-wide mb-6 leading-tight uppercase"
          >
            {locale === "id" ? "Jurnal Kita" : "The Journal"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-sans text-white/90 text-sm md:text-lg max-w-2xl font-light leading-relaxed"
          >
            {locale === "id" 
              ? "Kumpulan cerita kurasi, panduan destinasi mendalam, dan kisah dari para ahli perjalanan kami di seluruh penjuru kepulauan." 
              : "A curated collection of travel narratives, destination insights, and field notes from our travel architects across the globe."}
          </motion.p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-16">
        
        {/* Featured Spotlight Article (Only shows when "All" is active) */}
        {activeCategory === "ALL" && spotlightArticle && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
          >
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] md:aspect-[21/12] w-full rounded-3xl overflow-hidden shadow-xl bg-charcoal/10 group">
                <img 
                  src={spotlightArticle.image} 
                  alt={locale === "id" ? spotlightArticle.titleID : spotlightArticle.titleEN} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-[#0284C7] uppercase font-bold mb-4">
                <span>{locale === "id" ? spotlightArticle.categoryID : spotlightArticle.categoryEN}</span>
                <span className="w-1 h-1 rounded-full bg-charcoal/30" />
                <span className="text-charcoal/60">{locale === "id" ? spotlightArticle.readTimeID : spotlightArticle.readTimeEN}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-5 leading-tight hover:text-[#0284C7] transition-colors">
                <Link href={`/journal/${spotlightArticle.slug}`}>
                  {locale === "id" ? spotlightArticle.titleID : spotlightArticle.titleEN}
                </Link>
              </h2>
              <p className="font-sans text-charcoal/70 text-sm leading-relaxed mb-6 font-light">
                {locale === "id" ? spotlightArticle.excerptID : spotlightArticle.excerptEN}
              </p>
              <div className="flex items-center gap-6">
                <Link 
                  href={`/journal/${spotlightArticle.slug}`} 
                  className="font-mono text-[10px] tracking-[0.25em] uppercase text-charcoal font-semibold hover:text-[#0284C7] transition-colors flex items-center gap-2 group/btn"
                >
                  {locale === "id" ? "BACA JURNAL" : "READ ARTICLE"}
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <span className="font-mono text-[10px] text-charcoal/40">{locale === "id" ? spotlightArticle.dateID : spotlightArticle.dateEN}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-3 pb-8 mb-12 border-b border-charcoal/10 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-6 py-2.5 rounded-full font-sans text-xs tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.key
                  ? "bg-charcoal text-white shadow-md"
                  : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
              }`}
            >
              {locale === "id" ? cat.id : cat.en}
            </button>
          ))}
        </div>

        {/* Article Slider Section */}
        <div className="relative w-full overflow-hidden">
          
          {/* Mobile swipe list */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 -mx-6 px-6">
            {gridArticles.map((article) => (
              <div 
                key={article.slug}
                className="group flex flex-col justify-between border border-charcoal/10 p-5 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm shrink-0 w-[85vw] sm:w-[60vw] snap-center"
              >
                <div className="w-full">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-charcoal/10 mb-6">
                    <img 
                      src={article.image} 
                      alt={locale === "id" ? article.titleID : article.titleEN} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[8px] tracking-widest text-[#0284C7] font-bold shadow-sm uppercase">
                      {locale === "id" ? article.categoryID : article.categoryEN}
                    </div>
                  </div>
                  
                  <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block mb-2">
                    {locale === "id" ? article.dateID : article.dateEN} • {locale === "id" ? article.readTimeID : article.readTimeEN}
                  </span>
                  
                  <h3 className="font-serif text-xl text-charcoal mb-3 leading-snug">
                    <Link href={`/journal/${article.slug}`}>
                      {locale === "id" ? article.titleID : article.titleEN}
                    </Link>
                  </h3>
                  
                  <p className="font-sans text-xs text-charcoal/70 leading-relaxed mb-6 font-light line-clamp-3">
                    {locale === "id" ? article.excerptID : article.excerptEN}
                  </p>
                </div>

                <div className="border-t border-charcoal/10 pt-4 flex items-center justify-between">
                  <Link 
                    href={`/journal/${article.slug}`} 
                    className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal font-semibold hover:text-[#0284C7] transition-colors flex items-center gap-1 group/item"
                  >
                    {locale === "id" ? "BACA SELENGKAPNYA" : "READ STORY"}
                    <ArrowRight size={10} className="group-hover/item:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Animated Slider (Exactly 3 per view) */}
          <div className="hidden md:block overflow-hidden relative pb-4">
            <motion.div
              className="flex gap-8"
              animate={{ x: `calc(-${slideIndex} * (100% + 32px) / 3)` }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            >
              {gridArticles.map((article) => (
                <div
                  key={article.slug}
                  className="group flex flex-col justify-between border border-charcoal/10 p-6 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow shrink-0 w-[calc((100%-64px)/3)]"
                >
                  <div className="w-full">
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-charcoal/10 mb-6">
                      <img 
                        src={article.image} 
                        alt={locale === "id" ? article.titleID : article.titleEN} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s]"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[8px] tracking-widest text-[#0284C7] font-bold shadow-sm uppercase">
                        {locale === "id" ? article.categoryID : article.categoryEN}
                      </div>
                    </div>
                    
                    <span className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase block mb-2">
                      {locale === "id" ? article.dateID : article.dateEN} • {locale === "id" ? article.readTimeID : article.readTimeEN}
                    </span>
                    
                    <h3 className="font-serif text-xl text-charcoal mb-3 leading-snug group-hover:text-[#0284C7] transition-colors">
                      <Link href={`/journal/${article.slug}`}>
                        {locale === "id" ? article.titleID : article.titleEN}
                      </Link>
                    </h3>
                    
                    <p className="font-sans text-xs text-charcoal/70 leading-relaxed mb-6 font-light line-clamp-3">
                      {locale === "id" ? article.excerptID : article.excerptEN}
                    </p>
                  </div>

                  <div className="border-t border-charcoal/10 pt-4 flex items-center justify-between">
                    <Link 
                      href={`/journal/${article.slug}`} 
                      className="font-mono text-[9px] tracking-[0.2em] uppercase text-charcoal font-semibold hover:text-[#0284C7] transition-colors flex items-center gap-1 group/item"
                    >
                      {locale === "id" ? "BACA SELENGKAPNYA" : "READ STORY"}
                      <ArrowRight size={10} className="group-hover/item:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slider Controls */}
          {maxSlides > 0 && (
            <div className="hidden md:flex justify-end items-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={slideIndex === 0}
                className={`w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center transition-all ${
                  slideIndex === 0 
                    ? "opacity-40 cursor-not-allowed" 
                    : "hover:bg-charcoal hover:text-white hover:border-charcoal cursor-pointer"
                }`}
                aria-label="Previous articles"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                disabled={slideIndex === maxSlides}
                className={`w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center transition-all ${
                  slideIndex === maxSlides 
                    ? "opacity-40 cursor-not-allowed" 
                    : "hover:bg-charcoal hover:text-white hover:border-charcoal cursor-pointer"
                }`}
                aria-label="Next articles"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

        </div>

        {/* Dynamic Travel Photo Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 border-t border-charcoal/10 pt-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#0284C7] font-bold mb-3">
                <Camera size={14} />
                <span>{locale === "id" ? "DOKUMENTASI FOTO" : "VISUAL JOURNAL"}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-charcoal uppercase">
                {locale === "id" ? "Galeri Ekspedisi" : "Moments Captured"}
              </h2>
            </div>
            <p className="font-sans text-xs md:text-sm text-charcoal/70 max-w-md font-light leading-relaxed">
              {locale === "id" 
                ? "Kumpulan momen dan pemandangan autentik dari berbagai ekspedisi yang kami lalui bersama para pengelana." 
                : "A visual index of pristine landscapes and authentic moments documented across our curated journeys."}
            </p>
          </div>

          {/* Asymmetric Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-charcoal/10 shadow-sm"
              >
                <img 
                  src={item.image} 
                  alt={locale === "id" ? item.locationID : item.locationEN}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white" />
                
                {/* Hover Details */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">{locale === "id" ? item.locationID : item.locationEN}</h4>
                    <p className="font-sans text-xs text-white/80 line-clamp-2 font-light">
                      {locale === "id" ? item.captionID : item.captionEN}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImageIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X size={24} />
              </button>

              {/* Prev Button */}
              <button
                onClick={prevLightboxImage}
                className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Next Button */}
              <button
                onClick={nextLightboxImage}
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
                className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center text-center"
              >
                <div className="relative w-full max-h-[70vh] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl mb-6 bg-charcoal/20">
                  <img
                    src={galleryItems[selectedImageIndex].image}
                    alt={locale === "id" ? galleryItems[selectedImageIndex].locationID : galleryItems[selectedImageIndex].locationEN}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-white max-w-xl">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0284C7] font-bold block mb-2">
                    {galleryItems[selectedImageIndex].year} • {locale === "id" ? galleryItems[selectedImageIndex].locationID : galleryItems[selectedImageIndex].locationEN}
                  </span>
                  <p className="font-sans text-sm text-white/80 font-light leading-relaxed">
                    {locale === "id" ? galleryItems[selectedImageIndex].captionID : galleryItems[selectedImageIndex].captionEN}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Luxury CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 bg-[#0F2C59] text-white p-8 md:p-16 rounded-3xl relative overflow-hidden shadow-2xl"
        >
          {/* Decorative graphic */}
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 bg-radial-gradient from-white to-transparent pointer-events-none" />
          <Compass className="absolute right-8 bottom-8 text-white/5 w-64 h-64 pointer-events-none rotate-12" />

          <div className="relative z-10 max-w-2xl">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0284C7] font-bold block mb-4">
              {locale === "id" ? "EKSPEDISI SELANJUTNYA" : "NEXT EXPEDITION"}
            </span>
            <h3 className="font-serif text-3xl md:text-5xl leading-tight mb-6 uppercase">
              {locale === "id" 
                ? "Mari Wujudkan Liburan Impian Anda" 
                : "Let Us Architect Your Next Adventure"}
            </h3>
            <p className="font-sans text-sm text-white/80 leading-relaxed mb-8 font-light max-w-lg">
              {locale === "id"
                ? "Jelajahi keindahan Indonesia dan mancanegara dengan jadwal open trip terencana atau jadwalkan private tour eksklusif bersama tim kami."
                : "Explore spectacular terrains in Indonesia or across the world with our fixed schedules or co-create a tailored private journey."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link 
                href="/destinations" 
                className="bg-white text-[#0F2C59] hover:bg-[#F4F4F0] text-center font-sans text-xs uppercase tracking-[0.2em] font-semibold py-4 px-8 rounded-full transition-colors shadow-lg"
              >
                {locale === "id" ? "CARI OPEN TRIP" : "EXPLORE OPEN TRIPS"}
              </Link>
              <Link 
                href="/private-trip" 
                className="border border-white/30 hover:border-white hover:bg-white/5 text-center font-sans text-xs uppercase tracking-[0.2em] font-semibold py-4 px-8 rounded-full transition-all"
              >
                {locale === "id" ? "RANCANG PRIVATE TRIP" : "REQUEST PRIVATE TRIP"}
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
