"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ConsultationContext = createContext();

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info' | 'error' }

  // Load initial data function
  const loadData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedBookings = localStorage.getItem('lexis_bookings');
        const storedSessions = localStorage.getItem('lexis_sessions');
        if (storedBookings) setBookings(JSON.parse(storedBookings));
        if (storedSessions) setSessions(JSON.parse(storedSessions));
        console.log("[Context] Data loaded from localStorage");
      } catch (err) {
        console.error("[Context] Failed to load data:", err);
      }
    }
  }, []);

  // Load initial data on mount with slight delay to ensure localStorage is ready
  useEffect(() => {
    loadData();
    // Re-run after a small delay to handle potential race conditions during redirect
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Utility to persist and update state (Atomic & Functional)
  const saveBookings = useCallback((newBookingsOrFn) => {
    setBookings(prev => {
      const next = typeof newBookingsOrFn === 'function' ? newBookingsOrFn(prev) : newBookingsOrFn;
      localStorage.setItem('lexis_bookings', JSON.stringify(next));
      return next;
    });
  }, []);

  const saveSessions = useCallback((newSessionsOrFn) => {
    setSessions(prev => {
      const next = typeof newSessionsOrFn === 'function' ? newSessionsOrFn(prev) : newSessionsOrFn;
      localStorage.setItem('lexis_sessions', JSON.stringify(next));
      return next;
    });
  }, []);

  const showToast = useCallback((message, type = 'info', propagate = true) => {
    setToast({ message, type });
    if (propagate) {
      localStorage.setItem('lexis_toast', JSON.stringify({ message, type, time: Date.now() }));
    }
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Sync data across tabs & Aggressive Polling fallback
  const bookingsRef = React.useRef(bookings);
  const sessionsRef = React.useRef(sessions);
  bookingsRef.current = bookings;
  sessionsRef.current = sessions;

  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedBookings = localStorage.getItem('lexis_bookings');
      const storedSessions = localStorage.getItem('lexis_sessions');
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (JSON.stringify(parsed) !== JSON.stringify(bookingsRef.current)) {
          setBookings(parsed);
        }
      }
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        if (JSON.stringify(parsed) !== JSON.stringify(sessionsRef.current)) {
          setSessions(parsed);
        }
      }
    } catch (err) {
      console.error("[Sync] Error reading localStorage:", err);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.newValue) return;
      if (e.key === 'lexis_bookings') {
        try { setBookings(JSON.parse(e.newValue)); } catch (err) { console.error(err); }
      }
      if (e.key === 'lexis_sessions') {
        try { setSessions(JSON.parse(e.newValue)); } catch (err) { console.error(err); }
      }
      if (e.key === 'lexis_toast') {
        try {
          const parsed = JSON.parse(e.newValue);
          showToast(parsed.message, parsed.type, false);
        } catch (err) { console.error(err); }
      }
    };

    // Polling setiap 2 detik sebagai fallback jika storage event tidak terpicu
    const pollInterval = setInterval(syncFromStorage, 2000);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [showToast, syncFromStorage]);

  // Actions
  const createBooking = (lawyer) => {
    // Validasi Dasar Data Minimal
    if (!lawyer || !lawyer.id || !lawyer.name) {
       console.error("Gagal membuat booking: Data pengacara tidak valid atau tidak lengkap");
       showToast("Gagal memproses booking. Data pengacara tidak valid.", "error");
       return null;
    }

    // Hindari duplikasi sesi aktif
    const activeExists = sessions.some(s => s.status === 'active');
    if (activeExists) {
      showToast("Selesaikan sesi aktif Anda sebelum membuat konsultasi baru", "error");
      return null;
    }

    const newBooking = {
      id: "bk_" + Date.now().toString(),
      userId: "user_current", // Mock user ID
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      lawyerImage: lawyer.image || "",
      topic: lawyer.specialty || "Konsultasi Hukum Umum",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Atomic update
    saveBookings(prev => [newBooking, ...prev]);
    
    console.log(`[Action] Booking berhasil dibuat: ${newBooking.id}`, newBooking);
    showToast("Pembayaran berhasil! Menunggu konfirmasi pengacara.", "success");
    return newBooking.id;
  };

  const acceptBooking = (bookingId) => {
    saveBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'accepted' } : b));
    console.log(`[Action] Booking diterima oleh pengacara: ${bookingId}`);
    showToast("Booking diterima. Silakan klik Mulai Sesi.", "success");
  };

  const rejectBooking = (bookingId) => {
    saveBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    console.log(`[Action] Booking ditolak: ${bookingId}`);
    showToast("Booking telah ditolak.", "info");
  };

  const startSession = (bookingId) => {
    // Update booking status
    saveBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'active' } : b));

    // Create session
    const newSession = {
      id: "sess_" + Date.now().toString(),
      bookingId: bookingId,
      status: 'active',
      startedAt: new Date().toISOString()
    };
    saveSessions(prev => [newSession, ...prev]);
    
    console.log(`[Action] Sesi konsultasi dimulai: ${newSession.id}`);
    showToast("Sesi dimulai! Menghubungkan ke ruang obrolan...", "success");
  };

  const endSession = (sessionId) => {
    const currentSessions = sessions;
    const session = currentSessions.find(s => s.id === sessionId);

    // GUARD: jika session tidak ada atau sudah selesai
    if (!session || session.status === 'finished') {
      console.warn("Session sudah selesai atau tidak ditemukan");
      return;
    }

    // Update session
    saveSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, status: 'finished', endedAt: new Date().toISOString() }
          : s
      )
    );

    // Update booking
    saveBookings(prev =>
      prev.map(b =>
        b.id === session.bookingId
          ? { ...b, status: 'completed' }
          : b
      )
    );

    console.log(`[Action] Sesi konsultasi diakhiri: ${sessionId}`);
    showToast("Sesi konsultasi telah selesai.", "info");
  };

  return (
    <ConsultationContext.Provider value={{
      bookings,
      sessions,
      createBooking,
      acceptBooking,
      rejectBooking,
      startSession,
      endSession,
      syncFromStorage,
      reloadBookings: loadData,
      showToast
    }}>
      {children}
      
      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`overflow-hidden min-w-[320px] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border bg-white/95 backdrop-blur-xl ${
            toast.type === 'error' ? 'border-error/20' :
            toast.type === 'success' ? 'border-green-500/20' :
            'border-primary/20'
          }`}>
             <div className="p-5 flex items-start gap-4">
               <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${
                  toast.type === 'error' ? 'bg-error/10 text-error' :
                  toast.type === 'success' ? 'bg-green-100 text-green-600' :
                  'bg-primary/10 text-primary'
               }`}>
                  <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>
                    {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                  </span>
               </div>
               <div className="flex-1 pt-0.5">
                  <h4 className="font-headline font-black text-sm text-on-surface leading-tight">
                    {toast.type === 'error' ? 'Terjadi Kesalahan' : toast.type === 'success' ? 'Berhasil' : 'Informasi'}
                  </h4>
                  <p className="font-medium text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">{toast.message}</p>
               </div>
             </div>
             <div className="w-full h-1 bg-surface-container-high relative">
               <div className={`absolute top-0 left-0 h-full animate-[shrink_4s_linear_forwards] origin-left ${
                 toast.type === 'error' ? 'bg-error' : toast.type === 'success' ? 'bg-green-500' : 'bg-primary'
               }`} style={{ width: '100%' }}></div>
             </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shrink {
               from { transform: scaleX(1); }
               to { transform: scaleX(0); }
            }
          `}} />
        </div>
      )}
    </ConsultationContext.Provider>
  );
};
