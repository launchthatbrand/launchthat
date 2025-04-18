"use client";

import type { Step } from "nextstepjs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { Progress } from "@acme/ui/components/progress";

// Define props based on expected values from nextstepjs
// We will derive isFirstStep and isLastStep inside the component
interface CustomTourCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  // Removed isFirstStep, isLastStep - derive instead
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void; // Made skipTour optional
}

export const CustomTourCard = ({
  step,
  currentStep,
  totalSteps,
  // Removed isFirstStep, isLastStep from destructuring
  nextStep,
  prevStep,
  skipTour, // Still destructure, it might be undefined
}: CustomTourCardProps) => {
  // Derive step position flags
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const progressValue =
    totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="min-w-[250px] max-w-xs rounded-lg border bg-card text-card-foreground shadow-lg">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{step.icon}</span>
            <h3 className="font-semibold leading-none tracking-tight">
              {step.title}
            </h3>
          </div>
          {step.showSkip && skipTour && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={skipTour}
              aria-label="Skip tour"
            >
              <X size={14} />
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{step.content}</div>
      </div>

      {/* Progress and Controls */}
      {step.showControls && (
        <div className="flex items-center justify-between border-t p-3">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>
          <Progress value={progressValue} className="mx-4 h-1.5 w-16" />
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                Prev
              </Button>
            )}
            {!isLastStep ? (
              <Button size="sm" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                size="sm"
                {...(skipTour && { onClick: skipTour })}
                disabled={!skipTour}
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
