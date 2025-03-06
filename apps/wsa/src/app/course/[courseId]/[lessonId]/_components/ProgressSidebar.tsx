import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/components/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Progress } from "@acme/ui/components/progress";

import { VideoInfo } from "../types";

interface ProgressSidebarProps {
  videoInfo: VideoInfo | null;
  stickyContainerRef: React.RefObject<HTMLDivElement>;
  watchProgress: number;
  courseId: string;
  relatedLessons?: {
    id: string;
    title: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
      };
    };
  }[];
}

export function ProgressSidebar({
  videoInfo,
  stickyContainerRef,
  watchProgress,
  courseId,
  relatedLessons,
}: ProgressSidebarProps) {
  const progressContent = (
    <>
      {/* Video Container for Portal */}
      {videoInfo && (
        <div ref={stickyContainerRef} className="space-y-6">
          {/* Video will be portaled here */}
        </div>
      )}

      {/* Course Progress */}
      {videoInfo && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Course Progress</span>
            <span>{watchProgress}%</span>
          </div>
          <Progress value={watchProgress} className="h-2" />
        </div>
      )}
    </>
  );

  const relatedContent = relatedLessons && relatedLessons.length > 0 && (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Related Lessons</h3>
      <div className="space-y-3">
        {relatedLessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/course/${courseId}/${lesson.id}`}
            className="group block"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-24 overflow-hidden rounded-md">
                {lesson.featuredImage ? (
                  <Image
                    src={lesson.featuredImage.node.sourceUrl}
                    alt={lesson.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100" />
                )}
              </div>
              <h4 className="flex-1 text-sm font-medium group-hover:text-blue-600">
                {lesson.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="order-1 md:order-2">
      {/* Mobile View - Accordion */}
      <div className="md:hidden">
        <Card className="border-0">
          <Accordion
            type="single"
            collapsible
            className="rounded-lg border-0 bg-white shadow-none"
          >
            <AccordionItem
              value="progress"
              className="border-0 px-6 py-4 [&[data-state=open]]:pb-6"
            >
              <AccordionTrigger className="flex flex-col items-stretch gap-4 p-0 hover:no-underline [&[data-state=open]>div]:mb-0">
                <div className="flex flex-col items-stretch justify-between gap-3">
                  <h2 className="text-lg font-medium">Lesson Details</h2>
                  <div className="text-sm text-muted-foreground">
                    {progressContent}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                {relatedContent}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>

      {/* Desktop View - Card */}
      <Card className="sticky top-24 hidden space-y-6 border-0 bg-white md:-mt-32 md:block">
        <CardHeader className="pb-2">
          <CardTitle>Lesson Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressContent}
          {relatedContent}
        </CardContent>
      </Card>
    </div>
  );
}
