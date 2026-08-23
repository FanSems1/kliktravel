"use client";

import React, { useEffect } from "react";
import { MessageCircle, ArrowRight, PhoneCall } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { locale } = useLanguage();
  const waUrl = "https://wa.me/6281230011027";

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = waUrl;
    }, 1200);
    return () => clearTimeout(timer);
  }, [waUrl]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0284C7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 border border-[#0F2C59]/10 shadow-xl text-center relative z-10">
        
        {/* Animated Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#059669] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/25 animate-bounce">
          <MessageCircle className="w-10 h-10" />
        </div>

        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A89053] font-bold block mb-2">
          KLIK TRAVEL ID CONTACT
        </span>

        <h1 className="font-serif text-2xl md:text-3xl text-[#0F2C59] font-normal leading-snug mb-3">
          {locale === "id" ? "Menghubungkan ke WhatsApp..." : "Connecting to WhatsApp..."}
        </h1>

        <p className="font-sans text-xs md:text-sm text-[#0F2C59]/70 leading-relaxed mb-8">
          {locale === "id"
            ? "Anda sedang dialihkan ke WhatsApp resmi Klik Travel ID (+62 812-3001-1027) untuk berkonsultasi dengan Travel Expert kami."
            : "You are being redirected to the official WhatsApp of Klik Travel ID (+62 812-3001-1027) to speak with our Travel Expert."}
        </p>

        <a
          href={waUrl}
          className="w-full inline-flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white font-sans text-xs uppercase tracking-widest font-bold py-4 px-6 rounded-full shadow-md transition-all duration-300 group"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{locale === "id" ? "Buka Chat WhatsApp" : "Open WhatsApp Chat"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        <p className="font-mono text-[10px] text-[#0F2C59]/40 uppercase tracking-wider mt-6">
          Official Number: +62 812-3001-1027
        </p>
      </div>
    </div>
  );
}
