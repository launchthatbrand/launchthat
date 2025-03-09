"use client";

import {
  mockComments,
  mockTradeIdeas,
  mockUserProfile,
} from "./_data/mock-data";

import { LessonComments } from "./_components/LessonComments";
import { TradeIdeas } from "./_components/TradeIdeas";
import { UserHeader } from "./_components/UserHeader";

export default function UserProfilePage() {
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
