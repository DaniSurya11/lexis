"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import HeroDashboardUI from "./HeroDashboardUI";

export default function HomeClient() {
  const [index, setIndex] = useState(0);
  const reviews = [
    {
      name: "Andi Pratama",
      role: "Direktur, Tech Ventures",
      text: "Layanan yang sangat profesional. Saya mendapatkan bantuan untuk kontrak bisnis saya dalam waktu kurang dari 24 jam dengan hasil memuaskan.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Maya Sari, S.H.",
      role: "Senior Associate",
      text: "Platform ini memudahkan saya sebagai pengacara untuk menjangkau klien yang benar-benar membutuhkan bantuan hukum berkualitas secara efisien.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Budi Santoso",
      role: "Founder, Retail Sinergi",
      text: "Efisiensi yang luar biasa. Saya tidak perlu lagi datang ke kantor hukum secara fisik. Semua urusan legalitas perusahaan saya selesai melalui platform ini.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Siska Wijaya",
      role: "Creative Director",
      text: "Sangat membantu untuk urusan HAKI dan kontrak kerja freelance. Penjelasannya mudah dimengerti bagi orang awam hukum seperti saya.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Reza Pahlevi",
      role: "HR Manager, Global Corp",
      text: "Sistem verifikasi lawyer di sini benar-benar terjamin. Saya merasa aman merekomendasikan layanan ini kepada rekan-rekan direksi saya.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getReview = (offset) => reviews[(index + offset) % reviews.length];

  return (
    <main className="flex-grow">
      <section className="relative py-20 lg:py-32 xl:py-40 bg-[var(--hero-bg)] text-[#f8f9fa] overflow-hidden min-h-screen flex items-center">
        {/* Abstract Background Deep Mesh */}
        <div className="absolute inset-0 bg-[#5D0E1F] overflow-hidden pointer-events-none">
          {/* Main Gradient Core (Smooth Maroon blending structurally like the reference image) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5D0E1F] via-[#921300] to-[#FAFAFA]" />
          
          {/* Subtle Light Slashes for 'Tech' depth like the reference waves */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] blur-3xl" />


        </div>

        <div className="max-w-7xl mx-auto w-full px-6 z-10 grid xl:grid-cols-2 gap-12 items-center pt-20 pb-10 lg:pb-20 xl:pt-0 xl:pb-0">
          
          {/* Column 1: High-Impact Tech Typography */}
          <div className="relative flex flex-col items-center text-center xl:items-start xl:text-left z-20 -mt-24 md:-mt-32 xl:-mt-52">
            {/* LOCALIZED TYPOGRAPHY GLOWING PULSES (Minimalist & Abstract) */}
            <div className="absolute inset-[-100px] pointer-events-none z-0 overflow-visible hidden xl:block mix-blend-screen">
               <svg className="w-full h-full overflow-visible" viewBox="0 0 600 500" fill="none">
                 <defs>
                   <linearGradient id="typo-glow-bright" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                   </linearGradient>
                   <filter id="typo-super-glow" x="-50%" y="-50%" width="200%" height="200%">
                      {/* Soft Ambient Bloom */}
                      <feGaussianBlur stdDeviation="5" result="blur1" />
                      {/* Balanced Core */}
                      <feGaussianBlur stdDeviation="2" result="blur2" />
                      <feMerge>
                         <feMergeNode in="blur1"/>
                         <feMergeNode in="blur2"/>
                         <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                 </defs>
                 <style>
                   {`
                     .typo-pulse {
                       stroke-dasharray: 150 2000;
                       animation: typo-flow 6s linear infinite forwards;
                     }
                     @keyframes typo-flow {
                       from { stroke-dashoffset: 2150; }
                       to { stroke-dashoffset: -150; }
                     }
                   `}
                 </style>
                 
                 {/* Structural Traces (Abstract, Left-to-Right & Top-to-Bottom) */}
                 <g stroke="white" opacity="0.15" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none">
                   {/* Track 1: Left to Right (Upper) */}
                   <path d="M -50 80 L 180 80 Q 200 80 200 100 L 200 150 Q 200 170 220 170 L 600 170" />
                   {/* Track 2: Left to Right (Lower) */}
                   <path d="M -50 360 L 250 360 Q 270 360 270 380 L 270 410 Q 270 430 290 430 L 650 430" />
                   {/* Track 3: Top to Bottom (Vertical Drop) */}
                   <path d="M 120 -50 L 120 180 Q 120 200 140 200 L 150 200 Q 170 200 170 220 L 170 550" />
                 </g>
                 
                 {/* Refined Neon Laser Pulses */}
                 <g filter="url(#typo-super-glow)" strokeLinecap="round" strokeLinejoin="round" fill="none">
                   {/* Left to Right Pulses */}
                   <path d="M -50 80 L 180 80 Q 200 80 200 100 L 200 150 Q 200 170 220 170 L 600 170" stroke="#ffffff" strokeWidth="2.5" className="typo-pulse" style={{ animationDelay: '0s', animationDuration: '5.5s' }} />
                   <path d="M -50 360 L 250 360 Q 270 360 270 380 L 270 410 Q 270 430 290 430 L 650 430" stroke="#ffffff" strokeWidth="2" className="typo-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
                   
                   {/* Top to Bottom Pulse */}
                   <path d="M 120 -50 L 120 180 Q 120 200 140 200 L 150 200 Q 170 200 170 220 L 170 550" stroke="#ffffff" strokeWidth="2.5" className="typo-pulse" style={{ animationDelay: '0.8s', animationDuration: '5s' }} />
                   
                   {/* Smooth Secondary Core Echoes */}
                   <path d="M -50 80 L 180 80 Q 200 80 200 100 L 200 150 Q 200 170 220 170 L 600 170" stroke="#ffffff" strokeWidth="1.5" className="typo-pulse" style={{ animationDelay: '3s', animationDuration: '4.8s' }} opacity="0.6" />
                   <path d="M 120 -50 L 120 180 Q 120 200 140 200 L 150 200 Q 170 200 170 220 L 170 550" stroke="#ffffff" strokeWidth="1.5" className="typo-pulse" style={{ animationDelay: '4.5s', animationDuration: '6.5s' }} opacity="0.6" />
                 </g>
               </svg>
            </div>

            <h1 className="relative z-10 font-headline text-4xl md:text-6xl xl:text-[72px] font-black tracking-tighter leading-[1.1] md:leading-[1.1] xl:leading-[0.95] text-white mb-6 xl:mb-8 drop-shadow-sm">
              Inovasi Hukum.<br />
              Keadilan Digital.<br />
              Tanpa Batas.
            </h1>
            
            <p className="relative z-10 text-white/80 font-body text-sm md:text-base leading-relaxed md:max-w-2xl xl:max-w-sm mb-10 font-bold mx-auto xl:mx-0">
              Platform hukum cerdas yang menyederhanakan akses keadilan melalui teknologi masa depan.
            </p>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
              <Link 
                href="/lawyers" 
                className="group relative bg-white text-[#921300] pl-8 pr-2.5 py-2.5 rounded-full text-[15px] font-bold tracking-wide transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.45)] flex items-center gap-5 hover:-translate-y-1 active:scale-95"
              >
                <span className="tracking-normal font-sans ml-1 text-[#921300]">Mulai Sekarang</span>
                <div className="w-10 h-10 rounded-full bg-[#921300] flex items-center justify-center text-white shadow-[0_4px_10px_rgba(146,19,0,0.2)] transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-105">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px] -translate-y-[1px]">
                      <path d="M7 17L17 7M17 7v9M17 7H8"/>
                   </svg>
                </div>
              </Link>
              <Link href="/how-it-works" className="text-white/50 text-xs font-bold hover:text-white/80 transition-colors flex items-center gap-1.5 group">
                <span>Atau pelajari cara kerja</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            {/* Modern Stats Cards */}
            <div className="relative z-10 flex flex-row items-center xl:items-start gap-2 md:gap-3 mt-10 w-full sm:w-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl px-2 md:px-6 py-3 md:py-4 text-center flex-1 md:min-w-[110px] md:flex-none shadow-lg">
                <p className="text-xl md:text-2xl font-black text-white font-headline tracking-tighter">120+</p>
                <p className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.1em] md:tracking-[0.2em] font-black mt-1">Advokat</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl px-2 md:px-6 py-3 md:py-4 text-center flex-1 md:min-w-[110px] md:flex-none shadow-lg">
                <p className="text-xl md:text-2xl font-black text-white font-headline tracking-tighter">4.9</p>
                <p className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.1em] md:tracking-[0.2em] font-black mt-1">Rating</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl px-2 md:px-6 py-3 md:py-4 text-center flex-1 md:min-w-[110px] md:flex-none shadow-lg">
                <p className="text-xl md:text-2xl font-black text-white font-headline tracking-tighter">98%</p>
                <p className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.1em] md:tracking-[0.2em] font-black mt-1">Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Column 2: Dashboard UI - STATIC */}
          <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] xl:min-h-[600px] flex items-center justify-center mt-6 xl:-mt-44 xl:pl-20">
             <div className="relative scale-[0.8] sm:scale-95 md:scale-100 xl:scale-100 origin-center xl:origin-left">
                <HeroDashboardUI />
             </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* =      UNIVERSAL UNIFIED LOWER UI ENVIRONMENT   = */}
      {/* ================================================= */}
      <div className="relative w-full bg-[#FAFAFA] overflow-visible pt-[1px] mt-[-1px] z-20">
        
        {/* Hero-to-Lower Blend Mask (Hides the sharp horizontal cut) */}
        <div className="absolute top-0 inset-x-0 h-[250px] -mt-[250px] bg-gradient-to-b from-transparent via-[#FAFAFA]/50 to-[#FAFAFA] pointer-events-none z-0" />
        
      {/* CARA KERJA: Premium Timeline Layout */}
      <section className="relative z-30 px-4 sm:px-6 lg:px-8 mt-10 lg:mt-[-150px] pb-12 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl overflow-hidden relative shadow-sm border border-gray-100">

          {/* Header */}
          <div className="relative z-10 px-8 lg:px-14 pt-12 pb-10 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#921300]/8 border border-[#921300]/10 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#921300]"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#921300]">Alur Sistem Terpadu</span>
                </div>
                <h2 className="font-headline text-2xl md:text-4xl font-black tracking-tight text-brand-blue">Cara Kerja Platform</h2>
              </div>
              <p className="text-on-surface-variant text-xs md:text-sm max-w-xs font-body leading-relaxed md:text-right opacity-60">
                Empat langkah transparan menuju solusi hukum Anda — ditenagai kecerdasan buatan.
              </p>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="px-8 lg:px-14 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              
              {/* Step 1 - Highlighted as active entry point */}
              <div className="group relative bg-[#921300]/5 hover:bg-[#921300]/10 border border-[#921300]/25 rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden ring-1 ring-[#921300]/20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#921300]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#921300] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(146,19,0,0.35)]">
                    <span className="text-white font-black text-[11px]">01</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#921300] flex items-center justify-center mb-4 transition-all duration-500 relative z-10">
                  <span className="material-symbols-outlined text-xl text-white" style={{fontVariationSettings:"'FILL' 1"}}>person_search</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#921300] mb-1 relative z-10">Mulai di sini</p>
                <h3 className="font-headline font-black text-base text-brand-blue mb-2 relative z-10">Pilih Pengacara</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-body opacity-60 group-hover:opacity-80 transition-opacity duration-500 relative z-10">Cari advokat terverifikasi berdasarkan spesialisasi dan ulasan.</p>
              </div>

              {/* Step 2 */}
              <div className="group relative bg-gray-50 hover:bg-[#921300]/5 border border-gray-100 hover:border-[#921300]/20 rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#921300]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-[#921300] flex items-center justify-center shrink-0 transition-all duration-500">
                    <span className="text-brand-blue group-hover:text-white font-black text-[11px] transition-colors duration-500">02</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 group-hover:bg-[#921300] flex items-center justify-center mb-4 transition-all duration-500 relative z-10">
                  <span className="material-symbols-outlined text-xl text-brand-blue group-hover:text-white transition-colors duration-500" style={{fontVariationSettings:"'FILL' 1"}}>qr_code_2</span>
                </div>
                <h3 className="font-headline font-black text-base text-brand-blue mb-2 relative z-10">Bayar Aman</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-body opacity-60 group-hover:opacity-80 transition-opacity duration-500 relative z-10">Pembayaran instan melalui sistem QRIS terenkripsi Lexis.</p>
              </div>

              {/* Step 3 */}
              <div className="group relative bg-gray-50 hover:bg-[#921300]/5 border border-gray-100 hover:border-[#921300]/20 rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#921300]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-[#921300] flex items-center justify-center shrink-0 transition-all duration-500">
                    <span className="text-brand-blue group-hover:text-white font-black text-[11px] transition-colors duration-500">03</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 group-hover:bg-[#921300] flex items-center justify-center mb-4 transition-all duration-500 relative z-10">
                  <span className="material-symbols-outlined text-xl text-brand-blue group-hover:text-white transition-colors duration-500" style={{fontVariationSettings:"'FILL' 1"}}>chat</span>
                </div>
                <h3 className="font-headline font-black text-base text-brand-blue mb-2 relative z-10">Konsultasi</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-body opacity-60 group-hover:opacity-80 transition-opacity duration-500 relative z-10">Obrolan premium terenkripsi selama sesi yang ditentukan.</p>
              </div>

              {/* Step 4 */}
              <div className="group relative bg-gray-50 hover:bg-[#921300]/5 border border-gray-100 hover:border-[#921300]/20 rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#921300]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-[#921300] flex items-center justify-center shrink-0 transition-all duration-500">
                    <span className="text-brand-blue group-hover:text-white font-black text-[11px] transition-colors duration-500">04</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 group-hover:bg-[#921300] flex items-center justify-center mb-4 transition-all duration-500 relative z-10">
                  <span className="material-symbols-outlined text-xl text-brand-blue group-hover:text-white transition-colors duration-500" style={{fontVariationSettings:"'FILL' 1"}}>archive</span>
                </div>
                <h3 className="font-headline font-black text-base text-brand-blue mb-2 relative z-10">Arsip Data</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed font-body opacity-60 group-hover:opacity-80 transition-opacity duration-500 relative z-10">Seluruh riwayat obrolan tersimpan untuk referensi hukum Anda.</p>
              </div>

            </div>
          </div>

          {/* Footer strip */}
          <div className="px-8 lg:px-14 py-5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] font-black opacity-30">Lexis Premium · Sistem Hukum Terpadu</p>
            <div className="flex gap-1">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-6 bg-[#921300]' : 'w-2 bg-gray-200'}`} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Shared Animation Styles for Minimalist UI */}
      <style>{`
        @keyframes mini-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-mini-float {
          animation: mini-float 4s ease-in-out infinite;
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fade-slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(146,19,0, 0.4); }
          70% { box-shadow: 0 0 0 25px rgba(146,19,0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(146,19,0, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }
        @keyframes pulse-ring-white {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255, 0.5); }
          70% { box-shadow: 0 0 0 30px rgba(255,255,255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255, 0); }
        }
        .animate-pulse-ring-white {
          animation: pulse-ring-white 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }
        .reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-left.active {
          opacity: 1;
          transform: translateX(0);
        }
        .reveal-right {
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-right.active {
          opacity: 1;
          transform: translateX(0);
        }
        .reveal-scale {
          opacity: 0;
          transform: scale(0.95) translateY(30px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-scale.active {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
      `}</style>

      {/* 2. Section: Mengapa Memilih Lexis - Minimalist Asymmetric Bento */}
      <section className="relative py-16 z-10 w-full bg-white reveal-left">
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-12 animate-fade-slide">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#921300]/10 border border-[#921300]/10 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#921300] animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#921300]">Integritas & Resolusi</span>
             </div>
             <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-brand-blue mb-3 leading-[1.1]">
                Redefinisi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#921300] to-[#ff4d4d]">Supremasi Legal.</span>
             </h2>
             <p className="max-w-2xl font-body text-base md:text-lg text-on-surface-variant font-medium opacity-70 leading-relaxed">
                Persenjataan hukum digital untuk mengeksekusi hak dengan presisi tak tertandingi.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[auto]">
            {/* Massive Card: Authority */}
            <div className="md:col-span-8 p-8 md:p-10 rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 reveal reveal-delay-1">
               <span className="absolute top-4 right-6 text-8xl font-headline font-black text-brand-blue/[0.03] leading-none select-none group-hover:scale-105 transition-transform duration-700">01</span>
               
               <div className="mb-12">
                 <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center shadow-md group-hover:bg-[#921300] transition-colors duration-500 relative z-10">
                   <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                 </div>
               </div>
               
               <div className="relative z-10 w-full">
                 <h3 className="text-2xl md:text-3xl font-headline font-black text-brand-blue mb-3">Otoritas Jaringan Spesifik</h3>
                 <p className="text-sm md:text-base text-on-surface-variant leading-relaxed opacity-80 font-medium max-w-xl">
                   Setiap pakar hukum dalam ekosistem Lexis dikurasi ketat untuk menjamin efektivitas manuver legal Anda.
                 </p>
               </div>
            </div>

            {/* Square Card: Privacy */}
            <div className="md:col-span-4 p-8 md:p-10 rounded-3xl bg-[#921300] text-white shadow-md flex flex-col items-center text-center justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 reveal reveal-delay-2">
               <span className="absolute -top-6 -left-4 text-8xl font-headline font-black text-white/10 leading-none select-none">02</span>
               <div className="relative z-10 mt-4">
                 <div className="w-14 h-14 mx-auto bg-white/10 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-5 relative">
                   <div className="absolute inset-0 border border-white/30 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                   <span className="material-symbols-outlined text-white text-2xl">enhanced_encryption</span>
                 </div>
                 <h3 className="text-xl md:text-2xl font-headline font-black mb-2">Brankas Data</h3>
                 <p className="text-white/80 text-sm leading-relaxed font-medium">
                   Enkripsi militer. Dokumen litigasi Anda kedap dari jejak peretas eksternal.
                 </p>
               </div>
            </div>

            {/* Horizontal Card: Review Flow */}
            <div className="md:col-span-12 p-8 md:p-8 rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden reveal reveal-delay-3">
               <span className="absolute -bottom-10 right-8 text-[120px] font-headline font-black text-brand-blue/[0.02] leading-none select-none">03</span>
               <div className="shrink-0 relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-gray-50 relative z-10 shadow-sm">
                     <Image alt="Testimonial" src={getReview(0).image} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#921300] text-white p-2 rounded-xl shadow-md z-20">
                     <span className="material-symbols-outlined text-lg">format_quote</span>
                  </div>
               </div>
               <div className="flex-1 relative z-10 text-center md:text-left">
                  <div className="flex justify-center md:justify-start gap-0.5 text-[#921300] mb-2">
                     {Array(5).fill(0).map((_, i) => (
                       <span key={i} className="material-symbols-outlined text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                     ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-body font-bold text-brand-blue mb-3 leading-snug italic opacity-90">
                    &quot;{getReview(0).text}&quot;
                  </h3>
                  <div>
                     <p className="text-sm font-black text-brand-blue mb-0.5">{getReview(0).name}</p>
                     <p className="text-xs font-bold text-[#921300] uppercase tracking-widest">{getReview(0).role}</p>
                  </div>
               </div>
               {/* Dot Indicators */}
               <div className="flex md:flex-col gap-1.5 shrink-0">
                 {reviews.map((_, i) => (
                   <button
                     key={i}
                     onClick={() => setIndex(i)}
                     className={`rounded-full transition-all duration-300 ${i === index ? 'w-6 h-1.5 md:w-1.5 md:h-6 bg-[#921300]' : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'}`}
                     aria-label={`Slide ${i + 1}`}
                   />
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Nilai Inti Lexis - Cinematic Interactive Rows (Large Text, Compact Gaps) */}
      <section className="relative py-8 md:py-12 z-10 w-full border-t border-gray-100 bg-[#FAFAFA] overflow-hidden reveal-right">
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
           
           <div className="mb-6 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="font-headline text-xl lg:text-2xl font-bold tracking-widest text-[#921300] uppercase mb-2 opacity-50">Struktur Fundamental</h2>
              <div className="w-16 h-1 bg-[#921300] mb-4" />
           </div>

           <div className="flex flex-col border-t-2 border-brand-blue/10">
             
             {/* Row 1 */}
             <div className="group flex flex-col lg:flex-row lg:items-center justify-between py-10 lg:py-12 border-b-2 border-brand-blue/10 hover:bg-brand-blue transition-all duration-700 cursor-pointer rounded-2xl -mx-4 md:-mx-6 px-4 md:px-6 relative overflow-hidden">
                {/* Hover Background Blend */}
                <div className="absolute top-0 right-0 h-full w-[400px] bg-[#921300] opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-1000 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-16 relative z-10">
                   <span className="text-5xl lg:text-7xl font-black text-brand-blue/20 group-hover:text-white/20 transition-colors duration-700">01</span>
                   <h3 className="text-4xl lg:text-5xl font-headline font-black text-brand-blue group-hover:text-white transition-colors duration-700">Skalabilitas Hukum</h3>
                </div>
                <div className="mt-8 lg:mt-0 flex-1 lg:max-w-xl lg:text-right flex items-center lg:justify-end gap-8 relative z-10">
                   <p className="text-lg text-on-surface-variant font-medium lg:translate-x-10 lg:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white/80 transition-all duration-700">
                      Dirancang untuk mendampingi evolusi bisnis Anda. Dari validasi kontrak awal hingga pendampingan akuisisi korporat berskala masif.
                   </p>
                   <div className="hidden lg:flex w-16 h-16 shrink-0 rounded-full bg-brand-blue/5 group-hover:bg-white items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg">
                      <span className="material-symbols-outlined text-brand-blue group-hover:text-[#921300] text-3xl transition-colors">arrow_forward</span>
                   </div>
                </div>
             </div>

             {/* Row 2 */}
             <div className="group flex flex-col lg:flex-row lg:items-center justify-between py-10 lg:py-12 border-b-2 border-brand-blue/10 hover:bg-[#921300] transition-all duration-700 cursor-pointer rounded-2xl -mx-4 md:-mx-6 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-[400px] bg-brand-blue opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-1000 pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-16 relative z-10">
                   <span className="text-5xl lg:text-7xl font-black text-brand-blue/20 group-hover:text-white/20 transition-colors duration-700">02</span>
                   <h3 className="text-4xl lg:text-5xl font-headline font-black text-brand-blue group-hover:text-white transition-colors duration-700">Transparansi Absolut</h3>
                </div>
                <div className="mt-8 lg:mt-0 flex-1 lg:max-w-xl lg:text-right flex items-center lg:justify-end gap-8 relative z-10">
                   <p className="text-lg text-on-surface-variant font-medium lg:translate-x-10 lg:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white/80 transition-all duration-700">
                      Sistem penagihan pintar tanpa bias. Anda mengendalikan penuh arsitektur biaya legal tanpa kejutan tagihan tersembunyi.
                   </p>
                   <div className="hidden lg:flex w-16 h-16 shrink-0 rounded-full bg-brand-blue/5 group-hover:bg-white items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg">
                      <span className="material-symbols-outlined text-brand-blue group-hover:text-brand-blue text-3xl transition-colors">arrow_forward</span>
                   </div>
                </div>
             </div>

             {/* Row 3 */}
             <div className="group flex flex-col lg:flex-row lg:items-center justify-between py-10 lg:py-12 border-b-2 border-brand-blue/10 hover:bg-brand-blue transition-all duration-700 cursor-pointer rounded-2xl -mx-4 md:-mx-6 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-[400px] bg-[#921300] opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-1000 pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-16 relative z-10">
                   <span className="text-5xl lg:text-7xl font-black text-brand-blue/20 group-hover:text-white/20 transition-colors duration-700">03</span>
                   <h3 className="text-4xl lg:text-5xl font-headline font-black text-brand-blue group-hover:text-white transition-colors duration-700">Intelijensi Prediktif</h3>
                </div>
                <div className="mt-8 lg:mt-0 flex-1 lg:max-w-xl lg:text-right flex items-center lg:justify-end gap-8 relative z-10">
                   <p className="text-lg text-on-surface-variant font-medium lg:translate-x-10 lg:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white/80 transition-all duration-700">
                      Mesin komputasi kami menganalisis ribuan preseden untuk merumuskan manuver litigasi paling optimal untuk Anda.
                   </p>
                   <div className="hidden lg:flex w-16 h-16 shrink-0 rounded-full bg-brand-blue/5 group-hover:bg-white items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg">
                      <span className="material-symbols-outlined text-brand-blue group-hover:text-[#921300] text-3xl transition-colors">arrow_forward</span>
                   </div>
                </div>
             </div>

           </div>
        </div>
      </section>

      {/* 4. Section: Final CTA - Cinematic Dark Aesthetic (Compact Size) */}
      <section className="relative py-12 md:py-16 flex flex-col items-center justify-center z-10 w-full px-6 overflow-hidden bg-brand-blue reveal-scale">
        {/* Animated Background Glow (Cinematic atmosphere) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-[#921300] blur-[100px] rounded-full opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-headline text-2xl md:text-4xl font-black tracking-tight text-white mb-3 leading-tight">
            Mulai Perjalanan Hukum Anda.
          </h2>
          <p className="text-white/60 font-body text-xs md:text-sm mb-8 font-semibold tracking-[0.3em] uppercase">
            Sederhana &middot; Presisi &middot; Tuntas
          </p>
          
          <Link 
            href="/lawyers" 
            className="group relative z-10 inline-flex items-center gap-4 bg-white text-brand-blue px-10 py-4 rounded-full font-bold text-[12px] md:text-[14px] uppercase tracking-widest transition-all hover:bg-white/90 hover:-translate-y-1 active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
          >
            <span>Konsultasi Sekarang</span>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-2">arrow_forward</span>
          </Link>
        </div>
      </section>
      </div>
    </main>
  );
}
