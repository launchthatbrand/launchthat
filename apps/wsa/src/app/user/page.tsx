"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";

import { fetchWordPress } from "../utils/api";
import { UserCard } from "./_components/UserCard";
import { GET_USERS } from "./queries";

interface User {
  id: string;
  name: string;
  slug: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: {
      name: string;
    }[];
  };
  description?: string;
  posts?: {
    nodes: {
      id: string;
      title: string;
      date: string;
      status: string;
    }[];
    pageInfo: {
      total: number;
    };
  };
  courses?: {
    nodes: {
      id: string;
      title: string;
      status: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

export default function UsersPage() {
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["usersss"],
    queryFn: () => fetchWordPress(GET_USERS),
  });

  console.log("usersData", usersData);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Error loading users
        </div>
      </div>
    );
  }

  const users = usersData?.users?.nodes ?? [];

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Community Members</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user: User) => (
          <UserCard key={user.id} user={user} />
        ))}
        {users.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
