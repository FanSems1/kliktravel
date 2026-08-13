"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { journalArticles, JournalArticle } from "@/data/journal";
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
    // Load custom articles from localStorage + merge static
    try {
      const saved = localStorage.getItem("klik_admin_journal_articles");
      let mergedList = [...journalArticles];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // merge custom articles (override static if same slug)
          const customSlugs = new Set(parsed.map(x => x.slug));
          mergedList = [
            ...parsed,
            ...journalArticles.filter(x => !customSlugs.has(x.slug))
          ];
        }
      }
      setAllArticles(mergedList);

      const found = mergedList.find(x => x.slug === slug);
      if (found) {
        setArticle(found);
      }
    } catch (e) {
      console.error(e);
      const found = journalArticles.find(x => x.slug === slug);
      if (found) setArticle(found);
    } finally {
      setLoading(false);
    }
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
        <h1 className="font-serif text-3xl text-[#0F2C59] font-bold mb-3">
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
          <p className="font-sans text-base text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:text-[#A89053] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
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
          <blockquote className="font-serif italic text-xl md:text-2xl text-[#0F2C59] leading-relaxed">
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
            <h3 className="font-serif text-2xl text-[#0F2C59] font-bold">
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
          className="grid grid-cols-3 gap-4 my-12"
        >
          <div className="col-span-2 overflow-hidden rounded-2xl h-[260px] relative group">
            <img 
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800" 
              alt="Silk Road Bazaar" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="overflow-hidden rounded-2xl h-[260px] relative group">
            <img 
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600" 
              alt="Cobalt Mosaic Detail" 
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
          <h3 className="font-serif text-2xl text-[#0F2C59] font-bold">
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
          className="bg-amber-50/70 border border-amber-200/80 p-8 rounded-3xl space-y-6 mt-12"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#A89053]/10 rounded-xl">
              <Compass size={20} className="text-[#A89053]" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#0F2C59]">
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

  // Default article parser for other slugs
  const renderDefaultArticleContent = () => {
    const paragraphs = content.split("\n\n").filter(Boolean);
    return (
      <div className="space-y-6">
        {paragraphs.map((p, idx) => (
          <p 
            key={idx} 
            className={`font-sans text-base text-slate-700 leading-relaxed ${
              idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:text-[#A89053] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]" : ""
            }`}
          >
            {p}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#FAF9F6] text-slate-800 min-h-screen pb-24 selection:bg-[#0F2C59] selection:text-white">
      
      {/* Top Floating Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] bg-[#A89053] origin-[0%] z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Hero Header Section */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={article.image} 
            alt={title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#0F2C59]/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-black/30" />
        </div>

        {/* Back navigation and share controls */}
        <div className="absolute top-8 left-0 right-0 z-20 px-6 max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/journal"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
          >
            <ArrowLeft size={12} /> {isIndo ? "Kembali" : "Back"}
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
              {copied ? (isIndo ? "Tersalin" : "Copied") : (isIndo ? "Bagikan" : "Share")}
            </button>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        {/* Floating Content Card at the bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 max-w-4xl mx-auto translate-y-6 md:translate-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 space-y-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A89053] font-bold bg-[#A89053]/10 px-3.5 py-1.5 rounded-full inline-block">
              {category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-[#0F2C59] font-normal leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] tracking-wider text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {dateStr}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={12} /> {isIndo ? "Oleh Klik Curator" : "By Klik Curator"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-4xl mx-auto px-6 pt-20 md:pt-32">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 border border-slate-100 shadow-sm">
          
          {/* Subheading / Excerpt Intro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-lg md:text-xl text-slate-600 leading-relaxed italic border-b border-slate-100 pb-8 mb-8"
          >
            {excerpt}
          </motion.div>

          {/* Render layout creatively based on slug */}
          {slug === "a-silk-road-narrative" 
            ? renderUzbekistanSilkRoadSpecial() 
            : renderDefaultArticleContent()
          }

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
          <h2 className="font-serif text-2xl md:text-4xl text-white font-normal max-w-2xl mx-auto leading-tight">
            {isIndo
              ? "Tertarik Menjelajahi Kisah Ini Secara Langsung?"
              : "Inspired to Experience this Narrative Firsthand?"}
          </h2>
          <p className="font-sans text-white/70 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            {isIndo
              ? "Tim kurator kami siap merancang rencana perjalanan privat premium Anda yang dipersonalisasi sepenuhnya."
              : "Our travel architects are ready to curate your bespoke luxury private journey tailored exactly to your preferences."}
          </p>
          <div className="pt-4">
            <Link 
              href="/private-trip#booking-form"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#A89053] hover:bg-[#A89053]/95 text-white px-8 py-4 rounded-xl transition-all shadow-md group cursor-pointer"
            >
              {isIndo ? "Rancang Perjalanan Anda" : "Plan Your Private Journey"}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Related Narratives */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl text-[#0F2C59] font-bold">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                      {artCategory}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-serif text-xl text-[#0F2C59] group-hover:text-[#A89053] transition-colors line-clamp-2">
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
