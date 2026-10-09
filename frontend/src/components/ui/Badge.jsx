import React from "react";
import { Check, AlertCircle, Clock } from "lucide-react";

/**
 * Reusable Badge Component
 * @param {'verified' | 'missing' | 'in-progress' | 'draft' | 'completed' | 'recommended'} variant
 */
export default function Badge({
  variant = "verified",
  children,
  className = "",
  showIcon = true,
}) {
  const badgeConfig = {
    verified: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      defaultText: "Verified",
      icon: Check,
    },
    missing: {
      bg: "bg-orange-50 text-orange-700 border-orange-200/80",
      defaultText: "Missing",
      icon: AlertCircle,
    },
    "in-progress": {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      defaultText: "In Progress",
      icon: Clock,
    },
    draft: {
      bg: "bg-purple-50 text-purple-700 border-purple-200/80",
      defaultText: "Draft",
      icon: Clock,
    },
    completed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      defaultText: "Completed",
      icon: Check,
    },
    recommended: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium",
      defaultText: "Recommended",
      icon: Check,
    },
  };

  const current = badgeConfig[variant] || badgeConfig.verified;
  const IconComponent = current.icon;
  const content = children || current.defaultText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />}
      <span>{content}</span>
    </span>
  );
}
