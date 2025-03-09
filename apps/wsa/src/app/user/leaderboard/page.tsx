"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DashboardLeaderboard } from "../../_components/dashboard/DashboardLeaderboard";

const queryClient = new QueryClient();

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white pb-32">
        {/* Gradient Background */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-90% to-gray-50" />
        </div>
      </div>

      {/* Content */}
      <div className="container relative mx-auto -mt-32 px-4 pb-12">
        <div className="mx-auto max-w-3xl">
          <DashboardLeaderboard />
        </div>
      </div>
    </div>
  );
}
