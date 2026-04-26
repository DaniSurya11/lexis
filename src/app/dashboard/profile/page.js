"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import ComingSoonAction from "@/components/ComingSoonAction";
import { createClient } from "@/lib/supabase";

export default function UserProfilePage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    interests: ["Hukum Perdata", "Properti Digital", "Venture Capital"]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuCWlCtSg7SfE1nmkRnz5Gd67AR34YiyFumONQx0kShYfm-299M9SDgxdqfT9SvatbbkkqMffptBh6w_WeSInKunkJ8lGPpy9Ibpbk63QHvSBOSpEDcp4_F4X3oxckM_iwvtG49B3-DvCP139_7x3NRgJmRQ0osWqT6u6qTVzxoEGPxFYYKtSQVtGHjxdKLuAybXS67m8Jv7msHaT0S1eg_DI6n95AZe98-kgNOy3BfncI7ov9EAxUQ91G_sYvaR_Z3D7fCh4gZkmng");
  const [userRole, setUserRole] = useState("client");
  const [userReviews, setUserReviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Cek apakah user adalah pengacara
        const { data: lawyerData } = await supabase
          .from('lawyers')
          .select('id')
          .eq('id', user.id)
          .single();
        if (lawyerData) {
          setUserRole("lawyer");
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setFormData({
          name: profile?.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: profile?.phone || "",
          address: profile?.city || "",
          avatar: profile?.avatar_url || "",
          interests: ["Hukum Perdata", "Properti Digital", "Venture Capital"]
        });

        if (profile?.avatar_url) setAvatarSrc(profile.avatar_url);

        // Fetch user reviews if client
        if (profile?.role === 'client') {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('*, lawyers(full_name)')
            .eq('client_id', user.id)
            .order('created_at', { ascending: false });
          setUserReviews(reviews || []);
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        id: user.id,
        full_name: formData.name,
        phone: formData.phone,
        city: formData.address,
        updated_at: new Date()
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      setIsEditing(false);
    } catch (e) {
      console.error("Error saving profile:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>

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
                  {userRole === 'lawyer' ? 'Advokat Partner' : 'Member Premium'}
                </span>
              </div>
              <p className="text-on-surface-variant font-medium opacity-70 mb-6 italic">
                {formData.address ? `${formData.address}` : "Lokasi belum diatur"}
              </p>
              
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
                 onClick={handleEditToggle}
                 disabled={isSaving}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10 disabled:opacity-50"
               >
                 {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Edit Profil"}
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
                      name="phone"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.phone} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Domisili</label>
                    <input 
                      disabled={!isEditing}
                      name="address"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-70" 
                      value={formData.address} 
                      onChange={handleChange}
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

              {userRole === 'lawyer' ? (
                <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm border-t-4 border-t-primary">
                  <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6">Jadwal Kerja</h3>
                  <div className="text-center py-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 mb-6 flex flex-col items-center">
                     <span className="material-symbols-outlined text-4xl text-primary mb-2">event_available</span>
                     <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Status Ketersediaan</p>
                     <p className="text-xl font-headline font-black text-primary tracking-tighter">AKTIF</p>
                  </div>
                  <Link href="/dashboard/lawyer/schedule" className="block w-full text-center bg-primary text-white font-black text-[10px] py-3 rounded-xl uppercase tracking-widest transition-all hover:bg-primary-container hover:scale-[1.02] shadow-sm hover:shadow">
                    Atur Jadwal
                  </Link>
                </section>
              ) : (
                <section className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm border-t-4 border-t-tertiary">
                  <h3 className="text-xl font-headline font-black text-on-surface tracking-tight mb-6 flex items-center justify-between">
                    Riwayat Ulasan
                    <span className="bg-tertiary/10 text-tertiary text-[10px] px-2 py-0.5 rounded-full">{userReviews.length}</span>
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {userReviews.length === 0 ? (
                      <div className="text-center py-8 bg-surface-container-low rounded-2xl border border-dotted border-outline-variant/30">
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2">rate_review</span>
                        <p className="text-[10px] font-bold text-on-surface-variant italic">Belum ada ulasan yang diberikan</p>
                      </div>
                    ) : (
                      userReviews.map((rev, i) => (
                        <div key={i} className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black uppercase text-on-surface tracking-wide truncate max-w-[120px]">
                              {rev.lawyers?.full_name || "Advokat"}
                            </p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, star) => (
                                <span key={star} className={`material-symbols-outlined text-[10px] ${star < rev.rating ? 'text-amber-500' : 'text-outline/30'}`} style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-on-surface-variant italic line-clamp-2 leading-relaxed">"{rev.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}
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
    </>
  );
}
