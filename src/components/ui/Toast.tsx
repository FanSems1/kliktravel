"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all animate-bounce-short border backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
      {type === "success" ? (
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <AlertCircle size={20} />
        </div>
      )}
      <div className="pr-2">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">{type === "success" ? "Berhasil!" : "Gagal!"}</p>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-auto cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
