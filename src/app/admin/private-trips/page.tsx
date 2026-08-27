"use client";

import React, { useState, useEffect } from "react";
import { Ship, Plus, Trash2, Edit3, MessageSquare, CheckCircle2, Clock, Calendar, Users, Phone, Sparkles, Loader2, ArrowLeft, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/utils/translator";
import { Toast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api";

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
  const isIndo = locale === "id";
  const [inquiries, setInquiries] = useState<PrivateTripInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Split View & Filter States
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<PrivateTripInquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"ALL" | "new" | "contacted" | "closed">("ALL");

  // Form Fields
  const [nameField, setNameField] = useState("");
  const [phoneField, setPhoneField] = useState("");
  const [destField, setDestField] = useState("");
  const [datesField, setDatesField] = useState("");
  const [guestsField, setGuestsField] = useState("");
  const [budgetField, setBudgetField] = useState("");
  const [notesField, setNotesField] = useState("");
  const [notesENField, setNotesENField] = useState("");
  const [statusField, setStatusField] = useState<"new" | "contacted" | "closed">("new");

  // Load inquiries from API (with localStorage + defaults fallback)
  useEffect(() => {
    async function loadInquiries() {
      setIsLoading(true);
      try {
        const data = await apiFetch<any[]>("/admin/private-trips");
        if (data && Array.isArray(data)) {
          const normalized: PrivateTripInquiry[] = data.map((item: any) => ({
            id: item.id,
            name: item.name || "",
            phone: item.phone || "",
            destination: item.destination || "",
            dates: item.dates || "",
            guests: item.guests || "",
            budget: item.budget || "",
            notes: item.notes || "",
            notesEN: item.notesEN || "",
            status: (item.status?.toLowerCase() || "new") as "new" | "contacted" | "closed",
            timestamp: item.createdAt || item.timestamp
          }));
          setInquiries(normalized);
          localStorage.setItem("klik_private_trip_inquiries", JSON.stringify(normalized));
          return;
        }
      } catch (err) {
        console.error("Failed to fetch private trips from API:", err);
      } finally {
        setIsLoading(false);
      }

      // Fallback
      try {
        const saved = localStorage.getItem("klik_private_trip_inquiries");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInquiries(parsed);
          } else {
            setInquiries(DEFAULT_INQUIRIES);
          }
        } else {
          setInquiries(DEFAULT_INQUIRIES);
        }
      } catch {
        setInquiries(DEFAULT_INQUIRIES);
      }
    }

    loadInquiries();
  }, []);

  const formatIDR = (value: string): string => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    return Number(clean).toLocaleString("id-ID");
  };

  const saveInquiriesStorage = (newList: PrivateTripInquiry[]) => {
    setInquiries(newList);
    try {
      localStorage.setItem("klik_private_trip_inquiries", JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save inquiries to localStorage", err);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setNameField("");
    setPhoneField("");
    setDestField("");
    setDatesField("");
    setGuestsField("");
    setBudgetField("");
    setNotesField("");
    setNotesENField("");
    setStatusField("new");
  };

  const handleOpenAdd = () => {
    resetForm();
    setViewMode("form");
  };

  const handleOpenEdit = (inq: PrivateTripInquiry) => {
    setEditingItem(inq);
    setNameField(inq.name);
    setPhoneField(inq.phone);
    setDestField(inq.destination);
    setDatesField(inq.dates);
    setGuestsField(inq.guests);
    setBudgetField(inq.budget);
    setNotesField(inq.notes);
    setNotesENField(inq.notesEN || "");
    setStatusField(inq.status);
    setViewMode("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !destField.trim()) return;

    setIsSaving(true);
    try {
      if (editingItem) {
        const payload = {
          name: nameField,
          phone: phoneField,
          destination: destField,
          dates: datesField,
          guests: guestsField,
          budget: budgetField,
          notes: notesField,
          status: statusField.toUpperCase()
        };

        const updatedItem = await apiFetch<any>(`/admin/private-trips/${editingItem.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        }).catch(() => null);

        const updated = inquiries.map(item => item.id === editingItem.id ? {
          ...item,
          name: nameField,
          phone: phoneField,
          destination: destField,
          dates: datesField,
          guests: guestsField,
          budget: budgetField,
          notes: notesField,
          notesEN: notesENField,
          status: statusField,
          ...(updatedItem ? {
            status: (updatedItem.status?.toLowerCase() || statusField) as "new" | "contacted" | "closed"
          } : {})
        } : item);

        saveInquiriesStorage(updated);
        setToast({ message: isIndo ? "Permintaan private trip berhasil diperbarui!" : "Trip inquiry updated successfully!", type: "success" });
      } else {
        const payload = {
          name: nameField,
          phone: phoneField,
          destination: destField,
          dates: datesField,
          guests: guestsField,
          budget: budgetField,
          notes: notesField
        };

        const newItem = await apiFetch<any>("/private-trip-requests", {
          method: "POST",
          body: JSON.stringify(payload)
        }).catch(() => null);

        const newInquiry: PrivateTripInquiry = newItem ? {
          id: newItem.id || `PT-${Date.now().toString().slice(-4)}`,
          name: newItem.name || nameField,
          phone: newItem.phone || phoneField,
          destination: newItem.destination || destField,
          dates: newItem.dates || datesField,
          guests: newItem.guests || guestsField,
          budget: newItem.budget || budgetField,
          notes: newItem.notes || notesField,
          notesEN: notesENField,
          status: (newItem.status?.toLowerCase() || statusField) as "new" | "contacted" | "closed"
        } : {
          id: `PT-${Date.now().toString().slice(-4)}`,
          name: nameField,
          phone: phoneField,
          destination: destField,
          dates: datesField,
          guests: guestsField,
          budget: budgetField,
          notes: notesField,
          notesEN: notesENField,
          status: statusField
        };

        saveInquiriesStorage([newInquiry, ...inquiries]);
        setToast({ message: isIndo ? "Permintaan baru berhasil dicatat!" : "New trip inquiry recorded successfully!", type: "success" });
      }

      resetForm();
      setViewMode("list");
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || (isIndo ? "Gagal menyimpan permintaan" : "Failed to save inquiry"), type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id: string) => {
    const inq = inquiries.find(item => item.id === id);
    if (!inq) return;

    const nextStatus: "new" | "contacted" | "closed" = 
      inq.status === "new" ? "contacted" : inq.status === "contacted" ? "closed" : "new";

    try {
      await apiFetch<any>(`/admin/private-trips/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus.toUpperCase() })
      }).catch(() => null);

      const updated = inquiries.map(item => item.id === id ? { ...item, status: nextStatus } : item);
      saveInquiriesStorage(updated);
      setToast({
        message: isIndo ? `Status diubah menjadi ${nextStatus}` : `Status updated to ${nextStatus}`,
        type: "success"
      });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || (isIndo ? "Gagal mengubah status" : "Failed to update status"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(isIndo ? "Hapus permintaan ini?" : "Delete this inquiry?")) {
      try {
        await apiFetch(`/admin/private-trips/${id}`, {
          method: "DELETE"
        }).catch(() => null);

        const updated = inquiries.filter(i => i.id !== id);
        saveInquiriesStorage(updated);
        setToast({
          message: isIndo ? "Permintaan berhasil dihapus" : "Inquiry deleted successfully",
          type: "success"
        });
      } catch (err: any) {
        console.error(err);
        setToast({ message: err.message || (isIndo ? "Gagal menghapus permintaan" : "Failed to delete inquiry"), type: "error" });
      }
    }
  };

  const handleAutoTranslateNotes = async (inq: PrivateTripInquiry) => {
    if (!inq.notes.trim()) return;
    setTranslatingId(inq.id);
    const translated = await translateText(inq.notes, "id", "en");
    const updated = inquiries.map(item => item.id === inq.id ? { ...item, notesEN: translated } : item);
    saveInquiriesStorage(updated);
    setTranslatingId(null);
    setToast({
      message: isIndo ? "Catatan berhasil diterjemahkan" : "Notes translated successfully",
      type: "success"
    });
  };

  const handleFormTranslate = async () => {
    if (!notesField.trim()) return;
    setTranslatingId("FORM");
    try {
      const translated = await translateText(notesField, "id", "en");
      setNotesENField(translated);
      setToast({ message: isIndo ? "Berhasil menerjemahkan catatan!" : "Successfully translated notes!", type: "success" });
    } catch {
      setToast({ message: "Failed to translate notes", type: "error" });
    } finally {
      setTranslatingId(null);
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = inq.name.toLowerCase().includes(q) || 
                          inq.destination.toLowerCase().includes(q) || 
                          inq.phone.includes(q);
    const matchesStatus = statusTab === "ALL" || inq.status === statusTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      {viewMode === "list" ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
              Content & Lead Manager
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
              {isIndo ? "Private Trip & Konsultasi" : "Private Trip Consultations"}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {isIndo 
                ? "Kelola preferensi rute kustom, grup privat, dan konsultasi pelanggan secara real-time."
                : "Manage bespoke route preferences, private groups, and customer requests in real-time."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => { resetForm(); setViewMode("list"); }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0F2C59] font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{isIndo ? "Kembali ke Daftar Permintaan" : "Back to Inquiries List"}</span>
          </button>
          <div>
            <span className="text-[10px] font-mono bg-[#A89053]/15 text-[#A89053] px-2 py-0.5 rounded font-bold uppercase block text-center">
              {editingItem ? (isIndo ? "Edit Permintaan Custom" : "Edit Private Trip") : (isIndo ? "Catat Permintaan Baru" : "Add Private Trip")}
            </span>
          </div>
        </div>
      )}

      {viewMode === "form" ? (
        /* Full Page Form View */
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-serif font-bold text-[#0F2C59]">
              {editingItem 
                ? (isIndo ? "Edit Detail Permintaan Custom" : "Edit Private Trip Inquiry") 
                : (isIndo ? "Catat Permintaan Private Baru" : "Record New Private Inquiry")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value)}
                  placeholder="e.g. Bambang Soetjipto"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp / Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={phoneField}
                  onChange={(e) => setPhoneField(e.target.value)}
                  placeholder="e.g. +62 812 3456 7890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Destination <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={destField}
                onChange={(e) => setDestField(e.target.value)}
                placeholder="e.g. Labuan Bajo Private Luxury Yacht"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Dates
                </label>
                <input 
                  type="text" 
                  value={datesField}
                  onChange={(e) => setDatesField(e.target.value)}
                  placeholder="e.g. 15 — 20 Okt 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Number of Guests
                </label>
                <input 
                  type="text" 
                  value={guestsField}
                  onChange={(e) => setGuestsField(e.target.value)}
                  placeholder="e.g. 8 Adults, 2 Children"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Estimated Budget
                </label>
                <input 
                  type="text" 
                  value={budgetField}
                  onChange={(e) => setBudgetField(formatIDR(e.target.value))}
                  placeholder="e.g. 150.000.000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Special Notes / Requests (ID)
                  </label>
                  <button
                    type="button"
                    onClick={handleFormTranslate}
                    disabled={translatingId === "FORM" || !notesField.trim()}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-[#A89053] text-white px-2 py-0.5 rounded hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                  >
                    {translatingId === "FORM" ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    <span>Translate to EN</span>
                  </button>
                </div>
                <textarea 
                  rows={3}
                  value={notesField}
                  onChange={(e) => setNotesField(e.target.value)}
                  placeholder="Membutuhkan chef pribadi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Special Notes / Requests (EN)
                </label>
                <textarea 
                  rows={3}
                  value={notesENField}
                  onChange={(e) => setNotesENField(e.target.value)}
                  placeholder="Requires a private chef..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Status Inquiry
              </label>
              <select
                value={statusField}
                onChange={(e) => setStatusField(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50 font-bold"
              >
                <option value="new">🆕 NEW / UNREAD</option>
                <option value="contacted">📞 CONTACTED / NEGOTIATING</option>
                <option value="closed">✅ CLOSED / DEAL</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { resetForm(); setViewMode("list"); }}
                className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isIndo ? "Batal" : "Cancel"}
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold shadow-md transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 size={12} className="animate-spin text-white" />}
                <span>{editingItem ? (isIndo ? "Simpan Perubahan" : "Save Changes") : (isIndo ? "Simpan Permintaan" : "Save Inquiry")}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List View with Filters */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(["ALL", "new", "contacted", "closed"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusTab === tab
                      ? tab === "new"
                        ? "bg-amber-500 text-white shadow-sm"
                        : tab === "contacted"
                        ? "bg-[#0284C7] text-white shadow-sm"
                        : tab === "closed"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-[#0F2C59] text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {tab === "ALL" && (isIndo ? "Semua Permintaan" : "All Leads")}
                  {tab === "new" && (isIndo ? "Baru" : "New")}
                  {tab === "contacted" && (isIndo ? "Dihubungi" : "Contacted")}
                  {tab === "closed" && (isIndo ? "Selesai" : "Closed")}
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full ml-1.5 font-sans">
                    {tab === "ALL" 
                      ? inquiries.length 
                      : inquiries.filter(x => x.status === tab).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64 shrink-0">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder={isIndo ? "Cari nama client / rute..." : "Search client or route..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#A89053] focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-2.5 px-4 rounded-xl font-sans text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 w-full sm:w-auto shadow-sm"
              >
                <Plus size={14} />
                <span>{isIndo ? "Catat Permintaan Baru" : "Add Inquiry"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredInquiries.map((inq) => (
              <div 
                key={inq.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-[#A89053] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 uppercase">
                      {inq.id}
                    </span>
                    <h3 className="font-serif font-bold text-slate-800 text-base">{inq.name}</h3>
                    <a 
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0284C7] hover:underline"
                    >
                      <Phone size={13} className="text-[#A89053]" /> {inq.phone}
                    </a>
                  </div>

                  <p className="text-xs md:text-sm font-sans text-slate-700 font-semibold flex items-center gap-2">
                    <Ship size={14} className="text-[#A89053] shrink-0" />
                    <span>{inq.destination}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-sans flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {inq.dates}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {inq.guests}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                      Budget: {inq.budget}
                    </span>
                  </div>

                  {inq.notes && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 max-w-3xl space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Catatan Pelanggan / Special Request</span>
                        <button
                          type="button"
                          onClick={() => handleAutoTranslateNotes(inq)}
                          disabled={translatingId === inq.id}
                          className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2 py-0.5 rounded hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                        >
                          {translatingId === inq.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          <span>Translate EN</span>
                        </button>
                      </div>
                      <p className="text-xs font-sans text-slate-700 italic">
                        "{inq.notes}"
                      </p>
                      {inq.notesEN && (
                        <p className="text-xs font-sans text-slate-500 italic border-t border-slate-200/40 pt-2 mt-2">
                          <span className="font-mono font-bold text-[#A89053] text-[9px] not-italic mr-1">EN:</span>
                          "{inq.notesEN}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => toggleStatus(inq.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                      inq.status === "new"
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : inq.status === "contacted"
                        ? "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    Status: {inq.status}
                  </button>

                  <button 
                    onClick={() => handleOpenEdit(inq)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200 transition-colors text-slate-600 cursor-pointer"
                    title={isIndo ? "Edit Permintaan" : "Edit Inquiry"}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            
            {isLoading ? (
              <div className="py-12 text-center text-slate-400 italic space-y-2 bg-white rounded-2xl border border-slate-200/80">
                <Loader2 size={32} className="mx-auto text-[#0F2C59] animate-spin" />
                <p className="font-sans text-xs">{isIndo ? "Memuat data..." : "Loading inquiries..."}</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic space-y-2 bg-white rounded-2xl border border-slate-200/80">
                <Ship size={32} className="mx-auto text-slate-300 animate-pulse" />
                <p className="font-sans text-xs">{isIndo ? "Tidak ada permintaan private trip." : "No custom trip requests found."}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

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
