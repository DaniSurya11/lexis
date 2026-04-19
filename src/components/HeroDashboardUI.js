"use client";

import React from "react";
import Image from "next/image";

export default function HeroDashboardUI() {
  return (
    <div className="relative w-full max-w-[320px] xl:max-w-[330px] mx-auto perspective-[1200px] group drop-shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
      {/* 3D Transform Container */}
      <div 
        className="w-full relative transition-transform duration-1000 ease-out preserve-3d group-hover:transform-none"
        style={{ transform: 'rotateY(-10deg) rotateX(4deg) rotateZ(-1deg)' }}
      >
        {/* Precision Background Animated SVG Lines connecting seamlessly to cards */}
        <div className="absolute inset-x-[-120px] inset-y-[-40px] pointer-events-none z-0 overflow-visible transform translate-z-[-5px]">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 560 540" fill="none">
            <defs>
               <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
               </linearGradient>
               <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur1" />
                  <feGaussianBlur stdDeviation="1" result="blur2" />
                  <feMerge>
                     <feMergeNode in="blur1"/>
                     <feMergeNode in="blur2"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
            </defs>
            <style>
              {`
                .draw-line {
                  stroke-dasharray: 400;
                  stroke-dashoffset: 400;
                  animation: draw 1.5s ease-out 0.5s forwards;
                }
                .flow-line {
                  stroke-dasharray: 40 400;
                  animation: flow 3s linear infinite;
                }
                @keyframes draw {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes flow {
                  from { stroke-dashoffset: 440; }
                  to { stroke-dashoffset: -40; }
                }
              `}
            </style>

            {/* Static Ghost Paths (Minimalist trace) */}
            <g strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" stroke="white" className="draw-line">
              <path d="M 120 160 L 90 160 Q 80 160 80 150 L 80 80 Q 80 70 70 70 L 10 70" />
              <path d="M 120 320 L 90 320 Q 80 320 80 330 L 80 410 Q 80 420 70 420 L -20 420" />
              <path d="M 440 200 L 470 200 Q 480 200 480 190 L 480 130 Q 480 120 490 120 L 550 120" />
              <path d="M 440 380 L 470 380 Q 480 380 480 390 L 480 470 Q 480 480 490 480 L 550 480" />
            </g>

            {/* Animated Pulses (Abstract, Elegant threads) */}
            <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
              <path d="M 120 160 L 90 160 Q 80 160 80 150 L 80 80 Q 80 70 70 70 L 10 70" stroke="url(#flow-gradient)" className="flow-line" style={{ animationDelay: '0.5s' }} />
              <path d="M 120 320 L 90 320 Q 80 320 80 330 L 80 410 Q 80 420 70 420 L -20 420" stroke="url(#flow-gradient)" className="flow-line" style={{ animationDelay: '1.2s', animationDuration: '3.5s' }} />
              <path d="M 440 200 L 470 200 Q 480 200 480 190 L 480 130 Q 480 120 490 120 L 550 120" stroke="url(#flow-gradient)" className="flow-line" style={{ animationDelay: '0.8s' }} />
              <path d="M 440 380 L 470 380 Q 480 380 480 390 L 480 470 Q 480 480 490 480 L 550 480" stroke="url(#flow-gradient)" className="flow-line" style={{ animationDelay: '1.5s', animationDuration: '4.2s' }} />
            </g>
          </svg>
        </div>

        {/* --- 4 DISTINCTLY COLORED FLOATING CARDS --- */}

        {/* Card 1: Total Crawlers (TL) - Solid Navy */}
        <div className="absolute top-12 -left-16 z-40 animate-float-organic [animation-delay:200ms] transform translate-z-[35px]">
          <div className="bg-gradient-to-br from-[#121E31] to-[#1B2B44] p-3.5 rounded-[20px] shadow-[0_15px_30px_rgba(0,0,0,0.2)] w-32 flex flex-col justify-between border border-white/10">
            <div className="flex flex-col gap-1.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <span className="font-sans font-black text-white text-[16px]">A</span>
              </div>
              <span className="text-[7.5px] font-bold text-white/50 tracking-wider uppercase">Total Crawlers</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[22px] font-black text-white leading-none tracking-tight">1450</p>
              <div className="flex items-center gap-1 text-[#1B2B44] bg-white rounded-full px-1.5 py-0.5 border border-white/20 shadow-sm">
                 <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                    <path d="M6 9l6 6 6-6"/>
                 </svg>
                 <span className="text-[7.5px] font-bold">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Conversion Rate (TR) - Solid Premium Blue */}
        <div className="absolute top-16 -right-16 z-40 animate-float-organic [animation-delay:400ms] transform translate-z-[45px]">
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-3.5 rounded-[20px] shadow-[0_15px_30px_rgba(59,130,246,0.3)] w-32 flex flex-col justify-between border border-blue-400/30">
             <div className="flex flex-col gap-1.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                   <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
                </svg>
              </div>
              <span className="text-[7.5px] font-bold text-white/70 tracking-wider uppercase">Conversion Rate</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[22px] font-black text-white leading-none tracking-tight">18%</p>
              <div className="flex items-center gap-1 text-[#2563EB] bg-white rounded-full px-1.5 py-0.5 shadow-sm">
                 <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3l14 9-14 9z"/>
                 </svg>
                 <span className="text-[7.5px] font-black tracking-tight">Steady</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Daily Messages (BL) - Pristine White (Highlighting the Chart) */}
        <div className="absolute bottom-[4.5rem] -left-20 z-40 animate-float-organic [animation-delay:600ms] transform translate-z-[45px]">
          <div className="bg-white p-3 rounded-[20px] shadow-[0_15px_30px_rgba(0,0,0,0.1)] w-[190px] border border-black/[0.02]">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[7.5px] font-bold text-[#1B2B44]/50 tracking-wide uppercase px-1">Daily Messages</span>
                <div className="flex items-center gap-0.5 text-[7px] font-bold text-[#1B2B44]/40">
                   <span>Sort by Daily</span>
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                   </svg>
                </div>
             </div>
             <div className="h-[45px] w-full relative">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d">
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#F8F9FA" strokeWidth="1" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#F8F9FA" strokeWidth="1" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#F8F9FA" strokeWidth="1" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#F8F9FA" strokeWidth="1" />
                  <path d="M0 35 L 20 28 L 40 10 L 60 25 L 80 15 L 100 5 V 40 H 0 Z" fill="url(#mini-chart)" opacity="0.1" />
                  <path d="M0 35 L 20 28 L 40 10 L 60 25 L 80 15 L 100 5" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                     <linearGradient id="mini-chart" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#60A5FA" />
                        <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                </svg>
             </div>
          </div>
        </div>

        {/* Card 4: Total AI Agents (BR) - Solid Premium Teal */}
        <div className="absolute -bottom-2 -right-16 z-40 animate-float-organic [animation-delay:800ms] transform translate-z-[55px]">
          <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] p-3.5 rounded-[20px] shadow-[0_15px_30px_rgba(20,184,166,0.3)] w-32 flex flex-col justify-between border border-teal-400/30">
            <div className="flex flex-col gap-1.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h5V5.73A2 2 0 0 1 8 4a2 2 0 0 1 4-2zm-1 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                 </svg>
              </div>
              <span className="text-[7.5px] font-bold text-white/70 tracking-wider uppercase">Total AI Agents</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[22px] font-black text-white leading-none tracking-tight">1450</p>
              <div className="flex items-center gap-0.5 text-[#0D9488] bg-white rounded-full px-1.5 py-0.5 shadow-sm">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" className="mt-0.5">
                    <path d="M12 3L22 20H2L12 3Z"/>
                 </svg>
                 <span className="text-[7.5px] font-black">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="relative z-20 w-full min-h-[460px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col border border-black/[0.03] transform translate-z-[10px]">
          {/* Header */}
          <div className="px-5 pt-5 pb-1 shrink-0">
            <div className="flex items-center justify-between mb-4">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B2B44]/20 cursor-pointer hover:text-[#1B2B44]/60">
                 <path d="M19 12H5M12 19l-7-7 7-7"/>
               </svg>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&h=80&auto=format&fit=crop" alt="avatar" width={28} height={28} />
                </div>
                <span className="font-bold text-[#1B2B44] text-[12px] tracking-tight">Adalyn</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#1B2B44]/20 cursor-pointer hover:text-[#1B2B44]/60">
                 <circle cx="5" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/>
              </svg>
            </div>

            <h2 className="text-center text-[22px] font-black text-[#1B2B44] mb-5 tracking-tighter">Chat With Us</h2>

            {/* Tabs */}
            <div className="flex bg-[#F8F9FA] rounded-[16px] p-1.5 mb-1 mx-1 border border-black/[0.02]">
              <button className="flex-1 py-1.5 bg-white text-[#1B2B44] rounded-[12px] text-[9px] font-bold shadow-sm flex items-center justify-center gap-1.5 border border-black/[0.03]">
                 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                 </svg>
                Chat
              </button>
              <button className="flex-1 py-1.5 text-[#1B2B44]/40 text-[9px] font-bold flex items-center justify-center gap-1.5">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                 </svg>
                Helpdesk
              </button>
              <button className="flex-1 py-1.5 text-[#1B2B44]/40 text-[9px] font-bold flex items-center justify-center gap-1.5">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                 </svg>
                History
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 px-5 py-2 space-y-3 overflow-y-hidden max-h-[260px]">
            {/* Me */}
            <div className="flex flex-col items-start gap-1">
              <p className="text-[8px] font-bold text-[#1B2B44]/30 ml-2">Me</p>
              <div className="bg-[#F8F9FA] px-4 py-2.5 rounded-[16px] rounded-tl-none max-w-[85%]">
                <p className="text-[10px] text-[#1B2B44] font-medium leading-[1.6]">Hi ! Do you Have Some Formal dress Suggest?</p>
              </div>
            </div>
            
            {/* Adalyn */}
            <div className="flex flex-col items-start gap-1">
               <div className="flex items-center gap-1.5 ml-1">
                  <div className="w-4 h-4 rounded-full overflow-hidden">
                     <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=40&h=40&auto=format&fit=crop" alt="ai" width={16} height={16} />
                  </div>
                  <span className="text-[8px] font-bold text-[#1B2B44]/30">Adalyn</span>
               </div>
               <div className="w-full space-y-1.5 pr-6">
                  <div className="bg-[#5698FF] px-4 py-2.5 rounded-[16px] rounded-tl-none text-white w-full shadow-[0_2px_10px_rgba(86,152,255,0.15)]">
                    <p className="text-[10px] font-medium leading-[1.6] tracking-wide text-white/95">Sure! Absolutely!</p>
                  </div>
                  <div className="bg-[#5698FF] px-4 py-2.5 rounded-[16px] rounded-tl-none text-white w-full shadow-[0_2px_10px_rgba(86,152,255,0.15)]">
                    <p className="text-[10px] font-medium leading-[1.6] tracking-wide text-white/95">We've Suggested Some formal dress For you</p>
                  </div>
               </div>
            </div>

            {/* Me */}
            <div className="flex flex-col items-start gap-1">
              <p className="text-[8px] font-bold text-[#1B2B44]/30 ml-2">Me</p>
              <div className="bg-[#F8F9FA] px-4 py-2.5 rounded-[16px] rounded-tl-none max-w-[85%]">
                <p className="text-[10px] text-[#1B2B44] font-medium leading-[1.6]">Black and White combination is Perfect!</p>
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <div className="px-5 pt-1 pb-4 mt-auto bg-white border-t border-[#1B2B44]/[0.03]">
             <div className="flex items-center justify-between mb-2 px-0.5 mt-2">
                <p className="text-[7.5px] font-bold text-[#1B2B44]/40">By chatting, you agree to our privacy policy.</p>
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B2B44]/20">
                    <path d="M6 9l6 6 6-6"/>
                 </svg>
             </div>
             
             <div className="border border-black/[0.04] rounded-[14px] p-1.5 pl-3.5 flex items-center bg-white shadow-sm">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-grow bg-transparent text-[10px] font-medium text-[#1B2B44] focus:outline-none placeholder:text-[#1B2B44]/30" 
                  readOnly 
                />
                <button className="w-8 h-8 flex items-center justify-center text-[#5698FF] bg-blue-50/50 rounded-[10px]">
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-12 translate-x-[1px]">
                     <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                   </svg>
                </button>
             </div>
             <p className="text-center mt-3 text-[7.5px] font-bold text-[#1B2B44]/30 tracking-wide">
                Powered by NextChat
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
