import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { BookOpen, ClipboardCheck, FileSearch, ShieldCheck } from "lucide-react";

const resources = [
  {
    title: "Tell your story clearly",
    description: "A simple structure for recording what happened, when it happened, and who was involved.",
    icon: BookOpen,
    items: ["Start with the facts", "Use dates and times", "Keep the original wording when it matters"],
  },
  {
    title: "Preserve useful evidence",
    description: "Practical steps for keeping screenshots, links, files, and other details ready for review.",
    icon: FileSearch,
    items: ["Keep original files", "Capture the full context", "Record where each item came from"],
  },
  {
    title: "Prepare before you submit",
    description: "Use this final check to make your report easier for the right authority to understand.",
    icon: ClipboardCheck,
    items: ["Review names and dates", "Mark uncertain details", "Choose the most relevant evidence"],
  },
];

export default function ResourcesPage() {
  return (
    <AppLayout>
      <TopBar
        title="Resources"
        subtitle="Helpful guidance for documenting an incident with clarity and care."
      />

      <div className="space-y-6">
        <Card className="p-6 md:p-8 border-slate-100 shadow-card bg-gradient-to-br from-white via-white to-primary-lavender/25">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary-lavender text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">A calmer way to get organized</h2>
              <p className="text-sm text-slate-500 leading-relaxed mt-1 max-w-2xl">
                These guides are general information. When you are ready, start a report and AWAAZ will help turn your account into a structured record.
              </p>
              <Link to="/home" className="inline-block mt-4">
                <Button variant="pill" size="md" showArrow>Start a New Report</Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.title} className="p-5 space-y-4 border-slate-100 shadow-card">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{resource.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{resource.description}</p>
                </div>
                <ul className="space-y-2 border-t border-slate-100 pt-4">
                  {resource.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
