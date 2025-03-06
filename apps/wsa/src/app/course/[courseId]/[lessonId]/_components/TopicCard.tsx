"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";

interface Topic {
  id: string;
  title: string;
}

interface TopicCardProps {
  topic: Topic;
  courseId: string;
  lessonId: string;
}

export function TopicCard({ topic, courseId, lessonId }: TopicCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() =>
        router.push(`/wordpress/course/${courseId}/${lessonId}/${topic.id}`)
      }
    >
      <CardHeader>
        <CardTitle className="text-base">{topic.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
