"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Vimeo from "@u-wave/react-vimeo";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Trophy,
} from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Progress } from "@acme/ui/components/progress";
import { Skeleton } from "@acme/ui/components/skeleton";

import { fetchWordPress } from "~/app/utils/api";
import { GET_LESSON } from "../../queries";
import { Comments } from "./_components/Comments";

interface LessonData {
  lesson: {
    id: string;
    title: string;
    content: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
      };
    };
    siblings?: {
      nodes: {
        id: string;
        title: string;
        featuredImage?: {
          node: {
            sourceUrl: string;
          };
        };
      }[];
    };
    quizzes?: {
      nodes: {
        id: string;
        title: string;
      }[];
    };
  };
}

// Video platform detection
interface VideoInfo {
  platform: "vimeo" | "youtube" | "wistia" | "unknown";
  id: string;
}

function detectVideoInfo(content: string): VideoInfo | null {
  // Vimeo detection
  const vimeoRegex = /https?:\/\/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i;
  const vimeoMatch = content.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  // YouTube detection
  const youtubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/i;
  const youtubeMatch = content.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return { platform: "youtube", id: youtubeMatch[1] };
  }

  // Wistia detection
  const wistiaRegex =
    /https?:\/\/(?:.+)?wistia\.com\/(?:medias|embed)\/([a-zA-Z0-9]+)/i;
  const wistiaMatch = content.match(wistiaRegex);
  if (wistiaMatch && wistiaMatch[1]) {
    return { platform: "wistia", id: wistiaMatch[1] };
  }

  return null;
}

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Log video events for debugging
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events = ["play", "pause", "timeupdate", "seeking", "seeked"];
    const handlers = events.map((event) => {
      const handler = () =>
        console.log(`Video ${event}:`, {
          currentTime: video.currentTime,
          paused: video.paused,
        });
      video.addEventListener(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => {
        video.removeEventListener(event, handler);
      });
    };
  }, []);

  return (
    <motion.div
      layout
      className="relative aspect-video w-full overflow-hidden rounded-lg bg-black"
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
      }}
    >
      <motion.video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        src={src}
        layoutId="video-player"
      />
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="bg-theme-card/40 border-0">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[300px]" />
              </div>
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 border-0 bg-white">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <div className="grid grid-cols-2 gap-2">
                  {Array(2)
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

export default function Page({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const threshold = 100;
    const shouldBeSticky = rect.top < threshold;

    if (shouldBeSticky !== isSticky) {
      console.log("Changing sticky state:", {
        shouldBeSticky,
        top: rect.top,
        threshold,
        scrollY,
      });
      setIsSticky(shouldBeSticky);
    }
  }, [isSticky]);

  // Effect to handle moving the video container
  useEffect(() => {
    if (!videoContainerRef.current || !stickyContainerRef.current) return;

    const videoContainer = videoContainerRef.current;
    const mainTarget = contentRef.current;
    const stickyTarget = stickyContainerRef.current;
    const currentParent = videoContainer.parentElement;
    const targetParent = isSticky ? stickyTarget : mainTarget;

    if (targetParent && currentParent !== targetParent) {
      console.log(`Moving video to ${isSticky ? "sidebar" : "main content"}`);
      targetParent.appendChild(videoContainer);
    }
  }, [isSticky]);

  // Set up scroll listener
  useEffect(() => {
    console.log("Setting up scroll listener");

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Add resize listener as well
    window.addEventListener("resize", handleScroll, { passive: true });

    // Set up periodic check
    const interval = setInterval(handleScroll, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearInterval(interval);
    };
  }, [handleScroll]);

  const { data: content, isLoading } = useQuery({
    queryKey: ["lesson", params.lessonId],
    queryFn: async () => {
      try {
        const data = await fetchWordPress<LessonData>(GET_LESSON, {
          id: decodeURIComponent(params.lessonId),
        });

        return {
          type: "lesson" as const,
          data: data.lesson,
        };
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        throw error;
      }
    },
  });

  // Detect video when content changes
  useEffect(() => {
    if (content?.data?.content) {
      const detectedVideo = detectVideoInfo(content.data.content);
      setVideoInfo(detectedVideo);
    }
  }, [content?.data?.content]);

  // Mock data for lesson progress
  const lessonProgress = {
    completed: 65, // Percentage of lesson completed
    timeSpent: "12m 30s",
    estimatedTime: "20m",
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!content) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">Content not found</div>
      </div>
    );
  }

  // Get current lesson index and total lessons count
  const currentLessonIndex =
    content.data.siblings?.nodes.findIndex(
      (lesson) => lesson.id === params.lessonId,
    ) ?? 0;
  const totalLessons = content.data.siblings?.nodes.length ?? 0;

  // Get previous and next lessons
  const prevLesson =
    currentLessonIndex > 0
      ? content.data.siblings?.nodes[currentLessonIndex - 1]
      : null;
  const nextLesson =
    currentLessonIndex < totalLessons - 1
      ? content.data.siblings?.nodes[currentLessonIndex + 1]
      : null;

  // Create a sanitized version of the content without the video embed
  let sanitizedContent = content.data.content;
  if (videoInfo) {
    // Remove the video iframe from the content to avoid duplication
    const iframeRegex =
      /<iframe[^>]*src=["'].*?(?:vimeo|youtube|wistia).*?["'][^>]*>.*?<\/iframe>/gi;
    sanitizedContent = sanitizedContent.replace(iframeRegex, "");
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="bg-theme-card/40 border-0">
            <CardContent className="space-y-4 p-0">
              {/* <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </p>
              </div> */}
              {/* Our video test content */}
              <div ref={contentRef} className="relative">
                {/* Video container that will be moved */}
                <motion.div
                  ref={videoContainerRef}
                  className="video-container"
                  layout
                  layoutId="video-wrapper"
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" },
                  }}
                >
                  <VideoPlayer src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4" />
                </motion.div>

                {/* Placeholder when video is sticky */}
                <AnimatePresence>
                  {isSticky && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-video rounded-lg bg-gray-100"
                    >
                      <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">Video is now in sidebar</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Video Player */}
              {/* {videoInfo && <VideoPlayer videoInfo={videoInfo} />} */}
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              {prevLesson ? (
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/course/${params.courseId}/${prevLesson.id}`)
                  }
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
              ) : (
                <div></div>
              )}

              {nextLesson && (
                <Button
                  onClick={() =>
                    (window.location.href = `/course/${params.courseId}/${nextLesson.id}`)
                  }
                >
                  Next Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <div className="mt-8">
            <Comments />
          </div>
        </div>

        <div>
          <Card className="sticky top-24 -mt-40 space-y-6 border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Lesson Progress</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                ref={stickyContainerRef}
                className="rounded-lg"
                layout
                transition={{
                  layout: { duration: 0.3, ease: "easeInOut" },
                }}
              />
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{lessonProgress.completed}%</span>
                </div>
                <Progress value={lessonProgress.completed} className="h-2" />
              </div>

              {/* Lesson Stats */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Lesson Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                      <span className="text-sm font-medium">Time Spent</span>
                      <span className="text-lg font-bold">
                        {lessonProgress.timeSpent}
                      </span>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <span className="text-sm font-medium">Est. Time</span>
                      <span className="text-lg font-bold">
                        {lessonProgress.estimatedTime}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Course Navigation */}
              {content.data.siblings?.nodes &&
                content.data.siblings.nodes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Course Lessons</h3>
                    <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
                      {content.data.siblings.nodes.map((lesson, index) => (
                        <Card
                          key={lesson.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            lesson.id === params.lessonId
                              ? "border-primary"
                              : ""
                          }`}
                          onClick={() =>
                            (window.location.href = `/course/${params.courseId}/${lesson.id}`)
                          }
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="flex h-6 w-6 items-center justify-center rounded-full p-0"
                              >
                                {index + 1}
                              </Badge>
                              <span className="line-clamp-1 text-sm font-medium">
                                {lesson.title}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quizzes */}
              {content.data.quizzes?.nodes &&
                content.data.quizzes.nodes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Related Quizzes</h3>
                    <div className="grid gap-2">
                      {content.data.quizzes.nodes.map((quiz) => (
                        <Card
                          key={quiz.id}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() =>
                            (window.location.href = `/course/${params.courseId}/quiz/${quiz.id}`)
                          }
                        >
                          <CardContent className="p-3">
                            <span className="text-sm font-medium">
                              {quiz.title}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
