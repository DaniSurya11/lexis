"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ConsultationContext = createContext();

export const useConsultation = () => useContext(ConsultationContext);

import { createClient } from '@/lib/supabase';

export const ConsultationProvider = ({ children }) => {
  const supabaseRef = useRef(null);
  if (!supabaseRef.current) {
    supabaseRef.current = createClient();
  }
  const supabase = supabaseRef.current;

  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState(null);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        // Not logged in or error fetching session — clear state silently
        setBookings([]);
        setSessions([]);
        return;
      }

      const userId = session.user.id;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          lawyer:lawyers(
            id,
            profiles(full_name)
          ),
          client:profiles!bookings_client_id_fkey(full_name)
        `)
        .or(`client_id.eq.${userId},lawyer_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch active sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .order('started_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      console.log("[Context] Data loaded from Supabase");
    } catch (err) {
      // Network failures (Supabase down, Docker not running, etc.)
      // Silently ignore — don't crash the app
      console.warn("[Context] Failed to load data:", err.message);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    let subscription = null;
    try {
      // Listen for auth state changes to reload data on login / clear on logout
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          setBookings([]);
          setSessions([]);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          loadData();
        }
      });
      subscription = data.subscription;
    } catch (err) {
      console.warn("[Context] Failed to set up auth listener:", err.message);
    }

    // Subscribe to real-time updates for bookings and sessions
    let channel = null;
    try {
      channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
          console.log('[Realtime] Booking change received!', payload);
          loadData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, payload => {
          console.log('[Realtime] Session change received!', payload);
          loadData();
        })
        .subscribe();
    } catch (err) {
      console.warn("[Context] Failed to set up realtime:", err.message);
    }

    return () => {
      subscription?.unsubscribe();
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          // ignore cleanup errors
        }
      }
    };
  }, [loadData, supabase]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Actions
  const createBooking = async (lawyer, topic = "Konsultasi Hukum", scheduledAt = null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Silakan login terlebih dahulu");

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            client_id: session.user.id,
            lawyer_id: lawyer.id,
            topic: topic,
            status: 'pending',
            scheduled_at: scheduledAt
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Kirim Notifikasi ke Pengacara
      await supabase.from('notifications').insert([{
        user_id: lawyer.id,
        title: "Booking Baru",
        message: "Ada klien baru yang menjadwalkan konsultasi dengan Anda.",
        link_url: "/dashboard/lawyer"
      }]);
      
      showToast("Booking berhasil dibuat!", "success");
      return data.id;
    } catch (err) {
      showToast(err.message, "error");
      return null;
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'accepted' } : b));
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'accepted' })
        .eq('id', bookingId);

      if (error) {
        // Revert on error
        await loadData();
        throw error;
      }
      
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase.from('notifications').insert([{
          user_id: booking.client_id || booking.clientId, // Tergantung mapping
          title: "Booking Diterima",
          message: "Pengacara telah menerima booking konsultasi Anda.",
          link_url: "/dashboard"
        }]);
      }
      
      await loadData();
      showToast("Booking diterima!", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);

      if (error) throw error;
      
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase.from('notifications').insert([{
          user_id: booking.client_id || booking.clientId,
          title: "Booking Ditolak",
          message: "Mohon maaf, pengacara tidak dapat menerima booking Anda saat ini.",
          link_url: "/dashboard"
        }]);
      }
      
      await loadData();
      showToast("Booking ditolak.", "info");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const startSession = async (bookingId) => {
    try {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'active' } : b));
      
      // 1. Create session record
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert([
          {
            booking_id: bookingId,
            status: 'active',
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // 2. Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'active' })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      setSessions(prev => [sessionData, ...prev]);
      await loadData();
      showToast("Sesi dimulai!", "success");
      return sessionData.id;
    } catch (err) {
      await loadData();
      showToast(err.message, "error");
      return null;
    }
  };

  const endSession = async (sessionId) => {
    try {
      // 1. Get session to find booking_id
      const { data: sessionData, error: fetchError } = await supabase
        .from('sessions')
        .select('booking_id')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Update session — DB constraint allows only 'active' and 'finished'
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ status: 'finished', ended_at: new Date() })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // 3. Update booking — DB constraint allows 'pending','accepted','rejected','completed'
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', sessionData.booking_id);

      if (bookingError) throw bookingError;

      await loadData();
      showToast("Sesi selesai.", "info");
    } catch (err) {
      showToast(err.message, "error");
    }
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
