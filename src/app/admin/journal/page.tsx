"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Save, X, BookOpen, Star, FileText, Upload, Sparkles, Loader2, Eye, Compass, Quote, Grid, Layers, ArrowLeft, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { JournalArticle } from "@/data/journal";
import { translateText } from "@/utils/translator";
import { Toast } from "@/components/ui/Toast";
import { uploadMedia, apiFetch } from "@/lib/api";

export default function AdminJournalPage() {
  const { locale } = useLanguage();
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form active language tab switcher
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);

  // Form states matching JournalArticle structure
  const [slugField, setSlugField] = useState("");
  const [imageField, setImageField] = useState("");
  const [categoryIDField, setCategoryIDField] = useState("Cerita Perjalanan");
  const [categoryENField, setCategoryENField] = useState("Travel Stories");
  
  const [titleIDField, setTitleIDField] = useState("");
  const [titleENField, setTitleENField] = useState("");
  
  const [excerptIDField, setExcerptIDField] = useState("");
  const [excerptENField, setExcerptENField] = useState("");
  
  const [contentIDField, setContentIDField] = useState("");
  const [contentENField, setContentENField] = useState("");
  
  const [dateIDField, setDateIDField] = useState("");
  const [dateENField, setDateENField] = useState("");
  
  const [readTimeIDField, setReadTimeIDField] = useState("5 mnt membaca");
  const [readTimeENField, setReadTimeENField] = useState("5 min read");
  const [featuredField, setFeaturedField] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const insertSnippet = (snippet: string, isIndoField: boolean) => {
    if (isIndoField) {
      setContentIDField(prev => prev ? `${prev}\n\n${snippet}` : snippet);
    } else {
      setContentENField(prev => prev ? `${prev}\n\n${snippet}` : snippet);
    }
  };

  const loadPromoTemplate = (isIndoField: boolean) => {
    if (isIndoField) {
      setContentIDField(
        `Berdiri di bibir kawah Gunung Bromo sesaat sebelum fajar menyingsing adalah pengalaman spiritual yang tak tertandingi. Ketika kegelapan malam perlahan memudar, kabut tebal menyelimuti lautan pasir (Segara Wedi) di bawahnya bagaikan samudera mistis yang tak berujung, menciptakan suasana sunyi yang begitu syahdu.\n\n` +
        `Dari kejauhan, siluet Gunung Batok yang berulir indah dan kepulan asap putih vulkanik dari kawah aktif Bromo berdiri kokoh di bawah langit jingga keemasan. Momen-momen inilah yang dinanti-nanti oleh para penjelajah dari seluruh penjuru dunia—sebuah lanskap magis yang terasa seperti ditarik dari planet lain.\n\n` +
        `> "Bromo bukan sekadar destinasi wisata; ia adalah teater alam semesta tempat keindahan magis bumi dipertunjukkan secara murni."\n\n` +
        `CHAPTER I: Pendakian Tengah Malam & Cahaya Penanjakan\n\n` +
        `Perjalanan dimulai pada pukul 03.00 pagi. Dengan menggunakan kendaraan jip 4x4, Anda akan menembus malam yang dingin menuju puncak Penanjakan 1. Sambil menggenggam secangkir kopi atau teh hangat dari kedai lokal, Anda akan menyaksikan matahari perlahan terbit dari balik ufuk timur, membiaskan sinar keemasan di atas jajaran Gunung Bromo, Batok, dan Semeru yang menjulang tinggi.\n\n` +
        `[GRID]\n` +
        `- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | Jip 4x4 di Lautan Pasir\n` +
        `- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Bibir Kawah\n\n` +
        `CHAPTER II: Menyeberangi Segara Wedi & Tradisi Luhur Tengger\n\n` +
        `Setelah menyaksikan matahari terbit, petualangan berlanjut turun ke Segara Wedi (Lautan Pasir). Di sini, Anda bisa menunggangi kuda atau berjalan kaki melintasi hamparan pasir abu vulkanik menuju anak tangga kawah Bromo. Bromo memegang peran suci bagi masyarakat Hindu Tengger. Setiap tahun, mereka menggelar upacara Yadnya Kasada untuk memberikan persembahan hasil bumi ke dalam kawah aktif sebagai wujud syukur dan penghormatan kepada para leluhur.\n\n` +
        `[TIPS] Tips Perjalanan Jurnal Kurator\n` +
        `- Musim Terbaik: Musim Kemarau (Mei - September) untuk pemandangan langit bersih dan bebas kabut hujan.\n` +
        `- Perlengkapan Wajib: Jaket tebal (suhu bisa turun hingga 5°C), sarung tangan, masker wajah (pelindung debu belerang), dan kacamata.\n` +
        `- Etika Kunjungan: Jangan menginjak tempat sesaji di sekitar pura Luhur Poten di kaki Gunung Bromo.\n` +
        `- Rekomendasi Foto: King Kong Hill menawarkan sudut pemandangan kaldera yang megah dengan kerumunan pengunjung yang lebih sedikit daripada Penanjakan 1.`
      );
    } else {
      setContentENField(
        `Standing on the edge of Mount Bromo's crater just before dawn is an unparalleled spiritual experience. As the darkness slowly fades, a thick mist blankets the sea of sand (Segara Wedi) below like a boundless mystical ocean, creating a serene and solemn atmosphere.\n\n` +
        `In the distance, the beautifully striated silhouette of Mount Batok and the columns of white volcanic smoke from Bromo's active crater stand firm beneath a golden orange sky. These are the moments travelers from all corners of the globe wait for—a magical landscape that feels as if it were pulled from another planet.\n\n` +
        `> "Bromo is not merely a tourist destination; it is a cosmic theater where the earth's magical beauty is presented in its purest form."\n\n` +
        `CHAPTER I: Midnight Ascent & Sunrise at Penanjakan\n\n` +
        `The journey begins at 03.00 AM. Using a 4x4 jeep, you will traverse the chilly night toward Penanjakan 1 peak. Holding a cup of warm coffee or tea from a local stall, you will watch the sun slowly rise from behind the eastern horizon, casting golden rays over the towering peaks of Bromo, Batok, and Semeru.\n\n` +
        `[GRID]\n` +
        `- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | 4x4 Jeep in the Sea of Sand\n` +
        `- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Crater Edge\n\n` +
        `CHAPTER II: Crossing Segara Wedi & Tenggerese Heritage\n\n` +
        `After witnessing the sunrise, the adventure continues down to Segara Wedi (Sea of Sand). Here, you can ride a horse or walk across the gray volcanic sand toward the stairs of Bromo's crater. Bromo holds sacred meaning for the Hindu Tengger community. Every year, they hold the Yadnya Kasada ceremony to offer crops into the active crater as a gesture of gratitude and respect to their ancestors.\n\n` +
        `[TIPS] Curator's Travel Protocol\n` +
        `- Best Season: Dry Season (May - September) for clear skies and rain-free views.\n` +
        `- Essential Gear: Warm jacket (temperatures can drop to 5°C), gloves, face mask (for sulfur dust protection), and sunglasses.\n` +
        `- Visitor Etiquette: Do not step on offering areas around Luhur Poten Temple at the foot of Mount Bromo.\n` +
        `- Photography Tip: King Kong Hill offers a majestic viewpoint of the caldera with fewer crowds than Penanjakan 1.`
      );
    }
  };

  // Load initial list from API, with localStorage & static fallback
  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const apiData = await apiFetch<JournalArticle[]>("/admin/journal").catch(async () => {
          return await apiFetch<JournalArticle[]>("/journal");
        });
        if (apiData && Array.isArray(apiData)) {
          setArticles(apiData);
          localStorage.setItem("klik_admin_journal_articles", JSON.stringify(apiData));
          return;
        }
      } catch (err) {
        console.error("Failed to load journal articles from API", err);
      }

      // Fallback if API fails
      try {
        const saved = localStorage.getItem("klik_admin_journal_articles");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setArticles(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load journal fallback from localStorage", e);
      }
      
      setArticles([]);
    }

    loadArticles().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const saveArticlesStorage = (newList: JournalArticle[]) => {
    setArticles(newList);
    try {
      localStorage.setItem("klik_admin_journal_articles", JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save journal articles to localStorage", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadMedia(file);
      setImageField(uploaded.url);
      setToast({ message: locale === "id" ? "Cover berhasil diunggah!" : "Cover uploaded successfully!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Gagal mengunggah cover", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  // Unified auto-translate handler for all active fields
  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    if (formLang === "id") {
      if (titleIDField.trim()) {
        const translated = await translateText(titleIDField, "id", "en");
        setTitleENField(translated);
      }
      if (excerptIDField.trim()) {
        const translated = await translateText(excerptIDField, "id", "en");
        setExcerptENField(translated);
      }
      if (contentIDField.trim()) {
        const translated = await translateText(contentIDField, "id", "en");
        setContentENField(translated);
      }
      if (categoryIDField.trim()) {
        const translated = await translateText(categoryIDField, "id", "en");
        setCategoryENField(translated);
      }
      if (dateIDField.trim()) {
        const translated = await translateText(dateIDField, "id", "en");
        setDateENField(translated);
      }
      if (readTimeIDField.trim()) {
        const translated = await translateText(readTimeIDField, "id", "en");
        setReadTimeENField(translated);
      }
    } else {
      if (titleENField.trim()) {
        const translated = await translateText(titleENField, "en", "id");
        setTitleIDField(translated);
      }
      if (excerptENField.trim()) {
        const translated = await translateText(excerptENField, "en", "id");
        setExcerptIDField(translated);
      }
      if (contentENField.trim()) {
        const translated = await translateText(contentENField, "en", "id");
        setContentIDField(translated);
      }
      if (categoryENField.trim()) {
        const translated = await translateText(categoryENField, "en", "id");
        setCategoryIDField(translated);
      }
      if (dateENField.trim()) {
        const translated = await translateText(dateENField, "en", "id");
        setDateIDField(translated);
      }
      if (readTimeENField.trim()) {
        const translated = await translateText(readTimeENField, "en", "id");
        setReadTimeIDField(translated);
      }
    }
    setIsTranslating(false);
    setToast({
      message: locale === "id" ? "Terjemahan otomatis selesai!" : "Auto-translation complete!",
      type: "success"
    });
  };

  const resetForm = () => {
    setSlugField("");
    setImageField("");
    setCategoryIDField("Cerita Perjalanan");
    setCategoryENField("Travel Stories");
    setTitleIDField("");
    setTitleENField("");
    setExcerptIDField("");
    setExcerptENField("");
    setContentIDField("");
    setContentENField("");
    setDateIDField("");
    setDateENField("");
    setReadTimeIDField("5 mnt membaca");
    setReadTimeENField("5 min read");
    setFeaturedField(false);
    setIsEditing(false);
    setEditSlug(null);
    setEditId(null);
    setFormLang("id");
    setViewMode("list");
  };

  const handleEdit = (art: JournalArticle) => {
    setIsEditing(true);
    setEditSlug(art.slug);
    setEditId(art.id || null);
    setSlugField(art.slug);
    setImageField(art.image);
    setCategoryIDField(art.categoryID);
    setCategoryENField(art.categoryEN);
    setTitleIDField(art.titleID);
    setTitleENField(art.titleEN);
    setExcerptIDField(art.excerptID);
    setExcerptENField(art.excerptEN);
    setContentIDField(art.contentID);
    setContentENField(art.contentEN);
    setDateIDField(art.dateID);
    setDateENField(art.dateEN);
    setReadTimeIDField(art.readTimeID);
    setReadTimeENField(art.readTimeEN);
    setFeaturedField(!!art.featured);
    setFormLang("id");
    setViewMode("form");
  };

  const handleDelete = async (art: JournalArticle) => {
    if (confirm(locale === "id" ? "Hapus artikel ini?" : "Delete this article?")) {
      const targetId = art.id || art.slug;
      try {
        await apiFetch(`/admin/journal/${targetId}`, { method: "DELETE" }).catch(async () => {
          await apiFetch(`/journal/${targetId}`, { method: "DELETE" });
        });
      } catch (err) {
        console.error("Failed to delete via API, removing locally", err);
      }
      const updated = articles.filter(a => a.slug !== art.slug && a.id !== art.id);
      saveArticlesStorage(updated);
      setToast({
        message: locale === "id" ? "Artikel berhasil dihapus" : "Article deleted successfully",
        type: "success"
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleIDField.trim() || !slugField.trim()) return;

    let newArticle: JournalArticle = {
      id: editId || undefined,
      slug: slugField,
      image: imageField || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600",
      categoryID: categoryIDField,
      categoryEN: categoryENField,
      titleID: titleIDField,
      titleEN: titleENField || titleIDField,
      excerptID: excerptIDField,
      excerptEN: excerptENField || excerptIDField,
      contentID: contentIDField,
      contentEN: contentENField || contentIDField,
      dateID: dateIDField || "10 Agu 2026",
      dateEN: dateENField || "Aug 10, 2026",
      readTimeID: readTimeIDField,
      readTimeEN: readTimeENField,
      featured: featuredField
    };

    try {
      if (editId || editSlug) {
        const targetIdentifier = editId || editSlug;
        const res = await apiFetch<JournalArticle>(`/admin/journal/${targetIdentifier}`, {
          method: "PATCH",
          body: JSON.stringify(newArticle),
        }).catch(async () => {
          return await apiFetch<JournalArticle>(`/journal/${targetIdentifier}`, {
            method: "PATCH",
            body: JSON.stringify(newArticle),
          }).catch(async () => {
            return await apiFetch<JournalArticle>(`/admin/journal/${targetIdentifier}`, {
              method: "PUT",
              body: JSON.stringify(newArticle),
            });
          });
        });
        if (res && res.id) {
          newArticle.id = res.id;
        }
      } else {
        const res = await apiFetch<JournalArticle>("/admin/journal", {
          method: "POST",
          body: JSON.stringify(newArticle),
        }).catch(async () => {
          return await apiFetch<JournalArticle>("/journal", {
            method: "POST",
            body: JSON.stringify(newArticle),
          });
        });
        if (res && res.id) {
          newArticle.id = res.id;
        }
      }
    } catch (err) {
      console.error("API save failed, saving to local storage fallback", err);
    }

    let updatedList: JournalArticle[];
    if (editSlug || editId) {
      updatedList = articles.map(a => (a.slug === editSlug || (editId && a.id === editId)) ? newArticle : a);
    } else {
      updatedList = [newArticle, ...articles.filter(a => a.slug !== newArticle.slug)];
    }
    saveArticlesStorage(updatedList);
    resetForm();
    setToast({
      message: editSlug || editId
        ? (locale === "id" ? "Artikel berhasil diperbarui!" : "Article updated successfully!")
        : (locale === "id" ? "Artikel berhasil dipublikasikan!" : "Article published successfully!"),
      type: "success"
    });
  };

  const filteredArticles = articles.filter(art => {
    const q = searchQuery.toLowerCase();
    return (
      art.titleID.toLowerCase().includes(q) ||
      (art.titleEN || "").toLowerCase().includes(q) ||
      art.slug.toLowerCase().includes(q) ||
      (art.categoryID || "").toLowerCase().includes(q) ||
      (art.categoryEN || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
            Content Manager
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {locale === "id" ? "Pengelolaan Jurnal & Artikel" : "Travel Journal Management"}
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {locale === "id" 
              ? "Tulis, edit, dan kelola artikel cerita perjalanan dalam dwi-bahasa (ID / EN)."
              : "Write, edit, and publish bilingual travel stories and guides (ID / EN)."}
          </p>
        </div>

        {viewMode === "form" && (
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0 w-fit cursor-pointer font-sans"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Artikel</span>
          </button>
        )}
      </div>

      {viewMode === "form" ? (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-base font-serif font-bold text-[#0F2C59]">
              {isEditing ? "Edit Article" : "Write New Article"}
            </h2>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A89053]/10 hover:bg-[#A89053]/20 text-[#A89053] font-mono uppercase tracking-wider text-[9px] font-bold transition-all cursor-pointer"
            >
              <Eye size={12} />
              <span>See Demo (Live Preview)</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
            {/* Slug & Image */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Unique Slug (URL path)
                </label>
                <input 
                  type="text" 
                  required
                  disabled={isEditing}
                  value={slugField}
                  onChange={(e) => setSlugField(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                  placeholder="e.g. rhythm-of-the-sea"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] disabled:opacity-50 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Cover Image
                </label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={imageField}
                    onChange={(e) => setImageField(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer shrink-0">
                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
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
                  disabled={isTranslating || (formLang === "id" ? !titleIDField.trim() : !titleENField.trim())}
                  className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2 py-0.5 rounded hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                >
                  {isTranslating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  <span>{formLang === "id" ? "Translate to EN" : "Translate to ID"}</span>
                </button>
              </div>
            </div>

            {/* Tabbed Multilingual Fields */}
            {formLang === "id" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Category (ID)
                    </label>
                    <input 
                      type="text" 
                      value={categoryIDField}
                      onChange={(e) => setCategoryIDField(e.target.value)}
                      placeholder="e.g. Cerita Perjalanan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Title (ID)
                    </label>
                    <input 
                      type="text" 
                      required
                      value={titleIDField}
                      onChange={(e) => {
                        setTitleIDField(e.target.value);
                        if (!slugField) setSlugField(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }}
                      placeholder="Judul dalam Bahasa Indonesia"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Excerpt / Summary (ID)
                  </label>
                  <textarea 
                    rows={2}
                    value={excerptIDField}
                    onChange={(e) => setExcerptIDField(e.target.value)}
                    placeholder="Ringkasan pendek..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap justify-between items-center mb-1 gap-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Full Content (ID)
                    </label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => insertSnippet("CHAPTER I: Pendakian Tengah Malam & Cahaya Penanjakan", true)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Chapter heading"
                      >
                        + Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('> "Bromo bukan sekadar destinasi wisata; ia adalah teater alam semesta."', true)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Pull Quote"
                      >
                        + Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet("[GRID]\n- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | Jip 4x4 di Lautan Pasir\n- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Bibir Kawah", true)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Image Grid"
                      >
                        + Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet("[TIPS] Tips Perjalanan Jurnal Kurator\n- Musim Terbaik: Musim Kemarau (Mei - September) untuk pemandangan langit bersih.\n- Perlengkapan Wajib: Jaket tebal (suhu bisa turun hingga 5°C), sarung tangan, masker wajah.\n- Etika Kunjungan: Jangan menginjak tempat sesaji di sekitar pura.", true)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Tips Box"
                      >
                        + Tips Box
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPromoTemplate(true)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Load complete rich Mount Bromo template"
                      >
                        📋 Load Bromo Template
                      </button>
                    </div>
                  </div>
                  <textarea 
                    rows={8}
                    value={contentIDField}
                    onChange={(e) => setContentIDField(e.target.value)}
                    placeholder="Konten lengkap artikel..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#A89053] text-slate-800 font-mono text-[11px] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Date (ID)
                    </label>
                    <input 
                      type="text" 
                      value={dateIDField}
                      onChange={(e) => setDateIDField(e.target.value)}
                      placeholder="e.g. 10 Agu 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Read Time (ID)
                    </label>
                    <input 
                      type="text" 
                      value={readTimeIDField}
                      onChange={(e) => setReadTimeIDField(e.target.value)}
                      placeholder="5 mnt membaca"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Category (EN)
                    </label>
                    <input 
                      type="text" 
                      value={categoryENField}
                      onChange={(e) => setCategoryENField(e.target.value)}
                      placeholder="e.g. Travel Stories"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Title (EN)
                    </label>
                    <input 
                      type="text" 
                      required
                      value={titleENField}
                      onChange={(e) => setTitleENField(e.target.value)}
                      placeholder="Title in English"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Excerpt / Summary (EN)
                  </label>
                  <textarea 
                    rows={2}
                    value={excerptENField}
                    onChange={(e) => setExcerptENField(e.target.value)}
                    placeholder="Short summary..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap justify-between items-center mb-1 gap-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Full Content (EN)
                    </label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => insertSnippet("CHAPTER I: Midnight Ascent & Sunrise at Penanjakan", false)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Chapter heading"
                      >
                        + Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('> "Bromo is not merely a tourist destination; it is a cosmic theater."', false)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Pull Quote"
                      >
                        + Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet("[GRID]\n- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | 4x4 Jeep in the Sea of Sand\n- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Crater Edge", false)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Image Grid"
                      >
                        + Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet("[TIPS] Curator's Travel Protocol\n- Best Season: Dry Season (May - September) for clear skies.\n- Essential Gear: Warm jacket (temperatures can drop to 5°C), gloves, face mask.\n- Visitor Etiquette: Do not step on offering areas around Luhur Poten Temple.", false)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0F2C59] px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Add Tips Box"
                      >
                        + Tips Box
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPromoTemplate(false)}
                        className="text-[8px] font-mono uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Load complete rich Mount Bromo template in English"
                      >
                        📋 Load Bromo Template (EN)
                      </button>
                    </div>
                  </div>
                  <textarea 
                    rows={8}
                    value={contentENField}
                    onChange={(e) => setContentENField(e.target.value)}
                    placeholder="Full article content in English..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#A89053] text-slate-800 font-mono text-[11px] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Date (EN)
                    </label>
                    <input 
                      type="text" 
                      value={dateENField}
                      onChange={(e) => setDateENField(e.target.value)}
                      placeholder="e.g. Aug 10, 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                      Read Time (EN)
                    </label>
                    <input 
                      type="text" 
                      value={readTimeENField}
                      onChange={(e) => setReadTimeENField(e.target.value)}
                      placeholder="5 min read"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Featured */}
            <div className="flex items-center gap-2 py-1">
              <input 
                type="checkbox"
                id="featured"
                checked={featuredField}
                onChange={(e) => setFeaturedField(e.target.checked)}
                className="rounded border-slate-300 text-[#A89053] focus:ring-0"
              />
              <label htmlFor="featured" className="text-xs text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer">
                <Star size={14} className="text-[#A89053]" />
                Featured Article (Pin to highlight)
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Reset
              </button>
              <button 
                type="button" 
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#A89053] hover:bg-[#A89053]/90 text-white font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
              >
                <Eye size={12} />
                <span>See Demo</span>
              </button>
              <button 
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                {isEditing ? "Update Article" : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search Filter & Add Button Row */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul, slug, kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#A89053] focus:bg-white transition-all text-slate-800"
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setViewMode("form");
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0 w-full sm:w-auto font-sans"
            >
              <Plus size={14} />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          {/* Responsive Article Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex flex-col overflow-hidden">
                  <div className="h-40 w-full bg-slate-100" />
                  <div className="p-5 flex-1 space-y-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-5/6" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <div className="h-7 w-14 bg-slate-50 rounded-lg" />
                      <div className="h-7 w-14 bg-red-50/50 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-sans">
              Tidak ada artikel yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
              {filteredArticles.map((art) => (
                <div
                  key={art.slug}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Article Image */}
                  <div className="h-40 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={art.image || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600"}
                      alt={art.titleID}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#A89053] text-white">
                        {locale === "id" ? art.categoryID : art.categoryEN}
                      </span>
                      {art.featured && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                          <Star size={10} className="fill-slate-900" /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-sm text-[#0F2C59] line-clamp-2 leading-snug">
                        {locale === "id" ? art.titleID : art.titleEN}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-sans line-clamp-2">
                        {locale === "id" ? art.excerptID : art.excerptEN}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {locale === "id" ? art.dateID : art.dateEN} • {locale === "id" ? art.readTimeID : art.readTimeEN}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(art)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#0F2C59] transition-all cursor-pointer font-sans"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(art)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all cursor-pointer font-sans"
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
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 font-sans">
          <div className="bg-[#FAF9F6] w-full max-w-5xl h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="min-w-0 flex-1 pr-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#A89053] font-bold block">
                  Live Article Layout Preview
                </span>
                <h3 className="font-serif text-sm font-bold text-[#0F2C59] truncate mt-0.5">
                  {formLang === "id" ? (titleIDField || "Draf Judul") : (titleENField || "Draft Title")}
                </h3>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold">
                  <button
                    type="button"
                    onClick={() => setFormLang("id")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${formLang === "id" ? "bg-white text-[#0F2C59] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    🇮🇩 ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormLang("en")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${formLang === "en" ? "bg-white text-[#0F2C59] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-[#FAF9F6] pb-12">
              {/* Cinematic Hero */}
              <div className="h-[280px] md:h-[350px] w-full relative bg-slate-900 overflow-hidden shrink-0">
                {imageField ? (
                  <img
                    src={imageField}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0F2C59]/10 text-[#0F2C59]/30">
                    <BookOpen size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-4xl mx-auto text-white">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#A89053] font-bold bg-[#A89053]/15 border border-[#A89053]/30 px-3 py-1 rounded-full backdrop-blur-md">
                    {formLang === "id" ? categoryIDField : categoryENField}
                  </span>
                  <h1 className="font-serif text-2xl md:text-4xl font-bold leading-tight mt-4">
                    {formLang === "id" ? titleIDField : titleENField}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                    <span>📅 {formLang === "id" ? dateIDField : dateENField}</span>
                    <span>⏱️ {formLang === "id" ? readTimeIDField : readTimeENField}</span>
                    <span>✍️ Klik Travel Curator</span>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10 -mt-10">
                <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl">
                  {/* Excerpt */}
                  {((formLang === "id" ? excerptIDField : excerptENField)) && (
                    <div className="font-serif text-sm md:text-base text-slate-500 leading-relaxed italic border-b border-slate-100 pb-5 mb-6">
                      {formLang === "id" ? excerptIDField : excerptENField}
                    </div>
                  )}

                  {/* Render Parsed Body Content */}
                  {(() => {
                    const content = formLang === "id" ? contentIDField : contentENField;
                    if (!content) return (
                      <p className="text-slate-400 italic text-center font-sans text-xs py-8">
                        {formLang === "id" ? "Konten kosong..." : "No content written yet..."}
                      </p>
                    );
                    const paragraphs = content.split("\n\n").filter(Boolean);
                    let regularParagraphIndex = 0;

                    return (
                      <div className="space-y-6 text-slate-700 leading-relaxed text-xs md:text-sm font-sans">
                        {paragraphs.map((p, idx) => {
                          const trimmed = p.trim();

                          // 1. Chapter Headings
                          if (trimmed.startsWith("### ") || trimmed.toUpperCase().startsWith("CHAPTER")) {
                            const headingText = trimmed.startsWith("### ") ? trimmed.slice(4) : trimmed;
                            const isChapter = headingText.toUpperCase().startsWith("CHAPTER");
                            let chapterNum = "";
                            let titleText = headingText;

                            if (isChapter) {
                              const parts = headingText.split(":");
                              chapterNum = parts[0].trim();
                              titleText = parts[1] ? parts[1].trim() : "";
                            }

                            return (
                              <div key={idx} className="pt-4">
                                {chapterNum && (
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#A89053] font-bold block mb-1">
                                    {chapterNum}
                                  </span>
                                )}
                                <h3 className="font-serif text-lg md:text-xl text-[#0F2C59] font-bold leading-tight">
                                  {titleText || headingText}
                                </h3>
                              </div>
                            );
                          }

                          // 2. Pull Quotes
                          if (trimmed.startsWith("> ") || (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 85)) {
                            const quoteText = trimmed.startsWith("> ") ? trimmed.slice(2) : trimmed;
                            return (
                              <div key={idx} className="border-l-4 border-[#A89053] pl-5 my-6">
                                <blockquote className="font-serif italic text-base md:text-lg text-[#0F2C59] leading-relaxed">
                                  {quoteText}
                                </blockquote>
                                <cite className="block font-mono text-[8px] uppercase tracking-widest text-slate-400 mt-2 font-semibold not-italic">
                                  — Klik Travel Curator
                                </cite>
                              </div>
                            );
                          }

                          // 3. Tips / Protocol Box
                          if (trimmed.startsWith("[TIPS]") || trimmed.startsWith("[PROTOCOL]")) {
                            const lines = trimmed.split("\n").slice(1);
                            const titleLine = trimmed.split("\n")[0];
                            const cleanTitle = titleLine.replace("[TIPS]", "").replace("[PROTOCOL]", "").trim() || (formLang === "id" ? "Tips Perjalanan Jurnal Kurator" : "Curator's Travel Protocol");
                            
                            return (
                              <div key={idx} className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl space-y-4 my-6">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-[#A89053]/15 rounded-lg">
                                    <Compass size={14} className="text-[#A89053]" />
                                  </div>
                                  <h4 className="font-serif text-xs font-bold text-[#0F2C59]">
                                    {cleanTitle}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-sans text-slate-600">
                                  {lines.map((line, lIdx) => {
                                    const cleanLine = line.replace(/^-\s*/, "").trim();
                                    const parts = cleanLine.split(":");
                                    const label = parts[0] ? parts[0].trim() : "";
                                    const desc = parts.slice(1).join(":").trim();

                                    return (
                                      <div key={lIdx} className="flex gap-1.5 items-start">
                                        <span className="text-[#A89053] font-bold select-none">•</span>
                                        <p>
                                          {label && desc ? (
                                            <>
                                              <strong>{label}:</strong> {desc}
                                            </>
                                          ) : (
                                            cleanLine
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          // 4. Photo Grid Showcase
                          if (trimmed.startsWith("[GRID]")) {
                            const lines = trimmed.split("\n").slice(1);
                            const images = lines.map(line => {
                              const parts = line.replace(/^-\s*/, "").split("|");
                              return {
                                url: parts[0].trim(),
                                caption: parts[1] ? parts[1].trim() : ""
                              };
                            }).filter(img => img.url);

                            if (images.length === 0) return null;

                            return (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
                                {images.map((img, imgIdx) => (
                                  <div key={imgIdx} className="overflow-hidden rounded-xl h-[160px] relative shadow-sm">
                                    <img
                                      src={img.url}
                                      alt={img.caption || "Travel photo"}
                                      className="w-full h-full object-cover"
                                    />
                                    {img.caption && (
                                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 text-[9px] text-white font-mono uppercase tracking-wider">
                                        {img.caption}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          }

                          // 5. Normal text with Drop Cap (First regular paragraph)
                          const isFirstParagraph = regularParagraphIndex === 0;
                          regularParagraphIndex++;

                          if (isFirstParagraph && trimmed.length > 25) {
                            const firstLetter = trimmed.charAt(0);
                            const restOfText = trimmed.slice(1);
                            return (
                              <p key={idx} className="text-slate-600 leading-relaxed font-sans text-xs md:text-sm">
                                <span className="float-left text-3xl font-serif text-[#A89053] font-bold mr-2 mt-0.5 line-none">
                                  {firstLetter}
                                </span>
                                {restOfText}
                              </p>
                            );
                          }

                          return (
                            <p key={idx} className="text-slate-600 leading-relaxed font-sans text-xs md:text-sm">
                              {trimmed}
                            </p>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
