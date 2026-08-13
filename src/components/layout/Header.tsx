"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, Globe, ArrowRight } from "lucide-react";
import { localizedRegions, RegionDestination } from "@/data/destinations";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

const regionHeroImages: Record<string, string> = {
  indonesia: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=800",
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800",
  tailen: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800",
  vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
  korea: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
  china: "https://images.unsplash.com/photo-1547989453-11e67ffb3885?q=80&w=800",
  swiss: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800",
  india: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800",
  others: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800",
};

const defaultFeaturedImage = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800";

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDestinationsHovered, setIsDestinationsHovered] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Dynamic Regions state
  const [regions, setRegions] = useState<RegionDestination[]>(localizedRegions[locale] || []);

  useEffect(() => {
    async function loadRegions() {
      try {
        // 1. Try public API first
        const data = await apiFetch<any[]>(`/destinations?locale=${locale}`).catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: RegionDestination[] = data.map((r) => {
            let gradient = r.featuredImageGradient || "from-[#E0F2FE] to-[#7DD3FC]";
            let image = "";
            if (gradient.includes("||")) {
              const parts = gradient.split("||");
              gradient = parts[0];
              image = parts[1];
            }

            const subDestinations = (r.subDestinations || []).map((s: any) => {
              let subName = s.name || s.nameId || s.nameEn || "";
              let subImage = "";
              if (subName.includes("||")) {
                const parts = subName.split("||");
                subName = parts[0];
                subImage = parts[1];
              }
              return {
                name: subName,
                slug: s.slug,
                image: subImage
              };
            });

            return {
              id: r.id || r.key || r.slug,
              name: r.name ? r.name.split("||")[0] : r.slug,
              slug: r.slug,
              subtitle: r.subtitle || "",
              featuredImageGradient: gradient,
              image: image || regionHeroImages[r.slug] || regionHeroImages[r.key] || defaultFeaturedImage,
              subDestinations
            };
          });
          setRegions(mapped);
          return;
        }

        // 2. Fallback to localStorage
        const saved = localStorage.getItem("klik_admin_destinations");
        if (saved) {
          setRegions(JSON.parse(saved));
          return;
        }
      } catch (err) {
        console.error("Header: Failed to load regions", err);
      }
      setRegions(localizedRegions[locale] || []);
    }

    loadRegions();
  }, [locale]);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMobileHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLightPage = 
    (pathname === "/journal" ? isScrolled : false) ||
    pathname?.startsWith("/journal/") ||
    (pathname === "/journeys" ? isScrolled : false) ||
    pathname?.startsWith("/journeys/") ||
    pathname === "/destinations" ||
    (pathname === "/private-trip" ? isScrolled : false);

  const showDarkHeader = isScrolled || isLightPage;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLocale(locale === "id" ? "en" : "id");
  };

  const activeHoveredObj = hoveredRegion ? regions.find(r => r.slug === hoveredRegion) : null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3" 
            : `bg-transparent border-b py-5 ${isLightPage ? "border-charcoal/10" : "border-white/10"}`
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex justify-between items-center relative">
          
          {/* Logo */}
          <Link href="/" onClick={handleHomeClick} className="flex items-center justify-center hover:opacity-90 transition-opacity duration-300">
            <img 
              src="/kliktravelid.png" 
              alt="Klik Travel ID" 
              className="h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300"
            />
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              href="/"
              onClick={handleHomeClick}
              className={`font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group ${
                showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
              }`}
            >
              {t("nav_home")}
              <span className={`absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                showDarkHeader ? "bg-[#0284C7]" : "bg-white"
              }`} />
            </Link>

            <Link 
              href="/journeys"
              className={`font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group ${
                showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
              }`}
            >
              {t("nav_journeys")}
              <span className={`absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                showDarkHeader ? "bg-[#0284C7]" : "bg-white"
              }`} />
            </Link>

            {/* Destinations / OPEN TRIP Hover Item */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setIsDestinationsHovered(true)}
              onMouseLeave={() => setIsDestinationsHovered(false)}
            >
              <button
                className={`font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] transition-all duration-300 flex items-center space-x-1 cursor-pointer ${
                  showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
                }`}
              >
                <span>{t("nav_destinations")}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${isDestinationsHovered ? "rotate-180" : ""}`} />
              </button>
              <span className={`absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 ${isDestinationsHovered ? "scale-x-100" : "group-hover:scale-x-100"} transition-transform duration-300 origin-left ${
                showDarkHeader ? "bg-[#0284C7]" : "bg-white"
              }`} />

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {isDestinationsHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[760px] bg-white border border-[#0F2C59]/10 rounded-2xl shadow-xl p-8 z-50 grid grid-cols-12 gap-8 text-left pointer-events-auto"
                  >
                    {/* Left Panel: Preview/Info */}
                    <div className="col-span-5 flex flex-col justify-between border-r border-[#0F2C59]/10 pr-6">
                      <div>
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#0F2C59]/50 block mb-2">
                          {t("destinations_title")}
                        </span>
                        <h4 className="font-serif text-2xl text-[#0F2C59] font-normal mb-3">
                          {activeHoveredObj ? activeHoveredObj.name : t("destinations_subtitle")}
                        </h4>
                        <p className="font-sans text-xs text-[#0F2C59]/70 leading-relaxed font-light line-clamp-3">
                          {activeHoveredObj 
                            ? activeHoveredObj.subtitle 
                            : t("destinations_desc")}
                        </p>
                      </div>
                      
                      {/* Premium Image Featured */}
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative mt-6 shadow-sm group border border-slate-100">
                        <img 
                          src={activeHoveredObj?.image || activeHoveredObj?.featuredImageGradient || regionHeroImages[activeHoveredObj?.slug || ""] || defaultFeaturedImage} 
                          alt="Featured Destination"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4 font-sans font-medium text-xs tracking-wide text-white uppercase">
                          {activeHoveredObj ? `EXPLORE ${activeHoveredObj.name}` : t("destinations_featured")}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Regions Grid */}
                    <div className="col-span-7 flex flex-col justify-between pl-4">
                      <div>
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#0F2C59]/50 block mb-5">
                          {t("destinations_regions")}
                        </span>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                          {regions.map((region) => (
                            <Link
                              key={region.slug}
                              href={`/destinations/${region.slug}`}
                              onMouseEnter={() => setHoveredRegion(region.slug)}
                              onMouseLeave={() => setHoveredRegion(null)}
                              className="group flex items-center justify-between font-sans text-sm text-[#0F2C59]/80 hover:text-[#0284C7] transition-all duration-300 py-1"
                            >
                              <span className="group-hover:translate-x-1 transition-transform duration-300 font-medium">
                                {region.name}
                              </span>
                              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#0F2C59]/10 pt-5 mt-6 flex justify-between items-center">
                        <Link
                          href="/destinations"
                          className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#0F2C59] font-bold hover:text-[#0284C7] transition-colors flex items-center space-x-2 group"
                        >
                          <span>{t("destinations_explore_all")}</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {[
              { key: "nav_experiences", href: "/private-trip" },
              { key: "nav_about", href: "/about" },
              { key: "nav_journal", href: "/journal" }
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] transition-all duration-300 relative py-2 group ${
                  showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
                }`}
              >
                {t(item.key as keyof typeof import("@/data/translations").translations["id"])}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  showDarkHeader ? "bg-[#0284C7]" : "bg-white"
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 transition-colors p-1 cursor-pointer ${
                showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
              }`}
              aria-label="Toggle Language"
            >
              <Globe size={14} className="opacity-80" />
              <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">
                {locale === "id" ? "ID" : "EN"}
              </span>
            </button>
            <button 
              className={`transition-colors p-1 cursor-pointer ${
                showDarkHeader ? "text-[#0F2C59]/80 hover:text-[#0284C7]" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-white/90"
              }`} 
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <Link 
              href="/inquire"
              className={`text-[9px] font-sans uppercase tracking-[0.2em] py-2.5 px-5 rounded-full shadow-md transition-all duration-300 ${
                showDarkHeader 
                  ? "bg-[#0284C7] text-white hover:bg-[#0369a1]" 
                  : "bg-white text-[#0F2C59] hover:bg-white/90"
              }`}
            >
              {t("nav_plan_journey")}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-5 sm:space-x-6">
            <Link 
              href="/destinations"
              className={`font-sans text-[8px] uppercase tracking-[0.1em] font-bold transition-colors ${
                showDarkHeader ? "text-[#0F2C59] hover:text-[#0284C7]" : "text-white hover:text-white/80"
              }`}
            >
              {t("nav_destinations")}
            </Link>
            <Link 
              href="/private-trip"
              className={`font-sans text-[8px] uppercase tracking-[0.1em] font-bold transition-colors ${
                showDarkHeader ? "text-[#0F2C59] hover:text-[#0284C7]" : "text-white hover:text-white/80"
              }`}
            >
              {t("nav_experiences")}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none p-1 ml-2 z-50 relative transition-colors cursor-pointer ${
                isMobileMenuOpen 
                  ? "text-[#0F2C59]" 
                  : showDarkHeader ? "text-[#0F2C59] hover:text-[#0284C7]" : "text-white hover:text-white/80"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ivory flex flex-col justify-between p-8 pt-32 overflow-y-auto"
          >
            <div className="absolute inset-0 image-texture opacity-10 pointer-events-none" />

            <div className="flex flex-col space-y-6 text-left max-w-md mx-auto w-full z-10">
              <Link 
                href="/"
                onClick={handleMobileHomeClick}
                className="font-serif text-4xl tracking-wide text-foreground hover:text-[#0284C7] transition-colors block py-2"
              >
                {t("nav_home")}
              </Link>

              <Link 
                href="/journeys"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-4xl tracking-wide text-foreground hover:text-[#0284C7] transition-colors block py-2"
              >
                {t("nav_journeys")}
              </Link>

              <Link 
                href="/destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-4xl tracking-wide text-foreground hover:text-[#0284C7] transition-colors block py-2"
              >
                {t("nav_destinations")}
              </Link>

              {[
                { key: "nav_about", href: "/about" },
                { key: "nav_journal", href: "/journal" }
              ].map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-4xl tracking-wide text-foreground hover:text-[#0284C7] transition-colors block py-2"
                >
                  {t(item.key as keyof typeof import("@/data/translations").translations["id"])}
                </Link>
              ))}
              
              <div className="pt-6">
                <Link 
                  href="/inquire"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-block bg-charcoal text-white text-xs uppercase tracking-[0.25em] py-4 px-8 rounded-full shadow-lg"
                >
                  {t("nav_plan_journey")}
                </Link>
              </div>
            </div>

            <div className="max-w-md mx-auto w-full border-t border-foreground/10 pt-8 z-10 flex justify-between items-center text-[10px] tracking-widest uppercase font-mono text-foreground mt-8">
              <div className="flex space-x-4 items-center">
                <span>Klik Travel ID</span>
                <span className="opacity-30">|</span>
                <button 
                  onClick={toggleLanguage}
                  className="hover:text-[#0284C7] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Globe size={12} className="opacity-80" />
                  <span>{locale === "id" ? "ID" : "EN"}</span>
                </button>
              </div>
              <span>© 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
