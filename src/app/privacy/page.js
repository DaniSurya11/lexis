"use client";

import { useEffect } from "react";

export default function PrivacyPage() {
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

  const sections = [
    {
      title: "1. Pendahuluan",
      content: "Selamat datang di Lexis Premium. Kebijakan ini menjelaskan bagaimana kami mengelola data Anda dengan standar keamanan perbankan."
    },
    {
      title: "2. Data Pribadi",
      content: "Kami hanya mengumpulkan data yang diperlukan untuk identitas (nama) dan kontak (email) guna keperluan konsultasi legal."
    },
    {
      title: "3. Penggunaan Data",
      content: "Data digunakan murni untuk operasional platform dan kepatuhan hukum tanpa intervensi pihak ketiga."
    },
    {
      title: "4. Keamanan",
      content: "Protokol SSL dan enkripsi AES-256 diterapkan untuk memastikan kedaulatan informasi Anda tetap terjaga."
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-body">
      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <h1 className="text-3xl font-black tracking-tight text-brand-blue mb-2 reveal">
            Kebijakan Privasi
        </h1>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mb-8 opacity-60 reveal" style={{ transitionDelay: '100ms' }}>
            Terakhir Update: 11 April 2026
        </p>

        <div className="grid gap-4">
            {sections.map((sec, idx) => (
                <div 
                    key={idx} 
                    className="bg-white p-6 rounded-2xl border border-outline-variant/20 reveal"
                    style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                >
                    <h2 className="text-base font-bold text-brand-blue mb-2">{sec.title}</h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed opacity-70">{sec.content}</p>
                </div>
            ))}
            
            <div 
                className="mt-4 p-6 bg-white border border-primary/10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 reveal"
                style={{ animationDelay: '700ms' }}
            >
                <p className="text-xs font-medium opacity-60 italic text-center md:text-left">
                    "Data Anda adalah kedaulatan Anda. Kami berkomitmen menjaganya."
                </p>
                <a href="mailto:privacy@lexispremium.com" className="text-xs font-bold text-primary hover:underline">
                    privacy@lexispremium.com
                </a>
            </div>
        </div>
      </main>
    </div>
  );
}
