import React from "react";
import { Home, FileText, User } from "lucide-react";

/**
 * PhoneFrame Component - renders mobile prototype screen
 */
export default function PhoneFrame({ children, activeTab = "reports" }) {
  return (
    <div className="w-[310px] h-[620px] bg-slate-900 rounded-[44px] p-3 shadow-phone border-4 border-slate-800 relative flex flex-col select-none mx-auto">
      {/* Speaker notch */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
        <div className="w-10 h-1 bg-slate-700/60 rounded-full" />
      </div>

      {/* Screen container */}
      <div className="w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col relative z-10 border border-slate-200/50">
        {/* Status bar */}
        <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[10px] font-semibold text-slate-500">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4 h-2 rounded-sm border border-slate-400 p-0.5">
              <div className="h-full bg-slate-600 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t border-slate-100 py-2.5 px-6 flex justify-around items-center shrink-0">
          <button
            type="button"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === "home" ? "text-primary font-semibold" : "text-slate-400"
            }`}
          >
            <Home className="w-4 h-4 stroke-[1.8]" />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === "reports" ? "text-primary font-semibold" : "text-slate-400"
            }`}
          >
            <FileText className="w-4 h-4 stroke-[1.8]" />
            <span>Reports</span>
          </button>
          <button
            type="button"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === "profile" ? "text-primary font-semibold" : "text-slate-400"
            }`}
          >
            <User className="w-4 h-4 stroke-[1.8]" />
            <span>Profile</span>
          </button>
        </div>

        {/* Bottom home indicator */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto my-1 shrink-0" />
      </div>
    </div>
  );
}
