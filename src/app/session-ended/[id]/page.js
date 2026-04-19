"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useConsultation } from "@/context/ConsultationContext";

export default function SessionEndedPage() {
  const params = useParams();
  const router = useRouter();
  const { sessions } = useConsultation();
  const [role, setRole] = useState(null);
  const [countdown, setCountdown] = useState(5); // Increased to 5 for better UX

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
    }
  }, []);

  // Guard: If session not found or not finished, redirect to appropriate dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      const s = sessions.find((s) => s.id === params.id);
      if (!s || s.status !== "finished") {
         const target = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
         router.push(target);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessions, params.id, router, role]);

  // Auto-redirect timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const target = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
      router.push(target);
    }
  }, [countdown, router, role]);

  const isLawyer = role === "lawyer";
  const dashboardLink = isLawyer ? "/dashboard/lawyer" : "/dashboard";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-6 font-body overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-outline-variant/10 flex flex-col items-center text-center relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Animated Icon Container */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in-50 duration-1000 delay-200">
          <span className="material-symbols-outlined text-green-500 text-6xl animate-in fade-in duration-500 delay-500" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-2xl md:text-3xl font-headline font-black text-primary tracking-tight">
            {isLawyer ? "Sesi Berhasil Diselesaikan" : "Sesi Konsultasi Telah Selesai"}
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed opacity-80 text-balance px-4">
            {isLawyer 
              ? "Sesi telah ditutup dengan sukses. Anda dapat melihat riwayat konsultasi di dashboard pengacara anda."
              : "Terima kasih telah menggunakan layanan konsultasi. Anda dapat melihat riwayat percakapan di dashboard anda."}
          </p>
        </div>

        {/* Buttons and Countdown Indicator */}
        <div className="w-full space-y-6">
          <Link 
            href={dashboardLink}
            className="w-full bg-primary hover:bg-[#680b00] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Kembali ke Dashboard</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant opacity-60">
            <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin"></div>
            <span>Mengalihkan dalam {countdown} detik...</span>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </main>
  );
}
