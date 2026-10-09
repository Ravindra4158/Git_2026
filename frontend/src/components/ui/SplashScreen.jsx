import React from "react";
import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import { ShieldCheck, Sparkles, Navigation, Users } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const featureStrip = [
    { label: "Anonymous Reporting", icon: ShieldCheck },
    { label: "AI-Powered Drafts", icon: Sparkles },
    { label: "Right Authority Selection", icon: Navigation },
    { label: "Safer Communities", icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-br from-[#491073] via-[#7B1268] to-[#BC197E] text-white">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="h-6" />

      {/* Center Logo & Tagline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-6">
          <Logo variant="full" size="xl" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl font-medium tracking-wide text-brand-lightPlum drop-shadow-sm"
        >
          When Silence Isn't Safe, Awaaz Is.
        </motion.p>
      </motion.div>

      {/* Bottom Feature Strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
          {featureStrip.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-white/90"
              >
                <div className="p-1.5 rounded-lg bg-white/15 text-white">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {onFinish && (
          <div className="mt-6 text-center">
            <button
              onClick={onFinish}
              className="px-6 py-2.5 rounded-xl bg-white text-brand-plum font-semibold text-sm shadow-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              Continue to App →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
