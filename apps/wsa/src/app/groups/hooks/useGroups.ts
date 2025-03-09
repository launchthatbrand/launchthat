import { graphqlClient } from "../../client";
import { useQuery } from "@tanstack/react-query";

interface Group {
  id: string;
  name: string;
  description: string;
  // Add other group fields as needed
}

interface GroupsResponse {
  groups: {
    nodes: Group[];
  };
}

const GET_GROUPS = `
  query GetGroups {
    groups {
      nodes {
        id
        name
        description
      }
    }
  }
`;

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const data = await graphqlClient.request<GroupsResponse>(GET_GROUPS);
      return data;
    },
  });
}
