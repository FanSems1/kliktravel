"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-charcoal text-white pt-16 pb-12 border-t border-white/10 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand & Statement */}
          <div className="md:col-span-5 flex flex-col items-start pr-4">
            <Link href="/" className="mb-6 inline-block hover:opacity-90 transition-opacity">
              <img 
                src="/kliktravelid.png" 
                alt="Klik Travel ID" 
                className="h-14 md:h-16 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="typography-body !text-white/70 max-w-sm font-light mb-8">
              {t("footer_brand_desc")}
            </p>
            
            {/* Newsletter */}
            <div className="w-full max-w-md">
              <span className="typography-caption !text-white/50 block mb-1">
                {t("footer_newsletter_title")}
              </span>
              <p className="font-sans text-xs text-white/60 font-light mb-4">
                {t("footer_newsletter_desc")}
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-white/30 focus-within:border-white transition-colors pb-2">
                <input 
                  type="email" 
                  placeholder={t("footer_newsletter_placeholder")} 
                  className="bg-transparent font-sans text-xs text-white placeholder-white/40 focus:outline-none w-full"
                />
                <button type="submit" aria-label="Subscribe" className="text-white/70 hover:text-white p-1 cursor-pointer">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="typography-caption !text-white/40 mb-6">{t("footer_explore")}</h4>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-wider">
              <li>
                <Link href="/destinations" className="text-white/70 hover:text-white transition-colors">
                  {t("nav_journeys")}
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-white/70 hover:text-white transition-colors">
                  {t("nav_destinations")}
                </Link>
              </li>
              <li>
                <Link href="/private-trip" className="text-white/70 hover:text-white transition-colors">
                  {t("nav_experiences")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="typography-caption !text-white/40 mb-6">{t("footer_company")}</h4>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-wider">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  {t("nav_about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {locale === "id" ? "Hubungi Kami" : "Contact Us"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-2">
            <h4 className="typography-caption !text-white/40 mb-6">{t("footer_social")}</h4>
            <ul className="space-y-4 font-sans text-xs uppercase tracking-wider">
              <li>
                <a 
                  href="https://www.instagram.com/kliktravel.id?igsi=OXByOGI5a2h1ZDFs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/share/1CD3TyaEW8/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </div>
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@kliktravelid" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                    </svg>
                  </div>
                  YouTube
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-[10px] font-mono tracking-widest text-white/40 uppercase">
          <div className="text-center md:text-left">
            &copy; 2026 Klik Travel ID. {t("footer_rights")}
          </div>
          <div className="text-center flex items-center justify-center gap-1.5">
            <span>crafted with</span>
            <Heart size={11} className="text-rose-500 fill-rose-500" />
            <span>by</span>
            <a 
              href="https://zellio.id/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/60 hover:text-white underline transition-colors font-bold"
            >
              ZELLIO
            </a>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
