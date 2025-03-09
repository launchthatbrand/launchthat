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
  Star,
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
  rating?: number;
  replies: Comment[];
}

// Add a read-only star display component for showing existing ratings
function StarRatingDisplay({ rating = 0 }: { rating?: number }) {
  if (!rating) return null;

  return (
    <div className="mt-1 flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-3 w-3 ${
            value <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
    </div>
  );
}

// Update the mock comments to include ratings
const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Jane Smith",
      avatar: "https://avatar.vercel.sh/jane-smith",
      role: "Product Designer",
      company: "Design Co.",
    },
    content:
      "This lesson was incredibly helpful! The explanations were clear and I loved the practical examples.",
    createdAt: new Date(2023, 5, 15),
    likes: 24,
    rating: 5, // Add rating
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
      name: "John Doe",
      avatar: "https://avatar.vercel.sh/john-doe",
      role: "Senior Developer",
      company: "Tech Inc.",
    },
    content:
      "I had some trouble understanding the section on advanced techniques. Could use more examples.",
    createdAt: new Date(2023, 5, 10),
    likes: 12,
    rating: 3, // Add rating
    replies: [],
  },
  {
    id: "3",
    author: {
      name: "Alice Johnson",
      avatar: "https://avatar.vercel.sh/alice-johnson",
      role: "Student",
    },
    content: "Thanks for this content. Looking forward to more lessons!",
    createdAt: new Date(2023, 5, 5),
    likes: 7,
    rating: 4, // Add rating
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
  const [replyRating, setReplyRating] = useState(0);
  const isReplying = activeReplyId === comment.id;

  const handleReplySubmit = () => {
    if (!replyText.trim() || replyRating === 0) return;

    // Handle reply submission here
    console.log(`Reply submitted with rating: ${replyRating}`);
    setReplyText("");
    setReplyRating(0);
    onReplyClick(null);
  };

  const isReplyValid = replyText.trim() !== "" && replyRating > 0;

  return (
    <GeneralCard
      title=""
      className={cn(
        "overflow-visible",
        isReply ? "ml-8" : "",
        isReplying && "shadow-lg ring-2 ring-primary/20",
      )}
      contentClassName="p-4 overflow-visible"
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
                    <div className="xs:flex-row xs:items-center flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                      <StarRatingDisplay rating={comment.rating} />
                    </div>
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
            <div className="mt-4 space-y-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-20 resize-none bg-background"
              />
              <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <CommentRating rating={replyRating} onRate={setReplyRating} />
                <div className="mt-3 flex justify-end gap-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onReplyClick(null);
                      setReplyRating(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReplySubmit}
                    disabled={!isReplyValid}
                  >
                    Reply
                  </Button>
                </div>
              </div>
              {!isReplyValid &&
                replyText.trim() !== "" &&
                replyRating === 0 && (
                  <p className="text-xs text-yellow-600">
                    Please add a rating to your reply
                  </p>
                )}
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

// Star Rating component for comments
function CommentRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (value: number) => void;
}) {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2 text-sm font-medium text-muted-foreground">
        Rating:
      </span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onRate(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={`h-4 w-4 ${
                (hoveredRating ? value <= hoveredRating : value <= rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="ml-2 text-xs text-muted-foreground">({rating})</span>
      )}
    </div>
  );
}

export function Comments() {
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState<number>(0);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleSubmitComment = () => {
    if (newComment.trim() && commentRating > 0) {
      // Here you would typically make an API call to submit the comment with rating
      // For now, we'll just reset the form
      setNewComment("");
      setCommentRating(0);
      alert(`Comment submitted with ${commentRating} star rating!`);
    }
  };

  const isFormValid = newComment.trim() !== "" && commentRating > 0;

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
            contentClassName="p-0"
            content={
              <div className="mb-14 rounded-lg bg-muted/50 p-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-muted-foreground/20 bg-background"
                />
                <div className="mt-3 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <CommentRating
                    rating={commentRating}
                    onRate={setCommentRating}
                  />
                  <div className="ml-auto mt-3 sm:mt-0">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!isFormValid}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </Button>
                  </div>
                </div>
                {!isFormValid &&
                  newComment.trim() !== "" &&
                  commentRating === 0 && (
                    <p className="mt-1 text-xs text-yellow-600">
                      Please add a rating before posting
                    </p>
                  )}
              </div>
            }
          />

          <div className="space-y-6">
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
