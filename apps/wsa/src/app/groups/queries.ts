export const GET_GROUPS = `
  query GetGroups {
    bpGroups {
      nodes {
        id
        name
        metaData {
          key
          value
        }
      }
    }
  }
`;

export const GET_GROUP = `
  query GetGroup($id: ID!) {
    node(id: $id) {
      ... on BpGroup {
        id
        name
        metaData {
          key
          value
        }
      }
    }
  }
`;
