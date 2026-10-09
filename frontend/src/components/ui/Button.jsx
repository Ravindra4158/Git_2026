import React from "react";
import { ArrowRight } from "lucide-react";

/**
 * Reusable AWAAZ button.
 * Supports text, icons, and mixed children without breaking spacing.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  showArrow = false,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-6 py-3 text-base gap-2.5 rounded-2xl",
    pill: "px-6 py-2.5 text-sm gap-2 rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-md",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm",
    ghost:
      "bg-transparent hover:bg-primary-lavender/50 text-slate-700 hover:text-primary",
    pill:
      "bg-brand-gradient hover:brightness-105 text-white shadow-md shadow-brand-magenta/20",
  };

  const selectedSize = variant === "pill" ? sizeStyles.pill : sizeStyles[size] || sizeStyles.md;
  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const isPlainText = typeof children === "string" || typeof children === "number";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {isPlainText ? <span>{children}</span> : children}
      {showArrow && <ArrowRight className="w-4 h-4 shrink-0 stroke-[2]" />}
    </button>
  );
}
