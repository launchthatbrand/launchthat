import { formatDistanceToNow } from "date-fns";
import { Trophy } from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";
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
  enableHover?: boolean;
}

export function Achievements({
  achievements,
  enableHover = true,
}: AchievementsProps) {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <GeneralCard
      title="Your Milestones"
      layout="stacked"
      className="!translate-y-0 overflow-hidden"
      enableHoverEffects={enableHover}
      content={
        <div className="flex flex-col">
          {/* Header section with purple background */}
          <div className="border-b bg-[#2b0e4d] p-6 text-white">
            <div className="flex items-center justify-between">
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
            </div>
          </div>

          {/* Achievements grid */}
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "relative overflow-hidden rounded-md border p-4",
                  enableHover && "transition-all duration-200 hover:shadow-md",
                  achievement.earned
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50 opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      achievement.earned ? "bg-amber-100" : "bg-slate-200",
                    )}
                  >
                    <Trophy
                      className={cn(
                        "h-5 w-5",
                        achievement.earned
                          ? "text-amber-600"
                          : "text-slate-400",
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {achievement.description}
                    </p>

                    {achievement.earned && achievement.earnedAt ? (
                      <p className="mt-2 text-xs text-amber-600">
                        Earned{" "}
                        {formatDistanceToNow(new Date(achievement.earnedAt))}{" "}
                        ago
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        Not yet earned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
