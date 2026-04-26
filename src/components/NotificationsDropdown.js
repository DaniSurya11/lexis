"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.round((new Date() - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days < 7) return `${days} hari yang lalu`;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
};

export default function NotificationsDropdown({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`public:notifications:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Notifikasi"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-outline-variant/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/10 bg-[#fcf9f8]">
            <h3 className="font-headline font-black text-sm text-on-surface">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-primary hover:text-[#680b00] uppercase tracking-wider"
              >
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">notifications_paused</span>
                <p className="text-xs font-medium">Belum ada notifikasi.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) markAsRead(notif.id);
                      if (notif.link_url) window.location.href = notif.link_url;
                    }}
                    className={`p-4 hover:bg-surface-container-lowest transition-colors cursor-pointer flex gap-3 ${
                      !notif.is_read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      <span
                        className={`material-symbols-outlined text-lg ${
                          !notif.is_read ? 'text-primary' : 'text-outline-variant'
                        }`}
                        style={{ fontVariationSettings: !notif.is_read ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {notif.title.toLowerCase().includes('booking') ? 'calendar_today' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${!notif.is_read ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant/80 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[9px] font-medium text-outline mt-2 uppercase tracking-wider">
                        {formatTimeAgo(notif.created_at)}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <div className="shrink-0 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
