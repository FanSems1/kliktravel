"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  Filter,
  Sparkles,
  Layers,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type GalleryType = "VISUAL_JOURNAL" | "OUR_JOURNEYS";

export interface GalleryItemData {
  id: string;
  image: string;
  type: GalleryType;
  titleID: string;
  titleEN: string;
  captionID?: string;
  captionEN?: string;
  year?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItemData[] = [
  // Visual Journal Default Items
  {
    id: "gal-vj-1",
    type: "VISUAL_JOURNAL",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    titleID: "Raja Ampat, Papua Barat",
    titleEN: "Raja Ampat, West Papua",
    captionID: "Keindahan gugusan pulau karang dan air laut jernih yang menjadi surga penyelam.",
    captionEN: "Untouched karst islands surrounded by crystal-clear waters in an underwater paradise.",
    year: "2026"
  },
  {
    id: "gal-vj-2",
    type: "VISUAL_JOURNAL",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200",
    titleID: "Gunung Bromo, Jawa Timur",
    titleEN: "Mount Bromo, East Java",
    captionID: "Kabut pagi menembus lautan pasir saat matahari terbit di atas kaldera.",
    captionEN: "Morning mist breaking through the sand sea at dawn over the volcanic caldera.",
    year: "2026"
  },
  {
    id: "gal-vj-3",
    type: "VISUAL_JOURNAL",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
    titleID: "Ubud, Bali",
    titleEN: "Ubud, Bali",
    captionID: "Ketenangan terasering sawah hijau yang membentang di pedesaan Ubud.",
    captionEN: "Serene green rice terraces cascading through the peaceful valleys of Ubud.",
    year: "2026"
  },
  {
    id: "gal-vj-4",
    type: "VISUAL_JOURNAL",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
    titleID: "Teluk Ha Long, Vietnam",
    titleEN: "Ha Long Bay, Vietnam",
    captionID: "Pelayaran megah di antara pilar-pilar batu kapur kuno yang diselimuti legenda.",
    captionEN: "Cruising amidst towering emerald karst pillars steeped in ancient legends.",
    year: "2025"
  },

  // Our Journeys Home Default Items
  {
    id: "gal-oj-1",
    type: "OUR_JOURNEYS",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
    titleID: "KECERIAAN DI RAJA AMPAT, INDONESIA",
    titleEN: "JOYFUL MOMENTS IN RAJA AMPAT, INDONESIA"
  },
  {
    id: "gal-oj-2",
    type: "OUR_JOURNEYS",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800",
    titleID: "KEBERSAMAAN KELUARGA DI SWISS, EROPA",
    titleEN: "FAMILY GATHERING IN SWISS ALPS, EUROPE"
  },
  {
    id: "gal-oj-3",
    type: "OUR_JOURNEYS",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800",
    titleID: "PETUALANGAN GRUP DI KYOTO, JEPANG",
    titleEN: "GROUP ADVENTURES IN KYOTO, JAPAN"
  },
  {
    id: "gal-oj-4",
    type: "OUR_JOURNEYS",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    titleID: "MOMEN INDAH DI GUNUNG BROMO, INDONESIA",
    titleEN: "SERENE LANDSCAPES AT MOUNT BROMO, INDONESIA"
  }
];

export default function AdminGalleryPage() {
  const { locale } = useLanguage();
  const isIndo = locale === "id";

  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | GalleryType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    type: GalleryType;
    image: string;
    titleID: string;
    titleEN: string;
    captionID: string;
    captionEN: string;
    year: string;
  }>({
    type: "VISUAL_JOURNAL",
    image: "",
    titleID: "",
    titleEN: "",
    captionID: "",
    captionEN: "",
    year: "2026"
  });

  // Image Upload Loading State
  const [isUploading, setIsUploading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem("klik_admin_gallery_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
      setItems(DEFAULT_GALLERY_ITEMS);
      localStorage.setItem("klik_admin_gallery_items", JSON.stringify(DEFAULT_GALLERY_ITEMS));
    } catch (e) {
      console.error(e);
      setItems(DEFAULT_GALLERY_ITEMS);
    }
  }, []);

  const saveItemsToStorage = (newItems: GalleryItemData[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("klik_admin_gallery_items", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save gallery items to localStorage", e);
    }
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      type: activeTab === "OUR_JOURNEYS" ? "OUR_JOURNEYS" : "VISUAL_JOURNAL",
      image: "",
      titleID: "",
      titleEN: "",
      captionID: "",
      captionEN: "",
      year: new Date().getFullYear().toString()
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      image: item.image,
      titleID: item.titleID,
      titleEN: item.titleEN,
      captionID: item.captionID || "",
      captionEN: item.captionEN || "",
      year: item.year || new Date().getFullYear().toString()
    });
    setIsModalOpen(true);
  };

  // Handle Image Upload Simulation / FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setIsUploading(false);
        showToast(
          isIndo ? "Gambar berhasil diunggah" : "Image uploaded successfully",
          "success"
        );
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      showToast(isIndo ? "Mohon unggah atau masukkan URL gambar" : "Please upload or enter image URL", "error");
      return;
    }
    if (!formData.titleID.trim()) {
      showToast(isIndo ? "Judul/Lokasi (ID) wajib diisi" : "Title/Location (ID) is required", "error");
      return;
    }

    if (editingItem) {
      // Edit
      const updatedList = items.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              type: formData.type,
              image: formData.image,
              titleID: formData.titleID,
              titleEN: formData.titleEN || formData.titleID,
              captionID: formData.captionID,
              captionEN: formData.captionEN,
              year: formData.year
            }
          : item
      );
      saveItemsToStorage(updatedList);
      showToast(isIndo ? "Foto galeri berhasil diperbarui!" : "Gallery item updated successfully!");
    } else {
      // Create
      const newItem: GalleryItemData = {
        id: `gal-${Date.now()}`,
        type: formData.type,
        image: formData.image,
        titleID: formData.titleID,
        titleEN: formData.titleEN || formData.titleID,
        captionID: formData.captionID,
        captionEN: formData.captionEN,
        year: formData.year
      };
      saveItemsToStorage([newItem, ...items]);
      showToast(isIndo ? "Foto galeri baru berhasil ditambahkan!" : "New gallery item added successfully!");
    }

    setIsModalOpen(false);
  };

  // Delete Item
  const handleDelete = (id: string) => {
    if (confirm(isIndo ? "Hapus foto galeri ini dari database?" : "Delete this gallery item from database?")) {
      const filtered = items.filter(item => item.id !== id);
      saveItemsToStorage(filtered);
      showToast(isIndo ? "Foto galeri berhasil dihapus" : "Gallery item deleted successfully");
    }
  };

  // Filtered List
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === "ALL" || item.type === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.titleID.toLowerCase().includes(q) || 
      item.titleEN.toLowerCase().includes(q) ||
      (item.captionID && item.captionID.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-50 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === "success" 
                ? "bg-[#0F2C59] text-white border-[#0284C7]/40" 
                : "bg-red-900 text-white border-red-500/40"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={18} className="text-[#0284C7] shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            )}
            <span className="font-sans text-xs md:text-sm font-medium tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#0284C7] font-mono text-xs uppercase tracking-widest font-bold mb-1">
            <ImageIcon size={16} />
            <span>{isIndo ? "Manajemen Galeri Media" : "Media Gallery Management"}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0F2C59] font-bold">
            {isIndo ? "Galeri Foto Storefront" : "Storefront Photo Gallery"}
          </h1>
          <p className="font-sans text-slate-500 text-xs md:text-sm mt-1">
            {isIndo 
              ? "Kelola foto untuk section Visual Journal (Moments Captured) dan section Our Journeys (Home)."
              : "Manage images for the Visual Journal (Moments Captured) section and Our Journeys (Home) carousel."}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-[#A89053] hover:bg-[#A89053]/90 text-white px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold shadow-md shadow-[#A89053]/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{isIndo ? "Tambah Foto Galeri" : "Add Gallery Item"}</span>
        </button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Placement Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ALL"
                ? "bg-[#0F2C59] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {isIndo ? "Semua Galeri" : "All Galleries"} ({items.length})
          </button>
          
          <button
            onClick={() => setActiveTab("VISUAL_JOURNAL")}
            className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "VISUAL_JOURNAL"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Sparkles size={14} />
            <span>VISUAL JOURNAL</span>
            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">
              {items.filter(x => x.type === "VISUAL_JOURNAL").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("OUR_JOURNEYS")}
            className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "OUR_JOURNEYS"
                ? "bg-[#A89053] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Globe size={14} />
            <span>OUR JOURNEYS (HOME)</span>
            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">
              {items.filter(x => x.type === "OUR_JOURNEYS").length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder={isIndo ? "Cari judul/lokasi..." : "Search title/location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
          />
        </div>
      </div>

      {/* Gallery Items Grid / Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <ImageIcon size={40} className="text-slate-300 animate-pulse" />
          <p className="font-serif text-lg text-slate-700 font-semibold">
            {isIndo ? "Belum Ada Foto Galeri" : "No Gallery Items Found"}
          </p>
          <p className="font-sans text-xs text-slate-400 max-w-sm">
            {isIndo 
              ? "Klik tombol Tambah Foto Galeri untuk menambahkan foto baru dengan pilihan jenis section."
              : "Click the Add Gallery Item button to create a new entry with placement type selection."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Preview & Badge */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.titleID} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {item.type === "VISUAL_JOURNAL" ? (
                      <span className="bg-[#0284C7] text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                        <Sparkles size={10} /> VISUAL JOURNAL
                      </span>
                    ) : (
                      <span className="bg-[#A89053] text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                        <Globe size={10} /> OUR JOURNEYS (HOME)
                      </span>
                    )}
                  </div>
                  {item.year && (
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full">
                      {item.year}
                    </span>
                  )}
                </div>

                {/* Content details */}
                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-slate-800 text-sm md:text-base leading-snug line-clamp-1">
                    {item.titleID}
                  </h3>
                  {item.titleEN !== item.titleID && (
                    <p className="font-sans text-xs text-slate-400 italic line-clamp-1">
                      EN: {item.titleEN}
                    </p>
                  )}
                  {item.captionID && (
                    <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                      {item.captionID}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  ID: {item.id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title={isIndo ? "Edit Foto" : "Edit Item"}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title={isIndo ? "Hapus Foto" : "Delete Item"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#0284C7]/10 text-[#0284C7] rounded-xl">
                    <ImageIcon size={18} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F2C59]">
                    {editingItem 
                      ? (isIndo ? "Edit Foto Galeri" : "Edit Gallery Item") 
                      : (isIndo ? "Tambah Foto Galeri Baru" : "Add New Gallery Item")}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Placement Type Selector (JENIS SELECT DROPDOWN) */}
                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isIndo ? "Jenis Placement Galeri (Dropdown)" : "Gallery Placement Type (Dropdown)"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as GalleryType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-[#0F2C59] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                  >
                    <option value="VISUAL_JOURNAL">
                      ✨ VISUAL JOURNAL - Moments Captured (Tampil di Halaman /journal)
                    </option>
                    <option value="OUR_JOURNEYS">
                      🌐 OUR JOURNEYS - Together (Tampil di Halaman Utama / Home)
                    </option>
                  </select>
                  <p className="font-sans text-[11px] text-slate-400 italic">
                    {isIndo 
                      ? "Pilih 'VISUAL JOURNAL' untuk momen galeri travel journal, atau 'OUR JOURNEYS' untuk carousel kebersamaan di homepage."
                      : "Choose 'VISUAL JOURNAL' for travel journal gallery page, or 'OUR JOURNEYS' for homepage carousel."}
                  </p>
                </div>

                {/* Image Upload / URL Input */}
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isIndo ? "Foto Galeri" : "Gallery Image"} <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors border border-slate-200">
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-[#0284C7] rounded-full animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>{isUploading ? (isIndo ? "Mengunggah..." : "Uploading...") : (isIndo ? "Unggah Gambar" : "Upload Image")}</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-400 font-mono uppercase">{isIndo ? "Atau URL:" : "Or URL:"}</span>
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                    />
                  </div>

                  {formData.image && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Title / Location (ID & EN) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {isIndo ? "Judul / Lokasi (ID)" : "Title / Location (ID)"} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder={formData.type === "OUR_JOURNEYS" ? "KECERIAAN DI RAJA AMPAT" : "Raja Ampat, Papua Barat"}
                      value={formData.titleID}
                      onChange={(e) => setFormData({ ...formData, titleID: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {isIndo ? "Judul / Lokasi (EN)" : "Title / Location (EN)"}
                    </label>
                    <input 
                      type="text"
                      placeholder={formData.type === "OUR_JOURNEYS" ? "JOYFUL MOMENTS IN RAJA AMPAT" : "Raja Ampat, West Papua"}
                      value={formData.titleEN}
                      onChange={(e) => setFormData({ ...formData, titleEN: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                    />
                  </div>
                </div>

                {/* Caption / Description (Only relevant for Visual Journal) */}
                {formData.type === "VISUAL_JOURNAL" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {isIndo ? "Deskripsi / Caption (ID)" : "Caption / Description (ID)"}
                      </label>
                      <textarea 
                        rows={2}
                        placeholder={isIndo ? "Keindahan gugusan pulau karang dan air laut jernih..." : "Caption in Indonesian..."}
                        value={formData.captionID}
                        onChange={(e) => setFormData({ ...formData, captionID: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {isIndo ? "Deskripsi / Caption (EN)" : "Caption / Description (EN)"}
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="Untouched karst islands..."
                          value={formData.captionEN}
                          onChange={(e) => setFormData({ ...formData, captionEN: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {isIndo ? "Tahun" : "Year"}
                        </label>
                        <input 
                          type="text"
                          placeholder="2026"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Form Footer Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isIndo ? "Batal" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#A89053] hover:bg-[#A89053]/90 text-white px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold shadow-md shadow-[#A89053]/20 transition-all cursor-pointer"
                  >
                    {editingItem ? (isIndo ? "Simpan Perubahan" : "Save Changes") : (isIndo ? "Simpan Foto" : "Save Photo")}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
