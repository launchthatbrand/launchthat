import Link from "next/link";
import { CheckCircle2, ChevronRight, CircleDashed } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
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
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b bg-[#2b0e4d] pb-8 text-white">
        <CardTitle className="flex items-center justify-between">
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
        </CardTitle>
        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#3d1b63]">
          <div
            className="h-full rounded-full bg-[#FC653C] transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-0">
        {steps.map((step, index) => (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              "group grid grid-cols-[24px_1fr_24px] items-start gap-4 border-b border-slate-100 p-4 text-left transition-all hover:bg-slate-50",
              step.completed && "bg-slate-50/50",
            )}
          >
            <div className="mt-1">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-[#FC653C]" />
              ) : (
                <CircleDashed className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="space-y-1">
              <p
                className={cn(
                  "font-medium leading-none",
                  step.completed ? "text-slate-500" : "text-[#2b0e4d]",
                )}
              >
                {step.title}
              </p>
              <p className="text-sm text-slate-500">{step.description}</p>
              {step.eta && !step.completed && (
                <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                  Est. {step.eta}
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FC653C]" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
