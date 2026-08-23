"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Compass, 
  Ship, 
  Calendar,
  ArrowUpRight, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Toast } from "@/components/ui/Toast";

interface BookingReport {
  id: string;
  customer: string;
  trip: string;
  type: "Open Trip" | "Private Trip";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const SAMPLE_BOOKINGS: BookingReport[] = [
  { id: "TX-9012", customer: "Ahmad Subagio", trip: "Tokyo Explorer Open Trip", type: "Open Trip", amount: 24500000, date: "2026-08-14", status: "completed" },
  { id: "TX-9011", customer: "Clara Wijaya", trip: "Komodo Phinisi Expedition", type: "Private Trip", amount: 150000000, date: "2026-08-13", status: "completed" },
  { id: "TX-9010", customer: "Indah Permata", trip: "Kyoto Autumn Leaves", type: "Open Trip", amount: 18900000, date: "2026-08-12", status: "pending" },
  { id: "TX-9009", customer: "Rudy Hartono", trip: "Switzerland & Italian Lakes Custom", type: "Private Trip", amount: 300000000, date: "2026-08-11", status: "completed" },
  { id: "TX-9008", customer: "Dewi Lestari", trip: "Labuan Bajo Private Luxury Yacht", type: "Private Trip", amount: 120000000, date: "2026-08-10", status: "failed" },
];

export default function AdminReportsPage() {
  const { locale } = useLanguage();
  const isIndo = locale === "id";
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "12m">("30d");

  const handleExport = (type: "excel" | "pdf") => {
    setToast({
      message: isIndo 
        ? `Laporan berhasil diekspor ke format ${type.toUpperCase()}!` 
        : `Report successfully exported to ${type.toUpperCase()}!`,
      type: "success"
    });
  };

  // Metrics data
  const totalRevenue = 493400000;
  const activeBookings = 24;
  const conversionRate = 4.8; // percent
  const customerAcquisition = 142;

  // Chart data representations
  const monthlyRevenueData = [
    { month: "Jan", val: 85 },
    { month: "Feb", val: 120 },
    { month: "Mar", val: 150 },
    { month: "Apr", val: 110 },
    { month: "May", val: 180 },
    { month: "Jun", val: 240 },
    { month: "Jul", val: 310 },
    { month: "Aug", val: 493 }
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#A89053] font-bold block mb-1">
            Analytics & Reports
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {isIndo ? "Laporan & Analitik Bisnis" : "Business Reports & Analytics"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-sans mt-1">
            {isIndo 
              ? "Pantau performa penjualan, rincian omzet destinasi, dan konversi inquiry private trip."
              : "Monitor sales performance, destination revenue breakdown, and private trip conversion."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-mono font-bold focus:outline-none"
          >
            <option value="7d">{isIndo ? "7 Hari Terakhir" : "Last 7 Days"}</option>
            <option value="30d">{isIndo ? "30 Hari Terakhir" : "Last 30 Days"}</option>
            <option value="12m">{isIndo ? "12 Bulan Terakhir" : "Last 12 Months"}</option>
          </select>

          <button
            onClick={() => handleExport("excel")}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Excel</span>
          </button>

          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-1.5 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider">
              {isIndo ? "Total Pendapatan" : "Total Revenue"}
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-slate-800 tracking-tight">
              IDR {totalRevenue.toLocaleString("id-ID")}
            </h3>
            <p className="text-xs font-sans font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+18.4% vs {isIndo ? "bulan lalu" : "last month"}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider">
              {isIndo ? "Booking Aktif" : "Active Bookings"}
            </span>
            <div className="p-2.5 bg-[#0F2C59]/5 text-[#0F2C59] rounded-2xl border border-[#0F2C59]/10">
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-slate-800 tracking-tight">
              {activeBookings} Trip
            </h3>
            <p className="text-xs font-sans font-semibold text-[#0284C7] flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+8 trip {isIndo ? "baru minggu ini" : "new this week"}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider">
              {isIndo ? "Tingkat Konversi Lead" : "Lead Conversion Rate"}
            </span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-slate-800 tracking-tight">
              {conversionRate}%
            </h3>
            <p className="text-xs font-sans font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+1.2% {isIndo ? "dari rata-rata" : "from average"}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider">
              {isIndo ? "Pelanggan Baru" : "New Customers"}
            </span>
            <div className="p-2.5 bg-[#A89053]/10 text-[#A89053] rounded-2xl border border-[#A89053]/20">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-sans text-slate-800 tracking-tight">
              +{customerAcquisition} Pax
            </h3>
            <p className="text-xs font-sans font-semibold text-[#A89053] flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+12.5% {isIndo ? "pertumbuhan organik" : "organic growth"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart representation using Tailwind */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-serif font-bold text-[#0F2C59] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#0284C7]" />
              <span>{isIndo ? "Tren Pendapatan Bulanan (Juta IDR)" : "Monthly Revenue Trend (Millions IDR)"}</span>
            </h3>
          </div>

          <div className="h-64 flex items-end justify-between gap-2.5 pt-4">
            {monthlyRevenueData.map((item, idx) => {
              const heightPercent = `${Math.min(100, (item.val / 500) * 100)}%`;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-[#0284C7] font-semibold opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-sky-50 px-1 py-0.5 rounded border border-sky-100">
                    IDR {item.val}M
                  </div>
                  <div 
                    style={{ height: heightPercent }}
                    className="w-full bg-gradient-to-t from-[#0F2C59] to-[#0284C7] rounded-t-lg group-hover:to-[#38BDF8] transition-all shadow-xs"
                  />
                  <span className="text-[10px] font-mono text-slate-400 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination Breakdown Category */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-serif font-bold text-[#0F2C59] flex items-center gap-2">
              <Compass size={18} className="text-[#A89053]" />
              <span>{isIndo ? "Berdasarkan Kategori" : "Revenue by Category"}</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-600">Open Trips (Asia & Japan)</span>
                <span className="font-mono font-bold text-slate-800">45%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-[#0F2C59]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-600">Private Yacht & Phinisi</span>
                <span className="font-mono font-bold text-slate-800">35%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[35%] h-full bg-[#A89053]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-600">Europe Custom Luxury</span>
                <span className="font-mono font-bold text-slate-800">20%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[20%] h-full bg-[#0284C7]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isIndo ? "Konversi WhatsApp" : "WhatsApp Leads"}</span>
              <span className="font-mono font-semibold text-emerald-600">82 Leads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isIndo ? "Konversi Storefront" : "Direct Checkout"}</span>
              <span className="font-mono font-semibold text-[#0F2C59]">66 Bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0F2C59]">
              {isIndo ? "Riwayat Transaksi Terkini" : "Recent Booking Transactions"}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {isIndo ? "Pantau status pembayaran secara real-time." : "Audit status of incoming payments in real-time."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6 font-semibold">Ref ID</th>
                <th className="py-3.5 px-6 font-semibold">Client</th>
                <th className="py-3.5 px-6 font-semibold">Trip / Package</th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Amount</th>
                <th className="py-3.5 px-6 font-semibold">Date</th>
                <th className="py-3.5 px-6 font-semibold">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {SAMPLE_BOOKINGS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-medium text-slate-500">{tx.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{tx.customer}</td>
                  <td className="py-4 px-6 font-medium text-slate-700">{tx.trip}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full ${
                      tx.type === "Private Trip" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-sky-50 text-sky-700 border border-sky-100"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-800">
                    IDR {tx.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                  <td className="py-4 px-6">
                    {tx.status === "completed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                    {tx.status === "pending" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={12} /> Settlement
                      </span>
                    )}
                    {tx.status === "failed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle size={12} /> Expired
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
