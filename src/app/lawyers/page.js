"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { SkeletonCard } from "@/components/SkeletonLoader";

export default function LawyersPage() {
  const supabase = createClient();
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [minRating, setMinRating] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch lawyers from Supabase
  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('lawyers')
          .select(`
            *,
            profiles(full_name, avatar_url, city)
          `);
        
        if (error) throw error;
        
        // Transform data to match previous structure
        const transformedData = data.map(l => ({
          id: l.id,
          name: l.profiles.full_name,
          specialty: l.specialization,
          rating: l.rating || 0,
          reviews: 0, // TODO: add reviews table
          experience: "5+ Tahun", // Placeholder
          city: l.profiles.city || "Jakarta",
          image: l.profiles.avatar_url || "https://via.placeholder.com/150",
          isOnline: l.is_available,
          status: l.is_available ? "Online" : "Offline",
          about: l.bio,
        }));
        
        setLawyers(transformedData);
      } catch (err) {
        console.error("Error fetching lawyers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, [supabase]);

  const cities = useMemo(() => {
    const uniqueCities = ["Semua Kota", ...new Set(lawyers.map(l => l.city))];
    return uniqueCities;
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lawyer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lawyer.city.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedSpecialties.length > 0 && !selectedSpecialties.includes("Semua Bidang")) {
        const matchesSpecialty = selectedSpecialties.some(spec => {
          const normalizedSpec = spec.replace("Hukum ", "").toLowerCase();
          const normalizedLawyerSpec = lawyer.specialty.replace("Hukum ", "").toLowerCase();
          return normalizedLawyerSpec.includes(normalizedSpec);
        });
        if (!matchesSpecialty) return false;
      }

      if (selectedCity !== "Semua Kota" && lawyer.city !== selectedCity) return false;
      
      if (lawyer.rating < minRating) return false;
      if (statusFilter === "online" && !lawyer.isOnline) return false;

      return true;
    });
  }, [lawyers, searchQuery, selectedSpecialties, selectedCity, minRating, statusFilter]);


  const handleSpecialtyChange = (specialty) => {
    if (specialty === "Semua Bidang") {
      setSelectedSpecialties([]);
      return;
    }
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialties([]);
    setSelectedExperience("");
    setSelectedCity("Semua Kota");
    setMinRating(0);
    setStatusFilter("all");
  };

  return (
    <main className="pb-16 pt-14 md:pt-8 flex-grow">
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between mb-2">
            <h1 className="font-headline font-black text-2xl text-brand-blue">Eksplorasi Advokat</h1>
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="px-4 py-2 bg-white border border-outline-variant/30 rounded-xl shadow-sm text-sm font-bold text-brand-blue flex items-center gap-2 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Filter
            </button>
          </div>

          {/* Mobile Filter Overlay */}
          <div 
            className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Sidebar Filter */}
          <aside className={`
            fixed lg:relative inset-y-0 right-0 lg:right-auto w-[85vw] max-w-[320px] lg:w-[260px] 
            bg-surface lg:bg-transparent shadow-2xl lg:shadow-none z-[70] lg:z-auto 
            transform transition-transform duration-300 lg:transform-none ease-in-out
            overflow-y-auto lg:overflow-visible flex-shrink-0
            ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            
            {/* Mobile Sidebar Header */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-surface-container-high bg-white sticky top-0 z-10">
              <span className="font-black text-brand-blue tracking-tighter text-lg">Filter Pencarian</span>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-brand-blue bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 lg:p-0 flex flex-col gap-6">
            {/* Search Integrated in Sidebar */}
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30 text-[18px]">search</span>
              <input 
                className="w-full bg-white border border-outline-variant/20 rounded-xl py-2 pl-10 pr-4 text-[0.85rem] font-medium text-brand-blue focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/20" 
                placeholder="Cari spesialisasi atau nama..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-white p-5 rounded-xl border border-outline-variant/20 space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
                <h2 className="font-headline font-bold text-[0.8rem] uppercase tracking-wider text-brand-blue">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-[9px] font-bold text-primary uppercase tracking-wider hover:underline opacity-60"
                >
                  Reset
                </button>
              </div>

              {/* Kota Filter */}
              <div>
                <h3 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Lokasi</h3>
                <div className="relative">
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white border border-outline-variant/20 rounded-lg px-3 py-2 text-[0.8rem] font-medium text-brand-blue appearance-none focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/30 pointer-events-none text-base">expand_more</span>
                </div>
              </div>

              {/* Spesialisasi */}
              <div>
                <h3 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Spesialisasi</h3>
                <div className="flex flex-col gap-2.5">
                  {["Semua Bidang", "Bisnis", "Pidana", "Perdata", "Internasional", "Ketenagakerjaan", "Pajak"].map((spec) => {
                    const isSelected = spec === "Semua Bidang" ? selectedSpecialties.length === 0 : selectedSpecialties.includes(spec);
                    return (
                      <label key={spec} className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio"
                            name="specialty"
                            checked={isSelected}
                            onChange={() => {
                              if (spec === "Semua Bidang") {
                                setSelectedSpecialties([]);
                              } else {
                                setSelectedSpecialties([spec]);
                              }
                            }}
                            className="peer appearance-none w-4 h-4 rounded-full border border-outline-variant/30 checked:border-primary transition-all cursor-pointer"
                          />
                          <div className="absolute w-2 h-2 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none"></div>
                        </div>
                        <span className={`text-[0.8rem] font-medium transition-colors ${isSelected ? "text-brand-blue" : "text-on-surface-variant/60 group-hover:text-brand-blue"}`}>
                          {spec}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pengalaman */}
              <div>
                <h3 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Pengalaman</h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { label: "Junior (0 - 5 Thn)", value: "0-5" },
                    { label: "Senior (5 - 10 Thn)", value: "5-10" },
                    { label: "Expert (10+ Thn)", value: "10+" }
                  ].map((exp) => (
                    <button 
                      key={exp.value}
                      onClick={() => setSelectedExperience(exp.value)}
                      className={`w-full px-3 py-2 rounded-lg text-[0.75rem] font-medium text-left transition-all border ${
                        selectedExperience === exp.value 
                        ? "bg-brand-blue text-white border-brand-blue" 
                        : "bg-white text-on-surface-variant/60 border-outline-variant/20 hover:border-outline-variant/40"
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Rating Minimal</h3>
                <div className="flex gap-1.5">
                  {[4.0, 4.5, 5.0].map((rate) => (
                    <button 
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`flex-1 py-1.5 rounded-lg text-[0.75rem] font-bold transition-all border ${
                        minRating === rate 
                          ? "bg-[#C5A059] text-white border-[#C5A059]" 
                          : "bg-white text-on-surface-variant/60 border-outline-variant/20 hover:border-outline-variant/40"
                      }`}
                    >
                      {rate.toFixed(1)}{rate < 5 ? "+" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status — Prominent Toggle */}
              <div>
                <h3 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Ketersediaan</h3>
                <button
                  onClick={() => setStatusFilter(statusFilter === 'online' ? 'all' : 'online')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[0.75rem] font-bold transition-all border ${
                    statusFilter === 'online'
                    ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                    : 'bg-white text-on-surface-variant/50 border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusFilter === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span>Tersedia Sekarang</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full transition-all duration-300 relative ${statusFilter === 'online' ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${statusFilter === 'online' ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
            </div>
          </aside>

          {/* Lawyers Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[1.5rem] gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredLawyers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[1.5rem] gap-y-10">
                {filteredLawyers.map((lawyer) => (
                  <div 
                    key={lawyer.id} 
                    className="flex flex-col group h-full"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-surface-container aspect-[3/4]">
                      <Image 
                        alt="Lawyer Portrait" 
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" 
                        src={lawyer.image}
                        fill
                        unoptimized
                      />
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <div className="bg-white/80 backdrop-blur-sm rounded-full p-0.5 shadow-sm flex items-center justify-center border border-white/50">
                          <span className="material-symbols-outlined text-[12px] text-blue-500" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        {lawyer.isOnline ? (
                          <span className="bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider">
                            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>Online
                          </span>
                        ) : (
                          <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider">
                            {lawyer.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 flex-grow">
                      <h3 className="font-headline font-bold text-[1rem] text-on-surface tracking-tight">
                        {lawyer.name}
                      </h3>
                      <p className="text-primary font-bold text-[0.7rem] uppercase tracking-wider mb-1.5">{lawyer.specialty}</p>
                      
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[0.75rem] font-bold text-brand-blue">
                            <span className="material-symbols-outlined text-[0.85rem] text-[#C5A059]" style={{fontVariationSettings: "'FILL' 1"}} aria-label="Rating bintang">star</span>
                            {lawyer.rating}
                          </div>
                          <span className="w-px h-2.5 bg-outline-variant/30"></span>
                          <div className="text-on-surface-variant/50 text-[0.7rem] font-medium">({lawyer.reviews} ulasan)</div>
                        </div>

                        <div className="flex items-center gap-2 text-[0.7rem] font-medium transition-colors">
                          <div className="flex items-center gap-0.5 text-[#5C7285]">
                            <span className="material-symbols-outlined text-[0.8rem]">location_on</span>
                            <span>{lawyer.city}</span>
                          </div>
                          <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
                          <span className="text-on-surface-variant/60">{lawyer.experience}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[0.68rem] font-medium text-on-surface-variant/50 mt-0.5">
                          <span className="material-symbols-outlined text-[0.75rem] text-green-500">schedule</span>
                          <span>Resp. {lawyer.isOnline ? '< 30 mnt' : '1–2 jam'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-auto pt-4">
                        <Link 
                          href={`/lawyers/${lawyer.id}`} 
                          className="flex-1 text-center py-1.5 border border-brand-blue text-brand-blue font-bold text-[0.65rem] uppercase tracking-widest rounded-lg hover:bg-brand-blue/5 transition-all"
                        >
                          Lihat Profil
                        </Link>
                        <Link 
                          href={`/checkout/${lawyer.id}`} 
                          className="flex-1 text-center py-1.5 bg-primary text-white font-bold text-[0.65rem] uppercase tracking-widest rounded-lg hover:brightness-90 shadow-md hover:shadow-lg active:scale-95 transition-all transform"
                        >
                          Konsultasi
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-outline-variant/30 text-center px-8">
                <div className="w-20 h-20 rounded-2xl bg-white border border-outline-variant/20 flex items-center justify-center mb-5 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-outline-variant/40">manage_search</span>
                </div>
                <p className="font-headline font-black text-lg text-brand-blue mb-2">Tidak ada pengacara ditemukan</p>
                <p className="text-sm text-on-surface-variant/60 mb-2 max-w-xs leading-relaxed">Coba sesuaikan filter — kurangi spesialisasi, ubah kota, atau nonaktifkan filter rating.</p>
                <p className="text-xs text-on-surface-variant/40 mb-6">Saat ini tersedia <span className="font-bold text-brand-blue">120+</span> advokat aktif di platform.</p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-blue/90 shadow-sm transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
