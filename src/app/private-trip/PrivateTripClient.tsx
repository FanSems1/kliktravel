"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Compass, Users, Star, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";

const localizedPrivateDestinations = {
  id: [
    { name: "Sailing Komodo", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800", description: "Yacht pribadi eksklusif melintasi perairan Taman Nasional Komodo." },
    { name: "Kyoto Autumn", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", description: "Perjalanan spiritual dan budaya dengan ritme Anda sendiri di Jepang." },
    { name: "Swiss Alps", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800", description: "Retret pegunungan eksklusif dan ski resort bintang 5 di Eropa." },
  ],
  en: [
    { name: "Sailing Komodo", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800", description: "Exclusive private yacht cruising across Komodo National Park waters." },
    { name: "Kyoto Autumn", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", description: "A spiritual and cultural journey at your own pace in Japan." },
    { name: "Swiss Alps", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800", description: "Exclusive alpine retreats and 5-star ski resorts in Europe." },
  ]
};

const localizedTestimonials = {
  id: [
    {
      text: "Pengalaman private trip ke Jepang yang sangat luar biasa. Itinerary disusun sangat rapi dan fleksibel sesuai kebutuhan keluarga kami. Guide sangat informatif dan ramah.",
      name: "Andi W.",
      trip: "Kyoto Autumn Trip",
      initial: "A"
    },
    {
      text: "Komodo trip terbaik yang pernah saya rasakan. Fasilitas kapal pinisi super mewah, kru yang profesional, dan makanan kelas bintang lima setiap harinya. Highly recommended!",
      name: "Sarah L.",
      trip: "Sailing Komodo",
      initial: "S"
    },
    {
      text: "Layanan eksklusif dari awal hingga akhir. Seluruh kekhawatiran kami diurus dengan baik. Kami bisa menikmati liburan keluarga di Eropa tanpa sedikitpun merasa repot atau stress.",
      name: "Dimas & Keluarga",
      trip: "Swiss Alps Retreat",
      initial: "D"
    }
  ],
  en: [
    {
      text: "An absolutely amazing private trip to Japan. The itinerary was well organized and flexible according to our family's needs. The guide was informative and friendly.",
      name: "Andi W.",
      trip: "Kyoto Autumn Trip",
      initial: "A"
    },
    {
      text: "The best Komodo trip I've ever experienced. Super luxury phinisi boat facilities, professional crew, and 5-star meals every day. Highly recommended!",
      name: "Sarah L.",
      trip: "Sailing Komodo",
      initial: "S"
    },
    {
      text: "Exclusive service from start to finish. All our worries were handled beautifully. We enjoyed our family holiday in Europe without any hassle or stress.",
      name: "Dimas & Family",
      trip: "Swiss Alps Retreat",
      initial: "D"
    }
  ]
};

export function PrivateTripClient() {
  const { t, locale } = useLanguage();
  
  const [formData, setFormData] = useState({
    destination: "",
    pax: "",
    date: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsappSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isIndo = locale === "id";
    const text = isIndo 
      ? `Halo Klik Travel ID, saya ingin merancang Private Trip.\n\n*Destinasi:* ${formData.destination}\n*Jumlah Peserta:* ${formData.pax}\n*Tanggal Keberangkatan:* ${formData.date}\n*Catatan Tambahan:* ${formData.notes}\n\nMohon informasi lebih lanjut.`
      : `Hello Klik Travel ID, I'd like to plan a Private Trip.\n\n*Destination:* ${formData.destination}\n*Guests:* ${formData.pax}\n*Departure Date:* ${formData.date}\n*Special Request:* ${formData.notes}\n\nLooking forward to more details.`;
    window.open(`https://wa.me/628123456789?text=${encodeURIComponent(text)}`, "_blank");
  };

  const popularPrivateDestinations = localizedPrivateDestinations[locale];
  const testimonials = localizedTestimonials[locale];

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
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pt-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-sky-300 font-semibold mb-6 block"
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
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0284C7] mb-6">
              <Compass size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-[#0F2C59] mb-3">{t("private_trip_freedom_title")}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">{t("private_trip_freedom_desc")}</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0284C7] mb-6">
              <Calendar size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-[#0F2C59] mb-3">{t("private_trip_flexibility_title")}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">{t("private_trip_flexibility_desc")}</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0284C7] mb-6">
              <Star size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-[#0F2C59] mb-3">{t("private_trip_service_title")}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">{t("private_trip_service_desc")}</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0284C7] mb-6">
              <Users size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-[#0F2C59] mb-3">{t("private_trip_privacy_title")}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">{t("private_trip_privacy_desc")}</p>
          </div>

        </div>
      </section>

      {/* Popular Private Trips Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
            {t("private_trip_inspiration_tag")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide">
            {t("private_trip_inspiration_title")}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularPrivateDestinations.map((dest, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative shadow-lg mb-6">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/90 via-[#0F2C59]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-serif text-3xl text-white font-normal mb-3">
                    {dest.name}
                  </h3>
                  <p className="text-white/80 font-sans text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {dest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="max-w-6xl mx-auto px-6">
        <div className="bg-[#0F2C59] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          <div className="lg:w-5/12 p-10 md:p-16 relative flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0284C7]/20 to-transparent pointer-events-none" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 relative z-10 leading-tight">
              {t("private_trip_form_title")}
            </h2>
            <p className="font-sans text-white/70 text-sm md:text-base font-light mb-10 relative z-10 leading-relaxed">
              {t("private_trip_form_desc")}
            </p>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "100% Jadwal Fleksibel" : "100% Flexible Schedule"}</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Star size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "Standar Akomodasi Premium" : "Premium Accommodation Standards"}</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-[#0284C7]" />
                </div>
                <span className="font-sans text-sm font-light">{locale === "id" ? "Penanganan Khusus & VIP" : "Specialized & VIP Management"}</span>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 bg-white p-8 md:p-16">
            <h3 className="font-sans font-bold text-lg uppercase tracking-widest text-[#0F2C59] mb-8">
              {t("private_trip_form_head")}
            </h3>
            <form onSubmit={handleWhatsappSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("private_trip_form_label_destination")}</label>
                  <input 
                    type="text" 
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_destination")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("private_trip_form_label_time")}</label>
                  <input 
                    type="text" 
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder={t("private_trip_form_placeholder_time")} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("private_trip_form_label_pax")}</label>
                <input 
                  type="text" 
                  name="pax"
                  required
                  value={formData.pax}
                  onChange={handleInputChange}
                  placeholder={t("private_trip_form_placeholder_pax")} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("private_trip_form_label_notes")}</label>
                <textarea 
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t("private_trip_form_placeholder_notes")} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 focus:border-[#0284C7] transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0F2C59] hover:bg-[#0284C7] text-white rounded-xl py-4 flex items-center justify-center gap-3 transition-all duration-300 font-sans font-bold text-sm tracking-widest uppercase mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <Phone size={18} className="fill-white" />
                <span>{t("private_trip_form_submit")}</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full bg-[#F8FAFC] py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#0284C7] font-bold block mb-4">
              {t("private_trip_testimonial_tag")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0F2C59] font-normal tracking-wide">
              {t("private_trip_testimonial_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((test, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-6 gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="font-sans text-gray-600 text-sm leading-relaxed mb-8 italic">
                    "{test.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                  <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center font-serif text-[#0f2c59] font-bold text-lg shrink-0">
                    {test.initial}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[#0F2C59] text-sm">{test.name}</h4>
                    <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mt-1">{test.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
