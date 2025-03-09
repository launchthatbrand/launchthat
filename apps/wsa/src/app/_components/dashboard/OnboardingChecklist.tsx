import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";
import { cn } from "@acme/ui/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
  eta?: string;
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  enableHover?: boolean;
}

export function OnboardingChecklist({
  steps,
  enableHover = true,
}: OnboardingChecklistProps) {
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <GeneralCard
      title="Your Trading Journey"
      layout="stacked"
      className="!transform-none overflow-hidden"
      enableHoverEffects={enableHover}
      content={
        <div className="flex flex-col">
          {/* Purple header section */}
          <div className="border-b bg-[#2b0e4d] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#FC653C]">
                  ▬ GETTING STARTED ▬
                </p>
                <h3 className="mt-2 text-xl font-bold">Your Trading Journey</h3>
                <p className="mt-1 text-sm font-normal text-gray-300">
                  Complete these steps to begin
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                {completedSteps}/{steps.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-[#FC653C] transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="grid gap-2 p-0">
            {steps.map((step, _index) => (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  "group relative flex items-start gap-4 border-b p-4 last:border-0",
                  enableHover && "hover:bg-slate-50",
                  step.completed && "bg-slate-50/80",
                )}
              >
                <div className="mt-0.5">
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-5 w-5 text-slate-300",
                        enableHover && "group-hover:text-slate-400",
                      )}
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{step.title}</div>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                {step.eta && !step.completed && (
                  <div className="ml-auto text-xs text-slate-500">
                    ~{step.eta}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      }
    />
  );
}
