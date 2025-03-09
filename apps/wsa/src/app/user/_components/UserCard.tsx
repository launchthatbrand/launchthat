"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@acme/ui/components/badge";
import { Card } from "@acme/ui/components/card";
import { cn } from "@acme/ui/lib/utils";

import type { User } from "../hooks/useUsers";

interface UserCardProps {
  user: User;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  return (
    <Link href={`/user/${user.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:border-primary",
          className,
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={user.avatar?.url ?? "/avatars/default.jpg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary">
                {user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user.roles?.nodes[0]?.name ?? "Member"}
              </p>
            </div>
          </div>

          {user.description && (
            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
              {user.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {user.posts?.pageInfo.total ? (
              <Badge variant="secondary">
                {user.posts.pageInfo.total} Posts
              </Badge>
            ) : null}
            {user.courses?.nodes.length ? (
              <Badge variant="secondary">
                {user.courses.nodes.length} Courses
              </Badge>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
