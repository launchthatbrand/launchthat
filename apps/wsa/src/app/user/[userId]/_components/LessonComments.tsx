import Link from "next/link";
import { Heart, Reply } from "lucide-react";

import { GeneralCard } from "@acme/ui/general/GeneralCard";

import type { LessonComment } from "../_data/mock-data";

interface Props {
  comments: LessonComment[];
}

export function LessonComments({ comments }: Props) {
  return (
    <GeneralCard
      layout="stacked"
      contentClassName="space-y-6"
      title={
        <div className="border-b bg-[#2b0e4d] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#FC653C]">
                ▬ Lesson Comments ▬
              </p>
              <h3 className="mt-2 text-xl font-bold">Your Lesson Comments</h3>
              <p className="mt-1 text-sm font-normal text-gray-300">
                Track your lesson comments
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
              {comments.length}
            </span>
          </div>
        </div>
      }
      content={
        <>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              <Link
                href={`/lessons/${comment.lessonId}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {comment.lessonTitle}
              </Link>
              <p className="mt-2 text-gray-600">{comment.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <Reply className="h-4 w-4" />
                    <span>{comment.replies}</span>
                  </button>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          ))}
        </>
      }
    />
  );
}
