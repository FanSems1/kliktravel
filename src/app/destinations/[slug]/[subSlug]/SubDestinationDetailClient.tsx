"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, DollarSign, Hotel, Check, X, Phone, MapPin,
  Plane, Star, Award, Landmark, Crown, Waves, Camera, Compass, Map, ShieldCheck,
  ChevronLeft, ChevronRight, Share2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { localizedTourPackages, TourPackageDetail } from "@/data/tours";
import { apiFetch } from "@/lib/api";

const subDestinationImages: Record<string, string> = {
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
  bromo: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200",
  "labuan-bajo": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
  "raja-ampat": "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1200",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200",
  phuket: "https://images.unsplash.com/photo-1581023773539-755d78a8bc84?q=80&w=1200",
  "chiang-mai": "https://images.unsplash.com/photo-1590243455953-62588147dff5?q=80&w=1200",
  hanoi: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
  "ho-chi-minh": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200",
  "da-nang": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200",
  seoul: "https://images.unsplash.com/photo-1538678235213-982eb4b7261a?q=80&w=1200",
  busan: "https://images.unsplash.com/photo-1601627918341-a67b93df2bb5?q=80&w=1200",
  jeju: "https://images.unsplash.com/photo-1582862908861-122e23b2dc0b?q=80&w=1200",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200",
  osaka: "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=1200",
  beijing: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=1200",
  shanghai: "https://images.unsplash.com/photo-1474181487882-5abf3f016c2d?q=80&w=1200",
  chengdu: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6858f?q=80&w=1200",
  jaipur: "https://images.unsplash.com/photo-1599661559875-1dc9a9b24479?q=80&w=1200",
  europe: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200",
  america: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200",
  hongkong: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=1200",
  macau: "https://images.unsplash.com/photo-1558285516-f002a281d2a5?q=80&w=1200",
  shenzhen: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?q=80&w=1200",
};


const getHighlightIcon = (hl: string) => {
  const text = hl.toLowerCase();
  if (text.includes("airline") || text.includes("garuda") || text.includes("flight") || text.includes("pesawat")) {
    return <Plane className="w-5 h-5 text-sky-500" />;
  }
  if (text.includes("star") || text.includes("bintang") || text.includes("avenue")) {
    return <Star className="w-5 h-5 text-sky-500" />;
  }
  if (text.includes("heritage") || text.includes("candi") || text.includes("history") || text.includes("museum") || text.includes("1881")) {
    return <Landmark className="w-5 h-5 text-sky-500" />;
  }
  if (text.includes("resort") || text.includes("hotel") || text.includes("venetian") || text.includes("bintang 5")) {
    return <Crown className="w-5 h-5 text-sky-500" />;
  }
  if (text.includes("bay") || text.includes("pantai") || text.includes("laut") || text.includes("beach") || text.includes("sea") || text.includes("ocean")) {
    return <Waves className="w-5 h-5 text-sky-500" />;
  }
  if (text.includes("photo") || text.includes("spot") || text.includes("view") || text.includes("pemandangan")) {
    return <Camera className="w-5 h-5 text-sky-500" />;
  }
  return <Award className="w-5 h-5 text-sky-500" />;
};

const getDetailedDescription = (
  slug: string,
  subSlug: string,
  locale: string,
  currentRegionName: string,
  tagline?: string
): string => {
  if (tagline && tagline.trim() !== "-" && tagline.length > 50) {
    return tagline;
  }

  const s = (slug || "").toLowerCase();
  const sub = (subSlug || "").toLowerCase();
  const isEn = locale === "en";

  if (s === "korea" || sub === "korea" || sub === "seoul" || sub === "nami-island") {
    return isEn
      ? "Explore the mesmerizing wonders of South Korea! From the grandeur of Gyeongbokgung Palace, the romanticism of Nami Island (the iconic Winter Sonata filming location), the excitement of popular ski resorts, to the vibrant shopping streets of Myeongdong and the legendary Starfield Library in Gangnam. Every detail is carefully curated with professional Tour Leaders to ensure an unforgettable, comfortable journey."
      : "Jelajahi keajaiban Korea Selatan yang memukau! Mulai dari megahnya Istana Gyeongbokgung, keromantisan Pulau Nami yang legendaris sebagai lokasi syuting drama Korea, keseruan bermain salju di arena Ski Resort ternama, hingga berburu kuliner dan tren terbaru di kawasan Myeongdong serta berfoto di Starfield Library Gangnam. Dikemas dalam program tour terencana bersama Tour Leader berpengalaman untuk kenyamanan maksimal perjalanan Anda.";
  }

  if (s === "japan" || sub === "japan" || sub === "tokyo" || sub === "kyoto" || sub === "osaka") {
    return isEn
      ? "Experience the perfect harmony of ancient cultural heritage and futuristic wonders in Japan! Enjoy the majestic sights of Mount Fuji, walk through the iconic vermilion Torii gates of Fushimi Inari in Kyoto, feel the neon-lit energy of Tokyo's Shinjuku district, and savor the mouthwatering street food at Dotonbori Osaka. Fully guided with structured itineraries to ensure a memorable, hassle-free holiday."
      : "Rasakan perpaduan sempurna antara warisan budaya leluhur dan kecanggihan masa depan di Jepang! Nikmati kemegahan Gunung Fuji yang ikonik, berjalan di sela gerbang Torii merah Fushimi Inari di Kyoto, rasakan energi gemerlap malam Shinjuku di Tokyo, serta manjakan lidah Anda dengan kuliner autentik di Dotonbori Osaka. Didampingi panduan lengkap untuk memastikan setiap momen liburan Anda terasa istimewa.";
  }

  if (s === "thailand" || sub === "thailand" || sub === "bangkok" || sub === "phuket" || sub === "chiang-mai") {
    return isEn
      ? "Discover the exotic charm of Thailand! Marvel at the golden spires of Wat Arun and the Grand Palace in Bangkok, relax on the pristine tropical shores of Phuket and Phi Phi Islands, or immerse yourself in the rich cultural history and night markets of Chiang Mai. Complete with culinary tours tasting world-famous authentic Thai street foods."
      : "Temukan pesona eksotis Negeri Gajah Putih! Kagumi keindahan arsitektur kuil Wat Arun dan Grand Palace di Bangkok, bersantai di pantai pasir putih tropis Phuket dan Kepulauan Phi Phi, hingga menikmati ketenangan budaya dan pasar seni tradisional di Chiang Mai. Dilengkapi petualangan kuliner malam untuk mencicipi hidangan autentik Thailand yang mendunia.";
  }

  if (s === "vietnam" || sub === "vietnam" || sub === "hanoi" || sub === "halong-bay" || sub === "da-nang") {
    return isEn
      ? "Embark on a magical journey through Vietnam's breathtaking landscapes! Cruise along the emerald waters and limestone karsts of Ha Long Bay, wander through the historical lantern-lit streets of Hoi An Ancient Town, walk the majestic Golden Bridge at Ba Na Hills in Da Nang, and experience the local warmth and exceptional traditional Vietnamese coffee culture."
      : "Jelajahi keajaiban alam nan magis di Vietnam! Nikmati pelayaran mewah di antara pulau-pulau batu kapur ikonik di Ha Long Bay, susuri lorong bersejarah berhias lampion di Kota Tua Hoi An, berjalan di atas Golden Bridge yang megah di Ba Na Hills Da Nang, serta rasakan kehangatan budaya lokal dipadukan cita rasa kopi telur khas Vietnam yang legendaris.";
  }

  if (s === "indonesia" || sub === "indonesia" || sub === "bali" || sub === "bromo" || sub === "labuan-bajo" || sub === "raja-ampat") {
    return isEn
      ? "Immerse yourself in the unmatched natural beauty and diverse heritage of the Indonesian archipelago! Experience the rich culture and picturesque beaches of Bali, sail on a luxury Phinisi yacht across the turquoise waters of Labuan Bajo, watch the breathtaking sunrise over the volcanic sea of sand at Mount Bromo, or dive into the pristine underwater paradise of Raja Ampat."
      : "Manjakan diri Anda dengan keindahan alam Nusantara yang tiada duanya! Rasakan kedamaian budaya dan pantai eksotis di Bali, berlayar dengan kapal Phinisi mewah mengelilingi gugusan pulau eksotis di Labuan Bajo, saksikan matahari terbit yang magis di atas lautan pasir Gunung Bromo, hingga menjelajahi surga bawah laut dunia di Raja Ampat.";
  }

  if (s === "china" || sub === "china" || sub === "beijing" || sub === "shanghai" || sub === "chengdu") {
    return isEn
      ? "Witness the grandeur of ancient dynastic history alongside towering modern marvels in China! Walk along the breathtaking Great Wall, step into history at the Forbidden City in Beijing, admire the futuristic skyline views along The Bund in Shanghai, and meet the adorable giant pandas in Chengdu. Structured with thoughtful services for a comfortable, stress-free exploration."
      : "Saksikan kemegahan sejarah dinasti kuno bersanding dengan arsitektur futuristik di China! Berjalan di atas Tembok Raksasa yang melegenda, jelajahi kompleks Istana Kota Terlarang di Beijing, nikmati gemerlap malam di sepanjang The Bund Shanghai, serta sapa panda raksasa yang menggemaskan di Chengdu. Perjalanan nyaman dengan fasilitas terbaik.";
  }

  if (s === "hongkong" || sub === "hongkong" || sub === "victoria-harbour" || sub === "disneyland-hk") {
    return isEn
      ? "Experience the vibrant energy and cosmopolitan flair of Hong Kong! Take in the spectacular panoramic skyline views from Victoria Peak and Victoria Harbour, enjoy magical family moments at world-class Hong Kong Disneyland, and explore a paradise of duty-free shopping and authentic local Cantonese dim sum delicacies."
      : "Rasakan atmosfer kota kosmopolitan yang dinamis di Hongkong! Nikmati pemandangan gedung pencakar langit yang spektakuler dari Victoria Peak dan Victoria Harbour, buat kenangan manis bersama keluarga di Hongkong Disneyland, serta manjakan diri dengan surga belanja bebas bea masuk dan kelezatan dimsum autentik.";
  }

  if (s === "india" || sub === "india" || sub === "delhi" || sub === "jaipur" || sub === "agra") {
    return isEn
      ? "Step into a breathtaking symphony of rich traditions and magnificent palaces in India! Stand in awe of the timeless white marble beauty of the Taj Mahal in Agra, discover the majestic Pink City palaces in Jaipur, and immerse yourself in the bustling heritage bazaars and aromatic spice culture of New Delhi."
      : "Masuki dunia penuh warna dengan warisan sejarah dan istana megah di India! Kagumi keindahan abadi monumen cinta Taj Mahal di Agra, jelajahi keunikan arsitektur istana kerajaan di Pink City Jaipur, serta rasakan keseruan menyusuri pasar bersejarah yang kaya akan aroma rempah di New Delhi.";
  }

  return isEn
    ? `Enjoy a wonderful and unforgettable holiday experience in ${currentRegionName}! We carefully arrange the best routes combining scenic natural beauty, historical highlights, and popular instagrammable landmarks. Guided by professional Tour Leaders to ensure your dream vacation runs seamlessly and comfortably.`
    : `Nikmati pengalaman liburan istimewa yang tak terlupakan di ${currentRegionName}! Kami menyusun rencana perjalanan terbaik dengan memadukan keindahan panorama alam, nilai sejarah yang tinggi, serta spot instagramable terpopuler. Didampingi oleh Tour Leader profesional untuk memastikan liburan impian Anda berjalan dengan nyaman dan berkesan.`;
};

interface SubDestinationDetailClientProps {
  slug: string;
  subSlug: string;
}

export function SubDestinationDetailClient({ slug, subSlug }: SubDestinationDetailClientProps) {
  const { t, locale } = useLanguage();
  const [activeDay, setActiveDay] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Loaded regions & tour detail states
  const [activeRegions, setActiveRegions] = useState<RegionDestination[]>([]);
  const [allMatchingOpenTrips, setAllMatchingOpenTrips] = useState<TourPackageDetail[]>([]);
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);

  // Header Gallery & Date states
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [calendarMonthDate, setCalendarMonthDate] = useState<Date>(new Date(2026, 8, 1));
  const [modalSelectedDateIdx, setModalSelectedDateIdx] = useState<number>(0);

  const parseBatchRange = (item: any) => {
    let start: Date | null = null;
    let end: Date | null = null;

    const b = item?.batch;
    if (b?.fromDate) {
      const d = new Date(b.fromDate);
      if (!isNaN(d.getTime())) start = d;
    }
    if (b?.toDate) {
      const d = new Date(b.toDate);
      if (!isNaN(d.getTime())) end = d;
    }

    if (!start && item?.date) {
      const str = item.date.trim();
      const monthMap: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5, jul: 6, agt: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11
      };
      const yearMatch = str.match(/\b(202\d)\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;

      const parts = str.split("-").map((s: string) => s.trim());
      if (parts.length === 2) {
        const endPart = parts[1];
        const endMonthMatch = endPart.match(/([a-zA-Z]{3,})/);
        const endDayMatch = endPart.match(/\b(\d{1,2})\b/);
        let endMonthIdx = 8;
        if (endMonthMatch) {
          const key = endMonthMatch[1].toLowerCase().slice(0, 3);
          if (monthMap[key] !== undefined) endMonthIdx = monthMap[key];
        }
        let endDay = endDayMatch ? parseInt(endDayMatch[1], 10) : 15;
        end = new Date(year, endMonthIdx, endDay);

        const startPart = parts[0];
        const startMonthMatch = startPart.match(/([a-zA-Z]{3,})/);
        const startDayMatch = startPart.match(/\b(\d{1,2})\b/);
        let startMonthIdx = endMonthIdx;
        if (startMonthMatch) {
          const key = startMonthMatch[1].toLowerCase().slice(0, 3);
          if (monthMap[key] !== undefined) startMonthIdx = monthMap[key];
        }
        let startDay = startDayMatch ? parseInt(startDayMatch[1], 10) : 11;
        start = new Date(year, startMonthIdx, startDay);
      } else {
        const m = str.match(/(\d{1,2})\s+([a-zA-Z]{3,})/);
        if (m) {
          const day = parseInt(m[1], 10);
          const key = m[2].toLowerCase().slice(0, 3);
          const mIdx = monthMap[key] !== undefined ? monthMap[key] : 8;
          start = new Date(year, mIdx, day);
          end = new Date(year, mIdx, day + 4);
        }
      }
    }

    if (start && !end) {
      end = new Date(start);
      end.setDate(end.getDate() + 4);
    }

    if (start) start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    if (end) end = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return { start, end };
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const tourDetail = allMatchingOpenTrips[selectedDateIdx] || allMatchingOpenTrips[0] || null;

  // Format hyphenated name to Title Case with spaces if it looks like a slug
  const displayTourName = (() => {
    if (!tourDetail) return "";
    const name = tourDetail.name || "";
    if (name.includes("-") && !name.includes(" ")) {
      return name
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return name;
  })();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Load active regions from API or localStorage or fallback
        let currentRegions: RegionDestination[] = localizedRegions[locale] || [];
        try {
          const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
          if (data && Array.isArray(data) && data.length > 0) {
            currentRegions = data.map((r) => {
              let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
              let image = "";
              if (gradient.includes("||")) {
                const parts = gradient.split("||");
                gradient = parts[0];
                image = parts[1];
              }

              const subDestinations = (r.subDestinations || []).map((s: any) => {
                let subName = s.name || s.nameId || s.nameEn || "";
                let subImage = "";
                if (subName.includes("||")) {
                  const parts = subName.split("||");
                  subName = parts[0];
                  subImage = parts[1];
                }
                return {
                  name: subName,
                  slug: s.slug,
                  image: subImage
                };
              });

              return {
                id: r.id || r.key || r.slug,
                name: r.name ? r.name.split("||")[0] : r.slug,
                slug: r.slug,
                subtitle: r.subtitle || "",
                featuredImageGradient: gradient,
                image: image || "",
                subDestinations
              };
            });
          } else {
            const saved = localStorage.getItem("klik_admin_destinations");
            if (saved) {
              currentRegions = JSON.parse(saved);
            }
          }
        } catch (e) {
          console.error(e);
        }
        setActiveRegions(currentRegions);

        const region = currentRegions.find((r) => r.slug === slug);
        const subDestination = region?.subDestinations.find((s) => s.slug === subSlug);

        // 2. Load tour details (all open-trips and journeys matching current destination)
        let matchingPackages: TourPackageDetail[] = [];
        let allOpenTripsList: any[] = [];
        try {
          const [openTrips, journeys] = await Promise.all([
            apiFetch<any[]>(`/open-trips?locale=${locale}`).catch(() => []),
            apiFetch<any[]>(`/journeys?locale=${locale}`).catch(() => [])
          ]);

          const combinedTrips = [
            ...(openTrips && Array.isArray(openTrips) ? openTrips : []),
            ...(journeys && Array.isArray(journeys) ? journeys : [])
          ];

          if (combinedTrips.length > 0) {
            allOpenTripsList = combinedTrips;
            const matches = combinedTrips.filter(p => {
              const cId = p.contentId || p.contentID || {};
              const cEn = p.contentEn || p.contentEN || {};
              const pSubSlug = (p.subSlug || cId.subSlug || cEn.subSlug || p.slug || "").toLowerCase();
              const targetSubSlug = subSlug.toLowerCase();
              return pSubSlug === targetSubSlug || p.slug?.toLowerCase() === targetSubSlug;
            });

            if (matches.length > 0) {
              matchingPackages = matches.map(match => {
                const cId = match.contentId || match.contentID || {};
                const cEn = match.contentEn || match.contentEN || {};
                const active = locale === "en" ? (Object.keys(cEn).length > 0 ? cEn : (Object.keys(cId).length > 0 ? cId : match)) : (Object.keys(cId).length > 0 ? cId : match);
                const itinSource = active.itinerary || match.itinerary || [];

                return {
                  id: match.id,
                  slug: match.slug,
                  regionSlug: match.regionSlug || active.regionSlug || "",
                  subSlug: match.subSlug || active.subSlug || "",
                  name: locale === "id"
                    ? (active.title || active.name || match.name || match.slug || "")
                    : (active.title || active.nameEN || active.name || match.nameEN || match.name || match.slug || ""),
                  tagline: locale === "id"
                    ? (active.subtitle || active.tagline || match.tagline || "")
                    : (active.subtitle || active.taglineEN || active.tagline || match.taglineEN || match.tagline || ""),
                  duration: locale === "id"
                    ? (active.durationLabel || active.duration || match.duration || (match.durationDays ? `${match.durationDays} Hari` : "5 Hari 4 Malam"))
                    : (active.durationLabel || active.durationEN || active.duration || match.durationEN || match.duration || (match.durationDays ? `${match.durationDays} Days` : "5 Days 4 Nights")),
                  price: locale === "id"
                    ? (active.price || match.price || match.priceRaw || "")
                    : (active.priceEN || active.price || match.priceEN || match.price || match.priceRaw || ""),
                  departureDate: active.departureDate || match.departureDate || match.dates || "",
                  departureDateFrom: match.departureDateFrom || "",
                  departureDateTo: match.departureDateTo || "",
                  hotelRating: (locale === "id" ? (active.hotelRating || match.hotelRating) : (active.hotelRatingEN || active.hotelRating || match.hotelRatingEN || match.hotelRating)) || match.hotel || (itinSource && itinSource[0]?.hotel) || "",
                  featuredImage: match.featuredImage || match.image || active.featuredImage || active.image || subDestination?.image || subDestinationImages[subSlug] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
                  highlights: (locale === "id" ? (active.highlights || match.highlights) : (active.highlightsEN || active.highlights || match.highlightsEN || match.highlights)) || [],
                  inclusions: (locale === "id" ? (active.inclusions || match.inclusions) : (active.inclusionsEN || active.inclusions || match.inclusionsEN || match.inclusions)) || [],
                  exclusions: (locale === "id" ? (active.exclusions || match.exclusions) : (active.exclusionsEN || active.exclusions || match.exclusionsEN || match.exclusions)) || [],
                  schedules: match.schedules || active.schedules || [],
                  batches: match.batches || active.batches || [],
                  itinerary: (itinSource || []).map((d: any) => ({
                    day: d.day,
                    title: locale === "id" ? d.title : (d.titleEN || d.titleEn || d.title),
                    titleEN: d.titleEN || d.titleEn || d.title,
                    activities: (locale === "id" ? d.activities : (d.activitiesEN || d.activitiesEn || d.activities)) || [],
                    activitiesEN: d.activitiesEN || d.activitiesEn || d.activities,
                    description: locale === "id" ? d.description : (d.descriptionEN || d.descriptionEn || d.description),
                    descriptionEN: d.descriptionEN || d.descriptionEn || d.description,
                    hotel: locale === "id" ? d.hotel : (d.hotelEN || d.hotelEn || d.hotel),
                    hotelEN: d.hotelEN || d.hotelEn || d.hotel,
                    image: d.image,
                    images: d.images
                  }))
                };
              });
            }
          }

          if (matchingPackages.length === 0) {
            const savedTrips = localStorage.getItem("klik_admin_open_trips");
            if (savedTrips) {
              const parsed: any[] = JSON.parse(savedTrips);
              allOpenTripsList = parsed;
              const matches = parsed.filter(p => {
                const cId = p.contentId || p.contentID || {};
                const cEn = p.contentEn || p.contentEN || {};
                const pSubSlug = (p.subSlug || cId.subSlug || cEn.subSlug || p.slug || "").toLowerCase();
                const targetSubSlug = subSlug.toLowerCase();
                return pSubSlug === targetSubSlug || p.slug?.toLowerCase() === targetSubSlug;
              });
              if (matches.length > 0) {
                matchingPackages = matches.map(match => ({
                  id: match.id || match.slug,
                  slug: match.slug,
                  regionSlug: match.regionSlug,
                  subSlug: match.subSlug,
                  name: locale === "id" ? match.name : (match.nameEN || match.name),
                  tagline: locale === "id" ? match.tagline : (match.taglineEN || match.tagline),
                  duration: locale === "id" ? match.duration : (match.durationEN || match.duration),
                  price: locale === "id" ? match.price : (match.priceEN || match.price),
                  departureDate: (locale === "id" ? match.departureDate : (match.departureDateEN || match.departureDate)) || match.dates || "",
                  departureDateFrom: match.departureDateFrom || "",
                  departureDateTo: match.departureDateTo || "",
                  schedules: match.schedules || [],
                  batches: match.batches || [],
                  hotelRating: (locale === "id" ? match.hotelRating : (match.hotelRatingEN || match.hotelRating)) || match.hotel || (match.itinerary && match.itinerary[0]?.hotel) || "",
                  featuredImage: match.featuredImage || match.image || subDestination?.image || subDestinationImages[subSlug] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
                  highlights: (locale === "id" ? match.highlights : (match.highlightsEN || match.highlights)) || [],
                  inclusions: (locale === "id" ? match.inclusions : (match.inclusionsEN || match.inclusions)) || [],
                  exclusions: (locale === "id" ? match.exclusions : (match.exclusionsEN || match.exclusions)) || [],
                  itinerary: (match.itinerary || []).map((d: any) => ({
                    day: d.day,
                    title: locale === "id" ? d.title : (d.titleEN || d.title),
                    activities: (locale === "id" ? d.activities : (d.activitiesEN || d.activities)) || [],
                    description: locale === "id" ? d.description : (d.descriptionEN || d.description),
                    hotel: locale === "id" ? d.hotel : (d.hotelEN || d.hotel),
                    image: d.image,
                    images: d.images
                  }))
                }));
              }
            }
          }

          if (matchingPackages.length === 0) {
            const dict = localizedTourPackages[locale] || {};
            const staticPackages = Object.values(dict);
            const matches = staticPackages.filter((p: TourPackageDetail) => p.subSlug === subSlug || p.slug === subSlug);
            if (matches.length > 0) {
              matchingPackages = matches;
            } else if (dict[subSlug] || dict[slug]) {
              const fallbackPkg = dict[subSlug] || dict[slug];
              if (fallbackPkg) matchingPackages = [fallbackPkg];
            }
          }
        } catch (e) {
          console.error(e);
        }

        setAllMatchingOpenTrips(matchingPackages);

        // 4. Generate Featured Tours resolving dynamic images from open trips or keyword dictionary
        const otherRegions = currentRegions.filter(r => r.slug !== slug);
        const shuffledRegions = [...otherRegions].sort(() => 0.5 - Math.random());
        const selectedRegions = shuffledRegions.slice(0, 3);
        const tours = selectedRegions.map(r => {
          const randomSub = r.subDestinations[Math.floor(Math.random() * r.subDestinations.length)];
          const subSlugKey = randomSub?.slug || "bali";

          // Find dynamic open trip matching this subdestination or region
          const matchingTrip = allOpenTripsList.find(p => p.subSlug === subSlugKey || p.slug === subSlugKey || p.regionSlug === r.slug);

          // Fallback keyword search
          let keywordImage = "";
          const combined = `${subSlugKey} ${r.slug} ${randomSub?.name || ""}`.toLowerCase();
          if (combined.includes("hongkong") || combined.includes("hong-kong") || combined.includes("macau") || combined.includes("shenzhen")) {
            keywordImage = "https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=1200";
          } else if (combined.includes("tokyo") || combined.includes("japan") || combined.includes("kyoto") || combined.includes("osaka")) {
            keywordImage = "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200";
          } else if (combined.includes("seoul") || combined.includes("korea") || combined.includes("jeju")) {
            keywordImage = "https://images.unsplash.com/photo-1538678235213-982eb4b7261a?q=80&w=1200";
          } else if (combined.includes("bangkok") || combined.includes("thailand") || combined.includes("phuket")) {
            keywordImage = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200";
          } else if (combined.includes("hanoi") || combined.includes("vietnam") || combined.includes("halong")) {
            keywordImage = "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200";
          } else if (combined.includes("beijing") || combined.includes("china") || combined.includes("shanghai")) {
            keywordImage = "https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=1200";
          } else if (combined.includes("bali")) {
            keywordImage = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200";
          } else if (combined.includes("bajo") || combined.includes("komodo")) {
            keywordImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200";
          }

          const resolvedImage =
            matchingTrip?.featuredImage ||
            matchingTrip?.image ||
            randomSub?.image ||
            r.image ||
            subDestinationImages[subSlugKey] ||
            subDestinationImages[r.slug] ||
            keywordImage ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200";

          return {
            regionSlug: r.slug,
            regionName: r.name,
            subSlug: subSlugKey,
            name: randomSub?.name || r.name,
            image: resolvedImage
          };
        });
        setFeaturedTours(tours);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, subSlug, locale]);

  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#FBFBFB]">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-20 h-20 rounded-full bg-sky-500/5 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-sky-500 border-b border-l border-b-sky-500/20 border-l-sky-500/20 animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute animate-pulse">
            <Compass className="w-6 h-6 text-sky-500" />
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-600 font-bold">
          {locale === "id" ? "Memuat Keindahan..." : "Discovering Beauty..."}
        </span>
      </div>
    );
  }

  if (!tourDetail) {
    const destinationTitle = subSlug.replace(/-/g, " ").toUpperCase();
    const waText = encodeURIComponent(
      locale === "id"
        ? `Halo Klik Travel ID, saya tertarik dengan informasi detail tour ke ${destinationTitle} (${slug}/${subSlug}). Apakah ada jadwal rute yang tersedia?`
        : `Hello Klik Travel ID, I am interested in tour details for ${destinationTitle} (${slug}/${subSlug}). Are there available schedules?`
    );

    return (
      <div className="min-h-screen bg-ivory text-foreground flex flex-col items-center justify-center p-6 text-center pt-28 pb-20">
        <div className="max-w-xl w-full bg-white border border-[#0F2C59]/10 rounded-3xl p-8 md:p-12 shadow-lg flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 rounded-2xl bg-sky-50 flex items-center justify-center mb-6 text-[#0284C7] shadow-inner">
            <MapPin className="w-10 h-10 stroke-[1.5]" />
          </div>

          <span className="font-mono text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-3 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full">
            404 NOT FOUND
          </span>

          <h1 className="font-serif text-2xl md:text-4xl text-[#0F2C59] font-normal mb-4 leading-snug">
            {locale === "id"
              ? "Belum Ada Tour Detail Pada Tujuan Ini"
              : "No Tour Details Available For This Destination Yet"}
          </h1>

          <p className="font-sans text-sm md:text-base text-[#0F2C59]/70 max-w-md mb-8 leading-relaxed">
            {locale === "id"
              ? `Tujuan "${subSlug}" belum memiliki rute paket tour detail yang aktif. Silakan hubungi admin kami untuk informasi selengkapnya.`
              : `The destination "${subSlug}" does not have active tour package details yet. Please contact our admin for details.`}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <a
              href={`https://wa.me/6281230011027?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-7 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{locale === "id" ? "Hubungi Admin via WhatsApp" : "Contact Admin via WhatsApp"}</span>
            </a>

            <Link
              href="/destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0284C7] text-white py-3.5 px-7 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === "id" ? "Kembali ke Destinasi" : "Back to Destinations"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Departure dates list dynamically generated from matching open trips, their schedules array, or multi-schedule batches
  const departureDatesList = (() => {
    const primaryTrip = allMatchingOpenTrips[0];
    if (primaryTrip) {
      const rawSchedules = (primaryTrip as any).schedules;
      const rawBatches = (primaryTrip as any).batches;

      if (rawSchedules && Array.isArray(rawSchedules) && rawSchedules.length > 0) {
        // Filter out closed status schedules ("jika close maka tidak muncul di website")
        const activeSchedules = rawSchedules.filter((s: any) => s.status !== "close");

        if (activeSchedules.length > 0) {
          return activeSchedules.map((schedule: any) => {
            let dayOfWeek = "";
            const formattedPrice = schedule.price ? `Rp ${schedule.price.toLocaleString("id-ID")}` : "";

            let durID = "5 Hari 4 Malam";
            let durEN = "5 Days 4 Nights";
            let dtID = "";
            let dtEN = "";

            if (schedule.startDate && schedule.endDate) {
              const start = new Date(schedule.startDate);
              const end = new Date(schedule.endDate);
              if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
                const daysID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                const daysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                dayOfWeek = locale === "id" ? daysID[start.getDay()] : daysEN[start.getDay()];

                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                const diffNights = diffDays - 1;
                durID = `${diffDays} Hari ${diffNights > 0 ? `${diffNights} Malam` : ""}`.trim();
                durEN = `${diffDays} Days ${diffNights > 0 ? `${diffNights} Nights` : ""}`.trim();

                const startDay = start.getDate();
                const startYear = start.getFullYear();
                const endDay = end.getDate();
                const endYear = end.getFullYear();

                const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
                const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const startMonthID = monthsId[start.getMonth()];
                const startMonthEN = monthsEn[start.getMonth()];
                const endMonthID = monthsId[end.getMonth()];
                const endMonthEN = monthsEn[end.getMonth()];

                if (startYear === endYear) {
                  if (startMonthID === endMonthID) {
                    if (startDay === endDay) {
                      dtID = `${startDay} ${startMonthID} ${startYear}`;
                      dtEN = `${startDay} ${startMonthEN} ${startYear}`;
                    } else {
                      dtID = `${startDay} - ${endDay} ${startMonthID} ${startYear}`;
                      dtEN = `${startDay} - ${endDay} ${startMonthEN} ${startYear}`;
                    }
                  } else {
                    dtID = `${startDay} ${startMonthID} - ${endDay} ${endMonthID} ${startYear}`;
                    dtEN = `${startDay} ${startMonthEN} - ${endDay} ${endMonthEN} ${startYear}`;
                  }
                } else {
                  dtID = `${startDay} ${startMonthID} ${startYear} - ${endDay} ${endMonthID} ${endYear}`;
                  dtEN = `${startDay} ${startMonthEN} ${startYear} - ${endDay} ${endMonthEN} ${endYear}`;
                }
              }
            }

            if (!dayOfWeek) {
              dayOfWeek = locale === "id" ? "Jumat" : "Fri";
            }

            const batchObj = {
              id: `schedule-${schedule.startDate}`,
              dateStrID: dtID || schedule.startDate || "",
              dateStrEN: dtEN || schedule.startDate || "",
              fromDate: schedule.startDate,
              toDate: schedule.endDate,
              durationID: durID,
              durationEN: durEN,
              priceID: formattedPrice,
              priceEN: formattedPrice,
              status: schedule.status === "close" ? "Closed" : "Available",
              quota: schedule.quota
            };

            return {
              day: dayOfWeek,
              date: (locale === "id" ? dtID : dtEN) || schedule.startDate || "TBA",
              count: 1,
              batch: batchObj
            };
          });
        }
      }

      if (rawBatches && Array.isArray(rawBatches) && rawBatches.length > 0) {
        return rawBatches.map((batch: any) => {
          let dayOfWeek = "";
          const dateLabel = (locale === "id" ? batch.dateStrID : (batch.dateStrEN || batch.dateStrID)) || "";

          if (batch.fromDate) {
            const dateObj = new Date(batch.fromDate);
            if (!isNaN(dateObj.getTime())) {
              const daysID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
              const daysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              dayOfWeek = locale === "id" ? daysID[dateObj.getDay()] : daysEN[dateObj.getDay()];
            }
          }

          if (!dayOfWeek && dateLabel) {
            const lower = dateLabel.toLowerCase();
            if (lower.includes("senin") || lower.includes("mon")) dayOfWeek = locale === "id" ? "Senin" : "Mon";
            else if (lower.includes("selasa") || lower.includes("tue")) dayOfWeek = locale === "id" ? "Selasa" : "Tue";
            else if (lower.includes("rabu") || lower.includes("wed")) dayOfWeek = locale === "id" ? "Rabu" : "Wed";
            else if (lower.includes("kamis") || lower.includes("thu")) dayOfWeek = locale === "id" ? "Kamis" : "Thu";
            else if (lower.includes("jumat") || lower.includes("fri")) dayOfWeek = locale === "id" ? "Jumat" : "Fri";
            else if (lower.includes("sabtu") || lower.includes("sat")) dayOfWeek = locale === "id" ? "Sabtu" : "Sat";
            else if (lower.includes("minggu") || lower.includes("sun")) dayOfWeek = locale === "id" ? "Minggu" : "Sun";
          }

          if (!dayOfWeek) {
            dayOfWeek = locale === "id" ? "Jumat" : "Fri";
          }

          return {
            day: dayOfWeek,
            date: dateLabel || "TBA",
            count: 1,
            batch
          };
        });
      }
    }

    if (allMatchingOpenTrips.length > 0) {
      return allMatchingOpenTrips.map((item) => {
        let dayOfWeek = "";
        let dateLabel = item.departureDate || "";

        if (item.departureDateFrom) {
          const dateObj = new Date(item.departureDateFrom);
          if (!isNaN(dateObj.getTime())) {
            const daysID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const daysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            dayOfWeek = locale === "id" ? daysID[dateObj.getDay()] : daysEN[dateObj.getDay()];
          }
        }

        if (!dayOfWeek && dateLabel) {
          const lower = dateLabel.toLowerCase();
          if (lower.includes("senin") || lower.includes("mon")) dayOfWeek = locale === "id" ? "Senin" : "Mon";
          else if (lower.includes("selasa") || lower.includes("tue")) dayOfWeek = locale === "id" ? "Selasa" : "Tue";
          else if (lower.includes("rabu") || lower.includes("wed")) dayOfWeek = locale === "id" ? "Rabu" : "Wed";
          else if (lower.includes("kamis") || lower.includes("thu")) dayOfWeek = locale === "id" ? "Kamis" : "Thu";
          else if (lower.includes("jumat") || lower.includes("fri")) dayOfWeek = locale === "id" ? "Jumat" : "Fri";
          else if (lower.includes("sabtu") || lower.includes("sat")) dayOfWeek = locale === "id" ? "Sabtu" : "Sat";
          else if (lower.includes("minggu") || lower.includes("sun")) dayOfWeek = locale === "id" ? "Minggu" : "Sun";
        }

        if (!dayOfWeek) {
          dayOfWeek = locale === "id" ? "Jumat" : "Fri";
        }

        if (dateLabel.includes(",") && dateLabel.split(",")[1]) {
          dateLabel = dateLabel.split(",")[1].trim();
        }

        return {
          day: dayOfWeek,
          date: dateLabel || "TBA",
          count: 1
        };
      });
    }

    return [
      { day: locale === "id" ? "Jumat" : "Fri", date: "04 Sep 2026", count: 1 },
      { day: locale === "id" ? "Jumat" : "Fri", date: "11 Sep 2026", count: 1 },
      { day: locale === "id" ? "Jumat" : "Fri", date: "18 Sep 2026", count: 1 },
      { day: locale === "id" ? "Jumat" : "Fri", date: "25 Sep 2026", count: 1 },
      { day: locale === "id" ? "Rabu" : "Wed", date: "30 Sep 2026", count: 1 },
    ];
  })();

  const activeBatch = (departureDatesList[selectedDateIdx] as any)?.batch || null;
  const activeDepartureDate = departureDatesList[selectedDateIdx]?.date || "";
  const displayDuration = activeBatch
    ? (locale === "id" ? activeBatch.durationID : (activeBatch.durationEN || activeBatch.durationID))
    : tourDetail.duration;

  const whatsappMessage = encodeURIComponent(
    locale === "id"
      ? `Halo Klik Travel ID, saya tertarik dengan paket tour "${displayTourName}" (${displayDuration}) keberangkatan tanggal ${activeDepartureDate}. Mohon informasi ketersediaan jadwal.`
      : `Hello Klik Travel ID, I am interested in the "${displayTourName}" tour package (${displayDuration}) departing on ${activeDepartureDate}. Please provide schedule availability details.`
  );

  const vipWhatsappMessage = encodeURIComponent(
    locale === "id"
      ? `Halo Klik Travel ID, saya berminat dengan Layanan VIP / Private Trip untuk destinasi "${displayTourName}". Saya membutuhkan penyesuaian kelas penerbangan, upgrade hotel bintang 5, atau custom itinerary. Mohon informasi & konsultasi lebih lanjut.`
      : `Hello Klik Travel ID, I am interested in your VIP / Private Trip Service for "${displayTourName}". I need custom flight class, 5★ hotel upgrade, or a custom itinerary. Please assist me with further consultation.`
  );

  // Format price string cleanly
  const currentRegion = activeRegions.find(r => r.slug === slug);
  const currentRegionName = currentRegion?.name || (slug ? slug.replace(/-/g, " ") : "");
  const tripBadgeText = `TRIP ${currentRegionName.toUpperCase()}`;

  const formattedPrice = (() => {
    const rawTargetPrice = activeBatch
      ? (locale === "id" ? activeBatch.priceID : (activeBatch.priceEN || activeBatch.priceID))
      : tourDetail.price;
    const rawPrice = (rawTargetPrice || "").toString().trim();
    if (!rawPrice || rawPrice === "-") return "-";
    if (rawPrice.toLowerCase().includes("rp") || rawPrice.toLowerCase().includes("usd") || rawPrice.toLowerCase().includes("idr")) {
      return rawPrice;
    }
    const numericOnly = rawPrice.replace(/[^0-9]/g, "");
    if (numericOnly) {
      const numFormatted = Number(numericOnly).toLocaleString("id-ID");
      return `Rp ${numFormatted}`;
    }
    return rawPrice;
  })();

  // Format accommodation rating fallback cleanly
  const formattedAccommodation = (() => {
    const rawAcc = (tourDetail.hotelRating || tourDetail.itinerary?.[0]?.hotel || "").trim();
    if (!rawAcc || rawAcc === "-") {
      return locale === "id" ? "Pilihan Hotel Bintang 4 / Setara" : "Selected 4★ Hotel / Equivalent";
    }
    return rawAcc;
  })();

  // Deduplicate tagline if it repeats the title
  const hasDistinctTagline = tourDetail.tagline &&
    tourDetail.tagline.toLowerCase() !== displayTourName.toLowerCase() &&
    tourDetail.tagline !== "-";

  const heroImage = tourDetail.featuredImage ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1800";

  // Gallery images compiling
  const fallbackGallery = [
    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800",
  ];

  const galleryImages = [
    tourDetail.featuredImage,
    ...(tourDetail.itinerary?.map(d => d.image).filter(Boolean) || [])
  ].filter(Boolean);

  // Pad gallery to exactly 4 items
  while (galleryImages.length < 4) {
    const fallbackImg = fallbackGallery[galleryImages.length % fallbackGallery.length];
    galleryImages.push(fallbackImg);
  }

  const displayMainImage = activeImage || galleryImages[0] || heroImage;

  const handlePrevImage = () => {
    const currentIdx = galleryImages.indexOf(displayMainImage);
    const prevIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[prevIdx]);
  };

  const handleNextImage = () => {
    const currentIdx = galleryImages.indexOf(displayMainImage);
    const nextIdx = (currentIdx + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIdx]);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen font-sans selection:bg-sky-500 selection:text-white pb-24">

      {/* Top Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-xs font-sans text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/journeys" className="hover:text-teal-600 transition-colors font-medium">
            {locale === "id" ? "Semua Tour" : "All Tours"}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link href={`/destinations/${slug}`} className="hover:text-teal-600 transition-colors font-medium">
            {currentRegionName || (locale === "id" ? "Destinasi" : "Destination")}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="font-semibold text-slate-800">{displayTourName}</span>
        </nav>
      </div>

      {/* Main Grid Section: Image Gallery & Tour Info */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDE: Big Main Image Carousel + Thumbnail Images */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">

            {/* Main Big Image with Chevron Arrows */}
            <div className="relative flex-1 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-md group border border-slate-200">
              <img
                src={displayMainImage}
                alt={displayTourName}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/5" />

              {/* Chevron Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Vertical Stack of Preview Thumbnails (Desktop) / Horizontal Row (Mobile) */}
            <div className="flex flex-row md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${displayMainImage === imgUrl
                      ? "border-teal-600 ring-2 ring-teal-500/20 opacity-100 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: Badge, Title, Subtitle, Highlights & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch min-h-[300px]">
            <div>
              {/* Super Sale / Offer Badge */}
              <div className="inline-block bg-[#0284C7] text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md mb-3.5 shadow-sm">
                Super Sale
              </div>

              {/* Main Title */}
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 leading-snug mb-3">
                {displayTourName}
              </h1>

              {/* Sub-info / Departure Count */}
              <div className="text-xs font-sans text-slate-600 mb-4 font-medium">
                {departureDatesList.length} {locale === "id" ? "Tanggal Keberangkatan" : "Departure Dates"} • {displayDuration}
              </div>

              <div className="w-full h-[1px] bg-slate-200 mb-4" />

              {/* Description Paragraph */}
              <p className="font-sans text-slate-700 text-xs md:text-sm leading-relaxed mb-6 font-normal">
                {getDetailedDescription(slug, subSlug, locale, currentRegionName, tourDetail.tagline)}
              </p>
            </div>

            {/* Price & Primary CTA Row */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-4 mt-auto">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  {locale === "id" ? "HARGA SPESIAL" : "SPECIAL PRICE"}
                </span>
                <span className="block font-sans font-extrabold text-xl md:text-2xl text-[#0284C7]">
                  {formattedPrice}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Share Button with feedback */}
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#0F2C59]/70 hover:text-[#0284C7] transition-all shadow-sm relative group cursor-pointer"
                  title={locale === "id" ? "Bagikan Tour Ini" : "Share This Tour"}
                >
                  <Share2 className="w-5 h-5" />
                  {isCopied && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0F2C59] text-white text-[10px] py-1 px-2.5 rounded shadow-md whitespace-nowrap z-30">
                      {locale === "id" ? "Link Disalin!" : "Link Copied!"}
                    </span>
                  )}
                </button>

                {/* Main WhatsApp CTA Button */}
                <a
                  href={`https://wa.me/6281230011027?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white px-6 py-3 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>{locale === "id" ? "Cek Ketersediaan" : "Check Availability"}</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Departure Dates Selector Bar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">

          {/* Navy "Lihat Semua Tanggal" Button */}
          <button 
            onClick={() => {
              setModalSelectedDateIdx(selectedDateIdx);
              const activeItem = departureDatesList[selectedDateIdx] || departureDatesList[0];
              if (activeItem) {
                const parsed = parseBatchRange(activeItem);
                if (parsed.start) {
                  setCalendarMonthDate(new Date(parsed.start.getFullYear(), parsed.start.getMonth(), 1));
                }
              }
              setIsDateModalOpen(true);
            }}
            className="bg-[#0F2C59] hover:bg-[#0284C7] text-white font-sans font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-center gap-2.5 shrink-0 shadow-md transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{locale === "id" ? "Lihat Semua Tanggal" : "View All Dates"}</span>
          </button>

          {/* Date Pills Horizontal Row */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            {departureDatesList.map((item: any, idx: number) => {
              const isSelected = selectedDateIdx === idx;
              const b = (item as any).batch;
              const isFull = b?.status === "FULL";
              const isClosed = b?.status === "Closed";

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIdx(idx)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center ${isSelected
                      ? "bg-[#0284C7] border-[#0284C7] text-white shadow-sm"
                      : isFull || isClosed
                        ? "bg-slate-50 border-slate-200 text-slate-400 opacity-70"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                    }`}
                >
                  <span className="block text-[10px] uppercase font-medium tracking-wide opacity-80">
                    {item.day}
                  </span>
                  <span className="block text-xs font-bold whitespace-nowrap">
                    {item.date}
                  </span>
                  <span className="block text-[9px] opacity-80 font-normal mt-0.5 font-mono">
                    {b
                      ? (locale === "id" ? b.priceID : (b.priceEN || b.priceID))
                      : `${item.count} ${locale === "id" ? "Keberangkatan" : "Departure"}`
                    }
                  </span>
                  {b && (isFull || isClosed) && (
                    <span className={`inline-block mt-1 px-1.5 py-0.2 text-[8px] font-bold text-white uppercase rounded font-mono ${isFull ? "bg-rose-600" : "bg-amber-600"
                      }`}>
                      {isFull ? (locale === "id" ? "Penuh" : "FULL") : (locale === "id" ? "Tutup" : "Closed")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Date Summary Line */}
        <div className="mt-4 text-xs font-sans text-slate-600 font-medium">
          {locale === "id"
            ? `Terdapat 1 keberangkatan pada ${departureDatesList[selectedDateIdx]?.date || "tanggal ini"}:`
            : `1 departure available on ${departureDatesList[selectedDateIdx]?.date || "this date"}:`}
        </div>
      </section>

      {/* Main Content: Highlights & Itinerary */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Side: Highlights & Daily Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">

          {/* Highlights Card */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col gap-1 mb-6 pb-3 border-b border-slate-100">
              <span className="font-mono text-[9px] uppercase tracking-widest text-sky-600 font-bold">
                {locale === "id" ? "ATRAKSI TERKULTIVASI" : "CURATED ATTRACTIONS"}
              </span>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-slate-900">{t("itinerary_highlights")}</h2>
            </div>
            <div className="flex flex-row overflow-x-auto md:flex-nowrap divide-x-0 md:divide-x divide-slate-100 scrollbar-none gap-4 md:gap-0 pb-2 md:pb-0 w-full">
              {tourDetail.highlights.map((hl, idx) => (
                <div key={idx} className="flex flex-col items-center justify-start px-2 shrink-0 md:flex-1 w-[130px] md:w-auto transition-all duration-300 hover:scale-[1.03] group text-center">
                  <div className="w-10 h-10 rounded-full bg-sky-50/60 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm mb-2.5">
                    {getHighlightIcon(hl)}
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-sky-600 font-bold block mb-1">Highlight 0{idx + 1}</span>
                  <span className="font-sans text-[10px] md:text-[11px] text-slate-900 font-bold uppercase tracking-wider leading-tight text-center block w-full">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Itinerary */}
          <div>
            <div className="flex flex-col gap-1 mb-8">
              <span className="font-mono text-[9px] uppercase tracking-widest text-sky-600 font-bold">
                {locale === "id" ? "RANCANGAN PERJALANAN" : "JOURNEY ROADMAP"}
              </span>
              <h2 className="font-serif font-bold text-2xl text-slate-900">{t("detail_itinerary")}</h2>
            </div>

            {/* Timeline Wrapper */}
            <div className="flex flex-col gap-12 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {tourDetail.itinerary.map((day, idx) => (
                <div key={idx} className="flex gap-6 md:snap-start relative">

                  {/* Timeline Node */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 shadow-sm shrink-0 border-2 ${activeDay === day.day
                        ? "bg-sky-600 text-white border-white ring-4 ring-sky-500/20"
                        : "bg-white text-slate-400 border-slate-200"
                      }`}>
                      D{day.day}
                    </div>
                  </div>

                  {/* Day Content */}
                  <div
                    className={`flex-1 bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${activeDay === day.day ? "border-sky-600" : "border-slate-200/80"
                      }`}
                    onClick={() => setActiveDay(day.day)}
                  >
                    {/* Atmospheric Image(s) */}
                    {(() => {
                      const allImgs: string[] = (day as any).images && (day as any).images.length > 0
                        ? (day as any).images
                        : (day.image ? (day.image.includes("||") ? day.image.split("||") : [day.image]) : []);

                      if (allImgs.length > 1) {
                        return (
                          <div className="w-full h-48 md:h-64 relative grid grid-cols-2 gap-1 bg-slate-900 overflow-hidden">
                            {allImgs.slice(0, 4).map((imgUrl, iIdx) => (
                              <div key={iIdx} className={`relative overflow-hidden h-full ${allImgs.length === 3 && iIdx === 0 ? "col-span-2" : ""}`}>
                                <img src={imgUrl} alt={`${day.title} ${iIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                              </div>
                            ))}
                            <div className="absolute top-4 left-4 bg-slate-950/80 border border-sky-400/35 backdrop-blur-md text-sky-400 px-3.5 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest z-10">
                              {locale === "id" ? `HARI 0${day.day}` : `DAY 0${day.day}`}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="w-full h-48 md:h-64 relative">
                            <img
                              src={allImgs[0] || day.image || "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800"}
                              alt={day.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-slate-950/80 border border-sky-400/35 backdrop-blur-md text-sky-400 px-3.5 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest">
                              {locale === "id" ? `HARI 0${day.day}` : `DAY 0${day.day}`}
                            </div>
                          </div>
                        );
                      }
                    })()}

                    <div className="p-5 sm:p-6 md:p-8">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-sky-600 font-bold block mb-1">
                        {locale === "id" ? `PROGRAM HARI KE-${day.day}` : `DAY ${day.day} PROGRAM`}
                      </span>
                      <h3 className="font-serif font-bold text-lg md:text-xl text-slate-900 mb-4">
                        {locale === "id" ? day.title : (day.titleEN || (day as any).titleEn || day.title)}
                      </h3>

                      {/* Activities Pills */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {((locale === "id" ? day.activities : ((day.activitiesEN && day.activitiesEN.length > 0 ? day.activitiesEN : (day as any).activitiesEn) || day.activities)) || []).map((act: string, aIdx: number) => (
                          <span key={aIdx} className="bg-slate-50 border border-slate-200/80 text-slate-600 px-3 py-1 rounded-full font-sans text-[10px] font-semibold uppercase tracking-wider">
                            {act}
                          </span>
                        ))}
                      </div>

                      <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-light mb-6">
                        {locale === "id" ? day.description : (day.descriptionEN || (day as any).descriptionEn || day.description)}
                      </p>

                      <div className="flex items-center gap-3.5 bg-slate-50/80 border border-slate-200/60 px-4 py-3 rounded-2xl">
                        <Hotel className="w-5 h-5 text-sky-600" />
                        <div>
                          <span className="block font-mono text-[8px] uppercase tracking-widest text-slate-400 font-bold">{locale === "id" ? "Bermalam di" : "Overnight at"}</span>
                          <span className="block font-sans text-xs font-bold text-slate-900 mt-0.5">{locale === "id" ? day.hotel : (day.hotelEN || (day as any).hotelEn || day.hotel)}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Side: Inclusions & Exclusions */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* WhatsApp CTA Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl text-center relative overflow-hidden border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-transparent pointer-events-none" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-sky-400 font-bold block mb-2 relative z-10">Layanan VIP</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold tracking-wide mb-4 relative z-10">{locale === "id" ? "Konsultasi Luxury" : "Luxury Consultation"}</h3>
            <p className="font-sans text-slate-300 text-xs leading-relaxed mb-6 font-light relative z-10">
              {locale === "id"
                ? "Butuh penyesuaian kelas penerbangan, upgrade hotel bintang 5, atau private tour? Tim Klik Travel ID siap melayani."
                : "Need adjustments for flight classes, 5★ hotel upgrades, or bespoke private tours? Our team is ready."}
            </p>
            <a
              href={`https://wa.me/6281230011027?text=${vipWhatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3.5 px-6 rounded-xl font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 relative z-10 shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <span>{locale === "id" ? "Hubungi Kami" : "Contact Us"}</span>
            </a>
          </div>

          {/* Inclusions Card */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-serif font-bold text-base text-slate-900">{t("detail_inclusions")}</h3>
            </div>
            <div className="flex flex-col gap-4">
              {tourDetail.inclusions.map((inc, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span className="font-sans text-xs text-slate-600 font-medium leading-normal">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions Card */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h3 className="font-serif font-bold text-base text-slate-900">{t("detail_exclusions")}</h3>
            </div>
            <div className="flex flex-col gap-4">
              {tourDetail.exclusions.map((exc, idx) => {
                const isOptional = exc.toLowerCase().includes("optional") || /^\s*[-*•]/.test(exc);
                return (
                  <div key={idx} className="flex gap-3 items-start">
                    {!isOptional ? (
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                    <span className="font-sans text-xs text-slate-600 font-medium leading-normal">{exc}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </section>

      {/* Syarat & Ketentuan Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="bg-white border border-slate-200/70 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-slate-100">
            <span className="font-mono text-[9px] uppercase tracking-widest text-sky-600 font-bold">
              {locale === "id" ? "REGULASI PERJALANAN" : "TRAVEL REGULATION"}
            </span>
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              {locale === "id" ? "SYARAT DAN KETENTUAN" : "TERMS AND CONDITIONS"}
            </h2>
          </div>

          {/* Wholesaler Note Alert */}
          <div className="bg-amber-50/60 border border-amber-200/80 text-amber-800 text-xs md:text-sm rounded-2xl p-4 flex gap-3 items-start mb-8 font-sans">
            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium leading-relaxed">
              {locale === "id"
                ? "Rules (Term and Condition) telah diatur sesuai dengan yang ditetapkan oleh wholesaler dan tidak dapat diganggu gugat."
                : "Rules (Term and Condition) have been set by the wholesaler and are non-negotiable."}
            </span>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-slate-700 text-xs md:text-sm leading-relaxed">

            {/* 1. Pendaftaran */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold">1</span>
                {locale === "id" ? "Pendaftaran" : "Registration"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id"
                    ? "Konfirmasi pendaftaran tour harus disertai dengan pembayaran DP sebesar Rp 3.000.000 (non-refundable) dan sisanya dapat dicicil 3x sampai pelunasan 30 hari sebelum tanggal keberangkatan."
                    : "Tour registration confirmation must be accompanied by a DP payment of IDR 3,000,000 (non-refundable). The balance can be paid in 3 installments up to 30 days before departure."}
                </li>
                <li>
                  {locale === "id"
                    ? "Harga yang terlampir dalam penawaran paket masih dapat berubah sewaktu-waktu selama tour belum dikonfirmasi."
                    : "Prices enclosed in the package offer are subject to change until the tour is fully confirmed."}
                </li>
                <li>
                  {locale === "id"
                    ? "Itinerary bersifat tidak mengikat dan dapat berubah sewaktu-waktu menyesuaikan kondisi di lapangan atau situasi yang tidak terduga (Force Majeure)."
                    : "Itinerary is non-binding and subject to change to adjust with field conditions or unexpected situations (Force Majeure)."}
                </li>
              </ul>
            </div>

            {/* 2. Pembayaran */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold">2</span>
                {locale === "id" ? "Pembayaran" : "Payment"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id" ? "Pembayaran ditransfer ke nomor rekening berikut:" : "Payments should be transferred to the following account:"}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1.5 font-mono text-xs select-all text-slate-800 flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-900">BCA 2860475998</span>
                    <span>a.n. PT Bersama Jelajah Dunia</span>
                  </div>
                </li>
                <li>
                  {locale === "id"
                    ? "Pelunasan pembayaran dilakukan maksimal H-30 sebelum keberangkatan."
                    : "Full payment balance must be settled at least 30 days (H-30) prior to departure."}
                </li>
                <li>
                  {locale === "id"
                    ? "Pendaftaran yang dilakukan kurang dari 30 hari sebelum tanggal keberangkatan harus melakukan pembayaran penuh (full payment)."
                    : "Registrations made less than 30 days before departure require immediate full payment."}
                </li>
                <li>
                  {locale === "id"
                    ? "Wajib konfirmasi semua pembayaran dengan mengirimkan bukti transfer."
                    : "All payments must be confirmed by sending transfer receipts."}
                </li>
              </ul>
            </div>

            {/* 3. Pembatalan */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold">3</span>
                {locale === "id" ? "Pembatalan" : "Cancellation"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id" ? "Penalti pembatalan oleh peserta:" : "Cancellation penalties by participant:"}
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      <strong>&gt; 30 hari:</strong> {locale === "id" ? "DP dan pembayaran yang sudah masuk hangus" : "DP and any paid amounts are non-refundable"}
                    </li>
                    <li>
                      <strong>29 - 0 hari:</strong> {locale === "id" ? "Dikenakan biaya 100% dari harga tour" : "Charged 100% of the total tour price"}
                    </li>
                  </ul>
                </li>
                <li>
                  {locale === "id"
                    ? "Pembatalan akibat Force Majeure (bencana alam, cuaca buruk, kerusuhan, wabah penyakit, dll): perjalanan dapat dijadwalkan ulang atau dibatalkan. Tidak ada pengembalian dana atas fasilitas yang tidak terpakai, dan pihak Travel tidak bertanggung jawab atas kerugian/ketidaknyamanan yang terjadi."
                    : "Cancellations due to Force Majeure (natural disasters, severe weather, riots, disease outbreaks, etc.): trips may be rescheduled or cancelled. No refund is provided for unused amenities, and the Travel agency is not liable for any losses/inconveniences."}
                </li>
                <li>
                  {locale === "id"
                    ? "Untuk alasan apa pun pembatalan sepihak oleh peserta, DP dan cicilan yang masuk tetap tidak dapat dikembalikan."
                    : "For any personal reasons of cancellation by the participant, DP and installments remain non-refundable."}
                </li>
              </ul>
            </div>

            {/* 4. Visa */}
            <div className="space-y-3">
              <h4 className="font-sans font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs font-bold">4</span>
                Visa
              </h4>
              <ul className="space-y-2 list-disc pl-5 font-light">
                <li>
                  {locale === "id"
                    ? "Penolakan atau keterlambatan penerbitan visa bukan merupakan tanggung jawab pihak travel dan sepenuhnya merupakan hak prerogatif pihak Kedutaan."
                    : "Rejection or delay in visa issuance is entirely under the Embassy's authority and is not the responsibility of the travel agency."}
                </li>
              </ul>
            </div>

          </div>

          {/* Consent Clause Footer */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex gap-3 items-center mt-8 text-slate-700 text-xs md:text-sm font-sans font-medium">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {locale === "id"
                ? "Dengan melakukan pendaftaran, peserta dianggap mengerti dan menyetujui syarat dan ketentuan yang berlaku."
                : "By registering, participants are deemed to have understood and agreed to the applicable terms and conditions."}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      {featuredTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32 mb-12">
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-sky-600 font-bold block mb-4">
              {locale === "id" ? "Eksplorasi Lebih Lanjut" : "Explore Further"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 font-normal tracking-wide">
              {t("detail_other_tours")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {featuredTours.map((tour, idx) => (
              <Link
                key={idx}
                href={`/destinations/${tour.regionSlug}/${tour.subSlug}`}
                className="group flex flex-col cursor-pointer"
              >
                <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative shadow-lg bg-slate-900 mb-6">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                    {locale === "id" ? "Paket Tour" : "Tour Package"}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white/80 mb-2">
                      <MapPin size={14} />
                      <span className="font-sans text-xs uppercase tracking-widest">{tour.regionName}</span>
                    </div>
                    <h3 className="font-serif text-3xl text-white font-normal mb-1">
                      {tour.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center text-sky-600 font-sans text-xs uppercase font-bold tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
                  <span>{locale === "id" ? "Lihat Detail" : "View Details"}</span>
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Visual Monthly Calendar Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#0F2C59]">
                  {locale === "id" ? "Jadwal Keberangkatan" : "Departure Schedules"}
                </h3>
                <p className="font-sans text-xs text-[#0F2C59]/60 mt-0.5">
                  {displayTourName}
                </p>
              </div>
              <button 
                onClick={() => setIsDateModalOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Month Navigation Header */}
            {(() => {
              const year = calendarMonthDate.getFullYear();
              const month = calendarMonthDate.getMonth();
              const monthsID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
              const monthsEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const monthLabel = `${locale === "id" ? monthsID[month] : monthsEN[month]} ${year}`;

              const firstDayIdx = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();

              // Parse all departure batches into ranges
              const parsedBatches = departureDatesList.map((item: any, idx: number) => {
                const range = parseBatchRange(item);
                return {
                  index: idx,
                  item,
                  start: range.start,
                  end: range.end,
                  status: item.batch?.status || "Available",
                };
              });

              return (
                <div className="flex-1 overflow-y-auto py-3 scrollbar-thin flex flex-col">
                  
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-2.5 mb-4 shrink-0">
                    <button
                      onClick={() => setCalendarMonthDate(new Date(year, month - 1, 1))}
                      className="p-1.5 rounded-xl hover:bg-white text-[#0F2C59] transition-colors cursor-pointer"
                      title={locale === "id" ? "Bulan Sebelumnya" : "Previous Month"}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="font-serif font-bold text-base md:text-lg text-[#0F2C59]">
                      {monthLabel}
                    </div>

                    <button
                      onClick={() => setCalendarMonthDate(new Date(year, month + 1, 1))}
                      className="p-1.5 rounded-xl hover:bg-white text-[#0F2C59] transition-colors cursor-pointer"
                      title={locale === "id" ? "Bulan Berikutnya" : "Next Month"}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid Header (Weekdays) */}
                  <div className="grid grid-cols-7 text-center font-sans text-xs font-bold text-[#0F2C59]/60 pb-2 border-b border-slate-100 shrink-0">
                    {(locale === "id" ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  {/* Calendar Grid Body */}
                  <div className="grid grid-cols-7 gap-y-2 text-center py-3 my-auto">
                    {/* Padding blank cells before 1st of month */}
                    {Array.from({ length: firstDayIdx }).map((_, i) => (
                      <div key={`pad-${i}`} className="aspect-square" />
                    ))}

                    {/* Days cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const cellDate = new Date(year, month, day);
                      cellDate.setHours(0, 0, 0, 0);

                      let matchingBatch: any = null;
                      let isStart = false;

                      for (const pb of parsedBatches) {
                        if (pb.start) {
                          const sTime = pb.start.getTime();
                          const cTime = cellDate.getTime();
                          if (cTime === sTime) {
                            matchingBatch = pb;
                            isStart = true;
                            break;
                          }
                        }
                      }

                      const isCellSelected = matchingBatch && modalSelectedDateIdx === matchingBatch.index;
                      const isFullOrClosed = matchingBatch && (matchingBatch.status === "FULL" || matchingBatch.status === "Closed" || matchingBatch.status === "close");

                      let cellBgClass = "text-slate-600";
                      if (isStart) {
                        cellBgClass = isFullOrClosed
                          ? "bg-rose-500 text-white font-bold rounded-full shadow-sm"
                          : "bg-emerald-500 text-white font-bold rounded-full shadow-md";
                      }

                      return (
                        <div key={day} className="flex items-center justify-center py-0.5">
                          <button
                            disabled={!isStart}
                            onClick={() => {
                              if (matchingBatch) {
                                setModalSelectedDateIdx(matchingBatch.index);
                              }
                            }}
                            className={`w-9 h-9 rounded-full flex flex-col items-center justify-center font-sans text-xs transition-all relative ${cellBgClass} ${
                              !isStart ? "text-slate-500 hover:bg-slate-50 cursor-default" : "cursor-pointer hover:scale-110"
                            } ${
                              isCellSelected ? "ring-2 ring-sky-500 ring-offset-2 z-20" : ""
                            }`}
                          >
                            <span>{day}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Date Summary Card at Bottom of Modal */}
                  {(() => {
                    const selectedItem = departureDatesList[modalSelectedDateIdx] as any;
                    if (!selectedItem) return null;

                    const b = selectedItem.batch;
                    const isFull = b?.status === "FULL";
                    const isClosed = b?.status === "Closed" || b?.status === "close";
                    const isSelectable = !isFull && !isClosed;

                    const batchText = encodeURIComponent(
                      locale === "id"
                        ? `Halo Klik Travel ID, saya tertarik dengan paket tour "${displayTourName}" (${b?.durationID || displayDuration}) keberangkatan tanggal ${selectedItem.date}. Mohon informasi ketersediaan jadwal.`
                        : `Hello Klik Travel ID, I am interested in the "${displayTourName}" tour package (${b?.durationEN || displayDuration}) departing on ${selectedItem.date}. Please provide schedule availability details.`
                    );

                    return (
                      <div className="mt-3 p-4 rounded-2xl border border-sky-100 bg-sky-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 animate-in fade-in duration-200">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelectable ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                          }`}>
                            <Calendar className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-sans font-bold text-sm text-[#0F2C59]">
                                {selectedItem.date}
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelectable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              }`}>
                                {isSelectable 
                                  ? (locale === "id" ? "Tersedia" : "Available") 
                                  : (isFull ? (locale === "id" ? "Penuh" : "Full") : (locale === "id" ? "Tutup" : "Closed"))
                                }
                              </span>
                            </div>
                            <p className="font-sans text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <span>{selectedItem.day}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span>{b?.durationID || displayDuration}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-100">
                          {b?.priceID && (
                            <div className="text-left sm:text-right">
                              <p className="text-[9px] uppercase text-slate-400 font-sans tracking-wider">
                                {locale === "id" ? "Mulai Dari" : "Starting From"}
                              </p>
                              <p className="font-sans font-bold text-xs md:text-sm text-[#0F2C59]">
                                {b.priceID}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDateIdx(modalSelectedDateIdx);
                                setIsDateModalOpen(false);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#0F2C59] hover:bg-[#0284C7] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              {locale === "id" ? "Pilih Tanggal Ini" : "Select This Date"}
                            </button>

                            <a
                              href={`https://wa.me/6281230011027?text=${batchText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer"
                              title={locale === "id" ? "Pesan via WhatsApp" : "Book via WhatsApp"}
                            >
                              <Phone className="w-3.5 h-3.5 fill-current" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              );
            })()}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs font-sans text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  {locale === "id" ? "Ada Trip" : "Trip Active"}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                  {locale === "id" ? "Dipilih" : "Selected"}
                </span>
              </div>
              <a
                href={`https://wa.me/6281230011027?text=${vipWhatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0F2C59] hover:text-sky-600 transition-colors cursor-pointer"
              >
                {locale === "id" ? "Konsultasi VIP →" : "VIP Request →"}
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
