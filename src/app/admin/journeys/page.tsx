"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Compass, MapPin, Hotel, Calendar, Clock, X, Image as ImageIcon, Upload, Sparkles, Loader2, ChevronUp, ChevronDown, Check, Info, ArrowLeft, Search, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Journey, JourneyChapter, JourneyAccommodation, JourneyItinerary, JourneyFAQ } from "@/data/journeys";
import { TourPackageDetail, ItineraryDay } from "@/data/tours";
import { RegionDestination } from "@/data/destinations";
import { translateText } from "@/utils/translator";
import { apiFetch, uploadMedia } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";

interface ApiJourney {
  id: string;
  slug: string;
  durationDays: number;
  priceRaw: any;
  countriesCount: number;
  image: string;
  imageGradient?: string;
  gallery?: any;
  contentId: any;
  contentEn: any;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface DepartureBatch {
  id: string;
  dateStrID: string;
  dateStrEN?: string;
  fromDate?: string;
  toDate?: string;
  durationID: string;
  durationEN?: string;
  priceID: string;
  priceEN?: string;
  status: "Available" | "Closed" | "FULL" | "Draft";
  quota?: number;
}

export interface ApiSchedule {
  startDate: string;
  endDate: string;
  price: number;
  quota?: number;
  status: "open" | "close";
  sortOrder?: number;
}

interface ApiOpenTrip {
  id: string;
  slug: string;
  featuredImage: string;
  gallery?: any;
  contentId: any;
  contentEn: any;
  batches?: DepartureBatch[];
  schedules?: ApiSchedule[];
  sortOrder?: number;
  isPublished?: boolean;
  status?: string;
}

// Helper to parse number of days from duration string (e.g. "5 Hari 4 Malam", "5 Hari", "5 Days")
const getDaysFromDurationString = (dur: string): number => {
  if (!dur || !dur.trim()) return 0;
  const match = dur.match(/(\d+)\s*(?:hari|day)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  const firstNumber = dur.match(/\d+/);
  return firstNumber ? parseInt(firstNumber[0], 10) : 0;
};

// Helper to calculate end date (YYYY-MM-DD) based on start date and duration string
const calculateEndDate = (startDateStr: string, durationStr: string): string => {
  if (!startDateStr) return "";
  const days = getDaysFromDurationString(durationStr);
  if (isNaN(days) || days <= 0) return startDateStr;

  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return startDateStr;

  start.setDate(start.getDate() + (days - 1));
  const yyyy = start.getFullYear();
  const mm = String(start.getMonth() + 1).padStart(2, "0");
  const dd = String(start.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Helper to parse unstructured Indonesian itinerary text into structured ItineraryDay array
const parseItineraryText = (text: string): ItineraryDay[] => {
  if (!text || !text.trim()) return [];

  // Regex to find day markers (HARI 01, HARI 1, DAY 1, etc.)
  const dayRegex = /(?:HARI|DAY)\s*0*(\d+)/gi;
  const matches: { dayNum: number; index: number }[] = [];
  let match;

  while ((match = dayRegex.exec(text)) !== null) {
    matches.push({
      dayNum: parseInt(match[1], 10),
      index: match.index
    });
  }

  if (matches.length === 0) {
    // If no markers found, treat the entire text as Day 1
    return [{
      day: 1,
      title: "Rencana Perjalanan",
      titleEN: "Itinerary Plan",
      activities: [],
      activitiesEN: [],
      description: text.trim(),
      descriptionEN: text.trim(),
      hotel: "",
      hotelEN: "",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800",
      images: []
    }];
  }

  const parsedDays: ItineraryDay[] = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;

    // Get content block for this day
    const rawBlock = text.substring(current.index, nextIndex);

    // Strip prefix like "HARI 01:"
    const prefixMatch = rawBlock.match(/^(?:HARI|DAY)\s*0*\d+[\s:-]*/i);
    const prefixLength = prefixMatch ? prefixMatch[0].length : 0;
    const blockContent = rawBlock.slice(prefixLength).trim();

    // Parse meals, title, description, hotel, activities
    let meals = "";
    let title = "";
    let description = blockContent;

    // Detect meals in parentheses, e.g., (MEALS ON BOARD) or (MAKAN PAGI, MAKAN SIANG)
    const mealsRegex = /\((?:meals|makan|pagi|siang|malam|mp|ms|mm|board|b|l|d|[\s,/&])+\)/i;
    const mealsMatch = blockContent.match(mealsRegex);

    if (mealsMatch) {
      meals = mealsMatch[0].replace(/[\(\)]/g, "").trim();
      const mealsIndex = blockContent.indexOf(mealsMatch[0]);
      title = blockContent.substring(0, mealsIndex).replace(/[\s:-]+$/, "").trim();
      description = blockContent.substring(mealsIndex + mealsMatch[0].length).trim();
    } else {
      // Find separator for title (e.g. line break or period)
      const firstLineEnd = blockContent.indexOf("\n");
      if (firstLineEnd !== -1) {
        title = blockContent.substring(0, firstLineEnd).trim();
        description = blockContent.substring(firstLineEnd + 1).trim();
      } else {
        const firstPeriod = blockContent.indexOf(".");
        if (firstPeriod !== -1 && firstPeriod < 100) {
          title = blockContent.substring(0, firstPeriod).trim();
          description = blockContent.substring(firstPeriod + 1).trim();
        } else {
          title = `Hari ${current.dayNum}`;
          description = blockContent;
        }
      }
    }

    // Extract hotel from description
    let hotel = "";
    const hotelRegex = /(?:menginap di|hotel\s*:|akomodasi\s*:)\s*([^\n\.]+)/i;
    const hotelMatch = description.match(hotelRegex);
    if (hotelMatch) {
      hotel = hotelMatch[1].trim();
      description = description.replace(hotelRegex, "").trim();
    }

    // Clean up description trailing parts (e.g. "Bermalam di Pattaya." left when hotel was removed)
    description = description.replace(/\s*(?:bermalam|menginap)\s+di\s+[^\n\.]+\.?$/i, "").trim();
    description = description.replace(/\s+/g, " ").trim();

    // Extract activities
    const activityKeywords = /(?:mengunjungi|menuju ke|menuju|berbelanja di|ke)\s+([A-Z][a-zA-Z0-9\s'’-]+?)(?=\.|\,|\bdan\b|Setelah|Check-in|Bermalam|menginap|kemudian|selanjutnya)/g;
    const activities: string[] = [];
    let actMatch;
    while ((actMatch = activityKeywords.exec(description)) !== null) {
      const actName = actMatch[1].trim();
      if (actName && actName.length > 3 && !activities.includes(actName)) {
        activities.push(actName);
      }
    }

    // Standardize title and meals formatting
    if (meals) {
      title = `${title} (${meals.toUpperCase()})`;
    }

    parsedDays.push({
      day: current.dayNum,
      title: title || `Hari ${current.dayNum}`,
      titleEN: title || `Day ${current.dayNum}`,
      activities: activities,
      activitiesEN: activities,
      description: description,
      descriptionEN: description,
      hotel: hotel,
      hotelEN: hotel,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800",
      images: []
    });
  }

  return parsedDays;
};

export default function AdminJourneysPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"curated" | "open">("open");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // States for itinerary text auto-converter
  const [rawItineraryText, setRawItineraryText] = useState("");
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  // Upload loading states
  const [isUploadingOtMain, setIsUploadingOtMain] = useState(false);
  const [isUploadingOtDay, setIsUploadingOtDay] = useState(false);
  const [isUploadingCjMain, setIsUploadingCjMain] = useState(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    loadingSetter?: (loading: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (loadingSetter) loadingSetter(true);
    try {
      const uploaded = await uploadMedia(file);
      callback(uploaded.url);
      setToast({ message: "Gambar berhasil diunggah!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Gagal mengunggah gambar", type: "error" });
    } finally {
      if (loadingSetter) loadingSetter(false);
    }
  };

  const handleImportFromOpenTrip = (ot: any) => {
    const raw = rawApiOpenTrips.find(r => r.id === ot.id || r.slug === ot.slug);
    const cId = raw?.contentId || {};
    const cEn = raw?.contentEn || {};

    // 1. Slug
    setCjSlug(ot.slug || raw?.slug || "");

    // 2. Title (ID & EN)
    const titleId = cId.name || ot.name || ot.nameID || "";
    const titleEn = cEn.name || ot.nameEN || titleId;
    setCjTitleID(titleId);
    setCjTitleEN(titleEn);

    // 3. Subtitle / Tagline (ID & EN)
    const subtitleId = cId.tagline || ot.tagline || ot.taglineID || "";
    const subtitleEn = cEn.tagline || ot.taglineEN || subtitleId;
    setCjSubtitleID(subtitleId);
    setCjSubtitleEN(subtitleEn);

    // 4. Duration
    const durationStr = cId.duration || ot.duration || ot.durationID || "5";
    const durationMatch = durationStr.match(/\d+/);
    const parsedDuration = durationMatch ? parseInt(durationMatch[0], 10) : 5;
    setCjDurationDays(parsedDuration);
    setCjDurationLabel(durationStr.includes("Hari") || durationStr.includes("Days") ? durationStr : `${parsedDuration} Hari`);

    // 5. Price & Price Raw
    const priceStr = cId.price || ot.price || ot.priceID || "";
    const rawPriceNum = Number(cId.priceRaw || ot.priceRaw) || (priceStr ? Number(priceStr.replace(/[^0-9]/g, "")) : 0);
    setCjPrice(priceStr);
    setCjPriceRaw(rawPriceNum);

    // 6. Status
    const rawStatus = ot.status || (raw as any)?.status || "Available";
    const mappedStatus = rawStatus === "active" ? "Available" : rawStatus === "inactive" ? "Closed" : rawStatus === "draft" ? "Draft" : rawStatus;
    setCjStatus(mappedStatus as any);

    // 7. Image
    setCjImage(ot.featuredImage || raw?.featuredImage || "");

    // 8. Itinerary
    const itin = cId.itinerary || ot.itinerary || [];
    setCjItinerary(itin);

    // 9. Highlights, Inclusions, Exclusions
    setCjHighlights(cId.highlights || ot.highlights || ot.highlightsID || []);
    setCjInclusions(cId.inclusions || ot.inclusions || ot.inclusionsID || []);
    setCjExclusions(cId.exclusions || ot.exclusions || ot.exclusionsID || []);

    setToast({ message: "Berhasil mengimpor data dari Open Trip", type: "success" });
  };

  // Form active language tab switcher
  const [formLang, setFormLang] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for Regions list (fetched from /admin/destinations)
  const [regions, setRegions] = useState<RegionDestination[]>([]);

  // States for Curated Journeys
  const [rawApiJourneys, setRawApiJourneys] = useState<ApiJourney[]>([]);
  const [curatedList, setCuratedList] = useState<Journey[]>([]);
  const [isEditingCurated, setIsEditingCurated] = useState(false);
  const [editCuratedId, setEditCuratedId] = useState<string | null>(null);

  // States for Open Trips / Tour Packages
  const [rawApiOpenTrips, setRawApiOpenTrips] = useState<ApiOpenTrip[]>([]);
  const [openTripsList, setOpenTripsList] = useState<(TourPackageDetail & { id?: string })[]>([]);
  const [isEditingOpenTrip, setIsEditingOpenTrip] = useState(false);
  const [editOpenTripId, setEditOpenTripId] = useState<string | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Destinations
      const apiRegions = await apiFetch<any[]>("/admin/destinations").catch(() => []);
      setRegions(apiRegions.map(r => {
        let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
        if (gradient.includes("||")) {
          gradient = gradient.split("||")[0];
        }

        const subDestinations = (r.subDestinations || []).map((s: any) => {
          let subNameEn = s.nameEn || s.nameId;
          if (subNameEn.includes("||")) {
            subNameEn = subNameEn.split("||")[0];
          }
          const activeSubName = locale === "en" ? subNameEn : s.nameId;
          return {
            name: activeSubName,
            slug: s.slug
          };
        });

        const activeName = locale === "en" ? (r.nameEn || r.nameId) : r.nameId;
        const cleanedName = activeName.includes("||") ? activeName.split("||")[0] : activeName;
        const activeSubtitle = locale === "en" ? (r.subtitleEn || r.subtitleId) : r.subtitleId;

        return {
          id: r.key,
          name: cleanedName,
          slug: r.slug,
          subtitle: activeSubtitle,
          featuredImageGradient: gradient,
          subDestinations: subDestinations
        };
      }));

      // 2. Fetch Curated Journeys
      const apiJourneys = await apiFetch<ApiJourney[]>("/admin/journeys").catch(() => []);
      setRawApiJourneys(apiJourneys);
      setCuratedList(apiJourneys.map(j => {
        const cId = j.contentId || {};
        const cEn = j.contentEn || {};
        const activeContent = locale === "en" ? cEn : cId;
        return {
          id: j.id,
          slug: j.slug,
          title: activeContent.title || cId.title || j.slug,
          destination: activeContent.destination || cId.destination || "",
          subtitle: activeContent.subtitle || cId.subtitle || "",
          durationDays: j.durationDays,
          durationLabel: activeContent.durationLabel || cId.durationLabel || `${j.durationDays} Days`,
          dates: activeContent.dates || cId.dates || "",
          airline: activeContent.airline || cId.airline || "",
          price: activeContent.price || cId.price || `Rp ${Number(j.priceRaw).toLocaleString("id-ID")}`,
          priceRaw: Number(j.priceRaw),
          travelMonth: activeContent.travelMonth || cId.travelMonth || "",
          travelStyle: activeContent.travelStyle || cId.travelStyle || "",
          imageGradient: j.imageGradient || "from-[#38BDF8] to-[#0369A1]",
          image: j.image,
          introHeading: activeContent.introHeading || cId.introHeading || "",
          introDescription: activeContent.introDescription || cId.introDescription || "",
          countriesCount: j.countriesCount,
          chapters: activeContent.chapters || cId.chapters || [],
          itinerary: activeContent.itinerary || cId.itinerary || [],
          highlights: activeContent.highlights || cId.highlights || [],
          accommodations: activeContent.accommodations || cId.accommodations || [],
          flights: activeContent.flights || cId.flights || { airline: "", route: [] },
          inclusions: activeContent.inclusions || cId.inclusions || [],
          exclusions: activeContent.exclusions || cId.exclusions || [],
          faqs: activeContent.faqs || cId.faqs || [],
          status: (j as any).status === "active" ? "Available" : (j as any).status === "inactive" ? "Closed" : (j as any).status === "draft" ? "Draft" : ((j as any).status || "Available")
        };
      }));

      // 3. Fetch Open Trips
      const apiOpenTrips = await apiFetch<ApiOpenTrip[]>("/admin/open-trips").catch(() => []);
      setRawApiOpenTrips(apiOpenTrips);
      setOpenTripsList(apiOpenTrips.map(ot => {
        const cId = ot.contentId || {};
        const cEn = ot.contentEn || {};
        const isEn = locale === "en";
        return {
          id: ot.id,
          slug: ot.slug,
          regionSlug: cId.regionSlug || cEn.regionSlug || "",
          subSlug: cId.subSlug || cEn.subSlug || "",
          name: isEn ? (cEn.name || cId.name) : cId.name,
          nameEN: cEn.name || cId.name,
          tagline: isEn ? (cEn.tagline || cId.tagline) : cId.tagline,
          taglineEN: cEn.tagline || cId.tagline,
          duration: isEn ? (cEn.duration || cId.duration) : cId.duration,
          durationEN: cEn.duration || cId.duration,
          price: isEn ? (cEn.price || cId.price) : cId.price,
          priceEN: cEn.price || cId.price,
          hotelRating: isEn ? (cEn.hotelRating || cId.hotelRating) : cId.hotelRating,
          hotelRatingEN: cEn.hotelRating || cId.hotelRating,
          featuredImage: ot.featuredImage,
          highlights: isEn ? (cEn.highlights || cId.highlights) : cId.highlights || [],
          highlightsEN: cEn.highlights || cId.highlights || [],
          inclusions: isEn ? (cEn.inclusions || cId.inclusions) : cId.inclusions || [],
          inclusionsEN: cEn.inclusions || cId.inclusions || [],
          exclusions: isEn ? (cEn.exclusions || cId.exclusions) : cId.exclusions || [],
          exclusionsEN: cEn.exclusions || cId.exclusions || [],
          itinerary: isEn ? (cEn.itinerary || cId.itinerary) : cId.itinerary || [],
          status: (ot as any).status === "active" ? "Available" : (ot as any).status === "inactive" ? "Closed" : (ot as any).status === "draft" ? "Draft" : ((ot as any).status || "Available")
        };
      }));
    } catch (err: any) {
      console.error("Failed to load data", err);
      setErrorMsg(err.message || "Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [locale]);

  // ==========================================
  // FORM FIELDS: CURATED JOURNEY (Journey)
  // ==========================================
  const [cjId, setCjId] = useState("");
  const [cjSlug, setCjSlug] = useState("");
  const [cjTitleID, setCjTitleID] = useState("");
  const [cjTitleEN, setCjTitleEN] = useState("");
  const [cjDestination, setCjDestination] = useState("");
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
  const [cjIntroHeadingID, setCjIntroHeadingID] = useState("");
  const [cjIntroHeadingEN, setCjIntroHeadingEN] = useState("");
  const [cjIntroDescID, setCjIntroDescID] = useState("");
  const [cjIntroDescEN, setCjIntroDescEN] = useState("");
  const [cjCountriesCount, setCjCountriesCount] = useState(1);

  // Sub-arrays for Curated Journeys
  const [cjChapters, setCjChapters] = useState<JourneyChapter[]>([]);
  const [cjItinerary, setCjItinerary] = useState<JourneyItinerary[]>([]);
  const [cjHighlights, setCjHighlights] = useState<string[]>([]);
  const [cjAccommodations, setCjAccommodations] = useState<JourneyAccommodation[]>([]);
  const [cjFlightRoute, setCjFlightRoute] = useState<string[]>([]);
  const [cjInclusions, setCjInclusions] = useState<string[]>([]);
  const [cjExclusions, setCjExclusions] = useState<string[]>([]);
  const [cjFAQs, setCjFAQs] = useState<JourneyFAQ[]>([]);
  const [cjGallery, setCjGallery] = useState<string[]>([]);
  const [cjStatus, setCjStatus] = useState<"Available" | "Closed" | "Draft" | "active" | "draft" | "inactive" | "AVAILABLE" | "CLOSED" | "DRAFT">("Available");
  const [cjRemainingSeats, setCjRemainingSeats] = useState<number | "">("");
  const [cjMaxSeats, setCjMaxSeats] = useState<number | "">("");

  // ==========================================
  // FORM FIELDS: OPEN TRIP (TourPackageDetail)
  // ==========================================
  const [otRegionSlug, setOtRegionSlug] = useState("");
  const [otSubSlug, setOtSubSlug] = useState("");
  const [otSlug, setOtSlug] = useState("");
  const [otNameID, setOtNameID] = useState("");
  const [otNameEN, setOtNameEN] = useState("");
  const [otTaglineID, setOtTaglineID] = useState("");
  const [otTaglineEN, setOtTaglineEN] = useState("");
  const [otDurationID, setOtDurationID] = useState("");
  const [otDurationEN, setOtDurationEN] = useState("");
  const [otPriceID, setOtPriceID] = useState("");
  const [otPriceEN, setOtPriceEN] = useState("");
  const [otDepartureDateID, setOtDepartureDateID] = useState("");
  const [otDepartureDateEN, setOtDepartureDateEN] = useState("");
  const [otDepartureDateFrom, setOtDepartureDateFrom] = useState("");
  const [otDepartureDateTo, setOtDepartureDateTo] = useState("");
  const [otIsEveryday, setOtIsEveryday] = useState(false);
  const [otHotelRatingID, setOtHotelRatingID] = useState("");
  const [otHotelRatingEN, setOtHotelRatingEN] = useState("");
  const [otFeaturedImage, setOtFeaturedImage] = useState("");
  const [otStatus, setOtStatus] = useState<"Available" | "Closed" | "Draft" | "active" | "draft" | "inactive" | "AVAILABLE" | "CLOSED" | "DRAFT">("Available");
  const [otRemainingSeats, setOtRemainingSeats] = useState<number | "">("");
  const [otMaxSeats, setOtMaxSeats] = useState<number | "">("");

  // Multi-Schedule Batches State
  const [otBatches, setOtBatches] = useState<DepartureBatch[]>([]);
  const [newBatchDateID, setNewBatchDateID] = useState("");
  const [newBatchDateEN, setNewBatchDateEN] = useState("");
  const [newBatchFromDate, setNewBatchFromDate] = useState("");
  const [newBatchToDate, setNewBatchToDate] = useState("");
  const [newBatchDurationID, setNewBatchDurationID] = useState("");
  const [newBatchDurationEN, setNewBatchDurationEN] = useState("");
  const [newBatchPriceID, setNewBatchPriceID] = useState("");
  const [newBatchPriceEN, setNewBatchPriceEN] = useState("");
  const [newBatchStatus, setNewBatchStatus] = useState<"Available" | "Closed" | "FULL" | "Draft">("Available");
  const [newBatchQuota, setNewBatchQuota] = useState<number>(20);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  // Lists managers
  const [otHighlightsID, setOtHighlightsID] = useState<string[]>([]);
  const [otHighlightsEN, setOtHighlightsEN] = useState<string[]>([]);
  const [newOtHighlightID, setNewOtHighlightID] = useState("");
  const [newOtHighlightEN, setNewOtHighlightEN] = useState("");

  const [otInclusionsID, setOtInclusionsID] = useState<string[]>([]);
  const [otInclusionsEN, setOtInclusionsEN] = useState<string[]>([]);
  const [newOtInclusionID, setNewOtInclusionID] = useState("");
  const [newOtInclusionEN, setNewOtInclusionEN] = useState("");

  const [otExclusionsID, setOtExclusionsID] = useState<string[]>([]);
  const [otExclusionsEN, setOtExclusionsEN] = useState<string[]>([]);
  const [newOtExclusionID, setNewOtExclusionID] = useState("");
  const [newOtExclusionEN, setNewOtExclusionEN] = useState("");

  // Detailed Itinerary State
  const [otItinerary, setOtItinerary] = useState<ItineraryDay[]>([]);
  const [newOtItDay, setNewOtItDay] = useState(1);
  const [newOtItTitleID, setNewOtItTitleID] = useState("");
  const [newOtItTitleEN, setNewOtItTitleEN] = useState("");
  const [newOtItDescID, setNewOtItDescID] = useState("");
  const [newOtItDescEN, setNewOtItDescEN] = useState("");
  const [newOtItHotelID, setNewOtItHotelID] = useState("");
  const [newOtItHotelEN, setNewOtItHotelEN] = useState("");
  const [newOtItActivitiesID, setNewOtItActivitiesID] = useState("");
  const [newOtItActivitiesEN, setNewOtItActivitiesEN] = useState("");
  const [newOtItImage, setNewOtItImage] = useState("");
  const [newOtItImages, setNewOtItImages] = useState<string[]>([]);
  const [editingItineraryIndex, setEditingItineraryIndex] = useState<number | null>(null);

  // Auto-translate functions
  const handleAutoTranslateCurated = async () => {
    setIsTranslating(true);
    try {
      if (formLang === "id") {
        if (cjTitleID.trim()) setCjTitleEN(await translateText(cjTitleID, "id", "en"));
        if (cjSubtitleID.trim()) setCjSubtitleEN(await translateText(cjSubtitleID, "id", "en"));
        if (cjIntroHeadingID.trim()) setCjIntroHeadingEN(await translateText(cjIntroHeadingID, "id", "en"));
        if (cjIntroDescID.trim()) setCjIntroDescEN(await translateText(cjIntroDescID, "id", "en"));
      } else {
        if (cjTitleEN.trim()) setCjTitleID(await translateText(cjTitleEN, "en", "id"));
        if (cjSubtitleEN.trim()) setCjSubtitleID(await translateText(cjSubtitleEN, "en", "id"));
        if (cjIntroHeadingEN.trim()) setCjIntroHeadingID(await translateText(cjIntroHeadingEN, "en", "id"));
        if (cjIntroDescEN.trim()) setCjIntroDescID(await translateText(cjIntroDescEN, "en", "id"));
      }
    } catch {
      // translate fallback
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (otDepartureDateFrom && otDepartureDateTo && otBatches.length === 0) {
      const formatDateStr = (dateStr: string) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return { id: dateStr, en: dateStr };
        const day = d.getDate().toString().padStart(2, "0");
        const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
          id: `${day} ${monthsId[d.getMonth()]} ${d.getFullYear()}`,
          en: `${day} ${monthsEn[d.getMonth()]} ${d.getFullYear()}`
        };
      };
      const fromFmt = formatDateStr(otDepartureDateFrom);
      const toFmt = formatDateStr(otDepartureDateTo);
      setOtDepartureDateID(`${fromFmt.id} - ${toFmt.id}`);
      setOtDepartureDateEN(`${fromFmt.en} - ${toFmt.en}`);
    }
  }, [otDepartureDateFrom, otDepartureDateTo, otBatches.length]);

  // Auto-sync batches data to primary fields when batches exist
  useEffect(() => {
    if (otBatches.length > 0) {
      const validPricesID = otBatches.map(b => b.priceID).filter(Boolean);
      const validPricesEN = otBatches.map(b => b.priceEN || b.priceID).filter(Boolean);

      if (validPricesID.length > 0) {
        const lowestPrice = validPricesID[0];
        setOtPriceID(lowestPrice.toLowerCase().includes("rp") || lowestPrice.toLowerCase().includes("mulai") ? lowestPrice : `Mulai ${lowestPrice}`);
      }
      if (validPricesEN.length > 0) {
        const lowestPriceEN = validPricesEN[0];
        setOtPriceEN(lowestPriceEN.toLowerCase().includes("rp") || lowestPriceEN.toLowerCase().includes("from") ? lowestPriceEN : `From ${lowestPriceEN}`);
      }
      setOtDurationID(otBatches[0].durationID || "5 Hari 4 Malam");
      setOtDurationEN(otBatches[0].durationEN || otBatches[0].durationID || "5 Days 4 Nights");
      setOtDepartureDateID(otBatches.map(b => b.dateStrID).join(", "));
      setOtDepartureDateEN(otBatches.map(b => b.dateStrEN || b.dateStrID).join(", "));
      if (otBatches[0].fromDate) setOtDepartureDateFrom(otBatches[0].fromDate);
      if (otBatches[0].toDate) setOtDepartureDateTo(otBatches[0].toDate);
    }
  }, [otBatches]);

  // Auto-calculate newBatchToDate based on newBatchFromDate and otDurationID
  useEffect(() => {
    if (newBatchFromDate && otDurationID) {
      const calculated = calculateEndDate(newBatchFromDate, otDurationID);
      if (calculated && calculated !== newBatchToDate) {
        setNewBatchToDate(calculated);
      }
    }
  }, [newBatchFromDate, otDurationID]);

  // Auto-calculate batch date range label and duration from datepickers
  useEffect(() => {
    if (newBatchFromDate && newBatchToDate) {
      const start = new Date(newBatchFromDate);
      const end = new Date(newBatchToDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const diffNights = diffDays - 1;

        if (diffDays > 0) {
          const daysStrID = `${diffDays} Hari ${diffNights > 0 ? `${diffNights} Malam` : ""}`.trim();
          const daysStrEN = `${diffDays} Days ${diffNights > 0 ? `${diffNights} Nights` : ""}`.trim();
          setNewBatchDurationID(daysStrID);
          setNewBatchDurationEN(daysStrEN);
        }

        const startDay = start.getDate();
        const startYear = start.getFullYear();
        const endDay = end.getDate();
        const endYear = end.getFullYear();

        const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const startMonthID = monthsId[start.getMonth()];
        const startMonthEN = monthsEn[start.getMonth()];
        const endMonthID = monthsId[end.getMonth()];
        const endMonthEN = monthsEn[end.getMonth()];

        let formattedID = "";
        let formattedEN = "";

        if (startYear === endYear) {
          if (startMonthID === endMonthID) {
            if (startDay === endDay) {
              formattedID = `${startDay} ${startMonthID} ${startYear}`;
              formattedEN = `${startDay} ${startMonthEN} ${startYear}`;
            } else {
              formattedID = `${startDay} - ${endDay} ${startMonthID} ${startYear}`;
              formattedEN = `${startDay} - ${endDay} ${startMonthEN} ${startYear}`;
            }
          } else {
            formattedID = `${startDay} ${startMonthID} - ${endDay} ${endMonthID} ${startYear}`;
            formattedEN = `${startDay} ${startMonthEN} - ${endDay} ${endMonthEN} ${startYear}`;
          }
        } else {
          formattedID = `${startDay} ${startMonthID} ${startYear} - ${endDay} ${endMonthID} ${endYear}`;
          formattedEN = `${startDay} ${startMonthEN} ${startYear} - ${endDay} ${endMonthEN} ${endYear}`;
        }

        setNewBatchDateID(formattedID);
        setNewBatchDateEN(formattedEN);
      }
    }
  }, [newBatchFromDate, newBatchToDate]);

  const handleAutoTranslateOpenTrip = async () => {
    setIsTranslating(true);
    try {
      if (formLang === "id") {
        if (otNameID.trim()) setOtNameEN(await translateText(otNameID, "id", "en"));
        if (otTaglineID.trim()) setOtTaglineEN(await translateText(otTaglineID, "id", "en"));
        if (otDurationID.trim()) setOtDurationEN(await translateText(otDurationID, "id", "en"));
        if (otPriceID.trim()) setOtPriceEN(await translateText(otPriceID, "id", "en"));
        if (otDepartureDateID.trim()) setOtDepartureDateEN(await translateText(otDepartureDateID, "id", "en"));
        if (otHotelRatingID.trim()) setOtHotelRatingEN(await translateText(otHotelRatingID, "id", "en"));

        // Translate arrays
        if (otHighlightsID.length > 0) {
          const translated = await Promise.all(
            otHighlightsID.map(async (h) => (h.trim() ? await translateText(h.trim(), "id", "en") : ""))
          );
          setOtHighlightsEN(translated.filter(Boolean));
        }
        if (otInclusionsID.length > 0) {
          const translated = await Promise.all(
            otInclusionsID.map(async (i) => (i.trim() ? await translateText(i.trim(), "id", "en") : ""))
          );
          setOtInclusionsEN(translated.filter(Boolean));
        }
        if (otExclusionsID.length > 0) {
          const translated = await Promise.all(
            otExclusionsID.map(async (e) => (e.trim() ? await translateText(e.trim(), "id", "en") : ""))
          );
          setOtExclusionsEN(translated.filter(Boolean));
        }
      } else {
        if (otNameEN.trim()) setOtNameID(await translateText(otNameEN, "en", "id"));
        if (otTaglineEN.trim()) setOtTaglineID(await translateText(otTaglineEN, "en", "id"));
        if (otDurationEN.trim()) setOtDurationID(await translateText(otDurationEN, "en", "id"));
        if (otPriceEN.trim()) setOtPriceID(await translateText(otPriceEN, "en", "id"));
        if (otDepartureDateEN.trim()) setOtDepartureDateID(await translateText(otDepartureDateEN, "en", "id"));
        if (otHotelRatingEN.trim()) setOtHotelRatingID(await translateText(otHotelRatingEN, "en", "id"));

        // Translate arrays
        if (otHighlightsEN.length > 0) {
          const translated = await Promise.all(
            otHighlightsEN.map(async (h) => (h.trim() ? await translateText(h.trim(), "en", "id") : ""))
          );
          setOtHighlightsID(translated.filter(Boolean));
        }
        if (otInclusionsEN.length > 0) {
          const translated = await Promise.all(
            otInclusionsEN.map(async (i) => (i.trim() ? await translateText(i.trim(), "en", "id") : ""))
          );
          setOtInclusionsID(translated.filter(Boolean));
        }
        if (otExclusionsEN.length > 0) {
          const translated = await Promise.all(
            otExclusionsEN.map(async (e) => (e.trim() ? await translateText(e.trim(), "en", "id") : ""))
          );
          setOtExclusionsID(translated.filter(Boolean));
        }
      }
    } catch {
      // translate fallback
    } finally {
      setIsTranslating(false);
    }
  };

  // Reset Curated Form
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
    setCjStatus("Available");
    setIsEditingCurated(false);
    setEditCuratedId(null);
    setFormLang("id");
    setViewMode("list");
  };

  const handleEditCurated = (j: Journey) => {
    const raw = rawApiJourneys.find(item => item.id === j.id);
    if (!raw) return;

    const cId = raw.contentId || {};
    const cEn = raw.contentEn || {};

    setIsEditingCurated(true);
    setEditCuratedId(raw.id);
    setCjId(raw.id);
    setCjSlug(raw.slug);
    setCjTitleID(cId.title || j.title);
    setCjTitleEN(cEn.title || cId.title || j.title);
    setCjDestination(cId.destination || j.destination);
    setCjSubtitleID(cId.subtitle || j.subtitle);
    setCjSubtitleEN(cEn.subtitle || cId.subtitle || j.subtitle);
    setCjDurationDays(raw.durationDays);
    setCjDurationLabel(cId.durationLabel || j.durationLabel);
    setCjDates(cId.dates || j.dates);
    setCjAirline(cId.airline || j.airline);
    setCjPrice(cId.price || j.price);
    setCjPriceRaw(Number(raw.priceRaw));
    setCjTravelMonth(cId.travelMonth || j.travelMonth);
    setCjTravelStyle(cId.travelStyle || j.travelStyle);
    setCjImage(raw.image);
    setCjIntroHeadingID(cId.introHeading || j.introHeading || "");
    setCjIntroHeadingEN(cEn.introHeading || cId.introHeading || j.introHeading || "");
    setCjIntroDescID(cId.introDescription || j.introDescription || "");
    setCjIntroDescEN(cEn.introDescription || cId.introDescription || j.introDescription || "");
    setCjCountriesCount(raw.countriesCount || 1);
    setCjChapters(cId.chapters || j.chapters || []);
    setCjItinerary(cId.itinerary || j.itinerary || []);
    setCjHighlights(cId.highlights || j.highlights || []);
    setCjAccommodations(cId.accommodations || j.accommodations || []);
    setCjFlightRoute(cId.flights?.route || j.flights?.route || []);
    setCjInclusions(cId.inclusions || j.inclusions || []);
    setCjExclusions(cId.exclusions || j.exclusions || []);
    setCjFAQs(cId.faqs || j.faqs || []);
    const rawStatus = j.status || (raw as any).status || "Available";
    const mappedStatus = rawStatus === "active" ? "Available" : rawStatus === "inactive" ? "Closed" : rawStatus === "draft" ? "Draft" : rawStatus;
    setCjStatus(mappedStatus as any);
    setFormLang("id");
    setViewMode("form");
  };

  const handleDeleteCurated = async (id: string) => {
    if (confirm(locale === "id" ? "Hapus perjalanan kurasi ini dari database?" : "Delete this curated journey from database?")) {
      try {
        await apiFetch(`/admin/journeys/${id}`, { method: "DELETE" });
        setToast({ message: locale === "id" ? "Paket perjalanan kurasi berhasil dihapus!" : "Curated journey deleted successfully!", type: "success" });
        fetchAllData();
      } catch (err: any) {
        setToast({ message: err.message || "Gagal menghapus paket perjalanan.", type: "error" });
      }
    }
  };

  const handleUpdateCuratedStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/admin/journeys/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          isPublished: newStatus !== "Draft" && newStatus !== "draft" && newStatus !== "DRAFT"
        }),
      });
      setToast({ message: locale === "id" ? "Status perjalanan berhasil diperbarui!" : "Curated journey status updated successfully!", type: "success" });
      fetchAllData();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal memperbarui status perjalanan.", type: "error" });
    }
  };

  const handleSaveCurated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cjTitleID.trim() || !cjSlug.trim() || !cjImage.trim()) {
      setToast({ message: "Harap lengkapi Judul, Slug, dan Gambar Utama!", type: "error" });
      return;
    }

    setIsSaving(true);
    const contentId = {
      title: cjTitleID,
      destination: cjDestination,
      subtitle: cjSubtitleID,
      durationLabel: cjDurationLabel,
      dates: cjDates,
      airline: cjAirline,
      price: cjPrice || `Rp ${Number(cjPriceRaw).toLocaleString("id-ID")}`,
      travelMonth: cjTravelMonth,
      travelStyle: cjTravelStyle,
      introHeading: cjIntroHeadingID,
      introDescription: cjIntroDescID,
      chapters: cjChapters,
      itinerary: cjItinerary,
      highlights: cjHighlights,
      accommodations: cjAccommodations,
      flights: { airline: cjAirline, route: cjFlightRoute },
      inclusions: cjInclusions,
      exclusions: cjExclusions,
      faqs: cjFAQs,
    };

    const contentEn = {
      title: cjTitleEN || cjTitleID,
      destination: cjDestination,
      subtitle: cjSubtitleEN || cjSubtitleID,
      durationLabel: cjDurationLabel,
      dates: cjDates,
      airline: cjAirline,
      price: cjPrice || `Rp ${Number(cjPriceRaw).toLocaleString("id-ID")}`,
      travelMonth: cjTravelMonth,
      travelStyle: cjTravelStyle,
      introHeading: cjIntroHeadingEN || cjIntroHeadingID,
      introDescription: cjIntroDescEN || cjIntroDescID,
      chapters: cjChapters,
      itinerary: cjItinerary,
      highlights: cjHighlights,
      accommodations: cjAccommodations,
      flights: { airline: cjAirline, route: cjFlightRoute },
      inclusions: cjInclusions,
      exclusions: cjExclusions,
      faqs: cjFAQs,
    };

    const payload = {
      slug: cjSlug.trim().toLowerCase(),
      durationDays: Number(cjDurationDays) || 1,
      priceRaw: Number(cjPriceRaw) || 0,
      countriesCount: Number(cjCountriesCount) || 1,
      image: cjImage,
      imageGradient: "from-[#38BDF8] to-[#0369A1]",
      gallery: cjGallery,
      status: cjStatus,
      isPublished: cjStatus !== "Draft" && cjStatus !== "draft" && cjStatus !== "DRAFT",
      contentId,
      contentEn,
    };

    try {
      if (editCuratedId) {
        await apiFetch(`/admin/journeys/${editCuratedId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ message: locale === "id" ? "Paket perjalanan kurasi berhasil diperbarui!" : "Curated journey updated successfully!", type: "success" });
      } else {
        await apiFetch("/admin/journeys", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({ message: locale === "id" ? "Paket perjalanan kurasi baru berhasil ditambahkan!" : "New curated journey added successfully!", type: "success" });
      }
      resetCuratedForm();
      fetchAllData();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menyimpan paket perjalanan.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Open Trips Reset & Edit
  const resetOpenTripForm = () => {
    setOtRegionSlug("");
    setOtSubSlug("");
    setOtSlug("");
    setOtNameID("");
    setOtNameEN("");
    setOtTaglineID("");
    setOtTaglineEN("");
    setOtDurationID("");
    setOtDurationEN("");
    setOtPriceID("");
    setOtPriceEN("");
    setOtDepartureDateID("");
    setOtDepartureDateEN("");
    setOtDepartureDateFrom("");
    setOtDepartureDateTo("");
    setOtIsEveryday(false);
    setOtHotelRatingID("");
    setOtHotelRatingEN("");
    setOtStatus("Available");
    setOtHighlightsID([]);
    setOtHighlightsEN([]);
    setOtInclusionsID([]);
    setOtInclusionsEN([]);
    setOtExclusionsID([]);
    setOtExclusionsEN([]);
    setOtItinerary([]);
    setNewOtItDay(1);
    setNewOtItTitleID("");
    setNewOtItTitleEN("");
    setNewOtItDescID("");
    setNewOtItDescEN("");
    setNewOtItHotelID("");
    setNewOtItHotelEN("");
    setNewOtItActivitiesID("");
    setNewOtItActivitiesEN("");
    setNewOtItImage("");
    setEditingItineraryIndex(null);
    setIsEditingOpenTrip(false);
    setEditOpenTripId(null);
    setOtBatches([]);
    setNewBatchDateID("");
    setNewBatchDateEN("");
    setNewBatchFromDate("");
    setNewBatchToDate("");
    setNewBatchDurationID("");
    setNewBatchDurationEN("");
    setNewBatchPriceID("");
    setNewBatchPriceEN("");
    setNewBatchStatus("Available");
    setEditingBatchId(null);
    setFormLang("id");
    setViewMode("list");
  };

  const handleEditOpenTrip = (pkg: TourPackageDetail & { id?: string }) => {
    const raw = rawApiOpenTrips.find(item => item.id === pkg.id || item.slug === pkg.slug);
    if (!raw) return;

    const cId = raw.contentId || {};
    const cEn = raw.contentEn || {};

    setIsEditingOpenTrip(true);
    setEditOpenTripId(raw.id);
    setOtSlug(raw.slug);
    setOtRegionSlug(cId.regionSlug || pkg.regionSlug || "");
    setOtSubSlug(cId.subSlug || pkg.subSlug || "");
    setOtNameID(cId.name || pkg.name);
    setOtNameEN(cEn.name || cId.name || pkg.name);
    setOtTaglineID(cId.tagline || pkg.tagline);
    setOtTaglineEN(cEn.tagline || cId.tagline || pkg.tagline);
    setOtDurationID(cId.duration || pkg.duration);
    setOtDurationEN(cEn.duration || cId.duration || pkg.duration);
    setOtPriceID(cId.price || pkg.price);
    setOtPriceEN(cEn.price || cId.price || pkg.price);
    const isEv = (cId.departureDate === "-" || pkg.departureDate === "-");
    setOtIsEveryday(isEv);
    setOtDepartureDateID(cId.departureDate || pkg.departureDate || "");
    setOtDepartureDateEN(cEn.departureDate || cId.departureDate || pkg.departureDate || "");
    setOtDepartureDateFrom(cId.departureDateFrom || pkg.departureDateFrom || "");
    setOtDepartureDateTo(cId.departureDateTo || pkg.departureDateTo || "");
    setOtHotelRatingID(cId.hotelRating || pkg.hotelRating);
    setOtHotelRatingEN(cEn.hotelRating || cId.hotelRating || pkg.hotelRating);
    setOtFeaturedImage(raw.featuredImage);
    const rawStatus = pkg.status || (raw as any).status || "Available";
    const mappedStatus = rawStatus === "active" ? "Available" : rawStatus === "inactive" ? "Closed" : rawStatus === "draft" ? "Draft" : rawStatus;
    setOtStatus(mappedStatus as any);
    setOtHighlightsID(cId.highlights || pkg.highlights || []);
    setOtHighlightsEN(cEn.highlights || cId.highlights || pkg.highlights || []);
    setOtInclusionsID(cId.inclusions || pkg.inclusions || []);
    setOtInclusionsEN(cEn.inclusions || cId.inclusions || pkg.inclusions || []);
    setOtExclusionsID(cId.exclusions || pkg.exclusions || []);
    setOtExclusionsEN(cEn.exclusions || cId.exclusions || pkg.exclusions || []);
    setOtItinerary(cId.itinerary || pkg.itinerary || []);
    const existingSchedules: ApiSchedule[] = (raw as any).schedules || cId.schedules || cEn.schedules || (pkg as any).schedules || [];
    let loadedBatches: DepartureBatch[] = [];

    if (existingSchedules && existingSchedules.length > 0) {
      loadedBatches = existingSchedules.map((s, idx) => {
        const formattedPrice = s.price ? `Rp ${s.price.toLocaleString("id-ID")}` : "";
        const statusMap = s.status === "close" ? "Closed" : "Available";

        let durID = "5 Hari 4 Malam";
        let durEN = "5 Days 4 Nights";
        let dtID = "";
        let dtEN = "";

        if (s.startDate && s.endDate) {
          const start = new Date(s.startDate);
          const end = new Date(s.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            const diffNights = diffDays - 1;
            durID = `${diffDays} Hari ${diffNights > 0 ? `${diffNights} Malam` : ""}`.trim();
            durEN = `${diffDays} Days ${diffNights > 0 ? `${diffNights} Nights` : ""}`.trim();

            const startDay = start.getDate();
            const startYear = start.getFullYear();
            const endDay = end.getDate();
            const endYear = end.getFullYear();

            const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
            const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const startMonthID = monthsId[start.getMonth()];
            const startMonthEN = monthsEn[start.getMonth()];
            const endMonthID = monthsId[end.getMonth()];
            const endMonthEN = monthsEn[end.getMonth()];

            if (startYear === endYear) {
              if (startMonthID === endMonthID) {
                if (startDay === endDay) {
                  dtID = `${startDay} ${startMonthID} ${startYear}`;
                  dtEN = `${startDay} ${startMonthEN} ${startYear}`;
                } else {
                  dtID = `${startDay} - ${endDay} ${startMonthID} ${startYear}`;
                  dtEN = `${startDay} - ${endDay} ${startMonthEN} ${startYear}`;
                }
              } else {
                dtID = `${startDay} ${startMonthID} - ${endDay} ${endMonthID} ${startYear}`;
                dtEN = `${startDay} ${startMonthEN} - ${endDay} ${endMonthEN} ${startYear}`;
              }
            } else {
              dtID = `${startDay} ${startMonthID} ${startYear} - ${endDay} ${endMonthID} ${endYear}`;
              dtEN = `${startDay} ${startMonthEN} ${startYear} - ${endDay} ${endMonthEN} ${endYear}`;
            }
          }
        }

        return {
          id: `batch-${Date.now()}-${idx}`,
          dateStrID: dtID || s.startDate || "",
          dateStrEN: dtEN || s.startDate || "",
          fromDate: s.startDate,
          toDate: s.endDate,
          durationID: durID,
          durationEN: durEN,
          priceID: formattedPrice,
          priceEN: formattedPrice,
          status: statusMap,
          quota: s.quota || 20
        };
      });
    } else {
      const existingBatches = raw.batches || cId.batches || cEn.batches || (pkg as any).batches || [];
      if (existingBatches.length === 0 && (cId.departureDate || pkg.departureDate)) {
        loadedBatches = [{
          id: `batch-${Date.now()}`,
          dateStrID: cId.departureDate || pkg.departureDate || "",
          dateStrEN: cEn.departureDate || cId.departureDate || pkg.departureDate || "",
          fromDate: cId.departureDateFrom || pkg.departureDateFrom || "",
          toDate: cId.departureDateTo || pkg.departureDateTo || "",
          durationID: cId.duration || pkg.duration || "5 Hari 4 Malam",
          durationEN: cEn.duration || cId.duration || pkg.duration || "5 Days 4 Nights",
          priceID: cId.price || pkg.price || "",
          priceEN: cEn.price || cId.price || pkg.price || "",
          status: (mappedStatus as any) || "Available",
          quota: 20
        }];
      } else {
        loadedBatches = existingBatches;
      }
    }

    setOtBatches(loadedBatches);
    setNewOtItDay(((cId.itinerary || pkg.itinerary)?.length || 0) + 1);
    setFormLang("id");
    setViewMode("form");
  };

  const handleDeleteOpenTrip = async (id: string) => {
    if (confirm(locale === "id" ? "Hapus Open Trip ini dari database?" : "Delete this open trip from database?")) {
      try {
        await apiFetch(`/admin/open-trips/${id}`, { method: "DELETE" });
        setToast({ message: locale === "id" ? "Open Trip berhasil dihapus!" : "Open Trip deleted successfully!", type: "success" });
        fetchAllData();
      } catch (err: any) {
        setToast({ message: err.message || "Gagal menghapus Open Trip.", type: "error" });
      }
    }
  };

  const handleUpdateOpenTripStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/admin/open-trips/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setToast({ message: locale === "id" ? "Status open trip berhasil diperbarui!" : "Open trip status updated successfully!", type: "success" });
      fetchAllData();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal memperbarui status open trip.", type: "error" });
    }
  };

  const handleSaveOpenTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otNameID.trim() || !otSlug.trim() || !otRegionSlug || !otSubSlug) {
      setToast({ message: "Harap pilih Wilayah, Sub-Destinasi, dan masukkan Nama Paket!", type: "error" });
      return;
    }

    if (otIsEveryday && !otPriceID.trim()) {
      setToast({ message: "Harap masukkan Harga per Pax (IDR) untuk Keberangkatan Setiap Hari!", type: "error" });
      return;
    }

    setIsSaving(true);
    const schedules = otBatches.map((b, idx) => {
      const numericPrice = parseInt(b.priceID.replace(/[^0-9]/g, ""), 10) || 0;
      const statusMap = (b.status === "Closed" || b.status === "Draft") ? "close" : "open";
      return {
        startDate: b.fromDate || "",
        endDate: b.toDate || "",
        price: numericPrice,
        quota: typeof b.quota === "number" ? b.quota : 20,
        status: statusMap as "open" | "close",
        sortOrder: idx
      };
    });

    const calculatedSchedules = otIsEveryday 
      ? [{ startDate: "-", endDate: "-", price: parseInt(otPriceID.replace(/[^0-9]/g, ""), 10) || 0, quota: 99, status: "open" as const, sortOrder: 0 }]
      : schedules;

    const contentId = {
      regionSlug: otRegionSlug,
      subSlug: otSubSlug,
      name: otNameID,
      tagline: otTaglineID,
      duration: otDurationID,
      price: otPriceID,
      departureDate: otIsEveryday ? "-" : otDepartureDateID,
      departureDateFrom: otIsEveryday ? "-" : otDepartureDateFrom,
      departureDateTo: otIsEveryday ? "-" : otDepartureDateTo,
      hotelRating: otHotelRatingID,
      highlights: otHighlightsID,
      inclusions: otInclusionsID,
      exclusions: otExclusionsID,
      itinerary: otItinerary,
      schedules: calculatedSchedules,
    };

    const contentEn = {
      regionSlug: otRegionSlug,
      subSlug: otSubSlug,
      name: otNameEN || otNameID,
      tagline: otTaglineEN || otTaglineID,
      duration: otDurationEN || otDurationID,
      price: otPriceEN || otPriceID,
      departureDate: otIsEveryday ? "-" : (otDepartureDateEN || otDepartureDateID),
      departureDateFrom: otIsEveryday ? "-" : otDepartureDateFrom,
      departureDateTo: otIsEveryday ? "-" : otDepartureDateTo,
      hotelRating: otHotelRatingEN || otHotelRatingID,
      highlights: otHighlightsEN || otHighlightsID,
      inclusions: otInclusionsEN || otInclusionsID,
      exclusions: otExclusionsEN || otExclusionsID,
      itinerary: otItinerary,
      schedules: calculatedSchedules,
    };

    const payload = {
      slug: otSlug.trim().toLowerCase(),
      featuredImage: otFeaturedImage || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
      status: otStatus,
      schedules: calculatedSchedules,
      contentId,
      contentEn
    };

    try {
      if (editOpenTripId) {
        await apiFetch(`/admin/open-trips/${editOpenTripId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ message: locale === "id" ? "Open Trip berhasil diperbarui!" : "Open Trip updated successfully!", type: "success" });
      } else {
        await apiFetch("/admin/open-trips", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({ message: locale === "id" ? "Open Trip baru berhasil ditambahkan!" : "New Open Trip added successfully!", type: "success" });
      }
      resetOpenTripForm();
      fetchAllData();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menyimpan Open Trip.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // MULTI-SCHEDULE BATCH HANDLERS
  // ==========================================
  const handleAddOrUpdateBatch = () => {
    if (!otIsEveryday && (!newBatchFromDate || !newBatchToDate)) {
      setToast({ message: "Harap pilih Tanggal Mulai dan Selesai Keberangkatan!", type: "error" });
      return;
    }

    const bId = editingBatchId || `batch-${Date.now()}`;
    const batchItem: DepartureBatch = {
      id: bId,
      dateStrID: otIsEveryday ? "-" : (newBatchDateID.trim() || "-"),
      dateStrEN: otIsEveryday ? "-" : (newBatchDateEN.trim() || newBatchDateID.trim() || "-"),
      fromDate: otIsEveryday ? "-" : newBatchFromDate,
      toDate: otIsEveryday ? "-" : newBatchToDate,
      durationID: newBatchDurationID.trim() || otDurationID || "5 Hari 4 Malam",
      durationEN: newBatchDurationEN.trim() || otDurationEN || newBatchDurationID.trim() || "5 Days 4 Nights",
      priceID: newBatchPriceID.trim() || otPriceID || "",
      priceEN: newBatchPriceEN.trim() || otPriceEN || newBatchPriceID.trim() || "",
      status: newBatchStatus,
      quota: newBatchQuota,
    };

    let updatedBatches: DepartureBatch[];
    if (editingBatchId) {
      updatedBatches = otBatches.map(b => b.id === editingBatchId ? batchItem : b);
    } else {
      updatedBatches = [...otBatches, batchItem];
    }

    setOtBatches(updatedBatches);

    // Auto sync price & dates summary if empty or on multi batch creation
    if (updatedBatches.length > 0) {
      const validPrices = updatedBatches.map(b => b.priceID).filter(Boolean);
      if (validPrices.length > 0 && (!otPriceID || otPriceID.startsWith("Mulai"))) {
        setOtPriceID(`Mulai ${validPrices[0]}`);
      }
      if (!otDepartureDateID) {
        setOtDepartureDateID(updatedBatches.map(b => b.dateStrID).join(", "));
      }
      if (!otDurationID && updatedBatches[0].durationID) {
        setOtDurationID(updatedBatches[0].durationID);
      }
    }

    // Reset batch inputs
    setNewBatchDateID("");
    setNewBatchDateEN("");
    setNewBatchFromDate("");
    setNewBatchToDate("");
    setNewBatchDurationID("");
    setNewBatchDurationEN("");
    setNewBatchPriceID("");
    setNewBatchPriceEN("");
    setNewBatchStatus("Available");
    setNewBatchQuota(20);
    setEditingBatchId(null);
  };

  const handleEditBatch = (b: DepartureBatch) => {
    setEditingBatchId(b.id);
    setNewBatchDateID(b.dateStrID);
    setNewBatchDateEN(b.dateStrEN || b.dateStrID);
    setNewBatchFromDate(b.fromDate || "");
    setNewBatchToDate(b.toDate || "");
    setNewBatchDurationID(b.durationID);
    setNewBatchDurationEN(b.durationEN || b.durationID);
    setNewBatchPriceID(b.priceID);
    setNewBatchPriceEN(b.priceEN || b.priceID);
    setNewBatchStatus(b.status);
    setNewBatchQuota(typeof b.quota === "number" ? b.quota : 20);
  };

  const handleDuplicateBatch = (b: DepartureBatch) => {
    const dup: DepartureBatch = {
      ...b,
      id: `batch-${Date.now()}`,
      dateStrID: `${b.dateStrID} (Copy)`,
    };
    setOtBatches([...otBatches, dup]);
  };

  const handleDeleteBatch = (id: string) => {
    setOtBatches(otBatches.filter(b => b.id !== id));
    if (editingBatchId === id) {
      setEditingBatchId(null);
      setNewBatchDateID("");
      setNewBatchDateEN("");
      setNewBatchDurationID("");
      setNewBatchPriceID("");
    }
  };

  // ==========================================
  // ITINERARY DAYS MANAGER HANDLERS
  // ==========================================
  const handleAddOrUpdateOtItineraryDay = () => {
    if (!newOtItTitleID.trim()) return;

    const actsID = newOtItActivitiesID ? newOtItActivitiesID.split(",").map(a => a.trim()).filter(Boolean) : [];
    const actsEN = newOtItActivitiesEN ? newOtItActivitiesEN.split(",").map(a => a.trim()).filter(Boolean) : actsID;

    const imageList = newOtItImages.length > 0 ? newOtItImages : (newOtItImage ? [newOtItImage] : []);
    const dayObj: ItineraryDay = {
      day: newOtItDay,
      title: newOtItTitleID,
      titleEN: newOtItTitleEN || newOtItTitleID,
      activities: actsID,
      activitiesEN: actsEN,
      description: newOtItDescID,
      descriptionEN: newOtItDescEN || newOtItDescID,
      hotel: newOtItHotelID,
      hotelEN: newOtItHotelEN || newOtItHotelID,
      image: imageList[0] || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800",
      images: imageList
    };

    if (editingItineraryIndex !== null) {
      const copy = [...otItinerary];
      copy[editingItineraryIndex] = dayObj;
      setOtItinerary(copy);
      setEditingItineraryIndex(null);
    } else {
      setOtItinerary([...otItinerary, dayObj]);
    }

    setNewOtItTitleID("");
    setNewOtItTitleEN("");
    setNewOtItDescID("");
    setNewOtItDescEN("");
    setNewOtItHotelID("");
    setNewOtItHotelEN("");
    setNewOtItActivitiesID("");
    setNewOtItActivitiesEN("");
    setNewOtItImage("");
    setNewOtItImages([]);
    setNewOtItDay(otItinerary.length + (editingItineraryIndex !== null ? 1 : 2));
  };

  const handleEditItineraryDay = (index: number) => {
    const d = otItinerary[index];
    setEditingItineraryIndex(index);
    setNewOtItDay(d.day);
    setNewOtItTitleID(d.title);
    setNewOtItTitleEN(d.titleEN || d.title);
    setNewOtItDescID(d.description);
    setNewOtItDescEN(d.descriptionEN || d.description);
    setNewOtItHotelID(d.hotel);
    setNewOtItHotelEN(d.hotelEN || d.hotel);
    setNewOtItActivitiesID(d.activities.join(", "));
    setNewOtItActivitiesEN(d.activitiesEN?.join(", ") || d.activities.join(", "));
    setNewOtItImage(d.image);
    setNewOtItImages(d.images && d.images.length > 0 ? d.images : (d.image ? [d.image] : []));
  };

  const handleRemoveItineraryDay = (index: number) => {
    const filtered = otItinerary.filter((_, idx) => idx !== index).map((day, idx) => ({
      ...day,
      day: idx + 1
    }));
    setOtItinerary(filtered);
    setNewOtItDay(filtered.length + 1);
  };

  const handleMoveDay = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === otItinerary.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...otItinerary];

    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    const updated = copy.map((day, idx) => ({ ...day, day: idx + 1 }));
    setOtItinerary(updated);
  };

  // Filter lists based on search query
  const filteredCurated = curatedList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.destination || "").toLowerCase().includes(q)
    );
  });

  const filteredOpenTrips = openTripsList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.regionSlug || "").toLowerCase().includes(q) ||
      (item.subSlug || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      {viewMode === "list" ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Title Section */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A89053] font-bold block mb-1">
              Product Management
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F2C59]">
              {locale === "id" ? "Open Trip & Paket Perjalanan" : "Open Trips & Tour Packages"}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Kelola katalog Open Trips / Paket Perjalanan dengan API Backend.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => {
              if (activeTab === "curated") {
                resetCuratedForm();
              } else {
                resetOpenTripForm();
              }
            }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0F2C59] font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>
              Kembali ke Daftar {activeTab === "curated" ? "Curated Journeys" : "Open Trips"}
            </span>
          </button>
          <div>
            <span className="text-[10px] font-mono bg-[#A89053]/15 text-[#A89053] px-2 py-0.5 rounded font-bold uppercase block text-center">
              {activeTab === "curated"
                ? isEditingCurated
                  ? `Edit Curated ID: ${editCuratedId}`
                  : "Curated Baru"
                : isEditingOpenTrip
                  ? `Edit Open Trip ID: ${editOpenTripId}`
                  : "Open Trip Baru"}
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
          {errorMsg}
        </div>
      )}

      {/* CURATED JOURNEY SECTION */}
      {activeTab === "curated" && (
        viewMode === "form" ? (
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>{isEditingCurated ? "Edit Curated Journey" : "Tambah Curated Journey Baru"}</span>
              {isSaving && <Loader2 size={16} className="animate-spin text-[#A89053]" />}
            </h2>

            <form onSubmit={handleSaveCurated} className="space-y-5 font-sans text-xs">
              {/* Select Open Trip to auto-fill */}
              <div className="bg-[#A89053]/5 border border-[#A89053]/20 p-4 rounded-xl space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Salin / Impor Data dari Open Trip
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const selectedOt = openTripsList.find(ot => ot.id === e.target.value);
                      if (selectedOt) handleImportFromOpenTrip(selectedOt);
                    }
                  }}
                  className="w-full bg-white border border-[#A89053]/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#A89053]"
                  defaultValue=""
                >
                  <option value="">-- Pilih Open Trip untuk di-copy --</option>
                  {openTripsList.map((ot) => (
                    <option key={ot.id} value={ot.id}>
                      {ot.name} ({ot.duration}) - Rp {ot.price}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  * Memilih Open Trip akan otomatis mengisi form dengan semua data dari Open Trip tersebut (termasuk Itinerary & Highlights).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cjSlug}
                    onChange={(e) => setCjSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    placeholder="e.g. majestic-japan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Durasi (Hari) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={cjDurationDays}
                    onChange={(e) => setCjDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Status Paket Curated Journey *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Available", label: "Available", desc: "Tersedia / Buka Pendaftaran" },
                    { value: "Closed", label: "Closed", desc: "Ditutup / Fully Booked" },
                    { value: "Draft", label: "Draft", desc: "Simpan sebagai draft" }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`relative flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${cjStatus === opt.value
                        ? "border-[#A89053] bg-[#A89053]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="cj-status"
                          value={opt.value}
                          checked={cjStatus === opt.value}
                          onChange={() => setCjStatus(opt.value as any)}
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

              {/* Cover Image Upload */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                  Gambar Cover Utama (URL / Upload) *
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={cjImage}
                    onChange={(e) => setCjImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                  <label className="inline-flex items-center gap-1 px-3.5 py-3 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer shrink-0">
                    {isUploadingCjMain ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    <span>{isUploadingCjMain ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" className="hidden" disabled={isUploadingCjMain} onChange={e => handleImageUpload(e, setCjImage, setIsUploadingCjMain)} />
                  </label>
                </div>
                {cjImage && (
                  <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200">
                    <img src={cjImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Price & Raw Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Harga Teks (Display)
                  </label>
                  <input
                    type="text"
                    value={cjPrice}
                    onChange={(e) => setCjPrice(e.target.value)}
                    placeholder="Mulai Rp 24.500.000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Harga Raw (Angka RP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={cjPriceRaw}
                    onChange={(e) => setCjPriceRaw(Number(e.target.value))}
                    placeholder="24500000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex border-b border-slate-200 pb-1.5 gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setFormLang("id")}
                  className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${formLang === "id" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                  🇮🇩 Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setFormLang("en")}
                  className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${formLang === "en" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                  🇬🇧 English
                </button>

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={handleAutoTranslateCurated}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2.5 py-1 rounded-lg hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                  >
                    {isTranslating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    <span>Auto Translate</span>
                  </button>
                </div>
              </div>

              {/* Content Form depending on Language */}
              {formLang === "id" ? (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Judul Paket (ID) *</label>
                    <input type="text" required value={cjTitleID} onChange={e => setCjTitleID(e.target.value)} placeholder="e.g. Kejayaan Musim Semi Jepang" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Subtitle / Tagline (ID)</label>
                    <input type="text" value={cjSubtitleID} onChange={e => setCjSubtitleID(e.target.value)} placeholder="e.g. Petualangan mewah 5 hari mengelilingi sakura" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Package Title (EN)</label>
                    <input type="text" value={cjTitleEN} onChange={e => setCjTitleEN(e.target.value)} placeholder="e.g. Spring Splendor in Japan" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Subtitle / Tagline (EN)</label>
                    <input type="text" value={cjSubtitleEN} onChange={e => setCjSubtitleEN(e.target.value)} placeholder="e.g. 5-day luxury journey around cherry blossoms" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#A89053] hover:bg-[#967F47] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Compass size={14} />}
                  <span>{isEditingCurated ? "Update Curated Journey" : "Simpan Curated Journey"}</span>
                </button>
                {isEditingCurated && (
                  <button
                    type="button"
                    onClick={resetCuratedForm}
                    className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Filter and Add Button Row */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari curated journey berdasarkan judul, slug, destinasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#A89053] focus:bg-white transition-all text-slate-800"
                />
              </div>
              <button
                onClick={() => {
                  resetCuratedForm();
                  setViewMode("form");
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0 w-full sm:w-auto font-sans"
              >
                <Plus size={14} />
                <span>Tambah Curated Journey</span>
              </button>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="animate-spin text-[#A89053] mb-3" size={32} />
                <span className="text-xs text-slate-500 font-sans font-bold">Memuat data curated journeys...</span>
              </div>
            ) : filteredCurated.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-sans">
                Tidak ada data Curated Journeys yang ditemukan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {filteredCurated.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Header Image */}
                    <div className="h-36 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 right-3 z-10 flex bg-slate-900/85 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 items-center gap-1 shadow-md" onClick={(e) => e.stopPropagation()}>
                        {[
                          { label: "Aktif", value: "active", activeClass: "bg-emerald-500 text-white shadow-sm border border-emerald-400/20" },
                          { label: "Draft", value: "draft", activeClass: "bg-amber-500 text-white shadow-sm border border-amber-400/20" },
                          { label: "Off", value: "inactive", activeClass: "bg-slate-500 text-white shadow-sm border border-slate-400/20" },
                        ].map((opt) => {
                          const currentStatus = item.status || "active";
                          const isChecked =
                            currentStatus.toLowerCase() === opt.value.toLowerCase() ||
                            (opt.value === "active" && currentStatus.toLowerCase() === "available") ||
                            (opt.value === "inactive" && currentStatus.toLowerCase() === "closed");
                          return (
                            <label
                              key={opt.value}
                              className={`flex items-center gap-1 text-[8px] font-bold uppercase cursor-pointer px-1.5 py-0.5 rounded-md transition-all select-none ${isChecked
                                ? opt.activeClass
                                : "text-slate-400 hover:text-white"
                                }`}
                            >
                              <input
                                type="radio"
                                name={`curated-status-${item.id}`}
                                value={opt.value}
                                checked={isChecked}
                                onChange={() => handleUpdateCuratedStatus(item.id, opt.value)}
                                className="hidden"
                              />
                              <span>{opt.label === "Off" ? "Off" : opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-md border border-white/20">
                          {item.durationDays} Hari
                        </span>
                        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#A89053] text-white">
                          {item.destination}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-sm text-[#0F2C59] line-clamp-1 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          Slug: {item.slug}
                        </p>
                        <p className="text-xs text-[#A89053] font-bold font-mono">
                          Rp {item.priceRaw.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCurated(item)}
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#0F2C59] transition-all cursor-pointer font-sans"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCurated(item.id)}
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
        )
      )}

      {/* OPEN TRIPS SECTION */}
      {activeTab === "open" && (
        viewMode === "form" ? (
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-base font-serif font-bold text-[#0F2C59] pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>{isEditingOpenTrip ? "Edit Open Trip" : "Tambah Open Trip / Paket Wisata Baru"}</span>
              {isSaving && <Loader2 size={16} className="animate-spin text-[#A89053]" />}
            </h2>

            <form onSubmit={handleSaveOpenTrip} className="space-y-5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Pilih Wilayah (Region) *
                  </label>
                  <select
                    required
                    value={otRegionSlug}
                    onChange={(e) => {
                      setOtRegionSlug(e.target.value);
                      setOtSubSlug("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  >
                    <option value="">-- Pilih Wilayah --</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Sub-Destinasi *
                  </label>
                  <select
                    required
                    value={otSubSlug}
                    onChange={(e) => {
                      setOtSubSlug(e.target.value);
                      if (!otSlug) setOtSlug(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  >
                    <option value="">-- Pilih Sub-Destinasi --</option>
                    {(regions.find(r => r.id === otRegionSlug)?.subDestinations || []).map((sub, idx) => (
                      <option key={idx} value={sub.slug}>
                        {sub.name} ({sub.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={otSlug}
                    onChange={(e) => setOtSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                    placeholder="e.g. tokyo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                    Featured Image URL / Upload *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={otFeaturedImage}
                      onChange={(e) => setOtFeaturedImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A89053]"
                    />
                    <label className="inline-flex items-center gap-1 px-3 py-3 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer shrink-0">
                      {isUploadingOtMain ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      <span>{isUploadingOtMain ? "Uploading..." : "Upload"}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={isUploadingOtMain} onChange={e => handleImageUpload(e, setOtFeaturedImage, setIsUploadingOtMain)} />
                    </label>
                  </div>
                </div>
              </div>



              {/* Status Radio Buttons */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Status Paket Open Trip *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Available", label: "Available", desc: "Tersedia / Buka Pendaftaran" },
                    { value: "Closed", label: "Closed", desc: "Ditutup / Fully Booked" },
                    { value: "Draft", label: "Draft", desc: "Simpan sebagai draft" }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`relative flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${otStatus === opt.value
                        ? "border-[#A89053] bg-[#A89053]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="ot-status"
                          value={opt.value}
                          checked={otStatus === opt.value}
                          onChange={() => setOtStatus(opt.value as any)}
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

              {/* Language Switcher */}
              <div className="flex border-b border-slate-200 pb-1.5 gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setFormLang("id")}
                  className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${formLang === "id" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                  🇮🇩 Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setFormLang("en")}
                  className={`pb-1 text-[10px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${formLang === "en" ? "border-[#A89053] text-[#0F2C59]" : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                >
                  🇬🇧 English
                </button>

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={handleAutoTranslateOpenTrip}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-[#A89053] text-white px-2.5 py-1 rounded-lg hover:bg-[#0F2C59] transition-colors disabled:opacity-50 cursor-pointer font-bold"
                  >
                    {isTranslating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    <span>Auto Translate</span>
                  </button>
                </div>
              </div>

              {/* Language fields */}
              {formLang === "id" ? (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Nama Paket (ID) *</label>
                    <input type="text" required value={otNameID} onChange={e => setOtNameID(e.target.value)} placeholder="e.g. Tokyo" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Hari (ID) *</label>
                    <input type="text" required value={otDurationID} onChange={e => setOtDurationID(e.target.value)} placeholder="e.g. 5 Hari 4 Malam" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Hotel (ID)</label>
                    <input type="text" value={otHotelRatingID} onChange={e => setOtHotelRatingID(e.target.value)} placeholder="4★ Shinjuku Hotel" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Highlights Perjalanan (ID - 1 per baris)</label>
                    <textarea
                      rows={3}
                      value={otHighlightsID.join("\n")}
                      onChange={e => setOtHighlightsID(e.target.value.split("\n"))}
                      placeholder={"Eksplorasi Kota\nWisata Kuliner Lokal\nDestinasi Ikonik\nBelanja Oleh-oleh"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Harga Termasuk / Inclusions (ID - 1 per baris)</label>
                    <textarea
                      rows={4}
                      value={otInclusionsID.join("\n")}
                      onChange={e => setOtInclusionsID(e.target.value.split("\n"))}
                      placeholder={"Akomodasi hotel bintang 4 pilihan\nTransportasi nyaman selama tour\nTiket masuk tempat wisata sesuai program\nMakan pagi, siang, dan malam sesuai jadwal\nPemandu wisata bersertifikat"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Harga Tidak Termasuk / Exclusions (ID - 1 per baris)</label>
                    <textarea
                      rows={3}
                      value={otExclusionsID.join("\n")}
                      onChange={e => setOtExclusionsID(e.target.value.split("\n"))}
                      placeholder={"Tiket penerbangan atau transportasi menuju kota tujuan\nPengeluaran pribadi (laundry, telepon, belanja)\nTips driver & guide"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Package Name (EN)</label>
                    <input type="text" value={otNameEN} onChange={e => setOtNameEN(e.target.value)} placeholder="e.g. Tokyo" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Hari (EN)</label>
                    <input type="text" value={otDurationEN} onChange={e => setOtDurationEN(e.target.value)} placeholder="e.g. 5 Days 4 Nights" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Hotel (EN)</label>
                    <input type="text" value={otHotelRatingEN} onChange={e => setOtHotelRatingEN(e.target.value)} placeholder="4★ Shinjuku Hotel" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Highlights (EN - 1 per line)</label>
                    <textarea
                      rows={3}
                      value={otHighlightsEN.join("\n")}
                      onChange={e => setOtHighlightsEN(e.target.value.split("\n"))}
                      placeholder={"City Exploration\nLocal Culinary Tour\nIconic Destinations\nSouvenir Shopping"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Inclusions (EN - 1 per line)</label>
                    <textarea
                      rows={4}
                      value={otInclusionsEN.join("\n")}
                      onChange={e => setOtInclusionsEN(e.target.value.split("\n"))}
                      placeholder={"Selected 4-star hotel accommodation\nComfortable transportation during tour\nEntrance tickets to attractions per itinerary\nBreakfast, lunch, and dinner per itinerary\nCertified tour guide"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Exclusions (EN - 1 per line)</label>
                    <textarea
                      rows={3}
                      value={otExclusionsEN.join("\n")}
                      onChange={e => setOtExclusionsEN(e.target.value.split("\n"))}
                      placeholder={"Flight tickets or transport to destination city\nPersonal expenses (laundry, phone, shopping)\nTips for driver & guide"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Multi-Schedule / Departure Batches Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#0F2C59] flex items-center gap-2">
                    <Clock size={16} className="text-[#A89053]" />
                    <span>Jadwal Keberangkatan & Varian Harga ({otBatches.length} Batch)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Multi-Schedule & Price Batches
                  </span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="everyday-checkbox"
                      checked={otIsEveryday}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setOtIsEveryday(checked);
                        if (checked) {
                          setOtDepartureDateID("-");
                          setOtDepartureDateEN("-");
                          setOtDepartureDateFrom("-");
                          setOtDepartureDateTo("-");
                        } else {
                          setOtDepartureDateID("");
                          setOtDepartureDateEN("");
                          setOtDepartureDateFrom("");
                          setOtDepartureDateTo("");
                        }
                      }}
                      className="w-4 h-4 text-[#0F2C59] border-slate-300 rounded focus:ring-[#A89053] cursor-pointer"
                    />
                    <label htmlFor="everyday-checkbox" className="text-xs font-bold text-[#0F2C59] cursor-pointer select-none">
                      Keberangkatan Setiap Hari (EVERYDAY)
                    </label>
                    <span className="text-[10px] text-slate-500 italic ml-auto">
                      (Mengisi payload tanggal dengan "-")
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Tambahkan beberapa opsi tanggal keberangkatan, harga per pax, durasi, dan status kuota untuk paket wisata ini. Pilihan ini akan tampil di storefront secara otomatis.
                  </p>

                  {!otIsEveryday ? (
                    <>
                      {/* Existing Batches List Table */}
                      {otBatches.length > 0 && (
                        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                                <th className="p-3">Tgl Keberangkatan</th>
                                <th className="p-3">Durasi</th>
                                <th className="p-3">Harga (IDR)</th>
                                <th className="p-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {otBatches.map((b) => (
                                <tr key={b.id} className={`hover:bg-slate-50/80 transition-colors ${editingBatchId === b.id ? "bg-[#A89053]/10" : ""}`}>
                                  <td className="p-3 font-semibold text-slate-800">
                                    {b.dateStrID}
                                    {b.dateStrEN && b.dateStrEN !== b.dateStrID && (
                                      <span className="block text-[10px] text-slate-400 font-normal">EN: {b.dateStrEN}</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-slate-600 font-mono text-[11px]">
                                    {b.durationID}
                                  </td>
                                  <td className="p-3 font-bold text-[#0284C7] font-mono">
                                    {b.priceID || "-"}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleEditBatch(b)}
                                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all"
                                        title="Edit Batch"
                                      >
                                        <Edit3 size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDuplicateBatch(b)}
                                        className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 transition-all"
                                        title="Duplikat Batch"
                                      >
                                        <Plus size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBatch(b.id)}
                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all"
                                        title="Hapus Batch"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Batch Input Form */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                        <span className="text-[10px] font-mono font-bold text-[#0F2C59] uppercase tracking-wider block">
                          {editingBatchId ? "✏️ Edit Batch Keberangkatan" : "➕ Tambah Batch Keberangkatan Baru"}
                        </span>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">📅 Tgl Mulai (Start Date) *</label>
                              <input
                                type="date"
                                value={newBatchFromDate}
                                onChange={(e) => setNewBatchFromDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">
                                📅 Tgl Selesai (End Date) <span className="text-[#A89053] font-normal italic">(Otomatis dari Hari)</span> *
                              </label>
                              <input
                                type="date"
                                readOnly
                                disabled
                                value={newBatchToDate}
                                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-not-allowed text-slate-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Durasi (ID)</label>
                              <input
                                type="text"
                                value={newBatchDurationID}
                                onChange={(e) => setNewBatchDurationID(e.target.value)}
                                placeholder="e.g. 5 Hari 4 Malam"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold">Harga per Pax (IDR) *</label>
                              <input
                                type="text"
                                value={newBatchPriceID}
                                onChange={(e) => setNewBatchPriceID(e.target.value)}
                                placeholder="e.g. Rp 16.800.000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                              />
                            </div>
                          </div>

                          {/* Display calculated label preview */}
                          {(newBatchDateID || newBatchDateEN) && (
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 pt-1 border-t border-slate-100">
                              <span>Label Keberangkatan: <strong>{newBatchDateID}</strong></span>
                              <button
                                type="button"
                                onClick={() => {
                                  const customVal = prompt("Masukkan custom label tanggal:", newBatchDateID);
                                  if (customVal !== null) {
                                    setNewBatchDateID(customVal);
                                  }
                                }}
                                className="text-[#0284C7] hover:underline text-[9px]"
                              >
                                (Edit Manual)
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {editingBatchId ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBatchId(null);
                                setNewBatchDateID("");
                                setNewBatchDateEN("");
                                setNewBatchDurationID("");
                                setNewBatchPriceID("");
                              }}
                              className="text-[10px] text-rose-600 font-bold uppercase hover:underline"
                            >
                              Batal Edit
                            </button>
                          ) : <div />}

                          <button
                            type="button"
                            onClick={handleAddOrUpdateBatch}
                            className="bg-[#0F2C59] hover:bg-[#0284C7] text-white px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Plus size={12} />
                            <span>{editingBatchId ? "Simpan Perubahan Batch" : "Tambah Batch Ke Tabel"}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-4 space-y-3">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-[#0F2C59]">
                          Keberangkatan Setiap Hari Aktif
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Jadwal tanggal spesifik disembunyikan. Silakan tentukan harga utama paket keberangkatan setiap hari di bawah ini.
                        </p>
                      </div>

                      <div className="max-w-xs mx-auto">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1 font-bold text-center">
                          Harga per Pax (IDR) *
                        </label>
                        <input
                          type="text"
                          required
                          value={otPriceID}
                          onChange={(e) => setOtPriceID(e.target.value)}
                          placeholder="e.g. Rp 16.800.000"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A89053] text-center font-bold text-[#0284C7] text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rencana Perjalanan / Itinerary Day Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#0F2C59] flex items-center gap-2">
                    <Calendar size={16} className="text-[#A89053]" />
                    <span>Rencana Perjalanan ({otItinerary.length} Hari)</span>
                  </span>
                  {editingItineraryIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItineraryIndex(null);
                        setNewOtItTitleID("");
                        setNewOtItTitleEN("");
                        setNewOtItDescID("");
                        setNewOtItDescEN("");
                        setNewOtItHotelID("");
                        setNewOtItHotelEN("");
                        setNewOtItActivitiesID("");
                        setNewOtItActivitiesEN("");
                        setNewOtItImage("");
                        setNewOtItDay(otItinerary.length + 1);
                      }}
                      className="text-[10px] text-red-600 font-bold uppercase hover:underline"
                    >
                      Batal Edit Hari
                    </button>
                  )}
                </div>

                {/* ⚡ Auto-Convert Itinerary from Raw Text */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsConverterOpen(!isConverterOpen)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-[#0F2C59] hover:text-[#A89053] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#A89053]" />
                      <span>⚡ Convert / Impor Itinerary dari Teks Raw</span>
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {isConverterOpen ? "Tutup" : "Buka Converter"}
                    </span>
                  </button>

                  {isConverterOpen && (
                    <div className="space-y-3 pt-2 border-t border-slate-200/60 transition-all">
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Tempelkan teks itinerary rute perjalanan (misalnya dari WA/PDF). Format yang didukung: <code className="bg-slate-200 px-1 py-0.5 rounded text-[#0F2C59] font-mono">HARI 01: KEBERANGKATAN ... Menginap di Hotel***</code>.
                      </p>
                      <textarea
                        rows={6}
                        value={rawItineraryText}
                        onChange={(e) => setRawItineraryText(e.target.value)}
                        placeholder={`Contoh:\nHARI 01: KEBERANGKATAN – BANGKOK (MEALS ON BOARD) Kita berkumpul di bandara... Menginap di Hotel***\nHARI 02: BANGKOK - PATTAYA (MAKAN PAGI, MAKAN SIANG) Setelah sarapan pagi... Menginap di Hotel***`}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#A89053] placeholder-slate-400"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!rawItineraryText.trim()) return;
                            const parsed = parseItineraryText(rawItineraryText);
                            if (parsed.length > 0) {
                              setOtItinerary(parsed);

                              // Auto calculate duration (e.g. 5 Hari 4 Malam)
                              const days = parsed.length;
                              const nights = days - 1;
                              const durationStrID = `${days} Hari ${nights > 0 ? `${nights} Malam` : ""}`.trim();
                              const durationStrEN = `${days} Days ${nights > 0 ? `${nights} Nights` : ""}`.trim();
                              setOtDurationID(durationStrID);
                              setOtDurationEN(durationStrEN);

                              setToast({ message: `Berhasil meng-convert ${parsed.length} Hari itinerary!`, type: "success" });
                              setIsConverterOpen(false);
                            } else {
                              setToast({ message: "Gagal mendeteksi format itinerary. Pastikan ada kata 'HARI XX' atau 'DAY XX'.", type: "error" });
                            }
                          }}
                          className="bg-[#A89053] hover:bg-[#967F47] text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Terapkan (Ganti Semua)
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!rawItineraryText.trim()) return;
                            const parsed = parseItineraryText(rawItineraryText);
                            if (parsed.length > 0) {
                              // Adjust day numbers for appended days
                              const startDay = otItinerary.length + 1;
                              const adjusted = parsed.map((item, index) => ({
                                ...item,
                                day: startDay + index
                              }));
                              setOtItinerary([...otItinerary, ...adjusted]);

                              // Re-calculate duration
                              const days = otItinerary.length + parsed.length;
                              const nights = days - 1;
                              const durationStrID = `${days} Hari ${nights > 0 ? `${nights} Malam` : ""}`.trim();
                              const durationStrEN = `${days} Days ${nights > 0 ? `${nights} Nights` : ""}`.trim();
                              setOtDurationID(durationStrID);
                              setOtDurationEN(durationStrEN);

                              setToast({ message: `Berhasil menambahkan ${parsed.length} Hari itinerary!`, type: "success" });
                              setIsConverterOpen(false);
                            } else {
                              setToast({ message: "Gagal mendeteksi format itinerary. Pastikan ada kata 'HARI XX' atau 'DAY XX'.", type: "error" });
                            }
                          }}
                          className="bg-[#0F2C59] hover:bg-[#0284C7] text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Tambahkan di Akhir
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Day Input Form */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Hari Ke-</label>
                      <input
                        type="number"
                        min={1}
                        value={newOtItDay}
                        onChange={(e) => setNewOtItDay(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Judul Hari (ID) *</label>
                      <input
                        type="text"
                        value={newOtItTitleID}
                        onChange={(e) => setNewOtItTitleID(e.target.value)}
                        placeholder="e.g. Kedatangan & Check-in Hotel"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Judul Hari (EN)</label>
                      <input
                        type="text"
                        value={newOtItTitleEN}
                        onChange={(e) => setNewOtItTitleEN(e.target.value)}
                        placeholder="e.g. Arrival & Hotel Check-in"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Nama Hotel (ID/EN)</label>
                      <input
                        type="text"
                        value={newOtItHotelID}
                        onChange={(e) => setNewOtItHotelID(e.target.value)}
                        placeholder="e.g. Shinjuku Washington Hotel"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Aktivitas Utama (pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={newOtItActivitiesID}
                      onChange={(e) => setNewOtItActivitiesID(e.target.value)}
                      placeholder="Penjemputan Bandara, Check-in Hotel, Makan Malam Selamat Datang"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Deskripsi Kegiatan Hari Ini</label>
                    <textarea
                      rows={2}
                      value={newOtItDescID}
                      onChange={(e) => setNewOtItDescID(e.target.value)}
                      placeholder="Penjelasan detail rute dan kegiatan hari ini..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053] resize-none"
                    />
                  </div>

                  {/* Image Upload for Day (Multiple Images Support) */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                      Foto Kegiatan Hari Ini (Bisa Multiple Foto)
                    </label>
                    <div className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={newOtItImage}
                        onChange={(e) => setNewOtItImage(e.target.value)}
                        placeholder="Masukkan URL foto atau Upload..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A89053]"
                      />
                      {/* <button
                        type="button"
                        onClick={() => {
                          if (newOtItImage.trim() && !newOtItImages.includes(newOtItImage.trim())) {
                            setNewOtItImages([...newOtItImages, newOtItImage.trim()]);
                            setNewOtItImage("");
                          }
                        }}
                        className="px-3 py-2 bg-[#A89053] text-white hover:bg-[#967F47] rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Tambah
                      </button> */}
                      <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0F2C59] text-white hover:bg-[#0F2C59]/90 font-bold uppercase tracking-wider text-[9px] cursor-pointer shrink-0">
                        {isUploadingOtDay ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        <span>{isUploadingOtDay ? "Uploading..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingOtDay}
                          onChange={e => handleImageUpload(e, (url) => {
                            if (!newOtItImages.includes(url)) {
                              setNewOtItImages([...newOtItImages, url]);
                            }
                          }, setIsUploadingOtDay)}
                        />
                      </label>
                    </div>

                    {newOtItImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        {newOtItImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                            <img src={img} alt="Itinerary Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewOtItImages(newOtItImages.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddOrUpdateOtItineraryDay}
                    disabled={!newOtItTitleID.trim()}
                    className="w-full bg-[#A89053] hover:bg-[#967F47] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>{editingItineraryIndex !== null ? "Update Hari Ini" : "Tambah Hari ke Rencana Perjalanan"}</span>
                  </button>
                </div>

                {/* Display Current Itinerary Days */}
                {otItinerary.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {otItinerary.map((day, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {day.image && (
                            <img src={day.image} alt={day.title} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                          )}
                          <div className="truncate">
                            <p className="font-mono text-[10px] font-bold text-[#A89053] uppercase">Hari {day.day}</p>
                            <h4 className="font-bold text-xs text-[#0F2C59] truncate">{day.title}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{day.activities?.join(", ")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={() => handleMoveDay(idx, "up")} disabled={idx === 0} className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30">
                            <ChevronUp size={14} />
                          </button>
                          <button type="button" onClick={() => handleMoveDay(idx, "down")} disabled={idx === otItinerary.length - 1} className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30">
                            <ChevronDown size={14} />
                          </button>
                          <button type="button" onClick={() => handleEditItineraryDay(idx)} className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <Edit3 size={12} />
                          </button>
                          <button type="button" onClick={() => handleRemoveItineraryDay(idx)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#A89053] hover:bg-[#967F47] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
                  <span>{isEditingOpenTrip ? "Update Open Trip" : "Simpan Open Trip"}</span>
                </button>
                {isEditingOpenTrip && (
                  <button
                    type="button"
                    onClick={resetOpenTripForm}
                    className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Filter and Add Button Row */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari open trip berdasarkan nama, slug, wilayah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#A89053] focus:bg-white transition-all text-slate-800"
                />
              </div>
              <button
                onClick={() => {
                  resetOpenTripForm();
                  setViewMode("form");
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#0F2C59] hover:bg-[#0F2C59]/90 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0 w-full sm:w-auto font-sans"
              >
                <Plus size={14} />
                <span>Tambah Open Trip / Paket</span>
              </button>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="animate-spin text-[#A89053] mb-3" size={32} />
                <span className="text-xs text-slate-500 font-sans font-bold">Memuat data open trips...</span>
              </div>
            ) : filteredOpenTrips.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-sans">
                Tidak ada data Open Trips yang ditemukan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {filteredOpenTrips.map((item) => (
                  <div
                    key={item.id || item.slug}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Header Image */}
                    <div className="h-36 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={item.featuredImage || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 right-3 z-10 flex bg-slate-900/85 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 items-center gap-1 shadow-md" onClick={(e) => e.stopPropagation()}>
                        {[
                          { label: "Aktif", value: "active", activeClass: "bg-emerald-500 text-white shadow-sm border border-emerald-400/20" },
                          { label: "Draft", value: "draft", activeClass: "bg-amber-500 text-white shadow-sm border border-amber-400/20" },
                          { label: "Off", value: "inactive", activeClass: "bg-slate-500 text-white shadow-sm border border-slate-400/20" },
                        ].map((opt) => {
                          const currentStatus = item.status || "active";
                          const isChecked =
                            currentStatus.toLowerCase() === opt.value.toLowerCase() ||
                            (opt.value === "active" && currentStatus.toLowerCase() === "available") ||
                            (opt.value === "inactive" && currentStatus.toLowerCase() === "closed");
                          return (
                            <label
                              key={opt.value}
                              className={`flex items-center gap-1 text-[8px] font-bold uppercase cursor-pointer px-1.5 py-0.5 rounded-md transition-all select-none ${isChecked
                                ? opt.activeClass
                                : "text-slate-400 hover:text-white"
                                }`}
                            >
                              <input
                                type="radio"
                                name={`open-trip-status-${item.id}`}
                                value={opt.value}
                                checked={isChecked}
                                onChange={() => item.id && handleUpdateOpenTripStatus(item.id, opt.value)}
                                className="hidden"
                              />
                              <span>{opt.label === "Off" ? "Off" : opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-md border border-white/20">
                          {item.duration}
                        </span>
                        <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#A89053] text-white">
                          {item.regionSlug}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-sm text-[#0F2C59] line-clamp-1 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          Slug: {item.slug} {item.subSlug && `• ${item.subSlug}`}
                        </p>
                        <p className="text-xs text-[#A89053] font-bold font-mono">
                          {item.price}
                        </p>
                        {item.departureDate && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#0284C7] font-semibold bg-sky-50 px-2.5 py-1 rounded-lg w-fit border border-sky-100/80">
                            <Calendar size={12} className="shrink-0 text-[#0284C7]" />
                            <span>Tgl Tour: {item.departureDate}</span>
                          </div>
                        )}
                        {item.status && (
                          <div className={`flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg w-fit border ${item.status === "Closed" || item.status === "inactive"
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : item.status === "Draft" || item.status === "draft"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}>
                            <span>Status: {item.status}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpenTrip(item)}
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#0F2C59] transition-all cursor-pointer font-sans"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => item.id && handleDeleteOpenTrip(item.id)}
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
        )
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
