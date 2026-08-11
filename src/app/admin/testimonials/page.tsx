"use client";

import React, { useState } from "react";
import { Star, Trash2, Plus, MessageSquare, ShieldCheck, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewID: string;
  reviewEN: string;
  trip: string;
  approved: boolean;
}

export default function AdminTestimonialsPage() {
  const { locale } = useLanguage();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "TEST-01",
      name: "Rian Dewantara",
      role: "Travel Enthusiast",
      rating: 5,
      reviewID: "Pelayanan KlikTravel sangat luar biasa! Itinerary terencana dengan sangat rapi dan hotel bintang 4 di Shinjuku sangat strategis.",
      reviewEN: "KlikTravel's service was outstanding! The itinerary was beautifully planned and the 4★ Shinjuku hotel was extremely strategic.",
      trip: "Tokyo Explorer Open Trip",
      approved: true
    },
    {
      id: "TEST-02",
      name: "Amelia Putri",
      role: "Corporate Executive",
      rating: 5,
      reviewID: "Perjalanan private ke Labuan Bajo sangat berkesan. Seluruh kru ramah dan makanan di phinisi bintang lima!",
      reviewEN: "Our private trip to Labuan Bajo was unforgettable. All crew members were warm and the phinisi food was five-star!",
      trip: "Labuan Bajo Private Phinisi",
      approved: true
    }
  ]);

  const [nameField, setNameField] = useState("");
  const [roleField, setRoleField] = useState("");
  const [ratingField, setRatingField] = useState(5);
  const [reviewIDField, setReviewIDField] = useState("");
  const [reviewENField, setReviewENField] = useState("");
  const [tripField, setTripField] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim() || !reviewIDField.trim()) return;

    const newTestimonial: Testimonial = {
      id: `TEST-${Date.now()}`,
      name: nameField,
      role: roleField || "Happy Traveler",
      rating: ratingField,
      reviewID: reviewIDField,
      reviewEN: reviewENField || reviewIDField,
      trip: tripField || "Custom Trip",
      approved: true
    };

    setTestimonials([...testimonials, newTestimonial]);
    setNameField("");
    setRoleField("");
    setRatingField(5);
    setReviewIDField("");
    setReviewENField("");
    setTripField("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const toggleApproval = (id: string) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
          Content & Reputation Manager
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
          {locale === "id" ? "Moderasi Testimoni Customer" : "Customer Reviews Moderation"}
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          {locale === "id" 
            ? "Kelola ulasan, bintang rating, dan testimoni yang ditampilkan di homepage."
            : "Moderate reviews, star ratings, and testimonials shown on the homepage."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100">
            {locale === "id" ? "Tambah Testimoni Baru" : "Add New Testimonial"}
          </h2>

          <form onSubmit={handleAdd} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Client Name
                </label>
                <input 
                  type="text" 
                  required
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value)}
                  placeholder="e.g. Rian Dewantara"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#A89053]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Role / Description
                </label>
                <input 
                  type="text" 
                  value={roleField}
                  onChange={(e) => setRoleField(e.target.value)}
                  placeholder="e.g. Travel Blogger"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#A89053]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Trip Name
                </label>
                <input 
                  type="text" 
                  value={tripField}
                  onChange={(e) => setTripField(e.target.value)}
                  placeholder="e.g. Tokyo Open Trip"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#A89053]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Star Rating (1 - 5)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="5"
                  required
                  value={ratingField}
                  onChange={(e) => setRatingField(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                Review (Indonesian)
              </label>
              <textarea 
                rows={3}
                required
                value={reviewIDField}
                onChange={(e) => setReviewIDField(e.target.value)}
                placeholder="Tulis ulasan customer dalam Bahasa Indonesia..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#A89053]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                Review (English)
              </label>
              <textarea 
                rows={3}
                value={reviewENField}
                onChange={(e) => setReviewENField(e.target.value)}
                placeholder="Review in English..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#A89053]"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              Add Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>{locale === "id" ? "Ulasan Pelanggan Aktif" : "Moderated Testimonials"}</span>
              <span className="text-xs font-mono text-slate-400">{testimonials.length} Testimonials</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {testimonials.map((test) => (
                <div key={test.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-slate-800 text-sm">{test.name}</h3>
                      <span className="text-[10px] text-slate-400 font-sans">({test.role})</span>
                      <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {test.trip}
                      </span>
                    </div>

                    {/* Star Rating Preview */}
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-500" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 font-sans font-light leading-relaxed max-w-xl">
                      "{locale === "id" ? test.reviewID : test.reviewEN}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => toggleApproval(test.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        test.approved 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                      title={test.approved ? "Approved (Live)" : "Unapproved (Hidden)"}
                    >
                      <ShieldCheck size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(test.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors text-slate-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic">No testimonials found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
