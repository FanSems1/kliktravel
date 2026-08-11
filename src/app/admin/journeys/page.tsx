"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Compass, MapPin, Tag, Hotel, Calendar, X, Eye, Image as ImageIcon, Plane, HelpCircle, FileText, Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedJourneys, Journey, JourneyChapter, JourneyAccommodation, JourneyItinerary, JourneyFAQ } from "@/data/journeys";
import { localizedTourPackages, TourPackageDetail, ItineraryDay } from "@/data/tours";

export default function AdminJourneysPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"curated" | "open">("curated");
  
  // States for Curated Journeys
  const [curatedList, setCuratedList] = useState<Journey[]>(localizedJourneys[locale] || []);
  const [isEditingCurated, setIsEditingCurated] = useState(false);
  const [editCuratedId, setEditCuratedId] = useState<string | null>(null);

  // States for Open Trips
  const [openTripsList, setOpenTripsList] = useState<TourPackageDetail[]>(Object.values(localizedTourPackages[locale] || {}));
  const [isEditingOpenTrip, setIsEditingOpenTrip] = useState(false);
  const [editOpenTripSlug, setEditOpenTripSlug] = useState<string | null>(null);

  // Helper function to read file as Base64
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
  const [cjTitle, setCjTitle] = useState("");
  const [cjDestination, setCjDestination] = useState("");
  const [cjSubtitle, setCjSubtitle] = useState("");
  const [cjDurationDays, setCjDurationDays] = useState(5);
  const [cjDurationLabel, setCjDurationLabel] = useState("5 Hari");
  const [cjDates, setCjDates] = useState("");
  const [cjAirline, setCjAirline] = useState("");
  const [cjPrice, setCjPrice] = useState("");
  const [cjPriceRaw, setCjPriceRaw] = useState(0);
  const [cjTravelMonth, setCjTravelMonth] = useState("");
  const [cjTravelStyle, setCjTravelStyle] = useState("");
  const [cjImage, setCjImage] = useState("");
  const [cjIntroHeading, setCjIntroHeading] = useState("");
  const [cjIntroDescription, setCjIntroDescription] = useState("");
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
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // ==========================================
  // FORM FIELDS: OPEN TRIP (TourPackageDetail)
  // ==========================================
  const [otSlug, setOtSlug] = useState("");
  const [otName, setOtName] = useState("");
  const [otTagline, setOtTagline] = useState("");
  const [otDuration, setOtDuration] = useState("");
  const [otPrice, setOtPrice] = useState("");
  const [otHotelRating, setOtHotelRating] = useState("");
  const [otFeaturedImage, setOtFeaturedImage] = useState("");
  const [otHighlights, setOtHighlights] = useState<string[]>([]);
  const [newOtHighlight, setNewOtHighlight] = useState("");
  const [otInclusions, setOtInclusions] = useState<string[]>([]);
  const [newOtInclusion, setNewOtInclusion] = useState("");
  const [otExclusions, setOtExclusions] = useState<string[]>([]);
  const [newOtExclusion, setNewOtExclusion] = useState("");
  const [otGallery, setOtGallery] = useState<string[]>([]);
  const [newOtGalleryUrl, setNewOtGalleryUrl] = useState("");

  // Itinerary for Open Trips
  const [otItinerary, setOtItinerary] = useState<ItineraryDay[]>([]);
  const [newOtItDay, setNewOtItDay] = useState(1);
  const [newOtItTitle, setNewOtItTitle] = useState("");
  const [newOtItDesc, setNewOtItDesc] = useState("");
  const [newOtItHotel, setNewOtItHotel] = useState("");
  const [newOtItImage, setNewOtItImage] = useState("");
  const [newOtItActivities, setNewOtItActivities] = useState<string[]>([]);
  const [newOtItActivityInput, setNewOtItActivityInput] = useState("");

  // ==========================================
  // CURATED JOURNEY FUNCTIONS
  // ==========================================
  const resetCuratedForm = () => {
    setCjId("");
    setCjSlug("");
    setCjTitle("");
    setCjDestination("");
    setCjSubtitle("");
    setCjDurationDays(5);
    setCjDurationLabel("5 Hari");
    setCjDates("");
    setCjAirline("");
    setCjPrice("");
    setCjPriceRaw(0);
    setCjTravelMonth("");
    setCjTravelStyle("");
    setCjImage("");
    setCjIntroHeading("");
    setCjIntroDescription("");
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
  };

  const handleEditCurated = (j: Journey) => {
    setIsEditingCurated(true);
    setEditCuratedId(j.id);
    setCjId(j.id);
    setCjSlug(j.slug);
    setCjTitle(j.title);
    setCjDestination(j.destination);
    setCjSubtitle(j.subtitle);
    setCjDurationDays(j.durationDays);
    setCjDurationLabel(j.durationLabel);
    setCjDates(j.dates);
    setCjAirline(j.airline);
    setCjPrice(j.price);
    setCjPriceRaw(j.priceRaw);
    setCjTravelMonth(j.travelMonth);
    setCjTravelStyle(j.travelStyle);
    setCjImage(j.image);
    setCjIntroHeading(j.introHeading || "");
    setCjIntroDescription(j.introDescription || "");
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
  };

  const handleSaveCurated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cjTitle.trim() || !cjSlug.trim()) return;

    const updated: Journey = {
      id: cjId || `J-${Date.now()}`,
      slug: cjSlug,
      title: cjTitle,
      destination: cjDestination,
      subtitle: cjSubtitle,
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
      introHeading: cjIntroHeading,
      introDescription: cjIntroDescription,
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

    if (editCuratedId) {
      setCuratedList(curatedList.map(item => item.id === editCuratedId ? updated : item));
    } else {
      setCuratedList([...curatedList, updated]);
    }
    resetCuratedForm();
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newCh: JourneyChapter = {
      id: `0${cjChapters.length + 1}`,
      title: newChapterTitle,
      text: newChapterText,
      layout: cjChapters.length % 2 === 0 ? "left" : "right"
    };
    setCjChapters([...cjChapters, newCh]);
    setNewChapterTitle("");
    setNewChapterText("");
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

  const handleAddAcc = () => {
    if (!newAccName.trim()) return;
    const newAc: JourneyAccommodation = {
      name: newAccName,
      city: newAccCity,
      roomType: newAccRoomType
    };
    setCjAccommodations([...cjAccommodations, newAc]);
    setNewAccName("");
    setNewAccCity("");
    setNewAccRoomType("");
  };

  // ==========================================
  // OPEN TRIP FUNCTIONS
  // ==========================================
  const resetOpenTripForm = () => {
    setOtSlug("");
    setOtName("");
    setOtTagline("");
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
  };

  const handleEditOpenTrip = (pkg: TourPackageDetail) => {
    setIsEditingOpenTrip(true);
    setEditOpenTripSlug(pkg.slug);
    setOtSlug(pkg.slug);
    setOtName(pkg.name);
    setOtTagline(pkg.tagline);
    setOtDuration(pkg.duration);
    setOtPrice(pkg.price);
    setOtHotelRating(pkg.hotelRating);
    setOtFeaturedImage(pkg.featuredImage);
    setOtHighlights(pkg.highlights || []);
    setOtInclusions(pkg.inclusions || []);
    setOtExclusions(pkg.exclusions || []);
    setOtItinerary(pkg.itinerary || []);
    setOtGallery(pkg.itinerary?.map(it => it.image) || []);
  };

  const handleSaveOpenTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otName.trim() || !otSlug.trim()) return;

    const updated: TourPackageDetail = {
      slug: otSlug,
      name: otName,
      tagline: otTagline,
      duration: otDuration,
      price: otPrice,
      hotelRating: otHotelRating,
      featuredImage: otFeaturedImage || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
      highlights: otHighlights,
      itinerary: otItinerary,
      inclusions: otInclusions,
      exclusions: otExclusions
    };

    if (editOpenTripSlug) {
      setOpenTripsList(openTripsList.map(p => p.slug === editOpenTripSlug ? updated : p));
    } else {
      setOpenTripsList([...openTripsList, updated]);
    }
    resetOpenTripForm();
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
            onClick={() => setActiveTab("curated")}
            className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all ${
              activeTab === "curated" 
                ? "bg-[#0F2C59] text-white shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Curated Journeys
          </button>
          <button
            onClick={() => setActiveTab("open")}
            className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all ${
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
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 h-fit max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100">
              {isEditingCurated ? "Edit Curated Journey" : "Add Curated Journey"}
            </h2>

            <form onSubmit={handleSaveCurated} className="space-y-4 font-sans text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Title</label>
                  <input type="text" value={cjTitle} onChange={e => setCjTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Slug</label>
                  <input type="text" value={cjSlug} onChange={e => setCjSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
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

              <div>
                <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Sub Title / Excerpt</label>
                <textarea rows={2} value={cjSubtitle} onChange={e => setCjSubtitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Preferred Airline</label>
                  <input type="text" value={cjAirline} onChange={e => setCjAirline(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              {/* Intro heading & text */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Intro Section Details</span>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Bold Heading</label>
                  <input type="text" value={cjIntroHeading} onChange={e => setCjIntroHeading(e.target.value)} placeholder="MENGARUNGI ALAM NAGA." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400">Intro Full Description</label>
                  <textarea rows={3} value={cjIntroDescription} onChange={e => setCjIntroDescription(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3" />
                </div>
              </div>

              {/* Flight Routing */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-2 flex items-center gap-1.5"><Plane size={14} /> Flight Route Cities</span>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newFlightCity} onChange={e => setNewFlightCity(e.target.value)} placeholder="e.g. DPS, LOP, LBJ" className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5" />
                  <button type="button" onClick={() => { if(newFlightCity.trim()) { setCjFlightRoute([...cjFlightRoute, newFlightCity.toUpperCase()]); setNewFlightCity(""); } }} className="px-3 rounded-lg bg-slate-200">+</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cjFlightRoute.map((city, idx) => (
                    <span key={idx} className="bg-white border px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                      {city} <button type="button" onClick={() => setCjFlightRoute(cjFlightRoute.filter((_, i) => i !== idx))} className="text-red-500 font-bold">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-2 flex items-center gap-1.5"><ImageIcon size={14} /> Journey Photos Gallery</span>
                <div className="space-y-2">
                  <input type="text" value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} placeholder="Paste photo URL..." className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5" />
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      <Upload size={12} />
                      <span>Upload from Device</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, (base64) => setCjGallery([...cjGallery, base64]))} />
                    </label>
                    <button type="button" onClick={() => { if(newGalleryUrl.trim()) { setCjGallery([...cjGallery, newGalleryUrl]); setNewGalleryUrl(""); } }} className="px-4 py-1.5 rounded-lg bg-slate-200 font-bold uppercase tracking-wider text-[9px]">Add URL</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {cjGallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setCjGallery(cjGallery.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary Daily list */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Daily Itinerary ({cjItinerary.length})</span>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={newItDay} onChange={e => setNewItDay(e.target.value)} placeholder="e.g. Day 1" className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
                    <input type="text" value={newItTitle} onChange={e => setNewItTitle(e.target.value)} placeholder="Day Title" className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
                  </div>
                  <textarea value={newItDesc} onChange={e => setNewItDesc(e.target.value)} placeholder="Itinerary details..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" rows={2} />
                  <button type="button" onClick={handleAddItineraryItem} className="w-full py-1.5 bg-[#A89053] text-white rounded-lg font-bold uppercase tracking-wider text-[10px]">Add Itinerary Day</button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {cjItinerary.map((it, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border text-[11px] flex justify-between items-center">
                      <span><strong>{it.day}</strong>: {it.title}</span>
                      <button type="button" onClick={() => setCjItinerary(cjItinerary.filter((_, i) => i !== idx))} className="text-red-500">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetCuratedForm} className="px-4 py-2.5 rounded-xl border hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white font-bold uppercase tracking-wider">Save Journey</button>
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
                      <button onClick={() => handleEditCurated(item)} className="p-2 rounded-lg bg-white border hover:text-[#A89053]"><Edit3 size={13} /></button>
                      <button onClick={() => setCuratedList(curatedList.filter(c => c.id !== item.id))} className="p-2 rounded-lg bg-white border hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // RENDER: OPEN TRIP PACKAGE MANAGER (WITH DETAILED DAILY ITINERARY & UPLOADS)
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 h-fit max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-2 border-b border-slate-100">
              {isEditingOpenTrip ? "Edit Open Trip" : "Add Open Trip"}
            </h2>

            <form onSubmit={handleSaveOpenTrip} className="space-y-4 font-sans text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Package Name</label>
                  <input type="text" value={otName} onChange={e => setOtName(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Slug</label>
                  <input type="text" value={otSlug} onChange={e => setOtSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Tagline</label>
                <input type="text" value={otTagline} onChange={e => setOtTagline(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">Duration</label>
                  <input type="text" value={otDuration} onChange={e => setOtDuration(e.target.value)} placeholder="e.g. 5 Hari 4 Malam" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5" />
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

              {/* Daily Itinerary with Photo & Upload support */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                  <span>Itinerary Builder (Daily)</span>
                  <span className="font-mono text-[9px] text-[#A89053]">{otItinerary.length} Days Built</span>
                </span>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[8px] font-mono text-slate-400 mb-0.5">Day Number</label>
                      <input type="number" min="1" value={newOtItDay} onChange={e => setNewOtItDay(parseInt(e.target.value) || 1)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[8px] font-mono text-slate-400 mb-0.5">Day Itinerary Title</label>
                      <input type="text" value={newOtItTitle} onChange={e => setNewOtItTitle(e.target.value)} placeholder="e.g. Arrival in Tokyo" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono text-slate-400 mb-0.5">Accommodation Hotel</label>
                    <input type="text" value={newOtItHotel} onChange={e => setNewOtItHotel(e.target.value)} placeholder="Hotel Shinjuku / Similar" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800" />
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono text-slate-400 mb-0.5">Day Description</label>
                    <textarea rows={3} value={newOtItDesc} onChange={e => setNewOtItDesc(e.target.value)} placeholder="Narrate the schedule details..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800" />
                  </div>

                  {/* Day Image upload */}
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono text-slate-400">Day Photo (Upload / URL)</label>
                    <div className="flex items-center gap-3">
                      {newOtItImage && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={newOtItImage} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <input type="text" value={newOtItImage} onChange={e => setNewOtItImage(e.target.value)} placeholder="Paste photo URL..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-800" />
                        <label className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#A89053] text-white hover:bg-[#A89053]/90 font-bold uppercase tracking-wider text-[8px] cursor-pointer">
                          <Upload size={10} />
                          <span>Upload Day Photo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, setNewOtItImage)} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={handleAddOtItineraryDay} className="w-full py-2 bg-[#0F2C59] text-white rounded-lg font-bold uppercase tracking-wider text-[9px] shadow-sm">
                    Add Day Itinerary
                  </button>
                </div>

                {/* Displaying Added Itinerary Days */}
                <div className="space-y-2 mt-2">
                  {otItinerary.map((day, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                          <img src={day.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-800 leading-tight">Hari {day.day}: {day.title}</p>
                          <p className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">{day.hotel}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setOtItinerary(otItinerary.filter((_, i) => i !== idx))} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-2 flex items-center gap-1.5"><ImageIcon size={14} /> Open Trip Photos Gallery</span>
                <div className="space-y-2">
                  <input type="text" value={newOtGalleryUrl} onChange={e => setNewOtGalleryUrl(e.target.value)} placeholder="Paste photo URL..." className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5" />
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      <Upload size={12} />
                      <span>Upload from Device</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageFileChange(e, (base64) => setOtGallery([...otGallery, base64]))} />
                    </label>
                    <button type="button" onClick={() => { if(newOtGalleryUrl.trim()) { setOtGallery([...otGallery, newOtGalleryUrl]); setNewOtGalleryUrl(""); } }} className="px-4 py-1.5 rounded-lg bg-slate-200 font-bold uppercase tracking-wider text-[9px]">Add URL</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {otGallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setOtGallery(otGallery.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetOpenTripForm} className="px-4 py-2.5 rounded-xl border hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#0F2C59] text-white font-bold uppercase tracking-wider">Save Open Trip</button>
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
                      <button onClick={() => handleEditOpenTrip(item)} className="p-2 rounded-lg bg-white border hover:text-[#A89053]"><Edit3 size={13} /></button>
                      <button onClick={() => setOpenTripsList(openTripsList.filter(o => o.slug !== item.slug))} className="p-2 rounded-lg bg-white border hover:text-red-500"><Trash2 size={13} /></button>
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
