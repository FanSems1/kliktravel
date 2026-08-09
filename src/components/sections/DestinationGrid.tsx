"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import Link from "next/link";

interface Destination {
  id: string;
  name: string;
  gridClass: string;
  aspectRatio: string;
  coordinates: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: "japan",
    name: "Japan",
    gridClass: "md:col-span-8 md:row-span-2", // Very large
    aspectRatio: "aspect-[16/10] md:aspect-[16/11]",
    coordinates: "35.6762° N, 139.6503° E"
  },
  {
    id: "morocco",
    name: "Morocco",
    gridClass: "md:col-span-4", // Smaller
    aspectRatio: "aspect-[4/3] md:aspect-[1/1]",
    coordinates: "31.7917° N, 7.0926° W"
  },
  {
    id: "turkey",
    name: "Turkey",
    gridClass: "md:col-span-4", // Smaller
    aspectRatio: "aspect-[4/3] md:aspect-[1/1]",
    coordinates: "38.9637° N, 35.2433° E"
  },
  {
    id: "italy",
    name: "Italy",
    gridClass: "md:col-span-6", // Horizontal
    aspectRatio: "aspect-[16/10]",
    coordinates: "41.8719° N, 12.5674° E"
  },
  {
    id: "iceland",
    name: "Iceland",
    gridClass: "md:col-span-6", // Horizontal
    aspectRatio: "aspect-[16/10]",
    coordinates: "64.9631° N, 19.0208° W"
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    gridClass: "md:col-span-4 md:row-span-2", // Vertical
    aspectRatio: "aspect-[3/4] md:aspect-[3/5]",
    coordinates: "41.3775° N, 64.5853° E"
  },
  {
    id: "switzerland",
    name: "Switzerland",
    gridClass: "md:col-span-8", // Horizontal
    aspectRatio: "aspect-[16/9] md:aspect-[2.39/1]",
    coordinates: "46.8182° N, 8.2275° E"
  }
];

export function DestinationGrid() {
  return (
    <section className="bg-charcoal text-white py-24 md:py-36 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/50 block mb-4">
              06 — EXPLORE
            </span>
            <Heading variant="display" className="text-white text-5xl md:text-6xl">
              Where will you go?
            </Heading>
          </div>
          <div>
            <Link 
              href="/destinations" 
              className="inline-block border-b border-white/30 hover:border-white pb-1 font-sans text-xs uppercase tracking-widest text-white/80 hover:text-white transition-all duration-300"
            >
              View All Destinations
            </Link>
          </div>
        </div>

        {/* Varied Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.id}
              className={`${dest.gridClass} group cursor-pointer relative overflow-hidden`}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Image box */}
              <div className={`relative w-full rounded overflow-hidden bg-white/5 ${dest.aspectRatio}`}>
                
                {/* Visual placeholder color gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60" />
                <div className="absolute inset-0 bg-[#357ABD]/20 opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
                <div className="absolute inset-0 image-texture opacity-25 mix-blend-overlay" />

                {/* Coordinates top right */}
                <div className="absolute top-6 right-6 z-20 font-mono text-[9px] tracking-widest text-white/40">
                  {dest.coordinates}
                </div>

                {/* Typography partially over or beside */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 transition-transform duration-500 group-hover:translate-y-[-4px]">
                  <h3 className="font-serif text-3xl md:text-4xl text-white drop-shadow-md">
                    {dest.name}
                  </h3>
                  <span className="inline-block font-sans text-[9px] tracking-[0.35em] uppercase text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                    Explore →
                  </span>
                </div>

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
