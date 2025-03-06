import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal, Star, Trophy } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  stats: {
    lessonsCompleted: number;
    tradeIdeasShared: number;
  };
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  className?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Star className="h-5 w-5 text-slate-400" />;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-50 text-yellow-600 border-yellow-100";
    case 2:
      return "bg-gray-50 text-gray-600 border-gray-100";
    case 3:
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export function Leaderboard({ users, className }: LeaderboardProps) {
  return (
    <Card
      className={cn("border border-slate-200 bg-white shadow-sm", className)}
    >
      <CardHeader className="border-b bg-[#2b0e4d] pb-8 text-white">
        <CardTitle className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ TOP TRADERS ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Leaderboard</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              This week's top performers
            </p>
          </div>
          <Trophy className="h-8 w-8 text-[#FC653C]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/wordpress/user/${user.id}`}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-50"
            >
              {/* Rank */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  getRankStyle(user.rank),
                )}
              >
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h4 className="font-medium text-[#2b0e4d] group-hover:text-[#FC653C]">
                  {user.name}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span>{user.stats.lessonsCompleted} lessons completed</span>
                  <span>•</span>
                  <span>{user.stats.tradeIdeasShared} trade ideas</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-sm font-medium text-[#2b0e4d]">
                  {user.points.toLocaleString()} pts
                </div>
                <div className="mt-1 text-xs text-slate-500">This week</div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
