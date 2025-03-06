"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
}

interface SiblingCoursesProps {
  courses: Course[];
  currentCourseId: string;
}

export function SiblingCourses({
  courses,
  currentCourseId,
}: SiblingCoursesProps) {
  const router = useRouter();

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Related Courses</h2>
      <div className="grid gap-4">
        {courses
          .filter((course) => course.id !== currentCourseId)
          .map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push(`/wordpress/course/${course.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-base">{course.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  );
}
