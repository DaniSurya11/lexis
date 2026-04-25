"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import SuccessModal from "@/components/SuccessModal";
import { validateRegisterClient, passwordStrength } from "@/lib/validation";

export default function ClientDetailsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    education: "",
    ktp: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
    agree: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pwStrength = passwordStrength(formData.password);

  const handleChange = useCallback((e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    // Clear specific field error on change
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
  }, [fieldErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi client-side
    const result = validateRegisterClient(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
      // Scroll ke error pertama
      const firstErrKey = Object.keys(result.errors)[0];
      document.getElementById(firstErrKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      // 1. Sign up user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: "client",
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert detail ke tabel profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.name,
            role: 'client',
            updated_at: new Date(),
          }
        ]);

      if (profileError) throw profileError;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "client");
      localStorage.setItem("userName", formData.name.split(" ")[0]);

      setShowModal(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err) {
      setFieldErrors({ _server: err.message || "Terjadi kesalahan. Coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: input class
  const inputClass = (fieldId) =>
    `w-full bg-transparent border-0 border-b-2 transition-all px-0 py-3 placeholder:text-outline/40 text-sm font-medium outline-none ${
      fieldErrors[fieldId]
        ? "border-error focus:border-error"
        : "border-outline-variant focus:border-primary"
    }`;

  // Helper: error message
  const FieldError = ({ fieldId }) =>
    fieldErrors[fieldId] ? (
      <p className="mt-1 text-[10px] text-error font-bold flex items-center gap-1 animate-in fade-in duration-200">
        <span
          className="material-symbols-outlined text-[11px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          error
        </span>
        {fieldErrors[fieldId]}
      </p>
    ) : null;

  return (
    <div className="font-body selection:bg-primary/10">
      <SuccessModal
        isOpen={showModal}
        title="Pendaftaran Berhasil!"
        description="Data Anda telah kami terima. Anda akan diarahkan ke halaman konfirmasi."
        toastTitle="Registrasi Berhasil"
        toastDescription="Selamat datang di jaringan eksklusif Lexis Premium."
      />

      <main className="flex-grow flex flex-col py-10 px-8 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest group"
            href="/register"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Pilih Jenis Akun Lain</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/" className="mb-8 flex items-center gap-1.5 group shrink-0">
            <Image
              src="/logo-icon.svg"
              alt="Lexis Icon"
              width={64}
              height={64}
              className="h-16 w-auto object-contain transition-transform duration-500 group-hover:rotate-12"
              priority
            />
            <div className="flex flex-col leading-none text-left">
              <span className="text-3xl font-headline font-black tracking-tighter text-brand-blue">
                LEXIS
              </span>
              <span className="text-xs font-headline font-black tracking-[0.3em] text-outline uppercase opacity-90">
                Premium
              </span>
            </div>
          </Link>
          <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight mb-4">
            Pendaftaran Klien
          </h1>
          <p className="text-on-surface-variant font-body text-base opacity-70">
            Lengkapi data diri Anda untuk mendapatkan layanan hukum premium.
          </p>
        </div>

        {/* Server Error Banner */}
        {fieldErrors._server && (
          <div className="mb-8 max-w-2xl mx-auto w-full p-4 bg-error/8 border border-error/20 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <span className="material-symbols-outlined text-error text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              error
            </span>
            <p className="text-sm text-error font-bold">{fieldErrors._server}</p>
          </div>
        )}

        {/* Form */}
        <form className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">

            {/* Left Column: Informasi Pribadi */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
                <h2 className="text-[11px] font-headline font-black uppercase tracking-[0.3em] text-primary">
                  Informasi Pribadi
                </h2>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="name">
                  Nama Lengkap
                </label>
                <input
                  required id="name" value={formData.name} onChange={handleChange}
                  className={inputClass("name")}
                  placeholder="Contoh: Budi Santoso" type="text"
                  aria-invalid={!!fieldErrors.name}
                />
                <FieldError fieldId="name" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="email">
                  Alamat Email
                </label>
                <input
                  required id="email" value={formData.email} onChange={handleChange}
                  className={inputClass("email")}
                  placeholder="nama@email.com" type="email"
                  aria-invalid={!!fieldErrors.email}
                />
                <FieldError fieldId="email" />
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="dob">
                    Tanggal Lahir
                  </label>
                  <input
                    id="dob" value={formData.dob} onChange={handleChange}
                    className={`${inputClass("dob")} text-on-surface-variant`}
                    type="date"
                    aria-invalid={!!fieldErrors.dob}
                  />
                  <FieldError fieldId="dob" />
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="gender">
                    Jenis Kelamin
                  </label>
                  <select
                    id="gender" value={formData.gender} onChange={handleChange}
                    className={`${inputClass("gender")} appearance-none cursor-pointer`}
                  >
                    <option value="">Pilih Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 bottom-3 text-outline-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="password">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      required id="password" value={formData.password} onChange={handleChange}
                      className={`${inputClass("password")} pr-8`}
                      placeholder="••••••••" type={showPassword ? "text" : "password"}
                      aria-invalid={!!fieldErrors.password}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-0 top-3 text-outline-variant hover:text-on-surface-variant transition-colors" aria-label="Toggle password">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {/* Password Strength Bar */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className="strength-bar flex-1"
                            style={{
                              backgroundColor: level <= pwStrength.score ? pwStrength.color : "var(--outline)",
                            }}
                          />
                        ))}
                      </div>
                      {pwStrength.label && (
                        <p className="text-[10px] font-bold" style={{ color: pwStrength.color }}>
                          Kekuatan: {pwStrength.label}
                        </p>
                      )}
                    </div>
                  )}
                  <FieldError fieldId="password" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="confirmPassword">
                    Ulangi Sandi
                  </label>
                  <div className="relative">
                    <input
                      required id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                      className={`${inputClass("confirmPassword")} pr-8`}
                      placeholder="••••••••" type={showConfirmPassword ? "text" : "password"}
                      aria-invalid={!!fieldErrors.confirmPassword}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-0 top-3 text-outline-variant hover:text-on-surface-variant transition-colors" aria-label="Toggle confirm password">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${formData.password === formData.confirmPassword ? "text-green-600" : "text-error"}`}>
                      <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {formData.password === formData.confirmPassword ? "check_circle" : "cancel"}
                      </span>
                      {formData.password === formData.confirmPassword ? "Kata sandi cocok" : "Tidak cocok"}
                    </p>
                  )}
                  <FieldError fieldId="confirmPassword" />
                </div>
              </div>
            </div>

            {/* Right Column: Kontak & Sosial */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  contact_page
                </span>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                  Kontak & Sosial Media
                </h2>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="phone">
                  Nomor Telepon
                </label>
                <input
                  required id="phone" value={formData.phone} onChange={handleChange}
                  className={inputClass("phone")}
                  placeholder="+62 812..." type="tel"
                  aria-invalid={!!fieldErrors.phone}
                />
                <FieldError fieldId="phone" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="address">
                  Alamat Tinggal
                </label>
                <textarea
                  id="address" value={formData.address} onChange={handleChange}
                  className={`${inputClass("address")} resize-none`}
                  placeholder="Jalan, No. Rumah, Kota, Provinsi" rows="1"
                />
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="instagram">
                    Instagram Handle
                  </label>
                  <input
                    id="instagram" value={formData.instagram} onChange={handleChange}
                    className={inputClass("instagram")}
                    placeholder="@username" type="text"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="facebook">
                    Facebook Profile
                  </label>
                  <input
                    id="facebook" value={formData.facebook} onChange={handleChange}
                    className={inputClass("facebook")}
                    placeholder="Nama Facebook" type="text"
                  />
                </div>
              </div>

              {/* Education + NIK */}
              <div className="pt-4 bg-surface-container-low/50 p-8 rounded-2xl border border-outline-variant/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="education">
                      Pendidikan Terakhir
                    </label>
                    <select
                      id="education" value={formData.education} onChange={handleChange}
                      className={`${inputClass("education")} appearance-none cursor-pointer`}
                    >
                      <option value="">Pilih Pendidikan</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="Diploma">Diploma (D3)</option>
                      <option value="Sarjana">Sarjana (S1)</option>
                      <option value="Magister">Magister (S2)</option>
                      <option value="Doktor">Doktor (S3)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 bottom-3 text-outline-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="ktp">
                      Nomor KTP (NIK)
                    </label>
                    <input
                      required id="ktp" value={formData.ktp} onChange={handleChange}
                      className={inputClass("ktp")}
                      placeholder="16 Digit NIK" type="text" maxLength="16"
                      aria-invalid={!!fieldErrors.ktp}
                    />
                    <FieldError fieldId="ktp" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-20 max-w-xl mx-auto w-full text-center">
            <div className="flex items-start gap-4 mb-8">
              <input
                required type="checkbox" id="agree" checked={formData.agree} onChange={handleChange}
                className="w-5 h-5 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary shrink-0 cursor-pointer"
                aria-invalid={!!fieldErrors.agree}
              />
              <div>
                <label htmlFor="agree" className="text-xs text-on-surface-variant font-medium text-left cursor-pointer">
                  Saya menyetujui{" "}
                  <Link className="text-primary font-black underline decoration-primary/30 hover:decoration-primary" href="/terms">
                    Ketentuan Layanan
                  </Link>{" "}
                  serta{" "}
                  <Link className="text-primary font-black underline decoration-primary/30 hover:decoration-primary" href="/privacy">
                    Kebijakan Privasi
                  </Link>{" "}
                  yang berlaku.
                </label>
                <FieldError fieldId="agree" />
              </div>
            </div>

            <button
              className="button-shine ripple-container w-full py-5 bg-primary text-white rounded-xl font-headline font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <span>Buat Akun Premium</span>
              )}
            </button>
            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">
              EDITORIAL EXCELLENCE SINCE 2024
            </p>
          </div>
        </form>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] right-[-5%] w-1/2 h-1/2 bg-surface-container-highest opacity-20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-1/3 h-1/3 bg-primary-fixed opacity-5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
