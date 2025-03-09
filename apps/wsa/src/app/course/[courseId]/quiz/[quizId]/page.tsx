"use client";

import { Skeleton } from "@acme/ui/components/skeleton";

import { Quiz } from "~/app/_components/learndash/quiz";
import { useLearndash } from "~/app/hooks/useLearndash";

interface QuizPageProps {
  params: {
    courseId: string;
    quizId: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { useQuiz } = useLearndash();
  const { quiz, isLoading, error } = useQuiz(params.quizId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-2/3" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Error loading quiz
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-600">
          Quiz not found
        </div>
      </div>
    );
  }

  const handleQuizComplete = (results: any) => {
    console.log("Quiz completed:", results);
    // Here you would typically send the results to your backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Quiz
        title={quiz.title}
        questions={quiz.questions?.nodes ?? []}
        showAllQuestions={false}
        allowBacktracking={false}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
