export const LOGIN_MUTATION = `
  mutation LoginUser($username: String!, $password: String!) {
    login(input: {
      clientMutationId: "uniqueId",
      username: $username,
      password: $password
    }) {
      authToken
      user {
        id
        name
        email
      }
    }
  }
`;

export interface WordPressLoginResponse {
  data: {
    login: {
      authToken: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
  errors?: { message: string }[];
}
