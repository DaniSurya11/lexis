"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { lawyersData } from "@/data/lawyers";
import { useParams, useRouter } from "next/navigation";
import EndSessionAction from "./EndSessionAction";
import { useConsultation } from "@/context/ConsultationContext";
import { useEffect, useState } from "react";

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { sessions, bookings, showToast } = useConsultation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const sessionEndedRef = React.useRef(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);

  const lawyerId = parseInt(params.id);
  const lawyer = lawyersData.find((l) => l.id === lawyerId);

  // Cek apakah context sudah selesai loading dari localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Context loaded = localStorage sudah pernah dibaca
    const timer = setTimeout(() => {
      setIsContextLoaded(true);
    }, 500); // Beri waktu context untuk sync dari localStorage
    return () => clearTimeout(timer);
  }, []);

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Jika sesi sudah sengaja diakhiri oleh user, jangan trigger guard
    if (sessionEndedRef.current && !isFinished) return;

    // Tunggu context selesai loading
    if (!isContextLoaded) return;

    // Session Guard Logic
    const activeSessionObj = sessions.find(s => s.status === 'active');
    
    if (!activeSessionObj) {
      // Periksa apakah ada booking completed (artinya sesi diakhiri secara normal)
      const justCompleted = bookings.find(b => b.lawyerId === lawyerId && b.status === 'completed');
      if (justCompleted) {
        sessionEndedRef.current = true;
        setIsFinished(true);
        setIsAuthorized(true);
        return;
      }
      
      // Tidak ada sesi aktif dan tidak ada completed → user tidak berhak di sini
      if (sessions.length > 0 || bookings.length > 0) {
        // Jangan show error jika memang sedang transisi ke dashboard
        if (!sessionEndedRef.current) {
          showToast("Tidak ada sesi aktif ditemukan", "error");
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
      return;
    }
    
    const associatedBooking = bookings.find(b => b.id === activeSessionObj.bookingId);
    
    if (associatedBooking && associatedBooking.lawyerId !== lawyerId) {
       showToast("Anda tidak memiliki akses ke sesi ini", "error");
       router.push("/dashboard");
       return;
    }

    setActiveSession(activeSessionObj);
    setIsAuthorized(true);
  }, [sessions, bookings, lawyerId, router, showToast, isContextLoaded]);

  // Callback untuk EndSessionAction — set ref SEBELUM endSession dipanggil
  const handleSessionEnd = React.useCallback(() => {
    sessionEndedRef.current = true;
  }, []);

  const [wasActive, setWasActive] = useState(false);
  useEffect(() => {
    if (activeSession) setWasActive(true);
  }, [activeSession]);

  // Redirect to session-ended page if already finished (Transitional/Safety Guard)
  useEffect(() => {
    if (isFinished && isContextLoaded) {
      // Improved Session ID Lookup
      const lookupSessionId = () => {
        const completedBooking = bookings.find(b => Number(b.lawyerId) === Number(lawyerId) && b.status === 'completed');
        if (completedBooking) {
          const s = sessions.find(s => s.bookingId === completedBooking.id);
          if (s) return s.id;
        }
        // Fallback: Check if there's an active session ID we just had
        if (activeSession?.id) return activeSession.id;
        return null;
      };

      const sid = lookupSessionId();
      
      // Safety timer: Only redirect if EndSessionAction hasn't done so after a while
      const timer = setTimeout(() => {
        if (sid) {
          console.log("[ChatPage] Safety redirecting to session-ended:", sid);
          router.push(`/session-ended/${sid}`);
        } else {
          console.warn("[ChatPage] Could not find session ID, falling back to dashboard");
          const target = localStorage.getItem("userRole") === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
          router.push(target);
        }
      }, wasActive ? 4000 : 500); // 4s if just ended, 0.5s if already ended

      return () => clearTimeout(timer);
    }
  }, [isFinished, isContextLoaded, wasActive, sessions, bookings, lawyerId, router, activeSession]);

  // Combined Loading & Finished Guard
  if (!lawyer || !isAuthorized || !activeSession || isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
         <div className="w-8 h-8 rounded-full border-4 border-outline-variant border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-[#fcf9f8]/95 backdrop-blur-md font-headline text-sm font-bold tracking-tight docked full-width top-0 sticky z-50 transition-all border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:bg-[#eae7e7]/50 p-2 rounded-lg transition-colors scale-98 active:opacity-90">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden md:inline font-semibold">Kembali ke Dasbor</span>
            </Link>
            <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>
            
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm relative shrink-0">
                <Image fill className="object-cover" alt={lawyer.name} src={lawyer.image} sizes="40px" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h1 className="text-primary font-black tracking-tight leading-tight text-[11px] sm:text-xs md:text-base truncate">{lawyer.name}</h1>
                <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-tertiary animate-pulse shrink-0"></span>
                  <span className="text-[9px] md:text-[11px] text-tertiary font-bold uppercase tracking-wider md:tracking-widest leading-none">
                    <span className="md:hidden">Online</span>
                    <span className="hidden md:inline">Sedang Aktif (Online)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-[#eae7e7]/50 rounded-lg transition-all" style={{fontVariationSettings: "'FILL' 1"}}>info</button>
            <EndSessionAction sessionId={activeSession.id} onSessionEnd={handleSessionEnd} />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col max-w-5xl w-full mx-auto bg-surface-container-low/30 relative">
        {/* Chat Area */}
        <section className="flex-grow overflow-y-auto px-6 py-8 space-y-8 pb-32">
          {/* System Timestamp & Trust Elements */}
          <div className="flex flex-col items-center gap-3">
            <span className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              Sesi Dimulai
            </span>
            <div className="flex items-center gap-2 bg-surface-container-highest/30 px-3 py-1.5 rounded-lg border border-outline-variant/10 text-on-surface-variant opacity-80 mt-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              <span className="text-[10px] font-medium tracking-wide">Percakapan ini bersifat rahasia dan terlindungi.</span>
            </div>
          </div>

          {/* Lawyer Message */}
          <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%] animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 shadow-sm border border-outline-variant/20 relative">
                <Image fill className="object-cover" alt={lawyer.name} src={lawyer.image} sizes="32px" />
              </div>
              <div className="text-on-surface p-4 rounded-xl rounded-bl-none shadow-sm border border-outline-variant/10 bg-surface-container-low">
                <p className="text-sm leading-relaxed font-body">Halo! Saya {lawyer.name}. Saya sudah siap untuk memulai sesi konsultasi hukum kita. Silakan ceritakan detail persoalan Anda.</p>
              </div>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium mt-2 ml-11">Baru saja</span>
          </div>

          {/* Client Message (Mockup) */}
          <div className="flex flex-col items-end max-w-[85%] md:max-w-[70%] ml-auto animate-in slide-in-from-right-4 duration-500 delay-150">
            <div className="bg-primary-container text-white p-4 rounded-xl rounded-br-none shadow-md shadow-primary/5">
              <p className="text-sm leading-relaxed font-body">Terima kasih atas persetujuannya. Saya ingin berdiskusi mengenai perlindungan hukum terkait kasus saya.</p>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium mt-2 mr-1">Baru saja</span>
          </div>

          {/* Typing Indicator / Disconnect Simulation */}
          <div className="flex flex-col items-start gap-2 pt-4">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high/30 flex items-center justify-center border border-outline-variant/10">
                <span className="material-symbols-outlined text-orange-500 text-sm">wifi_off</span>
              </div>
              <div className="bg-orange-50 px-4 py-2.5 rounded-full border border-orange-100 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[11px] font-bold text-orange-800 italic font-headline">Pengacara sedang tidak aktif, mohon tunggu...</span>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant opacity-70 ml-11">Sistem sedang mendeteksi koneksi ulang. Tunggu beberapa saat atau lanjutkan kembali nanti.</p>
          </div>
        </section>

        {/* Input Section */}
        <div className="fixed bottom-0 left-0 w-full md:left-auto md:w-[calc(100%-2rem)] md:max-w-5xl bg-surface/95 backdrop-blur-sm border-t border-outline-variant/20 px-4 py-4 md:px-8 z-40">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant p-2.5 hover:bg-surface-container-high rounded-full transition-colors active:scale-90">attach_file</button>
            <div className="flex-grow relative flex items-center">
              <input 
                className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:outline-none text-sm py-3 px-4 transition-all font-body rounded-t-lg" 
                placeholder="Tulis pesan Anda di sini..." 
                type="text" 
              />
              <button className="absolute right-2 material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">mood</button>
            </div>
            <button className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all outline-none">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
            </button>
          </div>
          
          <footer className="mt-4 pb-2 text-center scale-90 origin-bottom">
            <div className="flex justify-center items-center gap-6 opacity-40 hover:opacity-70 transition-opacity">
              <span className="text-[9px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant">© 2026 Lexis Premium</span>
              <span className="text-[9px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">shield</span> End-to-End Encryption</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
