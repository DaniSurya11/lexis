"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { ConsultationProvider } from "@/context/ConsultationContext";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Periksa apakah pengguna berada di area dashboard, checkout, booking, atau chat
  const isDashboard = pathname?.startsWith('/dashboard');
  const isCheckout = pathname?.startsWith('/checkout');
  const isBooking = pathname?.startsWith('/booking');
  const isChat = pathname?.startsWith('/chat');
  const isPaymentSuccess = pathname?.startsWith('/payment-success');

  const content = (
    <>
      {/* Navbar dan Footer disembunyikan di halaman aplikasi internal */}
      {!(isDashboard || isCheckout || isBooking || isChat || isPaymentSuccess) && <Navbar />}
      
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      
      {!(isDashboard || isCheckout || isBooking || isChat || isPaymentSuccess) && <Footer />}
    </>
  );

  return (
    <ConsultationProvider>
      {content}
    </ConsultationProvider>
  );
}
