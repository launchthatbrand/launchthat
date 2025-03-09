"use client";

import { GET_USER, GET_USERS } from "../queries";

import { fetchWordPress } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";

interface Role {
  name: string;
}

interface Post {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  status: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface User {
  id: string;
  name: string;
  slug: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: Role[];
  };
  description?: string;
  posts?: {
    nodes: Post[];
    pageInfo: {
      total: number;
    };
  };
  courses?: {
    nodes: Course[];
  };
}

export function useUsers() {
  // Fetch all users
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchWordPress(GET_USERS),
  });

  // Process users data
  const users = usersData?.users?.nodes ?? [];

  // Function to fetch a single user
  const useUser = (userId: string | null) => {
    const {
      data: userData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["user", userId],
      queryFn: () =>
        fetchWordPress(GET_USER, {
          id: userId ? decodeURIComponent(userId) : "",
        }),
      enabled: !!userId,
    });

    return {
      user: userData?.user,
      isLoading,
      error,
    };
  };

  return {
    // Users list
    users,
    isLoadingUsers,
    usersError,

    // Single user helper
    useUser,
  };
}
