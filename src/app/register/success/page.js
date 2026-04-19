"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("");

  const handleRedirect = (target) => {
    setRedirectTarget(target);
    setLoadingOverlay(true);
  };

  useEffect(() => {
    if (loadingOverlay) {
      const timer = setTimeout(() => {
        router.push(redirectTarget);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loadingOverlay, redirectTarget, router]);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center justify-between overflow-x-hidden selection:bg-[#680b00]/10">
      
      {/* Transitional Overlay */}
      <SuccessModal 
        isOpen={loadingOverlay}
        title="Mempersiapkan Akses"
        description="Menghubungkan Anda ke dashboard profesional Lexis Premium."
        toastTitle="Akses Berhasil"
        toastDescription="Selamat datang! Menyiapkan ruang konsultasi Anda."
      />

      {/* Main Success Content */}
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center max-w-4xl mx-auto z-10 w-full animate-fade-in-up">
        {/* Symbolic Icon Representation */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-primary-fixed opacity-20 blur-3xl rounded-full scale-150"></div>
          <div className="relative w-24 h-24 bg-primary-container rounded-full flex items-center justify-center text-white shadow-[0_12px_40px_rgba(142,112,106,0.08)]">
            <span className="material-symbols-outlined text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
        </div>

        {/* Confirmation Text */}
        <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-primary mb-6 uppercase">
            Pendaftaran Berhasil Terkirim
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed mb-12 max-w-2xl mx-auto opacity-80">
            Akun Anda telah berhasil dibuat. Silakan masuk untuk mulai mencari pengacara dan melakukan konsultasi.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
          <button 
            onClick={() => handleRedirect('/dashboard')}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-headline font-bold text-lg rounded-lg shadow-lg active:scale-[0.98] transition-all duration-200 hover:opacity-90"
          >
            Masuk ke Dashboard
          </button>
          <button 
            onClick={() => handleRedirect('/')}
            className="w-full sm:w-auto px-10 py-4 border border-outline-variant text-on-surface-variant font-headline font-bold text-lg rounded-lg hover:bg-surface-container-high transition-colors active:scale-[0.98]"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Tonal Layering Details */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full">
          <div className="p-8 bg-surface-container-low rounded-xl relative overflow-hidden group hover:bg-white hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">shield</span>
              <h3 className="font-headline font-bold text-primary mb-2 uppercase text-sm tracking-wider">Keamanan Terjamin</h3>
              <p className="text-sm text-on-surface-variant opacity-70 group-hover:opacity-100 transition-opacity">Setiap interaksi di platform kami dienkripsi secara penuh untuk melindungi privasi hukum Anda.</p>
            </div>
          </div>

          <div className="p-8 bg-surface-container-low rounded-xl relative overflow-hidden group hover:bg-white hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">verified</span>
              <h3 className="font-headline font-bold text-primary mb-2 uppercase text-sm tracking-wider">Advokat Terverifikasi</h3>
              <p className="text-sm text-on-surface-variant opacity-70 group-hover:opacity-100 transition-opacity">Akses ke jaringan pengacara yang telah melalui proses verifikasi ketat dan profesional.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Structural Accents */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-[#680b00]/[0.02] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/2 bg-[#680b00]/[0.01] -z-10 pointer-events-none blur-3xl"></div>
    </div>
  );
}
