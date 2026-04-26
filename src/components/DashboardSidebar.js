"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutAction from "@/components/LogoutAction";
import { useConsultation } from "@/context/ConsultationContext";

/**
 * DashboardSidebar — Reusable Sidebar Component with Mobile Support
 *
 * - Desktop (md+): Fixed sidebar, w-64
 * - Mobile (<md): Hidden by default; opens as a slide-in drawer via hamburger button
 *   rendered by the parent layout (via `onToggle` prop) or via the embedded mobile trigger.
 *
 * Props:
 *   - role: "client" | "lawyer" (default: "client")
 */
export default function DashboardSidebar({ role: initialRole }) {
  const pathname = usePathname();
  const { sessions } = useConsultation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState(initialRole || "client");

  // Detect role if not provided
  useEffect(() => {
    if (!initialRole) {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setRole(storedRole);
      }
    } else {
      setRole(initialRole);
    }
  }, [initialRole]);

  const allActiveSessions = sessions.filter((s) => s.status === "active");
  const activeSession = allActiveSessions.length > 0;

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href) => {
    if (href === "/dashboard" || href === "/dashboard/lawyer") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navItemClass = (href) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
      isActive(href)
        ? "bg-white text-primary shadow-sm border border-outline-variant/20 scale-[0.98]"
        : "text-on-surface-variant hover:bg-white/70 hover:text-on-surface"
    }`;

  const baseDashboardPath = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard";

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 px-2 pt-4 group shrink-0"
      >
        <Image
          src="/logo-icon.svg"
          alt="Lexis Premium Icon"
          width={36}
          height={36}
          className="h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-12"
        />
        <div className="flex flex-col leading-none">
          <span className="text-[1.1rem] font-black tracking-tighter text-brand-blue">
            LEXIS
          </span>
          <span className="text-[9px] font-black tracking-[0.15em] text-brand-blue uppercase">
            Premium
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 pt-4" aria-label="Dashboard navigation">
        {/* Beranda */}
        <Link className={navItemClass(baseDashboardPath)} href={baseDashboardPath} aria-current={isActive(baseDashboardPath) ? "page" : undefined}>
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
            style={isActive(baseDashboardPath) ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            dashboard
          </span>
          <span>Beranda</span>
        </Link>

        {/* Janji Temu */}
        <Link 
          className={navItemClass(role === "lawyer" ? "/dashboard/lawyer/appointments" : "/dashboard/appointments")} 
          href={role === "lawyer" ? "/dashboard/lawyer/appointments" : "/dashboard/appointments"} 
          aria-current={isActive(role === "lawyer" ? "/dashboard/lawyer/appointments" : "/dashboard/appointments") ? "page" : undefined}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={isActive(role === "lawyer" ? "/dashboard/lawyer/appointments" : "/dashboard/appointments") ? { fontVariationSettings: "'FILL' 1" } : {}}>calendar_today</span>
          <span>Janji Temu</span>
        </Link>

        {/* Profil */}
        <Link
          className={navItemClass("/dashboard/profile")}
          href="/dashboard/profile"
          aria-current={isActive("/dashboard/profile") ? "page" : undefined}
        >
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
            style={isActive("/dashboard/profile") ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            account_circle
          </span>
          <span>Profil</span>
        </Link>



        {/* Pengacara Only: Jadwal Kerja */}
        {role === "lawyer" && (
          <Link
            className={navItemClass("/dashboard/lawyer/schedule")}
            href="/dashboard/lawyer/schedule"
            aria-current={isActive("/dashboard/lawyer/schedule") ? "page" : undefined}
          >
            <span className="material-symbols-outlined" aria-hidden="true">event_available</span>
            <span>Jadwal Kerja</span>
          </Link>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-3">
        {/* CTA Baru */}
        {role === "client" && (
          <Link
            href="/lawyers"
            aria-disabled={activeSession ? "true" : "false"}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeSession
                ? "bg-outline-variant text-white pointer-events-none opacity-50"
                : "bg-primary hover:bg-primary-container text-white shadow-lg shadow-primary/20 active:scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">add</span>
            <span>Konsultasi Baru</span>
          </Link>
        )}

        {/* Divider */}
        <div className="pt-4 border-t border-outline-variant/30 space-y-1">
          <Link
            className="text-on-surface-variant hover:bg-white/70 hover:text-on-surface flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-xs font-bold"
            href="/faq"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">help_outline</span>
            <span>Bantuan</span>
          </Link>
          <LogoutAction className="w-full text-on-surface-variant hover:bg-error/10 hover:text-error flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-xs font-bold text-left">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">logout</span>
            <span>Keluar</span>
          </LogoutAction>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop Sidebar (md and above) ─── */}
      <aside
        className="hidden md:flex w-64 fixed left-0 top-0 h-screen flex-col z-40"
        style={{ background: "var(--sidebar-bg, #f6f3f2)", borderRight: "1px solid rgba(226,191,184,0.3)" }}
        aria-label="Dashboard sidebar"
      >
        <SidebarContent />
      </aside>

      {/* ─── Mobile: Hamburger Trigger (rendered inside header via portal pattern) ─── */}
      {/* We expose a floating button on mobile so the parent doesn't need to coordinate */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-surface/90 backdrop-blur-md border border-outline-variant/30 text-on-surface p-2.5 rounded-xl shadow-lg hover:bg-surface-container transition-colors active:scale-95"
          aria-label="Buka menu navigasi"
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">menu</span>
        </button>
      </div>

      {/* ─── Mobile: Backdrop overlay ─── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Mobile: Slide-in Drawer ─── */}
      <aside
        id="mobile-sidebar"
        className={`md:hidden fixed left-0 top-0 h-screen w-72 flex flex-col z-[46] transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar-bg, #f6f3f2)", borderRight: "1px solid rgba(226,191,184,0.3)" }}
        aria-label="Dashboard sidebar (mobile)"
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal={mobileOpen}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Tutup menu navigasi"
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
