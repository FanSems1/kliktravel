"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Save, X, MapPin, Globe, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { translateText } from "@/utils/translator";

export default function AdminDestinationsPage() {
  const { locale } = useLanguage();
  const [regions, setRegions] = useState<RegionDestination[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form active language tab
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);

  // Form states matching RegionDestination structure with dual language support
  const [idField, setIdField] = useState("");
  const [nameIDField, setNameIDField] = useState("");
  const [nameENField, setNameENField] = useState("");
  const [slugField, setSlugField] = useState("");
  const [subtitleIDField, setSubtitleIDField] = useState("");
  const [subtitleENField, setSubtitleENField] = useState("");
  const [gradientField, setGradientField] = useState("from-[#E0F2FE] to-[#7DD3FC]");
  const [subDestinationsList, setSubDestinationsList] = useState<{ name: string; nameEN?: string; slug: string }[]>([]);
  const [newSubName, setNewSubName] = useState("");

  // Load initial list from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("klik_admin_destinations");
      if (saved) {
        setRegions(JSON.parse(saved));
      } else {
        setRegions(localizedRegions[locale] || []);
      }
    } catch {
      setRegions(localizedRegions[locale] || []);
    }
  }, [locale]);

  // Persist regions list to localStorage on changes
  const saveRegionsToStorage = (newList: RegionDestination[]) => {
    setRegions(newList);
    try {
      localStorage.setItem("klik_admin_destinations", JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save destinations to localStorage", err);
    }
  };

  const resetForm = () => {
    setIdField("");
    setNameIDField("");
    setNameENField("");
    setSlugField("");
    setSubtitleIDField("");
    setSubtitleENField("");
    setGradientField("from-[#E0F2FE] to-[#7DD3FC]");
    setSubDestinationsList([]);
    setNewSubName("");
    setIsEditing(false);
    setEditId(null);
    setFormLang("id");
  };

  // Auto-translate handler for the active tab fields
  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    if (formLang === "id") {
      if (nameIDField.trim()) {
        const translatedName = await translateText(nameIDField, "id", "en");
        setNameENField(translatedName);
      }
      if (subtitleIDField.trim()) {
        const translatedSub = await translateText(subtitleIDField, "id", "en");
        setSubtitleENField(translatedSub);
      }
    } else {
      if (nameENField.trim()) {
        const translatedName = await translateText(nameENField, "en", "id");
        setNameIDField(translatedName);
      }
      if (subtitleENField.trim()) {
        const translatedSub = await translateText(subtitleENField, "en", "id");
        setSubtitleIDField(translatedSub);
      }
    }
    setIsTranslating(false);
  };

  const handleAddSubDest = () => {
    if (!newSubName.trim()) return;
    const slug = newSubName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setSubDestinationsList([...subDestinationsList, { name: newSubName, slug }]);
    setNewSubName("");
  };

  const handleRemoveSubDest = (index: number) => {
    setSubDestinationsList(subDestinationsList.filter((_, i) => i !== index));
  };

  const handleEdit = (region: RegionDestination) => {
    setIsEditing(true);
    setEditId(region.id);
    setIdField(region.id);
    setNameIDField(region.name);
    setNameENField(region.nameEN || region.name);
    setSlugField(region.slug);
    setSubtitleIDField(region.subtitle);
    setSubtitleENField(region.subtitleEN || region.subtitle);
    setGradientField(region.featuredImageGradient);
    setSubDestinationsList(region.subDestinations || []);
  };

  const handleDelete = (id: string) => {
    if (confirm(locale === "id" ? "Hapus destinasi ini?" : "Delete this destination?")) {
      const updated = regions.filter(r => r.id !== id);
      saveRegionsToStorage(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameIDField.trim() || !idField.trim()) return;

    const newRegion: RegionDestination = {
      id: idField,
      name: nameIDField,
      nameEN: nameENField || nameIDField,
      slug: slugField || nameIDField.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subtitle: subtitleIDField,
      subtitleEN: subtitleENField || subtitleIDField,
      featuredImageGradient: gradientField,
      subDestinations: subDestinationsList
    };

    let updatedList: RegionDestination[];
    if (editId) {
      updatedList = regions.map(r => r.id === editId ? newRegion : r);
    } else {
      updatedList = [...regions, newRegion];
    }
    saveRegionsToStorage(updatedList);
    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
            Content Manager
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {locale === "id" ? "Destinasi & Wilayah" : "Destinations & Regions"}
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {locale === "id" 
              ? "Kelola nama wilayah utama dan sub-destinasi dengan tab dwi-bahasa (ID / EN)."
              : "Manage main regions & sub-destinations with bilingual tabs (ID / EN)."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100">
            {isEditing 
              ? (locale === "id" ? "Edit Wilayah" : "Edit Region")
              : (locale === "id" ? "Tambah Wilayah Baru" : "Add New Region")}
          </h2>

          <form onSubmit={handleSave} className="space-y-5 font-sans text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                Region ID / Code
              </label>
              <input 
                type="text" 
                required
                value={idField}
                disabled={isEditing}
                onChange={(e) => setIdField(e.target.value.toLowerCase())}
                placeholder="e.g. indonesia, japan, europe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] disabled:opacity-50 text-slate-800"
              />
            </div>

            {/* Language Tab Switcher */}
            <div className="flex border-b border-slate-200 pb-1.5 gap-4 items-center">
              <button
                type="button"
                onClick={() => setFormLang("id")}
                className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                  formLang === "id" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => setFormLang("en")}
                className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                  formLang === "en" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🇬🇧 English
              </button>
              
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || (formLang === "id" ? !nameIDField.trim() : !nameENField.trim())}
                  className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2 py-0.5 rounded hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                >
                  {isTranslating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  <span>{formLang === "id" ? "Translate to EN" : "Translate to ID"}</span>
                </button>
              </div>
            </div>

            {/* Tabbed Content Fields */}
            {formLang === "id" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Region Name (ID)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={nameIDField}
                    onChange={(e) => {
                      setNameIDField(e.target.value);
                      if (!slugField) setSlugField(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }}
                    placeholder="e.g. Indonesia"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Subtitle / Description (ID)
                  </label>
                  <textarea 
                    rows={3}
                    value={subtitleIDField}
                    onChange={(e) => setSubtitleIDField(e.target.value)}
                    placeholder="Deskripsi singkat dalam Bahasa Indonesia..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Region Name (EN)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={nameENField}
                    onChange={(e) => setNameENField(e.target.value)}
                    placeholder="e.g. Indonesia"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Subtitle / Description (EN)
                  </label>
                  <textarea 
                    rows={3}
                    value={subtitleENField}
                    onChange={(e) => setSubtitleENField(e.target.value)}
                    placeholder="Brief description in English..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                Slug (URL)
              </label>
              <input 
                type="text" 
                value={slugField}
                onChange={(e) => setSlugField(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                placeholder="e.g. indonesia"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
              />
            </div>

            {/* Sub Destinations List Manager */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 font-bold">
                Sub Destinations ({subDestinationsList.length})
              </label>

              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Labuan Bajo"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
                <button 
                  type="button" 
                  onClick={handleAddSubDest}
                  className="px-3 rounded-xl bg-slate-200 hover:bg-[#A89053] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {subDestinationsList.map((sub, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px]"
                  >
                    <span>{sub.name}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSubDest(i)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {subDestinationsList.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic">No sub-destinations added yet.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Reset
              </button>
              <button 
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* Regions List Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>{locale === "id" ? "Daftar Wilayah Aktif" : "Active Regions"}</span>
              <span className="text-xs font-mono text-slate-400">{regions.length} Regions</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {regions.map((region) => (
                <div key={region.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded bg-gradient-to-r ${region.featuredImageGradient} border border-slate-200`} />
                      <h3 className="font-serif font-bold text-slate-800 text-sm leading-none">
                        {locale === "id" ? region.name : (region.nameEN || region.name)}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">/{region.slug}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans font-light leading-relaxed max-w-lg">
                      {locale === "id" ? region.subtitle : (region.subtitleEN || region.subtitle)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {region.subDestinations.map((sub, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-500 text-[10px] font-sans">
                          <MapPin size={9} />
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleEdit(region)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-600 border border-slate-200 transition-colors text-slate-600 cursor-pointer"
                      aria-label="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(region.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors text-slate-600 cursor-pointer"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {regions.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic">No regions found. Add one on the left.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
