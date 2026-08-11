"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, X, BookOpen, Star, FileText, Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { journalArticles, JournalArticle } from "@/data/journal";

export default function AdminJournalPage() {
  const { locale } = useLanguage();
  const [articles, setArticles] = useState<JournalArticle[]>(journalArticles);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

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
  const [galleryList, setGalleryList] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

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
    setReadTimeENField("5 min read");
    setFeaturedField(false);
    setGalleryList([]);
    setIsEditing(false);
    setEditSlug(null);
  };

  const handleEdit = (art: JournalArticle) => {
    setIsEditing(true);
    setEditSlug(art.slug);
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
    setGalleryList([art.image]);
  };

  const handleDelete = (slug: string) => {
    if (confirm("Delete this article?")) {
      setArticles(articles.filter(a => a.slug !== slug));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleIDField.trim() || !slugField.trim()) return;

    const newArticle: JournalArticle = {
      slug: slugField,
      image: imageField || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600",
      categoryID: categoryIDField,
      categoryEN: categoryENField,
      titleID: titleIDField,
      titleEN: titleENField,
      excerptID: excerptIDField,
      excerptEN: excerptENField,
      contentID: contentIDField,
      contentEN: contentENField,
      dateID: dateIDField || "10 Agu 2026",
      dateEN: dateENField || "Aug 10, 2026",
      readTimeID: readTimeIDField,
      readTimeEN: readTimeENField,
      featured: featuredField
    };

    if (editSlug) {
      setArticles(articles.map(a => a.slug === editSlug ? newArticle : a));
    } else {
      setArticles([...articles, newArticle]);
    }
    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
          Content Manager
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
          {locale === "id" ? "Pengelolaan Jurnal & Artikel" : "Travel Journal Management"}
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          {locale === "id" 
            ? "Tulis, edit, dan kelola artikel cerita perjalanan dalam dwi-bahasa."
            : "Write, edit, and publish bilingual travel stories and guides."}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-3 border-b border-slate-100">
            {isEditing ? "Edit Article" : "Write New Article"}
          </h2>

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
                    <Upload size={12} />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, setImageField)} />
                  </label>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Category (Indonesian)
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
                  Category (English)
                </label>
                <input 
                  type="text" 
                  value={categoryENField}
                  onChange={(e) => setCategoryENField(e.target.value)}
                  placeholder="e.g. Travel Stories"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
              </div>
            </div>

            {/* Title ID & EN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Title (Indonesian)
                </label>
                <input 
                  type="text" 
                  required
                  value={titleIDField}
                  onChange={(e) => setTitleIDField(e.target.value)}
                  placeholder="Judul dalam Bahasa Indonesia"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Title (English)
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

            {/* Excerpt ID & EN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Excerpt (Indonesian)
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
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Excerpt (English)
                </label>
                <textarea 
                  rows={2}
                  value={excerptENField}
                  onChange={(e) => setExcerptENField(e.target.value)}
                  placeholder="Short summary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
              </div>
            </div>

            {/* Content ID & EN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Content (Indonesian)
                </label>
                <textarea 
                  rows={5}
                  value={contentIDField}
                  onChange={(e) => setContentIDField(e.target.value)}
                  placeholder="Konten lengkap artikel..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Content (English)
                </label>
                <textarea 
                  rows={5}
                  value={contentENField}
                  onChange={(e) => setContentENField(e.target.value)}
                  placeholder="Full article content in English..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#A89053] text-slate-800"
                />
              </div>
            </div>

            {/* Date & Read time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Date (ID & EN)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={dateIDField}
                    onChange={(e) => setDateIDField(e.target.value)}
                    placeholder="e.g. 10 Agu 2026"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                  <input 
                    type="text" 
                    value={dateENField}
                    onChange={(e) => setDateENField(e.target.value)}
                    placeholder="e.g. Aug 10, 2026"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Read Time (ID & EN)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={readTimeIDField}
                    onChange={(e) => setReadTimeIDField(e.target.value)}
                    placeholder="5 mnt membaca"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                  <input 
                    type="text" 
                    value={readTimeENField}
                    onChange={(e) => setReadTimeENField(e.target.value)}
                    placeholder="5 min read"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>
            </div>

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
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]"
              >
                Reset
              </button>
              <button 
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[10px]"
              >
                {isEditing ? "Update Article" : "Publish Article"}
              </button>
            </div>
          </form>
        </div>

        {/* Articles List */}
        <div className="xl:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>{locale === "id" ? "Daftar Artikel Jurnal" : "Published Articles"}</span>
              <span className="text-xs font-mono text-slate-400">{articles.length} Posts</span>
            </h2>

            <div className="space-y-4">
              {articles.map((art) => (
                <div 
                  key={art.slug}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={art.image} alt={art.titleID} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono uppercase bg-[#A89053]/10 text-[#A89053] px-1.5 py-0.5 rounded font-bold">
                          {locale === "id" ? art.categoryID : art.categoryEN}
                        </span>
                        {art.featured && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-sans font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                            <Star size={9} className="fill-amber-600 text-amber-600" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-slate-800 text-sm">
                        {locale === "id" ? art.titleID : art.titleEN}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {locale === "id" ? art.dateID : art.dateEN} • {locale === "id" ? art.readTimeID : art.readTimeEN}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => handleEdit(art)}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 hover:text-amber-600 border border-slate-200 transition-colors text-slate-600"
                      aria-label="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(art.slug)}
                      className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors text-slate-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic">No articles found. Write one on the left.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
