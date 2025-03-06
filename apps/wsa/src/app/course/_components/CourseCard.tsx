"use client";

import { GeneralCard } from "../../_components/GeneralCard";

interface Course {
  id: string;
  title: string;
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

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <GeneralCard
      id={course.id}
      title={course.title}
      navigationPath={`/wordpress/course/${course.id}`}
      featuredImage={course.featuredImage}
      topicsCount={course.siblings?.pageInfo.total ?? 0}
      variant="course"
    />
  );
}
