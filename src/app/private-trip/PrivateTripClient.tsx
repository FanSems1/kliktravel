"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Compass, Users, Star, ShieldCheck, Phone, CheckCircle2, ChevronLeft, ChevronRight, Quote, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";



export function PrivateTripClient() {
  const { t, locale } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: "",
    date: "",
    adults: 2,
    children: 0,
    budget: "",
    notes: ""
  });

  const formatIDR = (value: string): string => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    return Number(clean).toLocaleString("id-ID");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "budget") {
      setFormData({ ...formData, budget: formatIDR(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleIncrement = (type: "adults" | "children") => {
    setFormData(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const handleDecrement = (type: "adults" | "children") => {
    setFormData(prev => ({ 
      ...prev, 
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] - 1) 
    }));
  };

  const handleWhatsappSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isIndo = locale === "id";
    
    // Format guests string
    const guestsStr = `${formData.adults} Adults, ${formData.children} Children`;
    const formattedBudget = formData.budget.startsWith("IDR") || formData.budget.startsWith("Rp")
      ? formData.budget
      : `IDR ${formData.budget}`;

    const text = isIndo 
      ? `Halo Klik Travel ID, saya ingin merancang Private Trip.\n\n*Nama:* ${formData.name}\n*No. WA:* ${formData.phone}\n*Destinasi:* ${formData.destination}\n*Tanggal:* ${formData.date}\n*Jumlah Peserta:* ${guestsStr}\n*Budget:* ${formattedBudget}\n*Catatan Tambahan:* ${formData.notes}\n\nMohon informasi lebih lanjut.`
      : `Hello Klik Travel ID, I'd like to plan a Private Trip.\n\n*Name:* ${formData.name}\n*Phone/WA:* ${formData.phone}\n*Destination:* ${formData.destination}\n*Dates:* ${formData.date}\n*Guests:* ${guestsStr}\n*Budget:* ${formattedBudget}\n*Special Requests:* ${formData.notes}\n\nLooking forward to more details.`;
    
    setIsSubmitting(true);

    try {
      await apiFetch("/private-trip-requests", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          destination: formData.destination,
          dates: formData.date,
          guests: guestsStr,
          budget: formattedBudget,
          notes: formData.notes
        })
      });
      setToast({
        message: isIndo ? "Permintaan private trip berhasil dikirim!" : "Private trip request submitted successfully!",
        type: "success"
      });
    } catch (err: any) {
      console.error("Failed to post private trip request to API", err);
      setToast({
        message: err.message || (isIndo ? "Gagal mengirim ke server API" : "Failed to submit request to server"),
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }

    // Save to localStorage under "klik_private_trip_inquiries" for Admin view fallback
    try {
      const saved = localStorage.getItem("klik_private_trip_inquiries");
      const currentList = saved ? JSON.parse(saved) : [];
      const newId = `PT-${103 + currentList.length}`;
      const newInquiry = {
        id: newId,
        name: formData.name,
        phone: formData.phone,
        destination: formData.destination,
        dates: formData.date,
        guests: guestsStr,
        budget: formattedBudget,
        notes: formData.notes,
        status: "new"
      };
      localStorage.setItem("klik_private_trip_inquiries", JSON.stringify([newInquiry, ...currentList]));
    } catch (err) {
      console.error("Failed to save inquiry to localStorage", err);
    }

    window.open(`https://wa.me/6281230011027?text=${encodeURIComponent(text)}`, "_blank");
  };

  const [popularPrivateDestinations, setPopularPrivateDestinations] = useState<any[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      setIsLoadingDestinations(true);
      try {
        const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => {
            let gradient = item.featuredImageGradient || "";
            let image = item.image || "";
            if (gradient.includes("||")) {
              const parts = gradient.split("||");
              image = parts[1];
            }
            const name = item.name ? item.name.split("||")[0] : item.slug;
            const description = item.subtitle ? item.subtitle.split("||")[0] : "";
            return {
              name,
              image: image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
              description: description || (locale === "id" ? "Perjalanan eksklusif sesuai ritme Anda sendiri." : "An exclusive journey at your own pace.")
            };
          });
          setPopularPrivateDestinations(mapped);
        } else {
          setPopularPrivateDestinations([]);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        setPopularPrivateDestinations([]);
      } finally {
        setIsLoadingDestinations(false);
      }
    }
    fetchDestinations();
  }, [locale]);

  const [testimonialList, setTestimonialList] = useState<any[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      setIsLoadingTestimonials(true);
      try {
        const apiData = await apiFetch<any[]>("/testimonials").catch(() => null);
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const approvedOnly = apiData.filter((t) => t.approved !== false);
          setTestimonialList(approvedOnly);
        } else {
          const saved = localStorage.getItem("klik_admin_testimonials");
          if (saved) {
            const parsed = JSON.parse(saved);
            const approvedOnly = parsed.filter((t: any) => t.approved);
            setTestimonialList(approvedOnly);
          } else {
            setTestimonialList([]);
          }
        }
      } catch {
        setTestimonialList([]);
      } finally {
        setIsLoadingTestimonials(false);
      }
    }

    fetchTestimonials();
  }, [locale]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollOffset = clientWidth * 0.75;
      const targetScroll = direction === "left" ? scrollLeft - scrollOffset : scrollLeft + scrollOffset;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-foreground min-h-screen font-sans selection:bg-[#0284C7] selection:text-white pb-0">
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=1600" 
            alt="Luxury Private Trip" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2C59]/60 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center pt-24 md:pt-28">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase text-sky-300 font-semibold mb-4 md:mb-6 block max-w-full leading-relaxed"
          >
            {t("private_trip_tag")}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-white font-normal tracking-wide mb-6 leading-tight"
          >
            {t("private_trip_title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-sans text-white/90 text-sm md:text-lg max-w-2xl font-light mb-10 leading-relaxed"
          >
            {t("private_trip_desc")}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#0284C7] hover:bg-[#0ea5e9] text-white px-8 py-4 rounded-full font-sans font-bold text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(2,132,199,0.4)] hover:shadow-[0_0_30px_rgba(2,132,199,0.6)] hover:-translate-y-1 cursor-pointer"
          >
            {t("private_trip_btn_start")}
          </motion.button>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-white border-b border-[#0F2C59]/10 py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            
            <div className="flex flex-col items-start text-left space-y-4 group">
              <span className="font-serif text-4xl text-[#A89053] font-light">01</span>
              <div className="h-[1px] w-12 bg-[#0284C7] group-hover:w-full transition-all duration-500" />
              <h3 className="font-serif text-xl font-bold text-[#0F2C59] tracking-wide pt-2">
                {t("private_trip_freedom_title")}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {t("private_trip_freedom_desc")}
              </p>
            </div>

            <div className="flex flex-col items-start text-left space-y-4 group">
              <span className="font-serif text-4xl text-[#A89053] font-light">02</span>
              <div className="h-[1px] w-12 bg-[#0284C7] group-hover:w-full transition-all duration-500" />
              <h3 className="font-serif text-xl font-bold text-[#0F2C59] tracking-wide pt-2">
                {t("private_trip_flexibility_title")}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {t("private_trip_flexibility_desc")}
              </p>
            </div>

            <div className="flex flex-col items-start text-left space-y-4 group">
              <span className="font-serif text-4xl text-[#A89053] font-light">03</span>
              <div className="h-[1px] w-12 bg-[#0284C7] group-hover:w-full transition-all duration-500" />
              <h3 className="font-serif text-xl font-bold text-[#0F2C59] tracking-wide pt-2">
                {t("private_trip_service_title")}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {t("private_trip_service_desc")}
              </p>
            </div>

            <div className="flex flex-col items-start text-left space-y-4 group">
              <span className="font-serif text-4xl text-[#A89053] font-light">04</span>
              <div className="h-[1px] w-12 bg-[#0284C7] group-hover:w-full transition-all duration-500" />
              <h3 className="font-serif text-xl font-bold text-[#0F2C59] tracking-wide pt-2">
                {t("private_trip_privacy_title")}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {t("private_trip_privacy_desc")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Private Journeys */}
      {isLoadingDestinations ? (
        <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
              {t("private_trip_inspiration_tag")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide mb-6">
              {t("private_trip_inspiration_title")}
            </h2>
            <p className="font-sans text-gray-500 text-sm md:text-base font-light leading-relaxed">
              {locale === "id" ? "Pilihan terfavorit pelanggan kami untuk inspirasi perjalanan berharga Anda." : "Our guest favorites to inspire your next extraordinary journey."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between h-[380px] animate-pulse">
                <div className="bg-slate-200 aspect-[4/3] w-full" />
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-full" />
                    <div className="h-3 bg-slate-200 rounded-md w-5/6" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/3 mt-6" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : popularPrivateDestinations.length > 0 ? (
        <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
              {t("private_trip_inspiration_tag")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide mb-6">
              {t("private_trip_inspiration_title")}
            </h2>
            <p className="font-sans text-gray-500 text-sm md:text-base font-light leading-relaxed">
              {locale === "id" ? "Pilihan terfavorit pelanggan kami untuk inspirasi perjalanan berharga Anda." : "Our guest favorites to inspire your next extraordinary journey."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularPrivateDestinations.map((item: any, idx: number) => (
              <div 
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-serif text-2xl font-normal tracking-wide mb-1">{item.name}</h3>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <p className="font-sans text-gray-500 text-sm font-light leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, destination: item.name }));
                      document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-between text-[#0284C7] font-sans font-bold text-xs uppercase tracking-widest group-hover:text-[#0F2C59] transition-colors cursor-pointer"
                  >
                    <span>{locale === "id" ? "Sesuaikan Perjalanan" : "Customize Journey"}</span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Booking Form Section */}
      <section id="booking-form" className="max-w-7xl mx-auto px-6 scroll-mt-28 md:scroll-mt-36 mb-24 md:mb-32">
        <div className="bg-[#0F2C59] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Panel with Transparent Luxury Background Image */}
          <div className="lg:w-5/12 p-6 sm:p-8 md:p-10 lg:p-12 relative flex flex-col justify-center bg-[#0F2C59]">
            {/* Transparent Luxury Background Image Layer */}
            <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=1200" 
                alt="Luxury Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0284C7]/30 via-transparent to-[#0F2C59] pointer-events-none z-0" />
            
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#38BDF8] font-bold block mb-3 relative z-10">
              {locale === "id" ? "RESERVASI EKSKLUSIF" : "EXCLUSIVE RESERVATION"}
            </span>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-4xl text-white mb-3 lg:mb-4 relative z-10 leading-tight">
              {t("private_trip_form_title")}
            </h2>
            <p className="font-sans text-white/75 text-xs sm:text-sm font-light mb-6 lg:mb-8 relative z-10 leading-relaxed">
              {t("private_trip_form_desc")}
            </p>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 text-white/85">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <ShieldCheck size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "100% Jadwal Fleksibel" : "100% Flexible Schedule"}</span>
              </div>
              <div className="flex items-center gap-4 text-white/85">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Star size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "Akomodasi Pilihan & Nyaman" : "Comfortable Accommodation Standards"}</span>
              </div>
              <div className="flex items-center gap-4 text-white/85">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <CheckCircle2 size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "Pelayanan Personal & Nyaman" : "Personalized & Comfortable Service"}</span>
              </div>
            </div>
          </div>

          {/* Form Content Panel */}
          <div className="lg:w-7/12 bg-white p-6 sm:p-8 md:p-10 lg:p-12">
            <h3 className="font-sans font-bold text-base md:text-lg uppercase tracking-widest text-[#0F2C59] mb-6">
              {t("private_trip_form_head")}
            </h3>
            <form onSubmit={handleWhatsappSubmit} className="space-y-4 md:space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_name")}</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_name")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_phone")}</label>
                  <input 
                    type="text" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_phone")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_destination")}</label>
                  <input 
                    type="text" 
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_destination")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_time")}</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_time")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
              </div>

              {/* Adults & Children side by side in 2-column grid row */}
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {t("private_trip_form_label_adults")}
                  </label>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 h-[46px] items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDecrement("adults")}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0F2C59] hover:bg-sky-50 font-bold text-sm cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-[#0F2C59] w-6 text-center">{formData.adults}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrement("adults")}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0F2C59] hover:bg-sky-50 font-bold text-sm cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {t("private_trip_form_label_children")}
                  </label>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 h-[46px] items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDecrement("children")}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0F2C59] hover:bg-sky-50 font-bold text-sm cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-[#0F2C59] w-6 text-center">{formData.children}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrement("children")}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0F2C59] hover:bg-sky-50 font-bold text-sm cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Estimated Budget full width below Adults & Children */}
              <div>
                <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_budget")}</label>
                <input 
                  type="text" 
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder={t("private_trip_form_placeholder_budget")} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] h-[46px] transition-all"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t("private_trip_form_label_notes")}</label>
                <textarea 
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t("private_trip_form_placeholder_notes")} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0F2C59] hover:bg-[#0284C7] text-white rounded-xl py-3.5 flex items-center justify-center gap-3 transition-all duration-300 font-sans font-bold text-sm tracking-widest uppercase mt-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <Phone size={18} className="fill-white" />
                )}
                <span>{isSubmitting ? (locale === "id" ? "MENGIRIM..." : "SUBMITTING...") : t("private_trip_form_submit")}</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Testimonial Section */}
      {isLoadingTestimonials ? (
        <section className="w-full bg-[#F8FAFC] py-24 px-6 border-t border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#0284C7]" />
          </div>
        </section>
      ) : testimonialList.length > 0 ? (
        <section className="w-full bg-[#F8FAFC] py-24 px-6 border-t border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
                  {t("private_trip_testimonial_tag")}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide">
                  {t("private_trip_testimonial_title")}
                </h2>
              </div>
              
              {/* Carousel Arrows */}
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => handleScroll("left")}
                  className="p-4 rounded-full border border-[#0F2C59]/10 text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  className="p-4 rounded-full border border-[#0F2C59]/10 text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8"
            >
              {testimonialList.map((test, idx) => (
                <div
                  key={test.id || idx}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between shrink-0 w-[85vw] sm:w-[45vw] md:w-[31vw] snap-center min-h-[320px] relative overflow-hidden group"
                >
                  <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-100 group-hover:text-amber-100/60 transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex text-amber-400 mb-6 gap-1">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed mb-8 italic">
                      "{test.reviewID || test.text}"
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-4 border-t border-gray-50 pt-6 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-md bg-slate-50 flex items-center justify-center">
                      {test.avatar ? (
                        <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0F2C59] to-[#0284C7] text-white flex items-center justify-center font-serif text-lg font-bold">
                          {test.name ? test.name.charAt(0) : "T"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-sans font-bold text-[#0F2C59] text-base truncate">{test.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                      </div>
                      <p className="font-sans text-[11px] text-[#A89053] font-semibold uppercase tracking-wider truncate mt-0.5">{test.trip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
