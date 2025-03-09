import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  Heart,
  Instagram,
  MessageCircle,
  PlayCircle,
  Repeat2,
  Twitter,
  Youtube,
} from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";
import { cn } from "@acme/ui/lib/utils";

interface SocialPost {
  id: number;
  content: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  platform: "twitter" | "instagram" | "youtube";
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail: string;
    title?: string;
    views?: string;
    duration?: string;
  };
  stats?: {
    likes: number;
    retweets?: number;
    replies?: number;
  };
}

interface InstructorUpdatesProps {
  posts: SocialPost[];
  enableHover?: boolean;
}

const PlatformIcon = {
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

export function InstructorUpdates({
  posts,
  enableHover = true,
}: InstructorUpdatesProps) {
  return (
    <GeneralCard
      layout="stacked"
      className="!translate-y-0 overflow-hidden"
      enableHoverEffects={enableHover}
      title={
        <div className="border-b bg-[#2b0e4d] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#FC653C]">
                ▬ LATEST UPDATES ▬
              </p>
              <h3 className="mt-2 text-xl font-bold">From Your Mentor</h3>
              <p className="mt-1 text-sm font-normal text-gray-300">
                Stay updated with Quillan's latest content
              </p>
            </div>
          </div>
        </div>
      }
      content={
        <div className="grid gap-4 p-4">
          {posts.map((post) => {
            const Icon = PlatformIcon[post.platform];
            return (
              <div
                key={post.id}
                className={cn(
                  "rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
                  enableHover && "transition-all duration-200 hover:shadow-md",
                )}
              >
                {/* Post header with author info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={post.avatar}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-sm text-slate-500">
                          @{post.handle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span>
                          {formatDistanceToNow(new Date(post.timestamp))} ago
                        </span>
                        <span>•</span>
                        <Icon className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <a
                    href="#"
                    className={cn(
                      "rounded-full p-1.5 text-slate-400",
                      enableHover && "hover:bg-slate-50 hover:text-[#FC653C]",
                    )}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Post content */}
                <div className="mt-3">
                  <p className="text-sm text-slate-800">{post.content}</p>
                </div>

                {/* Media (if any) */}
                {post.media && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                    <div className="relative aspect-video">
                      <Image
                        src={post.media.thumbnail}
                        alt={post.media.title ?? "Post media"}
                        fill
                        className="object-cover"
                      />
                      {post.media.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    {post.media.title && (
                      <div className="border-t border-slate-200 bg-slate-50 p-2">
                        <p className="text-sm font-medium text-slate-800">
                          {post.media.title}
                        </p>
                        {post.media.views && (
                          <p className="text-xs text-slate-500">
                            {post.media.views}
                            {post.media.duration
                              ? ` • ${post.media.duration}`
                              : ""}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                {post.stats && (
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-4">
                      <button
                        className={cn(
                          "flex items-center gap-1 text-xs text-slate-500",
                          enableHover && "hover:text-[#FC653C]",
                        )}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.stats.likes}</span>
                      </button>
                      {post.stats.replies !== undefined && (
                        <button
                          className={cn(
                            "flex items-center gap-1 text-xs text-slate-500",
                            enableHover && "hover:text-[#FC653C]",
                          )}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.stats.replies}</span>
                        </button>
                      )}
                      {post.stats.retweets !== undefined && (
                        <button
                          className={cn(
                            "flex items-center gap-1 text-xs text-slate-500",
                            enableHover && "hover:text-[#FC653C]",
                          )}
                        >
                          <Repeat2 className="h-4 w-4" />
                          <span>{post.stats.retweets}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
    />
  );
}
