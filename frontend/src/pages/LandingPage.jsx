import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Cpu, ShieldCheck, Lock } from "lucide-react";

export default function LandingPage() {
  const trustBadges = [
    { label: "AI-Assisted", icon: Cpu },
    { label: "Human-Verified", icon: ShieldCheck },
    { label: "Privacy-First", icon: Lock },
  ];

  return (
    <AppLayout>
      <TopBar
        title="From your story to a verified report"
        subtitle="Describe what happened. We organize the rest with AI, accuracy and care."
      />

      <Card className="min-h-[calc(100vh-8rem)] p-6 md:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-center border-slate-100 shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Copy */}
            <div className="space-y-5 lg:space-y-6 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-[#1E1B4B] leading-[1.1] tracking-tight">
                From a confusing
                <br />
                incident story to a{" "}
                <span className="text-primary block mt-1">verified report.</span>
              </h1>

              <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-md">
                Describe what happened. We organize the rest — with AI, accuracy and care.
              </p>

              <div>
                <Link to="/home">
                  <Button variant="pill" size="lg" showArrow className="px-8 py-3.5 text-base shadow-lg shadow-primary/25">
                    Start New Report
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium pt-2">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.label} className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-600">
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Art Illustration */}
            <div className="relative flex justify-center items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-soft border border-slate-100 w-full max-w-xl group">
                <img
                  src="/awaaz_hero_illustration.jpg"
                  alt="Awaaz - From story to structured report"
                  className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
            </div>
        </div>
      </Card>
    </AppLayout>
  );
}
