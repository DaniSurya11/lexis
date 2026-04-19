"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ComingSoonAction from "@/components/ComingSoonAction";

export default function UserProfilePage() {
  const [formData, setFormData] = useState({
    name: "Julian",
    email: "julian@lexis.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    interests: ["Corporate Law", "Digital Property", "Venture Capital"]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCWlCtSg7SfE1nmkRnz5Gd67AR34YiyFumONQx0kShYfm-299M9SDgxdqfT9SvatbbkkqMffptBh6w_WeSInKunkJ8lGPpy9Ibpbk63QHvSBOSpEDcp4_F4X3oxckM_iwvtG49B3-DvCP139_7x3NRgJmRQ0osWqT6u6qTVzxoEGPxFYYKtSQVtGHjxdKLuAybXS67m8Jv7msHaT0S1eg_DI6n95AZe98-kgNOy3BfncI7ov9EAxUQ91G_sYvaR_Z3D7fCh4gZkmng");
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen bg-surface w-full">
      <DashboardSidebar role="client" />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Section */}
          <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative group">
            {/* Hidden file input for avatar */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload foto profil"
              />
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-primary/10 shadow-xl">
                <Image
                  alt="Foto profil pengguna"
                  className="w-full h-full object-cover"
                  src={avatarSrc}
                  width={128}
                  height={128}
                  unoptimized
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Ganti foto profil"
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-all border-4 border-white">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">edit</span>
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">{formData.name}</h1>
                <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-tertiary/20 shadow-sm shadow-tertiary/10">
                  Premium Member
                </span>
              </div>
              <p className="text-on-surface-variant font-medium opacity-70 mb-6 italic">Pengusaha & Investor Teknologi</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">mail</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">call</span>
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto flex gap-3">
               <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10"
               >
                 {isEditing ? "Simpan Perubahan" : "Edit Profil"}
               </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Details */}
            <div className="md:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-8 border-b border-outline-variant/10 pb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Informasi Pribadi
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Nama Lengkap</label>
                    <input 
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Alamat Email</label>
                    <input 
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.email} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Nomor Telepon</label>
                    <input 
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.phone} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Domisili</label>
                    <input 
                      disabled={!isEditing}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.address} 
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">security</span>
                  Keamanan & Sandi
                </h3>
                <Link href="/dashboard/profile/change-password" className="bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-on-surface-variant">lock_reset</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Ganti Kata Sandi</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Terakhir diperbarui 3 bulan lalu</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </section>
            </div>

            {/* Right Column - Preferences */}
            <div className="md:col-span-4 space-y-8">
              <section className="bg-gradient-to-br from-primary to-[#7a0f00] p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                   <span className="material-symbols-outlined text-8xl">military_tech</span>
                </div>
                <h3 className="text-xl font-headline font-black mb-6 relative z-10">Bidang Hukum Diminati</h3>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {formData.interests.map((tag, i) => (
                    <span key={i} className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                  <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <p className="mt-8 text-[10px] font-bold text-white/60 uppercase tracking-widest">Digunakan untuk personalisasi rekomendasi pengacara.</p>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm border-t-4 border-t-outline">
                <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6">Paket Langganan</h3>
                <div className="text-center py-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 mb-6">
                   <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Status Aktif</p>
                   <p className="text-2xl font-headline font-black text-primary tracking-tighter">LEXIS GOLD</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant">Berlaku hingga</span>
                    <span className="font-black text-on-surface">12 Des 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant">Kuota Menit</span>
                    <span className="font-black text-on-surface">120 / 300 Min</span>
                  </div>
                  <ComingSoonAction className="w-full mt-4 bg-surface-container-low hover:bg-surface-container-high text-primary font-black text-[10px] py-3 rounded-xl uppercase tracking-widest transition-all border border-outline-variant/30">
                    Kelola Langganan
                  </ComingSoonAction>
                </div>
              </section>
            </div>
          </div>
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
