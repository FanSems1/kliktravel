"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JournalPreview() {
  return (
    <section className="bg-background py-24 md:py-36 relative z-10 border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-charcoal font-semibold block mb-4">
              09 — JOURNAL
            </span>
            <Heading variant="editorial" className="text-foreground text-3xl md:text-4xl">
              Travel Stories
            </Heading>
          </div>
          <div>
            <Link 
              href="/journal" 
              className="inline-block border-b border-foreground/30 hover:border-foreground pb-1 font-sans text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              Read the Journal
            </Link>
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
          
          {/* Main Story (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 group cursor-pointer flex flex-col h-full"
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded mb-8 bg-charcoal/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 image-texture opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-charcoal/5 group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute bottom-6 left-6 z-20 font-mono text-[10px] tracking-widest uppercase text-white/70 bg-black/20 backdrop-blur-md px-3 py-1 rounded">
                Brazil
              </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-center pr-8">
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 leading-snug group-hover:text-charcoal transition-colors">
                The Rhythm of Water
              </h3>
              <p className="font-sans text-sm text-foreground/70 leading-relaxed mb-6">
                Journey deep into the Amazon basin where time is measured not by clocks, but by the flow of the river and the calling of the canopy.
              </p>
              <div className="flex items-center text-xs font-mono uppercase tracking-widest text-charcoal font-semibold mt-auto">
                Read Story <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Secondary Stories (Right) */}
          <div className="md:col-span-5 flex flex-col gap-12">
            
            {/* Story 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-[1/1] overflow-hidden rounded bg-charcoal/10 shrink-0">
                <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-charcoal/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest uppercase text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                  Uzbekistan
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 leading-tight group-hover:text-charcoal transition-colors">
                  A Journey Through Central Asia
                </h3>
                <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-charcoal/70">
                  Read Story <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Story 3 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-[1/1] overflow-hidden rounded bg-charcoal/10 shrink-0">
                <div className="absolute inset-0 image-texture opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-charcoal/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-widest uppercase text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                  Iceland
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 leading-tight group-hover:text-charcoal transition-colors">
                  The Silence of the North
                </h3>
                <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-charcoal/70">
                  Read Story <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
