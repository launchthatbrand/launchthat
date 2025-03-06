"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/app/_components/ui/button";
import { Card } from "~/app/_components/ui/card";
import { Form } from "~/app/_components/ui/form";
import { Progress } from "~/app/_components/ui/progress";
import { type Question } from "~/app/wordpress/hooks/useLearndash";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { QuestionCard } from "./QuestionCard";

interface QuizProps {
  title: string;
  questions: Question[];
  showAllQuestions?: boolean;
  allowBacktracking?: boolean;
  onComplete?: (results: QuizResults) => void;
}

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: string;
  }[];
}

// Mock data for answers and feedback
interface AnswerFeedback {
  correct: {
    message: string;
    links?: { title: string; url: string }[];
  };
  incorrect: {
    message: string;
    links?: { title: string; url: string }[];
  };
}

const mockAnswerFeedback: Record<string, AnswerFeedback> = {
  default: {
    correct: {
      message: "Great job! You've mastered this concept.",
      links: [
        {
          title: "Learn more about this topic",
          url: "#",
        },
      ],
    },
    incorrect: {
      message: "Keep practicing! Here are some resources to help you improve.",
      links: [
        {
          title: "Review the lesson material",
          url: "#",
        },
        {
          title: "Watch the tutorial video",
          url: "#",
        },
      ],
    },
  },
};

// Mock answers data
const mockAnswers: Record<string, { correct: string; options: string[] }> = {
  default: {
    correct: "option1",
    options: ["option1", "option2", "option3", "option4"],
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function Quiz({
  title,
  questions,
  showAllQuestions = false,
  allowBacktracking = false,
  onComplete,
}: QuizProps) {
  const [[currentQuestionIndex, direction], setPage] = useState([0, 0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    links?: { title: string; url: string }[];
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const form = useForm({
    defaultValues: {
      answers: {} as Record<string, string>,
    },
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const paginate = (newDirection: number) => {
    if (
      currentQuestionIndex + newDirection >= 0 &&
      currentQuestionIndex + newDirection < questions.length
    ) {
      setPage([currentQuestionIndex + newDirection, newDirection]);
      setFeedback(null);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    const isCorrect = mockAnswers[questionId]?.correct === answer;
    const feedbackData =
      mockAnswerFeedback[questionId] || mockAnswerFeedback.default;

    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setFeedback({
      isCorrect,
      message: isCorrect
        ? feedbackData.correct.message
        : feedbackData.incorrect.message,
      links: isCorrect
        ? feedbackData.correct.links
        : feedbackData.incorrect.links,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      paginate(1);
    } else {
      completeQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0 && allowBacktracking) {
      paginate(-1);
    }
  };

  const completeQuiz = () => {
    setIsCompleted(true);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Calculate results
    const results: QuizResults = {
      totalQuestions: questions.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      answers: [],
    };

    questions.forEach((question) => {
      const isCorrect =
        mockAnswers[question.id]?.correct === answers[question.id];
      results.answers.push({
        questionId: question.id,
        isCorrect,
        selectedAnswer: answers[question.id],
      });
      if (isCorrect) {
        results.correctAnswers++;
      } else {
        results.incorrectAnswers++;
      }
    });

    onComplete?.(results);
  };

  if (showAllQuestions) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(completeQuiz)} className="space-y-8">
          <div className="space-y-6">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onAnswer={(answer) => handleAnswer(question.id, answer)}
                selectedAnswer={answers[question.id]}
                showFeedback={isCompleted}
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Submit Quiz
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="relative h-[400px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handleBack();
              }
            }}
            className="absolute w-full"
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              selectedAnswer={answers[currentQuestion.id]}
              showFeedback={!!feedback}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card
            className={cn(
              "p-4",
              feedback.isCorrect
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50",
            )}
          >
            <p
              className={cn(
                "font-medium",
                feedback.isCorrect ? "text-green-700" : "text-red-700",
              )}
            >
              {feedback.message}
            </p>
            {feedback.links && (
              <div className="mt-2 space-y-1">
                {feedback.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      <div className="flex justify-between">
        {allowBacktracking && (
          <Button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="ml-auto"
        >
          {currentQuestionIndex === questions.length - 1 ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
