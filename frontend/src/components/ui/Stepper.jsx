import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export const REPORT_STEPS = [
  { id: 1, key: "analysis", label: "Analysis", path: "/report/analysis" },
  { id: 2, key: "missing-info", label: "Missing Info", path: "/report/missing-info" },
  { id: 3, key: "evidence", label: "Evidence", path: "/report/evidence" },
  { id: 4, key: "timeline", label: "Timeline", path: "/report/timeline-route" },
  { id: 5, key: "route", label: "Route", path: "/report/timeline-route" },
  { id: 6, key: "draft", label: "Draft", path: "/report/drafts" },
];

/**
 * Stepper Component (6 Steps)
 * @param {number} currentStep (1 to 6)
 * @param {function} onStepClick (optional)
 */
export default function Stepper({ currentStep = 1, onStepClick }) {
  return (
    <nav aria-label="Progress Stepper" className="w-full py-2">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {REPORT_STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <Link
                  to={step.path}
                  onClick={(e) => {
                    if (onStepClick) {
                      e.preventDefault();
                      onStepClick(step.id);
                    }
                  }}
                  className="flex items-center gap-2 group transition-all"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-sm ring-4 ring-primary-light"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs transition-colors hidden sm:inline ${
                      isActive
                        ? "font-bold text-primary"
                        : isCompleted
                        ? "font-medium text-slate-700"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </Link>
              </div>

              {/* Connecting line */}
              {index < REPORT_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                    step.id < currentStep ? "bg-primary/40" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
