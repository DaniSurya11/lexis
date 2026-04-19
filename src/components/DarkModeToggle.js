"use client";

import { useEffect, useState } from "react";

/**
 * DarkModeToggle — Toggle tema terang/gelap
 * 
 * Menyimpan preferensi ke localStorage dan menerapkan class "dark" ke <html>.
 * CSS dark mode variables harus didefinisikan di globals.css.
 */
export default function DarkModeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hindari hydration mismatch dengan menunggu mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("lexis_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("lexis_theme", nextDark ? "dark" : "light");
  };

  // Render placeholder saat unmounted untuk mencegah flash
  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-full ${className}`} aria-hidden />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 
        hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 ${className}`}
    >
      {/* Sun icon */}
      <span
        className={`material-symbols-outlined absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100 text-[#C5A059]"
            : "opacity-0 rotate-90 scale-50"
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        light_mode
      </span>

      {/* Moon icon */}
      <span
        className={`material-symbols-outlined absolute transition-all duration-300 ${
          !isDark
            ? "opacity-100 rotate-0 scale-100 text-on-surface-variant"
            : "opacity-0 -rotate-90 scale-50"
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}
