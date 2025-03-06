"use client";

import { RadioGroup, RadioGroupItem } from "~/app/_components/ui/radio-group";
import { Card } from "~/app/_components/ui/card";
import { Label } from "~/app/_components/ui/label";
import { type Question } from "~/app/wordpress/hooks/useLearndash";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
  showFeedback?: boolean;
}

// Mock answers data (this should come from your API)
const mockAnswers: Record<string, { correct: string; options: string[] }> = {
  default: {
    correct: "option1",
    options: ["option1", "option2", "option3", "option4"],
  },
};

const optionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export function QuestionCard({
  question,
  onAnswer,
  selectedAnswer,
  showFeedback = false,
}: QuestionCardProps) {
  const [localAnswer, setLocalAnswer] = useState<string | undefined>(undefined);
  const answers = mockAnswers[question.id] || mockAnswers.default;
  const isCorrect = selectedAnswer === answers.correct;

  // Reset local answer when question changes
  useEffect(() => {
    setLocalAnswer(undefined);
  }, [question.id]);

  const handleAnswerChange = (value: string) => {
    setLocalAnswer(value);
    onAnswer(value);
  };

  return (
    <Card
      className={cn(
        "p-6",
        showFeedback && (isCorrect ? "border-green-200" : "border-red-200"),
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h3 className="text-xl font-semibold">{question.title}</h3>
        {question.description && (
          <p className="mt-2 text-gray-600">{question.description}</p>
        )}
      </motion.div>

      <RadioGroup
        onValueChange={handleAnswerChange}
        value={localAnswer}
        className="space-y-2"
      >
        {answers.options.map((option, index) => (
          <motion.div
            key={index}
            variants={optionVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className={cn(
              "flex items-center space-x-2 rounded-lg border p-4 transition-colors",
              localAnswer === option &&
                (showFeedback
                  ? isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                  : "border-primary"),
            )}
          >
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label
              htmlFor={`${question.id}-${option}`}
              className="flex-grow cursor-pointer"
            >
              {option}
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <p
            className={cn(
              "text-sm font-medium",
              isCorrect ? "text-green-600" : "text-red-600",
            )}
          >
            {isCorrect ? question.correctMsg : question.incorrectMsg}
          </p>
        </motion.div>
      )}
    </Card>
  );
}
