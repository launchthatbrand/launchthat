"use client";

import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import { Progress } from "@acme/ui/components/progress";
import { GeneralCard, GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";

import { useLearndash } from "../../hooks/useLearndash";

interface Lesson {
  id: string;
  title: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  isCompleted?: boolean;
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
          <GeneralCardSkeleton
            layout="stacked"
            className="mb-8"
            hasTitle={true}
            hasSubtitle={true}
            hasContent={true}
            contentLines={3}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <GeneralCardSkeleton
                  key={i}
                  layout="stacked"
                  hasImage={true}
                  hasTitle={true}
                  hasSubtitle={true}
                />
              ))}
          </div>
        </div>

        <div>
          <GeneralCardSkeleton
            layout="stacked"
            className="sticky top-24"
            hasTitle={true}
            hasContent={true}
            contentLines={6}
          />
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
                <GeneralCard
                  key={lesson.id}
                  title={lesson.title}
                  layout="stacked"
                  image={
                    lesson.featuredImage
                      ? {
                          src: lesson.featuredImage.node.sourceUrl,
                          alt: lesson.title,
                        }
                      : undefined
                  }
                  navigation={{
                    path: `/course/${decodedCourseId}/${lesson.id}`,
                    type: "card",
                  }}
                  badge={
                    lesson.isCompleted
                      ? {
                          text: "COMPLETED",
                          variant: "default",
                          position: "top-left",
                        }
                      : undefined
                  }
                  enableHoverEffects={true}
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
          <GeneralCard
            layout="stacked"
            title="Course Progress"
            className="sticky top-24 -mt-40 border-0"
            contentClassName="space-y-6"
            content={
              <>
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
                        <GeneralCard
                          key={quiz.id}
                          layout="stacked"
                          title={quiz.title}
                          className="cursor-pointer transition-colors hover:bg-muted/50"
                          contentClassName="p-0"
                          onClick={() =>
                            router.push(
                              `/course/${decodedCourseId}/quiz/${quiz.id}`,
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Achievements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {achievements.map((achievement) => (
                      <GeneralCard
                        key={achievement.id}
                        layout="stacked"
                        className={`p-0 ${!achievement.earned ? "opacity-50" : ""}`}
                        contentClassName="p-3"
                        content={
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
                        }
                      />
                    ))}
                  </div>
                </div>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
