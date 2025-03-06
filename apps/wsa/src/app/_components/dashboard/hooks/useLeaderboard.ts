import { fetchWordPress } from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  stats: {
    lessonsCompleted: number;
    tradeIdeasShared: number;
  };
}

interface UserNode {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LeaderboardResponse {
  users: {
    nodes: UserNode[];
  };
}

const LEADERBOARD_QUERY = `
  query GetLeaderboard {
    users(first: 10) {
      nodes {
        id
        name
        email
        firstName
        lastName
      }
    }
  }
`;

export function useLeaderboard() {
  return useQuery<{ users: LeaderboardUser[] }>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const data = (await fetchWordPress(
        LEADERBOARD_QUERY,
      )) as LeaderboardResponse;

      // Transform the data to include rank and points
      const enhancedUsers = data.users.nodes.map(
        (user: UserNode, index: number) => ({
          id: user.id,
          name: user.name || `${user.firstName} ${user.lastName}`.trim(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
          points: Math.floor(Math.random() * 1000) + 500, // Mock points
          rank: index + 1,
          stats: {
            lessonsCompleted: Math.floor(Math.random() * 100),
            tradeIdeasShared: Math.floor(Math.random() * 200),
          },
        }),
      );

      // Sort by points in descending order
      enhancedUsers.sort(
        (a: LeaderboardUser, b: LeaderboardUser) => b.points - a.points,
      );

      return {
        users: enhancedUsers,
      };
    },
  });
}
