"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Award, ShieldCheck, HeartHandshake, Sparkles, MapPin, Users, Globe, ArrowRight, HelpCircle, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function AboutClient() {
  const { t, locale } = useLanguage();
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      labelID: "Traveler Bahagia",
      labelEN: "Happy Travelers",
    },
    {
      icon: Globe,
      value: "50+",
      labelID: "Destinasi Eksklusif",
      labelEN: "Exclusive Destinations",
    },
    {
      icon: Award,
      value: "99.8%",
      labelID: "Kepuasan Pelanggan",
      labelEN: "Customer Satisfaction",
    },
    {
      icon: ShieldCheck,
      value: "10+",
      labelID: "Tahun Pengalaman",
      labelEN: "Years Experience",
    },
  ];

  const storyImages = [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
      captionID: "Keindahan Alam Indonesia",
      captionEN: "Indonesian Wonders",
    },
    {
      url: "https://images.unsplash.com/photo-1528164344705-47542687990d?q=80&w=800",
      captionID: "Pesona Asia & Eropa",
      captionEN: "Global Destinations",
    },
    {
      url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800",
      captionID: "Pengalaman Unik & Berbeda",
      captionEN: "Bespoke Curation",
    },
    {
      url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800",
      captionID: "Layanan Terpercaya 24/7",
      captionEN: "24/7 Trusted Service",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 overflow-hidden font-sans">
      {/* HERO BANNER SECTION - LIGHT EDITORIAL EDIT */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 bg-[#FAF9F6] border-b border-slate-200/60 overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#A890530d_1px,transparent_1px),linear-gradient(to_bottom,#A890530d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Message */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A89053]/10 border border-[#A89053]/30 text-[#A89053] typography-caption uppercase mb-6 backdrop-blur-sm"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{locale === "id" ? "Tentang Klik Travel ID" : "About Klik Travel ID"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="typography-hero text-[#0F2C59] tracking-tight mb-6"
            >
              {locale === "id" ? (
                <>
                  Mewujudkan Perjalanan Impian dengan <span className="italic text-[#A89053]">Sentuhan Personal</span>
                </>
              ) : (
                <>
                  Crafting Dream Journeys with <span className="italic text-[#A89053]">A Personal Touch</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="typography-body text-slate-600 max-w-xl mb-10"
            >
              {locale === "id"
                ? "Kami hadir untuk mendefinisikan ulang cara Anda menjelajahi dunia. Dari destinasi eksotis Nusantara hingga petualangan mancanegara, setiap perjalanan dirancang khusus untuk kenyamanan dan kenangan tak terlupakan."
                : "We exist to redefine the way you explore the world. From exotic archipelago destinations to global adventures, every journey is handcrafted for ultimate comfort and cherished memories."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex gap-4 items-center"
            >
              <Link
                href="/destinations"
                className="btn-secondary gap-2"
              >
                <span>{locale === "id" ? "Jelajahi Destinasi" : "Explore Destinations"}</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Creative Visual Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-[380px] aspect-[4/5]"
            >
              {/* Decorative grid pattern behind */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[radial-gradient(#A89053_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(#0F2C59_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

              {/* Main Image Frame */}
              <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-[0_25px_60px_-15px_rgba(15,44,89,0.15)] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800"
                  alt="Explore"
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/30 via-transparent to-transparent" />
              </div>

              {/* Floating Stat Card 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute -left-10 top-1/4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] flex items-center gap-3.5 min-w-[170px]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#A89053]/10 flex items-center justify-center text-[#A89053] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-[#0F2C59]">10,000+</div>
                  <div className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase leading-none">
                    {locale === "id" ? "Traveler" : "Travelers"}
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute -right-6 bottom-16 z-20 bg-[#0F2C59] rounded-2xl p-4 shadow-[0_15px_30px_-5px_rgba(15,44,89,0.25)] flex items-center gap-3.5 min-w-[170px] text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#A89053] shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-base font-bold font-mono text-white">99.8%</div>
                  <div className="text-[10px] text-slate-300 font-semibold tracking-wide uppercase leading-none">
                    {locale === "id" ? "Kepuasan" : "Satisfaction"}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BRAND STORY & CURATION SECTION - LIGHT MODE */}
      <section className="py-24 md:py-32 bg-white text-slate-800 relative z-10 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Showcase Grid */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="lg:col-span-6 grid grid-cols-2 gap-4"
            >
              {storyImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl group shadow-lg border border-slate-100 ${
                    i % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
                    <img
                      src={img.url}
                      alt={locale === "id" ? img.captionID : img.captionEN}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/80 via-[#0F2C59]/10 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white tracking-wider font-semibold">
                    {locale === "id" ? img.captionID : img.captionEN}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Editorial Brand Narrative */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <div className="typography-caption !text-[#0F2C59] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2C59]/5 mb-6 border border-[#0F2C59]/10 w-fit">
                <Compass className="w-3.5 h-3.5" />
                <span>{locale === "id" ? "Filosofi Layanan" : "Service Philosophy"}</span>
              </div>

              <h2 className="typography-section text-[#0F2C59] tracking-tight mb-6">
                {locale === "id" ? (
                  <>
                    Komitmen Kami Terhadap <br />
                    <span className="text-[#A89053] italic">Kualitas & Citarasa</span> Perjalanan
                  </>
                ) : (
                  <>
                    Our Commitment to <br />
                    <span className="text-[#A89053] italic">Unrivaled Excellence</span>
                  </>
                )}
              </h2>

              <p className="typography-body text-slate-600 mb-6">
                {locale === "id"
                  ? "Klik Travel ID berdedikasi menyajikan paket tur kurasi pilihan yang menggabungkan kemudahan pendaftaran, jadwal terjamin (Guaranteed Departures), akomodasi hotel berbintang pilihan, serta penerbangan maskapai pilihan."
                  : "Klik Travel ID is dedicated to delivering quality curated tour packages that harmonize seamless booking, guaranteed departure schedules, handpicked accommodations, and reliable airline partnerships."}
              </p>

              <p className="typography-body text-slate-500 mb-8">
                {locale === "id"
                  ? "Kami percaya bahwa setiap liburan haruslah menjadi sarana penyegaran jiwa tanpa kekhawatiran logistik. Dengan staf berpengalaman dan perwakilan lokal terpercaya, kenyamanan Anda adalah prioritas utama kami."
                  : "We believe travel should refresh your soul without logistical worries. Guided by seasoned travel experts and trusted local partners, your comfort and bliss remain our single highest priority."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200/80">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#A89053]/10 text-[#A89053] mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[#0F2C59] font-bold text-sm mb-1">
                      {locale === "id" ? "Pasti Jalan & Transparan" : "Guaranteed & Transparent"}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-light">
                      {locale === "id" ? "Jadwal pasti tanpa biaya tersembunyi" : "Clear schedules with zero hidden charges"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#A89053]/10 text-[#A89053] mt-1">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[#0F2C59] font-bold text-sm mb-1">
                      {locale === "id" ? "Pendampingan 24/7" : "24/7 Dedicated Support"}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-light">
                      {locale === "id" ? "Tim siap membantu sepanjang perjalanan" : "Personal concierges ready anytime"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REUSED PREMIUM SECTIONS */}
      <VisionMissionSection />
      <WhyChooseUsSection />
      <TestimonialsSection />

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#FAF9F6] border-b border-slate-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Heading & Info */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A89053]/10 border border-[#A89053]/30 text-[#A89053] typography-caption uppercase mb-6"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{locale === "id" ? "Pertanyaan Umum" : "Frequently Asked Questions"}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="typography-section text-[#0F2C59] tracking-tight mb-6"
              >
                {locale === "id" ? (
                  <>
                    Pertanyaan yang Sering <br />
                    <span className="text-[#A89053] italic">Diajukan Traveler</span>
                  </>
                ) : (
                  <>
                    Frequently Asked <br />
                    <span className="text-[#A89053] italic">Questions</span>
                  </>
                )}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="typography-body text-slate-600 mb-8"
              >
                {locale === "id"
                  ? "Punya pertanyaan seputar pemesanan, pembayaran, atau opsi perjalanan bersama Klik Travel ID? Temukan jawaban lengkapnya di sini."
                  : "Have questions regarding bookings, payments, or travel options with Klik Travel ID? Find comprehensive answers here."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link href="/faq" className="btn-outline border-[#0F2C59]/20 text-[#0F2C59] hover:bg-[#0F2C59] hover:text-white">
                  <span>{locale === "id" ? "Lihat Semua FAQ →" : "View All FAQs →"}</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Accordion Items */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {[
                {
                  q: locale === "id" 
                    ? "Bagaimana cara memesan paket tour di Klik Travel ID?" 
                    : "How do I book a tour package with Klik Travel ID?",
                  a: locale === "id"
                    ? "Anda dapat memilih destinasi impian di website, lalu klik tombol 'Reservasi' atau langsung hubungi admin kami via WhatsApp (+62 812-3001-1027). Tim kami akan membantu cek ketersediaan slot dan memproses pendaftaran Anda."
                    : "You can select your dream destination on the website and click the 'Reservasi' button or directly contact our admin via WhatsApp (+62 812-3001-1027). Our team will assist in checking slot availability and processing your booking."
                },
                {
                  q: locale === "id"
                    ? "Apa perbedaan antara Open Trip dan Private Trip?"
                    : "What is the difference between Open Trip and Private Trip?",
                  a: locale === "id"
                    ? "Open Trip adalah tur gabungan dengan peserta lain sesuai jadwal yang telah ditentukan. Sedangkan Private Trip adalah tur khusus/eksklusif untuk grup Anda (keluarga, teman, instansi) dengan tanggal, rute, dan fasilitas yang disesuaikan."
                    : "Open Trips are shared tours with fixed departure dates. Private Trips are exclusive tours for your private group (family, friends, corporate) with customizable dates, routes, and services."
                },
                {
                  q: locale === "id"
                    ? "Metode pembayaran apa saja yang diterima?"
                    : "What payment methods are accepted?",
                  a: locale === "id"
                    ? "Pembayaran dilakukan via Transfer Bank resmi ke rekening perusahaan Klik Travel ID. Detail nomor rekening dan invoice akan diinfokan langsung oleh admin saat reservasi."
                    : "Payments are made via official Bank Transfer to Klik Travel ID's corporate account. Official bank details and invoice will be provided directly by our admin upon reservation."
                },
                {
                  q: locale === "id"
                    ? "Bagaimana jika saya ingin berkonsultasi mengenai Visa atau jadwal keberangkatan?"
                    : "What if I want to consult about Visa or departure schedules?",
                  a: locale === "id"
                    ? "Untuk informasi pengurusan dokumen (seperti Visa), ketersediaan jadwal keberangkatan, atau penyesuaian khusus, silakan langsung berkonsultasi dengan admin kami via WhatsApp (+62 812-3001-1027) agar mendapatkan informasi paling akurat."
                    : "For travel document assistance (such as Visas), departure schedule updates, or special requests, please consult directly with our admin via WhatsApp (+62 812-3001-1027) for the most accurate details."
                },
                {
                  q: locale === "id"
                    ? "Apakah bisa membuat rancangan perjalanan khusus (Custom / Private Trip)?"
                    : "Is it possible to make a custom travel design (Custom / Private Trip)?",
                  a: locale === "id"
                    ? "Tentu! Kami melayani pembuatan itinerary khusus sesuai kebutuhan dan budget Anda. Silakan hubungi admin via WhatsApp (+62 812-3001-1027) atau ajukan permohonan di halaman Private Trip."
                    : "Absolutely! We design customized itineraries tailored to your preferences and budget. Feel free to contact our admin on WhatsApp (+62 812-3001-1027) or submit a request on the Private Trip page."
                }
              ].map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#A89053]/40 shadow-lg shadow-[#0F2C59]/5"
                        : "bg-white/80 border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className="font-sans font-semibold text-base md:text-lg text-[#0F2C59] leading-snug">
                        {faq.q}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-[#0F2C59] text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </div>
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 border-t border-slate-100/80 mt-1"
                      >
                        <p className="typography-body text-slate-600 font-light leading-relaxed pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
