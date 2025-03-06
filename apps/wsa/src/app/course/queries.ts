export const GET_COURSES = `
  query GetCourses {
    published: courses(where: {status: PUBLISH}, first: 100) {
      nodes {
        __typename
        id
        title
        status
        featuredImage {
          node {
            sourceUrl
          }
        }
        siblings {
          pageInfo {
            total
          }
        }
      }
    }
    drafts: courses(where: {status: DRAFT}, first: 100) {
      nodes {
        __typename
        id
        title
        status
        featuredImage {
          node {
            sourceUrl
          }
        }
        siblings {
          pageInfo {
            total
          }
        }
      }
    }
  }
`;

export const GET_RELATED_LESSONS = `
  query GetRelatedLessons($currentLessonId: ID!) {
    lessons(first: 3, where: { notIn: [$currentLessonId] }) {
      nodes {
        id
        title
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_COURSE = `
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      siblings(first: 200) {
        nodes {
          id
          title
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
      quizzes {
        nodes {
          id
          title
        }
      }
    }
  }
`;

export const GET_LESSON = `
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      siblings {
        nodes {
          id
          title
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
      quizzes {
        nodes {
          id
          title
        }
      }
    }
  }
`;

export const GET_TOPIC = `
  query GetTopic($id: ID!) {
    topic(id: $id) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_QUIZ = `
  query GetQuiz($id: ID!) {
    quiz(id: $id) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      questions {
        nodes {
          id
          title
          type
          answers {
            nodes {
              id
              title
              isCorrect
            }
          }
        }
      }
    }
  }
`;
