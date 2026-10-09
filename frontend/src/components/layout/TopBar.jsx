import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, X } from "lucide-react";
import Badge from "../ui/Badge.jsx";

export default function TopBar({
  title = "Good Morning, Anvi",
  subtitle = "Let's turn your story into a structured report.",
  showBack = false,
  showClose = false,
  badgeText,
  badgeVariant = "verified",
  onClose,
}) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100/80">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badgeText && (
              <Badge variant={badgeVariant}>{badgeText}</Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showClose ? (
          <button
            onClick={onClose || (() => navigate("/home"))}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <>
            {/* Bell notification */}
            <button
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            </button>

            {/* User profile avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 overflow-hidden bg-slate-200">
                <img
                  src="/awaaz_hero_illustration.jpg"
                  alt="Anvi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
