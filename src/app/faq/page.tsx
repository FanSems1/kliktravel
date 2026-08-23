"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  HelpCircle, 
  Calendar, 
  CreditCard, 
  FileText, 
  Compass, 
  MessageCircle, 
  ArrowRight 
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  icon: React.ReactNode;
  titleID: string;
  titleEN: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const { locale } = useLanguage();
  const isIndo = locale === "id";

  const categories: FAQCategory[] = [
    {
      id: "booking",
      icon: <Calendar className="w-5 h-5" />,
      titleID: "Pemesanan & Reservasi",
      titleEN: "Booking & Reservation",
      items: [
        {
          q: isIndo 
            ? "Bagaimana cara memesan paket tour di Klik Travel ID?" 
            : "How do I book a tour package with Klik Travel ID?",
          a: isIndo
            ? "Anda dapat menjelajahi destinasi impian di website kami, pilih paket keberangkatan, lalu klik tombol 'Reservasi' atau hubungi Travel Expert kami via WhatsApp. Kami akan membantu Anda memverifikasi ketersediaan slot dan memproses booking Anda."
            : "You can browse your dream destinations on our website, select your preferred departure date, and click the 'Reservasi' button to connect directly with our Travel Expert on WhatsApp. We will help you verify slot availability and process your booking."
        },
        {
          q: isIndo
            ? "Berapa minimal uang muka (DP) untuk memesan tour?"
            : "How much deposit (DP) is required to secure a booking?",
          a: isIndo
            ? "Uang muka (DP) bervariasi bergantung pada jenis destinasi dan durasi tur (umumnya berkisar mulai dari Rp 5.000.000 per orang untuk rute internasional). Detail nominal pembayaran awal akan diinformasikan oleh tim kami."
            : "The minimum deposit (DP) varies depending on the destination and tour length (generally starting from IDR 5,000,000 per person for international routes). Exact payment details will be provided by our team during booking."
        },
        {
          q: isIndo
            ? "Kapan batas akhir pelunasan biaya perjalanan?"
            : "When is the deadline for full payment?",
          a: isIndo
            ? "Pelunasan biaya perjalanan wajib diselesaikan selambat-lambatnya 30 hari sebelum tanggal keberangkatan terjadwal agar kami dapat melakukan finalisasi akomodasi dan transportasi Anda."
            : "Full payment must be settled at least 30 days prior to the scheduled departure date to allow us to finalize your accommodation, tickets, and travel logistics."
        }
      ]
    },
    {
      id: "payments",
      icon: <CreditCard className="w-5 h-5" />,
      titleID: "Pembayaran & Biaya",
      titleEN: "Payments & Pricing",
      items: [
        {
          q: isIndo
            ? "Metode pembayaran apa saja yang didukung?"
            : "What payment methods are supported?",
          a: isIndo
            ? "Kami menerima pembayaran melalui Transfer Bank resmi ke rekening perusahaan Klik Travel ID. Informasi nomor rekening resmi akan dilampirkan dalam lembar konfirmasi pemesanan Anda."
            : "We accept payments via bank transfer to Klik Travel ID's official corporate bank account. Official account details will be attached in your booking confirmation invoice."
        },
        {
          q: isIndo
            ? "Apakah harga paket tour sudah termasuk tiket pesawat?"
            : "Are flights included in the tour package price?",
          a: isIndo
            ? "Ya, sebagian besar paket Open Trip kami sudah mencakup tiket pesawat pulang-pergi (PP) kelas ekonomi dengan maskapai penerbangan ternama serta kapasitas bagasi standar. Anda dapat melihat detail 'Includes' pada halaman masing-masing perjalanan."
            : "Yes, most of our Open Trip packages include round-trip economy class flights with reputable full-service airlines and standard baggage allowance. Please review the 'Includes' section of the trip details page."
        }
      ]
    },
    {
      id: "triptypes",
      icon: <Compass className="w-5 h-5" />,
      titleID: "Jenis Perjalanan",
      titleEN: "Trip Types",
      items: [
        {
          q: isIndo
            ? "Apa perbedaan antara Open Trip dan Private Trip?"
            : "What is the difference between Open Trip and Private Trip?",
          a: isIndo
            ? "Open Trip adalah perjalanan gabungan dengan peserta lain dengan tanggal keberangkatan dan itinerary yang sudah ditentukan. Private Trip adalah perjalanan eksklusif khusus untuk grup Anda sendiri (keluarga, teman, instansi) dengan tanggal, rute, dan fasilitas yang disesuaikan secara personal."
            : "An Open Trip is a group departure where you will travel with other participants on a fixed date and itinerary. A Private Trip is an exclusive departure tailored solely for your private group (family, friends, corporate) with customizable dates, routes, and services."
        },
        {
          q: isIndo
            ? "Apakah ada jaminan keberangkatan (Pasti Jalan)?"
            : "Is departure guaranteed?",
          a: isIndo
            ? "Ya, sebagian besar perjalanan kami berstatus 'AVAILABLE' yang berarti dijamin pasti jalan tanpa syarat jumlah minimal peserta tertentu. Anda dapat melihat penanda status ini di daftar pilihan liburan."
            : "Yes, the majority of our trips have an 'AVAILABLE' status indicating guaranteed departure regardless of minimum group size. You can see this status label on each journey card."
        }
      ]
    },
    {
      id: "documents",
      icon: <FileText className="w-5 h-5" />,
      titleID: "Dokumen & Pembatalan",
      titleEN: "Documents & Cancellations",
      items: [
        {
          q: isIndo
            ? "Apakah Klik Travel ID membantu pengurusan Visa?"
            : "Does Klik Travel ID assist with Visa applications?",
          a: isIndo
            ? "Tentu, kami menyediakan layanan bantuan dan konsultasi pengurusan dokumen perjalanan seperti visa kunjungan wisata, visa grup, hingga asuransi perjalanan internasional untuk kelancaran liburan Anda."
            : "Yes, we provide consultation and assistance for processing travel documents including tourist visas, group visas, and international travel insurance to ensure a hassle-free trip."
        },
        {
          q: isIndo
            ? "Bagaimana kebijakan pembatalan tiket/tur jika hal darurat terjadi?"
            : "What is the cancellation policy in case of emergencies?",
          a: isIndo
            ? "Ketentuan pembatalan, pemotongan biaya, refund, maupun opsi reschedule diatur dalam Syarat & Ketentuan Klik Travel ID. Jumlah refund bergantung pada durasi sisa hari saat pembatalan diajukan. Silakan hubungi tim kami untuk konsultasi detail."
            : "Cancellation terms, fees, refunds, and rescheduling options are strictly governed by Klik Travel ID's Terms & Conditions. The refund amount depends on the timing of the cancellation notice. Please contact our team for assistance."
        }
      ]
    }
  ];

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>("booking");
  
  // Expandable Accordion Item State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#A89053] font-bold uppercase block mb-3">
            {isIndo ? "PUSAT BANTUAN" : "HELP CENTER"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#0F2C59] leading-tight mb-4">
            {isIndo ? "Pertanyaan Umum" : "Frequently Asked Questions"}
          </h1>
          <p className="font-sans text-sm md:text-base text-[#0F2C59]/70 leading-relaxed font-light">
            {isIndo
              ? "Temukan jawaban cepat seputar pemesanan, pembayaran, jenis perjalanan, dan kebijakan Klik Travel ID."
              : "Find quick answers regarding bookings, payments, travel categories, and Klik Travel ID policies."}
          </p>
        </div>

        {/* Main Grid: Category List + FAQ Items Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Category Tabs */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveFaq(null);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#0F2C59] border-[#0F2C59] text-white shadow-lg shadow-[#0F2C59]/10"
                      : "bg-white border-[#0F2C59]/10 text-[#0F2C59]/80 hover:bg-white/80 hover:border-[#0F2C59]/30"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isActive ? "bg-white/10 text-white" : "bg-[#0F2C59]/5 text-[#0F2C59]"
                  }`}>
                    {cat.icon}
                  </div>
                  <div>
                    <span className="font-sans text-xs font-mono tracking-wider uppercase block opacity-40 mb-0.5">
                      {cat.id}
                    </span>
                    <span className="font-serif text-base font-normal block leading-tight">
                      {isIndo ? cat.titleID : cat.titleEN}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Accordions List */}
          <div className="lg:col-span-8 bg-white border border-[#0F2C59]/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-[#0F2C59] mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-[#A89053] shrink-0" />
              <span>{isIndo ? currentCategory.titleID : currentCategory.titleEN}</span>
            </h2>

            <div className="space-y-4">
              {currentCategory.items.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index} 
                    className="border border-[#0F2C59]/10 rounded-2xl overflow-hidden bg-[#FDFBF7]/30 hover:bg-[#FDFBF7]/60 transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="font-serif text-base md:text-lg text-[#0F2C59]">
                        {item.q}
                      </span>
                      <ChevronDown className={`text-[#A89053] shrink-0 transition-transform duration-500 ${
                        isOpen ? "rotate-180" : ""
                      }`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-0 border-t border-slate-100/50 font-sans text-xs md:text-sm text-[#0F2C59]/70 leading-relaxed font-light">
                            <p className="whitespace-pre-line pt-4">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom CTA Card */}
        <div className="mt-20 bg-charcoal rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-4">
              {isIndo ? "TETAP BUTUH BANTUAN?" : "STILL NEED HELP?"}
            </span>
            <h3 className="font-serif text-3xl font-normal leading-tight mb-4">
              {isIndo ? "Punya Pertanyaan Lain?" : "Have More Questions?"}
            </h3>
            <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed font-light mb-8">
              {isIndo
                ? "Tim support kami siap membantu menjawab pertanyaan khusus seputar destinasi, pemesanan kustom, atau korporasi."
                : "Our support team is ready to help answer specific questions about destinations, custom booking, or corporate trips."}
            </p>
            <a
              href="https://wa.me/6281230011027"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 group"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isIndo ? "Hubungi Travel Expert" : "Talk to Travel Expert"}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
