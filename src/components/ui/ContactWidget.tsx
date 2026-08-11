"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function ContactWidget() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center pointer-events-none">
      <Link href="/contact" className="pointer-events-auto group flex flex-col items-center hover:scale-105 transition-transform duration-300">
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-xl"
        >
          <Image
            src="/tiger_mascot.png"
            alt="Contact Mascot"
            fill
            sizes="(max-width: 768px) 80px, 96px"
            priority
            className="object-contain"
          />
        </motion.div>
        
        {/* Contact Us Pill */}
        <div className="mt-1 bg-[#38BDF8] text-white text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap">
          Contact Us
        </div>
      </Link>
    </div>
  );
}
