"use client";

import { useState } from "react";

export default function ComingSoonAction({ children, className }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
    
    // Auto hide after 2.5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  };

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-surface-container-highest/95 backdrop-blur-md px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-outline-variant/30 mt-auto mb-24">
            <span className="material-symbols-outlined text-primary text-xl">construction</span>
            <span className="text-sm font-extrabold text-on-surface tracking-wide">Fitur sedang dalam pengembangan!</span>
          </div>
        </div>
      )}
    </>
  );
}
