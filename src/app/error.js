"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

/**
 * Error Boundary Page — Menangani runtime error dan crash halaman
 * Next.js secara otomatis menampilkan ini saat terjadi unhandled error
 */
export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // Log error ke monitoring service (contoh: Sentry)
    // Sentry.captureException(error);
    console.error("[Lexis Premium] Runtime Error:", error);
  }, [error]);

  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-screen px-6 py-16 relative overflow-hidden bg-surface">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-error/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
          <Image
            src="/logo-icon.svg"
            alt="Lexis Premium"
            width={32}
            height={32}
            className="h-8 w-auto transition-transform duration-500 group-hover:rotate-12"
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tighter text-brand-blue">LEXIS</span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-outline uppercase">Premium</span>
          </div>
        </Link>

        {/* Error Visual */}
        <div className="relative mb-8">
          <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-error/10 select-none font-headline">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-error/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-5xl text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-3">
          Terjadi Kesalahan Sistem
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-4 max-w-sm mx-auto">
          Tim teknis kami sedang menangani masalah ini. Mohon maaf atas ketidaknyamanan yang ditimbulkan.
        </p>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-8 p-4 bg-error/5 border border-error/20 rounded-xl text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-error mb-1">Debug Info</p>
            <code className="text-xs text-error/80 font-mono break-all">{error.message}</code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button
            onClick={reset}
            className="button-shine bg-primary text-white px-8 py-4 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Coba Lagi
          </button>
          <Link
            href="/"
            className="bg-white text-on-surface border border-outline-variant/40 px-8 py-4 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Ke Beranda
          </Link>
        </div>

        {/* Support link */}
        <p className="mt-10 text-xs text-on-surface-variant/60">
          Masalah terus berlanjut?{" "}
          <Link href="/support" className="text-primary font-bold hover:underline">
            Hubungi dukungan kami
          </Link>
        </p>
      </div>
    </main>
  );
}
