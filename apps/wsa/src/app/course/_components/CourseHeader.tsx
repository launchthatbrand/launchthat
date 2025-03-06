"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";
import { Skeleton } from "@acme/ui/components/skeleton";

import { useLearndash } from "~/app/hooks/useLearndash";
import { fetchWordPress } from "~/app/utils/api";
import { GET_LESSON } from "../queries";

interface CourseHeaderProps {
  courseId: string;
  lessonId?: string;
}

interface LessonData {
  lesson: {
    id: string;
    title: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
      };
    };
  };
}

export function CourseHeader({ courseId, lessonId }: CourseHeaderProps) {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  // Determine if we're on a lesson page
  const isLessonPage = pathParts.length >= 3 && pathParts[0] === "course";

  // Use the Learndash hook for course data
  const { useCourse } = useLearndash();
  const { course, isLoading: isCourseLoading } = useCourse(courseId);

  // Fetch lesson data if on a lesson page
  const { data: lessonData, isLoading: isLessonLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      try {
        const data = await fetchWordPress<LessonData>(GET_LESSON, {
          id: lessonId,
        });
        return data;
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        return null;
      }
    },
    enabled: !!lessonId && isLessonPage,
  });

  // Determine loading state
  const isLoading = isLessonPage
    ? isLessonLoading || isCourseLoading
    : isCourseLoading;

  // Determine title and image to display
  const courseTitle = course?.title ?? "Course";
  const courseImage = course?.featuredImage?.node.sourceUrl;
  const lesson = lessonData?.lesson;
  const lessonTitle = lesson?.title;
  const lessonImage = lesson?.featuredImage?.node.sourceUrl;

  const displayTitle = isLessonPage && lessonTitle ? lessonTitle : courseTitle;
  const displayImage = isLessonPage && lessonImage ? lessonImage : courseImage;

  if (isLoading) {
    return (
      <div className="relative flex h-60 flex-col justify-end bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 py-8">
        <div className="container relative">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex w-full flex-col justify-start gap-6 md:flex-row md:items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-10 w-64" />
                {isLessonPage && <Skeleton className="h-5 w-48" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-60 flex-col justify-end bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 py-8">
      <div className="container relative">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex w-full flex-col justify-start gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-purple-500/20 shadow-xl">
              <AvatarImage src={displayImage} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500">
                {displayTitle.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-2">
              <h1 className="text-3xl font-bold text-white">{displayTitle}</h1>
              {isLessonPage && courseTitle && (
                <p className="text-sm text-white/80">
                  <span className="font-medium">Course:</span> {courseTitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
