export const GET_USERS = `
  query GetUsers {
    users(first: 100) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_USER = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      slug
      avatar {
        url
      }
      roles {
        nodes {
          name
        }
      }
      description
      posts {
        nodes {
          id
          title
          date
          status
        }
        pageInfo {
          total
        }
      }
      courses {
        nodes {
          id
          title
          status
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;
