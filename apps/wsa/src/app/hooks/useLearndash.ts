import { useQuery } from "@tanstack/react-query";

import { GET_COURSE, GET_COURSES, GET_QUIZ } from "../course/queries";
import { fetchWordPress } from "../utils/api";

export interface Question {
  id: string;
  title: string;
  questionId: string;
  description: string;
  correctMsg: string;
  incorrectMsg: string;
  questionType: string;
  points: number;
  answerData: string;
}

interface Quiz {
  id: string;
  title: string;
  questions?: {
    nodes: Question[];
  };
}

interface Course {
  id: string;
  title: string;
  content?: string;
  status?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  siblings?: {
    nodes: Lesson[];
    pageInfo: {
      total: number;
    };
  };
  quizzes?: {
    nodes: Quiz[];
  };
}

interface Lesson {
  id: string;
  title: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

export function useLearndash() {
  // Fetch all courses
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchWordPress(GET_COURSES),
  });

  console.log("coursesData", coursesData);

  // Process courses data
  const publishedCourses = coursesData?.published?.nodes ?? [];
  const draftCourses = coursesData?.drafts?.nodes ?? [];
  const allCourses = [...publishedCourses, ...draftCourses];

  // Function to fetch a single course
  const useCourse = (courseId: string | null) => {
    const {
      data: courseData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["course", courseId],
      queryFn: () =>
        fetchWordPress(GET_COURSE, {
          id: courseId ? decodeURIComponent(courseId) : "",
        }),
      enabled: !!courseId,
    });

    return {
      course: courseData?.course,
      isLoading,
      error,
    };
  };

  // Function to fetch a single quiz
  const useQuiz = (quizId: string | null) => {
    const {
      data: quizData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["quiz", quizId],
      queryFn: () =>
        fetchWordPress(GET_QUIZ, {
          id: quizId ? decodeURIComponent(quizId) : "",
        }),
      enabled: !!quizId,
    });

    return {
      quiz: quizData?.quiz,
      isLoading,
      error,
    };
  };

  return {
    // Courses list
    courses: allCourses,
    publishedCourses,
    draftCourses,
    isLoadingCourses,
    coursesError,

    // Single course helper
    useCourse,

    // Quiz helper
    useQuiz,
  };
}
