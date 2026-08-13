"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  Ship, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Globe, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Image as ImageIcon
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredToken, removeStoredToken, apiFetch } from "@/lib/api";

interface AdminSidebarItem {
  name: string;
  nameEN: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsCheckingAuth(false);
      return;
    }

    const checkAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        handleLogout();
        return;
      }
      try {
        await apiFetch("/auth/me");
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed", err);
        handleLogout();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    removeStoredToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("kt_admin_logged_in");
      document.cookie = "kt_admin_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
    router.push("/admin/login");
  };

  // Render clean layout without admin sidebar for /admin/login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Render loading indicator while checking auth state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0F2C59] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#A89053] rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/70">Verifying session...</span>
        </div>
      </div>
    );
  }

  const menuItems: AdminSidebarItem[] = [
    {
      name: "Ringkasan",
      nameEN: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Destinasi & Wilayah",
      nameEN: "Destinations & Regions",
      href: "/admin/destinations",
      icon: Map,
    },
    {
      name: "Paket Perjalanan",
      nameEN: "Tour Packages",
      href: "/admin/journeys",
      icon: Compass,
    },
    {
      name: "Private Trip",
      nameEN: "Private Trips",
      href: "/admin/private-trips",
      icon: Ship,
    },
    {
      name: "Jurnal Travel",
      nameEN: "Travel Journal",
      href: "/admin/journal",
      icon: BookOpen,
    },
    {
      name: "Galeri Foto",
      nameEN: "Photo Gallery",
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      name: "Testimoni",
      nameEN: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquare,
    },
    {
      name: "Pengaturan",
      nameEN: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-[#0F2C59] text-white transition-all duration-300 relative border-r border-white/10 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand/Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          {!isSidebarCollapsed ? (
            <Link href="/admin" className="flex items-center gap-3">
              <img 
                src="/kliktravelid.png" 
                alt="KlikTravel.ID Logo" 
                className="h-8 w-8 object-contain rounded-lg shrink-0" 
              />
              <span className="font-serif text-lg tracking-wider font-bold text-white uppercase">
                KlikTravel<span className="text-[#A89053]">.ID</span>
              </span>
              <span className="bg-earth/80 text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-white border border-white/15">
                Admin
              </span>
            </Link>
          ) : (
            <Link href="/admin" className="mx-auto flex items-center justify-center">
              <img 
                src="/kliktravelid.png" 
                alt="KlikTravel.ID Logo" 
                className="h-9 w-9 object-contain rounded-lg" 
              />
            </Link>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-sans text-xs uppercase tracking-wider font-medium transition-all group relative ${
                  isActive 
                    ? "bg-[#A89053] text-white shadow-lg shadow-[#A89053]/15" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-white/60"}`} />
                {!isSidebarCollapsed && (
                  <span>{locale === "id" ? item.name : item.nameEN}</span>
                )}
                {/* Tooltip on collapse */}
                {isSidebarCollapsed && (
                  <div className="absolute left-24 bg-charcoal text-white text-[10px] font-sans font-bold uppercase tracking-wider py-2 px-3 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {locale === "id" ? item.name : item.nameEN}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Collapse Toggle */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer w-full"
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors font-sans text-xs uppercase tracking-wider font-medium w-full text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#0F2C59] z-50 flex flex-col p-6 text-white md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img 
                    src="/kliktravelid.png" 
                    alt="KlikTravel.ID Logo" 
                    className="h-8 w-8 object-contain rounded-lg shrink-0" 
                  />
                  <span className="font-serif text-lg tracking-wider font-bold text-white uppercase">
                    KlikTravel<span className="text-[#A89053]">.ID</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-sans text-xs uppercase tracking-wider font-medium transition-colors ${
                        isActive 
                          ? "bg-[#A89053] text-white shadow-lg" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{locale === "id" ? item.name : item.nameEN}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors font-sans text-xs uppercase tracking-wider font-medium w-full text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 md:hidden transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-100 rounded-full border border-slate-200/50 w-64 md:w-80">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources, bookings..."
                className="bg-transparent text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Indicator */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/60 p-1 rounded-full">
              <Globe size={13} className="text-slate-500 ml-1.5" />
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 mr-1.5">{locale}</span>
            </div>

            {/* Notification Bell */}
            <button className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0284C7] rounded-full ring-2 ring-white animate-pulse" />
            </button>

            <div className="h-8 w-[1px] bg-slate-200" />

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0F2C59]/10 border border-[#0F2C59]/20 flex items-center justify-center text-[#0F2C59]">
                <User size={16} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-sans font-bold text-slate-800 leading-tight">Admin Team</p>
                <p className="text-[9px] font-mono text-slate-400 leading-none uppercase tracking-wider mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
