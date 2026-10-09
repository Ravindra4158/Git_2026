import React from "react";

/**
 * Reusable Card Component
 * white, rounded-2xl, 1px very light border, soft diffuse shadow
 */
export default function Card({
  children,
  className = "",
  padding = "p-6",
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100/90 shadow-card ${
        hover ? "transition-all duration-200 hover:shadow-card-hover hover:border-primary-border/60 cursor-pointer" : ""
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
