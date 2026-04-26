"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ConsultationButton({ lawyerId, price, isFloating = false }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setIsAuth(!!session);
      })
      .catch(() => {
        setIsAuth(false);
      });
  }, []);

  const handleClick = () => {
    if (isAuth) {
      router.push(`/checkout/${lawyerId}`);
    } else {
      router.push('/login');
    }
  };

  // Prevent hydration mismatch by returning a placeholder or nothing until mounted
  if (!mounted) {
    return null; // Or a skeleton matching the button
  }

  if (isFloating) {
    return (
      <button onClick={handleClick} className="bg-gradient-to-br from-primary to-primary-container text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span>
      </button>
    );
  }

  return (
    <button onClick={handleClick} className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-2.5 px-8 rounded-xl font-headline font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 shadow-md text-sm uppercase tracking-widest">
      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span>
      Mulai Konsultasi (Rp {price})
    </button>
  );
}
