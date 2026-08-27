"use client";

import React, { useState, useEffect } from "react";
import { Star, Trash2, Plus, MessageSquare, ShieldCheck, ThumbsUp, Sparkles, Loader2, Upload, X, ArrowLeft, Edit3, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/utils/translator";
import { Toast } from "@/components/ui/Toast";
import { uploadMedia, apiFetch } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewID: string;
  reviewEN: string;
  trip: string;
  approved: boolean;
  avatar?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "TEST-01",
    name: "Rian Dewantara",
    role: "Travel Enthusiast",
    rating: 5,
    reviewID: "Pelayanan KlikTravel sangat luar biasa! Itinerary terencana dengan sangat rapi dan hotel bintang 4 di Shinjuku sangat strategis.",
    reviewEN: "KlikTravel's service was outstanding! The itinerary was beautifully planned and the 4★ Shinjuku hotel was extremely strategic.",
    trip: "Tokyo Explorer Open Trip",
    approved: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
  },
  {
    id: "TEST-02",
    name: "Amelia Putri",
    role: "Corporate Executive",
    rating: 5,
    reviewID: "Perjalanan private ke Labuan Bajo sangat berkesan. Seluruh kru ramah dan makanan di phinisi bintang lima!",
    reviewEN: "Our private trip to Labuan Bajo was unforgettable. All crew members were warm and the phinisi food was five-star!",
    trip: "Labuan Bajo Private Phinisi",
    approved: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
  }
];

export default function AdminTestimonialsPage() {
  const { locale } = useLanguage();
  const isIndo = locale === "id";
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Split View & Filtering
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form active language tab switcher
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);

  const [nameField, setNameField] = useState("");
  const [roleField, setRoleField] = useState("");
  const [ratingField, setRatingField] = useState(5);
  const [reviewIDField, setReviewIDField] = useState("");
  const [reviewENField, setReviewENField] = useState("");
  const [tripField, setTripField] = useState("");
  const [avatarField, setAvatarField] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load from localStorage or defaults
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await apiFetch<Testimonial[]>("/admin/testimonials").catch(() => null);
        if (data && Array.isArray(data)) {
          setTestimonials(data);
          localStorage.setItem("klik_admin_testimonials", JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error("Failed to fetch testimonials from API:", err);
      }

      // Fallback to localStorage if API is not accessible
      try {
        const saved = localStorage.getItem("klik_admin_testimonials");
        if (saved) {
          setTestimonials(JSON.parse(saved));
          return;
        }
      } catch {
        // Handle fallback error
      }
      setTestimonials([]);
    }
    loadTestimonials();
  }, []);

  const saveTestimonialsStorage = (newList: Testimonial[]) => {
    setTestimonials(newList);
    try {
      localStorage.setItem("klik_admin_testimonials", JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save testimonials to localStorage", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadMedia(file);
      setAvatarField(uploaded.url);
      setToast({ message: isIndo ? "Avatar berhasil diunggah!" : "Avatar uploaded successfully!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Gagal mengunggah avatar", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    if (formLang === "id") {
      if (reviewIDField.trim()) {
        const translated = await translateText(reviewIDField, "id", "en");
        setReviewENField(translated);
      }
    } else {
      if (reviewENField.trim()) {
        const translated = await translateText(reviewENField, "en", "id");
        setReviewIDField(translated);
      }
    }
    setIsTranslating(false);
  };

  const resetForm = () => {
    setEditingItem(null);
    setNameField("");
    setRoleField("");
    setRatingField(5);
    setReviewIDField("");
    setReviewENField("");
    setTripField("");
    setAvatarField("");
    setFormLang("id");
  };

  const handleOpenAdd = () => {
    resetForm();
    setViewMode("form");
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setNameField(item.name);
    setRoleField(item.role);
    setRatingField(item.rating);
    setReviewIDField(item.reviewID);
    setReviewENField(item.reviewEN);
    setTripField(item.trip);
    setAvatarField(item.avatar || "");
    setFormLang("id");
    setViewMode("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !reviewIDField.trim()) return;

    try {
      if (editingItem) {
        const payload = {
          name: nameField,
          role: roleField || "Happy Traveler",
          rating: ratingField,
          reviewID: reviewIDField,
          reviewEN: reviewENField || reviewIDField,
          trip: tripField || "Custom Trip",
          approved: editingItem.approved,
        };
        const updatedItem = await apiFetch<Testimonial>(`/admin/testimonials/${editingItem.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });

        const updated = testimonials.map(t => t.id === editingItem.id ? { ...t, ...updatedItem } : t);
        saveTestimonialsStorage(updated);
        setToast({ message: isIndo ? "Testimoni berhasil diperbarui!" : "Testimonial updated successfully!", type: "success" });
      } else {
        const payload = {
          name: nameField,
          role: roleField || "Happy Traveler",
          rating: ratingField,
          reviewID: reviewIDField,
          reviewEN: reviewENField || reviewIDField,
          trip: tripField || "Custom Trip",
          approved: true,
        };
        const newItem = await apiFetch<Testimonial>("/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        saveTestimonialsStorage([newItem, ...testimonials]);
        setToast({ message: isIndo ? "Testimoni baru berhasil ditambahkan!" : "New testimonial added successfully!", type: "success" });
      }

      resetForm();
      setViewMode("list");
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || (isIndo ? "Gagal menyimpan testimoni" : "Failed to save testimonial"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(isIndo ? "Hapus ulasan ini?" : "Delete this review?")) {
      try {
        await apiFetch(`/admin/testimonials/${id}`, {
          method: "DELETE"
        });
        const updated = testimonials.filter(t => t.id !== id);
        saveTestimonialsStorage(updated);
        setToast({ message: isIndo ? "Testimoni berhasil dihapus!" : "Testimonial deleted successfully!", type: "success" });
      } catch (err: any) {
        console.error(err);
        setToast({ message: err.message || (isIndo ? "Gagal menghapus testimoni" : "Failed to delete testimonial"), type: "error" });
      }
    }
  };

  const toggleApproval = async (id: string) => {
    const item = testimonials.find(t => t.id === id);
    if (!item) return;
    try {
      const updatedItem = await apiFetch<Testimonial>(`/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: !item.approved })
      });
      const updated = testimonials.map(t => t.id === id ? { ...t, ...updatedItem } : t);
      saveTestimonialsStorage(updated);
      setToast({ message: isIndo ? "Status moderasi berhasil diubah!" : "Moderation status updated!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || (isIndo ? "Gagal mengubah status moderasi" : "Failed to toggle moderation"), type: "error" });
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || 
           t.trip.toLowerCase().includes(q) || 
           t.reviewID.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#A89053] font-bold block mb-1">
            Content & Reputation Manager
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {isIndo ? "Moderasi Testimoni Customer" : "Customer Reviews Moderation"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-sans mt-1">
            {isIndo 
              ? "Kelola ulasan, rating bintang, dan testimoni dwi-bahasa yang ditampilkan di storefront."
              : "Moderate bilingual reviews, star ratings, and testimonials shown on storefront."}
          </p>
        </div>

        {viewMode === "form" ? (
          <button
            onClick={() => { resetForm(); setViewMode("list"); }}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 w-fit"
          >
            <ArrowLeft size={16} />
            <span>{isIndo ? "Kembali ke Daftar Testimoni" : "Back to Testimonial List"}</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-3 px-5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 w-fit shadow-md"
          >
            <Plus size={16} />
            <span>{isIndo ? "Tambah Testimoni Baru" : "Add Testimonial"}</span>
          </button>
        )}
      </div>

      {viewMode === "form" ? (
        /* Full Page Form View */
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-serif font-bold text-[#0F2C59]">
              {editingItem 
                ? (isIndo ? "Edit Ulasan Testimoni" : "Edit Customer Review") 
                : (isIndo ? "Tambah Testimoni Baru" : "Add New Testimonial")}
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
                  placeholder="e.g. Rian Dewantara"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Role / Status
                </label>
                <input 
                  type="text" 
                  value={roleField}
                  onChange={(e) => setRoleField(e.target.value)}
                  placeholder="e.g. Corporate Executive"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trip Package Name
                </label>
                <input 
                  type="text" 
                  value={tripField}
                  onChange={(e) => setTripField(e.target.value)}
                  placeholder="e.g. Tokyo Explorer Open Trip"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Star Rating (1 - 5) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="5"
                  required
                  value={ratingField}
                  onChange={(e) => setRatingField(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            {/* Avatar Photo Input is hidden since backend DTO validation forbids 'avatar' property */}

            {/* Language Tab Switcher */}
            <div className="flex border-b border-slate-200 pb-2 gap-4 items-center pt-2">
              <button
                type="button"
                onClick={() => setFormLang("id")}
                className={`pb-1 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                  formLang === "id" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => setFormLang("en")}
                className={`pb-1 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                  formLang === "en" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🇬🇧 English
              </button>
              
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || (formLang === "id" ? !reviewIDField.trim() : !reviewENField.trim())}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase bg-[#A89053] text-white px-3 py-1 rounded-lg hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold shadow-sm"
                >
                  {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>{formLang === "id" ? "Translate to EN" : "Translate to ID"}</span>
                </button>
              </div>
            </div>

            {/* Tabbed Multilingual Fields */}
            {formLang === "id" ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Review Text (ID) <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  required
                  value={reviewIDField}
                  onChange={(e) => setReviewIDField(e.target.value)}
                  placeholder="Tulis ulasan customer dalam Bahasa Indonesia..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Review Text (EN)
                </label>
                <textarea 
                  rows={4}
                  value={reviewENField}
                  onChange={(e) => setReviewENField(e.target.value)}
                  placeholder="Review in English..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            )}

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
                className="bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold shadow-md transition-colors cursor-pointer"
              >
                {editingItem ? (isIndo ? "Simpan Perubahan" : "Save Changes") : (isIndo ? "Simpan Testimoni" : "Save Testimonial")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List View with Search */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] flex items-center gap-2">
              <MessageSquare size={18} className="text-[#0284C7]" />
              <span>{isIndo ? "Daftar Testimoni Terverifikasi" : "Moderated Testimonials"}</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-1">
                {filteredTestimonials.length}
              </span>
            </h2>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder={isIndo ? "Cari nama client / trip..." : "Search client or trip..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 md:p-6 divide-y divide-slate-100">
            {filteredTestimonials.map((test) => (
              <div key={test.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-50 shadow-xs">
                    {test.avatar ? (
                      <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0F2C59] to-[#0284C7] text-white flex items-center justify-center font-bold text-base">
                        {test.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-slate-800 text-sm md:text-base">{test.name}</h3>
                      <span className="text-xs text-slate-400 font-sans">({test.role})</span>
                      <span className="text-[10px] font-mono uppercase bg-sky-50 text-[#0284C7] font-semibold px-2 py-0.5 rounded-full border border-sky-100">
                        {test.trip}
                      </span>
                    </div>

                    {/* Star Rating Preview */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 font-sans leading-relaxed max-w-2xl bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      "{isIndo ? test.reviewID : test.reviewEN}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0">
                  <button 
                    onClick={() => toggleApproval(test.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      test.approved 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                    title={test.approved ? "Approved (Live)" : "Unapproved (Hidden)"}
                  >
                    <ShieldCheck size={14} />
                    <span>{test.approved ? (isIndo ? "Aktif" : "Approved") : (isIndo ? "Sembunyi" : "Hidden")}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleOpenEdit(test)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200 transition-colors text-slate-600 cursor-pointer"
                    title={isIndo ? "Edit Testimoni" : "Edit Testimonial"}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button 
                    onClick={() => handleDelete(test.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors text-slate-600 cursor-pointer"
                    title={isIndo ? "Hapus Testimoni" : "Delete Testimonial"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredTestimonials.length === 0 && (
              <div className="py-12 text-center text-slate-400 italic space-y-2">
                <MessageSquare size={32} className="mx-auto text-slate-300" />
                <p className="font-sans text-xs">{isIndo ? "Tidak ada testimoni yang cocok." : "No testimonials found."}</p>
              </div>
            )}
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

