"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Github,
  Globe,
  Heart,
  Linkedin,
  MessageSquare,
  MoreHorizontal,
  Send,
  Twitter,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";
import { Button } from "@acme/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@acme/ui/components/hover-card";
import { Textarea } from "@acme/ui/components/textarea";
import { GeneralCard } from "@acme/ui/general/GeneralCard";
import { cn } from "@acme/ui/lib/utils";

interface AuthorInfo {
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

interface Comment {
  id: string;
  author: AuthorInfo;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

// Mock data for comments
const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      role: "Senior Developer",
      company: "TechCorp",
      bio: "Full-stack developer passionate about React and TypeScript",
      website: "https://sarahchen.dev",
      twitter: "@sarahcodes",
      linkedin: "sarahchen",
      github: "sarahchen",
    },
    content:
      "This lesson was incredibly helpful! The examples really clarified the concepts.",
    createdAt: new Date(2024, 2, 15),
    likes: 12,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?u=mike",
          role: "Tech Lead",
          company: "DevCo",
          bio: "Building the future of web development",
          github: "mikej",
        },
        content:
          "Glad you found it useful! Let me know if you have any questions.",
        createdAt: new Date(2024, 2, 16),
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?u=alex",
      role: "UX Designer",
      company: "DesignLab",
      bio: "Creating beautiful and functional user experiences",
      twitter: "@alexdesigns",
      linkedin: "alexrivera",
    },
    content:
      "The UI patterns discussed here are game-changing. I've already started implementing them in my current project.",
    createdAt: new Date(2024, 2, 14),
    likes: 8,
    replies: [],
  },
  // Add 8 more mock comments here with varying details and replies
  {
    id: "3",
    author: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=emma",
      role: "Frontend Developer",
      company: "WebFront",
      bio: "CSS wizard and accessibility advocate",
      twitter: "@emmacodes",
      github: "emmaw",
    },
    content:
      "The section about responsive design patterns was particularly insightful.",
    createdAt: new Date(2024, 2, 13),
    likes: 15,
    replies: [],
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?u=david",
      role: "Backend Engineer",
      company: "ServerPro",
      bio: "Scaling systems and solving problems",
      linkedin: "davidkim",
      github: "davidk",
    },
    content:
      "Great explanation of the backend integration. Would love to see more content like this.",
    createdAt: new Date(2024, 2, 12),
    likes: 10,
    replies: [],
  },
  {
    id: "5",
    author: {
      name: "Lisa Thompson",
      avatar: "https://i.pravatar.cc/150?u=lisa",
      role: "Product Manager",
      company: "ProductHub",
      bio: "Bridging the gap between users and developers",
      twitter: "@lisaproduct",
      linkedin: "lisathompson",
    },
    content:
      "From a product perspective, these patterns make perfect sense. Well structured!",
    createdAt: new Date(2024, 2, 11),
    likes: 7,
    replies: [],
  },
];

function CommentComponent({
  comment,
  isReply = false,
  activeReplyId,
  onReplyClick,
}: {
  comment: Comment;
  isReply?: boolean;
  activeReplyId: string | null;
  onReplyClick: (commentId: string | null) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isReplying = activeReplyId === comment.id;

  const handleReplySubmit = () => {
    // Handle reply submission here
    setReplyText("");
    onReplyClick(null);
  };

  return (
    <GeneralCard
      title=""
      className={cn(
        "overflow-visible",
        isReply ? "ml-8" : "",
        isReplying && "shadow-lg ring-2 ring-primary/20",
      )}
      contentClassName="p-4"
      content={
        <>
          <div className="flex items-start justify-between">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex cursor-pointer items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium transition-colors hover:text-primary">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-sm">
                    <h4 className="text-lg font-semibold">
                      {comment.author.name}
                    </h4>
                    {comment.author.role && (
                      <p className="text-muted-foreground">
                        {comment.author.role}
                      </p>
                    )}
                    {comment.author.company && (
                      <p className="text-muted-foreground">
                        {comment.author.company}
                      </p>
                    )}
                    {comment.author.bio && (
                      <p className="line-clamp-2 text-muted-foreground">
                        {comment.author.bio}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      {comment.author.website && (
                        <a
                          href={comment.author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {comment.author.twitter && (
                        <a
                          href={`https://twitter.com/${comment.author.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {comment.author.linkedin && (
                        <a
                          href={comment.author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {comment.author.github && (
                        <a
                          href={`https://github.com/${comment.author.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-2 text-sm">{comment.content}</div>

          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  isLiked && "fill-current text-primary",
                )}
              />
              <span>{comment.likes + (isLiked ? 1 : 0)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onReplyClick(isReplying ? null : comment.id)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Reply</span>
            </Button>
          </div>

          {isReplying && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-20 resize-none bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReplyClick(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Render nested replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  activeReplyId={activeReplyId}
                  onReplyClick={onReplyClick}
                />
              ))}
            </div>
          )}
        </>
      }
    />
  );
}

export function Comments() {
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  return (
    <GeneralCard
      title="Comments"
      layout="stacked"
      className="mt-8 border-none bg-transparent shadow-none"
      contentClassName="space-y-6"
      content={
        <>
          <GeneralCard
            layout="stacked"
            className="mt-8 space-y-6"
            contentClassName="p-0 "
            content={
              <div className="mb-14 rounded-lg bg-muted/50 p-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-muted-foreground/20 bg-background"
                />
                <div className="mt-2 flex justify-end">
                  <Button disabled={!newComment.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </div>
            }
          />

          <div className="TEST3 space-y-6">
            {mockComments.map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                activeReplyId={activeReplyId}
                onReplyClick={setActiveReplyId}
              />
            ))}
          </div>
        </>
      }
    />
  );
}
