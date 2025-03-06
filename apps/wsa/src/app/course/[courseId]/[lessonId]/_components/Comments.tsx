"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Github,
  Globe,
  Heart,
  Linkedin,
  MessageCircle,
  MoreHorizontal,
  Send,
  Twitter,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/components/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";
import { Button } from "@acme/ui/components/button";
import { Card } from "@acme/ui/components/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@acme/ui/components/hover-card";
import { ScrollArea } from "@acme/ui/components/scroll-area";
import { Textarea } from "@acme/ui/components/textarea";
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

function AuthorCard({ author }: { author: AuthorInfo }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{author.name}</span>
          {author.role && (
            <span className="text-sm text-muted-foreground">
              {author.role} {author.company && `at ${author.company}`}
            </span>
          )}
        </div>
      </div>
      {author.bio && (
        <p className="text-sm text-muted-foreground">{author.bio}</p>
      )}
      <div className="flex gap-2">
        {author.website && (
          <a
            href={author.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
        {author.twitter && (
          <a
            href={`https://twitter.com/${author.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#1DA1F2]"
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
        {author.linkedin && (
          <a
            href={`https://linkedin.com/in/${author.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#0077B5]"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {author.github && (
          <a
            href={`https://github.com/${author.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-black dark:hover:text-white"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

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
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white/50 p-4 shadow-md transition-all duration-200",
        isReply ? "ml-8 border-muted/50" : "border-muted",
        isReplying && "shadow-lg ring-2 ring-primary/20",
      )}
    >
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
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 shadow-lg">
            <AuthorCard author={comment.author} />
          </HoverCardContent>
        </HoverCard>
        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-foreground/90">{comment.content}</p>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 hover:bg-muted/50",
            isLiked && "text-red-500 hover:text-red-600",
          )}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          <span>{comment.likes + (isLiked ? 1 : 0)}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 hover:bg-muted/50",
            isReplying && "text-primary hover:text-primary/90",
          )}
          onClick={() => onReplyClick(isReplying ? null : comment.id)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{isReplying ? "Cancel" : "Reply"}</span>
        </Button>
      </div>

      {isReplying && (
        <div className="flex flex-col gap-2 rounded-md bg-muted/50 p-3">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
            className="border-muted-foreground/20"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyText("");
                onReplyClick(null);
              }}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReplySubmit}
              disabled={!replyText.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      )}

      {comment.replies.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="replies" className="border-0">
            <AccordionTrigger className="rounded-md px-2 text-sm font-normal hover:bg-muted/50">
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "Reply" : "Replies"}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pt-2">
                {comment.replies.map((reply) => (
                  <CommentComponent
                    key={reply.id}
                    comment={reply}
                    isReply
                    activeReplyId={activeReplyId}
                    onReplyClick={onReplyClick}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

export function Comments() {
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  return (
    <Card className="mt-8 border-none bg-transparent p-0 shadow-none">
      <h2 className="mb-4 text-xl font-semibold">Comments</h2>
      <div className="mb-6 rounded-lg bg-muted/50 p-3">
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

      <div className="flex flex-col gap-4 pb-4">
        {mockComments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            activeReplyId={activeReplyId}
            onReplyClick={setActiveReplyId}
          />
        ))}
      </div>
    </Card>
  );
}
