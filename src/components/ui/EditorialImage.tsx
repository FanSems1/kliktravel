"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditorialImageProps {
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "16/10" | "cinema";
  className?: string;
  label?: string;
  coordinates?: string;
}

export function EditorialImage({
  aspectRatio = "16/9",
  className,
  label = "IMAGE PLACEHOLDER",
  coordinates = "0.0° N, 0.0° E",
}: EditorialImageProps) {
  const ratioClasses = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "16/10": "aspect-[16/10]",
    "cinema": "aspect-[2.39/1]",
  };

  return (
    <motion.div
      initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0 }}
      whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden group border border-foreground/10 bg-ivory image-texture",
        ratioClasses[aspectRatio],
        className
      )}
    >
      {/* Zoom / scale background on hover */}
      <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-charcoal/0 transition-colors duration-700" />
      
      {/* Editorial aesthetic borders & markers */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-foreground/5 pointer-events-none flex flex-col justify-between p-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] tracking-[0.2em] font-mono text-foreground/45 uppercase">
            {coordinates}
          </span>
          <span className="text-[10px] tracking-[0.2em] font-mono text-foreground/45 uppercase">
            {aspectRatio}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[10px] tracking-[0.2em] font-mono text-foreground/60 uppercase font-medium">
            {label}
          </span>
          <span className="text-[10px] tracking-[0.2em] font-mono text-foreground/30">
            [ INTENDED PHOTOGRAPHY ]
          </span>
        </div>
      </div>

      {/* Decorative center marker */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground/10 stroke-1">
          <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" />
          <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}
