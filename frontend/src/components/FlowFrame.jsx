import React from "react";
import AppLayout from "./layout/AppLayout.jsx";
import TopBar from "./layout/TopBar.jsx";
import Stepper from "./ui/Stepper.jsx";

// Map 0-8 original step index to the 6-step UI board stepper
function mapStepToBoardStep(originalStep) {
  if (originalStep === 0 || originalStep === 1) return 1; // Intake -> Analysis
  if (originalStep === 2) return 1; // Analysis
  if (originalStep === 3) return 2; // Fact verification & Q&A -> Missing Info
  if (originalStep === 4) return 3; // Evidence catalog
  if (originalStep === 5) return 4; // Timeline & Authority route
  if (originalStep === 6) return 6; // Draft generation
  if (originalStep === 7) return 6; // Review & audit
  if (originalStep === 8) return 6; // Save & export
  return 1;
}

export default function FlowFrame({ step = 1, title, description, badgeText, badgeVariant = "verified", children }) {
  const boardStep = mapStepToBoardStep(step);

  return (
    <AppLayout>
      <TopBar
        title={title}
        subtitle={description}
        showBack={step > 0}
        badgeText={badgeText}
        badgeVariant={badgeVariant}
      />

      {step > 0 && step < 8 && (
        <div className="mb-6 max-w-4xl mx-auto w-full">
          <Stepper currentStep={boardStep} />
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full space-y-6">
        {children}
      </div>
    </AppLayout>
  );
}
