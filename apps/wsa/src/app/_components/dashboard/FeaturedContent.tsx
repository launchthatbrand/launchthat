import React from "react";
import Image from "next/image";
import { Clock, PlayCircle, ThumbsUp, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/components/tabs";
import { cn } from "@acme/ui/lib/utils";

import { Carousel3D } from "./Carousel3D";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  views: number;
  likes: number;
  category: string;
  publishedAt: string;
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
}

const latestContent: ContentItem[] = [
  {
    id: "1",
    title: "Advanced Price Action: Supply and Demand Zones",
    description:
      "Learn how to identify and trade high-probability supply and demand zones",
    duration: "45:22",
    thumbnail: "/content/price-action-thumb.jpg",
    views: 1234,
    likes: 432,
    category: "Technical Analysis",
    publishedAt: "2024-03-15T10:00:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
  {
    id: "2",
    title: "Risk Management Masterclass",
    description:
      "Essential risk management strategies for consistent profitability",
    duration: "1:12:45",
    thumbnail: "/content/risk-management-thumb.jpg",
    views: 987,
    likes: 345,
    category: "Risk Management",
    publishedAt: "2024-03-14T15:30:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
  {
    id: "3",
    title: "Market Structure Deep Dive",
    description: "Understanding market structure and order flow",
    duration: "55:15",
    thumbnail: "/content/market-structure-thumb.jpg",
    views: 756,
    likes: 289,
    category: "Market Analysis",
    publishedAt: "2024-03-13T09:15:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
];

const studentFavorites: ContentItem[] = [
  {
    id: "4",
    title: "Psychology of Trading Success",
    description:
      "Master your mindset and emotions for better trading decisions",
    duration: "1:30:00",
    thumbnail: "/content/psychology-thumb.jpg",
    views: 5432,
    likes: 1234,
    category: "Psychology",
    publishedAt: "2024-02-28T14:00:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
  {
    id: "5",
    title: "Fibonacci Trading Secrets",
    description: "How to use Fibonacci retracements and extensions effectively",
    duration: "58:30",
    thumbnail: "/content/fibonacci-thumb.jpg",
    views: 4321,
    likes: 987,
    category: "Technical Analysis",
    publishedAt: "2024-02-25T11:20:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
  {
    id: "6",
    title: "Breakout Trading Strategy",
    description: "Complete guide to trading breakouts with high accuracy",
    duration: "1:05:45",
    thumbnail: "/content/breakout-thumb.jpg",
    views: 3876,
    likes: 865,
    category: "Strategy",
    publishedAt: "2024-02-20T16:45:00Z",
    author: {
      node: {
        name: "Quillan Black",
        avatar: {
          url: "/avatars/quillan.jpg",
        },
      },
    },
  },
];

export function FeaturedContent({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = React.useState<"latest" | "favorites">(
    "latest",
  );
  const content = activeTab === "latest" ? latestContent : studentFavorites;

  const renderCarouselItem = (item: ContentItem) => (
    <div className="group relative h-full w-full overflow-hidden rounded-lg bg-white">
      {/* Video Thumbnail */}
      <div className="relative aspect-video w-full">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 text-white">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {item.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            {item.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {item.duration}
          </span>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-16 w-16 text-white opacity-80 transition-transform group-hover:scale-110" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs text-slate-600">1 Topics</div>
        <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-[#42307D]">
          {item.title}
        </h3>

        {/* Author */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={item.author.node.avatar?.url ?? "/avatars/default.jpg"}
              alt={item.author.node.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-slate-700">
            {item.author.node.name}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card
      className={cn(
        "overflow-hidden border border-slate-200 shadow-none",
        className,
      )}
    >
      <CardHeader className="min-h-36 pb-6 text-[#2b0e4d]">
        <CardTitle className="flex justify-between space-y-4">
          <div>
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ FEATURED CONTENT ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Trading Education</h3>
            <p className="mt-1 text-sm font-normal">
              Learn from our best content
            </p>
          </div>
          <Tabs
            defaultValue="latest"
            onValueChange={(value) =>
              setActiveTab(value as "latest" | "favorites")
            }
          >
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger
                value="latest"
                className={cn(
                  "data-[state=active]:bg-[#2b0e4d] data-[state=active]:text-white",
                  "border border-slate-200 data-[state=inactive]:hover:bg-[#2b0e4d]/50",
                )}
              >
                Latest Content
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className={cn(
                  "data-[state=active]:bg-[#2b0e4d] data-[state=active]:text-white",
                  "border border-slate-200 data-[state=inactive]:hover:bg-[#2b0e4d]/50",
                )}
              >
                Student Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Carousel3D
          items={content}
          renderItem={renderCarouselItem}
          className="h-[450px] bg-gradient-to-b from-[#2b0e4d]/50 to-slate-50"
        />
      </CardContent>
    </Card>
  );
}
