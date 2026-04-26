"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConsultation } from "@/context/ConsultationContext";
import SuccessModal from "@/components/SuccessModal";

export default function ClientPaymentFlow({ lawyer, scheduledAt = null }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createBooking, sessions, showToast } = useConsultation();

  const hasActiveSession = sessions.some(s => s.status === 'active');

  const handlePayment = async () => {
    if (hasActiveSession) {
      showToast("Selesaikan sesi aktif Anda sebelum membuat konsultasi baru", "error");
      return;
    }
    
    console.log("[Payment] Memulai proses pembayaran untuk lawyer:", lawyer.id);
    setIsProcessing(true);

    try {
      const bookingId = await createBooking(lawyer, "Konsultasi Hukum", scheduledAt);
      
      if (bookingId) {
        setShowPopup(true);
        setTimeout(() => {
          router.push(`/payment-success/${bookingId}`);
        }, 2500);
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {hasActiveSession && (
        <p className="text-error text-xs font-bold bg-error/10 p-3 rounded-lg text-center mb-4">
          Anda memiliki sesi aktif. Selesaikan sesi tersebut sebelum memesan sesi baru.
        </p>
      )}
      <button 
        onClick={handlePayment} 
        disabled={isProcessing || showPopup || hasActiveSession}
        className={`w-full ${isProcessing || showPopup || hasActiveSession ? 'bg-primary/70 cursor-wait' : 'bg-primary hover:opacity-90'} text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group`}
      >
        <span>{isProcessing ? 'Memproses...' : (hasActiveSession ? 'Sesi Aktif Ditemukan' : 'Bayar Sekarang')}</span>
        {!isProcessing && !hasActiveSession && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
      </button>

      <SuccessModal 
        isOpen={showPopup} 
        title="Pembayaran Sukses!" 
        description="Terima kasih. Anda akan dialihkan secara otomatis ke halaman Detail Booking." 
        toastTitle="Pembayaran Berhasil"
        toastDescription="Sesi konsultasi Anda telah aktif."
      />
    </>
  );
}
