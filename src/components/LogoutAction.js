"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import SuccessModal from "@/components/SuccessModal";

export default function LogoutAction({ children, className }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const confirmLogout = () => {
    // Tutup dialog konfirmasi
    setShowConfirm(false);

    // Bersihkan semua state autentikasi
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");

    // Hapus auth cookie agar middleware tahu user sudah logout
    document.cookie = "lexis_auth=; path=/; max-age=0; SameSite=Lax";

    // Tampilkan success modal konsisten dengan Login
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  const modalContent = (
    <>
      {/* Success Modal — konsisten dengan Login */}
      <SuccessModal
        isOpen={showSuccess}
        title="Keluar Berhasil"
        description="Sesi Anda telah diakhiri dengan aman. Sampai jumpa kembali!"
        showSpinner={false}
        toastTitle="Logout Berhasil"
        toastDescription="Anda telah keluar dari Lexis Premium. Terima kasih."
      />

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/20 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 max-w-[320px] w-full mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <span
                className="material-symbols-outlined text-red-500 text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                logout
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-on-surface font-headline mb-3 text-center">
              Keluar dari Akun?
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-8">
              Apakah Anda yakin ingin keluar? Anda harus masuk kembali untuk melanjutkan konsultasi.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={cancelLogout}
                className="flex-1 bg-surface-container-high hover:bg-surface-dim text-on-surface-variant py-3 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-error hover:bg-[#93000a] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button onClick={handleLogoutClick} className={className}>
        {children}
      </button>

      {mounted && document.body && createPortal(modalContent, document.body)}
    </>
  );
}
