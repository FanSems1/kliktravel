"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Compass, MapPin, Tag, Hotel, Calendar, X, Eye, Image as ImageIcon, Plane, HelpCircle, FileText, Upload, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedJourneys, Journey, JourneyChapter, JourneyAccommodation, JourneyItinerary, JourneyFAQ } from "@/data/journeys";
import { localizedTourPackages, TourPackageDetail, ItineraryDay } from "@/data/tours";
import { translateText } from "@/utils/translator";

export default function AdminJourneysPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"curated" | "open">("curated");
  
  // Form active language tab switcher
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);

  // States for Curated Journeys
  const [curatedList, setCuratedList] = useState<Journey[]>([]);
  const [isEditingCurated, setIsEditingCurated] = useState(false);
  const [editCuratedId, setEditCuratedId] = useState<string | null>(null);

  // States for Open Trips
  const [openTripsList, setOpenTripsList] = useState<TourPackageDetail[]>([]);
  const [isEditingOpenTrip, setIsEditingOpenTrip] = useState(false);
  const [editOpenTripSlug, setEditOpenTripSlug] = useState<string | null>(null);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const savedCurated = localStorage.getItem("klik_admin_curated_journeys");
      if (savedCurated) {
        setCuratedList(JSON.parse(savedCurated));
      } else {
        setCuratedList(localizedJourneys[locale] || []);
      }

      const savedOpen = localStorage.getItem("klik_admin_open_trips");
      if (savedOpen) {
        setOpenTripsList(JSON.parse(savedOpen));
      } else {
        setOpenTripsList(Object.values(localizedTourPackages[locale] || {}));
      }
    } catch {
      setCuratedList(localizedJourneys[locale] || []);
      setOpenTripsList(Object.values(localizedTourPackages[locale] || {}));
    }
  }, [locale]);

  const saveCuratedStorage = (newList: Journey[]) => {
    setCuratedList(newList);
    try {
      localStorage.setItem("klik_admin_curated_journeys", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOpenTripsStorage = (newList: TourPackageDetail[]) => {
    setOpenTripsList(newList);
    try {
      localStorage.setItem("klik_admin_open_trips", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

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

  // ==========================================
  // FORM FIELDS: CURATED JOURNEY (Journey)
  // ==========================================
  const [cjId, setCjId] = useState("");
  const [cjSlug, setCjSlug] = useState("");
  
  // Dual Language Title
  const [cjTitleID, setCjTitleID] = useState("");
  const [cjTitleEN, setCjTitleEN] = useState("");

  const [cjDestination, setCjDestination] = useState("");
  
  // Dual Language Subtitle
  const [cjSubtitleID, setCjSubtitleID] = useState("");
  const [cjSubtitleEN, setCjSubtitleEN] = useState("");

  const [cjDurationDays, setCjDurationDays] = useState(5);
  const [cjDurationLabel, setCjDurationLabel] = useState("5 Hari");
  const [cjDates, setCjDates] = useState("");
  const [cjAirline, setCjAirline] = useState("");
  const [cjPrice, setCjPrice] = useState("");
  const [cjPriceRaw, setCjPriceRaw] = useState(0);
  const [cjTravelMonth, setCjTravelMonth] = useState("");
  const [cjTravelStyle, setCjTravelStyle] = useState("");
  const [cjImage, setCjImage] = useState("");
  
  // Dual Language Intro
  const [cjIntroHeadingID, setCjIntroHeadingID] = useState("");
  const [cjIntroHeadingEN, setCjIntroHeadingEN] = useState("");
  const [cjIntroDescID, setCjIntroDescID] = useState("");
  const [cjIntroDescEN, setCjIntroDescEN] = useState("");

  const [cjCountriesCount, setCjCountriesCount] = useState(1);

  // Sub-arrays for Curated Journeys
  const [cjChapters, setCjChapters] = useState<JourneyChapter[]>([]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterText, setNewChapterText] = useState("");

  const [cjItinerary, setCjItinerary] = useState<JourneyItinerary[]>([]);
  const [newItDay, setNewItDay] = useState("");
  const [newItTitle, setNewItTitle] = useState("");
  const [newItDesc, setNewItDesc] = useState("");

  const [cjHighlights, setCjHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");

  const [cjAccommodations, setCjAccommodations] = useState<JourneyAccommodation[]>([]);
  const [newAccName, setNewAccName] = useState("");
  const [newAccCity, setNewAccCity] = useState("");
  const [newAccRoomType, setNewAccRoomType] = useState("");

  const [cjFlightRoute, setCjFlightRoute] = useState<string[]>([]);
  const [newFlightCity, setNewFlightCity] = useState("");

  const [cjInclusions, setCjInclusions] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState("");

  const [cjExclusions, setCjExclusions] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState("");

  const [cjFAQs, setCjFAQs] = useState<JourneyFAQ[]>([]);
  const [newFAQQuestion, setNewFAQQuestion] = useState("");
  const [newFAQAnswer, setNewFAQAnswer] = useState("");

  // Gallery Photos
  const [cjGallery, setCjGallery] = useState<string[]>([]);

  // ==========================================
  // FORM FIELDS: OPEN TRIP (TourPackageDetail)
  // ==========================================
  const [otSlug, setOtSlug] = useState("");
  
  // Dual language Name & Tagline
  const [otNameID, setOtNameID] = useState("");
  const [otNameEN, setOtNameEN] = useState("");

  const [otTaglineID, setOtTaglineID] = useState("");
  const [otTaglineEN, setOtTaglineEN] = useState("");

  const [otDuration, setOtDuration] = useState("");
  const [otPrice, setOtPrice] = useState("");
  const [otHotelRating, setOtHotelRating] = useState("");
  const [otFeaturedImage, setOtFeaturedImage] = useState("");
  const [otHighlights, setOtHighlights] = useState<string[]>([]);
  const [otInclusions, setOtInclusions] = useState<string[]>([]);
  const [otExclusions, setOtExclusions] = useState<string[]>([]);
  const [otGallery, setOtGallery] = useState<string[]>([]);

  // Itinerary for Open Trips
  const [otItinerary, setOtItinerary] = useState<ItineraryDay[]>([]);
  const [newOtItDay, setNewOtItDay] = useState(1);
  const [newOtItTitle, setNewOtItTitle] = useState("");
  const [newOtItDesc, setNewOtItDesc] = useState("");
  const [newOtItHotel, setNewOtItHotel] = useState("");
  const [newOtItImage, setNewOtItImage] = useState("");
  const [newOtItActivities, setNewOtItActivities] = useState<string[]>([]);

  // ==========================================
  // AUTO-TRANSLATE HANDLERS
  // ==========================================
  const handleAutoTranslateCurated = async () => {
    setIsTranslating(true);
    if (formLang === "id") {
      if (cjTitleID.trim()) {
        const res = await translateText(cjTitleID, "id", "en");
        setCjTitleEN(res);
      }
      if (cjSubtitleID.trim()) {
        const res = await translateText(cjSubtitleID, "id", "en");
        setCjSubtitleEN(res);
      }
      if (cjIntroHeadingID.trim()) {
        const res = await translateText(cjIntroHeadingID, "id", "en");
        setCjIntroHeadingEN(res);
      }
      if (cjIntroDescID.trim()) {
        const res = await translateText(cjIntroDescID, "id", "en");
        setCjIntroDescEN(res);
      }
    } else {
      if (cjTitleEN.trim()) {
        const res = await translateText(cjTitleEN, "en", "id");
        setCjTitleID(res);
      }
      if (cjSubtitleEN.trim()) {
        const res = await translateText(cjSubtitleEN, "en", "id");
        setCjSubtitleID(res);
      }
      if (cjIntroHeadingEN.trim()) {
        const res = await translateText(cjIntroHeadingEN, "en", "id");
        setCjIntroHeadingID(res);
      }
      if (cjIntroDescEN.trim()) {
        const res = await translateText(cjIntroDescEN, "en", "id");
        setCjIntroDescID(res);
      }
    }
    setIsTranslating(false);
  };

  const handleAutoTranslateOpenTrip = async () => {
    setIsTranslating(true);
    if (formLang === "id") {
      if (otNameID.trim()) {
        const res = await translateText(otNameID, "id", "en");
        setOtNameEN(res);
      }
      if (otTaglineID.trim()) {
        const res = await translateText(otTaglineID, "id", "en");
        setOtTaglineEN(res);
      }
    } else {
      if (otNameEN.trim()) {
        const res = await translateText(otNameEN, "en", "id");
        setOtNameID(res);
      }
      if (otTaglineEN.trim()) {
        const res = await translateText(otTaglineEN, "en", "id");
        setOtTaglineID(res);
      }
    }
    setIsTranslating(false);
  };

  // ==========================================
  // RESET & EDIT HANDLERS
  // ==========================================
  const resetCuratedForm = () => {
    setCjId("");
    setCjSlug("");
    setCjTitleID("");
    setCjTitleEN("");
    setCjDestination("");
    setCjSubtitleID("");
    setCjSubtitleEN("");
    setCjDurationDays(5);
    setCjDurationLabel("5 Hari");
    setCjDates("");
    setCjAirline("");
    setCjPrice("");
    setCjPriceRaw(0);
    setCjTravelMonth("");
    setCjTravelStyle("");
    setCjImage("");
    setCjIntroHeadingID("");
    setCjIntroHeadingEN("");
    setCjIntroDescID("");
    setCjIntroDescEN("");
    setCjCountriesCount(1);
    setCjChapters([]);
    setCjItinerary([]);
    setCjHighlights([]);
    setCjAccommodations([]);
    setCjFlightRoute([]);
    setCjInclusions([]);
    setCjExclusions([]);
    setCjFAQs([]);
    setCjGallery([]);
    setIsEditingCurated(false);
    setEditCuratedId(null);
    setFormLang("id");
  };

  const handleEditCurated = (j: Journey) => {
    setIsEditingCurated(true);
    setEditCuratedId(j.id);
    setCjId(j.id);
    setCjSlug(j.slug);
    setCjTitleID(j.title);
    setCjTitleEN(j.title);
    setCjDestination(j.destination);
    setCjSubtitleID(j.subtitle);
    setCjSubtitleEN(j.subtitle);
    setCjDurationDays(j.durationDays);
    setCjDurationLabel(j.durationLabel);
    setCjDates(j.dates);
    setCjAirline(j.airline);
    setCjPrice(j.price);
    setCjPriceRaw(j.priceRaw);
    setCjTravelMonth(j.travelMonth);
    setCjTravelStyle(j.travelStyle);
    setCjImage(j.image);
    setCjIntroHeadingID(j.introHeading || "");
    setCjIntroHeadingEN(j.introHeading || "");
    setCjIntroDescID(j.introDescription || "");
    setCjIntroDescEN(j.introDescription || "");
    setCjCountriesCount(j.countriesCount || 1);
    setCjChapters(j.chapters || []);
    setCjItinerary(j.itinerary || []);
    setCjHighlights(j.highlights || []);
    setCjAccommodations(j.accommodations || []);
    setCjFlightRoute(j.flights?.route || []);
    setCjInclusions(j.inclusions || []);
    setCjExclusions(j.exclusions || []);
    setCjFAQs(j.faqs || []);
    setCjGallery(j.chapters?.map(c => j.image) || []);
    setFormLang("id");
  };

  const handleSaveCurated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cjTitleID.trim() || !cjSlug.trim()) return;

    const updated: Journey = {
      id: cjId || `J-${Date.now()}`,
      slug: cjSlug,
      title: locale === "id" ? cjTitleID : (cjTitleEN || cjTitleID),
      destination: cjDestination,
      subtitle: locale === "id" ? cjSubtitleID : (cjSubtitleEN || cjSubtitleID),
      durationDays: cjDurationDays,
      durationLabel: cjDurationLabel,
      dates: cjDates,
      airline: cjAirline,
      price: cjPrice,
      priceRaw: cjPriceRaw,
      travelMonth: cjTravelMonth,
      travelStyle: cjTravelStyle,
      imageGradient: "from-[#38BDF8] to-[#0369A1]",
      image: cjImage || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
      introHeading: locale === "id" ? cjIntroHeadingID : (cjIntroHeadingEN || cjIntroHeadingID),
      introDescription: locale === "id" ? cjIntroDescID : (cjIntroDescEN || cjIntroDescID),
      countriesCount: cjCountriesCount,
      chapters: cjChapters,
      itinerary: cjItinerary,
      highlights: cjHighlights,
      accommodations: cjAccommodations,
      flights: {
        airline: cjAirline,
        route: cjFlightRoute
      },
      inclusions: cjInclusions,
      exclusions: cjExclusions,
      faqs: cjFAQs
    };

    let updatedList: Journey[];
    if (editCuratedId) {
      updatedList = curatedList.map(item => item.id === editCuratedId ? updated : item);
    } else {
      updatedList = [...curatedList, updated];
    }
    saveCuratedStorage(updatedList);
    resetCuratedForm();
  };

  const resetOpenTripForm = () => {
    setOtSlug("");
    setOtNameID("");
    setOtNameEN("");
    setOtTaglineID("");
    setOtTaglineEN("");
    setOtDuration("");
    setOtPrice("");
    setOtHotelRating("");
    setOtFeaturedImage("");
    setOtHighlights([]);
    setOtInclusions([]);
    setOtExclusions([]);
    setOtGallery([]);
    setOtItinerary([]);
    setIsEditingOpenTrip(false);
    setEditOpenTripSlug(null);
    setFormLang("id");
  };

  const handleEditOpenTrip = (pkg: TourPackageDetail) => {
    setIsEditingOpenTrip(true);
    setEditOpenTripSlug(pkg.slug);
    setOtSlug(pkg.slug);
    setOtNameID(pkg.name);
    setOtNameEN(pkg.name);
    setOtTaglineID(pkg.tagline);
    setOtTaglineEN(pkg.tagline);
    setOtDuration(pkg.duration);
    setOtPrice(pkg.price);
    setOtHotelRating(pkg.hotelRating);
    setOtFeaturedImage(pkg.featuredImage);
    setOtHighlights(pkg.highlights || []);
    setOtInclusions(pkg.inclusions || []);
    setOtExclusions(pkg.exclusions || []);
    setOtItinerary(pkg.itinerary || []);
    setOtGallery(pkg.itinerary?.map(it => it.image) || []);
    setFormLang("id");
  };

  const handleSaveOpenTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otNameID.trim() || !otSlug.trim()) return;

    const updated: TourPackageDetail = {
      slug: otSlug,
      name: locale === "id" ? otNameID : (otNameEN || otNameID),
      tagline: locale === "id" ? otTaglineID : (otTaglineEN || otTaglineID),
      duration: otDuration,
      price: otPrice,
      hotelRating: otHotelRating,
      featuredImage: otFeaturedImage || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
      highlights: otHighlights,
      itinerary: otItinerary,
      inclusions: otInclusions,
      exclusions: otExclusions
    };

    let updatedList: TourPackageDetail[];
    if (editOpenTripSlug) {
      updatedList = openTripsList.map(p => p.slug === editOpenTripSlug ? updated : p);
    } else {
      updatedList = [...openTripsList, updated];
    }
    saveOpenTripsStorage(updatedList);
    resetOpenTripForm();
  };

  const handleAddItineraryItem = () => {
    if (!newItTitle.trim()) return;
    const newIt: JourneyItinerary = {
      day: newItDay || `Hari ${cjItinerary.length + 1}`,
      title: newItTitle,
      description: newItDesc
    };
    setCjItinerary([...cjItinerary, newIt]);
    setNewItDay("");
    setNewItTitle("");
    setNewItDesc("");
  };

  const handleAddOtItineraryDay = () => {
    if (!newOtItTitle.trim()) return;
    const newDay: ItineraryDay = {
      day: newOtItDay || (otItinerary.length + 1),
      title: newOtItTitle,
      activities: newOtItActivities,
      description: newOtItDesc,
      hotel: newOtItHotel,
      image: newOtItImage || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800"
    };
    setOtItinerary([...otItinerary, newDay]);
    setNewOtItTitle("");
    setNewOtItDesc("");
    setNewOtItHotel("");
    setNewOtItImage("");
    setNewOtItActivities([]);
    setNewOtItDay(otItinerary.length + 2);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
            Content Manager
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
            {activeTab === "curated" ? "Perjalanan Pilihan (Curated Journeys)" : "Paket Wisata (Open Trips)"}
          </h1>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => { setActiveTab("curated"); setFormLang("id"); }}
            className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "curated" 
                ? "bg-[#0F2C59] text-white shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Curated Journeys
          </button>
          <button
            onClick={() => { setActiveTab("open"); setFormLang("id"); }}
            className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "open" 
                ? "bg-[#0F2C59] text-white shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Open Trips
          </button>
        </div>
      </div>

      {activeTab === "curated" ? (
        // ==========================================
        // RENDER: CURATED JOURNEY MANAGER
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 h-fit max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100">
              {isEditingCurated ? "Edit Curated Journey" : "Add Curated Journey"}
            </h2>

            <form onSubmit={handleSaveCurated} className="space-y-5 font-sans text-xs text-slate-700">
              {/* Language Tab Switcher inside the form */}
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
                    onClick={handleAutoTranslateCurated}
                    disabled={isTranslating || (formLang === "id" ? !cjTitleID.trim() : !cjTitleEN.trim())}
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
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Title (ID)</label>
                    <input 
                      type="text" 
                      value={cjTitleID} 
                      onChange={e => {
                        setCjTitleID(e.target.value);
                        if (!cjSlug) setCjSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }} 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Sub Title / Excerpt (ID)</label>
                    <textarea rows={2} value={cjSubtitleID} onChange={e => setCjSubtitleID(e.target.value)} placeholder="Sub title in Indonesian..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Intro Section Details (ID)</span>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Bold Heading (ID)</label>
                      <input type="text" value={cjIntroHeadingID} onChange={e => setCjIntroHeadingID(e.target.value)} placeholder="MENGARUNGI ALAM NAGA." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Full Description (ID)</label>
                      <textarea rows={3} value={cjIntroDescID} onChange={e => setCjIntroDescID(e.target.value)} placeholder="Deskripsi dalam Bahasa Indonesia..." className="w-full bg-white border border-slate-200 rounded-xl p-3" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Title (EN)</label>
                    <input 
                      type="text" 
                      value={cjTitleEN} 
                      onChange={e => setCjTitleEN(e.target.value)} 
                      required 
                      placeholder="English Title..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Sub Title / Excerpt (EN)</label>
                    <textarea rows={2} value={cjSubtitleEN} onChange={e => setCjSubtitleEN(e.target.value)} placeholder="Sub title in English..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Intro Section Details (EN)</span>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Bold Heading (EN)</label>
                      <input type="text" value={cjIntroHeadingEN} onChange={e => setCjIntroHeadingEN(e.target.value)} placeholder="English Heading..." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Full Description (EN)</label>
                      <textarea rows={3} value={cjIntroDescEN} onChange={e => setCjIntroDescEN(e.target.value)} placeholder="Full description in English..." className="w-full bg-white border border-slate-200 rounded-xl p-3" />
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Fields */}
              <div>
                <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Slug</label>
                <input type="text" value={cjSlug} onChange={e => setCjSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Destination Region</label>
                  <input type="text" value={cjDestination} onChange={e => setCjDestination(e.target.value)} placeholder="e.g. Indonesia, Japan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Dates Label</label>
                  <input type="text" value={cjDates} onChange={e => setCjDates(e.target.value)} placeholder="e.g. 12 - 16 Agu 2026" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Duration Days</label>
                  <input type="number" value={cjDurationDays} onChange={e => setCjDurationDays(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Duration Label</label>
                  <input type="text" value={cjDurationLabel} onChange={e => setCjDurationLabel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Countries Count</label>
                  <input type="number" value={cjCountriesCount} onChange={e => setCjCountriesCount(parseInt(e.target.value) || 1)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Price Label</label>
                  <input type="text" value={cjPrice} onChange={e => setCjPrice(e.target.value)} placeholder="IDR 24.5 JT" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Price Raw (Num)</label>
                  <input type="number" value={cjPriceRaw} onChange={e => setCjPriceRaw(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Travel Style</label>
                  <input type="text" value={cjTravelStyle} onChange={e => setCjTravelStyle(e.target.value)} placeholder="Luxury Adventure" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1 flex items-center gap-1.5"><ImageIcon size={14} /> Main Cover Image</span>
                <div className="flex items-center gap-4">
                  {cjImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={cjImage} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input type="text" value={cjImage} onChange={e => setCjImage(e.target.value)} placeholder="Or paste image URL..." className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5" />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      <Upload size={12} />
                      <span>Upload from Device</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, setCjImage)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Daily Itinerary list */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Daily Itinerary ({cjItinerary.length})</span>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={newItDay} onChange={e => setNewItDay(e.target.value)} placeholder="e.g. Day 1" className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
                    <input type="text" value={newItTitle} onChange={e => setNewItTitle(e.target.value)} placeholder="Day Title" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
                  </div>
                  <textarea value={newItDesc} onChange={e => setNewItDesc(e.target.value)} placeholder="Itinerary details..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" rows={2} />
                  <button type="button" onClick={handleAddItineraryItem} className="w-full py-1.5 bg-[#A89053] text-white rounded-lg font-bold uppercase tracking-wider text-[10px] cursor-pointer">Add Itinerary Day</button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {cjItinerary.map((it, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border text-[11px] flex justify-between items-center">
                      <span><strong>{it.day}</strong>: {it.title}</span>
                      <button type="button" onClick={() => setCjItinerary(cjItinerary.filter((_, i) => i !== idx))} className="text-red-500 font-bold">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetCuratedForm} className="px-4 py-2.5 rounded-xl border hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white font-bold uppercase tracking-wider cursor-pointer">Save Journey</button>
              </div>
            </form>
          </div>

          {/* List display */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-2 border-b border-slate-100 flex justify-between">
                <span>Active Curated Journeys</span>
                <span className="text-xs font-mono text-slate-400">{curatedList.length} Trips</span>
              </h2>

              <div className="space-y-4">
                {curatedList.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-slate-800 text-xs leading-none">{item.title}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{item.destination} • {item.durationLabel} • {item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditCurated(item)} className="p-2 rounded-lg bg-white border hover:text-[#A89053] cursor-pointer"><Edit3 size={13} /></button>
                      <button onClick={() => saveCuratedStorage(curatedList.filter(c => c.id !== item.id))} className="p-2 rounded-lg bg-white border hover:text-red-500 cursor-pointer"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // RENDER: OPEN TRIP PACKAGE MANAGER
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 h-fit max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100">
              {isEditingOpenTrip ? "Edit Open Trip" : "Add Open Trip"}
            </h2>

            <form onSubmit={handleSaveOpenTrip} className="space-y-5 font-sans text-xs text-slate-700">
              {/* Language Tab Switcher inside the form */}
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
                    onClick={handleAutoTranslateOpenTrip}
                    disabled={isTranslating || (formLang === "id" ? !otNameID.trim() : !otNameEN.trim())}
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
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Name (ID)</label>
                    <input 
                      type="text" 
                      value={otNameID} 
                      onChange={e => {
                        setOtNameID(e.target.value);
                        if (!otSlug) setOtSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }} 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Tagline (ID)</label>
                    <input type="text" value={otTaglineID} onChange={e => setOtTaglineID(e.target.value)} placeholder="Tagline (Indonesian)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Name (EN)</label>
                    <input 
                      type="text" 
                      value={otNameEN} 
                      onChange={e => setOtNameEN(e.target.value)} 
                      required 
                      placeholder="English Name..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Tagline (EN)</label>
                    <input type="text" value={otTaglineEN} onChange={e => setOtTaglineEN(e.target.value)} placeholder="Tagline (English)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
                  </div>
                </div>
              )}

              {/* Shared Fields */}
              <div>
                <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Slug</label>
                <input type="text" value={otSlug} onChange={e => setOtSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Duration</label>
                  <input type="text" value={otDuration} onChange={e => setOtDuration(e.target.value)} placeholder="e.g. 5 Hari" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Price Rate</label>
                  <input type="text" value={otPrice} onChange={e => setOtPrice(e.target.value)} placeholder="e.g. Rp 16.800.000 / pax" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Hotel Rating</label>
                  <input type="text" value={otHotelRating} onChange={e => setOtHotelRating(e.target.value)} placeholder="4★ Shinjuku Hotel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              {/* Cover Image */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1 flex items-center gap-1.5"><ImageIcon size={14} /> Cover Image</span>
                <div className="flex items-center gap-4">
                  {otFeaturedImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={otFeaturedImage} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input type="text" value={otFeaturedImage} onChange={e => setOtFeaturedImage(e.target.value)} placeholder="Or paste image URL..." className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5" />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      <Upload size={12} />
                      <span>Upload Cover</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, setOtFeaturedImage)} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetOpenTripForm} className="px-4 py-2.5 rounded-xl border hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white font-bold uppercase tracking-wider cursor-pointer">Save Open Trip</button>
              </div>
            </form>
          </div>

          {/* List display */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h2 className="text-base font-serif font-bold text-[#0F2C59] mb-4 pb-2 border-b border-slate-100 flex justify-between">
                <span>Active Open Trips</span>
                <span className="text-xs font-mono text-slate-400">{openTripsList.length} Trips</span>
              </h2>

              <div className="space-y-4">
                {openTripsList.map((item) => (
                  <div key={item.slug} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white shrink-0">
                        <img src={item.featuredImage} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-slate-800 text-xs leading-none">{item.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{item.duration} • {item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditOpenTrip(item)} className="p-2 rounded-lg bg-white border hover:text-[#A89053] cursor-pointer"><Edit3 size={13} /></button>
                      <button onClick={() => saveOpenTripsStorage(openTripsList.filter(o => o.slug !== item.slug))} className="p-2 rounded-lg bg-white border hover:text-red-500 cursor-pointer"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
