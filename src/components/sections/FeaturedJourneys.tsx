"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const COUNTRIES = ["Indonesia", "Thailand", "Vietnam", "Korea", "Jepang", "China", "India", "Lainnya"];

const countryLabels: Record<string, Record<"id" | "en", string>> = {
  "Indonesia": { id: "Indonesia", en: "Indonesia" },
  "Thailand": { id: "Thailand", en: "Thailand" },
  "Vietnam": { id: "Vietnam", en: "Vietnam" },
  "Korea": { id: "Korea", en: "Korea" },
  "Jepang": { id: "Jepang", en: "Japan" },
  "China": { id: "China", en: "China" },
  "India": { id: "India", en: "India" },
  "Lainnya": { id: "Lainnya", en: "Others" }
};

interface Tour {
  id: string;
  titleID: string;
  titleEN: string;
  subtitleID: string;
  subtitleEN: string;
  daysID: string;
  daysEN: string;
  price: string;
  image: string;
  datesID: string;
  datesEN: string;
}

const TOUR_DATA: Record<string, Tour[]> = {
  "Indonesia": [
    { 
      id: "id-1", 
      titleID: "Ekspedisi Raja Ampat", 
      titleEN: "Raja Ampat Expedition", 
      subtitleID: "Surga Terakhir di Bumi", 
      subtitleEN: "The Last Paradise", 
      daysID: "7 HARI", 
      daysEN: "7 DAYS", 
      price: "IDR 42.0 JT", 
      datesID: "12 — 19 NOV 2026", 
      datesEN: "12 — 19 NOV 2026", 
      image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80" 
    },
    { 
      id: "id-2", 
      titleID: "Pelayaran Phinisi Komodo", 
      titleEN: "Komodo Sailing Expedition", 
      subtitleID: "Naga Purba & Terumbu Karang", 
      subtitleEN: "Dragons & Corals", 
      daysID: "5 HARI", 
      daysEN: "5 DAYS", 
      price: "IDR 18.5 JT", 
      datesID: "04 — 09 DES 2026", 
      datesEN: "04 — 09 DEC 2026", 
      image: "https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80" 
    },
    { 
      id: "id-3", 
      titleID: "Petualangan Budaya Sumba", 
      titleEN: "Sumba Cultural Adventure", 
      subtitleID: "Menjelajah Warisan Leluhur Sumba", 
      subtitleEN: "Lost Island Heritage", 
      daysID: "6 HARI", 
      daysEN: "6 DAYS", 
      price: "IDR 24.0 JT", 
      datesID: "23 — 29 DES 2026", 
      datesEN: "23 — 29 DEC 2026", 
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80" 
    }
  ],
  "Thailand": [
    { 
      id: "th-1", 
      titleID: "Eksplorasi Bangkok & Phuket", 
      titleEN: "Bangkok & Phuket Escape", 
      subtitleID: "Dari Kota Metropolitan ke Pantai Eksotis", 
      subtitleEN: "Cities to Shores", 
      daysID: "6 HARI", 
      daysEN: "6 DAYS", 
      price: "IDR 12.5 JT", 
      datesID: "10 — 15 OKT 2026", 
      datesEN: "10 — 15 OCT 2026", 
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80" 
    },
    { 
      id: "th-2", 
      titleID: "Festival Lentera Chiang Mai", 
      titleEN: "Chiang Mai Lanterns", 
      subtitleID: "Magis Festival Lampion Yi Peng", 
      subtitleEN: "Yi Peng Festival", 
      daysID: "4 HARI", 
      daysEN: "4 DAYS", 
      price: "IDR 8.8 JT", 
      datesID: "15 — 18 NOV 2026", 
      datesEN: "15 — 18 NOV 2026", 
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80" 
    },
    { 
      id: "th-3", 
      titleID: "Pelayaran Mewah Phi Phi", 
      titleEN: "Phi Phi Luxury Cruise", 
      subtitleID: "Menyusuri Laut Andaman", 
      subtitleEN: "Andaman Sea", 
      daysID: "3 HARI", 
      daysEN: "3 DAYS", 
      price: "IDR 7.2 JT", 
      datesID: "05 — 07 DES 2026", 
      datesEN: "05 — 07 DEC 2026", 
      image: "https://images.unsplash.com/photo-1536139414436-ec069c9b583f?auto=format&fit=crop&q=80" 
    }
  ],
  "Vietnam": [
    { 
      id: "vn-1", 
      titleID: "Warisan Budaya Halong Bay", 
      titleEN: "Halong Bay Heritage", 
      subtitleID: "Pelayaran Mewah di Teluk Karst", 
      subtitleEN: "Limestone Peaks Cruise", 
      daysID: "5 HARI", 
      daysEN: "5 DAYS", 
      price: "IDR 11.2 JT", 
      datesID: "02 — 06 OKT 2026", 
      datesEN: "02 — 06 OCT 2026", 
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80" 
    },
    { 
      id: "vn-2", 
      titleID: "Pesona Hanoi & Ninh Binh", 
      titleEN: "Hanoi & Ninh Binh", 
      subtitleID: "Menjelajahi Kota Kuno & Alam Megah", 
      subtitleEN: "Ancient Capitals", 
      daysID: "4 HARI", 
      daysEN: "4 DAYS", 
      price: "IDR 7.5 JT", 
      datesID: "12 — 15 OKT 2026", 
      datesEN: "12 — 15 OCT 2026", 
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80" 
    },
    { 
      id: "vn-3", 
      titleID: "Kota Tua Hoi An", 
      titleEN: "Hoi An Ancient Town", 
      subtitleID: "Nuansa Lampion Romantis", 
      subtitleEN: "Lantern Streets", 
      daysID: "3 HARI", 
      daysEN: "3 DAYS", 
      price: "IDR 5.9 JT", 
      datesID: "20 — 22 NOV 2026", 
      datesEN: "20 — 22 NOV 2026", 
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80" 
    }
  ],
  "Korea": [
    { 
      id: "kr-1", 
      titleID: "Seoul & Pulau Jeju Indah", 
      titleEN: "Seoul & Jeju Spring", 
      subtitleID: "Istana Kerajaan & Keindahan Vulkanik", 
      subtitleEN: "Palaces & Volcanoes", 
      daysID: "7 HARI", 
      daysEN: "7 DAYS", 
      price: "IDR 19.5 JT", 
      datesID: "05 — 11 APR 2026", 
      datesEN: "05 — 11 APR 2026", 
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80" 
    },
    { 
      id: "kr-2", 
      titleID: "Penjelajahan Pesisir Busan", 
      titleEN: "Busan Coastal Discovery", 
      subtitleID: "Kuil Cantik di Tepi Pantai", 
      subtitleEN: "Temples by the Sea", 
      daysID: "4 HARI", 
      daysEN: "4 DAYS", 
      price: "IDR 10.2 JT", 
      datesID: "14 — 17 MEI 2026", 
      datesEN: "14 — 17 MAY 2026", 
      image: "https://images.unsplash.com/photo-1613134863953-61b69ff229b4?auto=format&fit=crop&q=80" 
    },
    { 
      id: "kr-3", 
      titleID: "Warna Musim Gugur Gyeongju", 
      titleEN: "Gyeongju Autumn Colors", 
      subtitleID: "Warisan Sejarah Dinasti Kuno", 
      subtitleEN: "Historic Roots", 
      daysID: "3 HARI", 
      daysEN: "3 DAYS", 
      price: "IDR 8.5 JT", 
      datesID: "10 — 12 OKT 2026", 
      datesEN: "10 — 12 OCT 2026", 
      image: "https://images.unsplash.com/photo-1538682006733-4fec7a11fc1b?auto=format&fit=crop&q=80" 
    }
  ],
  "Jepang": [
    { 
      id: "jp-1", 
      titleID: "Klasik Tokyo & Kyoto", 
      titleEN: "Tokyo & Kyoto Classic", 
      subtitleID: "Harmoni Modernitas & Tradisi", 
      subtitleEN: "Neon & Traditions", 
      daysID: "7 HARI", 
      daysEN: "7 DAYS", 
      price: "IDR 26.5 JT", 
      datesID: "10 — 16 NOV 2026", 
      datesEN: "10 — 16 NOV 2026", 
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80" 
    },
    { 
      id: "jp-2", 
      titleID: "Keajaiban Musim Dingin Hokkaido", 
      titleEN: "Hokkaido Winterland", 
      subtitleID: "Festival Salju & Es yang Menakjubkan", 
      subtitleEN: "Snow & Ice Festivals", 
      daysID: "5 HARI", 
      daysEN: "5 DAYS", 
      price: "IDR 22.0 JT", 
      datesID: "05 — 09 FEB 2026", 
      datesEN: "05 — 09 FEB 2026", 
      image: "https://images.unsplash.com/photo-1542051812871-75850247df6b?auto=format&fit=crop&q=80" 
    },
    { 
      id: "jp-3", 
      titleID: "Relaksasi Gunung Fuji & Hakone", 
      titleEN: "Mount Fuji Retreat", 
      subtitleID: "Mandi Air Panas Onsen Tradisional", 
      subtitleEN: "Hakone Onsen", 
      daysID: "3 HARI", 
      daysEN: "3 DAYS", 
      price: "IDR 12.8 JT", 
      datesID: "20 — 22 OKT 2026", 
      datesEN: "20 — 22 OCT 2026", 
      image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80" 
    }
  ],
  "China": [
    { 
      id: "cn-1", 
      titleID: "Zhangjiajie Dunia Avatar", 
      titleEN: "Zhangjiajie Avatar Expedition", 
      subtitleID: "Menjelajah Pilar Batu Mengambang", 
      subtitleEN: "Floating Pillars", 
      daysID: "6 HARI", 
      daysEN: "6 DAYS", 
      price: "IDR 16.5 JT", 
      datesID: "08 — 13 SEP 2026", 
      datesEN: "08 — 13 SEP 2026", 
      image: "https://images.unsplash.com/photo-1528643807221-50fb7f8a7056?auto=format&fit=crop&q=80" 
    },
    { 
      id: "cn-2", 
      titleID: "Tembok Besar Beijing", 
      titleEN: "Beijing Great Wall Tour", 
      subtitleID: "Sejarah Agung Kekaisaran Tiongkok", 
      subtitleEN: "Imperial History", 
      daysID: "4 HARI", 
      daysEN: "4 DAYS", 
      price: "IDR 11.0 JT", 
      datesID: "15 — 18 OKT 2026", 
      datesEN: "15 — 18 OCT 2026", 
      image: "https://images.unsplash.com/photo-1508804185872-d7bad1006fc5?auto=format&fit=crop&q=80" 
    },
    { 
      id: "cn-3", 
      titleID: "Shanghai Futuristik", 
      titleEN: "Shanghai Futuristic Experience", 
      subtitleID: "Kemegahan Lampu The Bund", 
      subtitleEN: "The Bund Lights", 
      daysID: "3 HARI", 
      daysEN: "3 DAYS", 
      price: "IDR 9.8 JT", 
      datesID: "01 — 03 DES 2026", 
      datesEN: "01 — 03 DEC 2026", 
      image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80" 
    }
  ],
  "India": [
    { 
      id: "in-1", 
      titleID: "Segitiga Emas & Taj Mahal", 
      titleEN: "Golden Triangle & Taj Mahal", 
      subtitleID: "Menjelajah Agra, Jaipur, dan Delhi", 
      subtitleEN: "Agra, Jaipur, Delhi", 
      daysID: "6 HARI", 
      daysEN: "6 DAYS", 
      price: "IDR 14.5 JT", 
      datesID: "10 — 15 OKT 2026", 
      datesEN: "10 — 15 OCT 2026", 
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" 
    },
    { 
      id: "in-2", 
      titleID: "Keindahan Sungai Kerala", 
      titleEN: "Kerala Backwaters Voyage", 
      subtitleID: "Pelayaran Rumah Perahu Mewah", 
      subtitleEN: "Houseboat Luxury", 
      daysID: "5 HARI", 
      daysEN: "5 DAYS", 
      price: "IDR 12.0 JT", 
      datesID: "05 — 09 NOV 2026", 
      datesEN: "05 — 09 NOV 2026", 
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80" 
    },
    { 
      id: "in-3", 
      titleID: "Petualangan Himalaya Ladakh", 
      titleEN: "Ladakh Himalayan Adventure", 
      subtitleID: "Lembah Indah di Ketinggian Awan", 
      subtitleEN: "Valleys of High Passes", 
      daysID: "7 HARI", 
      daysEN: "7 DAYS", 
      price: "IDR 18.2 JT", 
      datesID: "12 — 18 JUL 2026", 
      datesEN: "12 — 18 Jul 2026", 
      image: "https://images.unsplash.com/photo-1605335198007-8eebcc7db1ee?auto=format&fit=crop&q=80" 
    }
  ],
  "Lainnya": [
    { 
      id: "ot-1", 
      titleID: "Kereta Ekspres Pegunungan Alpen", 
      titleEN: "Swiss Alps Express", 
      subtitleID: "Menyusuri Jalur Kereta Gletser Swiss", 
      subtitleEN: "Glacier Railways", 
      daysID: "8 HARI", 
      daysEN: "8 DAYS", 
      price: "IDR 45.0 JT", 
      datesID: "15 — 22 DES 2026", 
      datesEN: "15 — 22 DEC 2026", 
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80" 
    },
    { 
      id: "ot-2", 
      titleID: "Tur Balon Udara Turki", 
      titleEN: "Turkey Balloon Tour", 
      subtitleID: "Pesona Ajaib Lanskap Cappadocia", 
      subtitleEN: "Cappadocia Magic", 
      daysID: "7 HARI", 
      daysEN: "7 DAYS", 
      price: "IDR 21.5 JT", 
      datesID: "10 — 16 SEP 2026", 
      datesEN: "10 — 16 SEP 2026", 
      image: "https://images.unsplash.com/photo-1506509530462-f67e21a2cda5?auto=format&fit=crop&q=80" 
    },
    { 
      id: "ot-3", 
      titleID: "Eksplorasi Singapura & Malaysia", 
      titleEN: "Singapore & Malaysia Highlights", 
      subtitleID: "Menikmati Marina Bay & Menara Kembar Petronas", 
      subtitleEN: "Marina Bay & Twin Towers", 
      daysID: "5 HARI", 
      daysEN: "5 DAYS", 
      price: "IDR 8.5 JT", 
      datesID: "01 — 05 AGU 2026", 
      datesEN: "01 — 05 AUG 2026", 
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80" 
    }
  ]
};

export function FeaturedJourneys() {
  const { t, locale } = useLanguage();
  const [activeCountry, setActiveCountry] = useState("Indonesia");

  const currentTours = TOUR_DATA[activeCountry];
  const mainTour = currentTours[0];
  const secondaryTours = currentTours.slice(1, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <section className="bg-ivory py-24 md:py-36 relative z-10 border-b border-charcoal/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header & Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal font-semibold block mb-4">
              {t("featured_tag")}
            </span>
            <Heading variant="editorial" className="text-foreground text-3xl md:text-4xl mb-4">
              {t("featured_title")}
            </Heading>
            <Text variant="large" className="text-foreground/70 font-light max-w-xl">
              {locale === "id" 
                ? "Perjalanan terkurasi yang dirancang khusus untuk menciptakan kenangan yang mendalam dan bermakna."
                : "Curated journeys designed around places, people and experiences worth remembering."}
            </Text>
          </div>
        </motion.div>

        {/* Custom scrollable tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 mb-12 border-b border-charcoal/10"
        >
          {COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`snap-start whitespace-nowrap pb-4 font-sans text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 relative ${
                activeCountry === country 
                ? "text-charcoal font-bold" 
                : "text-foreground/70 hover:text-foreground font-medium"
              }`}
            >
              {countryLabels[country][locale]}
              {activeCountry === country && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#A89053]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content Container with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCountry}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Mobile Carousel (All Cards Identical) */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 -mx-6 px-6 gap-6">
              {currentTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  variants={cardVariants}
                  className="group cursor-pointer flex flex-col shrink-0 w-[85vw] sm:w-[60vw] snap-center"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-6 bg-charcoal/10 shadow-lg">
                    <img src={tour.image} alt={locale === "id" ? tour.titleID : tour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Floating Top Badge */}
                    <div className="absolute top-5 left-5 z-20 font-mono text-[9px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                      {countryLabels[activeCountry][locale]} // {locale === "id" ? tour.daysID : tour.daysEN}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center pr-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-charcoal/80 mb-3 uppercase tracking-wider">
                      <span>{locale === "id" ? tour.datesID : tour.datesEN}</span>
                      <span>•</span>
                      <span className="text-[#A89053] font-bold text-sm">{locale === "id" ? tour.price : tour.price.replace("JT", "M")}</span>
                    </div>
                    
                    <h3 className="font-serif text-2xl text-[#0F2C59] mb-3 leading-snug group-hover:text-[#A89053] transition-colors duration-300">
                      {locale === "id" ? tour.titleID : tour.titleEN}
                    </h3>
                    <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-6 line-clamp-2">
                      {locale === "id" ? tour.subtitleID : tour.subtitleEN}
                    </p>
                    <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-[#0284C7] font-semibold mt-auto group-hover:text-[#0F2C59] transition-colors">
                      {t("featured_explore_details")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Magazine Split Grid */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-12 md:items-stretch">
              
              {/* Main Story (Left) */}
              <motion.div 
                variants={cardVariants}
                className="md:col-span-7 group cursor-pointer flex flex-col h-full md:w-auto"
              >
                <div className="relative w-full aspect-[16/11] overflow-hidden rounded-xl mb-6 md:mb-8 bg-charcoal/10 shadow-lg">
                  <img src={mainTour.image} alt={locale === "id" ? mainTour.titleID : mainTour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  {/* Floating Top Badge */}
                  <div className="absolute top-5 left-5 z-20 font-mono text-[9px] tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                    {countryLabels[activeCountry][locale]} // {locale === "id" ? mainTour.daysID : mainTour.daysEN}
                  </div>

                  {/* Hover Prompt */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 hidden md:flex">
                    <div className="bg-white/90 backdrop-blur-sm text-charcoal text-[10px] tracking-[0.2em] uppercase py-3.5 px-8 rounded-full shadow-xl">
                      {locale === "id" ? "Lihat Rencana Perjalanan" : "View Itinerary"}
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow flex flex-col justify-center pr-4 md:pr-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-mono text-charcoal/80 mb-3 uppercase tracking-wider">
                    <span>{locale === "id" ? mainTour.datesID : mainTour.datesEN}</span>
                    <span>•</span>
                    <span className="text-[#A89053] font-bold text-sm md:text-base">{locale === "id" ? mainTour.price : mainTour.price.replace("JT", "M")}</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#0F2C59] mb-3 leading-snug group-hover:text-[#A89053] transition-colors duration-300">
                    {locale === "id" ? mainTour.titleID : mainTour.titleEN}
                  </h3>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-6 line-clamp-2">
                    {locale === "id" ? mainTour.subtitleID : mainTour.subtitleEN}
                  </p>
                  <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-[#0284C7] font-semibold mt-auto group-hover:text-[#0F2C59] transition-colors">
                    {t("featured_explore_details")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Secondary Stories (Right) */}
              <div className="md:col-span-5 flex md:flex-col justify-between md:aspect-[80/77]">
                {secondaryTours.map((tour) => (
                  <motion.div 
                    key={tour.id} 
                    variants={cardVariants}
                    className="group cursor-pointer flex flex-col md:flex-row gap-5 md:gap-6 md:items-center w-full"
                  >
                    
                    <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-square overflow-hidden rounded-xl bg-charcoal/10 shrink-0 shadow-md">
                      <img src={tour.image} alt={locale === "id" ? tour.titleID : tour.titleEN} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 md:opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 right-4 z-20 font-mono text-[8px] tracking-[0.2em] uppercase text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10 md:hidden lg:block">
                        {locale === "id" ? tour.daysID : tour.daysEN}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-7/12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs font-mono text-charcoal/70 mb-2 uppercase tracking-wider">
                        <span>{locale === "id" ? tour.datesID : tour.datesEN}</span>
                      </div>
                      
                      <h3 className="font-serif text-xl md:text-xl lg:text-2xl text-[#0F2C59] mb-2 leading-tight group-hover:text-[#A89053] transition-colors duration-300 line-clamp-2">
                        {locale === "id" ? tour.titleID : tour.titleEN}
                      </h3>
                      
                      <div className="text-[#A89053] font-mono text-sm md:text-base font-bold tracking-wider mb-4 md:mb-5">
                        {locale === "id" ? tour.price : tour.price.replace("JT", "M")}
                      </div>

                      <div className="flex items-center text-[9px] font-mono uppercase tracking-widest text-foreground/50 group-hover:text-[#0284C7] transition-colors">
                        {t("featured_explore_details")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
      
      {/* Hide scrollbar completely but maintain functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
