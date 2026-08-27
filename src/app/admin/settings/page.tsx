"use client";

import React, { useState } from "react";
import { Settings, Save, Globe, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSettingsPage() {
  const { locale, setLocale } = useLanguage();

  const [siteName, setSiteName] = useState("KlikTravel.ID");
  const [whatsapp, setWhatsapp] = useState("+62 812-3001-1027");
  const [email, setEmail] = useState("info@kliktravel.id");
  const [instagram, setInstagram] = useState("@kliktravelid");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
          System Preferences
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
          {locale === "id" ? "Pengaturan Website & Kontak" : "Website & Contact Settings"}
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          {locale === "id" 
            ? "Kelola preferensi kontak WhatsApp, link sosial media, dan bahasa default."
            : "Manage WhatsApp contact parameters, social media links, and default language settings."}
        </p>
      </div>

      <div className="max-w-3xl bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-sans font-bold">
            ✓ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 font-sans text-xs">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100 mb-4">
              Website Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                  Brand Name
                </label>
                <input 
                  type="text" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                  Active Language Mode
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setLocale("id")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                      locale === "id" ? "bg-[#0F2C59] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    ID (Bahasa Indonesia)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                      locale === "en" ? "bg-[#0F2C59] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    EN (English)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100 mb-4">
              Contact & Social Channels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                  Support Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save size={14} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
