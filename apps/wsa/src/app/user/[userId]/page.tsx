"use client";

import { User, useUsers } from "../hooks/useUsers";
import { mockComments, mockTradeIdeas } from "./_data/mock-data";

import { LessonComments } from "./_components/LessonComments";
import { TradeIdeas } from "./_components/TradeIdeas";
import { useParams } from "next/navigation";

// Define local interface to handle typed results
interface UserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  // Use the useUser hook with type assertion
  const { user, isLoading, error } = useUsers().useUser(userId) as UserResult;

  // Log data for debugging
  console.log("User data:", user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-12">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            User not found or error loading user data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white pb-32">
        {/* Gradient Background */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-90% to-gray-50" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="container relative -mt-32 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-8 lg:col-span-2">
            <TradeIdeas tradeIdeas={mockTradeIdeas} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            <LessonComments comments={mockComments} />
          </div>
        </div>
      </div>
    </div>
  );
}
