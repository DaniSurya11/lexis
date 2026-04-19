"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function LawyerChangePasswordPage() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen bg-surface w-full font-body text-on-surface">
      <DashboardSidebar role="lawyer" />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 pt-16 md:pt-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/lawyer/profile" className="w-10 h-10 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">Perbarui Keamanan</h1>
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-1 italic">Proteksi Akun Profesional</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-xl overflow-hidden border-t-4 border-t-primary">
             {!success ? (
               <div className="p-10">
                 <form className="space-y-8 max-w-lg" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Kata Sandi Saat Ini</label>
                       <div className="relative">
                         <input 
                           type="password" 
                           placeholder="••••••••"
                           className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                           required
                         />
                         <span className="material-symbols-outlined absolute right-5 top-4 text-on-surface-variant opacity-40 hover:opacity-100 cursor-pointer">visibility</span>
                       </div>
                    </div>

                    <div className="h-px bg-outline-variant/10 w-full"></div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Kata Sandi Baru yang Aman</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Konfirmasi Kata Sandi Baru</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 text-center md:text-left">
                      <button type="submit" className="w-full md:w-auto bg-primary text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-container active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Perbarui Kredensial
                      </button>
                    </div>
                 </form>
               </div>
             ) : (
               <div className="p-16 text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
                    <span className="material-symbols-outlined text-5xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                  </div>
                  <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-4">Sandi Berhasil Diubah</h2>
                  <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed mb-10 text-sm">
                    Kredensial akun pengacara Anda telah diperbarui secara aman. Silakan gunakan kata sandi baru untuk masuk di masa mendatang.
                  </p>
                  <Link href="/dashboard/lawyer/profile" className="bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg active:scale-95">
                    Kembali ke Profil
                  </Link>
               </div>
             )}
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border-l-4 border-l-tertiary border border-outline-variant/20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-tertiary/5 flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-tertiary text-3xl">shield_person</span>
            </div>
            <div>
               <p className="text-sm font-black text-brand-blue mb-1">Standar Keamanan Lexis Premium</p>
               <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">
                 Sebagai partner ahli, keamanan akun Anda sangat krusial. Kami merekomendasikan penggantian kata sandi secara berkala setiap 6 bulan untuk menjaga integritas data klien Anda yang terenkripsi.
               </p>
            </div>
          </div>
        </main>

        <footer className="mt-auto py-10 bg-white border-t border-outline-variant/10 text-center">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">Lawyer Security Node &bull; Lexis Premium Tech &bull; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
