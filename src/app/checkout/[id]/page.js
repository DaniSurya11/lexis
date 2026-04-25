"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientPaymentFlow from "./ClientPaymentFlow";
import { createClient } from "@/lib/supabase";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [lawyer, setLawyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const { data, error } = await supabase
          .from('lawyers')
          .select(`
            *,
            profiles(full_name, avatar_url, city)
          `)
          .eq('id', params.id)
          .single();

        if (error || !data) {
          setLawyer(null);
        } else {
          setLawyer({
            id: data.id,
            name: data.profiles.full_name,
            specialty: data.specialization,
            image: data.profiles.avatar_url || "https://via.placeholder.com/150",
            price: data.price_per_hour?.toLocaleString('id-ID') || "0",
          });
        }
      } catch (err) {
        console.error("Error fetching lawyer for checkout:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyer();
  }, [params.id, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-primary animate-spin"></div>
          <p className="text-on-surface-variant text-sm font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">person_off</span>
          <p className="text-on-surface-variant text-sm font-medium">Pengacara tidak ditemukan</p>
          <Link href="/lawyers" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Kembali ke Daftar</Link>
        </div>
      </div>
    );
  }

  const basePrice = parseInt(lawyer.price.replace(/\./g, ""));
  const adminFee = 5000;
  const totalPrice = basePrice + adminFee;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 bg-stone-50 min-h-[calc(100vh-80px)]">
      {/* Payment Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] border-t-4 border-primary overflow-hidden">
        
        {/* Header: Back Link */}
        <div className="px-8 pt-6 pb-0">
          <Link
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
            href={`/lawyers/${lawyer.id}`}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Profil
          </Link>
        </div>

        {/* Title Section */}
        <div className="px-8 pt-6 pb-4">
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">
            Konfirmasi Pembayaran
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Periksa detail konsultasi sebelum melanjutkan pembayaran.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="px-8 py-4 bg-stone-50 border-y border-stone-100">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] flex items-center justify-center font-bold">1</div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Booking</span>
            </div>
            <div className="h-px w-8 bg-surface-container-high"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pembayaran</span>
            </div>
            <div className="h-px w-8 bg-surface-container-high"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] flex items-center justify-center font-bold">3</div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Selesai</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Detail Konsultasi Section */}
          <section>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Detail Konsultasi</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                <Image
                  alt={lawyer.name}
                  className="object-cover"
                  src={lawyer.image}
                  fill
                  unoptimized
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-on-surface leading-tight font-headline">
                  {lawyer.name}
                </h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
                  {lawyer.specialty}
                </p>
                <p className="text-on-surface-variant text-xs leading-snug">
                  Sesi konsultasi hukum profesional durasi 1 jam via chat.
                </p>
              </div>
              <div className="sm:text-right shrink-0">
                <p className="text-lg font-black text-on-surface">{formatRupiah(basePrice)}</p>
              </div>
            </div>
          </section>

          {/* Metode Pembayaran Section */}
          <section>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-1 gap-3">
              {/* QRIS - Active */}
              <label className="relative flex items-center p-4 cursor-pointer rounded-xl border-2 border-primary bg-primary/5 transition-all">
                <input defaultChecked className="hidden" name="payment" type="radio" value="qris" />
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-primary text-2xl">qr_code_2</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-on-surface text-sm">QRIS</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Gopay, OVO, Dana, LinkAja</p>
                  </div>
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
              </label>

              {/* Bank BCA */}
              <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-stone-200 bg-white hover:border-outline-variant transition-all">
                <input className="hidden" name="payment" type="radio" value="bca" />
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-800 border border-blue-100">
                    BCA
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-on-surface text-sm text-opacity-80">Transfer Bank BCA</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Verifikasi Otomatis</p>
                  </div>
                </div>
              </label>

              {/* Bank Mandiri */}
              <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-stone-200 bg-white hover:border-outline-variant transition-all">
                <input className="hidden" name="payment" type="radio" value="mandiri" />
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-[10px] font-black text-yellow-700 border border-yellow-100">
                    MDR
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-on-surface text-sm text-opacity-80">Bank Mandiri</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Proses Instan</p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Ringkasan Pembayaran Section */}
          <section className="bg-stone-50 rounded-xl p-6 space-y-3 border border-stone-100">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Ringkasan Pembayaran</h2>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Harga Layanan</span>
              <span className="font-bold text-on-surface">{formatRupiah(basePrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Biaya Admin</span>
              <span className="font-bold text-on-surface">{formatRupiah(adminFee)}</span>
            </div>
            <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
              <span className="text-base font-extrabold text-on-surface">Total Pembayaran</span>
              <span className="text-2xl font-black text-primary">{formatRupiah(totalPrice)}</span>
            </div>
          </section>

          {/* Action Button & Footer Info */}
          <div className="space-y-6 pt-4">
            
            <ClientPaymentFlow lawyer={lawyer} />
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant/70">
                <span className="material-symbols-outlined text-base">lock</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Pembayaran Aman &amp; Terenkripsi</p>
              </div>
              <p className="text-[9px] text-center uppercase tracking-[0.3em] font-bold text-on-surface-variant/40">Estimasi Proses: Instan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Trust Quote */}
      <div className="mt-12 max-w-lg text-center px-6">
        <p className="text-stone-400 font-headline font-medium text-sm leading-relaxed">
          &quot;Keadilan bukan hanya tentang hasil akhir, melainkan tentang ketepatan struktur dan transparansi dokumen yang mengawal setiap langkah Anda.&quot;
        </p>
      </div>
    </main>
  );
}
