"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    setIsSubmitted(true);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 py-12 md:py-20 relative bg-surface">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-primary z-10 relative">
        <div className="px-8 pt-6 pb-0">
          <Link className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-[10px] font-extrabold uppercase tracking-widest" href="/login">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Login
          </Link>
        </div>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{fontVariationSettings: "'FILL' 0"}}>lock_reset</span>
                </div>
                <h2 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Lupa Kata Sandi?</h2>
                <p className="text-on-surface-variant text-sm mt-1">Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="email">Email Terdaftar</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary transition-all px-0 py-3 placeholder:text-outline/40 text-sm font-medium outline-none" 
                    id="email" 
                    placeholder="nama@email.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl active:scale-95 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 shadow-md flex items-center justify-center gap-2 uppercase tracking-widest text-xs" 
                  type="submit"
                >
                  <span>Kirim Instruksi</span>
                  <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                <span className="material-symbols-outlined text-4xl text-green-600" style={{fontVariationSettings: "'FILL' 1"}}>mark_email_read</span>
              </div>
              <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Email Terkirim!</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Kami telah mengirimkan tautan pemulihan kata sandi ke <span className="font-bold text-on-surface">{email}</span>. Mohon periksa kotak masuk atau spam Anda.
              </p>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
              >
                Kembali ke halaman login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center text-on-surface-variant/40 text-[9px] font-bold uppercase tracking-[0.4em]">
        Secure Authentication Gateway &bull; Lexis Premium
      </div>
      
      <div className="absolute top-0 w-full h-[50vh] bg-surface-container-low -z-0 border-b border-outline-variant/10"></div>
    </main>
  );
}
