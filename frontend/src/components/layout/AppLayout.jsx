import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Logo from "../ui/Logo.jsx";

export default function AppLayout({ children, showSidebar = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-watercolor-leaves lg:flex">
      {showSidebar && (
        <>
          <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:shrink-0">
            <Sidebar />
          </div>

          <div className="lg:hidden sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
            <Logo variant="wordmark" size="sm" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-full w-[82vw] max-w-xs bg-white shadow-modal" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <Logo variant="wordmark" size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <Sidebar className="!w-full !min-h-[calc(100vh-57px)] !border-r-0" onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}

      <main className="relative z-10 flex-1 min-w-0 w-full px-4 py-5 sm:px-6 md:p-8 lg:max-w-[calc(100vw-16rem)] xl:max-w-7xl xl:mx-auto">
        {children}
      </main>
    </div>
  );
}
