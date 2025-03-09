"use client";

import { UserHeader } from "./_components/UserHeader";
import { fetchWordPress } from "../utils/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const userId = params.userId as string | undefined;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) return null;
      return fetchWordPress(USER_QUERY, { id: userId });
    },
    enabled: Boolean(userId),
  });

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gradient-to-br from-theme-background via-theme-background-secondary to-theme-background">
      {userId && (
        <UserHeader userId={userId} userData={userData} isLoading={isLoading} />
      )}
      {children}
    </div>
  );
}
