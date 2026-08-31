"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function PrivacyClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const sections = isEn
    ? [
        {
          title: "1. Information We Collect",
          content:
            "We collect information you provide directly to us when making an inquiry, booking a trip, or contacting our team. This includes your name, email address, phone number, travel preferences, and payment information necessary to complete your reservation.",
        },
        {
          title: "2. How We Use Your Information",
          content:
            "We use the collected information to process your travel reservations, personalize your trip itineraries, communicate updates regarding your bookings, and improve our services and customer support.",
        },
        {
          title: "3. Data Sharing and Protection",
          content:
            "We do not sell or rent your personal information to third parties. We share data only with verified travel partners (such as airlines, hotels, and local guides) strictly for fulfilling your booked travel services.",
        },
        {
          title: "4. Security Measures",
          content:
            "We implement robust administrative and technical security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure.",
        },
        {
          title: "5. Your Data Rights",
          content:
            "You have the right to access, update, or request the deletion of your personal data at any time. To exercise these rights, please contact our support team at info@kliktravel.id.",
        },
      ]
    : [
        {
          title: "1. Informasi yang Kami Kumpulkan",
          content:
            "Kami mengumpulkan informasi yang Anda berikan secara langsung saat melakukan reservasi, formulir konsultasi trip, atau menghubungi tim kami. Informasi ini mencakup nama, alamat email, nomor telepon, preferensi perjalanan, serta data yang diperlukan untuk pemrosesan pemesanan.",
        },
        {
          title: "2. Penggunaan Informasi Anda",
          content:
            "Informasi yang dikumpulkan digunakan untuk memproses pesanan paket perjalanan, menyesuaikan rancangan itinerary, memberikan pembaruan reservasi, serta meningkatkan kualitas pelayanan kami.",
        },
        {
          title: "3. Pembagian dan Perlindungan Data",
          content:
            "Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada mitra perjalanan resmi (seperti maskapai, hotel, dan pemandu lokal) semata-mata untuk penyediaan layanan tur Anda.",
        },
        {
          title: "4. Langkah Keamanan",
          content:
            "Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang teruji untuk melindungi data pribadi Anda dari akses yang tidak sah, pengubahan, penyingkapan, atau perusakan.",
        },
        {
          title: "5. Hak atas Data Anda",
          content:
            "Anda berhak mengakses, memperbarui, atau meminta penghapusan data pribadi Anda kapan saja. Untuk menggunakan hak ini, silakan hubungi tim dukungan kami melalui email di info@kliktravel.id.",
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100/60 text-[#0284C7] typography-caption uppercase mb-5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isEn ? "Privacy & Data Protection" : "Privasi & Perlindungan Data"}</span>
          </motion.div>
        </div>

        {/* Title & Description */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="typography-hero text-[#0F2C59] tracking-tight mb-4"
          >
            {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="typography-body text-slate-500"
          >
            {isEn
              ? "Your trust is our utmost priority. Read below to understand how Klik Travel ID protects and respects your personal information."
              : "Kepercayaan Anda adalah prioritas utama kami. Pelajari bagaimana Klik Travel ID menjaga dan melindungi informasi pribadi Anda."}
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
                <h2 className="typography-card text-[#0F2C59] tracking-tight">
                  {section.title.replace(/^\d+\.\s*/, "")}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="typography-body text-slate-500">
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
            Questions? Email us at <a href="mailto:info@kliktravel.id" className="text-[#0F2C59] underline hover:text-[#0284C7]">info@kliktravel.id</a>
          </span>
        </div>
      </div>
    </div>
  );
}

