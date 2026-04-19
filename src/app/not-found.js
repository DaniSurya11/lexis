import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan | Lexis Premium",
  description: "Maaf, halaman yang Anda cari tidak ditemukan di Lexis Premium.",
};

export default function NotFound() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-screen px-6 py-16 relative overflow-hidden bg-surface">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

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
          {/* Large 404 */}
          <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-outline-variant/20 select-none font-headline">
            404
          </div>
          {/* Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-outline-variant/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-5xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                search_off
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Ups! Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau URL yang Anda masukkan tidak tepat.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="button-shine bg-primary text-white px-8 py-4 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Kembali ke Beranda
          </Link>
          <Link
            href="/lawyers"
            className="bg-white text-on-surface border border-outline-variant/40 px-8 py-4 rounded-xl font-headline font-black text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">gavel</span>
            Cari Pengacara
          </Link>
        </div>

        {/* Quote */}
        <p className="mt-16 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em]">
          &ldquo;Hukum adalah fondasi keadilan&rdquo; — Lexis Premium
        </p>
      </div>
    </main>
  );
}
