import React from "react";
import { formatDistanceToNow } from "date-fns";

import { Progress } from "@acme/ui/components/progress";
import { GeneralCard } from "@acme/ui/general/GeneralCard";

const milestones = [
  {
    percent: 0,
    title: "Getting Started",
    description: "Begin your trading journey with basic concepts",
  },
  {
    percent: 25,
    title: "Trading Fundamentals",
    description: "Master the basics of price action and market structure",
  },
  {
    percent: 50,
    title: "Risk Management Pro",
    description: "Complete advanced risk management modules",
  },
  {
    percent: 75,
    title: "Strategy Master",
    description: "Develop and backtest your own trading strategy",
  },
  {
    percent: 100,
    title: "Elite Trader",
    description: "Graduate from the WSA Trading Academy",
  },
];

interface CourseProgressProps {
  completedLessons: number;
  totalLessons: number;
  recentLessons: {
    title: string;
    completedAt: string | null;
    progress: number;
  }[];
}

export function CourseProgress({
  completedLessons,
  totalLessons,
  recentLessons,
}: CourseProgressProps) {
  const targetProgress = (completedLessons / totalLessons) * 100;
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(targetProgress), 500);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  // Find the current milestone based on progress
  const currentMilestone =
    milestones.find(
      (milestone, index) =>
        progress >= milestone.percent ||
        (index === 0 && progress < milestone.percent),
    ) ?? milestones[0];

  // Set default milestone data in case there's an issue
  const milestoneTitle = currentMilestone
    ? currentMilestone.title
    : "Getting Started";
  const milestoneDescription = currentMilestone
    ? currentMilestone.description
    : "Begin your trading journey with basic concepts";

  return (
    <GeneralCard
      layout="stacked"
      className="!translate-y-0 overflow-visible"
      title={
        <div className="border-b bg-[#2b0e4d] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#FC653C]">
                ▬ Course Progress ▬
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                {milestoneTitle}
              </h3>
              <p className="text-sm text-gray-300">{milestoneDescription}</p>
            </div>
            <div className="text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#FC653C] bg-[#2b0e4d]">
                <div className="text-center">
                  <span className="text-2xl font-bold">
                    {Math.round(progress)}%
                  </span>
                  <p className="text-xs text-gray-300">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      content={
        <div className="p-6">
          <h4 className="font-semibold">Recent Lessons</h4>
          <div className="mt-4 space-y-4">
            {recentLessons.map((lesson, i) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <div>
                  <h5 className="font-medium">{lesson.title}</h5>
                  {lesson.completedAt ? (
                    <p className="text-xs text-gray-500">
                      Completed{" "}
                      {formatDistanceToNow(new Date(lesson.completedAt))} ago
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">In progress</p>
                  )}
                </div>
                <div className="flex items-center">
                  <Progress
                    value={lesson.progress}
                    className="h-2 w-20 bg-gray-100"
                  />
                  <span className="ml-2 text-xs">{lesson.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
