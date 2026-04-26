"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useConsultation } from "@/context/ConsultationContext";
import { createClient } from "@/lib/supabase";

export default function ClientAppointmentsPage() {
  const router = useRouter();
  const { bookings } = useConsultation();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("Pengguna");
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          const fullName = profile?.full_name || user.user_metadata?.full_name || "Pengguna";
          setUserName(fullName.split(" ")[0]);
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
      case 'pending': return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Menunggu</span>;
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
            <p className="text-xs text-on-surface-variant font-medium mt-1 tracking-wide">Daftar semua konsultasi terjadwal Anda.</p>
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
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm">Anda tidak memiliki jadwal konsultasi dalam waktu dekat.</p>
                <Link href="/lawyers" className="mt-4 bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary-container transition-colors">Cari Pengacara</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingAppointments.map(b => (
                  <Link key={b.id} href={`/booking/${b.id}`} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined">event</span>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-extrabold text-base mb-1 group-hover:text-primary transition-colors">{b.lawyerName || "Pengacara"}</h3>
                      <p className="text-xs text-on-surface-variant mb-4">{b.topic}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Jadwal</span>
                        <span className="text-sm font-black text-on-surface">{new Date(b.scheduled_at).toLocaleString('id-ID', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})} WIB</span>
                        <span className="text-[10px] font-bold text-primary mt-1">{getTimeRemaining(b.scheduled_at)}</span>
                      </div>
                    </div>
                  </Link>
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
                        <th className="px-6 py-4">Pengacara</th>
                        <th className="px-6 py-4">Topik</th>
                        <th className="px-6 py-4">Jadwal Sesi</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {pastAppointments.map(b => (
                        <tr key={b.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4 font-bold">{b.lawyerName || "Pengacara"}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{b.topic}</td>
                          <td className="px-6 py-4">{new Date(b.scheduled_at).toLocaleString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})} WIB</td>
                          <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                          <td className="px-6 py-4">
                            <Link href={`/booking/${b.id}`} className="text-primary font-bold text-xs hover:underline">Detail</Link>
                          </td>
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
