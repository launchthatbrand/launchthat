"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { GET_TOPIC } from "../../../../queries";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface Topic {
  id: string;
  title: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

function LoadingSkeleton() {
  return (
    <div className="container py-8">
      <Card className="border-0 bg-theme-card/40">
        <CardHeader>
          <Skeleton className="h-8 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="aspect-[2/1] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TopicPage({
  params,
}: {
  params: { courseId: string; lessonId: string; topicId: string };
}) {
  const { data: topic, isLoading } = useQuery({
    queryKey: ["topic", params.topicId],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_WORDPRESS_API_URL2!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: GET_TOPIC,
            variables: {
              id: decodeURIComponent(params.topicId),
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message ?? "Failed to fetch topic");
      }

      if (!data.data?.topic) {
        throw new Error("Topic not found");
      }

      return data.data.topic;
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!topic) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">Topic not found</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="border-0 bg-theme-card/40">
        <CardHeader>
          <CardTitle>{topic.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {topic.featuredImage?.node?.sourceUrl && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={topic.featuredImage.node.sourceUrl}
                alt={topic.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
