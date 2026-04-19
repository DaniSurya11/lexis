"use client";

import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 py-4 relative min-h-0 overflow-hidden scale-[0.95] origin-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-outline-variant/20 z-10 relative">
        {/* Registration Portal Header */}
        <div className="p-10 pb-4 text-center">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-1.5 group shrink-0">
              <Image 
                src="/logo-icon.svg"
                alt="Lexis Icon"
                width={40}
                height={40}
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:rotate-12"
                priority
              />
              <div className="flex flex-col leading-none text-left">
                <span className="text-xl font-headline font-black tracking-tighter text-brand-blue">
                  LEXIS
                </span>
                <span className="text-[9px] font-headline font-black tracking-[0.2em] text-outline uppercase opacity-90">
                  Premium
                </span>
              </div>
            </Link>
          </div>
          <p className="text-on-surface-variant font-body text-xs font-medium opacity-60">Pilih jenis akun untuk mulai bergabung dengan kami.</p>
        </div>

        {/* Role Cards */}
        <div className="p-10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Option */}
          <Link href="/register/details" className="group">
            <div className="h-full p-8 rounded-2xl border-4 border-surface-container-highest hover:border-primary/30 hover:bg-primary/5 transition-all duration-500 flex flex-col items-center text-center shadow-sm hover:shadow-xl">
              <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-fixed transition-colors duration-500">
                <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors text-on-surface-variant duration-500">person</span>
              </div>
              <h3 className="font-headline font-black text-lg mb-2 group-hover:text-primary transition-colors duration-500">Buat Akun Klien</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-body font-medium">Daftar sebagai klien untuk akses konsultasi hukum eksklusif.</p>
              <div className="mt-4 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0 transform">
                <span>Daftar Sekarang</span>
                <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Lawyer Option */}
          <Link href="/register/lawyer" className="group">
            <div className="h-full p-8 rounded-2xl border-4 border-surface-container-highest hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all duration-500 flex flex-col items-center text-center shadow-sm hover:shadow-xl">
              <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 transition-colors duration-500">
                <span className="material-symbols-outlined text-2xl group-hover:text-brand-blue transition-colors text-on-surface-variant duration-500">gavel</span>
              </div>
              <h3 className="font-headline font-black text-lg mb-2 group-hover:text-brand-blue transition-colors duration-500">Pendaftar Advokat</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-body font-medium">Portal khusus untuk advokat profesional menawarkan keahlian.</p>
              <div className="mt-4 flex items-center gap-2 text-brand-blue font-black uppercase tracking-widest text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0 transform">
                <span>Daftar Sekarang</span>
                <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-10 py-8 text-center border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-medium">Sudah memiliki akun terdaftar? <Link href="/login" className="text-primary font-black hover:underline uppercase tracking-widest ml-1">Masuk Di Sini</Link></p>
        </div>
      </div>
      
      
      {/* Background Decorators */}
      <div className="absolute top-0 w-full h-[65vh] bg-surface-container-low -z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/4 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0 -translate-x-1/2"></div>
    </main>
  );
}
