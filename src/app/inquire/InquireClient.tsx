"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { localizedRegions } from "@/data/destinations";
import { apiFetch } from "@/lib/api";
import { 
  ShieldCheck, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Users, 
  Send, 
  MessageSquare, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Compass
} from "lucide-react";

export function InquireClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [tripType, setTripType] = useState<"open" | "private">("private");
  const [destination, setDestination] = useState("");
  const [dynamicDestinations, setDynamicDestinations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic destinations from API
  useEffect(() => {
    async function loadDynamicDestinations() {
      try {
        const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          const list: string[] = [];
          data.forEach((r) => {
            const regionName = r.name ? r.name.split("||")[0] : r.slug;
            if (r.subDestinations && r.subDestinations.length > 0) {
              r.subDestinations.forEach((s: any) => {
                let subName = s.name || s.nameId || s.nameEn || "";
                if (subName.includes("||")) {
                  subName = subName.split("||")[0];
                }
                list.push(`${subName} (${regionName})`);
              });
            } else {
              list.push(regionName);
            }
          });
          setDynamicDestinations(list);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load destinations API:", err);
      }

      // Static fallback if API is empty
      const fallbackList: string[] = [];
      const regions = localizedRegions[locale] || localizedRegions["id"] || [];
      regions.forEach((region) => {
        if (region.subDestinations && region.subDestinations.length > 0) {
          region.subDestinations.forEach((sub) => {
            fallbackList.push(`${sub.name} (${region.name})`);
          });
        } else {
          fallbackList.push(region.name);
        }
      });
      setDynamicDestinations(fallbackList);
      setIsLoading(false);
    }

    loadDynamicDestinations();
  }, [locale]);
  const [travelDate, setTravelDate] = useState("");
  const [participants, setParticipants] = useState("2");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tripTypeLabel = tripType === "private" 
      ? (isEn ? "Private Trip (Custom)" : "Private Trip (Keluarga / Rombongan)")
      : (isEn ? "Open Trip (Join Group)" : "Open Trip (Gabungan)");

    const text = isEn
      ? `Halo Klik Travel ID!\n\nSaya ingin konsultasi perjalanan:\n- Jenis Trip: ${tripTypeLabel}\n- Destinasi: ${destination}\n- Tanggal/Bulan: ${travelDate || "Belum pasti"}\n- Jumlah Peserta: ${participants} orang\n- Nama: ${name || "Traveler"}\n- No WA: ${whatsapp || "-"}\n${notes ? `- Catatan: ${notes}` : ""}\n\nMohon informasi & estimasi biayanya. Terima kasih!`
      : `Halo Klik Travel ID!\n\nSaya ingin konsultasi perjalanan:\n- Jenis Trip: ${tripTypeLabel}\n- Destinasi: ${destination}\n- Tanggal/Bulan: ${travelDate || "Belum pasti"}\n- Jumlah Peserta: ${participants} orang\n- Nama: ${name || "Traveler"}\n- No WA: ${whatsapp || "-"}\n${notes ? `- Catatan: ${notes}` : ""}\n\nMohon informasi & estimasi biayanya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281230011027?text=${encoded}`, "_blank");
  };

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/10 text-[#0284C7] typography-caption uppercase"
          >
            <Sparkles size={13} />
            <span>{isEn ? "Tailor-Made Trip Consultation" : "Konsultasi Perjalanan Impian"}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="typography-hero text-[#0F2C59] tracking-tight leading-tight"
          >
            {isEn ? "Plan Your Unforgettable Journey" : "Rancang Perjalanan Impian Anda"}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="typography-body text-slate-600 max-w-2xl mx-auto"
          >
            {isEn 
              ? "Tell us your travel vision. Our travel specialists will craft a customized itinerary suited to your dates, budget, and style."
              : "Ceritakan rencana liburan Anda. Tim konsultan Klik Travel ID siap membantu merancang perjalanan nyaman dengan harga yang jujur dan fleksibel."}
          </motion.p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Visual Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 overflow-hidden relative group">
              {/* Main Visual Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-100">
                <img 
                  src="/images/inquire-hero.jpg" 
                  alt="Klik Travel ID Consultation" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/90 via-[#0F2C59]/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="typography-caption !text-sky-300 block mb-1">
                    {isEn ? "Personalized Travel" : "Layanan Kustom"}
                  </span>
                  <h3 className="typography-card !text-white leading-snug">
                    {isEn ? "Explore Without Boundaries" : "Jelajahi Dunia dengan Nyaman & Tenang"}
                  </h3>
                </div>
              </div>

              {/* Guarantees List */}
              <div className="space-y-4 px-2 py-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#0284C7] shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="typography-body font-bold text-[#0F2C59]">
                      {isEn ? "Trusted & Transparency" : "100% Terpercaya & Transparan"}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {isEn 
                        ? "Clear pricing without hidden costs, tailored to your exact budget."
                        : "Rincian biaya jelas tanpa biaya tersembunyi, disesuaikan dengan anggaran Anda."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#0284C7] shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="typography-body font-bold text-[#0F2C59]">
                      {isEn ? "Professional Tour Leaders" : "Pendampingan Tour Leader Ramah"}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {isEn 
                        ? "Experienced guides making every moment smooth and memorable."
                        : "Didampingi tim profesional yang responsif dan siap membantu selama perjalanan."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-[#0284C7] shrink-0">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h4 className="typography-body font-bold text-[#0F2C59]">
                      {isEn ? "Flexible Itinerary" : "Itinerary Fleksibel & Bebas Atur"}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {isEn 
                        ? "Design your custom route across domestic & international spots."
                        : "Bebas atur destinasi favorit keluarga atau tempat impian yang ingin dikunjungi."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-[#0F2C59]">
                      {isEn ? "Fast Response" : "Respon Cepat"}
                    </span>
                    <span className="block font-sans text-[11px] text-slate-500">
                      08:00 — 21:00 WIB
                    </span>
                  </div>
                </div>

                <a 
                  href="https://wa.me/6281230011027" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-bold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>WA CS Direct</span>
                </a>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Interactive Consultation Form */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/80">
              
              <div className="border-b border-slate-100 pb-6 mb-6">
                <h3 className="typography-card text-[#0F2C59]">
                  {isEn ? "Formulir Konsultasi Perjalanan" : "Formulir Konsultasi Perjalanan"}
                </h3>
                <p className="typography-body text-slate-500 mt-1">
                  {isEn 
                    ? "Fill in the details below and we will automatically format your WhatsApp inquiry."
                    : "Isi rincian di bawah ini untuk terhubung langsung dengan konsultan perjalanan kami."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Trip Type Selector */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                    {isEn ? "Select Trip Type" : "Pilih Jenis Trip"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("private");
                        setDestination("");
                      }}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        tripType === "private"
                          ? "bg-[#0F2C59] text-white border-[#0F2C59] shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Users size={16} />
                      <span>Private Trip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("open");
                        if (dynamicDestinations.length > 0) {
                          setDestination(dynamicDestinations[0]);
                        } else {
                          setDestination("Bali");
                        }
                      }}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        tripType === "open"
                          ? "bg-[#0F2C59] text-white border-[#0F2C59] shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Compass size={16} />
                      <span>Open Trip</span>
                    </button>
                  </div>
                </div>

                {/* Destination Selector / Input */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                    {isEn ? "Destination Choice" : "Destinasi Tujuan"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    {tripType === "private" ? (
                      <input
                        type="text"
                        required
                        placeholder={isEn ? "e.g. Kyoto, Japan or Custom Route" : "Contoh: Bali, Kyoto, atau Rute Kustom"}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                      />
                    ) : (
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                      >
                        {dynamicDestinations.map((dest) => (
                          <option key={dest} value={dest}>
                            {dest}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Date & Participants Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                      {isEn ? "Target Date / Month" : "Perkiraan Tanggal / Bulan"}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder={isEn ? "e.g. Oct 2026 / Liburan School" : "Contoh: Oktober 2026"}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                      {isEn ? "Number of Travelers" : "Jumlah Peserta"}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder="Contoh: 4 Orang"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Name & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                      {isEn ? "Your Full Name" : "Nama Lengkap"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                      {isEn ? "WhatsApp Number" : "Nomor WhatsApp"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                    {isEn ? "Special Requests / Notes (Optional)" : "Catatan Tambahan (Opsional)"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isEn ? "e.g. Include 5-star hotel upgrade & romantic dinner" : "Contoh: Ingin upgrade hotel bintang 5 atau paket honeymoon"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full shadow-lg shadow-sky-500/25 gap-2 cursor-pointer transform active:scale-[0.99]"
                >
                  <Send size={18} />
                  <span>{isEn ? "Submit via WhatsApp" : "Kirim Konsultasi via WhatsApp"}</span>
                </button>

                <p className="font-sans text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>
                    {isEn 
                      ? "Free consultation without any booking obligations."
                      : "Konsultasi gratis tanpa kewajiban pemesanan langsung."}
                  </span>
                </p>

              </form>

            </div>
          </motion.div>

        </div>

      </div>
    </main>
  );
}
