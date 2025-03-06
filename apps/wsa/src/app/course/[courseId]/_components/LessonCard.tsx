"use client";

import { GeneralCard } from "~/app/_components/GeneralCard";

interface Lesson {
  id: string;
  title: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
  isCompleted?: boolean;
}

interface LessonCardProps {
  lesson: Lesson;
  courseId: string;
}

export function LessonCard({ lesson, courseId }: LessonCardProps) {
  return (
    <GeneralCard
      id={lesson.id}
      title={lesson.title}
      navigationPath={`/course/${courseId}/${lesson.id}`}
      featuredImage={lesson.featuredImage}
      isCompleted={lesson.isCompleted}
      topicsCount={0}
      author={lesson.author}
      variant="lesson"
    />
  );
}
