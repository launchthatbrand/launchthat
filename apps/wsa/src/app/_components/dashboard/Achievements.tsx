import { Medal, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { cn } from "@acme/ui/lib/utils";

interface Achievement {
  id: number;
  title: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b bg-[#2b0e4d] pb-8 text-white">
        <CardTitle className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ ACHIEVEMENTS ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Your Milestones</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Track your trading achievements
            </p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
            {earnedCount}/{achievements.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 p-0">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              "group grid grid-cols-[24px_1fr] items-start gap-4 border-b border-slate-100 p-4 last:border-0",
              achievement.earned && "bg-slate-50/50",
            )}
          >
            <div className="mt-1">
              {achievement.earned ? (
                <Medal className="h-5 w-5 text-[#FC653C]" />
              ) : (
                <Star className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="space-y-1">
              <p
                className={cn(
                  "font-medium leading-none",
                  achievement.earned ? "text-[#2b0e4d]" : "text-slate-500",
                )}
              >
                {achievement.title}
              </p>
              <p className="text-sm text-slate-500">
                {achievement.description}
              </p>
              {achievement.earnedAt && (
                <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
