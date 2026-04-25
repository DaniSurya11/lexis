"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import ComingSoonAction from "@/components/ComingSoonAction";
import { useConsultation } from "@/context/ConsultationContext";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { bookings, sessions } = useConsultation();
  const [activeSession, setActiveSession] = useState(null);
  const [redirectCount, setRedirectCount] = useState(2);
  const [showRedirectBanner, setShowRedirectBanner] = useState(false);
  const [userName, setUserName] = useState("Pengguna");
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { createClient } = await import("@/lib/supabase");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Ambil nama terbaru dari tabel profiles (bukan auth metadata)
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();

          const fullName = profile?.full_name || user.user_metadata?.full_name || "Pengguna";
          setUserName(fullName.split(" ")[0]);
          if (profile?.avatar_url) setUserAvatar(profile.avatar_url);
        }
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    };
    loadUser();
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  const allActiveSessions = sessions.filter(s => s.status === 'active');
  const activeSess = allActiveSessions.length > 0 ? allActiveSessions[allActiveSessions.length - 1] : null;

  useEffect(() => {
    if (activeSess) {
      setActiveSession(activeSess);
      setShowRedirectBanner(true);
    } else {
      setActiveSession(null);
      setShowRedirectBanner(false);
    }
  }, [activeSess]);

  useEffect(() => {
    let timer;
    let countdownTimer;

    if (showRedirectBanner && activeSession) {
      const associatedBooking = bookings.find(b => b.id === activeSession.bookingId);
      
      countdownTimer = setInterval(() => {
        setRedirectCount((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      timer = setTimeout(() => {
        if (associatedBooking) {
          router.push(`/chat/${associatedBooking.lawyerId}`);
        }
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
      setRedirectCount(2);
    };
  }, [showRedirectBanner, activeSession, router, bookings]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="flex min-h-screen bg-surface w-full">
      {/* Auto Redirect Banner */}
      {showRedirectBanner && activeSession && (
        <div className="fixed top-0 left-0 w-full bg-primary text-white z-[100] px-4 py-3 flex items-center justify-between shadow-xl animate-in slide-in-from-top flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin" style={{fontVariationSettings: "'FILL' 1"}}>sync</span>
            <div>
              <p className="font-bold text-sm tracking-wide">Anda memiliki sesi konsultasi yang sedang berlangsung.</p>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mt-0.5">Mengalihkan ke ruang obrolan dalam {redirectCount} detik...</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const b = bookings.find(bk => bk.id === activeSession.booking_id);
              if (b) router.push(`/chat/${b.lawyer_id}`);
            }} 
            className="bg-white text-primary px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-surface transition-colors whitespace-nowrap active:scale-95"
          >
            Masuk Sekarang
          </button>
        </div>
      )}

      {/* DashboardSidebar — Reusable Component */}
      <DashboardSidebar role="client" />

      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="bg-surface/80 backdrop-blur-md text-primary font-headline tracking-tight top-0 sticky z-30 border-b border-outline-variant/30 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center w-full">
            <div>
            <Link href="/" className="flex items-center gap-1 py-1 group shrink-0">
              <Image 
                src="/logo-icon.svg"
                alt="Lexis Icon"
                width={32}
                height={32}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:rotate-12"
              />
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-black tracking-tighter text-brand-blue">
                    LEXIS
                  </span>
                  <span className="text-[7.5px] font-bold tracking-[0.1em] text-outline uppercase opacity-90">
                    Premium
                  </span>
                </div>
            </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <DarkModeToggle />
                <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors relative" aria-label="Notifikasi">
                  <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" aria-label="Ada notifikasi baru"></span>
                </button>
                <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" aria-label="Pengaturan">
                  <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                </button>
              </div>
              <div className="flex items-center gap-4 pl-6 border-l border-outline-variant/30">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-extrabold text-on-surface">{userName}</p>
                  <p className="text-[9px] text-tertiary-container bg-tertiary-fixed/50 px-2 py-0.5 rounded uppercase tracking-widest font-black inline-block mt-0.5">Premium Member</p>
                </div>
                <Image 
                  alt="Foto profil pengguna" 
                  className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-outline-variant/50" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWlCtSg7SfE1nmkRnz5Gd67AR34YiyFumONQx0kShYfm-299M9SDgxdqfT9SvatbbkkqMffptBh6w_WeSInKunkJ8lGPpy9Ibpbk63QHvSBOSpEDcp4_F4X3oxckM_iwvtG49B3-DvCP139_7x3NRgJmRQ0osWqT6u6qTVzxoEGPxFYYKtSQVtGHjxdKLuAybXS67m8Jv7msHaT0S1eg_DI6n95AZe98-kgNOy3BfncI7ov9EAxUQ91G_sYvaR_Z3D7fCh4gZkmng"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
          
          {/* Quick Action Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-headline font-black text-on-surface tracking-tight">Selamat datang, {userName} 👋</h1>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">Kelola konsultasi hukum Anda dari satu tempat.</p>
            </div>
            <Link href="/lawyers" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-container transition-all shadow-md shadow-primary/20 active:scale-95">
              <span className="material-symbols-outlined text-base">add</span>
              Konsultasi Baru
            </Link>
          </div>

          {/* Summary Bento */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 border-l-4 border-l-primary-container shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">Total Konsultasi</p>
              <div className="text-4xl font-headline font-black text-primary-container tracking-tighter animate-count-up">{completedBookings.length}</div>
              <div className="mt-4 flex items-center text-[11px] text-primary font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>history_edu</span>
                <span>Sejak bergabung Januari 2024</span>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </div>
            
            <div className={`p-6 rounded-2xl border-l-4 shadow-lg text-white relative overflow-hidden transform hover:scale-[1.02] transition-transform ${activeSession ? 'bg-gradient-to-br from-primary to-[#7a0f00] border-l-[#ffb4a5] shadow-primary/20' : 'bg-surface-container-highest text-on-surface border-l-outline-variant'}`}>
              <div className={`absolute right-0 top-0 opacity-10 ${activeSession ? 'text-white' : 'text-on-surface'}`}>
                <span className="material-symbols-outlined text-9xl">forum</span>
              </div>
              <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 relative z-10 ${activeSession ? 'text-[#ffb4a5]' : 'text-on-surface-variant'}`}>Sesi Aktif</p>
              <div className={`text-4xl font-headline font-black tracking-tighter relative z-10 ${!activeSession && 'text-on-surface-variant'}`}>{allActiveSessions.length.toString().padStart(2, '0')}</div>
              <p className={`mt-4 text-[11px] font-bold relative z-10 ${activeSession ? 'text-white' : 'text-on-surface-variant'}`}>
                {activeSession ? 'Membutuhkan perhatian Anda' : 'Tidak ada sesi berlangsung'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 border-l-4 border-l-outline shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">Menunggu Jadwal</p>
              <div className="text-4xl font-headline font-black text-on-surface tracking-tighter">{pendingBookings.length}</div>
              <p className="mt-4 text-[11px] text-on-surface-variant font-bold">Booking aktif menunggu konfirmasi</p>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column */}
            <div className="xl:col-span-8 space-y-10">
              
                {/* Sesi Aktif List */}
              <section className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                  <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">Sesi Aktif</h2>
                </div>
                
                <div className="space-y-4">
                  {allActiveSessions.length === 0 ? (
                    <div className="bg-surface-container-low p-12 rounded-3xl border-2 border-outline-variant/20 border-dashed flex flex-col items-center justify-center text-center group hover:bg-surface-container-high/50 transition-all">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">chat_bubble_outline</span>
                      </div>
                      <h4 className="font-bold text-on-surface text-base">Belum ada sesi aktif</h4>
                      <p className="text-xs text-on-surface-variant max-w-[280px] mt-1.5 leading-relaxed">Anda belum memiliki konsultasi yang sedang berjalan. Cari pengacara dan mulai konsultasi sekarang.</p>
                      <Link href="/lawyers" className="mt-6 bg-white border border-outline-variant/50 text-primary-container px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-primary-container hover:text-white transition-all shadow-sm">Cari Pengacara</Link>
                    </div>
                  ) : (
                    allActiveSessions.map(session => {
                      const sessionBooking = bookings.find(b => b.id === session.booking_id);
                      if (!sessionBooking) return null;
                      
                      const lawyerName = sessionBooking.lawyer?.profiles?.full_name || sessionBooking.lawyerName || "Pengacara";
                      const lawyerImage = sessionBooking.lawyerImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

                      return (
                        <div key={session.id} className="bg-white p-6 rounded-2xl border border-primary/40 shadow-md shadow-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary transition-all hover:scale-[1.01]">
                          <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                              <Image alt={`Foto profil ${lawyerName}`} className="w-14 h-14 rounded-full object-cover ring-2 ring-outline-variant/20" src={lawyerImage} width={56} height={56} unoptimized />
                              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" aria-label="Online"></span>
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-headline font-extrabold text-lg text-on-surface leading-tight tracking-tight">{lawyerName}</h4>
                                <span className="bg-tertiary-fixed text-tertiary-container text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest text-ellipsis overflow-hidden max-w-[150px] whitespace-nowrap">{sessionBooking.topic}</span>
                              </div>
                              <p className="text-xs text-on-surface-variant font-medium">Sesi dimulai pada {formatDate(session.started_at)}</p>
                            </div>
                          </div>
                          <Link href={`/chat/${sessionBooking.lawyer_id}`} className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-xs transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10 uppercase tracking-widest whitespace-nowrap text-center">
                            Lanjutkan Konsultasi
                          </Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </section>

            </div>

            {/* Right Column */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Status Booking */}
              <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm border-t-4 border-t-on-surface-variant animate-in fade-in slide-in-from-right-6 duration-700 delay-200 fill-mode-both">
                <h3 className="text-lg font-headline font-extrabold text-on-surface tracking-tight mb-5 border-b border-outline-variant/20 pb-3">Status Booking Terbaru</h3>
                <div className="space-y-3">
                  {pendingBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 opacity-40">
                        <span className="material-symbols-outlined text-2xl" aria-hidden="true">receipt_long</span>
                      </div>
                      <p className="text-xs font-bold text-on-surface/50">Belum ada booking aktif</p>
                      <p className="text-[10px] text-on-surface-variant/40 mt-0.5">Booking baru akan muncul di sini.</p>
                    </div>
                  ) : (
                    pendingBookings.map(b => (
                      <Link key={b.id} href={`/booking/${b.id}`} className="p-3 rounded-xl flex items-start gap-3 hover:bg-surface-container-low transition-colors border border-outline-variant/10 hover:border-outline-variant/30 group">
                        <div className={`w-2 h-2 rounded-full mt-2 ${b.status === 'accepted' ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                        <div className="flex-1 pb-1">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <p className="text-xs font-bold text-on-surface leading-tight transition-colors group-hover:text-primary">{b.lawyerName}</p>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${b.status === 'accepted' ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-100'}`}>
                              {b.status === 'accepted' ? 'Diterima' : 'Menunggu'}
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold text-on-surface-variant mb-0.5 uppercase tracking-widest truncate max-w-[150px]">{b.topic}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>

              {/* Riwayat Konsultasi */}
              <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm border-t-4 border-t-primary animate-in fade-in slide-in-from-right-6 duration-700 delay-300 fill-mode-both">
                <h3 className="text-lg font-headline font-extrabold text-on-surface tracking-tight mb-5 border-b border-outline-variant/20 pb-3">Riwayat Konsultasi</h3>
                <div className="space-y-3">
                  {completedBookings.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 opacity-40">
                        <span className="material-symbols-outlined text-2xl" aria-hidden="true">history</span>
                      </div>
                      <p className="text-xs font-bold text-on-surface/50">Belum ada riwayat</p>
                      <p className="text-[10px] text-on-surface-variant/40 mt-0.5">Konsultasi selesai akan tercatat di sini.</p>
                    </div>
                  ) : (
                    completedBookings.slice(0, 5).map(b => (
                      <Link key={b.id} href={`/booking/${b.id}`} className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/20 flex justify-between items-center group hover:bg-primary/5 transition-colors hover:border-primary/20">
                        <div>
                          <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{b.lawyerName}</p>
                          <p className="text-[10px] text-on-surface-variant mt-1 font-medium">{formatDate(b.createdAt)} • {b.status === 'completed' ? 'Selesai' : 'Dibatalkan'}</p>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                      </Link>
                    ))
                  )}
                </div>
              </section>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-white border-t border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-1 group">
                <Image 
                  src="/logo-icon.svg"
                  alt="Lexis Icon"
                  width={16}
                  height={16}
                  className="h-4 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-black tracking-tighter text-brand-blue opacity-50 group-hover:opacity-100">
                    LEXIS
                  </span>
                  <span className="text-[5.5px] font-bold tracking-[0.15em] text-outline uppercase opacity-40 group-hover:opacity-100">
                    Premium
                  </span>
                </div>
              </Link>
              <p className="text-[10px] text-on-surface-variant opacity-40 font-medium">
                © {new Date().getFullYear()} Lexis Premium Tech Center
              </p>
            </div>
            <div className="flex gap-5">
              <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/privacy">Privasi</Link>
              <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/terms">Syarat</Link>
              <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/support">Bantuan</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
