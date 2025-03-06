import { Book, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Progress } from "@/components/ui/progress";
import React from "react";
import { cn } from "@/lib/utils";

interface MilestoneProps {
  percent: number;
  title: string;
  description: string;
}

const milestones: MilestoneProps[] = [
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

  return (
    <Card className="overflow-visible border border-slate-200 bg-white shadow-sm">
      <CardHeader className="rounded-t-lg border-b bg-[#2b0e4d] pb-8 text-white">
        <CardTitle className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ YOUR PROGRESS ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Course Completion</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Track your learning journey
            </p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
            {completedLessons}/{totalLessons} lessons
          </span>
        </CardTitle>
        {/* Progress bar with milestones */}
        <div className="relative mt-4">
          <div className="relative h-2 w-full">
            <Progress value={progress} className="h-2 [&>div]:bg-[#FC653C]" />
            {/* Milestone ticks */}
            <div className="absolute inset-0 flex">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ left: `${milestone.percent}%`, marginLeft: "-1px" }}
                >
                  <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger asChild>
                      <button className="group absolute">
                        {/* Visual tick line */}
                        <div className="absolute bottom-[-8px] h-6 w-1 -translate-x-1/2 rounded-full bg-white/30 transition-colors group-hover:bg-white/50" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-64 bg-white p-3"
                      align="center"
                      sideOffset={20}
                      side="top"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-[#2b0e4d]">
                          {milestone.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {milestone.description}
                        </p>
                        <div className="mt-2 text-xs font-medium text-[#FC653C]">
                          {milestone.percent}% Completion
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {recentLessons.map((lesson, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] items-center gap-4 p-4"
            >
              <div className="space-y-1">
                <p className="font-medium text-[#2b0e4d]">{lesson.title}</p>
                <div className="flex items-center gap-2">
                  {lesson.completedAt ? (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {new Date(lesson.completedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#FC653C]">
                      <Book className="h-3 w-3" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-[100px] text-right">
                <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">
                  {lesson.progress}% Complete
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
