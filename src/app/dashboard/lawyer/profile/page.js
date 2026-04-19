"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ComingSoonAction from "@/components/ComingSoonAction";

export default function LawyerProfilePage() {
  const [formData, setFormData] = useState({
    name: "Panel Pengacara",
    role: "Senior Partner",
    bio: "Berpengalaman lebih dari 15 tahun dalam hukum korporasi dan transaksi lintas batas. Telah menangani berbagai kasus M&A dan restrukturisasi perusahaan besar di Asia Tenggara.",
    specialties: ["Hukum Korporasi", "M&A", "Arbitrase Internasional"],
    rate: "Rp 1.500.000 / Sesi",
    experience: "15+ Tahun",
    education: "Universitas Indonesia, S.H. | Harvard Law School, LL.M."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBlg7lzWm8ddUQWPDUVOsvt08nYElOWxGc4h6V21fcvOWaY6MZg5rbG0TtpeEs3N_EPZT6Ijc_It9KHu1Xcq3i-ZR-isSynhZGN_ZdfWBLU8CIb3EpG14kJSVbOLsb3xaVS893q6YFMe_8xwjyHgFGjgwoTN2VDvO_Vqx6DKowTT4mT5cp1DgEqRkPCSzHcECEtxuaJEeen9skllHYx6evMdErJ7b3uTHw4IO-yBmjchUF_qeqsBkRL9r9_KK_LZ7bmLnwz4te1NZM");
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface w-full font-body text-on-surface">
      {/* DashboardSidebar — Reusable with mobile support */}
      <DashboardSidebar role="lawyer" />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {isLoading ? (
            <div className="space-y-10 w-full">
              <div className="w-full h-64 rounded-3xl skeleton-shimmer border border-outline-variant/10 shadow-sm"></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-8">
                  <div className="w-full h-48 rounded-3xl skeleton-shimmer border border-outline-variant/10 shadow-sm"></div>
                  <div className="w-full h-48 rounded-3xl skeleton-shimmer border border-outline-variant/10 shadow-sm"></div>
                </div>
                <div className="md:col-span-4 space-y-8">
                  <div className="w-full h-64 rounded-3xl skeleton-shimmer border border-outline-variant/10 shadow-sm"></div>
                  <div className="w-full h-48 rounded-3xl skeleton-shimmer border border-outline-variant/10 shadow-sm"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Lawyer Header Card */}
              <section className="bg-white p-10 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative shrink-0">
               {/* Hidden file input */}
               <input
                 ref={fileInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleAvatarChange}
                 className="hidden"
                 aria-label="Upload foto profil pengacara"
               />
               <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-outline-variant/20">
                 <Image
                   alt="Foto profil pengacara"
                   className="w-full h-full object-cover"
                   src={avatarSrc}
                   width={160}
                   height={160}
                   unoptimized
                 />
               </div>
               <button
                 onClick={() => fileInputRef.current?.click()}
                 aria-label="Ganti foto profil"
                 className="absolute -bottom-3 -right-3 bg-white text-primary p-2.5 rounded-xl shadow-xl hover:scale-110 transition-all border border-outline-variant/20">
                 <span className="material-symbols-outlined text-lg" aria-hidden="true">photo_camera</span>
               </button>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left z-10">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl font-headline font-black text-on-surface tracking-tighter">{formData.name}</h1>
                  <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-tertiary/20">Verified Partner</span>
                </div>
                <p className="text-[#C5A059] font-black text-xs uppercase tracking-widest">{formData.role}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">work</span>
                  <span className="text-sm font-bold">{formData.experience} Pengalaman</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                  <span className="text-sm font-bold">Lisensi PERADI Aktif</span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center md:justify-start pt-4">
                 <button onClick={() => setIsEditing(!isEditing)} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10">
                   {isEditing ? "Simpan Profil" : "Edit Profil Profesional"}
                 </button>
                 <button className="bg-surface-container-high text-on-surface px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-outline-variant/20 transition-all">
                   Lihat Publik
                 </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left - Professional Content */}
            <div className="md:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Bio Profesional
                </h3>
                <textarea 
                  disabled={!isEditing}
                  rows={4}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:text-on-surface-variant/80"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-8 border-b border-outline-variant/10 pb-4">Kredensial & Pendidikan</h3>
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">school</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Pendidikan Formal</p>
                      <p className="text-sm font-bold">{formData.education}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">workspace_premium</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Sertifikasi</p>
                      <p className="text-sm font-bold">Audit Hukum Bersertifikat | Pejabat Perlindungan Data Bersertifikat</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">security</span>
                  Keamanan & Sandi
                </h3>
                <Link href="/dashboard/lawyer/profile/change-password" className="bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-on-surface-variant">lock_reset</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Ganti Kata Sandi</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Terakhir diperbarui 5 bulan lalu</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </section>
            </div>

            {/* Right - Stats & Rates */}
            <div className="md:col-span-4 space-y-8">
              <section className="bg-gradient-to-br from-brand-blue to-[#0d1624] p-8 rounded-3xl text-white shadow-xl shadow-primary/10 border-l-4 border-l-outline">
                <h3 className="text-xl font-headline font-black mb-8">Tarif Konsultasi</h3>
                <div className="space-y-6">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-2xl font-headline font-black text-outline">{formData.rate}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">Standard Chat/Video Session</p>
                   </div>
                   <button className="w-full bg-outline text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-outline/20">
                     Perbarui Tarif
                   </button>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6">Keahlian</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((tag, i) => (
                    <span key={i} className="bg-surface-container px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant border border-outline-variant/10">
                      {tag}
                    </span>
                  ))}
                  <button className="border-2 border-dashed border-outline-variant/50 text-outline-variant p-1 rounded-lg hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-sm font-black text-on-surface tracking-tight mb-4 uppercase">Statistik Profil</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      Rata-rata Rating
                    </span>
                    <span className="font-black text-on-surface">4.9 / 5.0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">group</span>
                      Klien Puas
                    </span>
                    <span className="font-black text-on-surface">342</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          </>
        )}
        </main>

        <footer className="mt-auto py-10 bg-white border-t border-outline-variant/10">
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
