import React from "react";
import Badge from "./Badge.jsx";
import { Image, Link2, FileText, ChevronRight } from "lucide-react";

/**
 * FileRow Component
 * @param {object} file { id, name, meta, status, fileType }
 */
export default function FileRow({ file, onClick }) {
  const getIcon = () => {
    switch (file.fileType) {
      case "image":
        return <Image className="w-5 h-5 text-slate-700" />;
      case "link":
        return <Link2 className="w-5 h-5 text-slate-700" />;
      case "document":
      default:
        return <FileText className="w-5 h-5 text-slate-700" />;
    }
  };

  const isVerified = file.status === "Verified";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-primary-border hover:shadow-sm transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Thumbnail / Icon container */}
        <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-white/80">{getIcon()}</div>
          )}
        </div>

        {/* Text info */}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {file.name}
          </h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">{file.meta}</p>
        </div>
      </div>

      {/* Status & action */}
      <div className="flex items-center gap-2.5 shrink-0 pl-3">
        <Badge variant={isVerified ? "verified" : "missing"}>
          {file.status}
        </Badge>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}
