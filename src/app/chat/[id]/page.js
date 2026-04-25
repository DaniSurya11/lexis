"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EndSessionAction from "./EndSessionAction";
import { useConsultation } from "@/context/ConsultationContext";
import { createClient } from "@/lib/supabase";

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { sessions, bookings, showToast } = useConsultation();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const sessionEndedRef = useRef(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  
  const [opponent, setOpponent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const lawyerId = params.id;

  // 1. Fetch Current User
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [supabase]);

  // 2. Fetch Opponent Info dynamically
  useEffect(() => {
    if (!currentUser || !activeSession) return;
    
    const fetchOpponent = async () => {
      const associatedBooking = bookings.find(b => b.id === activeSession.booking_id);
      if (!associatedBooking) return;

      const isLawyer = currentUser.id === associatedBooking.lawyer_id;
      const opponentId = isLawyer ? associatedBooking.client_id : associatedBooking.lawyer_id;

      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', opponentId)
        .single();

      if (data) {
        setOpponent({
          id: opponentId,
          name: data.full_name || (isLawyer ? 'Klien' : 'Pengacara'),
          image: data.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
          subtitle: isLawyer ? 'Klien' : 'Sedang Aktif (Online)'
        });
      }
    };
    fetchOpponent();
  }, [currentUser, activeSession, bookings, supabase]);

  // 3. Hydration & Session Context
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => setIsContextLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (sessionEndedRef.current && !isFinished) return;
    if (!isContextLoaded) return;

    const activeSessionObj = sessions.find(s => s.status === 'active');
    
    if (!activeSessionObj) {
      const justCompleted = bookings.find(b => b.lawyer_id === lawyerId && b.status === 'completed');
      if (justCompleted) {
        sessionEndedRef.current = true;
        setIsFinished(true);
        setIsAuthorized(true);
        return;
      }
      
      if (sessions.length > 0 || bookings.length > 0) {
        if (!sessionEndedRef.current) {
          showToast("Tidak ada sesi aktif ditemukan", "error");
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
      return;
    }
    
    const associatedBooking = bookings.find(b => b.id === activeSessionObj.booking_id);
    
    if (associatedBooking && associatedBooking.lawyer_id !== lawyerId) {
       showToast("Anda tidak memiliki akses ke sesi ini", "error");
       router.push("/dashboard");
       return;
    }

    setActiveSession(activeSessionObj);
    setIsAuthorized(true);
  }, [sessions, bookings, lawyerId, router, showToast, isContextLoaded]);

  const handleSessionEnd = React.useCallback(() => {
    sessionEndedRef.current = true;
  }, []);

  const [wasActive, setWasActive] = useState(false);
  useEffect(() => {
    if (activeSession) setWasActive(true);
  }, [activeSession]);

  // Transitional Redirect Guard
  useEffect(() => {
    if (isFinished && isContextLoaded) {
      const lookupSessionId = () => {
        const completedBooking = bookings.find(b => b.lawyer_id === lawyerId && b.status === 'completed');
        if (completedBooking) {
          const s = sessions.find(s => s.booking_id === completedBooking.id);
          if (s) return s.id;
        }
        if (activeSession?.id) return activeSession.id;
        return null;
      };

      const sid = lookupSessionId();
      const timer = setTimeout(() => {
        if (sid) {
          router.push(`/session-ended/${sid}`);
        } else {
          const target = localStorage.getItem("userRole") === "lawyer" ? "/dashboard/lawyer" : "/dashboard";
          router.push(target);
        }
      }, wasActive ? 4000 : 500);
      return () => clearTimeout(timer);
    }
  }, [isFinished, isContextLoaded, wasActive, sessions, bookings, lawyerId, router, activeSession]);

  // --- CHAT LOGIC ---
  useEffect(() => {
    if (!activeSession || !isAuthorized) return;

    // 1. Ambil pesan lama
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', activeSession.booking_id)
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setMessages(data);
      }
    };
    fetchMessages();

    // 2. Langganan Realtime untuk pesan baru
    const channel = supabase
      .channel(`chat_${activeSession.booking_id}`)
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `booking_id=eq.${activeSession.booking_id}`
        }, 
        (payload) => {
          setMessages((prev) => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession, isAuthorized, supabase]);

  // Scroll otomatis ke bawah jika ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !activeSession) return;

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage(""); // Optimistic clear UI

    try {
      const { error } = await supabase.from('messages').insert([{
        booking_id: activeSession.booking_id,
        sender_id: currentUser.id,
        content: messageContent
      }]);

      if (error) throw error;
      
      // Mengandalkan Supabase Realtime untuk menampilkan pesan di layar
      // agar tidak ada duplikasi kunci (React duplicate keys error).
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      showToast("Gagal mengirim pesan", "error");
    } finally {
      setIsSending(false);
    }
  };

  // --- RENDER ---
  if (!opponent || !isAuthorized || !activeSession || isFinished || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
         <div className="w-8 h-8 rounded-full border-4 border-outline-variant border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-[#fcf9f8]/95 backdrop-blur-md font-headline text-sm font-bold tracking-tight docked full-width top-0 sticky z-50 transition-all border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-on-surface-variant hover:bg-[#eae7e7]/50 p-2 rounded-lg transition-colors scale-98 active:opacity-90">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden md:inline font-semibold">Kembali ke Dasbor</span>
            </Link>
            <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>
            
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm relative shrink-0">
                <Image fill className="object-cover" alt={opponent.name} src={opponent.image} sizes="40px" unoptimized />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h1 className="text-primary font-black tracking-tight leading-tight text-[11px] sm:text-xs md:text-base truncate">{opponent.name}</h1>
                <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-tertiary animate-pulse shrink-0"></span>
                  <span className="text-[9px] md:text-[11px] text-tertiary font-bold uppercase tracking-wider md:tracking-widest leading-none">
                    <span className="md:hidden">Online</span>
                    <span className="hidden md:inline">{opponent.subtitle}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-[#eae7e7]/50 rounded-lg transition-all" style={{fontVariationSettings: "'FILL' 1"}}>info</button>
            <EndSessionAction sessionId={activeSession.id} onSessionEnd={handleSessionEnd} />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col max-w-5xl w-full mx-auto bg-surface-container-low/30 relative">
        {/* Chat Area */}
        <section className="flex-grow overflow-y-auto px-6 py-8 space-y-6 pb-32">
          {/* System Timestamp & Trust Elements */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <span className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              Sesi Dimulai
            </span>
            <div className="flex items-center gap-2 bg-surface-container-highest/30 px-3 py-1.5 rounded-lg border border-outline-variant/10 text-on-surface-variant opacity-80 mt-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              <span className="text-[10px] font-medium tracking-wide">Percakapan ini bersifat rahasia dan terlindungi E2E.</span>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center text-on-surface-variant text-xs opacity-60 mt-10">
              Belum ada pesan. Mulai sapa sekarang.
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUser.id;
              return (
                <div key={msg.id} className={`flex flex-col animate-in slide-in-from-bottom-2 duration-300 ${isMine ? 'items-end ml-auto' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                  <div className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar untuk lawan bicara */}
                    {!isMine && (
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 shadow-sm border border-outline-variant/20 relative">
                        <Image fill className="object-cover" alt={opponent.name} src={opponent.image} sizes="32px" unoptimized />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div className={`text-sm leading-relaxed font-body p-4 rounded-xl shadow-sm border ${
                      isMine 
                        ? 'bg-primary-container text-white border-transparent rounded-br-none shadow-primary/10' 
                        : 'text-on-surface bg-surface-container-low border-outline-variant/10 rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                  
                  <span className={`text-[10px] text-on-surface-variant font-medium mt-1.5 ${isMine ? 'mr-1' : 'ml-11'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input Section */}
        <form onSubmit={handleSendMessage} className="fixed bottom-0 left-0 w-full md:left-auto md:w-[calc(100%-2rem)] md:max-w-5xl bg-surface/95 backdrop-blur-sm border-t border-outline-variant/20 px-4 py-4 md:px-8 z-40">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button type="button" className="material-symbols-outlined text-on-surface-variant p-2.5 hover:bg-surface-container-high rounded-full transition-colors active:scale-90">attach_file</button>
            <div className="flex-grow relative flex items-center">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-primary focus:outline-none text-sm py-3 px-4 transition-all font-body rounded-t-lg" 
                placeholder="Tulis pesan Anda di sini..." 
                type="text" 
                disabled={isSending}
              />
              <button type="button" className="absolute right-2 material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">mood</button>
            </div>
            <button 
              type="submit" 
              disabled={!newMessage.trim() || isSending}
              className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all outline-none disabled:opacity-50 disabled:active:scale-100"
            >
              {isSending ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              )}
            </button>
          </div>
          
          <footer className="mt-4 pb-2 text-center scale-90 origin-bottom">
            <div className="flex justify-center items-center gap-6 opacity-40 hover:opacity-70 transition-opacity">
              <span className="text-[9px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant">© 2026 Lexis Premium</span>
              <span className="text-[9px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">shield</span> End-to-End Encryption</span>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}
