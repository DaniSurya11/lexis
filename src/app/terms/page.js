"use client";

import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const terms = [
    {
      title: "1. Penggunaan",
      content: "Akses Lexis Premium tunduk pada ketentuan ini. Platform menghubungkan klien dengan praktisi hukum profesional berlisensi."
    },
    {
      title: "2. Akun",
      content: "Pengguna bertanggung jawab penuh atas aktivitas akun. Pelanggaran kebijakan dapat mengakibatkan suspensi layanan."
    },
    {
      title: "3. Transaksi",
      content: "Semua pembayaran final dan diproses melalui sistem terenkripsi. Pembatalan mengikuti regulasi internal kami."
    },
    {
      title: "4. Hak Cipta",
      content: "Inovasi, teknologi, dan merk Lexis Premium dilindungi undang-undang. Reproduksi tanpa izin dilarang keras."
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-body">
      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12 w-full">
        <h1 className="text-3xl font-black tracking-tight text-brand-blue mb-2 reveal">
            Syarat & Ketentuan
        </h1>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mb-8 opacity-60 reveal" style={{ transitionDelay: '100ms' }}>
            Jurisdiksi: Jakarta, Indonesia
        </p>

        <div className="grid md:grid-cols-2 gap-4">
            {terms.map((term, index) => (
                <div 
                    key={index} 
                    className="bg-white p-6 rounded-2xl border border-outline-variant/20 reveal"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                    <h2 className="text-base font-bold text-brand-blue mb-2">{term.title}</h2>
                    <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">
                        {term.content}
                    </p>
                </div>
            ))}
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-center reveal" style={{ animationDelay: '600ms' }}>
            <p className="text-[10px] font-medium opacity-40">© 2026 Lexis Premium Legal Affairs</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Version 1.0.4</p>
        </div>
      </main>
    </div>
  );
}
