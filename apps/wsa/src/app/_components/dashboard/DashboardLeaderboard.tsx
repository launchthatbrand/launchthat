import { Leaderboard } from "./Leaderboard";
import { useLeaderboard } from "./hooks/useLeaderboard";

export function DashboardLeaderboard() {
  const { data, isLoading, error } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="text-sm text-slate-500">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="text-sm text-red-500">
          Error loading leaderboard. Please try again later.
        </div>
      </div>
    );
  }

  if (!data?.users.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200 bg-white">
        <div className="text-sm text-slate-500">No users found.</div>
      </div>
    );
  }

  return <Leaderboard users={data.users} />;
}
