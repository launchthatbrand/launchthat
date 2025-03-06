"use client";

import { useParams } from "next/navigation";
import { TerminalSquare } from "lucide-react";

import { NavMain } from "@acme/ui/general/nav-main";

import { useLearndash } from "~/app/hooks/useLearndash";

interface Lesson {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  siblings?: {
    nodes: Lesson[];
  };
}

export default function CourseSidebar() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { useCourse } = useLearndash();
  const { course, isLoading } = useCourse(courseId);

  const navItems = [
    {
      title: "All Courses",
      url: `/courses`,
      icon: TerminalSquare,
    },
    {
      title: course?.title ?? "Loading...",
      url: `/course/${courseId}`,
      icon: TerminalSquare,
      isActive: true,
      items:
        course?.siblings?.nodes.map((lesson: Lesson) => ({
          title: lesson.title,
          url: `/course/${courseId}/${lesson.id}`,
        })) ?? [],
    },
  ];

  return (
    <div className="px-2 py-2">
      <NavMain items={navItems} />
    </div>
  );
}
