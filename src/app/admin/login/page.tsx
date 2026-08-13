"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch, setStoredToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  const [email, setEmail] = useState("admin@kliktravel.id");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fillDemoCredentials = () => {
    setEmail("admin@kliktravel.id");
    setPassword("admin123");
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiFetch<{ accessToken: string; user?: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setSuccessMsg(locale === "id" ? "Autentikasi berhasil! Mengalihkan..." : "Authentication successful! Redirecting...");
      
      if (res.accessToken) {
        setStoredToken(res.accessToken);
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem("kt_admin_logged_in", "true");
        document.cookie = "kt_admin_logged_in=true; path=/; max-age=86400;";
      }

      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(
        err.message || (locale === "id" 
          ? "Email atau kata sandi salah." 
          : "Invalid credentials.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0F2C59] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Lighting & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A89053]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
            <span className="font-serif text-3xl font-bold tracking-wider uppercase text-white">
              KlikTravel<span className="text-[#A89053]">.ID</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-[#A89053] font-bold">
            <ShieldCheck size={12} />
            <span>Admin Management Portal</span>
          </div>
        </div>

        {/* Login Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Top Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A89053] via-[#0284C7] to-[#A89053]" />

          <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">
            {locale === "id" ? "Masuk ke Dashboard" : "Sign In to Dashboard"}
          </h2>
          <p className="text-xs font-sans text-white/70 text-center mb-6 font-light">
            {locale === "id" ? "Masukkan kredensial admin Anda untuk melanjutkan." : "Enter your administrative credentials to continue."}
          </p>

          {/* Quick Demo Helper Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/80 font-mono text-[11px]">
              <KeyRound size={14} className="text-[#A89053]" />
              <span>admin@kliktravel.id / admin123</span>
            </div>
            <button 
              type="button" 
              onClick={fillDemoCredentials}
              className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#38BDF8] hover:underline"
            >
              Auto Fill
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-sans flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-sans flex items-center gap-2.5"
            >
              <ShieldCheck size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                Email / Username
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kliktravel.id"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#A89053] text-white text-xs font-sans rounded-xl pl-10 pr-4 py-3.5 focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#A89053] text-white text-xs font-sans rounded-xl pl-10 pr-10 py-3.5 focus:outline-none transition-all placeholder:text-white/30"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 font-sans">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-[#A89053] focus:ring-0 w-3.5 h-3.5"
                />
                <span>{locale === "id" ? "Ingat saya" : "Remember me"}</span>
              </label>
              <span className="text-[11px] font-sans text-white/50 hover:text-white cursor-pointer transition-colors">
                {locale === "id" ? "Lupa kata sandi?" : "Forgot password?"}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#A89053] hover:bg-[#967F47] text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{locale === "id" ? "Masuk ke Panel" : "Sign In to Panel"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back to Site */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-[11px] font-sans text-white/60 hover:text-white transition-colors">
              &larr; {locale === "id" ? "Kembali ke Website Utama" : "Back to Main Website"}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
