"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useConsultation } from "@/context/ConsultationContext";

export default function LawyerDashboardPage() {
  const router = useRouter();
  const { bookings, sessions, acceptBooking, rejectBooking, startSession, endSession, syncFromStorage, reloadBookings } = useConsultation();
  const [processingId, setProcessingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Hydration Guard + Immediate sync dari localStorage saat mount
  useEffect(() => {
    setMounted(true);
    if (reloadBookings) reloadBookings(); // Paksa sinkronisasi data saat pertama kali buka dashboard
  }, [reloadBookings]);

  // Jika belum mounted (SSR), return null untuk menghindari hydration error
  if (!mounted) return null;

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');
  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleAction = async (id, actionFn) => {
    setProcessingId(id);
    // Simulate slight delay for professional feel
    await new Promise(resolve => setTimeout(resolve, 600));
    actionFn(id);
    setProcessingId(null);
  };

  const handleEndSession = async (sessionId) => {
    setProcessingId(sessionId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    endSession(sessionId);
    // Give context a moment to propagate state to localStorage
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/session-ended/${sessionId}`);
    setProcessingId(null);
  };

  // Helper
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  return (
    <div className="flex min-h-screen bg-surface w-full font-body text-on-surface">
      {/* DashboardSidebar — Reusable with mobile support */}
      <DashboardSidebar role="lawyer" />

      {/* Main Content Area */}
      <main className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-surface/80 backdrop-blur-md font-headline tracking-tight font-bold top-0 sticky z-30 border-b border-outline-variant/30 mt-14 md:mt-0">
          <div className="flex justify-between items-center w-full px-8 py-4">
            <div className="flex items-center gap-8">
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
              <div className="hidden md:flex relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input className="bg-surface-container-low border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Cari kasus atau klien..." type="text"/>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors relative" aria-label="Notifikasi">
                  <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
                  {pendingBookings.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-bounce" aria-label="Ada booking baru"></span>
                  )}
                </button>
                <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" aria-label="Pengaturan">
                  <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                </button>
              </div>
              <div className="flex items-center gap-4 pl-6 border-l border-outline-variant/30">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-extrabold text-on-surface">Panel Pengacara</p>
                  <p className="text-[9px] text-tertiary-container bg-tertiary-fixed/50 px-2 py-0.5 rounded uppercase tracking-widest font-black inline-block mt-0.5">Senior Partner</p>
                </div>
                <Image 
                  alt="Foto profil pengacara" 
                  className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-outline-variant/50" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlg7lzWm8ddUQWPDUVOsvt08nYElOWxGc4h6V21fcvOWaY6MZg5rbG0TtpeEs3N_EPZT6Ijc_It9KHu1Xcq3i-ZR-isSynhZGN_ZdfWBLU8CIb3EpG14kJSVbOLsb3xaVS893q6YFMe_8xwjyHgFGjgwoTN2VDvO_Vqx6DKowTT4mT5cp1DgEqRkPCSzHcECEtxuaJEeen9skllHYx6evMdErJ7b3uTHw4IO-yBmjchUF_qeqsBkRL9r9_KK_LZ7bmLnwz4te1NZM"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-outline-variant/30 via-outline-variant/10 to-transparent h-px w-full"></div>
        </header>

        <div className="p-8 space-y-10 max-w-7xl mx-auto w-full">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 border-l-4 border-l-primary-container shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">Permintaan Kasus</p>
              <h3 className="text-4xl font-headline font-black text-primary-container">{pendingBookings.length}</h3>
              <div className="mt-4 flex items-center text-[11px] text-tertiary font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>notifications_active</span>
                <span>Butuh persetujuan</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-tertiary to-[#001466] p-6 rounded-2xl border-l-4 border-l-[#bbc3ff] shadow-lg shadow-tertiary/20 text-white relative overflow-hidden transform hover:scale-[1.02] transition-transform">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
                <span className="material-symbols-outlined text-8xl">group</span>
              </div>
              <p className="text-[10px] font-extrabold text-[#bbc3ff] uppercase tracking-widest mb-2 relative z-10">Sesi Aktif</p>
              <h3 className="text-4xl font-headline font-black relative z-10">{activeSessions.length}</h3>
              <p className="mt-4 text-[11px] text-[#bbc3ff] font-bold relative z-10">Sedang berlangsung</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 border-l-4 border-l-outline shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">Sesi Selesai (Bulan Ini)</p>
              <h3 className="text-4xl font-headline font-black text-on-surface">{completedBookings.length}</h3>
              <p className="mt-4 text-[11px] text-on-surface-variant font-bold">Total arsip kasus terjawab</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1b1c1c] to-[#303030] p-6 rounded-2xl border-l-4 border-l-primary shadow-lg text-white">
              <p className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest mb-2">Total Pendapatan</p>
              <h3 className="text-2xl font-headline font-black">Rp {(completedBookings.length * 500000).toLocaleString('id-ID')}</h3>
              <div className="mt-4 flex items-center text-[11px] text-primary-fixed-dim font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>
                <span>Payout otomatis</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              
              {/* Sesi Aktif List */}
              <section className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                  <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">Ruang Sesi Aktif</h2>
                </div>
                
                <div className="space-y-4">
                  {activeSessions.length === 0 ? (
                    <div className="bg-surface-container-low/50 p-12 rounded-3xl border-2 border-outline-variant/20 border-dashed flex flex-col items-center justify-center text-center group transition-all">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">chat_bubble_outline</span>
                      </div>
                      <h4 className="font-bold text-on-surface text-base">Tidak ada sesi aktif</h4>
                      <p className="text-xs text-on-surface-variant max-w-[280px] mt-1.5 leading-relaxed">Saat ini belum ada sesi konsultasi yang sedang berlangsung dengan klien.</p>
                    </div>
                  ) : (
                    activeSessions.map((session) => {
                      const sessionBooking = bookings.find(b => b.id === session.bookingId);
                      if (!sessionBooking) return null;

                      return (
                        <div key={session.id} className="bg-white p-6 rounded-2xl border border-tertiary/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-tertiary transition-all hover:scale-[1.01]">
                          <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                              <Image alt="Foto profil klien" className="w-14 h-14 rounded-full object-cover ring-2 ring-outline-variant/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-eMz0D6ySZRRlwRdZE3UsCJrxAFeCFC909DkY60HTQN4ZlYKjBTBX0kT3e9N2jziji642EqUnCNnNCaFckBMWfKhsEv4xsrdGjSAEMEC8BHnWfIJBY4Tz8TVCPo_yw0g5G9eayCoif2dy6XSgasNTtzSEYNOhzu_ahZNDhC4OzqemLX_i0mfbqT7AsiSINkrBsyDi0NwzJzsw7UxkaDbatDRIxYXE-SxCt9ZTQYL9vosc-jmXNxXBwqXdLqie6Z2E8pEV0H6QJZk" width={56} height={56} unoptimized/>
                              <span className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary border-2 border-white rounded-full animate-pulse" aria-label="Online"></span>
                            </div>
                            <div>
                              <h4 className="font-headline font-extrabold text-lg text-on-surface leading-tight tracking-tight mb-1">
                                Klien ({sessionBooking.id.slice(-4)})
                              </h4>
                              <p className="text-xs text-on-surface-variant font-medium">{sessionBooking.topic} • <span className="text-tertiary font-bold uppercase tracking-widest text-[9px]">Online</span></p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                              disabled={processingId === session.id}
                              onClick={() => handleEndSession(session.id)}
                              className="w-full md:w-auto border border-error text-error hover:bg-error hover:text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-sm uppercase tracking-widest whitespace-nowrap active:scale-95 disabled:opacity-50"
                            >
                              {processingId === session.id ? 'Memproses...' : 'Akhiri Konsultasi'}
                            </button>
                            <Link href={`/chat/${sessionBooking.lawyerId}`} className="w-full md:w-auto bg-tertiary text-white hover:bg-[#20368a] px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-sm uppercase tracking-widest whitespace-nowrap text-center active:scale-95 hover:shadow-lg">
                              Masuk Ruang
                            </Link>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </section>

              {/* Antrean Sesi (Accepted Bookings) */}
              {acceptedBookings.length > 0 && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                    <h2 className="text-lg font-headline font-extrabold text-on-surface tracking-tight flex items-center gap-2">
                       Menunggu Dimulai 
                       <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{acceptedBookings.length}</span>
                    </h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {acceptedBookings.map(b => (
                      <div key={b.id} className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/30 transition-all">
                        <div className="flex gap-4 items-center">
                           <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center font-bold rounded-lg border border-primary/20">
                              CL
                           </div>
                           <div>
                              <p className="font-extrabold text-sm">Booking #{b.id.slice(-6)}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">{b.topic} • {formatDate(b.createdAt)}</p>
                           </div>
                        </div>
                        <button 
                          disabled={processingId === b.id}
                          onClick={() => handleAction(b.id, startSession)}
                          className="bg-primary hover:bg-primary-container text-white text-xs font-bold py-2.5 px-6 rounded-lg uppercase tracking-widest shadow-sm active:scale-95 transition-all w-full md:w-auto disabled:opacity-50"
                        >
                          {processingId === b.id ? 'Memulai Sesi...' : 'Mulai Sesi'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Booking Masuk */}
              <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm border-t-4 border-t-primary animate-in fade-in slide-in-from-right-6 duration-700 delay-450 fill-mode-both">
                <h2 className="text-lg font-headline font-extrabold text-on-surface mb-5 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
                  Booking Baru Masuk
                  {pendingBookings.length > 0 && <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full ml-auto animate-pulse">{pendingBookings.length} Baru</span>}
                </h2>
                
                <div className="space-y-4">
                  {pendingBookings.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                      <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                      <p className="text-xs font-bold uppercase tracking-widest">Belum ada booking masuk</p>
                    </div>
                  ) : (
                    pendingBookings.map(b => (
                      <div key={b.id} className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-4 border border-outline-variant/10 hover:border-outline-variant/30 transition-all">
                        <div className="flex items-start gap-3">
                           <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant border border-outline-variant/20">
                             CL
                           </div>
                           <div>
                             <h5 className="font-extrabold text-sm text-on-surface leading-tight">Client ({b.id.slice(-4)})</h5>
                             <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 truncate max-w-[150px]">{b.topic}</p>
                             <p className="text-[9px] text-on-surface-variant/70 mt-1">{formatDate(b.createdAt, { hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <button 
                            disabled={processingId === b.id}
                            onClick={() => handleAction(b.id, rejectBooking)}
                            className="border border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error/5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                          >
                            Tolak
                          </button>
                          <button 
                            disabled={processingId === b.id}
                            onClick={() => handleAction(b.id, acceptBooking)}
                            className="bg-primary text-white py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-all uppercase tracking-widest shadow-sm active:scale-95 disabled:opacity-50 text-center flex items-center justify-center"
                          >
                            {processingId === b.id ? (
                               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Terima'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Quick Riwayat */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl space-y-6 border border-outline-variant/30 shadow-sm border-t-4 border-t-outline-variant animate-in fade-in slide-in-from-right-6 duration-700 delay-500 fill-mode-both">
                <div className="pb-3 border-b border-outline-variant/20">
                  <h2 className="text-lg font-headline font-extrabold text-on-surface mb-1">Riwayat Konsultasi</h2>
                </div>
                <div className="space-y-3">
                  {completedBookings.length === 0 ? (
                    <div className="text-center py-6 opacity-30">
                       <span className="material-symbols-outlined text-3xl mb-1">history</span>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada riwayat</p>
                    </div>
                  ) : (
                    completedBookings.slice(0, 4).map(b => (
                      <div key={b.id} className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 text-xs hover:border-primary/20 transition-all cursor-default text-ellipsis overflow-hidden">
                        <p className="font-bold text-on-surface mb-1 truncate">Kasus ({b.id.slice(-6)})</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{formatDate(b.createdAt)} • Selesai</p>
                      </div>
                    ))
                  )}
                  {completedBookings.length > 4 && (
                    <button className="w-full text-xs text-primary font-bold hover:underline mt-2">Lihat Seluruhnya</button>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>

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
      </main>
    </div>
  );
}
