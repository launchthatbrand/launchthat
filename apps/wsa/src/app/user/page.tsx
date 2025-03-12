"use client";

import { User, useUsers } from "./hooks/useUsers";

import { Card } from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";
import { UserCard } from "./_components/UserCard";
import { UserSearch } from "./_components/UserSearch";

export default function UsersPage() {
  // Cast the hook result to handle typing issues
  const result = useUsers();
  const users = (result.users || []) as User[];
  const isLoadingUsers = result.isLoadingUsers;
  const usersError = result.usersError;

  console.log("usersData", users);

  if (isLoadingUsers) {
    return (
      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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

  if (usersError) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Error loading users
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Community Members</h1>
        <UserSearch users={users} className="max-w-2xl" />
      </div>
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
