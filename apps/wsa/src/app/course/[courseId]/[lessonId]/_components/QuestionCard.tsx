"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Answer {
  id: string;
  title: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  title: string;
  type: string;
  answers: {
    nodes: Answer[];
  };
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onAnswerChange: (questionId: string, answerId: string) => void;
}

export function QuestionCard({
  question,
  index,
  onAnswerChange,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  console.log("QuestionCard received question:", question);
  const hasAnswers =
    question.answers?.nodes && question.answers.nodes.length > 0;

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onAnswerChange(question.id, value);
  };

  return (
    <Card className="border-0 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-base">
          {index + 1}. {question.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.type === "single" && hasAnswers ? (
          <RadioGroup
            value={selectedAnswer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {question.answers.nodes.map((answer) => (
              <div key={answer.id} className="flex items-center space-x-2">
                <RadioGroupItem value={answer.id} id={answer.id} />
                <Label htmlFor={answer.id} className="text-sm">
                  {answer.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-sm text-muted-foreground">
            {!hasAnswers ? "No answers available" : "Unsupported question type"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
