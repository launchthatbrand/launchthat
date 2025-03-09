"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Progress } from "@acme/ui/components/progress";
import { Skeleton } from "@acme/ui/components/skeleton";
import { GeneralCard, GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";

import { CardLoop } from "../../../../../packages/ui/src/general/CardLoop";
import { fetchWordPress } from "../utils/api";
import { GET_COURSES } from "./queries";

export interface Course {
  id: string;
  title: string;
  isCompleted?: boolean;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  siblings?: {
    pageInfo: {
      total: number;
    };
  };
}

export interface CoursesData {
  published?: {
    nodes: Course[];
  };
  drafts?: {
    nodes: Course[];
  };
}

// Interface for achievement items
export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  earned: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Skeleton className="mb-8 h-10 w-36" /> {/* Page title skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <GeneralCardSkeleton
                  key={i}
                  layout="stacked"
                  hasImage={true}
                  hasTitle={true}
                  hasSubtitle={false}
                  hasContent={true}
                  hasFooter={false}
                  contentLines={1}
                  className="overflow-hidden"
                />
              ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 border-0 bg-white">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <div className="grid grid-cols-2 gap-2">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="p-3">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Achievements section */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <div className="space-y-2">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border border-gray-100 p-2"
                      >
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="mb-1 h-4 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
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

export default function CoursesPage() {
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery<CoursesData>({
    queryKey: ["courses"],
    queryFn: async () => {
      const result = await fetchWordPress(GET_COURSES);
      return result as CoursesData;
    },
  });

  // Mock data for learning stats
  const learningStats = {
    progress: 42, // Overall progress percentage
    coursesCompleted: 3,
    totalCourses: 12,
    lessonsCompleted: 24,
    totalLessons: 86,
  };

  // Mock data for achievements
  const achievements: AchievementItem[] = [
    {
      id: "1",
      title: "First Course",
      description: "Started your learning journey",
      earned: true,
    },
    {
      id: "2",
      title: "Quick Learner",
      description: "Completed 5 lessons in a day",
      earned: true,
    },
    {
      id: "3",
      title: "Half Way",
      description: "Completed 50% of all courses",
      earned: false,
    },
    {
      id: "4",
      title: "Graduate",
      description: "Completed all courses",
      earned: false,
    },
  ];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    console.error("Query Error:", error);
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : "Failed to fetch courses"}
        </div>
      </div>
    );
  }

  if (!coursesData) {
    console.warn("No courses data received");
    return (
      <div className="container py-8">
        <div className="text-center text-yellow-500">
          No course data available
        </div>
      </div>
    );
  }

  const publishedCourses = coursesData.published?.nodes ?? [];
  const draftCourses = coursesData.drafts?.nodes ?? [];

  // Safely combine the arrays
  const allCourses: Course[] = [
    ...(Array.isArray(publishedCourses) ? publishedCourses : []),
    ...(Array.isArray(draftCourses) ? draftCourses : []),
  ];

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <h1 className="mb-8 text-3xl font-bold">Courses</h1>
          <CardLoop
            items={allCourses}
            renderItem={(course: Course) => (
              <GeneralCard
                key={course.id}
                title={course.title}
                layout="stacked"
                className="overflow-hidden"
                enableHoverEffects={true}
                image={
                  course.featuredImage?.node?.sourceUrl
                    ? {
                        src: course.featuredImage.node.sourceUrl,
                        alt: course.title,
                      }
                    : {
                        src: "https://app.wsatraining.com/wp-content/uploads/2018/05/thumbnailsArtboard-1.jpg",
                        alt: course.title,
                      }
                }
                badge={
                  course.isCompleted
                    ? {
                        text: "COMPLETED",
                        variant: "default",
                        position: "top-left",
                      }
                    : undefined
                }
                navigation={{
                  path: `/course/${course.id}`,
                  type: "card",
                }}
                content={
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {course.siblings?.pageInfo.total ?? 0} Lessons
                      </span>
                    </div>
                  </div>
                }
              />
            )}
          />
        </div>

        <div>
          <Card className="sticky top-24 -mt-40 space-y-6 border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{learningStats.progress}%</span>
                </div>
                <Progress value={learningStats.progress} className="h-2" />
              </div>

              {/* Learning Stats */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Your Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                      <span className="text-sm font-medium">Courses</span>
                      <span className="text-lg font-bold">
                        {learningStats.coursesCompleted}/
                        {learningStats.totalCourses}
                      </span>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <GraduationCap className="h-6 w-6 text-green-500" />
                      <span className="text-sm font-medium">Lessons</span>
                      <span className="text-lg font-bold">
                        {learningStats.lessonsCompleted}/
                        {learningStats.totalLessons}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Achievements</h3>
                <div className="space-y-2">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 rounded-md border border-gray-100 p-2"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          achievement.earned ? "bg-amber-100" : "bg-gray-100"
                        }`}
                      >
                        <Trophy
                          className={`h-5 w-5 ${
                            achievement.earned
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-xs text-gray-500">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
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
