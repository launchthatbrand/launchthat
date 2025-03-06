"use client";

import { usePathname } from "next/navigation";

import { CourseHeader } from "../_components/CourseHeader";

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  // Extract lessonId if we're on a lesson page
  const lessonId = pathParts.length >= 3 ? pathParts[2] : undefined;

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-slate-200">
      <CourseHeader courseId={params.courseId} lessonId={lessonId} />
      {children}
    </div>
  );
}
