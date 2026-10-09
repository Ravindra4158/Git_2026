import React from "react";
import { Check, Circle } from "lucide-react";

/**
 * ChecklistItem Component
 * @param {string} label
 * @param {boolean} checked
 * @param {function} onToggle
 */
export default function ChecklistItem({ label, checked = false, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 py-2 text-sm text-slate-700 hover:text-slate-900 transition-colors select-none cursor-pointer"
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
          checked
            ? "bg-emerald-500 text-white shadow-sm"
            : "border-2 border-slate-300 text-transparent"
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>
      <span className={`${checked ? "font-medium text-slate-800" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}
