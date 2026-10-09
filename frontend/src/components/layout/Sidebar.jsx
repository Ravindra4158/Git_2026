import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo.jsx";
import {
  Home,
  FilePlus,
  FolderGit2,
  BookOpen,
  Search,
  HelpCircle,
  Paperclip,
  GitCommit,
  FileText,
  Edit3,
  ExternalLink,
} from "lucide-react";

export default function Sidebar({ className = "", onNavigate }) {
  const location = useLocation();

  const primaryNav = [
    { label: "Home", path: "/home", icon: Home, activeOn: ["/", "/home"] },
    { label: "New Report", path: "/home", icon: FilePlus, activeOn: [] },
    { label: "My Reports", path: "/home", icon: FolderGit2, activeOn: [] },
    { label: "Resources", path: "/resources", icon: BookOpen, activeOn: ["/resources"] },
  ];

  const workflowNav = [
    { label: "1. Incident Analysis", path: "/report/analysis", icon: Search },
    { label: "2. Missing Info", path: "/report/missing-info", icon: HelpCircle },
    { label: "3. Evidence Manager", path: "/report/evidence", icon: Paperclip },
    { label: "4. Timeline & Route", path: "/report/timeline-route", icon: GitCommit },
    { label: "5. Authority Drafts", path: "/report/drafts", icon: FileText },
    { label: "6. Report Editor", path: "/report/editor", icon: Edit3 },
  ];

  function navClass(isActive) {
    return `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
      isActive
        ? "bg-[#EEEBFE] text-primary font-bold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;
  }

  return (
    <aside
      className={`w-64 bg-white/95 backdrop-blur-md border-r border-slate-100 flex flex-col justify-between p-4 min-h-screen select-none shrink-0 ${className}`}
    >
      <div className="space-y-5 overflow-y-auto pr-1">
        <Link to="/" onClick={onNavigate} className="block pt-1 px-2 group">
          <Logo variant="full" size="md" source="/awaaz_brand_logo.svg" />
        </Link>

        <div className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.activeOn.includes(location.pathname);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onNavigate}
                className={navClass(isActive)}
              >
                <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? "text-primary" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
            Incident Pipeline
          </span>
          {workflowNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onNavigate}
                className={navClass(isActive)}
              >
                <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? "text-primary" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 px-2 text-xs text-slate-400">
        <Link
          to="/"
          onClick={onNavigate}
          className="font-bold text-slate-700 hover:text-primary transition-colors flex items-center justify-between"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
        <p className="mt-1 text-[10px] text-slate-400 leading-tight">
          When Silence Isn't Safe, Awaaz Is.
        </p>
      </div>
    </aside>
  );
}
