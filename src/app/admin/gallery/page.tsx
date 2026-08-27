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
  Sparkles,
  Layers,
  Copy,
  ArrowLeft,
  Loader2,
  Eye,
  ExternalLink,
  BookOpen,
  Calendar,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, uploadMedia } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://limegreen-albatross-768813.hostingersite.com";

export type GalleryType = "VISUAL_JOURNAL" | "OUR_JOURNEYS";

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  createdAt: string;
}

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

export default function AdminGalleryPage() {
  const { locale } = useLanguage();
  const isIndo = locale === "id";

  const [mainTab, setMainTab] = useState<"STOREFRONT_GALLERY" | "MEDIA_LIBRARY">("STOREFRONT_GALLERY");
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [activeStorefrontTab, setActiveStorefrontTab] = useState<"ALL" | GalleryType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Media Detail Modal State
  const [selectedDetail, setSelectedDetail] = useState<MediaAsset | null>(null);

  // Form Mode State
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
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
    year: new Date().getFullYear().toString()
  });

  // Image Upload Loading State
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");

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

  // Resolve Image URL helper
  const resolveMediaUrl = (rawUrl: string): string => {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://localhost:3000/uploads/")) {
      return rawUrl.replace("http://localhost:3000/uploads/", `${API_BASE_URL}/uploads/`);
    }
    if (rawUrl.startsWith("/uploads/")) {
      return `${API_BASE_URL}${rawUrl}`;
    }
    return rawUrl;
  };

  // Fetch Media Assets from GET /admin/media
  const fetchMediaAssets = async () => {
    setIsLoadingMedia(true);
    try {
      const data = await apiFetch<MediaAsset[]>("/admin/media");
      if (Array.isArray(data)) {
        const formatted = data.map((item) => ({
          ...item,
          url: resolveMediaUrl(item.url)
        }));
        setMediaAssets(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch media assets", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const fetchGalleryItems = async () => {
    setIsLoadingItems(true);
    try {
      const data = await apiFetch<any[]>("/admin/gallery");
      if (Array.isArray(data)) {
        const formatted = data.map((item) => {
          let type: GalleryType = "VISUAL_JOURNAL";
          if (item.type === "STOREFRONT" || item.type === "OUR_JOURNEYS" || item.type === "MOMENTS") {
            type = "OUR_JOURNEYS";
          } else if (item.type === "EXPEDITION" || item.type === "VISUAL_JOURNAL") {
            type = "VISUAL_JOURNAL";
          }
          return {
            id: item.id.toString(),
            image: resolveMediaUrl(item.image),
            type,
            titleID: item.titleID || "",
            titleEN: item.titleEN || "",
            captionID: item.captionID || "",
            captionEN: item.captionEN || "",
            year: item.year || "2026",
            sortOrder: item.sortOrder || 0,
            isPublished: item.isPublished !== undefined ? item.isPublished : true,
          };
        });
        setItems(formatted);
        try {
          localStorage.setItem("klik_admin_gallery_items", JSON.stringify(formatted));
        } catch (e) { }
      }
    } catch (err) {
      console.error("Failed to fetch gallery items, falling back to localStorage", err);
      try {
        const saved = localStorage.getItem("klik_admin_gallery_items");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Load from API & LocalStorage
  useEffect(() => {
    fetchMediaAssets();
    fetchGalleryItems();
  }, []);

  const saveItemsToStorage = (newItems: GalleryItemData[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("klik_admin_gallery_items", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save gallery items to localStorage", e);
    }
  };

  // Open Form for Add
  const handleOpenAddModal = (presetType?: GalleryType) => {
    setEditingItem(null);
    setFormData({
      type: presetType || (activeStorefrontTab === "OUR_JOURNEYS" ? "OUR_JOURNEYS" : "VISUAL_JOURNAL"),
      image: "",
      titleID: "",
      titleEN: "",
      captionID: "",
      captionEN: "",
      year: new Date().getFullYear().toString()
    });
    setSelectedImages([]);
    setUrlInput("");
    setViewMode("form");
  };

  // Open Form for Edit
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
    setSelectedImages([item.image]);
    setUrlInput("");
    setViewMode("form");
  };

  // Handle Multiple Real Image Upload using POST /admin/media/upload
  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadMedia(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.filter(res => res && res.url).map(res => resolveMediaUrl(res.url));
      setSelectedImages(prev => [...prev, ...urls]);
      showToast(
        isIndo
          ? `${urls.length} gambar berhasil diunggah!`
          : `${urls.length} images uploaded successfully!`,
        "success"
      );
      fetchMediaAssets(); // Refresh media assets grid
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(
        err.message || (isIndo ? "Gagal mengunggah beberapa gambar" : "Failed to upload some images"),
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch Media Detail using GET /admin/media/{id}
  const handleViewDetail = async (id: string) => {
    try {
      const detail = await apiFetch<MediaAsset>(`/admin/media/${id}`);
      if (detail) {
        setSelectedDetail({
          ...detail,
          url: resolveMediaUrl(detail.url)
        });
      }
    } catch (err) {
      console.error("Failed to fetch media detail", err);
      showToast(isIndo ? "Gagal memuat detail media" : "Failed to fetch media detail", "error");
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleID.trim()) {
      showToast(isIndo ? "Judul/Lokasi (ID) wajib diisi" : "Title/Location (ID) is required", "error");
      return;
    }

    const targetImages = selectedImages.filter(url => url.trim() !== "");
    if (targetImages.length === 0) {
      showToast(isIndo ? "Mohon unggah atau pilih minimal satu gambar" : "Please upload or select at least one image", "error");
      return;
    }

    setIsSubmitting(true);
    const backendType = formData.type === "VISUAL_JOURNAL" ? "EXPEDITION" : "MOMENTS";

    try {
      if (editingItem) {
        const payload = {
          type: backendType,
          image: targetImages[0],
          titleID: formData.titleID,
          titleEN: formData.titleEN || formData.titleID,
          captionID: formData.captionID,
          captionEN: formData.captionEN,
          year: formData.year || new Date().getFullYear().toString(),
          sortOrder: (editingItem as any)?.sortOrder !== undefined ? (editingItem as any).sortOrder : 0,
          isPublished: (editingItem as any)?.isPublished !== undefined ? (editingItem as any).isPublished : true
        };
        await apiFetch(`/admin/gallery/${editingItem.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        showToast(isIndo ? "Foto galeri berhasil diperbarui!" : "Gallery item updated successfully!");
      } else {
        const createPromises = targetImages.map(imgUrl => {
          const payload = {
            type: backendType,
            image: imgUrl,
            titleID: formData.titleID,
            titleEN: formData.titleEN || formData.titleID,
            captionID: formData.captionID,
            captionEN: formData.captionEN,
            year: formData.year || new Date().getFullYear().toString(),
            sortOrder: 0,
            isPublished: true
          };
          return apiFetch("/admin/gallery", {
            method: "POST",
            body: JSON.stringify(payload)
          });
        });

        await Promise.all(createPromises);
        showToast(
          isIndo
            ? `${targetImages.length} foto galeri baru berhasil ditambahkan!`
            : `${targetImages.length} new gallery items added successfully!`
        );
      }
      await fetchGalleryItems();
      setViewMode("list");
    } catch (err: any) {
      console.error("Failed to save gallery item:", err);
      showToast(err.message || (isIndo ? "Gagal menyimpan foto galeri" : "Failed to save gallery item"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    if (confirm(isIndo ? "Hapus foto galeri ini dari storefront?" : "Delete this gallery item from storefront?")) {
      try {
        await apiFetch(`/admin/gallery/${id}`, {
          method: "DELETE"
        });
        showToast(isIndo ? "Foto galeri berhasil dihapus" : "Gallery item deleted successfully");
        await fetchGalleryItems();
      } catch (err: any) {
        console.error("Failed to delete gallery item:", err);
        showToast(err.message || (isIndo ? "Gagal menghapus foto galeri" : "Failed to delete gallery item"), "error");
      }
    }
  };

  // Delete Media Asset using DELETE /admin/media/{id}
  const handleDeleteMedia = async (id: string) => {
    if (confirm(isIndo ? "Hapus file media ini secara permanen dari server?" : "Permanently delete this media asset from the server?")) {
      try {
        await apiFetch(`/admin/media/${id}`, {
          method: "DELETE"
        });
        showToast(isIndo ? "Media berhasil dihapus dari server!" : "Media asset deleted successfully from server!", "success");
        if (selectedDetail?.id === id) {
          setSelectedDetail(null);
        }
        await fetchMediaAssets();
      } catch (err: any) {
        console.error("Failed to delete media asset:", err);
        showToast(err.message || (isIndo ? "Gagal menghapus media" : "Failed to delete media asset"), "error");
      }
    }
  };

  // Filter storefront items
  const filteredStorefrontItems = items.filter(item => {
    const matchesTab = activeStorefrontTab === "ALL" || item.type === activeStorefrontTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.titleID.toLowerCase().includes(q) ||
      (item.titleEN && item.titleEN.toLowerCase().includes(q)) ||
      (item.captionID && item.captionID.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  // Filter server media assets
  const filteredMediaAssets = mediaAssets.filter(asset => {
    const q = searchQuery.toLowerCase();
    return asset.filename.toLowerCase().includes(q) || asset.url.toLowerCase().includes(q);
  });

  const countVJ = items.filter(x => x.type === "VISUAL_JOURNAL").length;
  const countOJ = items.filter(x => x.type === "OUR_JOURNEYS").length;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-50 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === "success"
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

      {/* Media Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setSelectedDetail(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-[#0284C7] font-mono text-xs uppercase tracking-widest font-bold">
                <ImageIcon size={16} />
                <span>{isIndo ? "Detail Asset Media" : "Media Asset Detail"}</span>
              </div>

              <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src={selectedDetail.url}
                  alt={selectedDetail.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3 font-sans text-xs md:text-sm text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">ID:</span>
                  <span className="font-mono text-slate-800">{selectedDetail.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">{isIndo ? "Nama File:" : "Filename:"}</span>
                  <span className="font-mono text-slate-800">{selectedDetail.filename}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">MIME Type:</span>
                  <span className="font-mono bg-sky-50 text-[#0284C7] px-2 py-0.5 rounded font-bold">{selectedDetail.mimeType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">{isIndo ? "Tanggal Dibuat:" : "Created At:"}</span>
                  <span className="font-mono text-slate-800">{new Date(selectedDetail.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-slate-500">Direct URL:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDetail.url);
                        showToast(isIndo ? "URL media berhasil disalin!" : "Media URL copied to clipboard!", "success");
                      }}
                      className="inline-flex items-center gap-1 bg-[#0284C7] text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-[#0284C7]/90 transition-colors"
                    >
                      <Copy size={12} />
                      <span>{isIndo ? "Salin URL" : "Copy URL"}</span>
                    </button>
                    <a
                      href={selectedDetail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      title={isIndo ? "Buka URL di Tab Baru" : "Open URL in New Tab"}
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDeleteMedia(selectedDetail.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title={isIndo ? "Hapus Media Permanen" : "Permanently Delete Media"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#0284C7] font-mono text-xs uppercase tracking-widest font-bold mb-1">
            <ImageIcon size={16} />
            <span>{isIndo ? "Pengelolaan Galeri Media & Storefront" : "Media & Storefront Gallery Management"}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0F2C59] font-bold">
            {isIndo ? "Galeri Media & Foto Website" : "Website Photo & Media Gallery"}
          </h1>
        </div>

        {/* Top Main Tab Navigation */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto shrink-0">
          <button
            onClick={() => { setMainTab("STOREFRONT_GALLERY"); setViewMode("list"); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${mainTab === "STOREFRONT_GALLERY"
              ? "bg-[#0F2C59] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Layers size={14} />
            <span>{isIndo ? `Galeri Storefront (${items.length})` : `Storefront Gallery (${items.length})`}</span>
          </button>
          <button
            onClick={() => { setMainTab("MEDIA_LIBRARY"); setViewMode("list"); }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${mainTab === "MEDIA_LIBRARY"
              ? "bg-[#0284C7] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Sparkles size={14} />
            <span>{isIndo ? `Aset Media Server (${mediaAssets.length})` : `Server Media Assets (${mediaAssets.length})`}</span>
          </button>
        </div>
      </div>

      {/* Content Body based on mainTab & viewMode */}
      {viewMode === "form" ? (
        /* Form View Mode */
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#0284C7] font-bold block">
                {editingItem ? "Edit Photo Item" : "Add New Storefront Photo"}
              </span>
              <h2 className="font-serif text-xl font-bold text-[#0F2C59] mt-0.5">
                {editingItem
                  ? (isIndo ? "Edit Foto Galeri" : "Edit Gallery Item")
                  : (isIndo ? "Tambah Foto Galeri Baru" : "Add New Gallery Photo")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{isIndo ? "Kembali" : "Back"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target Section Switcher */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 font-bold">
                {isIndo ? "Target Section / Tampilan di Website *" : "Target Section on Website *"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col space-y-1.5 ${formData.type === "VISUAL_JOURNAL"
                    ? "border-[#0284C7] bg-sky-50/50 text-[#0F2C59]"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">📷 Galeri Ekspedisi</span>
                    <input
                      type="radio"
                      name="gallery_type"
                      value="VISUAL_JOURNAL"
                      checked={formData.type === "VISUAL_JOURNAL"}
                      onChange={() => setFormData(prev => ({ ...prev, type: "VISUAL_JOURNAL" }))}
                      className="text-[#0284C7]"
                    />
                  </div>
                  <span className="font-mono text-[9px] text-slate-500">
                    Halaman /journal ("DOKUMENTASI FOTO Galeri Ekspedisi")
                  </span>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col space-y-1.5 ${formData.type === "OUR_JOURNEYS"
                    ? "border-[#0F2C59] bg-slate-100 text-[#0F2C59]"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">📸 Momen Bersama Kami</span>
                    <input
                      type="radio"
                      name="gallery_type"
                      value="OUR_JOURNEYS"
                      checked={formData.type === "OUR_JOURNEYS"}
                      onChange={() => setFormData(prev => ({ ...prev, type: "OUR_JOURNEYS" }))}
                      className="text-[#0F2C59]"
                    />
                  </div>
                  <span className="font-mono text-[9px] text-slate-500">
                    Halaman Utama / ("GALLERY Momen Bersama Kami")
                  </span>
                </label>
              </div>
            </div>

            {/* Image Selection / Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  {isIndo ? "Unggah Gambar / Pilih Aset Media *" : "Upload Image / Choose Media Asset *"}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0284C7] text-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        setSelectedImages(prev => prev.includes(urlInput.trim()) ? prev : [...prev, urlInput.trim()]);
                        setUrlInput("");
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] uppercase font-bold transition-all shrink-0 cursor-pointer border border-slate-200"
                  >
                    {isIndo ? "+ Tambah URL" : "+ Add URL"}
                  </button>
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] text-white hover:bg-[#0284C7]/90 font-mono text-[10px] uppercase font-bold cursor-pointer shrink-0 transition-all shadow-md shadow-[#0284C7]/20">
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{isUploading ? "Uploading..." : (isIndo ? "Unggah File" : "Upload File")}</span>
                    <input type="file" accept="image/*" multiple className="hidden" disabled={isUploading} onChange={handleMultipleFileUpload} />
                  </label>
                </div>

                {/* Quick Pick from Server Media Assets */}
                {mediaAssets.length > 0 && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                      {isIndo ? "Pilih cepat dari Aset Media Server (Klik untuk pilih/hapus):" : "Quick pick from server media assets (Click to toggle):"}
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {mediaAssets.slice(0, 12).map((asset) => {
                        const isSelected = selectedImages.includes(asset.url);
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => {
                              if (editingItem) {
                                setSelectedImages([asset.url]);
                                setFormData(prev => ({ ...prev, image: asset.url }));
                              } else {
                                setSelectedImages(prev =>
                                  prev.includes(asset.url)
                                    ? prev.filter(u => u !== asset.url)
                                    : [...prev, asset.url]
                                );
                              }
                            }}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 relative transition-all ${isSelected ? "border-[#0284C7] ring-2 ring-[#0284C7]/30 scale-105" : "border-slate-200 opacity-80 hover:opacity-100"
                              }`}
                            title={asset.filename}
                          >
                            <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#0284C7]/30 flex items-center justify-center text-white font-bold text-xs">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Selected Images Grid */}
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                      {isIndo ? `Foto Terpilih (${selectedImages.length}):` : `Selected Photos (${selectedImages.length}):`}
                    </span>
                    {!editingItem && (
                      <button
                        type="button"
                        onClick={() => setSelectedImages([])}
                        className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                      >
                        {isIndo ? "Hapus Semua" : "Clear All"}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {selectedImages.map((imgUrl, idx) => (
                      <div key={idx} className="h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group">
                        <img src={imgUrl} alt={`Selected ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow"
                          title={isIndo ? "Hapus foto ini" : "Remove photo"}
                        >
                          <X size={10} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white font-mono text-[8px] px-1 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Title / Location ID & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  {isIndo ? "Judul / Lokasi (ID) *" : "Title / Location (ID) *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleID}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleID: e.target.value }))}
                  placeholder="e.g. Raja Ampat, Papua Barat"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0284C7] text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  {isIndo ? "Judul / Lokasi (EN)" : "Title / Location (EN)"}
                </label>
                <input
                  type="text"
                  value={formData.titleEN}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEN: e.target.value }))}
                  placeholder="e.g. Raja Ampat, West Papua"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0284C7] text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Caption ID & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  {isIndo ? "Keterangan / Caption (ID)" : "Caption (ID)"}
                </label>
                <textarea
                  rows={2}
                  value={formData.captionID}
                  onChange={(e) => setFormData(prev => ({ ...prev, captionID: e.target.value }))}
                  placeholder="Keterangan singkat momen foto..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0284C7] text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  {isIndo ? "Keterangan / Caption (EN)" : "Caption (EN)"}
                </label>
                <textarea
                  rows={2}
                  value={formData.captionEN}
                  onChange={(e) => setFormData(prev => ({ ...prev, captionEN: e.target.value }))}
                  placeholder="Short description of the moment..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0284C7] text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                {isIndo ? "Batal" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-md shadow-[#0F2C59]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                <span>
                  {editingItem ? (isIndo ? "Perbarui Foto" : "Update Photo") : (isIndo ? "Simpan Foto Galeri" : "Save Gallery Photo")}
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : mainTab === "STOREFRONT_GALLERY" ? (
        /* Storefront Gallery List View */
        <div className="space-y-6">
          {/* Header Bar for Storefront Gallery */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveStorefrontTab("ALL")}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeStorefrontTab === "ALL"
                  ? "bg-[#0F2C59] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {isIndo ? `Semua Storefront (${items.length})` : `All Storefront (${items.length})`}
              </button>
              <button
                onClick={() => setActiveStorefrontTab("VISUAL_JOURNAL")}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeStorefrontTab === "VISUAL_JOURNAL"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {isIndo ? `Galeri Ekspedisi /journal (${countVJ})` : `Expedition /journal (${countVJ})`}
              </button>
              <button
                onClick={() => setActiveStorefrontTab("OUR_JOURNEYS")}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${activeStorefrontTab === "OUR_JOURNEYS"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {isIndo ? `Momen Bersama Home / (${countOJ})` : `Home Moments / (${countOJ})`}
              </button>
            </div>

            {/* Actions: Search & Add */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isIndo ? "Cari judul/lokasi..." : "Search title/location..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>

              <button
                onClick={() => handleOpenAddModal()}
                className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-md shadow-[#0F2C59]/20 shrink-0"
              >
                <Plus size={16} />
                <span>{isIndo ? "Tambah Foto Galeri" : "Add Gallery Photo"}</span>
              </button>
            </div>
          </div>

          {/* Grid Display for Storefront Gallery Items */}
          {isLoadingItems ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <Loader2 size={32} className="text-[#0284C7] animate-spin" />
              <p className="font-sans text-xs text-slate-500 font-medium">
                {isIndo ? "Memuat foto galeri dari server..." : "Loading gallery items from backend..."}
              </p>
            </div>
          ) : filteredStorefrontItems.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200 space-y-3">
              <ImageIcon size={40} className="text-slate-300 mx-auto mb-1" />
              <h3 className="font-serif text-lg font-bold text-[#0F2C59]">
                {isIndo ? "Belum Ada Foto Galeri Storefront" : "No Storefront Gallery Items"}
              </h3>
              <p className="font-sans text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {isIndo
                  ? 'Klik tombol "Tambah Foto Galeri" di atas untuk menambahkan foto baru yang langsung tampil di halaman / (Momen Bersama Kami) atau halaman /journal (Galeri Ekspedisi).'
                  : 'Click the "Add Gallery Photo" button above to add new photos displayed on the home page or journal page.'}
              </p>
              <button
                onClick={() => handleOpenAddModal()}
                className="inline-flex items-center gap-2 bg-[#0284C7] text-white px-4 py-2 rounded-xl font-mono text-xs uppercase font-bold hover:bg-[#0284C7]/90 transition-all cursor-pointer mt-2"
              >
                <Plus size={14} />
                <span>{isIndo ? "Tambah Foto Baru Now" : "Add Photo Now"}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredStorefrontItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.titleID}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-md backdrop-blur-md ${item.type === "VISUAL_JOURNAL"
                          ? "bg-[#0284C7] text-white"
                          : "bg-[#0F2C59] text-white"
                          }`}
                      >
                        {item.type === "VISUAL_JOURNAL" ? "📷 Galeri Ekspedisi (/journal)" : "📸 Momen Bersama (Home /)"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#0F2C59] line-clamp-1">
                        {item.titleID}
                      </h4>
                      {item.captionID && (
                        <p className="font-sans text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.captionID}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 font-bold">{item.year || "2026"}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Server Media Assets View (`GET /admin/media`) */
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <div className="flex items-center gap-2 text-[#0284C7] font-mono text-xs uppercase tracking-wider font-bold shrink-0">
                <Sparkles size={14} />
                <span>{isIndo ? "Aset Media Server" : "Server Media Assets"}</span>
              </div>

              {/* Search Filter for Media Assets */}
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isIndo ? "Cari nama file / URL..." : "Search filename / URL..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>
            </div>

            {/* Direct File Upload Action */}
            <label className="inline-flex items-center justify-center gap-2 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all shadow-md shadow-[#0284C7]/20 shrink-0">
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              <span>{isUploading ? (isIndo ? "Mengunggah..." : "Uploading...") : (isIndo ? "Unggah Gambar Baru" : "Upload New Image")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {isLoadingMedia ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 size={32} className="text-[#0284C7] animate-spin" />
              <p className="font-sans text-xs text-slate-500 font-medium">
                {isIndo ? "Memuat aset media dari server..." : "Loading media assets from backend..."}
              </p>
            </div>
          ) : filteredMediaAssets.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ImageIcon size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="font-sans text-sm text-slate-600 font-semibold">
                {isIndo ? "Tidak ada media terunggah ditemukan" : "No uploaded media found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-[#0284C7]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(asset.id)}
                        className="p-2 bg-white text-[#0F2C59] rounded-xl hover:bg-sky-50 shadow-md transition-colors"
                        title={isIndo ? "Lihat Detail Media" : "View Media Detail"}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          showToast(isIndo ? "URL media berhasil disalin!" : "Media URL copied!", "success");
                        }}
                        className="p-2 bg-[#0284C7] text-white rounded-xl hover:bg-[#0284C7]/90 shadow-md transition-colors"
                        title={isIndo ? "Salin Direct URL" : "Copy Direct URL"}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(asset.id)}
                        className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md transition-colors"
                        title={isIndo ? "Hapus Media Permanen" : "Permanently Delete Media"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="font-mono text-[11px] font-bold text-slate-800 truncate" title={asset.filename}>
                      {asset.filename}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase">
                      <span>{asset.mimeType.split("/")[1] || "media"}</span>
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
