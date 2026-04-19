"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

const FAQItem = ({ question, answer, index, isOpen, toggleOpen }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/20 transition-all reveal" style={{ transitionDelay: `${index * 80}ms` }}>
      <button 
        onClick={() => toggleOpen(index)}
        className="w-full flex justify-between items-center p-4 text-left cursor-pointer hover:bg-surface-container-low transition-colors outline-none"
      >
        <span className="font-bold text-on-surface text-[0.9rem]">{question}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-3 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-surface-container text-primary'}`}>
          <span className="material-symbols-outlined text-[0.9rem]">expand_more</span>
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-5 pt-0 text-on-surface-variant text-[0.85rem] leading-relaxed border-t border-surface-container-low mt-2">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const allFaqs = [
  {
    question: "Bagaimana cara membayar?",
    answer: "Pembayaran dapat dilakukan melalui QRIS, transfer bank virtual account, kartu kredit internasional, atau e-wallet resmi (GoPay, OVO). Seluruh transaksi dienkripsi dengan standar keamanan perbankan global.",
    category: "Pembayaran"
  },
  {
    question: "Berapa lama sesi chat berlangsung?",
    answer: "Setiap sesi konsultasi premium memiliki durasi standar hingga 3 jam di hari yang sama. Kami memastikan Anda memiliki waktu yang cukup untuk menjelaskan seluruh detail kronologi masalah hukum Anda.",
    category: "Konsultasi"
  },
  {
    question: "Apakah dokumen saya aman?",
    answer: "Keamanan data adalah identitas Lexis Premium. Semua dokumen disimpan dalam server terenkripsi AES-256 tingkat militer dan dilindungi oleh Non-Disclosure Agreement yang mengikat secara hukum.",
    category: "Privasi"
  },
  {
    question: "Kebijakan Pengembalian Dana?",
    answer: "Jika pengacara tidak online sesuai waktu yang ditentukan (melewati 15 menit), Anda berhak menukar pengacara atau mengajukan pengembalian dana 100% yang akan diproses dalam 1-3 hari kerja.",
    category: "Pembayaran"
  },
  {
    question: "Bagaimana cara memilih pengacara yang tepat?",
    answer: "Platform kami menyediakan filter berdasarkan spesialisasi (bisnis, pidana, perdata, ketenagakerjaan), kota, pengalaman, dan rating. Anda juga bisa membaca ulasan dari klien sebelumnya untuk memilih advokat yang paling sesuai.",
    category: "Konsultasi"
  },
  {
    question: "Apakah pengacara di Lexis sudah terverifikasi?",
    answer: "Ya. Setiap advokat melewati proses kurasi ketat: verifikasi lisensi resmi dari PERADI, pemeriksaan rekam jejak profesional, dan tes kompetensi platform sebelum bisa menerima klien.",
    category: "Advokat"
  },
  {
    question: "Bisakah saya konsultasi soal hukum bisnis?",
    answer: "Tentu. Lexis Premium memiliki jaringan advokat spesialis hukum bisnis, mulai dari pendirian PT, kontrak kerjasama, M&A, hingga sengketa komersial. Gunakan filter 'Bisnis' di halaman direktori.",
    category: "Hukum Bisnis"
  },
  {
    question: "Bagaimana jika masalah saya menyangkut hukum keluarga?",
    answer: "Kami memiliki advokat yang berspesialisasi di hukum keluarga, termasuk perceraian, hak asuh anak, warisan, dan perjanjian pra-nikah. Semua konsultasi bersifat rahasia dan tidak akan dibagikan ke pihak ketiga.",
    category: "Hukum Keluarga"
  },
  {
    question: "Apakah layanan Lexis tersedia untuk kasus pidana?",
    answer: "Ya. Advokat pidana di Lexis dapat memberikan konsultasi awal, analisis kasus, dan strategi pembelaan untuk berbagai perkara pidana umum maupun khusus. Untuk pendampingan persidangan, kami akan mereferensikan Anda ke advokat yang paling relevan.",
    category: "Pidana & Perdata"
  },
];

const categories = ["Semua", "Konsultasi", "Pembayaran", "Privasi", "Advokat", "Hukum Bisnis", "Hukum Keluarga", "Pidana & Perdata"];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
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

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchesCategory = activeCategory === "Semua" || faq.category === activeCategory;
      const matchesSearch = searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="pt-0 pb-12 flex-grow flex flex-col bg-white">
      {/* Ultra Compact Hero Section */}
      <header className="bg-surface-container-low/50 px-6 py-6 mb-6 border-b border-outline-variant/10 w-full overflow-hidden">
        <div className="max-w-4xl mx-auto text-center reveal">
          <h1 className="font-headline text-xl md:text-2xl font-black tracking-tight text-brand-blue mb-4">
            Bagaimana kami bisa membantu <span className="text-primary">Anda?</span>
          </h1>
          <div className="relative max-w-sm mx-auto rounded-lg overflow-hidden reveal">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[1rem] opacity-50">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant/30 rounded-lg focus:ring-1 focus:ring-primary/10 font-body text-xs placeholder:text-outline-variant/50 outline-none transition-all shadow-sm" 
              placeholder="Cari pertanyaan bantuan..." 
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(-1); }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Minimalist FAQ Content */}
        <section className="md:col-span-7 lg:col-span-8 space-y-10">

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 reveal">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(-1); }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-gray-100 text-on-surface-variant/60 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="reveal">
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant/10 pb-3">
              <h2 className="font-headline text-lg font-black text-brand-blue uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                {activeCategory === "Semua" ? "Semua Pertanyaan" : activeCategory}
              </h2>
              {(searchQuery || activeCategory !== "Semua") && (
                <span className="text-[10px] font-bold text-on-surface-variant/50">
                  {filteredFaqs.length} hasil
                </span>
              )}
            </div>
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <FAQItem 
                    key={index}
                    index={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    toggleOpen={toggleOpen}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-outline-variant/20">
                  <div className="w-14 h-14 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-2xl text-outline-variant/40">search_off</span>
                  </div>
                  <p className="font-bold text-brand-blue text-sm mb-1">Tidak ada hasil ditemukan</p>
                  <p className="text-xs text-on-surface-variant/50 mb-4 max-w-xs">Coba kata kunci lain atau pilih kategori berbeda.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveCategory("Semua"); }}
                    className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Minimalist Contact Card */}
        <aside className="md:col-span-5 lg:col-span-4 reveal">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-outline-variant/20 shadow-xl sticky top-24">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-headline text-2xl font-black text-brand-blue">Hubungi Kami</h2>
              <span className="bg-primary/5 text-primary text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Respon 24h</span>
            </div>
            
            <form className="space-y-4">
              <input 
                className="w-full bg-surface-container-low/30 border-none rounded-xl text-xs py-3 px-4 focus:ring-1 focus:ring-primary/10 outline-none" 
                placeholder="Nama Lengkap" 
                type="text" 
              />
              <input 
                className="w-full bg-surface-container-low/30 border-none rounded-xl text-xs py-3 px-4 focus:ring-1 focus:ring-primary/10 outline-none" 
                placeholder="Alamat Email" 
                type="email" 
              />
              <textarea 
                className="w-full bg-surface-container-low/30 border-none rounded-xl text-xs py-3 px-4 focus:ring-1 focus:ring-primary/10 outline-none resize-none" 
                placeholder="Apa yang bisa kami bantu?"
                rows="3"
              ></textarea>
              <button className="w-full mt-2 bg-primary text-white font-headline font-black py-4 px-6 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:opacity-90 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Kirim Pesan
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <p className="text-[10px] font-bold text-on-surface-variant text-center opacity-40">Lexis Premium Support Line 24/7</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
