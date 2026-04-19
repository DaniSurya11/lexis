"use client";

import { useEffect } from "react";

export default function HowItWorksPage() {
  useEffect(() => {
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
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex-grow flex flex-col">
      {/* Ultra Compact Hero Header */}
      <header className="py-6 px-6 bg-surface-container-low w-full overflow-hidden border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto text-center reveal">
          <h1 className="text-xl md:text-2xl font-black text-brand-blue mb-2 font-headline tracking-tight leading-tight">
            Cara Kerja <span className="text-primary">Lexis Premium</span>
          </h1>
          <p className="text-on-surface-variant text-[0.8rem] leading-relaxed max-w-xl mx-auto font-body opacity-60">
            Panduan efisien untuk mendapatkan bantuan hukum profesional secara aman dan terverifikasi.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">

        {/* Section: UNTUK KLIEN */}
        <section className="reveal">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg font-black text-brand-blue tracking-[0.2em] font-headline uppercase">KLIEN</h2>
            <div className="h-px bg-outline-variant/20 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <div className="text-primary font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-60">Step 01</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Pilih Pengacara</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Cari advokat terverifikasi berdasarkan spesialisasi dan ulasan.</p>
            </div>
            {/* Step 2 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="material-symbols-outlined text-2xl">qr_code_2</span>
              </div>
              <div className="text-primary font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-60">Step 02</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Bayar Aman</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Pembayaran instan melalui sistem QRIS terenkripsi Lexis.</p>
            </div>
            {/* Step 3 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <div className="text-primary font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-60">Step 03</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Konsultasi</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Obrolan premium terenkripsi selama sesi yang ditentukan.</p>
            </div>
            {/* Step 4 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="material-symbols-outlined text-2xl">archive</span>
              </div>
              <div className="text-primary font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-60">Step 04</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Arsip Data</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Seluruh riwayat obrolan tersimpan untuk referensi hukum Anda.</p>
            </div>
          </div>
        </section>

        {/* Section: UNTUK PENGACARA */}
        <section className="reveal">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg font-black text-brand-blue tracking-[0.2em] font-headline uppercase">ADVOKAT</h2>
            <div className="h-px bg-outline-variant/20 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-brand-blue/30 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">assignment_ind</span>
              </div>
              <div className="text-brand-blue font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-30">Tahap 01</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Verifikasi</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Unggah lisensi resmi untuk melalui kurasi standar kami.</p>
            </div>
            {/* Step 2 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-brand-blue/30 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">schedule</span>
              </div>
              <div className="text-brand-blue font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-30">Tahap 02</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Presensi</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Atur jam online Anda untuk mulai menerima konsultasi.</p>
            </div>
            {/* Step 3 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-brand-blue/30 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">forum</span>
              </div>
              <div className="text-brand-blue font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-30">Tahap 03</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Konsultasi</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Berikan solusi hukum melalui dashboard interaktif.</p>
            </div>
            {/* Step 4 */}
            <div className="p-6 border border-outline-variant/20 rounded-xl bg-white hover:border-brand-blue/30 hover:shadow-xl transition-all duration-500 group reveal">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
              <div className="text-brand-blue font-black text-[9px] mb-2 uppercase tracking-[0.2em] opacity-30">Tahap 04</div>
              <h3 className="text-base font-bold text-brand-blue mb-2 leading-tight font-headline">Payout</h3>
              <p className="text-on-surface-variant/70 text-[0.8rem] font-body leading-relaxed">Terima honorarium transparan langsung ke akun Anda.</p>
            </div>
          </div>
        </section>

        {/* Minimalist Trust Features - MORE COMPACT */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-outline-variant/20 reveal">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-brand-blue font-headline">Privasi Premium</h4>
              <p className="text-[10px] text-on-surface-variant/60 font-body">AES-256 Encryption.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-brand-blue font-headline">Lisensi Resmi</h4>
              <p className="text-[10px] text-on-surface-variant/60 font-body">Advokat Terkurasi.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-brand-blue font-headline">Bayar Aman</h4>
              <p className="text-[10px] text-on-surface-variant/60 font-body">Transaksi Otomatis.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
