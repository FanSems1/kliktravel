"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Award, ShieldCheck, HeartHandshake, Sparkles, MapPin, Users, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function AboutClient() {
  const { t, locale } = useLanguage();

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A89053]/10 border border-[#A89053]/30 text-[#A89053] text-xs font-mono tracking-[0.3em] font-semibold uppercase mb-6 backdrop-blur-sm"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{locale === "id" ? "Tentang Klik Travel ID" : "About Klik Travel ID"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-[#0F2C59] leading-[1.12] mb-6 font-medium"
            >
              {locale === "id" ? (
                <>
                  Mewujudkan Perjalanan Impian dengan <span className="italic font-normal text-[#A89053] font-serif">Sentuhan Personal</span>
                </>
              ) : (
                <>
                  Crafting Dream Journeys with <span className="italic font-normal text-[#A89053] font-serif">A Personal Touch</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed font-light mb-10"
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
                href="/journeys"
                className="inline-flex items-center gap-2 bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md hover:shadow-lg"
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

              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-light mb-8">
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
      <PhilosophySection />
      <TestimonialsSection />
      <FinalCTA />
    </div>
  );
}
