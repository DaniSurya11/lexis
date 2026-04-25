"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { validateLogin } from "@/lib/validation";
import SuccessModal from "@/components/SuccessModal";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState("client");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userRole = session.user.user_metadata?.role || "client";
        router.replace(userRole === "lawyer" ? "/dashboard/lawyer" : "/dashboard");
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
    setServerError("");
  }, [fieldErrors]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = validateLogin(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Verifikasi apakah role yang dipilih sesuai dengan role di metadata user
      const userRole = data.user.user_metadata?.role;
      
      // Jika user mencoba login ke portal yang salah, beri peringatan (opsional)
      // Namun untuk kemudahan, kita ikuti saja role dari database
      const finalRole = userRole || role;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", finalRole);

      setShowModal(true);
      const targetPath = finalRole === "client" ? "/dashboard" : "/dashboard/lawyer";
      setTimeout(() => { window.location.href = targetPath; }, 2500);
    } catch (err) {
      setServerError(err.message === "Invalid login credentials" 
        ? "Email atau kata sandi salah." 
        : err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Underline input style — konsisten dengan halaman Register
  const inputClass = (fieldId) =>
    `w-full bg-transparent border-0 border-b-2 transition-all px-0 py-3 placeholder:text-outline/40 text-sm font-medium outline-none ${
      fieldErrors[fieldId]
        ? "border-error focus:border-error"
        : `border-outline-variant ${role === 'client' ? 'focus:border-primary' : 'focus:border-brand-blue'}`
    }`;

  return (
    <main className="flex-grow flex flex-col items-center justify-start p-6 pt-6 md:pt-10 pb-10 relative bg-surface">
      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        title="Login Berhasil!"
        description="Selamat datang kembali. Anda akan diarahkan ke dashboard."
        toastTitle="Login Berhasil"
        toastDescription={`Selamat datang di portal ${role === "client" ? "Klien" : "Pengacara"} Lexis Premium.`}
      />
      {/* Registration Card */}
      <div
        className={`w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 transition-all duration-500 z-10 relative ${
          role === "client" ? "border-t-primary" : "border-t-brand-blue"
        }`}
      >
        <div className="px-8 pt-6 pb-0">
          <Link
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-wider"
            href="/"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-8 pt-6">
          <div className="flex bg-surface-container-low p-1 gap-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 py-3 px-4 rounded-lg font-headline font-extrabold text-xs uppercase tracking-widest transition-all duration-300 ${
                role === "client"
                  ? "bg-primary text-white shadow-md"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Klien
            </button>
            <button
              type="button"
              onClick={() => setRole("lawyer")}
              className={`flex-1 py-3 px-4 rounded-lg font-headline font-extrabold text-xs uppercase tracking-widest transition-all duration-300 ${
                role === "lawyer"
                  ? "bg-brand-blue text-white shadow-md"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Pengacara
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1
              className={`text-2xl font-headline font-black tracking-tight transition-colors duration-500 ${
                role === "client" ? "text-primary" : "text-brand-blue"
              }`}
            >
              Selamat Datang
            </h1>
            <p className="text-on-surface-variant font-body text-xs mt-1">
              Silakan masuk ke portal {role === "client" ? "Klien" : "Pengacara"}.
            </p>
          </div>

          {/* Server Error Banner */}
          {serverError && (
            <div className="mb-4 p-3 bg-error/8 border border-error/20 rounded-xl flex items-center gap-2 animate-in fade-in duration-300">
              <span
                className="material-symbols-outlined text-error text-lg shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
              <p className="text-xs text-error font-bold">{serverError}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin} noValidate>
            {/* Email Input */}
            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={inputClass("email")}
                id="email"
                placeholder="nama@email.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-[10px] text-error font-bold flex items-center gap-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    error
                  </span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  className={`${inputClass("password")} pr-8`}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-3 text-outline-variant hover:text-on-surface-variant transition-colors"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-[10px] text-error font-bold flex items-center gap-1 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    error
                  </span>
                  {fieldErrors.password}
                </p>
              )}
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className={`text-[10px] font-bold hover:underline uppercase tracking-widest ${
                    role === "client" ? "text-primary" : "text-brand-blue"
                  }`}
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                className={`button-shine ripple-container w-full py-4 text-white font-headline font-black rounded-xl active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed ${
                  isSubmitting 
                    ? "bg-outline-variant" 
                    : (role === "client" ? "bg-primary" : "bg-brand-blue")
                }`}
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-outline-variant/30">
            <p className="text-[11px] text-on-surface-variant font-body mb-1">
              Belum punya akun?{" "}
              <Link
                className={`font-black hover:underline uppercase tracking-wider ml-1 ${
                  role === "client" ? "text-primary" : "text-brand-blue"
                }`}
                href="/register"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>


      {/* Background Decorator */}
      <div className="absolute top-0 w-full h-[50vh] bg-surface-container-low -z-0 border-b border-outline-variant/10" />
    </main>
  );
}
