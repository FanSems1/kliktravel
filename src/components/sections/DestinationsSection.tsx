"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/layout/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import Link from "next/link";

export function DestinationsSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <Section className="bg-ivory" container={false}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24 flex justify-between items-end">
        <Heading variant="display" className="text-charcoal">
          Featured <br /> <span className="italic text-charcoal/60">Journeys</span>
        </Heading>
        <Link href="/destinations" className="hidden md:inline-block border-b border-charcoal pb-1 font-sans text-xs uppercase tracking-widest hover:text-charcoal/60 transition-colors">
          View all destinations
        </Link>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
        {/* Left Column */}
        <motion.div style={{ y: y1 }} className="md:col-span-5 flex flex-col gap-24">
          <div className="group cursor-pointer">
            <EditorialImage 
              aspectRatio="4/3" 
              label="AMALFI COAST, ITALY"
              coordinates="40.63° N, 14.60° E"
            />
            <div className="mt-6 flex justify-between items-start">
              <div>
                <Heading variant="editorial" className="text-3xl mb-2">The Tyrrhenian Sun</Heading>
                <p className="font-sans text-sm text-charcoal/60">8 Days / 7 Nights</p>
              </div>
            </div>
          </div>
          
          <div className="group cursor-pointer md:ml-12">
            <EditorialImage 
              aspectRatio="1/1" 
              label="KYOTO, JAPAN"
              coordinates="35.01° N, 135.76° E"
            />
            <div className="mt-6 flex justify-between items-start">
              <div>
                <Heading variant="editorial" className="text-3xl mb-2">Whispers of Autumn</Heading>
                <p className="font-sans text-sm text-charcoal/60">10 Days / 9 Nights</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div style={{ y: y2 }} className="md:col-span-6 md:col-start-7 flex flex-col gap-24 pt-24 md:pt-0">
          <div className="group cursor-pointer">
            <EditorialImage 
              aspectRatio="16/10" 
              label="PATAGONIA, CHILE"
              coordinates="51.73° S, 72.50° W"
            />
            <div className="mt-6 flex justify-between items-start">
              <div>
                <Heading variant="editorial" className="text-3xl mb-2">At the Edge of Earth</Heading>
                <p className="font-sans text-sm text-charcoal/60">14 Days / 13 Nights</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
