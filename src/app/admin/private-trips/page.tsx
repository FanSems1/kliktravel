"use client";

import React, { useState, useEffect } from "react";
import { Ship, Plus, Trash2, Edit3, MessageSquare, CheckCircle2, Clock, Calendar, Users, Phone, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/utils/translator";

interface PrivateTripInquiry {
  id: string;
  name: string;
  phone: string;
  destination: string;
  dates: string;
  guests: string;
  budget: string;
  notes: string;
  notesEN?: string;
  status: "new" | "contacted" | "closed";
  timestamp?: string;
}

const DEFAULT_INQUIRIES: PrivateTripInquiry[] = [
  {
    id: "PT-101",
    name: "Bambang Soetjipto",
    phone: "+62 812 3456 7890",
    destination: "Labuan Bajo Private Luxury Yacht",
    dates: "15 — 20 Okt 2026",
    guests: "8 Adults, 2 Children",
    budget: "IDR 150.000.000",
    notes: "Membutuhkan chef pribadi untuk seafood & dinner di pantai sepi.",
    notesEN: "Requires a private chef for seafood & dinner on a secluded beach.",
    status: "new",
  },
  {
    id: "PT-102",
    name: "Siska & Family",
    phone: "+62 817 9988 7766",
    destination: "Switzerland & Italian Lakes Custom",
    dates: "01 — 12 Des 2026",
    guests: "4 Pax (VVIP)",
    budget: "IDR 300.000.000",
    notes: "Custom itinerary kustomisasi hotel bintang 5 & helikopter tour.",
    notesEN: "Custom itinerary with 5-star hotel customization & helicopter tour.",
    status: "contacted",
  },
];

export default function AdminPrivateTripsPage() {
  const { locale } = useLanguage();
  const [inquiries, setInquiries] = useState<PrivateTripInquiry[]>([]);
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  // Load inquiries from localStorage + defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem("klik_private_trip_inquiries");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with DEFAULT_INQUIRIES if empty or prepend new ones
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Avoid duplicate default entries by checking ID
          const existingIds = new Set(parsed.map((p: PrivateTripInquiry) => p.id));
          const missingDefaults = DEFAULT_INQUIRIES.filter(d => !existingIds.has(d.id));
          setInquiries([...parsed, ...missingDefaults]);
        } else {
          setInquiries(DEFAULT_INQUIRIES);
        }
      } else {
        setInquiries(DEFAULT_INQUIRIES);
      }
    } catch {
      setInquiries(DEFAULT_INQUIRIES);
    }
  }, []);

  const saveInquiriesStorage = (newList: PrivateTripInquiry[]) => {
    setInquiries(newList);
    try {
      localStorage.setItem("klik_private_trip_inquiries", JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save inquiries to localStorage", err);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        const nextStatus: "new" | "contacted" | "closed" = 
          inq.status === "new" ? "contacted" : inq.status === "contacted" ? "closed" : "new";
        return { ...inq, status: nextStatus };
      }
      return inq;
    });
    saveInquiriesStorage(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm(locale === "id" ? "Hapus permintaan ini?" : "Delete this inquiry?")) {
      const updated = inquiries.filter(i => i.id !== id);
      saveInquiriesStorage(updated);
    }
  };

  const handleAutoTranslateNotes = async (inq: PrivateTripInquiry) => {
    if (!inq.notes.trim()) return;
    setTranslatingId(inq.id);
    const translated = await translateText(inq.notes, "id", "en");
    const updated = inquiries.map(item => item.id === inq.id ? { ...item, notesEN: translated } : item);
    saveInquiriesStorage(updated);
    setTranslatingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
          Content & Lead Manager
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
          {locale === "id" ? "Private Trip & Konsultasi (Auto-Translate)" : "Private Trip Consultations (Auto-Translate)"}
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          {locale === "id" 
            ? "Kelola preferensi rute kustom, grup privat, dan konsultasi pelanggan secara real-time."
            : "Manage bespoke route preferences, private groups, and customer requests in real-time."}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>{locale === "id" ? "Permintaan Custom Trip Masuk" : "Incoming Custom Trip Inquiries"}</span>
          <span className="text-xs font-mono text-slate-400">{inquiries.length} Requests</span>
        </h2>

        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div 
              key={inq.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#A89053] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{inq.id}</span>
                  <h3 className="font-serif font-bold text-slate-800 text-base">{inq.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0F2C59]">
                    <Phone size={12} className="text-[#A89053]" /> {inq.phone}
                  </span>
                </div>

                <p className="text-xs font-sans text-slate-700 font-semibold flex items-center gap-2">
                  <Ship size={14} className="text-[#A89053]" />
                  <span>{inq.destination}</span>
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-sans flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {inq.dates}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {inq.guests}
                  </span>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Budget: {inq.budget}
                  </span>
                </div>

                {inq.notes && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 max-w-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Catatan Pelanggan / Special Request</span>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateNotes(inq)}
                        disabled={translatingId === inq.id}
                        className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2 py-0.5 rounded hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {translatingId === inq.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        <span>Translate EN</span>
                      </button>
                    </div>
                    <p className="text-xs font-sans text-slate-700 italic">
                      "{inq.notes}"
                    </p>
                    {inq.notesEN && (
                      <p className="text-xs font-sans text-slate-500 italic border-t border-slate-100 pt-1.5 mt-1">
                        <span className="font-mono font-bold text-[#A89053] text-[9px] not-italic mr-1">EN:</span>
                        "{inq.notesEN}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => toggleStatus(inq.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                    inq.status === "new"
                      ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                      : inq.status === "contacted"
                      ? "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200"
                      : "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200"
                  }`}
                >
                  Status: {inq.status}
                </button>

                <button
                  onClick={() => handleDelete(inq.id)}
                  className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && (
            <div className="py-8 text-center text-slate-400 italic">No private trip requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
