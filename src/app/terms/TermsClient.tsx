"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function TermsClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const sections = isEn
    ? [
        {
          title: "1. Acceptance of Terms",
          content:
            "By accessing and using the services of Klik Travel ID, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform or book trips with us.",
        },
        {
          title: "2. Booking and Payments",
          content:
            "All bookings are subject to availability and confirmation. A deposit or full payment as specified in the package detail is required to secure your reservation. Payments are non-refundable unless specified otherwise in the trip description or event cancelation policy.",
        },
        {
          title: "3. Travelers' Responsibility",
          content:
            "Travelers are responsible for preparing their personal documents, including valid passports (minimum 6 months validity from departure date), visas, travel insurance, and health certificates required by the destination country.",
        },
        {
          title: "4. Cancelations and Changes",
          content:
            "Klik Travel ID reserves the right to cancel or modify any trip itineraries due to force majeure events, natural disasters, political instability, or other circumstances beyond our control. In such events, we will offer alternative arrangements or credits.",
        },
        {
          title: "5. Limitation of Liability",
          content:
            "Klik Travel ID acts as an agent for hotels, airlines, and local operators. We are not responsible for any personal injury, property loss, delay, or additional expenses incurred due to acts or omissions of third-party service providers.",
        },
      ]
    : [
        {
          title: "1. Penerimaan Ketentuan",
          content:
            "Dengan mengakses dan menggunakan layanan Klik Travel ID, Anda menyetujui untuk mematuhi dan terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui persyaratan ini, silakan hindari penggunaan platform atau reservasi paket kami.",
        },
        {
          title: "2. Pemesanan dan Pembayaran",
          content:
            "Semua pemesanan bergantung pada ketersediaan kuota. Uang muka (DP) atau pelunasan sesuai ketentuan paket wajib dibayarkan untuk mengonfirmasi reservasi. Pembayaran bersifat non-refundable kecuali diatur berbeda pada kebijakan pembatalan paket spesifik.",
        },
        {
          title: "3. Tanggung Jawab Peserta",
          content:
            "Peserta bertanggung jawab penuh atas kelengkapan dokumen perjalanan pribadi, seperti paspor (masa berlaku minimal 6 bulan sejak tanggal keberangkatan), visa, asuransi perjalanan, serta dokumen kesehatan yang diwajibkan negara tujuan.",
        },
        {
          title: "4. Pembatalan dan Perubahan Jadwal",
          content:
            "Klik Travel ID berhak membatalkan atau mengubah rencana perjalanan (itinerary) apabila terjadi keadaan kahar (force majeure) seperti bencana alam, ketidakstabilan politik, atau kondisi cuaca buruk demi keselamatan bersama. Opsi penjadwalan ulang atau kredit perjalanan akan ditawarkan.",
        },
        {
          title: "5. Batasan Tanggung Jawab",
          content:
            "Klik Travel ID bertindak sebagai perantara agen penyedia hotel, maskapai, dan operator lokal. Kami tidak bertanggung jawab atas kerugian fisik, kehilangan barang bawaan, keterlambatan jadwal penerbangan, atau pengeluaran tambahan yang disebabkan oleh kelalaian penyedia jasa pihak ketiga.",
        },
      ];


  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-800 font-sans relative">
      {/* Subtle Sky Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-sky-100/10 via-sky-50/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-24 relative z-10">
        {/* Category Badge */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100/60 text-[#0284C7] text-[10px] font-mono tracking-wider uppercase mb-5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isEn ? "Terms & Guidelines" : "Aturan & Panduan Layanan"}</span>
          </motion.div>
        </div>

        {/* Title & Description */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0F2C59] font-bold tracking-tight mb-4"
          >
            {isEn ? "Terms of Service" : "Syarat & Ketentuan"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 text-sm md:text-base font-light leading-relaxed"
          >
            {isEn
              ? "Please read these terms carefully before placing bookings with us. These terms govern the relationship between Klik Travel ID and our travelers."
              : "Silakan baca ketentuan ini secara saksama sebelum melakukan pemesanan. Ketentuan ini mengatur hubungan hukum antara Klik Travel ID dan peserta perjalanan."}
          </motion.p>
        </div>

        {/* Flat Modern Editorial List */}
        <div className="space-y-0 border-t border-slate-100/80">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-slate-100/80 items-baseline"
            >
              <div className="md:col-span-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-extrabold text-sky-400 select-none leading-none">
                  0{idx + 1}
                </span>
                <h2 className="text-lg md:text-xl font-serif text-[#0F2C59] font-bold tracking-tight">
                  {section.title.replace(/^\d+\.\s*/, "")}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions / Contact info */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0F2C59] hover:text-[#0284C7] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{isEn ? "Back to Home" : "Kembali ke Beranda"}</span>
          </Link>
          <span className="text-xs font-light text-slate-400">
            Need assistance? Contact <a href="mailto:info@kliktravel.id" className="text-[#0F2C59] underline hover:text-[#0284C7]">info@kliktravel.id</a>
          </span>
        </div>
      </div>
    </div>
  );
}
