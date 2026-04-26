"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

import NotificationsDropdown from "@/components/NotificationsDropdown";

const DAYS = [
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
  { id: 0, name: "Minggu" }
];

export default function LawyerSchedulePage() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [schedules, setSchedules] = useState(
    DAYS.map(d => ({ day_of_week: d.id, is_active: false, start_time: "09:00", end_time: "17:00" }))
  );

  useEffect(() => {
    setMounted(true);
    const loadUserAndSchedules = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUserId(user.id);

        const { data: existingSchedules, error } = await supabase
          .from("lawyer_schedules")
          .select("*")
          .eq("lawyer_id", user.id);

        if (error) throw error;

        if (existingSchedules && existingSchedules.length > 0) {
          // Merge existing with defaults
          setSchedules(prev => 
            prev.map(defaultSchedule => {
              const found = existingSchedules.find(s => s.day_of_week === defaultSchedule.day_of_week);
              return found ? {
                ...defaultSchedule,
                is_active: found.is_active,
                // Postgres time comes back as HH:MM:SS, we need HH:MM for inputs
                start_time: found.start_time.substring(0, 5),
                end_time: found.end_time.substring(0, 5)
              } : defaultSchedule;
            })
          );
        }
      } catch (err) {
        console.error("Gagal memuat jadwal:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndSchedules();
  }, [router, supabase]);

  const handleToggleDay = (dayId) => {
    setSchedules(prev => prev.map(s => s.day_of_week === dayId ? { ...s, is_active: !s.is_active } : s));
  };

  const handleTimeChange = (dayId, field, value) => {
    setSchedules(prev => prev.map(s => s.day_of_week === dayId ? { ...s, [field]: value } : s));
  };

  const saveSchedules = async () => {
    setIsSaving(true);
    try {
      // Upsert all schedules
      const schedulesToSave = schedules.map(s => ({
        lawyer_id: userId,
        day_of_week: s.day_of_week,
        is_active: s.is_active,
        start_time: s.start_time,
        end_time: s.end_time
      }));

      const { error } = await supabase
        .from('lawyer_schedules')
        .upsert(schedulesToSave, { onConflict: 'lawyer_id, day_of_week' });

      if (error) throw error;
      
      alert("Jadwal kerja berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan jadwal:", err);
      alert("Terjadi kesalahan saat menyimpan jadwal.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <>

        {/* Header */}
        <header className="bg-white border-b border-outline-variant/20 px-6 py-4 lg:px-10 lg:py-6 flex items-center justify-between shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-xl lg:text-2xl font-black font-headline text-on-surface tracking-tight">Atur Jadwal Kerja</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1 tracking-wide">Klien hanya dapat membuat jadwal konsultasi di waktu aktif Anda.</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsDropdown userId={userId} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#fcf9f8]">
          <div className="max-w-3xl mx-auto">
            
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
                    <div>
                      <h3 className="font-bold text-primary text-sm mb-1">Informasi Penjadwalan</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Anda tetap bisa menerima "Konsultasi Instan" kapan saja asalkan status Anda Online. Jadwal di bawah ini digunakan bagi klien yang ingin memesan waktu Anda untuk hari esok atau lusa.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {DAYS.map((day) => {
                      const schedule = schedules.find(s => s.day_of_week === day.id);
                      return (
                        <div key={day.id} className={`p-4 rounded-2xl border transition-colors ${schedule.is_active ? 'bg-white border-primary/30 shadow-sm' : 'bg-surface-container-lowest border-outline-variant/20 opacity-70'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {/* Toggle */}
                              <button 
                                onClick={() => handleToggleDay(day.id)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${schedule.is_active ? 'bg-primary' : 'bg-outline-variant/40'}`}
                              >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${schedule.is_active ? 'left-7' : 'left-1'}`} />
                              </button>
                              <span className={`font-bold w-20 ${schedule.is_active ? 'text-on-surface' : 'text-on-surface-variant'}`}>{day.name}</span>
                            </div>

                            {/* Time Selectors */}
                            <div className={`flex items-center gap-2 transition-opacity ${schedule.is_active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                              <div className="relative">
                                <input 
                                  type="time" 
                                  value={schedule.start_time}
                                  onChange={(e) => handleTimeChange(day.id, 'start_time', e.target.value)}
                                  className="bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:border-primary outline-none"
                                />
                              </div>
                              <span className="text-on-surface-variant font-bold text-sm">-</span>
                              <div className="relative">
                                <input 
                                  type="time" 
                                  value={schedule.end_time}
                                  onChange={(e) => handleTimeChange(day.id, 'end_time', e.target.value)}
                                  className="bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:border-primary outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
                    <button 
                      onClick={saveSchedules}
                      disabled={isSaving}
                      className="bg-primary hover:bg-[#680b00] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      ) : (
                        <span className="material-symbols-outlined text-sm">save</span>
                      )}
                      <span>Simpan Jadwal</span>
                    </button>
                  </div>

                </div>
              </div>
            )}
            
          </div>
        </main>
    </>
  );
}
