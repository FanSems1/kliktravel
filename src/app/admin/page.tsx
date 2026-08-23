"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Compass,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  MapPin,
  Eye,
  FileText
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { locale } = useLanguage();

  const metrics = [
    {
      titleID: "Total Konsultasi & Inquiry",
      titleEN: "Total Inquiries & Consultations",
      value: "148",
      change: "+14.2%",
      isPositive: true,
      icon: MessageSquare,
      color: "bg-sky-500/10 text-sky-600 border-sky-200",
    },
    {
      titleID: "Paket Perjalanan Aktif",
      titleEN: "Active Tour Packages",
      value: "24",
      change: "+4 trip baru",
      isPositive: true,
      icon: Compass,
      color: "bg-[#A89053]/10 text-[#A89053] border-[#A89053]/30",
    },
    {
      titleID: "Est. Nilai Booking (Bulan Ini)",
      titleEN: "Est. Booking Value (This Month)",
      value: "IDR 485.5M",
      change: "+18.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    {
      titleID: "Inquiry Perlu Follow Up",
      titleEN: "Pending Follow-ups",
      value: "7",
      change: "Membutuhkan respon",
      isPositive: false,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
    },
  ];

  const recentInquiries = [
    {
      id: "INQ-2026-081",
      customer: "Budi Santoso",
      destination: "Komodo Phinisi Expedition",
      participants: "4 Pax",
      date: "10 Agu 2026",
      status: "pending",
      type: "Private Trip",
    },
    {
      id: "INQ-2026-080",
      customer: "Clara Wijaya",
      destination: "Kyoto Autumn Leaves",
      participants: "2 Pax",
      date: "09 Agu 2026",
      status: "confirmed",
      type: "Open Trip",
    },
    {
      id: "INQ-2026-079",
      customer: "David Kusuma",
      destination: "Winter Harbin & Ice Festival",
      participants: "6 Pax",
      date: "08 Agu 2026",
      status: "confirmed",
      type: "Open Trip",
    },
    {
      id: "INQ-2026-078",
      customer: "Elena Rostova",
      destination: "Switzerland & Alps Luxury Tour",
      participants: "2 Pax",
      date: "07 Agu 2026",
      status: "followup",
      type: "Private Trip",
    },
  ];

  const dynamicModules = [
    {
      titleID: "Open Trip & Destinasi",
      titleEN: "Open Trips & Destinations",
      descID: "Kelola daftar wilayah, kuota trip, dan jadwal keberangkatan.",
      descEN: "Manage regions, trip capacity, and departure dates.",
      count: "18 Open Trips",
      href: "/admin/destinations",
      badge: "Utama",
    },
    {
      titleID: "Private Trip & Custom",
      titleEN: "Private & Custom Trips",
      descID: "Atur paket perjalanan eksklusif dan preferensi grup.",
      descEN: "Configure bespoke itineraries and custom requests.",
      count: "6 Template",
      href: "/admin/private-trips",
      badge: "Eksklusif",
    },
    {
      titleID: "Jurnal & Artikel Travel",
      titleEN: "Travel Journal & Articles",
      descID: "Tulis dan publikasikan cerita petualangan dan panduan lokal.",
      descEN: "Publish editorial stories and destination guides.",
      count: "12 Artikel Published",
      href: "/admin/journal",
      badge: "Editorial",
    },
    {
      titleID: "Testimoni Pelanggan",
      titleEN: "Customer Testimonials",
      descID: "Moderasi ulasan dan dokumentasi momen kebersamaan customer.",
      descEN: "Moderate customer reviews and highlight moments.",
      count: "34 Reviews",
      href: "/admin/testimonials",
      badge: "Sosial",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
            KlikTravel Admin Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {locale === "id" ? "Selamat Datang di Panel Manajemen" : "Welcome to Management Panel"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-sans mt-1">
            {locale === "id"
              ? "Kelola paket wisata, konten dinamis, serta konsultasi pelanggan secara real-time."
              : "Manage tour packages, dynamic content, and customer inquiries in real-time."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/admin/journeys"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 transition-all font-sans text-xs font-semibold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} />
            <span>{locale === "id" ? "Tambah Tour Baru" : "Add New Tour"}</span>
          </Link>
          <Link
            href="/admin/journal"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all font-sans text-xs font-semibold uppercase tracking-wider"
          >
            <FileText size={14} />
            <span>{locale === "id" ? "Artikel Jurnal" : "Journal Post"}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-sans font-medium text-slate-500">
                  {locale === "id" ? metric.titleID : metric.titleEN}
                </span>
                <div className={`p-2.5 rounded-xl border ${metric.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-slate-800 tracking-tight">
                  {metric.value}
                </h3>
                <p className={`text-[11px] font-sans font-medium mt-1 ${metric.isPositive ? "text-emerald-600" : "text-amber-600"}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Content Management Modules */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif font-bold text-[#0F2C59]">
            {locale === "id" ? "Modul Pengelolaan Konten Dinamis" : "Dynamic Content Management Modules"}
          </h2>
          <span className="text-xs font-mono text-slate-400">4 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {dynamicModules.map((module, idx) => (
            <Link
              key={idx}
              href={module.href}
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-[#A89053]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                    {module.badge}
                  </span>
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#A89053] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-base group-hover:text-[#0F2C59] transition-colors mb-2">
                  {locale === "id" ? module.titleID : module.titleEN}
                </h3>
                <p className="text-xs text-slate-500 font-sans font-light leading-relaxed mb-4">
                  {locale === "id" ? module.descID : module.descEN}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#A89053]">
                  {module.count}
                </span>
                <span className="text-xs font-sans font-bold text-[#0F2C59] group-hover:underline">
                  {locale === "id" ? "Kelola" : "Manage"} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Inquiries & Consultations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#0F2C59]">
              {locale === "id" ? "Konsultasi & Inquiry Terbaru" : "Recent Inquiries & Consultations"}
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {locale === "id" ? "Daftar pemesanan dan pertanyaan dari calon wisatawan." : "Recent tour inquiries and customer trip planning requests."}
            </p>
          </div>
          <button className="text-xs font-sans font-bold text-[#0284C7] hover:underline">
            {locale === "id" ? "Lihat Semua" : "View All"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6 font-semibold">ID Inquiry</th>
                <th className="py-3.5 px-6 font-semibold">Pelanggan</th>
                <th className="py-3.5 px-6 font-semibold">Destinasi / Paket</th>
                <th className="py-3.5 px-6 font-semibold">Tipe</th>
                <th className="py-3.5 px-6 font-semibold">Peserta</th>
                <th className="py-3.5 px-6 font-semibold">Tanggal</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-medium text-slate-500">{inq.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{inq.customer}</td>
                  <td className="py-4 px-6 font-medium text-slate-700">{inq.destination}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${inq.type === "Private Trip"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                      }`}>
                      {inq.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{inq.participants}</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{inq.date}</td>
                  <td className="py-4 px-6">
                    {inq.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={12} /> Confirmed
                      </span>
                    )}
                    {inq.status === "pending" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    {inq.status === "followup" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
                        <AlertCircle size={12} /> Need Response
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F2C59] hover:text-white transition-colors font-sans text-xs font-semibold">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
