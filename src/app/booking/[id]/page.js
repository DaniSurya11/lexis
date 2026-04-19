"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ComingSoonAction from "@/components/ComingSoonAction";
import { useConsultation } from "@/context/ConsultationContext";
import { useEffect, useState } from "react";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useConsultation();
  const [booking, setBooking] = useState(null);

  const bookingId = params.id;

  useEffect(() => {
    if (bookings.length > 0) {
      const found = bookings.find(b => b.id === bookingId);
      if (found) {
        setBooking(found);
      } else {
         router.push('/dashboard');
      }
    }
  }, [bookings, bookingId, router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-outline-variant border-t-primary animate-spin mb-4"></div>
      </div>
    );
  }

  // Formatting date
  const dateObj = new Date(booking.createdAt);
  const appointmentDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const appointmentTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const isPending = booking.status === 'pending' || booking.status === 'accepted';
  const isActive = booking.status === 'active';

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      {/* TopNavBar */}
      <header className="bg-[#fcf9f8]/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/20">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-primary font-headline">
            Lexis Premium
          </div>
          <div className="hidden md:flex items-center space-x-8 font-headline tracking-tight font-bold text-sm">
            <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="border border-outline-variant/30 text-on-surface-variant font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors">
              Tutup
            </Link>
          </div>
        </nav>
      </header>

      {/* Content Canvas */}
      <main className="flex-grow pt-28 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Subtle background element */}
        {isPending && (
          <div className="absolute top-1/4 w-full h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        )}

        <div className="max-w-3xl w-full mx-auto relative z-10">
          {/* Status Header */}
          <div className="mb-10 text-center">
            {isPending ? (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6">
                   <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200 z-10 relative">
                     <span className="material-symbols-outlined text-orange-500 text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>hourglass_empty</span>
                   </div>
                   <div className="absolute inset-0 w-full h-full border-2 border-orange-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Menunggu Pengacara</h1>
                <p className="text-on-surface-variant text-sm max-w-sm mx-auto leading-relaxed">Pengacara sedang meninjau permintaan Anda. Sesi akan otomatis aktif setelah pengacara bersedia dan masuk ke dalam ruangan.</p>
              </div>
            ) : isActive ? (
               <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center z-10 relative mb-6 shadow-xl shadow-primary/20">
                     <span className="material-symbols-outlined text-white text-3xl animate-pulse" style={{fontVariationSettings: "'FILL' 1"}}>mark_chat_unread</span>
                  </div>
                  <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-2">Sesi Telah Dimulai!</h1>
                  <p className="text-on-surface-variant text-sm max-w-sm mx-auto leading-relaxed">Pengacara sudah berada di dalam ruang obrolan dan menunggu Anda.</p>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                  <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Detail Riwayat Konsultasi</h1>
                  <p className="text-on-surface-variant text-sm max-w-sm mx-auto leading-relaxed">Sesi ini telah berakhir atau dibatalkan.</p>
               </div>
            )}
          </div>

          {/* Main Document Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 pb-4 bg-surface-container-lowest flex justify-between items-center border-b border-outline-variant/20 border-dashed">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Tiket Booking</p>
                  <p className="text-sm font-bold text-on-surface">#{booking.id}</p>
               </div>
               <div className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest
                 ${isPending ? 'bg-orange-100 text-orange-700' : 
                   isActive ? 'bg-primary-container text-white animate-pulse' : 'bg-surface-container-high text-on-surface-variant'}`}>
                 {booking.status === 'pending' ? 'MENUNGGU' : 
                  booking.status === 'accepted' ? 'DITERIMA' :
                  booking.status === 'active' ? 'AKTIF' : 
                  booking.status === 'cancelled' ? 'BATAL' : 'SELESAI'}
               </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-20 h-20 shrink-0 relative">
                  <Image alt={booking.lawyerName} fill className="object-cover rounded-xl shadow border border-outline-variant/20" src={booking.lawyerImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} sizes="80px" />
                  {isActive && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
                <div>
                  <h2 className="font-headline font-extrabold text-2xl text-on-surface leading-tight mb-1">{booking.lawyerName}</h2>
                  <p className="text-primary text-[11px] font-black uppercase tracking-wider mb-2">{booking.topic}</p>
                  <div className="flex gap-4 mt-3">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-on-surface-variant opacity-70">Waktu Order</span>
                        <span className="text-xs font-bold text-on-surface mt-0.5">{appointmentDate} • {appointmentTime} WIB</span>
                     </div>
                  </div>
                 </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
               {isPending ? (
                  <div className="flex items-center gap-3 w-full bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
                     <span className="material-symbols-outlined shrink-0 text-orange-500 animate-spin">refresh</span>
                     <p className="text-xs text-orange-800 font-medium">Halaman otomatis diperbarui saat pengacara memulai sesi...</p>
                  </div>
               ) : isActive ? (
                  <Link href={`/chat/${booking.lawyerId}`} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#680b00] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0] transition-all duration-200 group">
                    <span>Masuk Ruang Obrolan</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
               ) : (
                  <Link href="/dashboard" className="w-full text-center bg-surface-container-high hover:bg-surface-dim text-on-surface py-4 rounded-xl font-bold text-sm transition-colors">
                     Kembali ke Dashboard
                  </Link>
               )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
               <span className="material-symbols-outlined text-[14px]">home</span>
               Kembali ke Beranda Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
