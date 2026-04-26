"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useConsultation } from "@/context/ConsultationContext";
import { createClient } from "@/lib/supabase";

export default function SessionEndedPage() {
  const params = useParams();
  const router = useRouter();
  const { sessions, bookings, showToast } = useConsultation();
  const [role, setRole] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const supabase = createClient();

  const sessionData = sessions.find((s) => s.id === params.id);
  const bookingData = sessionData ? bookings.find(b => b.id === sessionData.booking_id) : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole"));
    }
  }, []);

  // Guard: If session not found or not finished, redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionData || sessionData.status !== "finished") {
         const target = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
         router.push(target);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionData, router, role]);

  // Auto-redirect timer only for lawyers or if review is submitted
  useEffect(() => {
    if (role === "lawyer" || reviewSubmitted) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const target = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
        router.push(target);
      }
    }
  }, [countdown, router, role, reviewSubmitted]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast("Mohon berikan rating (bintang)", "error");
      return;
    }
    if (!bookingData) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        booking_id: bookingData.id,
        client_id: bookingData.client_id || bookingData.clientId,
        lawyer_id: bookingData.lawyer_id || bookingData.lawyerId,
        rating: rating,
        comment: comment
      }]);

      if (error) throw error;
      
      const lawyerId = bookingData.lawyer_id || bookingData.lawyerId;
      
      // Kirim Notifikasi ke Pengacara
      await supabase.from('notifications').insert([{
        user_id: lawyerId,
        title: "Ulasan Baru",
        message: `Klien memberikan Anda rating ${rating} Bintang atas sesi konsultasi yang baru saja selesai.`,
        link_url: "/dashboard/lawyer"
      }]);
      
      setReviewSubmitted(true);
      setCountdown(3); // Start 3 sec countdown after review
      showToast("Ulasan berhasil dikirim. Terima kasih!", "success");
    } catch (err) {
      showToast("Gagal mengirim ulasan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLawyer = role === "lawyer";
  const dashboardLink = isLawyer ? "/dashboard/lawyer" : "/dashboard";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-6 font-body overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-outline-variant/10 flex flex-col items-center relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-1000 delay-200">
          <span className="material-symbols-outlined text-green-500 text-5xl animate-in fade-in duration-500 delay-500" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-3 mb-8 text-center">
          <h1 className="text-2xl font-headline font-black text-primary tracking-tight">
            {isLawyer ? "Sesi Selesai" : "Konsultasi Selesai"}
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed opacity-80 px-2">
            {isLawyer 
              ? "Sesi telah ditutup. Anda dapat melihat riwayatnya di dashboard."
              : reviewSubmitted 
                ? "Terima kasih atas ulasan Anda!" 
                : "Bagaimana pengalaman Anda bersama Pengacara ini?"}
          </p>
        </div>

        {/* Client Review Section */}
        {!isLawyer && !reviewSubmitted && (
          <form onSubmit={handleSubmitReview} className="w-full space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex flex-col items-center gap-3">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Berikan Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <span 
                      className={`material-symbols-outlined text-4xl ${
                        star <= (hoverRating || rating) ? "text-yellow-400" : "text-outline-variant/30"
                      }`}
                      style={{ fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda (opsional)..."
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-[#680b00] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              ) : (
                <span>Kirim Ulasan</span>
              )}
            </button>
            <div className="text-center">
               <button 
                 type="button" 
                 onClick={() => setReviewSubmitted(true)}
                 className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4"
               >
                 Lewati
               </button>
            </div>
          </form>
        )}

        {/* Redirect Indicator (For Lawyers or after review) */}
        {(isLawyer || reviewSubmitted) && (
          <div className="w-full space-y-4 animate-in fade-in duration-500">
            <Link 
              href={dashboardLink}
              className="w-full bg-surface-container-low hover:bg-outline-variant/10 text-on-surface-variant py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Kembali ke Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant opacity-60">
              <div className="w-3 h-3 border-2 border-outline-variant border-t-primary rounded-full animate-spin"></div>
              <span>Mengalihkan dalam {countdown} detik...</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </main>
  );
}
