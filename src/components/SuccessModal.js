"use client";

import React, { useEffect, useState } from 'react';

/**
 * SuccessModal Component
 * @param {boolean} isOpen - Controls visibility
 * @param {string} title - Main title (e.g., "Pendaftaran Berhasil!")
 * @param {string} description - Subtext (e.g., "Akun Anda sedang diproses.")
 * @param {boolean} showSpinner - Whether to show the circular loader
 * @param {string} toastTitle - Title for the top-right toast
 * @param {string} toastDescription - Description for the top-right toast
 */
export default function SuccessModal({ 
  isOpen, 
  title = "Pendaftaran Berhasil!", 
  description = "Terima kasih. Anda akan dialihkan secara otomatis ke halaman berikutnya.",
  showSpinner = true,
  toastTitle = "Berhasil",
  toastDescription = "Pendaftaran berhasil! Menunggu konfirmasi sistem."
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500); // Wait for fade-out
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop with Blur */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>

      {/* Top Right Toast */}
      <div className={`fixed top-8 right-8 z-[1000] w-80 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-outline-variant/10 overflow-hidden transform transition-all duration-700 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-green-600 text-xl font-bold">check</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-headline font-black text-on-surface mb-0.5">{toastTitle}</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-70">{toastDescription}</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-surface-container-highest w-full relative overflow-hidden">
          <div className={`h-full bg-green-500 transition-all duration-[3000ms] linear ${isOpen ? 'w-full' : 'w-0'}`}></div>
        </div>
      </div>

      {/* Centered Modal Card */}
      <div className={`relative z-[1001] w-full max-w-sm bg-white rounded-[2rem] p-12 text-center shadow-[0_45px_100px_-20px_rgba(0,0,0,0.15)] border border-outline-variant/5 transform transition-all duration-700 cubic-bezier(0.17, 0.67, 0.83, 0.67) ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}`}>
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-green-50/30">
            <span className="material-symbols-outlined text-green-600 text-4xl font-bold">check</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-headline font-black text-[#680b00] uppercase tracking-tight mb-4">{title}</h2>
        <p className="text-[13px] text-on-surface-variant font-medium leading-relaxed opacity-80 mb-10 mx-auto max-w-[240px]">
          {description}
        </p>

        {showSpinner && (
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
               {/* Background Ring */}
               <div className="absolute inset-0 border-4 border-surface-container-highest rounded-full opacity-30"></div>
               {/* Spinning Accent */}
               <div className="absolute inset-0 border-4 border-[#680b00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
