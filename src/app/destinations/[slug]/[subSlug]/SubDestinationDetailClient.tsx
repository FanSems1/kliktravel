"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Hotel, Check, X, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedRegions } from "@/data/destinations";
import { localizedTourPackages, TourPackageDetail } from "@/data/tours";

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
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200",
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
};

interface SubDestinationDetailClientProps {
  slug: string;
  subSlug: string;
}

export function SubDestinationDetailClient({ slug, subSlug }: SubDestinationDetailClientProps) {
  const { t, locale } = useLanguage();
  const region = localizedRegions[locale].find((r) => r.slug === slug);
  const subDestination = region?.subDestinations.find((s) => s.slug === subSlug);
  const [activeDay, setActiveDay] = useState(1);

  if (!region || !subDestination) return null;

  // Fetch package details or generate default fallback
  const tourDetail: TourPackageDetail = localizedTourPackages[locale][subSlug] || {
    slug: subSlug,
    name: subDestination.name,
    tagline: locale === "id" 
      ? `Rasakan Pengalaman Liburan Terbaik di ${subDestination.name}`
      : `Experience the Ultimate Holiday in ${subDestination.name}`,
    duration: locale === "id" ? "4 Hari 3 Malam" : "4 Days 3 Nights",
    price: locale === "id" ? "Mulai Rp 6.900.000 / pax" : "From USD 490 / pax",
    hotelRating: locale === "id" ? "4★ Hotel Premium" : "4★ Premium Hotel",
    featuredImage: subDestinationImages[subSlug] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    highlights: locale === "id" 
      ? ["Eksplorasi Kota", "Wisata Kuliner Lokal", "Destinasi Ikonik", "Belanja Oleh-oleh"]
      : ["City Exploration", "Local Culinary Tour", "Iconic Destinations", "Souvenir Shopping"],
    itinerary: [
      {
        day: 1,
        title: locale === "id" ? `Kedatangan di ${subDestination.name} & Check-in` : `Arrival in ${subDestination.name} & Check-in`,
        activities: locale === "id" ? ["Penjemputan", "Check-in Hotel", "Makan Malam Selamat Datang"] : ["Airport Pick-up", "Hotel Check-in", "Welcome Dinner"],
        description: locale === "id" 
          ? `Tiba di ${subDestination.name}, Anda akan disambut hangat oleh tim lokal dan ditransfer langsung menuju hotel pilihan. Nikmati waktu luang untuk bersantai atau berjalan-jalan di sekitar hotel sebelum menikmati makan malam pembuka khas daerah.`
          : `Upon arrival in ${subDestination.name}, you will be warmly greeted by our local team and transferred directly to your selected hotel. Enjoy free time to relax or stroll around before a delicious local welcome dinner.`,
        hotel: locale === "id" ? "Pilihan Hotel Bintang 4 / Setara" : "Selected 4★ Hotel / Equivalent",
        image: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800"
      },
      {
        day: 2,
        title: locale === "id" ? "City Tour & Eksplorasi Tempat Ikonik" : "City Tour & Iconic Exploration",
        activities: locale === "id" ? [`Kunjungan Landmark ${subDestination.name}`, "Makan Siang Khas", "Galeri Budaya"] : [`${subDestination.name} Landmark Tour`, "Local Lunch", "Cultural Gallery"],
        description: locale === "id" 
          ? `Eksplorasi penuh seharian mengunjungi tempat wisata terpopuler dan ikon budaya di ${subDestination.name}. Dipandu oleh pemandu lokal profesional, Anda akan diajak menyelami keindahan dan cerita bersejarah dari kota ini.`
          : `A full day of exploring the most popular attractions and cultural icons of ${subDestination.name}. Guided by a professional local guide, you will dive into the beauty and historical stories of this city.`,
        hotel: locale === "id" ? "Pilihan Hotel Bintang 4 / Setara" : "Selected 4★ Hotel / Equivalent",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"
      },
      {
        day: 3,
        title: locale === "id" ? "Wisata Alam & Kuliner Nusantara/Lokal" : "Nature Tour & Local Culinary",
        activities: locale === "id" ? ["Petualangan Alam", "Makan Siang Pemandangan Indah", "Cicipi Kopi & Kuliner Legendaris"] : ["Nature Adventure", "Scenic Lunch", "Local Coffee & Culinary Tasting"],
        description: locale === "id" 
          ? `Menikmati keindahan alam sekeliling ${subDestination.name}. Dari pegunungan yang asri hingga pesisir pantai yang menawan. Dilanjutkan dengan makan siang sambil menikmati pemandangan alam, serta mencicipi kuliner khas daerah yang legendaris.`
          : `Enjoy the natural beauty surrounding ${subDestination.name}. From scenic mountains to beautiful coastlines. Followed by lunch overlooking nature, and tasting legendary local culinary specialties.`,
        hotel: locale === "id" ? "Pilihan Hotel Bintang 4 / Setara" : "Selected 4★ Hotel / Equivalent",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800"
      },
      {
        day: 4,
        title: locale === "id" ? "Belanja Oleh-oleh & Keberangkatan Pulang" : "Souvenir Shopping & Departure",
        activities: locale === "id" ? ["Berburu Suvenir", "Check-out Hotel", "Transfer ke Bandara/Stasiun"] : ["Souvenir Hunting", "Hotel Check-out", "Airport Transfer"],
        description: locale === "id" 
          ? `Setelah makan pagi dan check-out hotel, Anda akan diantar berbelanja kerajinan tangan, baju, atau jajanan khas ${subDestination.name} untuk sanak saudara di rumah. Setelah selesai, Anda akan ditransfer kembali ke Bandara atau Stasiun untuk penerbangan pulang.`
          : `After breakfast and hotel check-out, you will be taken to shop for local handicrafts or snacks for your loved ones back home. Afterwards, transfer back to the Airport or Station for your departure.`,
        hotel: locale === "id" ? "Check-out" : "Check-out",
        image: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=800"
      }
    ],
    inclusions: locale === "id" 
      ? [
          "Akomodasi hotel bintang 4 pilihan",
          "Transportasi nyaman selama tour",
          "Tiket masuk tempat wisata sesuai program",
          "Makan pagi, siang, dan malam sesuai jadwal",
          "Pemandu wisata bersertifikat"
        ]
      : [
          "Selected 4-star hotel accommodation",
          "Comfortable transportation during the tour",
          "Entrance tickets to all listed attractions",
          "Breakfast, lunch, and dinner per itinerary",
          "Certified tour guide"
        ],
    exclusions: locale === "id"
      ? [
          "Tiket penerbangan atau transportasi menuju kota tujuan",
          "Pengeluaran pribadi (laundry, telepon, belanja)",
          "Tips driver & guide"
        ]
      : [
          "Flight tickets or transport to the destination city",
          "Personal expenses (laundry, telephone, shopping)",
          "Tips for driver & guide"
        ]
  };

  const whatsappMessage = encodeURIComponent(
    locale === "id"
      ? `Halo Klik Travel ID, saya tertarik dengan paket tour "${tourDetail.name}" (${tourDetail.duration}). Mohon informasi ketersediaan jadwal.`
      : `Hello Klik Travel ID, I am interested in the "${tourDetail.name}" tour package (${tourDetail.duration}). Please provide schedule availability details.`
  );

  const [featuredTours, setFeaturedTours] = useState<any[]>([]);

  useEffect(() => {
    // Generate Featured Tours ensuring different countries
    // Filter out the current region completely so we only recommend other countries
    const otherRegions = localizedRegions[locale].filter(r => r.slug !== slug);
    
    // Shuffle the remaining regions
    const shuffledRegions = [...otherRegions].sort(() => 0.5 - Math.random());
    
    // Pick the first 3 regions
    const selectedRegions = shuffledRegions.slice(0, 3);
    
    // Pick 1 random sub-destination from each of the 3 selected regions
    const tours = selectedRegions.map(r => {
      const randomSub = r.subDestinations[Math.floor(Math.random() * r.subDestinations.length)];
      return {
        regionSlug: r.slug,
        regionName: r.name,
        subSlug: randomSub.slug,
        name: randomSub.name,
        image: subDestinationImages[randomSub.slug] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"
      };
    });
    
    setFeaturedTours(tours);
  }, [slug, locale]);

  return (
    <div className="bg-[#F8FAFC] text-foreground min-h-screen font-sans selection:bg-[#A89053] selection:text-white pb-20">
      
      {/* Hero Banner */}
      <section className="relative w-full min-h-[480px] md:h-[65vh] md:min-h-0 overflow-hidden flex flex-col justify-between">
        
        {/* Back Button Overlay */}
        <div className="absolute top-24 md:top-32 left-6 md:left-12 lg:left-16 z-50">
          <Link 
            href={`/destinations/${slug}`}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-[#0F2C59] border border-gray-200/80 px-5 py-2.5 rounded-full shadow-lg font-sans text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === "id" ? "Kembali" : "Back"}</span>
          </Link>
        </div>

        <img 
          src={tourDetail.featuredImage} 
          alt={tourDetail.name} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-10" />
        
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-end text-center p-6 pb-12 md:pb-16 pt-36 max-w-4xl mx-auto z-20">
          <span className="bg-[#0284C7] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {locale === "id" ? "PAKET TOUR" : "TOUR PACKAGE"}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-normal tracking-wide mb-3">
            {tourDetail.name.toUpperCase()}
          </h1>
          <p className="font-sans text-white/80 text-sm md:text-lg max-w-xl font-light">
            {tourDetail.tagline}
          </p>
        </div>
      </section>

      {/* Overview Bar */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white border border-gray-200/80 shadow-xl rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="col-span-1 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0284C7] shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-sans text-[10px] uppercase text-gray-400 tracking-wider font-semibold">{locale === "id" ? "DURASI" : "DURATION"}</span>
              <span className="block font-sans font-bold text-sm md:text-base text-[#0F2C59]">{tourDetail.duration}</span>
            </div>
          </div>
          
          <div className="col-span-1 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0284C7] shrink-0">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-sans text-[10px] uppercase text-gray-400 tracking-wider font-semibold">{locale === "id" ? "AKOMODASI" : "ACCOMMODATION"}</span>
              <span className="block font-sans font-bold text-sm md:text-base text-[#0F2C59]">{tourDetail.hotelRating}</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0284C7] shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-sans text-[10px] uppercase text-gray-400 tracking-wider font-semibold">{locale === "id" ? "HARGA" : "PRICE"}</span>
              <span className="block font-sans font-bold text-sm md:text-base text-[#0F2C59]">{tourDetail.price}</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <a 
              href={`https://wa.me/628123456789?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0284C7] text-white py-4 px-6 rounded-xl font-sans font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>{locale === "id" ? "Cek Ketersediaan" : "Check Availability"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content: Highlights & Itinerary */}
      <section className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Highlights & Daily Details */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Highlights Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="font-sans font-bold text-xl md:text-2xl text-[#0F2C59] mb-6">{t("itinerary_highlights")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tourDetail.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="font-sans text-sm md:text-base text-gray-600 font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Itinerary */}
          <div>
            <h2 className="font-sans font-bold text-xl md:text-2xl text-[#0F2C59] mb-8">{t("detail_itinerary")}</h2>
            
            {/* Timeline Wrapper */}
            <div className="flex flex-col gap-12 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
              {tourDetail.itinerary.map((day, idx) => (
                <div key={idx} className="flex gap-4 md:gap-8 relative">
                  
                  {/* Timeline Node */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-xs transition-all duration-300 shadow-md shrink-0 ${
                      activeDay === day.day 
                      ? "bg-[#0284C7] text-white ring-4 ring-sky-100" 
                      : "bg-white text-gray-400 border border-gray-200"
                    }`}>
                      {day.day}
                    </div>
                  </div>

                  {/* Day Content */}
                  <div 
                    className="flex-1 bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => setActiveDay(day.day)}
                  >
                    {/* Atmospheric Image */}
                    <div className="w-full h-48 md:h-64 relative">
                      <img 
                        src={day.image} 
                        alt={day.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-sans text-xs font-bold uppercase tracking-wider">
                        {locale === "id" ? `Hari 0${day.day}` : `Day 0${day.day}`}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="font-sans font-bold text-lg md:text-xl text-[#0F2C59] mb-4">
                        {day.title}
                      </h3>
                      
                      {/* Activities Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {day.activities.map((act, aIdx) => (
                          <span key={aIdx} className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-sans text-[11px] font-semibold">
                            {act}
                          </span>
                        ))}
                      </div>

                      <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed font-light mb-6">
                        {day.description}
                      </p>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl">
                        <Hotel className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="block font-sans text-[9px] uppercase tracking-wider text-gray-400 font-semibold">{locale === "id" ? "Hotel / Bermalam" : "Hotel / Overnight"}</span>
                          <span className="block font-sans text-xs md:text-sm font-bold text-[#0F2C59]">{day.hotel}</span>
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
          <div className="bg-[#0F2C59] text-white rounded-2xl p-6 md:p-8 shadow-lg text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0284C7]/20 to-transparent pointer-events-none" />
            <h3 className="font-serif text-2xl font-normal tracking-wide mb-4 relative z-10">{locale === "id" ? "Tanya / Konsultasikan" : "Ask / Consult"}</h3>
            <p className="font-sans text-white/80 text-xs md:text-sm leading-relaxed mb-6 font-light relative z-10">
              {locale === "id"
                ? "Butuh penyesuaian jadwal tour atau request hotel bintang 5? Hubungi konsultan perjalanan Klik Travel ID sekarang juga."
                : "Need tour adjustments or a 5-star hotel request? Contact the travel consultants of Klik Travel ID now."}
            </p>
            <a 
              href={`https://wa.me/628123456789?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#38BDF8] text-white py-3.5 px-6 rounded-xl font-sans font-bold text-xs md:text-sm tracking-wider uppercase transition-all duration-300 relative z-10 shadow-md hover:scale-[1.02]"
            >
              <span>{locale === "id" ? "Hubungi Kami" : "Contact Us"}</span>
            </a>
          </div>

          {/* Inclusions Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-sans font-bold text-lg text-[#0F2C59] mb-5">{t("detail_inclusions")}</h3>
            <div className="flex flex-col gap-4">
              {tourDetail.inclusions.map((inc, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3" strokeWidth={3} />
                  </div>
                  <span className="font-sans text-xs md:text-sm text-gray-500 font-medium leading-normal">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-sans font-bold text-lg text-[#0F2C59] mb-5">{t("detail_exclusions")}</h3>
            <div className="flex flex-col gap-4">
              {tourDetail.exclusions.map((exc, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3" strokeWidth={3} />
                  </div>
                  <span className="font-sans text-xs md:text-sm text-gray-500 font-medium leading-normal">{exc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* Featured Tours Section */}
      {featuredTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32 mb-12">
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
              {locale === "id" ? "Eksplorasi Lebih Lanjut" : "Explore Further"}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide">
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
                <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative shadow-lg bg-charcoal mb-6">
                  <img 
                    src={tour.image} 
                    alt={tour.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/90 via-[#0F2C59]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Badge */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm text-[#0F2C59] text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-2 rounded-full">
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
                
                <div className="flex items-center text-[#0284C7] font-sans text-xs uppercase font-bold tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
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

    </div>
  );
}
