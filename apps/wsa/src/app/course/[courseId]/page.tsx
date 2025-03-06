"use client";

import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Progress } from "@acme/ui/components/progress";
import { Skeleton } from "@acme/ui/components/skeleton";

import { useLearndash } from "../../hooks/useLearndash";
import { LessonCard } from "./_components/LessonCard";

interface Lesson {
  id: string;
  title: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

interface Quiz {
  id: string;
  title: string;
}

// Interface for course data
interface CourseData {
  id: string;
  title: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  siblings?: {
    nodes: Lesson[];
  };
  quizzes?: {
    nodes: Quiz[];
  };
}

// Interface for achievement items
interface AchievementItem {
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
          <Card className="bg-theme-card/40 mb-8 border-0">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[2/1] w-full" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <Card className="bg-theme-card/40 sticky top-24 border-0">
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
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="p-3">
                        <Skeleton className="h-4 w-4/5" />
                      </CardHeader>
                    </Card>
                  ))}
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

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const decodedCourseId = decodeURIComponent(params.courseId);
  const router = useRouter();
  const { useCourse } = useLearndash();

  // Safely handle the course data
  const courseResult = useCourse(decodedCourseId);

  // Set default values
  const isLoading = courseResult.isLoading;
  const error = courseResult.error;
  const course = courseResult.course as CourseData | null;

  // Mock data for progress and achievements
  const progress = 35; // Percentage of course completed
  const achievements: AchievementItem[] = [
    {
      id: "1",
      title: "First Lesson",
      description: "Completed your first lesson",
      earned: true,
    },
    {
      id: "2",
      title: "Quiz Master",
      description: "Scored 100% on a quiz",
      earned: false,
    },
    {
      id: "3",
      title: "Halfway There",
      description: "Completed 50% of the course",
      earned: false,
    },
    {
      id: "4",
      title: "Course Complete",
      description: "Finished the entire course",
      earned: false,
    },
  ];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          {error?.message ?? "Course not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {course.siblings?.nodes && course.siblings.nodes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {course.siblings.nodes.map((lesson: Lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  courseId={course.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No lessons available for this course.
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-24 -mt-40 space-y-6 border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Quizzes */}
              {course.quizzes?.nodes && course.quizzes.nodes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Quizzes</h3>
                  <div className="grid gap-2">
                    {course.quizzes.nodes.map((quiz: Quiz) => (
                      <Card
                        key={quiz.id}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() =>
                          router.push(
                            `/course/${decodedCourseId}/quiz/${quiz.id}`,
                          )
                        }
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-base">
                            {quiz.title}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Achievements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`p-3 ${!achievement.earned ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Trophy
                          className={`h-6 w-6 ${achievement.earned ? "text-yellow-500" : "text-gray-400"}`}
                        />
                        <span className="text-sm font-medium">
                          {achievement.title}
                        </span>
                        {achievement.earned && (
                          <Badge variant="outline" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </Card>
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
