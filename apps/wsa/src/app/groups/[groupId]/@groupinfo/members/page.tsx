"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@acme/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Skeleton } from "@acme/ui/components/skeleton";
import { cn } from "@acme/ui/lib/utils";

import { fetchWordPress } from "~/app/utils/api";
import { GET_GROUP } from "../../../queries";

interface GroupMember {
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

// Mock data for group members
const mockMembers: GroupMember[] = [
  {
    id: "1",
    name: "John Doe",
    slug: "john-doe",
    avatar: {
      url: "/avatars/default.jpg",
    },
    roles: {
      nodes: [{ name: "Group Admin" }],
    },
    description:
      "Professional forex trader with 5+ years of experience in technical analysis.",
    posts: {
      nodes: [
        {
          id: "1",
          title: "Market Analysis",
          date: "2024-03-20",
          status: "publish",
        },
      ],
      pageInfo: {
        total: 15,
      },
    },
    courses: {
      nodes: [
        {
          id: "1",
          title: "Forex Fundamentals",
          status: "publish",
        },
      ],
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    slug: "jane-smith",
    avatar: {
      url: "/avatars/default.jpg",
    },
    roles: {
      nodes: [{ name: "Group Moderator" }],
    },
    description:
      "Crypto enthusiast and technical analyst. Sharing insights on market trends.",
    posts: {
      nodes: [
        {
          id: "2",
          title: "Crypto Analysis",
          date: "2024-03-19",
          status: "publish",
        },
      ],
      pageInfo: {
        total: 8,
      },
    },
    courses: {
      nodes: [
        {
          id: "2",
          title: "Crypto Trading",
          status: "publish",
        },
      ],
    },
  },
];

function MemberCard({ member }: { member: GroupMember }) {
  return (
    <Link href={`/wordpress/user/${member.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:border-primary",
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={member.avatar?.url ?? "/avatars/default.jpg"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {member.roles?.nodes[0]?.name ?? "Member"}
              </p>
            </div>
          </div>

          {member.description && (
            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
              {member.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {member.posts?.pageInfo.total ? (
              <Badge variant="secondary">
                {member.posts.pageInfo.total} Posts
              </Badge>
            ) : null}
            {member.courses?.nodes.length ? (
              <Badge variant="secondary">
                {member.courses.nodes.length} Courses
              </Badge>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function GroupMembers() {
  const params = useParams();
  const groupId = params.groupId as string;

  const { data: groupData, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchWordPress(GET_GROUP, { id: groupId }),
  });

  if (isLoading) {
    return (
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
    );
  }

  // For now, use mock data
  const members = mockMembers;

  return (
    <div>
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold">Group Members</h2>
        <p className="text-muted-foreground">
          Connect with fellow traders in this group
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
        {members.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No members found
          </div>
        )}
      </div>
    </div>
  );
}
