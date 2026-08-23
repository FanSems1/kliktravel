"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { journalArticles, JournalArticle } from "@/data/journal";
import { apiFetch } from "@/lib/api";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Compass, 
  Share2, 
  Check, 
  MessageCircle, 
  MapPin, 
  BookOpen,
  ArrowRight,
  Bookmark
} from "lucide-react";
import Link from "next/link";

interface JournalArticleDetailClientProps {
  slug: string;
}

export function JournalArticleDetailClient({ slug }: JournalArticleDetailClientProps) {
  const { locale, t } = useLanguage();
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [allArticles, setAllArticles] = useState<JournalArticle[]>(journalArticles);

  // Scroll Progress Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    async function loadDetailArticle() {
      let mergedList: JournalArticle[] = [];

      try {
        const apiData = await apiFetch<JournalArticle[]>("/journal").catch(() => null);
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          mergedList = apiData;
        }
      } catch (err) {
        console.error("Failed to fetch journal from API", err);
      }

      if (mergedList.length === 0) {
        try {
          const saved = localStorage.getItem("klik_admin_journal_articles");
          mergedList = [...journalArticles];
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              let needsUpdate = false;
              const updated = parsed.map(customArt => {
                const staticArt = journalArticles.find(x => x.slug === customArt.slug);
                if (staticArt) {
                  const staticLength = (staticArt.contentID || "").length + (staticArt.contentEN || "").length;
                  const customLength = (customArt.contentID || "").length + (customArt.contentEN || "").length;
                  if (staticLength > customLength) {
                    needsUpdate = true;
                    return {
                      ...customArt,
                      contentID: staticArt.contentID,
                      contentEN: staticArt.contentEN,
                      excerptID: staticArt.excerptID,
                      excerptEN: staticArt.excerptEN,
                      categoryID: staticArt.categoryID,
                      categoryEN: staticArt.categoryEN,
                      image: staticArt.image,
                    };
                  }
                }
                return customArt;
              });

              const customSlugs = new Set(updated.map(x => x.slug));
              const missingStatic = journalArticles.filter(x => !customSlugs.has(x.slug));
              mergedList = [...updated, ...missingStatic];

              if (needsUpdate || missingStatic.length > 0) {
                localStorage.setItem("klik_admin_journal_articles", JSON.stringify(mergedList));
              }
            }
          }
        } catch (e) {
          console.error(e);
          mergedList = journalArticles;
        }
      }

      setAllArticles(mergedList);
      const found = mergedList.find(x => x.slug === slug);
      if (found) {
        setArticle(found);
      } else {
        const staticFallback = journalArticles.find(x => x.slug === slug);
        if (staticFallback) setArticle(staticFallback);
      }
      setLoading(false);
    }

    loadDetailArticle();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#A89053] animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Loading Journal...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <Compass size={48} className="text-[#A89053] animate-pulse mb-6" />
        <h1 className="font-sans text-3xl text-[#0F2C59] font-bold mb-3">
          {locale === "id" ? "Artikel Tidak Ditemukan" : "Article Not Found"}
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
          {locale === "id" 
            ? "Maaf, artikel jurnal yang Anda cari tidak tersedia atau telah dipindahkan."
            : "Apologies, the journal entry you are looking for is unavailable or has been relocated."}
        </p>
        <Link 
          href="/journal"
          className="font-mono text-xs uppercase tracking-widest bg-[#0F2C59] text-white px-6 py-3.5 rounded-xl hover:bg-[#0F2C59]/90 transition-all shadow-sm"
        >
          {locale === "id" ? "Kembali ke Jurnal" : "Back to Journal"}
        </Link>
      </div>
    );
  }

  const isIndo = locale === "id";
  const title = isIndo ? article.titleID : article.titleEN;
  const excerpt = isIndo ? article.excerptID : article.excerptEN;
  const content = isIndo ? article.contentID : article.contentEN;
  const category = isIndo ? article.categoryID : article.categoryEN;
  const dateStr = isIndo ? article.dateID : article.dateEN;
  const readTime = isIndo ? article.readTimeID : article.readTimeEN;

  // Curated Related Articles (excluding current)
  const relatedArticles = allArticles
    .filter(x => x.slug !== article.slug)
    .slice(0, 2);

  // Creative static content helper for Uzbekistan Silk Road
  const renderUzbekistanSilkRoadSpecial = () => {
    return (
      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="font-sans text-base text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-sans first-letter:font-normal first-letter:text-[#A89053] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
            {isIndo 
              ? "Uzbekistan, jantung Asia Tengah, menyimpan rahasia ribuan tahun dari para kafilah yang melintasi gurun pasir Kyzylkum. Berjalan di Registan Square di Samarkand seperti membuka lembaran buku sejarah yang hidup. Kubah-kubah bermosaik biru kobalt berkilau di bawah terik matahari, memancarkan aura kejayaan masa lalu Kekaisaran Timurid."
              : "Uzbekistan, the heart of Central Asia, guards the ancient secrets of camel caravans that traversed the Kyzylkum Desert. Stepping into Samarkand's Registan Square feels like opening a living history book. Domes clad in cobalt-blue mosaics glimmer under the desert sun, reflecting the golden architectural legacy of the Timurid Empire."}
          </p>
          <p className="font-sans text-base text-slate-700 leading-relaxed">
            {isIndo
              ? "Mosaik-mosaik indah ini bukan sekadar hiasan. Setiap ubin keramik yang dipasang ratusan tahun lalu mencerminkan keahlian geometris dan spiritualitas para pengrajin ulung. Biru melambangkan langit yang menaungi kita semua, sedangkan pola bunga melambangkan taman firdaus yang damai."
              : "These intricate mosaics are not mere ornamentation. Every ceramic tile laid down centuries ago reflects the complex geometry and spiritual dedication of master builders. Blue represents the endless dome of heaven, while cascading floral motifs depict the peace of paradise."}
          </p>
        </motion.div>

        {/* Dynamic pull quote block */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="border-l-4 border-[#A89053] pl-6 my-10"
        >
          <blockquote className="font-sans italic text-xl md:text-2xl text-[#0F2C59] leading-relaxed">
            {isIndo
              ? '"Samarkand adalah mutiara dari belahan dunia timur, di mana ubin-ubin biru yang indah mencerminkan kemegahan langit."'
              : '"Samarkand is the pearl of the Eastern world, where cobalt tiles mirror the vault of the heavens."'}
          </blockquote>
          <cite className="block font-mono text-xs uppercase tracking-widest text-slate-400 mt-3 font-semibold not-italic">
            — Ibn Battuta, 1333
          </cite>
        </motion.div>

        {/* Feature section side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A89053] font-bold">CHAPTER I</span>
            <h3 className="font-sans text-2xl text-[#0F2C59] font-bold">
              {isIndo ? "Bukhara: Labirin Sejarah di Tepi Gurun" : "Bukhara: Historical Labyrinth on the Desert Rim"}
            </h3>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              {isIndo
                ? "Berbeda dengan Samarkand yang megah, Bukhara mempertahankan keindahan intim kota abad pertengahan. Jalan setapak berbatu pasir membawa kita ke barisan madrasah kuno, di mana kubah peniup angin (windcatchers) menarik udara sejuk ke halaman dalam. Suasana di sini dipenuhi aroma rempah-rempah hangat, teh hijau, dan karpet wol buatan tangan."
                : "Unlike Samarkand's grand scale, Bukhara retains the intimate charm of a medieval trading post. Sandstone pathways wind past ancient madrasahs where old wind-towers once channeled cool air to clay courtyards. The air is still redolent of toasted cumin, saffron tea, and hand-woven wool carpets."}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-lg group h-[300px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800" 
              alt="Bukhara Alleyways"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/60 to-transparent" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] text-white/90 uppercase tracking-widest flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <MapPin size={10} className="text-[#A89053]" /> Bukhara, Uzbekistan
            </span>
          </motion.div>
        </div>

        {/* Visual photo grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12"
        >
          <div className="col-span-1 md:col-span-2 overflow-hidden rounded-2xl h-[220px] md:h-[260px] relative group">
            <img 
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800" 
              alt="Silk Road Bazaar" 
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-2xl h-[220px] md:h-[260px] relative group">
            <img 
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600" 
              alt="Cobalt Mosaic Detail" 
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </motion.div>

        {/* Section 3: Curator insights */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h3 className="font-sans text-2xl text-[#0F2C59] font-bold">
            {isIndo ? "Harmoni Teh dan Keramahan" : "The Harmony of Tea and Hospitality"}
          </h3>
          <p className="font-sans text-base text-slate-700 leading-relaxed">
            {isIndo
              ? "Di Uzbekistan, keramahan dimulai dengan teh. Disajikan dalam cangkir kecil bermotif kapas khas (piola), teh hijau hangat dituang tiga kali sebelum disajikan kepada tamu sebagai tanda hormat. Siklus menyeduh teh ini mengajarkan kita untuk tidak terburu-buru, melainkan berhenti sejenak untuk saling bertukar cerita dan membangun hubungan."
              : "In Uzbekistan, hospitality begins with tea. Poured into small ceramic cups (piola), warm green tea is returned to the pot three times before being offered to guests as a symbol of respect. This cycle teaches us to pause, sit together, exchange notes, and nurture connections."}
          </p>
        </motion.div>

        {/* Checklist Tips Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-[#0F2C59]/10 p-8 rounded-2xl space-y-6 mt-12 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#A89053]/10 rounded-xl">
              <Compass size={20} className="text-[#A89053]" />
            </div>
            <h4 className="font-sans text-lg font-bold text-[#0F2C59]">
              {isIndo ? "Tips Perjalanan Jurnal Kurator" : "Curator's Travel Protocol"}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-700">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-[#A89053] font-bold">•</span>
                <p><strong>{isIndo ? "Musim Terbaik:" : "Best Season:"}</strong> {isIndo ? "Musim Semi (Apr-Mei) atau Gugur (Sep-Okt) saat cuaca sejuk." : "Spring (Apr-May) or Autumn (Sep-Oct) for perfect mild desert weather."}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#A89053] font-bold">•</span>
                <p><strong>{isIndo ? "Kuliner Wajib:" : "Culinary Essential:"}</strong> {isIndo ? "Cicipi Plov khas Samarkand, nasi bumbu rempah dengan daging domba." : "Savor Samarkand Plov, spiced rice cooked with tender mutton and carrots."}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-[#A89053] font-bold">•</span>
                <p><strong>{isIndo ? "Etika Budaya:" : "Cultural Etiquette:"}</strong> {isIndo ? "Lepas sepatu saat memasuki area masjid bersejarah atau kediaman lokal." : "Remove shoes before entering holy shrines, mosques, or private homes."}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#A89053] font-bold">•</span>
                <p><strong>{isIndo ? "Fotografi:" : "Photography:"}</strong> {isIndo ? "Matahari sore memberikan pencahayaan hangat terbaik untuk mosaik biru." : "Golden hour provides the most breathtaking light for architectural mosaic captures."}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Dynamic article content parser for magazine layout
  const renderDefaultArticleContent = () => {
    // Split by double newlines to separate logical sections/paragraphs
    const sections = content.split("\n\n").filter(Boolean);
    let regularParagraphIndex = 0;

    return (
      <div className="space-y-8">
        {sections.map((section, sectionIdx) => {
          const trimmedSection = section.trim();

          // 1. Check for Photo Grid Showcase: starts with "[GRID]"
          if (trimmedSection.startsWith("[GRID]")) {
            const lines = trimmedSection.split("\n").slice(1);
            const images = lines.map(line => {
              const parts = line.replace(/^-\s*/, "").split("|");
              return {
                url: parts[0].trim(),
                caption: parts[1] ? parts[1].trim() : ""
              };
            }).filter(img => img.url);

            if (images.length === 0) return null;

            return (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10"
              >
                {images.map((img, imgIdx) => {
                  const colSpan = images.length === 2 ? "md:col-span-1" : imgIdx === 0 ? "md:col-span-2" : "md:col-span-1";
                  return (
                    <div key={imgIdx} className={`${colSpan} overflow-hidden rounded-2xl h-[260px] relative group shadow-md`}>
                      <img
                        src={img.url}
                        alt={img.caption || "Travel photo"}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      {img.caption && (
                        <span className="absolute bottom-3 left-3 font-mono text-[9px] text-white bg-black/40 px-2 py-0.5 rounded">
                          {img.caption}
                        </span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            );
          }

          // 2. Check for Tips Box: starts with "[TIPS]" or "[PROTOCOL]"
          if (trimmedSection.startsWith("[TIPS]") || trimmedSection.startsWith("[PROTOCOL]")) {
            const lines = trimmedSection.split("\n").slice(1);
            const titleLine = trimmedSection.split("\n")[0];
            const cleanTitle = titleLine.replace("[TIPS]", "").replace("[PROTOCOL]", "").trim() || (isIndo ? "Tips Perjalanan Jurnal Kurator" : "Curator's Travel Protocol");
            
            return (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white border border-[#0F2C59]/10 p-8 rounded-2xl space-y-6 my-10 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A89053]/10 rounded-xl">
                    <Compass size={20} className="text-[#A89053]" />
                  </div>
                  <h4 className="font-sans text-lg font-bold text-[#0F2C59]">
                    {cleanTitle}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-700">
                  {lines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^-\s*/, "").trim();
                    const parts = cleanLine.split(":");
                    const label = parts[0] ? parts[0].trim() : "";
                    const desc = parts.slice(1).join(":").trim();

                    return (
                      <div key={lIdx} className="flex gap-2">
                        <span className="text-[#A89053] font-bold">•</span>
                        <p>
                          {label && desc ? (
                            <>
                              <strong>{label}:</strong> {desc}
                            </>
                          ) : (
                            cleanLine
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          }

          // 3. For any other section, let's split it by single newline `\n` to process lines
          const lines = trimmedSection.split("\n").filter(Boolean);
          
          return (
            <div key={sectionIdx} className="space-y-4">
              {lines.map((line, lineIdx) => {
                const trimmedLine = line.trim();

                // Check if the line is a heading: starts with "### "
                if (trimmedLine.startsWith("### ")) {
                  const headingText = trimmedLine.slice(4).trim();
                  return (
                    <motion.h3
                      key={lineIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="font-sans text-2xl text-[#0F2C59] font-bold leading-tight pt-4"
                    >
                      {headingText}
                    </motion.h3>
                  );
                }

                // Check if the line starts with "CHAPTER"
                if (trimmedLine.toUpperCase().startsWith("CHAPTER")) {
                  const parts = trimmedLine.split(":");
                  const chapterNum = parts[0].trim();
                  const titleText = parts[1] ? parts[1].trim() : "";
                  return (
                    <motion.div
                      key={lineIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="pt-6 space-y-1"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#A89053] font-bold block">
                        {chapterNum}
                      </span>
                      {titleText && (
                        <h3 className="font-sans text-2xl text-[#0F2C59] font-bold leading-tight">
                          {titleText}
                        </h3>
                      )}
                    </motion.div>
                  );
                }

                // Check if the line is a blockquote: starts with ">"
                if (trimmedLine.startsWith(">")) {
                  const quoteText = trimmedLine.replace(/^>\s*/, "").trim();
                  return (
                    <motion.div
                      key={lineIdx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-[#0284C7] pl-6 my-6 py-1"
                    >
                      <blockquote className="font-sans italic text-lg md:text-xl text-[#0F2C59]/90 leading-relaxed">
                        {quoteText}
                      </blockquote>
                      <cite className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-2 font-semibold not-italic">
                        — Klik Travel Curator
                      </cite>
                    </motion.div>
                  );
                }

                // Standard paragraph text
                const isFirstParagraph = regularParagraphIndex === 0;
                regularParagraphIndex++;

                // Inline blockquote extraction if the line contains a blockquote markup like `> "Hotel` at the end
                let mainText = trimmedLine;
                let inlineQuote: string | null = null;
                const quoteIndex = trimmedLine.indexOf('>');
                if (quoteIndex !== -1) {
                  mainText = trimmedLine.substring(0, quoteIndex).trim();
                  inlineQuote = trimmedLine.substring(quoteIndex + 1).replace(/^["'\s]*/, "").replace(/["'\s]*$/, "").trim();
                }

                return (
                  <React.Fragment key={lineIdx}>
                    {mainText && (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`font-sans text-base text-slate-700 leading-relaxed font-normal ${
                          isFirstParagraph
                            ? "first-letter:text-5xl first-letter:font-sans first-letter:font-normal first-letter:text-[#A89053] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]"
                            : ""
                        }`}
                      >
                        {mainText}
                      </motion.p>
                    )}
                    {inlineQuote && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="border-l-4 border-[#0284C7] pl-6 my-6 py-1"
                      >
                        <blockquote className="font-sans italic text-lg md:text-xl text-[#0F2C59]/90 leading-relaxed">
                          {inlineQuote}
                        </blockquote>
                        <cite className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-2 font-semibold not-italic">
                          — Klik Travel Curator
                        </cite>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pb-24 selection:bg-[#0F2C59] selection:text-white">
      
      {/* Top Floating Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] bg-[#0284C7] origin-[0%] z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Cinematic Hero (Destination Style) */}
      <section className="relative w-full min-h-[65vh] md:min-h-[75vh] overflow-hidden flex flex-col justify-between pt-32 md:pt-36 pb-12 md:pb-16 selection:bg-[#0284C7] selection:text-white">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src={article.image} 
            alt={title}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200";
            }}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#0F2C59]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/75 z-[1]" />
          <div className="absolute inset-0 bg-black/20 z-[1]" />
        </div>

        {/* Floating Top Nav & Share controls */}
        <div className="relative z-10 w-full px-6 max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/journal"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer font-bold"
          >
            <ArrowLeft size={12} /> {isIndo ? "Kembali" : "Back"}
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer font-bold"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
              {copied ? (isIndo ? "Tersalin" : "Copied") : (isIndo ? "Bagikan" : "Share")}
            </button>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        {/* Cinematic Title & Metadata Overlay (at bottom of hero) */}
        <div className="relative z-10 w-full px-6 max-w-7xl mx-auto text-white mt-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#E0F2FE] bg-[#0284C7]/20 border border-[#0284C7]/30 backdrop-blur-md px-3.5 py-1.5 rounded-full inline-block font-bold">
              {category}
            </span>
            <h1 className="font-sans text-3xl md:text-6xl text-white font-bold leading-tight drop-shadow-lg max-w-4xl tracking-wide">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] tracking-wider text-slate-300 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[#A89053]" /> {dateStr}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-[#A89053]" /> {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={12} className="text-[#A89053]" /> {isIndo ? "Oleh Klik Curator" : "By Klik Curator"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2-Column Content Layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 selection:bg-[#0F2C59] selection:text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Content Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Excerpt Intro */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans text-lg md:text-xl text-[#0F2C59]/80 leading-relaxed italic border-l-4 border-[#0284C7] pl-6 py-1"
            >
              {excerpt}
            </motion.div>

            {/* Render article contents */}
            {slug === "a-silk-road-narrative" 
              ? renderUzbekistanSilkRoadSpecial() 
              : renderDefaultArticleContent()
            }
          </div>

          {/* Sticky Sidebar Column (lg:col-span-4) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            
            {/* Curator Profile Card */}
            <div className="bg-white border border-[#0F2C59]/10 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0F2C59]/5 flex items-center justify-center text-[#0F2C59] font-sans text-lg font-bold border border-[#0F2C59]/10">
                  KC
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#0F2C59]">Klik Curator</h4>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#A89053] font-bold">
                    {isIndo ? "Jurnal Penulis" : "Journal Author"}
                  </p>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                {isIndo 
                  ? "Kurator perjalanan Klik Travel ID berdedikasi untuk memberikan panduan, cerita, dan inspirasi liburan eksklusif untuk petualangan Anda." 
                  : "Klik Travel ID's travel curator dedicated to providing exclusive vacation guides, stories, and inspirations for your adventures."}
              </p>
              
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isIndo ? "Bagikan Jurnal:" : "Share Entry:"}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 bg-slate-50 hover:bg-[#0284C7]/10 text-slate-500 hover:text-[#0284C7] border border-slate-200/60 rounded-xl transition-all shadow-sm cursor-pointer"
                    title={isIndo ? "Salin Link" : "Copy Link"}
                  >
                    <Share2 size={13} />
                  </button>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200/60 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
                    title={isIndo ? "Bagikan WA" : "Share WhatsApp"}
                  >
                    <MessageCircle size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Featured Tour Card (Dynamically resolved based on slug) */}
            {(() => {
              const bromoTour = {
                title: isIndo ? "Paket Tour Bromo Golden Sunrise" : "Bromo Golden Sunrise Tour Package",
                image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600",
                price: "Mulai Rp 1.750.000",
                link: "/destinations/indonesia/bromo",
                waText: isIndo 
                  ? "Halo Klik Travel ID, saya tertarik dengan Paket Tour Bromo setelah membaca Jurnal Anda." 
                  : "Hello Klik Travel ID, I am interested in Bromo Tours after reading your Journal."
              };

              const uzbekistanTour = {
                title: isIndo ? "Paket Tour Jalur Sutra Uzbekistan" : "Uzbekistan Silk Road Tour Package",
                image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=600",
                price: "Mulai Rp 24.500.000",
                link: "/destinations/others/uzbekistan",
                waText: isIndo 
                  ? "Halo Klik Travel ID, saya tertarik dengan Tour Uzbekistan setelah membaca Jurnal Anda." 
                  : "Hello Klik Travel ID, I am interested in Uzbekistan Tours after reading your Journal."
              };

              const activeTour = slug === "golden-hours-of-bromo" 
                ? bromoTour 
                : slug === "a-silk-road-narrative" 
                ? uzbekistanTour 
                : null;

              if (!activeTour) return null;

              return (
                <div className="bg-white border border-[#0F2C59]/10 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={activeTour.image} 
                      alt={activeTour.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
                      }}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 bg-[#0284C7] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                      {isIndo ? "Rekomendasi Tour" : "Featured Tour"}
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="font-sans font-bold text-[#0F2C59] text-sm leading-snug">
                        {activeTour.title}
                      </h4>
                      <p className="font-sans font-bold text-xs text-[#0284C7]">
                        {activeTour.price}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <Link 
                        href={activeTour.link}
                        className="font-sans font-bold text-[10px] text-[#0F2C59] border border-[#0F2C59]/20 hover:border-[#0284C7] hover:text-[#0284C7] py-2.5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer text-center"
                      >
                        {isIndo ? "Detail Tour" : "Tour Detail"}
                      </Link>
                      <a 
                        href={`https://wa.me/6281230011027?text=${encodeURIComponent(activeTour.waText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-bold text-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white py-2.5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer text-center"
                      >
                        {isIndo ? "Tanya WA" : "Ask WA"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

          </aside>

        </div>
      </section>

      {/* Curated Consultation CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0F2C59] p-8 md:p-16 rounded-[2.5rem] relative overflow-hidden shadow-xl text-white text-center space-y-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0284C7]/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          
          <Compass size={40} className="text-[#A89053] mx-auto animate-spin-slow mb-2" />
          <h2 className="font-sans text-2xl md:text-4xl text-white font-bold max-w-2xl mx-auto leading-tight">
            {slug === "golden-hours-of-bromo"
              ? (isIndo ? "Siap Menyaksikan Keindahan Bromo Secara Langsung?" : "Ready to Witness the Majestic Bromo Sunrise?")
              : slug === "a-silk-road-narrative"
              ? (isIndo ? "Ingin Menjelajahi Kejayaan Jalur Sutra?" : "Ready to Journey Along the Historic Silk Road?")
              : (isIndo ? "Siap Menulis Cerita Perjalanan Anda Berikutnya?" : "Ready to Discover Your Next Adventure?")
            }
          </h2>
          <p className="font-sans text-white/70 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            {slug === "golden-hours-of-bromo"
              ? (isIndo ? "Jelajahi keindahan kawah vulkanik aktif dan pesona alam Bromo dengan paket tour kustom & open trip KlikTravel." : "Explore the active volcanic crater and scenic caldera of Mount Bromo with our curated tour packages.")
              : slug === "a-silk-road-narrative"
              ? (isIndo ? "Ikuti perjalanan open trip dan private tour eksklusif kami menjelajahi keajaiban arsitektur Samarkand dan Bukhara." : "Join our exclusive open trips and private tours exploring the timeless architectural marvels of Samarkand and Bukhara.")
              : (isIndo ? "Pilih paket tour atau rancang rencana perjalanan kustom Anda bersama KlikTravel untuk liburan tak terlupakan." : "Choose a curated trip or design a bespoke custom itinerary with KlikTravel for an unforgettable holiday.")
            }
          </p>
          <div className="pt-4">
            <Link 
              href={slug === "golden-hours-of-bromo" ? "/journeys?search=bromo" : "/journeys"}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#A89053] hover:bg-[#A89053]/95 text-white px-8 py-4 rounded-xl transition-all shadow-md group cursor-pointer"
            >
              {slug === "golden-hours-of-bromo"
                ? (isIndo ? "Lihat Paket Tour Bromo" : "Explore Bromo Tours")
                : slug === "a-silk-road-narrative"
                ? (isIndo ? "Lihat Paket Tour Uzbekistan" : "Explore Uzbekistan Tours")
                : (isIndo ? "Jelajahi Paket Tour" : "Explore Tour Packages")
              }
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Related Narratives */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-sans text-2xl text-[#0F2C59] font-bold">
              {isIndo ? "Cerita Terkait" : "Related Narratives"}
            </h3>
            <Link 
              href="/journal"
              className="font-mono text-[10px] uppercase tracking-widest text-[#A89053] hover:underline flex items-center gap-1.5"
            >
              {isIndo ? "Lihat Semua" : "View All"} <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((art, idx) => {
              const artTitle = isIndo ? art.titleID : art.titleEN;
              const artExcerpt = isIndo ? art.excerptID : art.excerptEN;
              const artCategory = isIndo ? art.categoryID : art.categoryEN;
              
              return (
                <motion.div
                  key={art.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  <div className="relative h-[220px] overflow-hidden shrink-0">
                    <img 
                      src={art.image} 
                      alt={artTitle} 
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                      {artCategory}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-sans text-xl text-[#0F2C59] group-hover:text-[#A89053] transition-colors line-clamp-2">
                        {artTitle}
                      </h4>
                      <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {artExcerpt}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-50 font-mono text-[9px] text-slate-400">
                      <span>{art.readTimeID}</span>
                      <Link 
                        href={`/journal/${art.slug}`}
                        className="text-[#A89053] hover:underline flex items-center gap-1 group/btn"
                      >
                        {isIndo ? "Baca" : "Read"} <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
