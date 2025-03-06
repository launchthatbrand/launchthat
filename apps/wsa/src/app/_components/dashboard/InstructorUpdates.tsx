import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Twitter, Youtube } from "lucide-react";

import Image from "next/image";
import { cn } from "@/lib/utils";

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
}

const PlatformIcon = {
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

export function InstructorUpdates({ posts }: InstructorUpdatesProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b bg-[#2b0e4d] pb-8 text-white">
        <CardTitle className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ LATEST UPDATES ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">From Your Mentor</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Stay updated with Quillan's latest content
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        {posts.map((post) => {
          const Icon = PlatformIcon[post.platform];
          return (
            <div
              key={post.id}
              className="group relative space-y-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-[#FC653C]/20 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#2b0e4d]">{post.author}</p>
                  <p className="text-sm text-slate-500">{post.handle}</p>
                </div>
                <Icon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-sm text-slate-600">{post.content}</p>

              {post.media && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={post.media.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  {post.media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Youtube className="h-12 w-12 text-white" />
                      {post.media.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {post.media.duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {post.stats && (
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{post.stats.likes.toLocaleString()} likes</span>
                  {post.stats.retweets && (
                    <span>{post.stats.retweets.toLocaleString()} retweets</span>
                  )}
                  {post.stats.replies && (
                    <span>{post.stats.replies.toLocaleString()} replies</span>
                  )}
                </div>
              )}

              <time className="text-xs text-slate-400">
                {new Date(post.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
