"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import LogoutAction from "./LogoutAction";
import { createClient } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHome = pathname === "/";

  // Use Supabase's real auth state listener for reliable auth detection
  useEffect(() => {
    const supabase = createClient();
    let subscription = null;

    // Check initial auth state
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuth(!!session);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();

    // Listen for auth state changes (login, logout, token refresh)
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuth(!!session);
      });
      subscription = data.subscription;
    } catch {
      // Supabase unreachable — ignore
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Scroll physics for transparent to glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = "bg-surface border-b border-surface-container-high text-primary font-['Manrope'] font-bold tracking-tight top-0 sticky transition-all duration-300 z-50 py-2.5";

  const getLinkClasses = (path) => {
    const isActive = pathname === path;
    const baseClasses = isHome ? "transition-all" : "border-b-2 pb-1 transition-all";
    
    if (isActive) {
      return `${baseClasses} text-primary ${isHome ? '' : 'border-primary '}font-extrabold hover:text-primary`;
    } else {
      return `${baseClasses} ${isHome ? 'text-brand-blue/70' : 'text-on-surface-variant border-transparent'} font-medium hover:text-primary`;
    }
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl w-full mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <Image 
            src="/logo-icon.svg"
            alt="Lexis Icon"
            width={36}
            height={36}
            className="h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-12"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="font-black text-base tracking-tighter !text-brand-blue transition-colors duration-300">
              LEXIS
            </span>
            <span className="text-[8px] font-black tracking-[0.15em] !text-brand-blue uppercase">
              Premium Legal Platform
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link className={getLinkClasses("/")} href="/">Home</Link>
          <Link className={getLinkClasses("/lawyers")} href="/lawyers">Consult Lawyers</Link>
          <Link className={getLinkClasses("/how-it-works")} href="/how-it-works">How it Works</Link>
          <Link className={getLinkClasses("/faq")} href="/faq">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-3">
            {isAuth ? (
              <>
                <LogoutAction className="text-on-surface-variant text-sm font-bold hover:text-error transition-all">
                  Keluar
                </LogoutAction>
                 <Link href="/dashboard" className="bg-primary text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>space_dashboard</span>
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-on-surface-variant text-sm font-medium hover:text-primary transition-all px-2">Login</Link>
                <Link href="/register" className="bg-primary text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90 shadow-sm hover:shadow-md transition-all active:scale-95 inline-block text-center">Register</Link>
              </>
            )}
          </div>
          
          {/* Hamburger Button untuk Mobile */}
          <button 
            className="md:hidden flex items-center p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              menu
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-surface border-l border-surface-container-high shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
            <Link href="/" className="flex items-center gap-1 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <Image 
                src="/logo-icon.svg"
                alt="Lexis Icon"
                width={28}
                height={28}
                className="h-7 w-auto object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-black text-sm tracking-tighter !text-brand-blue">
                  LEXIS
                </span>
              </div>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full text-brand-blue bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 p-6 flex-grow overflow-y-auto">
            <Link className={`py-3 text-lg ${pathname === "/" ? 'font-extrabold text-primary' : 'font-medium text-on-surface-variant'}`} href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link className={`py-3 text-lg ${pathname === "/lawyers" ? 'font-extrabold text-primary' : 'font-medium text-on-surface-variant'}`} href="/lawyers" onClick={() => setIsMobileMenuOpen(false)}>Consult Lawyers</Link>
            <Link className={`py-3 text-lg ${pathname === "/how-it-works" ? 'font-extrabold text-primary' : 'font-medium text-on-surface-variant'}`} href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it Works</Link>
            <Link className={`py-3 text-lg ${pathname === "/faq" ? 'font-extrabold text-primary' : 'font-medium text-on-surface-variant'}`} href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          </div>
          
          <div className="p-6 border-t border-surface-container-high bg-surface-bright flex flex-col gap-3">
            {isAuth ? (
              <>
                <Link href="/dashboard" className="bg-primary text-white text-base px-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full shadow-md hover:shadow-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>space_dashboard</span>
                  <span>Dashboard</span>
                </Link>
                <LogoutAction className="text-on-surface-variant text-sm font-bold text-center w-full py-2.5 hover:bg-surface-container rounded-lg transition-all border border-transparent hover:border-outline-variant/30">
                  Keluar
                </LogoutAction>
              </>
            ) : (
              <>
                <Link href="/login" className="border-2 border-outline-variant/30 text-brand-blue text-base font-bold hover:bg-surface-container transition-all px-4 py-3 rounded-xl text-center" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="bg-primary text-white text-base px-4 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
      </div>
    </nav>
  );
}
