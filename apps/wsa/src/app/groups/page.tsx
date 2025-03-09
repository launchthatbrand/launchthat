"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";

import { fetchWordPress } from "../utils/api";
import { GroupCard } from "./_components/GroupCard";
import { GET_GROUPS } from "./queries";

interface BuddyPressGroup {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: string;
  dateCreated: string;
  metaData: Array<{
    key: string;
    value: string;
  }>;
}

interface GroupsResponse {
  bpGroups: {
    nodes: BuddyPressGroup[];
  };
}

export default function GroupsPage() {
  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery<GroupsResponse>({
    queryKey: ["groups"],
    queryFn: async () => {
      const result = await fetchWordPress(GET_GROUPS);
      console.log(result);
      return result as GroupsResponse;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
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
          Error loading groups
        </div>
      </div>
    );
  }

  const groups = groupsData?.bpGroups.nodes ?? [];

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Trading Groups</h1>
        <p className="text-muted-foreground">
          Join trading communities to learn, share insights, and grow together
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
        {groups.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No groups found
          </div>
        )}
      </div>
    </div>
  );
}
