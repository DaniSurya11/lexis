"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

import { validateChangePassword, passwordStrength } from "@/lib/validation";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pwStrength = passwordStrength(formData.newPassword);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
  }, [fieldErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = validateChangePassword(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      // Ganti dengan fetch API nyata:
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {...})
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch (err) {
      setFieldErrors({ _server: err.message || "Gagal memperbarui kata sandi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (id) =>
    `input-glow w-full bg-surface-container-low border rounded-2xl px-6 py-4 pr-14 text-sm font-bold transition-all outline-none ${
      fieldErrors[id]
        ? "border-error/60 focus:border-error"
        : "border-outline-variant/20 focus:border-primary"
    }`;

  const FieldError = ({ id }) =>
    fieldErrors[id] ? (
      <p className="mt-1.5 ml-1 text-[10px] text-error font-bold flex items-center gap-1 animate-in fade-in duration-200">
        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        {fieldErrors[id]}
      </p>
    ) : null;

  const ToggleBtn = ({ show, onToggle, label }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-5 top-4 text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
      aria-label={label}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
        {show ? "visibility_off" : "visibility"}
      </span>
    </button>
  );

  return (
    <>

        <main className="flex-1 p-8 pt-16 md:pt-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Back + Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">
                Ganti Kata Sandi
              </h1>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-1 opacity-60 italic">
                Amankan Akun Lexis Premium Anda
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-xl overflow-hidden">
            {!success ? (
              <div className="p-10">
                {/* Server error */}
                {fieldErrors._server && (
                  <div className="mb-6 p-4 bg-error/8 border border-error/20 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-error text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    <p className="text-sm text-error font-bold">{fieldErrors._server}</p>
                  </div>
                )}

                <form className="space-y-8 max-w-lg" onSubmit={handleSubmit} noValidate>
                  {/* Current password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="currentPassword">
                      Kata Sandi Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        placeholder="••••••••"
                        className={inputClass("currentPassword")}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        aria-invalid={!!fieldErrors.currentPassword}
                      />
                      <ToggleBtn show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} label="Toggle kata sandi saat ini" />
                    </div>
                    <FieldError id="currentPassword" />
                  </div>

                  <div className="h-px bg-outline-variant/10 w-full" />

                  {/* New + Confirm */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="newPassword">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          placeholder="••••••••"
                          className={inputClass("newPassword")}
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                          aria-invalid={!!fieldErrors.newPassword}
                        />
                        <ToggleBtn show={showNew} onToggle={() => setShowNew((v) => !v)} label="Toggle kata sandi baru" />
                      </div>
                      {/* Strength Bar */}
                      {formData.newPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className="strength-bar flex-1"
                                style={{ backgroundColor: level <= pwStrength.score ? pwStrength.color : "var(--outline)" }}
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
                      <FieldError id="newPassword" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="confirmNewPassword">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          id="confirmNewPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className={inputClass("confirmNewPassword")}
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          required
                          aria-invalid={!!fieldErrors.confirmNewPassword}
                        />
                        <ToggleBtn show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} label="Toggle konfirmasi kata sandi" />
                      </div>
                      {formData.confirmNewPassword && (
                        <p className={`text-[10px] font-bold flex items-center gap-1 ${formData.newPassword === formData.confirmNewPassword ? "text-green-600" : "text-error"}`}>
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {formData.newPassword === formData.confirmNewPassword ? "check_circle" : "cancel"}
                          </span>
                          {formData.newPassword === formData.confirmNewPassword ? "Kata sandi cocok" : "Tidak cocok"}
                        </p>
                      )}
                      <FieldError id="confirmNewPassword" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="button-shine ripple-container bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-container active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                          Memperbarui...
                        </>
                      ) : (
                        "Perbarui Kata Sandi"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-16 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                  <span className="material-symbols-outlined text-5xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-4">
                  Kata Sandi Diperbarui
                </h2>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed mb-10">
                  Kata sandi Anda telah berhasil diperbarui. Gunakan kata sandi baru untuk sesi login berikutnya.
                </p>
                <Link
                  href="/dashboard/profile"
                  className="bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg active:scale-95"
                >
                  Kembali ke Profil
                </Link>
              </div>
            )}
          </div>

          {/* Security Tips */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Tips Keamanan:</span> Gunakan kata sandi minimal 8 karakter dengan kombinasi huruf kapital (A-Z), huruf kecil (a-z), angka (0-9), dan simbol (!@#$%) untuk perlindungan optimal akun premium Anda. Jangan gunakan kata sandi yang sama dengan platform lain.
            </p>
          </div>
        </main>

        <footer className="mt-auto py-10 bg-white border-t border-outline-variant/10 text-center">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">
            Security Gateway • Lexis Premium Center • {new Date().getFullYear()}
          </p>
        </footer>
    </>
  );
}
