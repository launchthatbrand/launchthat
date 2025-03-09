"use client";

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import { Card } from "@acme/ui/components/card";
import { cn } from "@acme/ui/lib/utils";

interface BuddyPressGroup {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: string;
  dateCreated: string;
  metaData: Array<{
    key: string;
    value: string;
  }>;
}

interface GroupCardProps {
  group: BuddyPressGroup;
  className?: string;
}

export function GroupCard({ group, className }: GroupCardProps) {
  // Extract meta values
  const memberCount =
    group.metaData.find((m) => m.key === "total_member_count")?.value ?? "0";
  const topics =
    group.metaData.find((m) => m.key === "group_topics")?.value?.split(",") ??
    [];
  const coverImage =
    group.metaData.find((m) => m.key === "cover_image")?.value ??
    "/groups/default.jpg";

  return (
    <Link href={`/groups/${group.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:border-primary",
          className,
        )}
      >
        <div className="relative h-32 w-full">
          <Image
            src={coverImage}
            alt={group.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {group.status === "private" && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-black/50 text-white backdrop-blur-sm"
            >
              Private
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-lg font-semibold group-hover:text-primary">
            {group.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {group.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Active {formatLastActive(group.dateCreated)}
            </div>
          </div>

          {topics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

function formatLastActive(date: string) {
  const now = new Date();
  const lastActive = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}
