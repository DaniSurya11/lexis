export const metadata = {
  title: "Dashboard Klien",
  description: "Kelola sesi konsultasi hukum, lihat riwayat, dan pantau status booking Anda di dashboard Lexis Premium.",
};

import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface w-full">
      <DashboardSidebar />
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
