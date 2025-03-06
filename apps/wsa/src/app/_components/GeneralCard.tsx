import Image from "next/image";
import { useRouter } from "next/navigation";

import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

interface Author {
  node: {
    name: string;
    avatar?: {
      url: string;
    };
  };
}

export interface GeneralCardProps {
  id: string;
  title: string;
  navigationPath: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  isCompleted?: boolean;
  topicsCount?: number;
  author?: Author;
  defaultImageUrl?: string;
  variant?: "lesson" | "course";
}

export function GeneralCard({
  id,
  title,
  navigationPath,
  featuredImage,
  isCompleted,
  topicsCount = 0,
  author,
  defaultImageUrl = "https://app.wsatraining.com/wp-content/uploads/2018/05/thumbnailsArtboard-1.jpg",
  variant = "course",
}: GeneralCardProps) {
  const router = useRouter();
  const imageUrl = featuredImage?.node?.sourceUrl ?? defaultImageUrl;

  return (
    <Card className="group relative overflow-hidden bg-white">
      {/* Completed Badge */}
      {isCompleted && (
        <Badge
          className="absolute left-2 top-2 z-10 bg-blue-500 text-white"
          variant="secondary"
        >
          COMPLETED
        </Badge>
      )}

      {/* Featured Image */}
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader className="space-y-2">
        {/* Topics/Content Count */}
        <div className="text-sm text-muted-foreground">
          {topicsCount} {variant === "lesson" ? "Topics" : "Lessons"}
        </div>

        {/* Title */}
        <CardTitle className="line-clamp-2 text-xl text-[#42307D]">
          {title}
        </CardTitle>

        {/* Author Info */}
        {author && (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
              {author.node.avatar?.url ? (
                <Image
                  src={author.node.avatar.url}
                  alt={author.node.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-purple-100 text-sm font-medium text-purple-700">
                  {author.node.name?.[0] ?? "Q"}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">
              {author.node.name ?? "Quillan"}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Button
          className="w-full"
          variant="default"
          onClick={() => router.push(navigationPath)}
        >
          See more...
        </Button>
      </CardContent>
    </Card>
  );
}
