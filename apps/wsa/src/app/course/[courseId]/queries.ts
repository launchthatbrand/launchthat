export const GET_LESSON = `
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      id
      title
      siblings {
        nodes {
          id
          title
        }
      }
    }
  }
`;
