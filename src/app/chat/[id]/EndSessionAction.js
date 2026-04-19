"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useConsultation } from "@/context/ConsultationContext";

export default function EndSessionAction({ sessionId, onSessionEnd }) {
  const router = useRouter();
  const { sessions, endSession } = useConsultation();
  const session = sessions.find(s => s.id === sessionId);
  const isFinished = session?.status === "finished";

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFinishClick = () => {
    if (isFinished) return;
    setShowConfirm(true);
  };

  const cancelFinish = () => {
    setShowConfirm(false);
  };

  const confirmFinish = () => {
    if (isFinished) return;
    
    setShowConfirm(false);
    setShowSuccess(true);
    
    // Call the callback to prevent the parent's guard from triggering an error toast
    if (onSessionEnd) onSessionEnd();
    
    endSession(sessionId);

    // Redirect after 2.0 seconds to the transitional page
    setTimeout(() => {
      router.push(`/session-ended/${sessionId}`);
    }, 2000);
  };

  const modals = (showConfirm || showSuccess) && mounted ? createPortal(
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/20 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 max-w-[360px] w-full mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-orange-500 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>help</span>
            </div>
            <h3 className="text-xl font-extrabold text-on-surface font-headline mb-3 text-center">Selesaikan Sesi Konsultasi?</h3>
            <p className="text-sm text-on-surface-variant text-center mb-8">Apakah Anda yakin akan mengakhiri sesi obrolan konsultasi ini sekarang? Sesi yang telah diakhiri akan diarsipkan.</p>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={cancelFinish}
                className="flex-1 bg-surface-container-high hover:bg-surface-dim text-on-surface-variant py-3 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmFinish}
                className="flex-1 bg-primary hover:bg-[#680b00] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/20 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 max-w-[360px] w-full mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-green-500 text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <h3 className="text-2xl font-extrabold text-primary font-headline mb-2">Selamat!</h3>
            <p className="text-sm text-on-surface-variant mb-6 font-medium">Sesi konsultasi hukum Anda telah berhasil diselesaikan.</p>
            <p className="text-xs text-on-surface-variant mb-6 opacity-70">Sesi Anda sedang diarsipkan secara aman. Anda akan diarahkan ke halaman konfirmasi dalam sekejap...</p>
            <div className="w-6 h-6 border-4 border-outline-variant border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </>, document.body
  ) : null;

  return (
    <>
      <button 
        onClick={handleFinishClick} 
        disabled={isFinished}
        className={`bg-gradient-to-br from-primary to-primary-container text-on-primary px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest md:tracking-widest shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all shrink-0 ${isFinished ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
      >
        <span className="md:hidden">{isFinished ? 'Selesai' : 'Akhiri'}</span>
        <span className="hidden md:inline">{isFinished ? 'Sesi Selesai' : 'Selesaikan Sesi'}</span>
      </button>

      {modals}
    </>
  );
}
