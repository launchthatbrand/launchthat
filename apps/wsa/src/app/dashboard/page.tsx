"use client";

import {
  Achievements,
  CourseProgress,
  FeaturedContent,
  InstructorUpdates,
  OnboardingChecklist,
  TradingNews,
  WelcomeMessage,
} from "../_components/dashboard";
import {
  achievements,
  courseProgress,
  onboardingSteps,
  socialPosts,
  tradingNews,
} from "../_components/dashboard/mock-data";
import { MeshGradient } from "../_components/MeshGradient";

export default function TradingDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white pb-56">
        {/* Gradient Background */}
        <div className="absolute inset-0">
          {/* <MeshGradient className="opacity-50" /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-90% to-white" />
        </div>

        {/* Content */}
        {/* <div className="container relative py-12">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              — IMPROVE YOUR TRADING STRATEGY —
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[#2b0e4d]">
              Wall Street Academy Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Forget the MLM. Forget the Signals. Forget the Bots.
              <br />
              Learn how to trade like a{" "}
              <span className="font-semibold text-[#FC653C]">PRO</span>
            </p>
          </div>
        </div> */}
      </div>

      {/* Dashboard Content */}
      <div className="container relative -mt-48 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-8 lg:col-span-2">
            <FeaturedContent className="" />
            {/* <WelcomeMessage /> */}
            <CourseProgress
              completedLessons={courseProgress.completedLessons}
              totalLessons={courseProgress.totalLessons}
              recentLessons={courseProgress.recentLessons}
            />

            <TradingNews news={tradingNews} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            <OnboardingChecklist steps={onboardingSteps} enableHover={false} />
            <Achievements achievements={achievements} enableHover={false} />
            <InstructorUpdates posts={socialPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
