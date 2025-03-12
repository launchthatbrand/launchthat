"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchWordPress } from "../utils/api";
import { UserHeader } from "./_components/UserHeader";

const GET_USER = `
  query GetUser($id: ID!) {
    user(id: $id, idType: SLUG) {
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

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const userId = params.userId as string | undefined;
  console.log("userId", userId);

  const { data: userData, isLoading } = useQuery<UserResponse | null, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetchWordPress<UserResponse>(GET_USER, {
        id: userId,
      });
      return response ?? null;
    },
    enabled: Boolean(userId),
  });

  console.log("userData", userData);

  return (
    <div className="from-theme-background via-theme-background-secondary to-theme-background flex min-h-screen w-full flex-1 flex-col bg-gradient-to-br">
      {userId && (
        <UserHeader
          userId={userId}
          userData={userData ?? null}
          isLoading={isLoading}
        />
      )}
      {children}
    </div>
  );
}
