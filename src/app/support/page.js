"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SupportPage() {
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

  const faqs = [
    {
      q: "Cara memesan konsultasi?",
      a: "Masuk ke dashboard, pilih 'Konsultasi Baru', tentukan pengacara dan jadwal."
    },
    {
      q: "Biaya konsultasi?",
      a: "Tarif bervariasi per pengacara. Cek profil untuk detail tarif."
    },
    {
      q: "Keamanan data?",
      a: "Enkripsi AES-256 melindungi seluruh data dan riwayat chat Anda."
    },
    {
      q: "Metode pembayaran?",
      a: "Mendukung Bank Transfer, QRIS, dan E-Wallet."
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-body">
      <main className="max-w-5xl mx-auto px-6 py-8 md:py-12 w-full">
        {/* Compact Hero */}
        <div className="mb-10 bg-white p-8 rounded-3xl border border-outline-variant/30 relative overflow-hidden shadow-sm reveal">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="max-w-lg">
                    <div className="flex items-center gap-1.5 mb-4 opacity-60">
                        <Image src="/logo-icon.svg" alt="Icon" width={20} height={20} className="h-5 w-auto" />
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Bantuan</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-brand-blue mb-3 leading-tight">
                        Apa yang bisa kami bantu?
                    </h1>
                    <p className="text-on-surface-variant text-sm font-medium opacity-70 mb-6">
                        Tim Lexis Premium siap mendampingi Anda mencari solusi hukum terbaik.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="mailto:support@lexispremium.com" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90">
                            Email Kami
                        </a>
                        <a href="#" className="bg-white border border-outline-variant text-brand-blue px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:bg-surface">
                            WhatsApp
                        </a>
                    </div>
                </div>
                <div className="hidden md:block">
                     <span className="material-symbols-outlined text-7xl text-primary opacity-10">support_agent</span>
                </div>
            </div>
        </div>

        {/* FAQ Tighter Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
            {faqs.map((faq, index) => (
                <div 
                    key={index} 
                    className="bg-white p-6 rounded-2xl border border-outline-variant/20 reveal"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                    <h3 className="text-base font-bold text-brand-blue mb-1.5">{faq.q}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">{faq.a}</p>
                </div>
            ))}
        </div>

        {/* Compact Footer Note */}
        <div className="text-center py-4 border-t border-outline-variant/20 reveal" style={{ animationDelay: '500ms' }}>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-30">
                Lexis Premium Center — Jakarta
            </p>
        </div>
      </main>
    </div>
  );
}
