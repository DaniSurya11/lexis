"use client";

import Link from "next/link";
import { lawyersData } from "@/data/lawyers";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import ConsultationButton from "./ConsultationButton";

export default function LawyerDetailPage() {
  const params = useParams();
  const lawyerId = parseInt(params.id);
  const lawyer = lawyersData.find(l => l.id === lawyerId);

  useEffect(() => {
    if (!lawyer) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [lawyer]);

  if (!lawyer) {
    notFound();
  }

  return (
    <main className="flex-grow pt-8 pb-32 md:pt-12 md:pb-16 max-w-7xl mx-auto px-6 md:px-8 w-full relative">
      
      {/* Breadcrumb / Back Button */}
      <div className="mb-6 reveal">
        <Link href="/lawyers" className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Daftar Pengacara
        </Link>
      </div>

      {/* Hero Profile Section */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row shadow-sm border border-outline-variant/30 relative reveal">
        {/* Left: Portrait */}
        <div className="w-full h-72 sm:h-80 md:h-auto md:w-[420px] relative shrink-0 reveal-left" style={{ animationDelay: '100ms' }}>
          <Image 
            className="w-full h-full object-cover object-top" 
            alt={`Foto Profil ${lawyer.name}`}
            src={lawyer.image}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm flex items-center justify-center border border-white/50">
              <span className="material-symbols-outlined text-[14px] text-blue-500" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-on-surface px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-sm">
            {lawyer.isOnline ? (
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 pulse-dot"></span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
            )}
            <span>{lawyer.status}</span>
          </div>
        </div>
        
        {/* Right: Info */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center reveal-right" style={{ animationDelay: '300ms' }}>
          <div className="space-y-1 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-blue tracking-tight leading-tight font-headline">{lawyer.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Spesialis {lawyer.specialty}</p>
              <div className="flex items-center gap-1 text-on-surface-variant/60 font-bold uppercase tracking-widest text-[10px]">
                <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                {lawyer.city}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-6">
              <div className="bg-white py-4 px-3 md:px-5 md:py-3 rounded-xl flex flex-col items-center border border-outline-variant/30 shadow-sm">
                <span className="text-2xl md:text-2xl font-black text-brand-blue font-headline">{lawyer.rating}<span className="text-sm">/5</span></span>
                <span className="text-[9px] md:text-[10px] text-center uppercase tracking-widest text-on-surface-variant font-bold mt-1">Rating Klien</span>
              </div>
              <div className="bg-white py-4 px-3 md:px-5 md:py-3 rounded-xl flex flex-col items-center border border-outline-variant/30 shadow-sm">
                <span className="text-2xl md:text-2xl font-black text-brand-blue font-headline">{lawyer.experience.split(' ')[0]}+</span>
                <span className="text-[9px] md:text-[10px] text-center uppercase tracking-widest text-on-surface-variant font-bold mt-1">Tahun Pengalaman</span>
              </div>
              <div className="bg-white py-4 px-3 md:px-5 md:py-3 rounded-xl flex flex-col items-center border border-outline-variant/30 shadow-sm col-span-2 md:col-span-1">
                <span className="text-2xl md:text-2xl font-black text-brand-blue font-headline">{lawyer.cases}</span>
                <span className="text-[9px] md:text-[10px] text-center uppercase tracking-widest text-on-surface-variant font-bold mt-1">Kasus Selesai</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-outline-variant/20 pt-8">
            <ConsultationButton lawyerId={lawyer.id} price={lawyer.price} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tentang */}
          <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal">
            <h2 className="text-xl font-extrabold text-brand-blue mb-4 flex items-center gap-3 font-headline border-b border-outline-variant/20 pb-4">
              <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>gavel</span> 
              Tentang & Pendekatan Hukum
            </h2>
            <div className="text-on-surface-variant leading-relaxed text-sm md:text-base max-w-[680px]">
              <p className="mb-4">{lawyer.about}</p>
            </div>
          </section>

          {/* Spesialisasi & Lisensi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal" style={{ transitionDelay: '100ms' }}>
              <h2 className="text-lg font-extrabold text-brand-blue mb-5 font-headline border-b border-outline-variant/20 pb-3">Area Spesialisasi</h2>
              <div className="flex flex-wrap gap-2.5">
                <span className="bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg text-[10px] font-black text-brand-blue uppercase tracking-widest">{lawyer.specialty}</span>
                <span className="bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg text-[10px] font-black text-brand-blue uppercase tracking-widest">Litigasi</span>
                <span className="bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg text-[10px] font-black text-brand-blue uppercase tracking-widest">Konsultasi</span>
              </div>
            </section>
            
            <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal" style={{ transitionDelay: '200ms' }}>
              <h2 className="text-lg font-extrabold text-brand-blue mb-5 font-headline border-b border-outline-variant/20 pb-3">Sertifikasi & Lisensi</h2>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <span className="material-symbols-outlined text-blue-600 text-lg" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-[10px] uppercase tracking-widest text-brand-blue">Anggota PERADI</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Lisensi Advokat Aktif</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <span className="material-symbols-outlined text-blue-600 text-lg" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-[10px] uppercase tracking-widest text-brand-blue">Mediator Nasional</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Akreditasi Mahkamah Agung RI</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          {/* Reviews Section */}
          <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-4">
              <h2 className="text-xl font-extrabold text-brand-blue font-headline tracking-tight">Ulasan Klien ({lawyer.reviews})</h2>
              <span className="text-primary font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-primary/20">Lihat Semua</span>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-surface-container-low/50 rounded-xl border border-outline-variant/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-extrabold text-brand-blue font-headline text-sm">Client Terverifikasi</span>
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-green-200">
                        <span className="material-symbols-outlined text-[10px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span> 
                        Terverifikasi
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">2 hari yang lalu</p>
                  </div>
                  <div className="flex text-outline -ml-1 sm:ml-0">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body italic">"Penanganan kasus sengketa dilakukan dengan sangat profesional dan transparan. Pendekatannya sangat memuaskan."</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          
          {/* Pendidikan Card */}
          <section className="bg-white p-8 rounded-2xl border border-outline-variant/30 shadow-sm border-t-4 border-t-brand-blue reveal">
            <h2 className="text-lg font-extrabold text-brand-blue mb-6 font-headline">Riwayat Pendidikan</h2>
            <ul className="space-y-5 relative border-l-2 border-outline-variant/30 pl-5 ml-2">
              {lawyer.educations.map((edu, index) => (
                <li key={index} className="relative">
                  <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${index === 0 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                  <p className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest mb-0.5">{edu.year}</p>
                  <p className="font-bold text-sm text-brand-blue">{edu.degree}</p>
                  <p className="text-xs text-on-surface-variant">{edu.university}</p>
                </li>
              ))}
            </ul>
          </section>
          
          {/* Map / Location */}
          <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4 reveal" style={{ transitionDelay: '100ms' }}>
            <h3 className="font-black text-brand-blue text-[10px] uppercase tracking-widest">Lokasi Kantor</h3>
            <div className="w-full h-40 bg-surface-container rounded-xl overflow-hidden relative shadow-inner">
              <Image 
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                alt="Kantor" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB5ZDklEgmGqP7WvPYZq4aVwRhwNb8bN_ll-G2u_2ofRczm0TpeblblIWkN6MglJuHwejE239oR3JHD_Ma-l9QCWPZF120PnkCulG69DUv90F6SkeLK5AJrFPWUecoYdGhiOgR6ikVPsKTVgeHCoA3MBMN6Qfjagndxer0WqwAv2eEQHBtnaGmj0Hr1iligEcAgcYTo5VJAMUBIZU_lM8GT47-mGcfe3-0okepiiUy9OvKhwcnM8MpX1wU1_wPx-YWUHQgwdDxbkQ"
                fill
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent flex items-end justify-center pb-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-blue">Lexis Hub {lawyer.city}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              {(() => {
                const officeLocation = {
                  'Jakarta': 'Sudirman Central Business District (SCBD), Treasury Tower Lt. 45, Jakarta Selatan.',
                  'Surabaya': 'Pakuwon Tower Lt. 12, Tunjungan Plaza 6, Jl. Embong Malang No. 21-31, Kota Surabaya.',
                  'Bandung': 'Graha Pos Indonesia Lt. 5, Jl. Banda No. 30, Citarum, Sumur Bandung, Kota Bandung.',
                  'Medan': 'Grand Jati Junction Lt. 9, Jl. Perintis Kemerdekaan No. 3, Kota Medan.',
                  'Tangerang': 'Foresta Business Loft 6 Lt. 2, BSD City, Pagedangan, Kabupaten Tangerang.',
                };
                return officeLocation[lawyer.city] || 'Gedung Pusat Bisnis Terpadu, Lt. 8, Area Pusat Kota.';
              })()}
            </p>
          </section>
          
          {/* Social/Contact Tools */}
          <section className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm reveal" style={{ transitionDelay: '200ms' }}>
            <div className="flex justify-around">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Profil Advokat: ${lawyer.name}`,
                      text: `Konsultasi dengan ${lawyer.name} di Lexis Premium`,
                      url: window.location.href,
                    }).catch(() => null);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Tautan profil berhasil disalin ke papan klip.");
                  }
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center group-hover:bg-brand-blue/5 transition-colors border border-outline-variant/30">
                  <span className="material-symbols-outlined text-brand-blue text-lg transition-transform group-hover:scale-110">share</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Bagikan</span>
              </button>
              <button 
                onClick={() => {
                  const saved = localStorage.getItem('saved_lawyers') ? JSON.parse(localStorage.getItem('saved_lawyers')) : [];
                  if (saved.includes(lawyer.id)) {
                    const filtered = saved.filter(id => id !== lawyer.id);
                    localStorage.setItem('saved_lawyers', JSON.stringify(filtered));
                    alert("Dihapus dari simpanan.");
                  } else {
                    saved.push(lawyer.id);
                    localStorage.setItem('saved_lawyers', JSON.stringify(saved));
                    alert("Profil berhasil disimpan ke Bookmark Anda.");
                  }
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center group-hover:bg-brand-blue/5 transition-colors border border-outline-variant/30">
                  <span className="material-symbols-outlined text-brand-blue text-lg transition-transform group-hover:scale-110">bookmark</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Simpan</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center group-hover:bg-brand-blue/5 transition-colors border border-outline-variant/30">
                  <span className="material-symbols-outlined text-brand-blue text-lg transition-transform group-hover:scale-110">print</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Cetak</span>
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Floating Sticky Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 z-[60] md:hidden">
        <ConsultationButton lawyerId={lawyer.id} isFloating={true} />
      </div>

    </main>
  );
}
