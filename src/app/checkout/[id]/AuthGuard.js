"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth !== "true") {
      router.replace("/login");
    } else {
      setIsAuth(true);
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-primary animate-spin"></div>
          <p className="text-on-surface-variant text-sm font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return children;
}
