import { useQuery } from "@tanstack/react-query";

import {
  GET_COURSE,
  GET_COURSES,
  GET_LESSON,
  GET_QUIZ,
  GET_RELATED_LESSONS,
} from "../course/queries";
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
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

interface WordPressCoursesResponse {
  published: {
    nodes: Course[];
  };
  drafts: {
    nodes: Course[];
  };
}

interface WordPressCourseResponse {
  course: Course;
}

interface WordPressLessonResponse {
  lesson: Lesson;
}

interface WordPressQuizResponse {
  quiz: Quiz;
}

interface WordPressRelatedLessonsResponse {
  lessons: {
    nodes: {
      id: string;
      title: string;
      date: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

export function useLearndash() {
  // Fetch all courses
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery<WordPressCoursesResponse | null>({
    queryKey: ["courses"],
    queryFn: () => fetchWordPress(GET_COURSES),
  });

  // Process courses data
  const publishedCourses = coursesData ? coursesData.published.nodes : [];
  const draftCourses = coursesData ? coursesData.drafts.nodes : [];
  const allCourses = [...publishedCourses, ...draftCourses];

  // Function to fetch a single course
  const useCourse = (courseId: string | null) => {
    const {
      data: courseData,
      isLoading,
      error,
    } = useQuery<WordPressCourseResponse | null>({
      queryKey: ["course", courseId],
      queryFn: () =>
        fetchWordPress(GET_COURSE, {
          id: courseId ? decodeURIComponent(courseId) : "",
        }),
      enabled: !!courseId,
    });

    return {
      course: courseData?.course ?? null,
      isLoading,
      error,
    };
  };

  // Function to fetch a single lesson
  const useLesson = (lessonId: string | null) => {
    const {
      data: lessonData,
      isLoading,
      error,
    } = useQuery<WordPressLessonResponse | null>({
      queryKey: ["lesson", lessonId],
      queryFn: () =>
        fetchWordPress(GET_LESSON, {
          id: lessonId ? decodeURIComponent(lessonId) : "",
        }),
      enabled: !!lessonId,
    });

    return {
      data: lessonData?.lesson ?? null,
      isLoading,
      error,
    };
  };

  // Function to fetch related lessons
  const useRelatedLessons = (lessonId: string | null) => {
    const {
      data: relatedLessonsData,
      isLoading,
      error,
    } = useQuery<WordPressRelatedLessonsResponse | null>({
      queryKey: ["relatedLessons", lessonId],
      queryFn: () =>
        fetchWordPress(GET_RELATED_LESSONS, {
          currentLessonId: lessonId ? decodeURIComponent(lessonId) : "",
        }),
      enabled: !!lessonId,
    });

    return {
      data: relatedLessonsData?.lessons.nodes ?? [],
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
    } = useQuery<WordPressQuizResponse | null>({
      queryKey: ["quiz", quizId],
      queryFn: () =>
        fetchWordPress(GET_QUIZ, {
          id: quizId ? decodeURIComponent(quizId) : "",
        }),
      enabled: !!quizId,
    });

    return {
      quiz: quizData?.quiz ?? null,
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

    // Single lesson helper
    useLesson,

    // Related lessons helper
    useRelatedLessons,

    // Quiz helper
    useQuiz,
  };
}
