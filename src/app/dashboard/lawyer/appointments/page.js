"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useConsultation } from "@/context/ConsultationContext";
import { createClient } from "@/lib/supabase";

export default function LawyerAppointmentsPage() {
  const router = useRouter();
  const { bookings, acceptBooking } = useConsultation();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        } else {
          router.push("/login");
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUser();
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  // Filter only scheduled bookings
  const scheduledBookings = bookings
    .filter(b => b.scheduled_at !== null)
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  const upcomingAppointments = scheduledBookings.filter(b => 
    (b.status === 'pending' || b.status === 'accepted') && new Date(b.scheduled_at) >= now
  );
  
  const pastAppointments = scheduledBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled' || (new Date(b.scheduled_at) < now && b.status !== 'active')
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Diterima</span>;
      case 'pending': return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Menunggu Respons</span>;
      case 'completed': return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Selesai</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Dibatalkan</span>;
      default: return <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  const getTimeRemaining = (scheduledAt) => {
    const diffMs = new Date(scheduledAt).getTime() - now.getTime();
    if (diffMs <= 0) return "Waktu Sesi Tiba";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) return `Dalam ${diffDays} Hari`;
    if (diffHours > 0) return `Dalam ${diffHours} Jam`;
    return `Dalam ${diffMins} Menit`;
  };

  return (
    <>

        {/* Header */}
        <header className="bg-white border-b border-outline-variant/20 px-6 py-4 lg:px-10 lg:py-6 flex items-center justify-between shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-xl lg:text-2xl font-black font-headline text-on-surface tracking-tight">Janji Temu</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1 tracking-wide">Jadwal konsultasi klien yang akan datang.</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsDropdown userId={userId} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 space-y-10 relative">
          
          <section className="space-y-6">
            <h2 className="text-lg font-headline font-extrabold tracking-tight">Janji Temu Mendatang</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/30 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">calendar_month</span>
                <p className="text-sm font-bold">Belum ada janji temu</p>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm">Anda tidak memiliki jadwal konsultasi dengan klien dalam waktu dekat.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingAppointments.map(b => (
                  <div key={b.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined">group</span>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-extrabold text-base mb-1 group-hover:text-primary transition-colors">{b.clientName || `Klien #${b.id.slice(-4)}`}</h3>
                      <p className="text-xs text-on-surface-variant mb-4">{b.topic}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 mt-auto mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Jadwal Sesi</span>
                        <span className="text-sm font-black text-on-surface">{new Date(b.scheduled_at).toLocaleString('id-ID', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})} WIB</span>
                        <span className="text-[10px] font-bold text-primary mt-1">{getTimeRemaining(b.scheduled_at)}</span>
                      </div>
                    </div>
                    
                    {b.status === 'pending' && (
                      <button 
                        onClick={() => acceptBooking(b.id)}
                        className="w-full bg-primary text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary-container active:scale-95 transition-all shadow-sm"
                      >
                        Terima Booking
                      </button>
                    )}
                    {b.status === 'accepted' && (
                      <Link 
                        href="/dashboard/lawyer"
                        className="w-full bg-surface-container-high text-on-surface-variant py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-center hover:text-on-surface transition-all"
                      >
                        Mulai dari Dashboard Utama
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6 opacity-80">
            <h2 className="text-lg font-headline font-extrabold tracking-tight">Riwayat Janji Temu</h2>
            {pastAppointments.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">Belum ada riwayat janji temu.</p>
            ) : (
              <div className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-black">
                      <tr>
                        <th className="px-6 py-4">Klien</th>
                        <th className="px-6 py-4">Topik</th>
                        <th className="px-6 py-4">Jadwal Sesi</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {pastAppointments.map(b => (
                        <tr key={b.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4 font-bold">{b.clientName || `Klien #${b.id.slice(-4)}`}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{b.topic}</td>
                          <td className="px-6 py-4">{new Date(b.scheduled_at).toLocaleString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})} WIB</td>
                          <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

        </main>
    </>
  );
}
