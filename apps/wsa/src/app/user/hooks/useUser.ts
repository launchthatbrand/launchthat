import { fetchWordPress } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";

interface UserResponse {
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url: string;
    };
  };
}

const USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      firstName
      lastName
      email
      avatar {
        url
      }
    }
  }
`;

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const data = (await fetchWordPress(USER_QUERY, {
        id: userId,
      })) as UserResponse;
      console.log(data);

      // Transform the data to include mock data for missing fields
      return {
        ...data.user,
        avatar:
          data.user.avatar?.url ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}`,
        location: "Miami Florida, USA", // Mock data
        tradingExperience: "5+ Years Trading Experience", // Mock data
        preferredMarkets: ["Crypto", "Forex"], // Mock data
        stats: {
          lessonsCompleted: Math.floor(Math.random() * 100),
          tradeIdeasShared: Math.floor(Math.random() * 200),
        },
      };
    },
    enabled: Boolean(userId), // Only run the query if we have a userId
  });
}
