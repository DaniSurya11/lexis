"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useConsultation } from "@/context/ConsultationContext";
import { useEffect, useState, useRef } from "react";
import { lawyersData } from "@/data/lawyers";

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings } = useConsultation();
  const [booking, setBooking] = useState(null);
  const [countdown, setCountdown] = useState(8);
  const [showContent, setShowContent] = useState(false);
  const foundRef = useRef(false);

  // Load booking data — try from context AND localStorage
  useEffect(() => {
    if (foundRef.current) return;

    // 1. Try from context
    const fromContext = bookings.find(b => b.id === id);
    if (fromContext) {
      setBooking(fromContext);
      foundRef.current = true;
      setTimeout(() => setShowContent(true), 100);
      return;
    }

    // 2. Try directly from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('lexis_bookings') || '[]');
        const fromStorage = stored.find(b => b.id === id);
        if (fromStorage) {
          setBooking(fromStorage);
          foundRef.current = true;
          setTimeout(() => setShowContent(true), 100);
          return;
        }
      } catch (err) {
        console.error('[PaymentSuccess] Error:', err);
      }
    }
  }, [bookings, id]);

  // Countdown & auto-redirect
  useEffect(() => {
    if (!booking) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [booking]);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && booking) {
      router.push('/dashboard');
    }
  }, [countdown, booking, router]);

  // Redirect fallback after 5s if no booking found
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!foundRef.current) router.push('/dashboard');
    }, 5000);
    return () => clearTimeout(fallback);
  }, [router]);

  const lawyer = booking ? lawyersData.find(l => l.id === booking.lawyerId) : null;
  const basePrice = lawyer ? parseInt(lawyer.price.replace(/\./g, "")) : 500000;
  const adminFee = 5000;
  const total = basePrice + adminFee;
  const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-primary animate-spin"></div>
        <p className="text-on-surface-variant text-sm font-medium">Memuat detail transaksi...</p>
      </div>
    );
  }

  const bookingDate = new Date(booking.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-stone-100 overflow-hidden">
          
          {/* Green Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            <div className="relative z-10">
              {/* Animated check circle */}
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4" style={{animation: 'scaleIn 0.5s ease-out'}}>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-green-500 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-extrabold text-white font-headline tracking-tight mb-1">
                Pembayaran Berhasil!
              </h1>
              <p className="text-green-100 text-sm font-medium">
                Transaksi Anda telah dikonfirmasi
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            
            {/* Booking ID */}
            <div className="flex justify-center">
              <div className="bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                  ID: {booking.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Lawyer Info Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 shadow-sm border border-stone-200">
                  {lawyer ? (
                    <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm truncate">{booking.lawyerName}</h3>
                  <p className="text-[10px] text-primary uppercase tracking-widest font-black mt-0.5">{booking.topic}</p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {bookingDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {' • '}
                    {bookingDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Ticket divider */}
              <div className="relative my-4">
                <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-stone-100" />
                <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-stone-100" />
                <div className="border-t border-dashed border-stone-200" />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 font-medium">Biaya Konsultasi</span>
                  <span className="font-bold text-stone-800">{formatRupiah(basePrice)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 font-medium">Biaya Layanan</span>
                  <span className="font-bold text-stone-800">{formatRupiah(adminFee)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 font-medium">Metode Pembayaran</span>
                  <span className="font-bold text-stone-800">QRIS</span>
                </div>
                <div className="border-t border-stone-200 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-sm font-extrabold text-stone-900">Total Dibayar</span>
                  <span className="text-lg font-black text-primary">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-600 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 leading-tight">Menunggu Konfirmasi Pengacara</p>
                <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">Pengacara akan segera meninjau permintaan Anda. Notifikasi akan dikirim saat sesi siap dimulai.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#680b00] text-white shadow-lg shadow-primary/15 px-5 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Lihat di Dashboard
              </Link>
              <Link 
                href="/lawyers"
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-lg">group</span>
                Jelajahi Pengacara Lain
              </Link>
            </div>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                Dialihkan otomatis dalam <span className="text-primary font-black">{countdown}</span> detik
              </p>
              <div className="mt-2 w-full bg-stone-100 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Transaksi Terenkripsi</span>
          </div>
          <div className="w-px h-3 bg-stone-300" />
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Lexis Verified</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
