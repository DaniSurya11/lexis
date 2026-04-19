"use client";

/**
 * Lexis Premium — Skeleton Screen Components
 * 
 * Gunakan saat data sedang dimuat (loading state)
 * untuk memberikan kesan instant dan premium.
 */

/** Skeleton bar dasar — untuk teks/judul */
export function SkeletonBar({ className = "" }) {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
    />
  );
}

/** Skeleton untuk Avatar / Foto Profil */
export function SkeletonAvatar({ size = "md" }) {
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size] || "w-12 h-12";

  return <div className={`skeleton-shimmer rounded-full ${sizeClass}`} />;
}

/** Skeleton Card — untuk kartu booking/lawyers */
export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 space-y-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-2">
          <SkeletonBar className="h-4 w-3/5" />
          <SkeletonBar className="h-3 w-2/5" />
        </div>
      </div>
      <SkeletonBar className="h-3 w-full" />
      <SkeletonBar className="h-3 w-4/5" />
      <div className="flex gap-3 pt-2">
        <SkeletonBar className="h-9 w-28 rounded-xl" />
        <SkeletonBar className="h-9 w-20 rounded-xl" />
      </div>
    </div>
  );
}

/** Skeleton untuk Stat Card di dashboard */
export function SkeletonStatCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 space-y-3 overflow-hidden">
      <SkeletonBar className="h-3 w-24" />
      <SkeletonBar className="h-10 w-16" />
      <SkeletonBar className="h-3 w-32" />
    </div>
  );
}

/** Skeleton untuk list item teks */
export function SkeletonListItem() {
  return (
    <div className="p-4 rounded-xl border border-outline-variant/10 space-y-2 overflow-hidden">
      <div className="flex justify-between">
        <SkeletonBar className="h-3 w-36" />
        <SkeletonBar className="h-3 w-14" />
      </div>
      <SkeletonBar className="h-2 w-28" />
    </div>
  );
}

/** Skeleton untuk halaman profil pengacara */
export function SkeletonLawyerHero() {
  return (
    <div className="bg-surface-container-low rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row border border-outline-variant/20">
      <div className="w-full md:w-[420px] aspect-[4/5] md:aspect-auto skeleton-shimmer" />
      <div className="flex-1 p-8 lg:p-12 space-y-6">
        <div className="space-y-3">
          <SkeletonBar className="h-10 w-4/5" />
          <SkeletonBar className="h-4 w-2/5" />
        </div>
        <div className="flex gap-4">
          <SkeletonBar className="h-20 w-28 rounded-xl" />
          <SkeletonBar className="h-20 w-28 rounded-xl" />
          <SkeletonBar className="h-20 w-28 rounded-xl" />
        </div>
        <SkeletonBar className="h-12 w-48 rounded-xl" />
      </div>
    </div>
  );
}

/** Dashboard loading skeleton (full page state) */
export function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="xl:col-span-4 space-y-4">
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </div>
      </div>
    </div>
  );
}
