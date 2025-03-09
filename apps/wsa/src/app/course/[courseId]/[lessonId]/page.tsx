"use client";

import { useRef } from "react";
import { SignInButton } from "@clerk/nextjs";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";
import { GeneralCard, GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";

import { useLearndash } from "~/app/hooks/useLearndash";
import { Comments } from "./_components/Comments";
import { ProgressSidebar } from "./_components/ProgressSidebar";
import { VideoPlayer } from "./_components/VideoPlayer";
import { detectVideoInfo } from "./utils";

function LoadingSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <GeneralCardSkeleton
            layout="stacked"
            hasImage={true}
            hasTitle={true}
            hasSubtitle={false}
            hasContent={true}
            contentLines={3}
            className="overflow-hidden"
          />
        </div>

        <div>
          <Card className="sticky top-24 -mt-32 space-y-6 border-0 bg-white">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <div className="grid grid-cols-2 gap-2">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-md" />
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AuthenticationRequired() {
  return (
    <GeneralCard
      layout="stacked"
      className="flex min-h-[300px] flex-col items-center justify-center gap-4 border-none"
      contentClassName="p-8 text-center flex flex-col items-center justify-center gap-4"
      content={
        <>
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to view this lesson content
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </>
      }
    />
  );
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const { useLesson, useRelatedLessons } = useLearndash();
  const decodedLessonId = decodeURIComponent(params.lessonId);

  // Fetch current lesson
  const { data: lesson, isLoading: isLoadingLesson } =
    useLesson(decodedLessonId);

  // Fetch related lessons
  const { data: relatedLessons, isLoading: isLoadingRelated } =
    useRelatedLessons(decodedLessonId);

  if (isLoadingLesson || isLoadingRelated) {
    return <LoadingSkeleton />;
  }

  // Mock data for lesson progress
  const watchProgress = 65; // Percentage of video watched

  // Detect video in content if lesson data exists
  const videoInfo = lesson ? detectVideoInfo(lesson.content) : null;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="order-2 md:order-1 lg:col-span-3">
          <div className="space-y-8">
            {/* Video Section */}
            <GeneralCard
              layout="stacked"
              className="overflow-hidden"
              contentClassName="p-0"
              content={
                lesson && videoInfo ? (
                  <VideoPlayer
                    videoInfo={videoInfo}
                    stickyContainerRef={stickyContainerRef}
                  />
                ) : (
                  <AuthenticationRequired />
                )
              }
            />

            {/* Comments Section */}
            <Comments />
          </div>
        </div>

        {/* Progress Sidebar */}
        <ProgressSidebar
          videoInfo={videoInfo}
          stickyContainerRef={stickyContainerRef}
          watchProgress={watchProgress}
          courseId={params.courseId}
          relatedLessons={relatedLessons}
        />
      </div>
    </div>
  );
}
