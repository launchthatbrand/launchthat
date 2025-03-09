"use client";

import { Card, CardContent } from "@acme/ui/components/card";
import { CheckCircle, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { GeneralCard, GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";
import { useEffect, useRef, useState } from "react";

import { Button } from "@acme/ui/components/button";
import { Comments } from "./_components/Comments";
import { ProgressSidebar } from "./_components/ProgressSidebar";
import { Skeleton } from "@acme/ui/components/skeleton";
import { VideoPlayer } from "./_components/VideoPlayer";
import { detectVideoInfo } from "./utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useLearndash } from "~/app/hooks/useLearndash";
import { useRouter } from "next/navigation";

// Rating component for lessons
function LessonRating({ onRate }: { onRate: (rating: number) => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleRate = (value: number) => {
    setRating(value);
    onRate(value);
  };

  return (
    <div className="flex flex-col items-center">
      {/* <span className="mb-1 text-sm font-medium text-muted-foreground">
        Rate this lesson
      </span> */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={`h-6 w-6 ${
                (hoveredRating ? value <= hoveredRating : value <= rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="mt-1 text-xs text-green-600">
          Thanks for your feedback!
        </span>
      )}
    </div>
  );
}

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
  const router = useRouter();

  // Get the current URL for redirection after login
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleSignInClick = () => {
    // Redirect to login page with current URL as redirect parameter
    const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
    router.push(loginUrl);
  };

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
          <Button onClick={handleSignInClick}>Sign In</Button>
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
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const { useLesson, useRelatedLessons } = useLearndash();
  const decodedLessonId = decodeURIComponent(params.lessonId);

  // State for lesson completion
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [_lessonRating, setLessonRating] = useState<number>(0);

  // State to track authentication status for client-side rendering
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Update authentication state when Clerk loads
  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!isSignedIn);
    }
  }, [isLoaded, isSignedIn]);

  // Use a key that changes when auth state changes to force query refetch
  const queryKey = `${decodedLessonId}_${isSignedIn ? "auth" : "unauth"}_${isAuthenticated ? "true" : "false"}`;

  // Fetch current lesson with updated key to force refetch when auth changes
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(queryKey);

  // Fetch related lessons with updated key
  const { data: relatedLessons, isLoading: isLoadingRelated } =
    useRelatedLessons(queryKey);

  // Function to handle lesson rating
  const handleRateLesson = (rating: number) => {
    setLessonRating(rating);
    // Here you would typically make an API call to save the rating
    toast.success("Rating submitted", {
      description: `You rated this lesson ${rating} stars. Thank you!`,
    });
  };

  // Function to handle lesson completion
  const handleCompleteLesson = async () => {
    if (isCompleted) return;

    setIsCompleting(true);

    try {
      // Simulate API call to mark lesson as complete
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update completion state
      setIsCompleted(true);

      toast.success("Lesson Completed!", {
        description: "Your progress has been updated.",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error completing lesson:", errorMessage);

      toast.error("Failed to complete lesson", {
        description: "Please try again later.",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // Find previous and next lessons if they exist
  const findAdjacentLessons = () => {
    // Guard clause for when data isn't available
    if (!Array.isArray(relatedLessons) || !lesson) {
      return { prevLesson: null, nextLesson: null };
    }

    // Assume relatedLessons are sorted in order
    const lessonIds = relatedLessons.map((l) => l.id);
    const currentIndex = lessonIds.indexOf(lesson.id);

    // Only return adjacent lessons if found in the array
    const prevLesson =
      currentIndex > 0 ? relatedLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < lessonIds.length - 1
        ? relatedLessons[currentIndex + 1]
        : null;

    return { prevLesson, nextLesson };
  };

  const { prevLesson, nextLesson } = findAdjacentLessons();

  const navigateToLesson = (lessonId: string) => {
    router.push(`/course/${params.courseId}/${lessonId}`);
  };

  // Show loading skeleton while loading data or auth state
  if (isLoadingLesson || isLoadingRelated || !isLoaded) {
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
                // Show content if authenticated or clerk says we're signed in
                isAuthenticated || isSignedIn ? (
                  lesson && videoInfo ? (
                    <div>
                      <VideoPlayer
                        videoInfo={videoInfo}
                        stickyContainerRef={stickyContainerRef}
                      />
                      <div className="flex flex-col border-t bg-background p-4">
                        {/* Navigation and rating in flex container */}
                        <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
                          {/* Navigation buttons */}
                          <div className="mb-4 flex space-x-2 md:mb-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                prevLesson && navigateToLesson(prevLesson.id)
                              }
                              disabled={!prevLesson}
                              className="flex items-center"
                            >
                              <ChevronLeft className="mr-1 h-4 w-4" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                nextLesson && navigateToLesson(nextLesson.id)
                              }
                              disabled={!nextLesson}
                              className="flex items-center"
                            >
                              Next
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>

                          {/* Rating Component */}
                          <LessonRating onRate={handleRateLesson} />
                        </div>

                        {/* Complete button in full width container */}
                        <div className="flex justify-center">
                          <Button
                            size="lg"
                            className="min-w-[200px] font-medium"
                            onClick={handleCompleteLesson}
                            disabled={isCompleting || isCompleted}
                          >
                            {isCompleting ? (
                              <span className="flex items-center">
                                <Skeleton className="mr-2 h-4 w-4 animate-spin rounded-full" />
                                Completing...
                              </span>
                            ) : isCompleted ? (
                              <span className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Lesson Completed
                              </span>
                            ) : (
                              "Complete Lesson"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null
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
