import React from "react";
import fullLogo from "../../assets/awaaz-logo-full.svg";
import emblemLogo from "../../assets/awaaz-logo-emblem.svg";
import wordmarkLogo from "../../assets/awaaz-wordmark.svg";

/**
 * Official Awaaz Logo Component
 * @param {'full' | 'emblem' | 'wordmark'} variant
 * @param {'sm' | 'md' | 'lg' | string} size
 * @param {string} className
 */
export default function Logo({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  source,
}) {
  const sizeMap = {
    sm: variant === "emblem" ? "h-7 w-7" : "h-7 w-auto",
    md: variant === "emblem" ? "h-10 w-10" : "h-10 w-auto",
    lg: variant === "emblem" ? "h-14 w-14" : "h-14 w-auto",
    xl: variant === "emblem" ? "h-20 w-20" : "h-18 w-auto",
  };

  const selectedSizeClass = sizeMap[size] || size;

  let logoSrc = source || fullLogo;
  let altText = "Awaaz - When Silence Isn't Safe, Awaaz Is";

  if (variant === "emblem") {
    logoSrc = emblemLogo;
    altText = "Awaaz Protective Shield Emblem";
  } else if (variant === "wordmark") {
    logoSrc = wordmarkLogo;
    altText = "Awaaz Wordmark";
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt={altText}
        className={`${selectedSizeClass} object-contain transition-transform`}
      />
      {showTagline && (
        <span className="text-xs text-slate-500 font-medium tracking-tight">
          When Silence Isn't Safe, Awaaz Is.
        </span>
      )}
    </div>
  );
}
