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

export const GET_QUIZ = `
  query GetQuiz($id: ID!) {
    quiz(id: $id) {
      id
      title
      questions {
        nodes {
          id
          title
          questionId
          
        }
      }
    }
  }
`;
