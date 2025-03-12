"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";

import { Badge } from "@acme/ui/components/badge";
import { Card } from "@acme/ui/components/card";
import Link from "next/link";
import type { User } from "../hooks/useUsers";
import { cn } from "@acme/ui/lib/utils";

interface UserCardProps {
  user: User;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  // Format the user role with a fallback
  const userRole = user.roles?.nodes[0]?.name ?? "Member";

  return (
    <Link href={`/user/${user.slug}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:border-primary",
          className,
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {user.avatar?.url && <AvatarImage src={user.avatar.url} />}
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold group-hover:text-primary">
                {user.name}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{userRole}</p>
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
