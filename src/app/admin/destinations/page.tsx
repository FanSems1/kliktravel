"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, MapPin, Globe, Sparkles, Loader2, Save, X, Image as ImageIcon, Upload, ArrowLeft, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RegionDestination } from "@/data/destinations";
import { translateText } from "@/utils/translator";
import { apiFetch, uploadMedia } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";

export default function AdminDestinationsPage() {
  const { locale } = useLanguage();
  const [regions, setRegions] = useState<RegionDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // View state separating List vs Form
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload loading states
  const [isUploadingRegion, setIsUploadingRegion] = useState(false);
  const [isUploadingSub, setIsUploadingSub] = useState(false);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editRegionId, setEditRegionId] = useState<string | null>(null);
  const [idField, setIdField] = useState("");
  const [slugField, setSlugField] = useState("");
  const [nameIDField, setNameIDField] = useState("");
  const [nameENField, setNameENField] = useState("");
  const [subtitleIDField, setSubtitleIDField] = useState("");
  const [subtitleENField, setSubtitleENField] = useState("");
  const [gradientField, setGradientField] = useState("from-[#E0F2FE] to-[#7DD3FC]");
  const [regionImageField, setRegionImageField] = useState("");
  const [statusField, setStatusField] = useState<"active" | "draft" | "inactive">("active");

  // Sub-destinations state list
  const [subDestinationsList, setSubDestinationsList] = useState<{
    name: string;
    nameEN?: string;
    slug: string;
    image?: string;
  }[]>([]);

  const [newSubNameID, setNewSubNameID] = useState("");
  const [newSubNameEN, setNewSubNameEN] = useState("");
  const [newSubSlug, setNewSubSlug] = useState("");
  const [newSubImage, setNewSubImage] = useState("");

  // Tab switch for bilingual form
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);

  // Fetch Regions from Backend API
  const fetchRegions = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any[]>("/admin/destinations");
      const mapped: RegionDestination[] = data.map((r) => {
        let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
        let image = "";
        if (gradient.includes("||")) {
          const parts = gradient.split("||");
          gradient = parts[0];
          image = parts[1];
        }

        const subDestinations = (r.subDestinations || []).map((s: any) => {
          let subNameEn = s.nameEn || s.nameId;
          let subImage = "";
          if (subNameEn.includes("||")) {
            const parts = subNameEn.split("||");
            subNameEn = parts[0];
            subImage = parts[1];
          }
          const activeSubName = locale === "en" ? subNameEn : s.nameId;
          return {
            name: activeSubName,
            nameEN: subNameEn,
            slug: s.slug,
            image: subImage
          };
        });

        const activeName = locale === "en" ? (r.nameEn || r.nameId) : r.nameId;
        // Clean nameEn for frontend usage
        let cleanedNameEn = r.nameEn || r.nameId;
        if (cleanedNameEn.includes("||")) {
          cleanedNameEn = cleanedNameEn.split("||")[0];
        }

        return {
          id: r.id,
          key: r.key || r.slug || r.id,
          name: activeName.includes("||") ? activeName.split("||")[0] : activeName,
          nameEN: cleanedNameEn,
          slug: r.slug,
          subtitle: locale === "en" ? (r.subtitleEn || r.subtitleId) : r.subtitleId,
          subtitleEN: r.subtitleEn || r.subtitleId,
          featuredImageGradient: gradient,
          image: image,
          status: r.status || "active",
          subDestinations: subDestinations,
        };
      });

      setRegions(mapped);
      // Synchronize cleaned regions with localStorage for storefront fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("klik_admin_regions", JSON.stringify(mapped));
      }
    } catch (err: any) {
      console.error("Error loading destinations:", err);
      setErrorMsg("Gagal memuat data dari server database.");
      setToast({ message: "Gagal memuat data dari server.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, [locale]);

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    loadingSetter?: (loading: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (loadingSetter) loadingSetter(true);
    try {
      const uploaded = await uploadMedia(file);
      setter(uploaded.url);
      setToast({ message: "Gambar berhasil diunggah!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Gagal mengunggah gambar.", type: "error" });
    } finally {
      if (loadingSetter) loadingSetter(false);
    }
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
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
    } catch (err) {
      console.error("Translation error", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const resetForm = () => {
    setIdField("");
    setSlugField("");
    setNameIDField("");
    setNameENField("");
    setSubtitleIDField("");
    setSubtitleENField("");
    setGradientField("from-[#E0F2FE] to-[#7DD3FC]");
    setRegionImageField("");
    setStatusField("active");
    setSubDestinationsList([]);
    setNewSubNameID("");
    setNewSubNameEN("");
    setNewSubSlug("");
    setNewSubImage("");
    setIsEditing(false);
    setEditRegionId(null);
    setFormLang("id");
    setViewMode("list");
  };

  const handleAddSubDest = () => {
    if (!newSubNameID.trim()) return;
    const computedSlug = newSubSlug.trim()
      ? newSubSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : newSubNameID.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    setSubDestinationsList([
      ...subDestinationsList,
      {
        name: newSubNameID.trim(),
        nameEN: newSubNameEN.trim() || newSubNameID.trim(),
        slug: computedSlug,
        image: newSubImage.trim(),
      },
    ]);
    setNewSubNameID("");
    setNewSubNameEN("");
    setNewSubSlug("");
    setNewSubImage("");
  };

  const handleRemoveSubDest = (index: number) => {
    setSubDestinationsList(subDestinationsList.filter((_, idx) => idx !== index));
  };

  const handleEdit = (region: RegionDestination) => {
    setIsEditing(true);
    setEditRegionId(region.id);
    setIdField(region.key || region.slug || region.id);
    setSlugField(region.slug);
    setNameIDField(region.name);
    setNameENField(region.nameEN || region.name);
    setSubtitleIDField(region.subtitle);
    setSubtitleENField(region.subtitleEN || region.subtitle);
    setGradientField(region.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]");
    setRegionImageField(region.image || "");
    setStatusField(region.status || "active");
    setSubDestinationsList(
      region.subDestinations.map((s) => ({
        name: s.name,
        nameEN: s.nameEN || s.name,
        slug: s.slug,
        image: s.image || ""
      }))
    );
    setFormLang("id");
    setViewMode("form");
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "id" ? "Hapus wilayah ini dari database server?" : "Delete this region from database server?")) {
      try {
        await apiFetch(`/admin/destinations/${id}`, { method: "DELETE" });
        setToast({ message: "Wilayah berhasil dihapus!", type: "success" });
        fetchRegions();
      } catch (err: any) {
        setToast({ message: err.message || "Gagal menghapus wilayah.", type: "error" });
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/admin/destinations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setToast({ message: "Status wilayah berhasil diperbarui!", type: "success" });
      fetchRegions();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal memperbarui status wilayah.", type: "error" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idField.trim() || !nameIDField.trim()) return;

    setIsSaving(true);
    const key = idField.toLowerCase().trim();
    const slug = slugField.trim() ? slugField.toLowerCase().trim() : key;

    const gradientValue = regionImageField.trim()
      ? `${gradientField.trim()}||${regionImageField.trim()}`
      : gradientField.trim();

    const payload = {
      key,
      slug,
      featuredImageGradient: gradientValue,
      nameId: nameIDField,
      nameEn: nameENField || nameIDField,
      subtitleId: subtitleIDField,
      subtitleEn: subtitleENField || subtitleIDField,
      status: statusField,
      subDestinations: subDestinationsList.map((sub, idx) => {
        const subNameEn = sub.nameEN || sub.name;
        const encodedNameEn = sub.image?.trim()
          ? `${subNameEn.trim()}||${sub.image.trim()}`
          : subNameEn.trim();
        return {
          slug: sub.slug,
          nameId: sub.name,
          nameEn: encodedNameEn,
          sortOrder: idx,
        };
      }),
    };

    try {
      if (isEditing && editRegionId) {
        await apiFetch(`/admin/destinations/${editRegionId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ message: "Wilayah berhasil diperbarui!", type: "success" });
      } else {
        await apiFetch("/admin/destinations", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({ message: "Wilayah baru berhasil ditambahkan!", type: "success" });
      }

      resetForm();
      fetchRegions();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menyimpan wilayah.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRegions = regions.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      (r.slug || "").toLowerCase().includes(q) ||
      (r.name || "").toLowerCase().includes(q) ||
      (r.nameEN || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* View Mode: List View */}
      {viewMode === "list" && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
                Master Data
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
                {locale === "id" ? "Manajemen Wilayah & Destinasi" : "Region & Destination Management"}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Kelola wilayah negara, sub-destinasi, dan gambar sampul utama.
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setViewMode("form");
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>Tambah Wilayah Baru</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
              {errorMsg}
            </div>
          )}

          {/* Search Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari wilayah berdasarkan nama, slug, atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:border-[#A89053] focus:bg-white transition-all text-slate-800"
              />
            </div>
            <div className="text-[11px] font-sans text-slate-500 font-medium">
              Menampilkan {filteredRegions.length} dari {regions.length} Wilayah
            </div>
          </div>

          {/* Grid Layout of Regions */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="animate-spin text-[#A89053] mb-3" size={32} />
              <span className="text-xs text-slate-500 font-sans">Memuat data wilayah...</span>
            </div>
          ) : filteredRegions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-sans">
              Tidak ada data wilayah yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.map((region) => (
                <div
                  key={region.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Header Cover Image */}
                  <div className="h-32 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={region.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600"}
                      alt={region.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 right-3 z-10 flex bg-slate-900/85 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 items-center gap-1 shadow-md" onClick={(e) => e.stopPropagation()}>
                      {[
                        { label: "Aktif", value: "active", activeClass: "bg-emerald-500 text-white shadow-sm border border-emerald-400/20" },
                        { label: "Draft", value: "draft", activeClass: "bg-amber-500 text-white shadow-sm border border-amber-400/20" },
                        { label: "Off", value: "inactive", activeClass: "bg-slate-500 text-white shadow-sm border border-slate-400/20" },
                      ].map((opt) => {
                        const currentStatus = region.status || "active";
                        const isChecked = currentStatus === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-1 text-[8px] font-bold uppercase cursor-pointer px-1.5 py-0.5 rounded-md transition-all select-none ${
                              isChecked
                                ? opt.activeClass
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`status-${region.id}`}
                              value={opt.value}
                              checked={isChecked}
                              onChange={() => handleUpdateStatus(region.id, opt.value)}
                              className="hidden"
                            />
                            <span>{opt.label === "Off" ? "Off" : opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-md border border-white/20">
                        ID: {region.id}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-base text-[#0F2C59]">{region.name}</h3>
                        {region.nameEN && region.nameEN !== region.name && (
                          <span className="text-xs text-slate-400 font-sans">({region.nameEN})</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                        {region.subtitle}
                      </p>
                    </div>

                    {/* Subdestinations Tags */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        Sub-destinasi ({region.subDestinations.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {region.subDestinations.length === 0 ? (
                          <span className="text-[10px] text-slate-400 italic">Tidak ada sub-destinasi</span>
                        ) : (
                          region.subDestinations.map((sub, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                              {sub.image && (
                                <img src={sub.image} alt={sub.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                              )}
                              <span>{sub.name}</span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(region)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#0F2C59] transition-all cursor-pointer"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(region.id)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View Mode: Form View */}
      {viewMode === "form" && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0F2C59] font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Daftar Wilayah</span>
            </button>
            <div>
              <span className="text-[10px] font-mono bg-[#A89053]/15 text-[#A89053] px-2 py-0.5 rounded font-bold uppercase block text-center">
                {isEditing ? `Edit ID: ${editRegionId}` : "Wilayah Baru"}
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-serif font-bold text-[#0F2C59]">
                {isEditing ? "Form Edit Data Wilayah" : "Form Tambah Wilayah Baru"}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6 font-sans text-xs">
              {/* Key & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Region Key / ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={idField}
                    disabled={isEditing}
                    onChange={(e) => setIdField(e.target.value.toLowerCase())}
                    placeholder="e.g. indonesia, japan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] disabled:opacity-50 text-slate-800"
                  />
                </div>
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
              </div>

              {/* Status Radio Buttons */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Status Wilayah *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "active", label: "Aktif", desc: "Tampil di website" },
                    { value: "draft", label: "Draft", desc: "Simpan sebagai draft" },
                    { value: "inactive", label: "Nonaktif", desc: "Sembunyikan wilayah" }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`relative flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        statusField === opt.value
                          ? "border-[#A89053] bg-[#A89053]/5 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="region-status"
                          value={opt.value}
                          checked={statusField === opt.value}
                          onChange={() => setStatusField(opt.value as any)}
                          className="w-4 h-4 text-[#A89053] border-slate-300 focus:ring-[#A89053]"
                        />
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-800">{opt.label}</span>
                          <span className="block text-[10px] text-slate-400 font-light">{opt.desc}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Region Cover Image Upload */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Gambar Sampul Wilayah (URL / Upload Lokal)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={regionImageField}
                    onChange={(e) => setRegionImageField(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer shrink-0">
                    {isUploadingRegion ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    <span>{isUploadingRegion ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingRegion}
                      onChange={(e) => handleImageFileUpload(e, setRegionImageField, setIsUploadingRegion)}
                    />
                  </label>
                </div>
                {regionImageField && (
                  <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 max-w-md">
                    <img src={regionImageField} alt="Region Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                    className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2.5 py-1 rounded-lg hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                  >
                    {isTranslating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    <span>Auto Translate</span>
                  </button>
                </div>
              </div>

              {/* Language Dependent Content */}
              {formLang === "id" ? (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Nama Wilayah (ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={nameIDField}
                      onChange={(e) => setNameIDField(e.target.value)}
                      placeholder="e.g. Indonesia"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Deskripsi Singkat (ID)
                    </label>
                    <textarea
                      rows={2}
                      value={subtitleIDField}
                      onChange={(e) => setSubtitleIDField(e.target.value)}
                      placeholder="Deskripsi singkat wilayah..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-slate-800 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Region Name (EN)
                    </label>
                    <input
                      type="text"
                      value={nameENField}
                      onChange={(e) => setNameENField(e.target.value)}
                      placeholder="e.g. Indonesia"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Subtitle (EN)
                    </label>
                    <textarea
                      rows={2}
                      value={subtitleENField}
                      onChange={(e) => setSubtitleENField(e.target.value)}
                      placeholder="Short region subtitle in English..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-slate-800 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Destinations List */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Daftar Sub-Destinasi ({subDestinationsList.length})
                </label>

                {/* Added Sub-destinations Chips */}
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  {subDestinationsList.length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">Belum ada sub-destinasi ditambahkan.</span>
                  ) : (
                    subDestinationsList.map((sub, idx) => (
                      <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-xs text-slate-700 font-semibold">
                        {sub.image ? (
                          <img src={sub.image} alt={sub.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                        ) : (
                          <MapPin size={12} className="text-[#A89053]" />
                        )}
                        <span>{sub.name}</span>
                        {sub.nameEN && sub.nameEN !== sub.name && (
                          <span className="text-[10px] text-slate-400">({sub.nameEN})</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubDest(idx)}
                          className="hover:text-red-500 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Sub-Destination Form */}
                <div className="p-4 bg-slate-100/60 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-600 block">Tambah Sub-Destinasi</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newSubNameID}
                      onChange={(e) => setNewSubNameID(e.target.value)}
                      placeholder="Nama (ID) e.g. Bali"
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                    />
                    <input
                      type="text"
                      value={newSubNameEN}
                      onChange={(e) => setNewSubNameEN(e.target.value)}
                      placeholder="Nama (EN) e.g. Bali"
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newSubSlug}
                      onChange={(e) => setNewSubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                      placeholder="Slug (e.g. bali)"
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                    />

                    {/* Sub-destination Cover Upload */}
                    <div className="flex gap-1 items-center">
                      <input
                        type="text"
                        value={newSubImage}
                        onChange={(e) => setNewSubImage(e.target.value)}
                        placeholder="Gambar Sub (URL)"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                      <label className="p-2 rounded-lg bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 cursor-pointer shrink-0 flex items-center justify-center min-w-[28px]">
                        {isUploadingSub ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingSub}
                          onChange={(e) => handleImageFileUpload(e, setNewSubImage, setIsUploadingSub)}
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSubDest}
                    disabled={!newSubNameID.trim()}
                    className="w-full bg-[#0F2C59] text-white py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#0F2C59]/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Tambah Sub-Destinasi</span>
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#A89053] hover:bg-[#967F47] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isEditing ? "Update Wilayah" : "Simpan Wilayah Baru"}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </>
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
