"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";

interface GroupHeaderProps {
  title: string;
  image?: string;
  description?: string;
  memberCount?: string;
}

export function GroupHeader({
  title,
  image,
  description,
  memberCount,
}: GroupHeaderProps) {
  return (
    <div className="relative flex h-80 flex-col justify-end bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 py-8">
      <div className="container relative">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex w-full flex-col justify-start gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-4 border-purple-500/20 shadow-xl">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500">
                {title?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                {memberCount && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {memberCount} members
                  </span>
                )}
              </div>
              {description && (
                <p className="text-lg text-white/80">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
