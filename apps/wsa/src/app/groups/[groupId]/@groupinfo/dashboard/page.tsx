"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Activity, Calendar, MessageCircle, Users } from "lucide-react";

import { Badge } from "@acme/ui/components/badge";
import { Progress } from "@acme/ui/components/progress";
import { GeneralCard, GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";

import { fetchWordPress } from "~/app/utils/api";
import { GET_GROUP } from "../../../queries";

interface BuddyPressGroup {
  id: string;
  name: string;
  metaData: {
    key: string;
    value: string;
  }[];
}

interface GroupResponse {
  node: BuddyPressGroup;
}

// Mock data for group activity
const recentActivity = [
  {
    id: 1,
    type: "member_joined",
    user: "John Doe",
    timestamp: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    type: "discussion_started",
    user: "Jane Smith",
    title: "Market Analysis for Q1 2024",
    timestamp: "2024-03-19T15:30:00Z",
  },
  {
    id: 3,
    type: "event_scheduled",
    title: "Weekly Trading Review",
    timestamp: "2024-03-21T14:00:00Z",
  },
];

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Weekly Trading Review",
    date: "2024-03-21T14:00:00Z",
    attendees: 12,
  },
  {
    id: 2,
    title: "Market Analysis Workshop",
    date: "2024-03-23T16:00:00Z",
    attendees: 8,
  },
];

// Mock data for recent discussions
const recentDiscussions = [
  {
    id: 1,
    title: "Market Analysis for Q1 2024",
    author: "Jane Smith",
    replies: 15,
    lastActive: "2024-03-19T15:30:00Z",
  },
  {
    id: 2,
    title: "Trading Strategy Discussion",
    author: "Mike Johnson",
    replies: 8,
    lastActive: "2024-03-18T12:45:00Z",
  },
];

export default function GroupDashboard() {
  const params = useParams();
  const groupId = params.groupId as string;

  const { data: groupData, isLoading } = useQuery<GroupResponse>({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const result = await fetchWordPress(GET_GROUP, { id: groupId });
      return result as GroupResponse;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GeneralCardSkeleton
            key={i}
            layout="stacked"
            hasTitle={true}
            hasContent={true}
          />
        ))}
      </div>
    );
  }

  const group = groupData?.node;
  const memberCount =
    group?.metaData.find((m) => m.key === "total_member_count")?.value ?? "0";

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Group Stats */}
      <GeneralCard
        layout="stacked"
        title={
          <div className="border-b bg-[#2b0e4d] px-6 pb-8 pt-6 text-white">
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ GROUP STATS ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Community Overview</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Track group engagement
            </p>
            <Progress value={75} className="mt-4 h-2 [&>div]:bg-[#FC653C]" />
          </div>
        }
        content={
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
              <div className="space-y-1">
                <p className="font-medium text-[#2b0e4d]">Total Members</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#FC653C]" />
                  <span className="text-sm text-slate-500">
                    {memberCount} members
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{memberCount} Active</Badge>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
              <div className="space-y-1">
                <p className="font-medium text-[#2b0e4d]">Discussions</p>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#FC653C]" />
                  <span className="text-sm text-slate-500">
                    {recentDiscussions.length} topics
                  </span>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
              <div className="space-y-1">
                <p className="font-medium text-[#2b0e4d]">Upcoming Events</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#FC653C]" />
                  <span className="text-sm text-slate-500">
                    {upcomingEvents.length} scheduled
                  </span>
                </div>
              </div>
              <Badge variant="secondary">This Week</Badge>
            </div>
          </div>
        }
      />

      {/* Recent Activity */}
      <GeneralCard
        layout="stacked"
        title={
          <div className="border-b bg-[#2b0e4d] px-6 pb-8 pt-6 text-white">
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ LATEST UPDATES ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Group Activity</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Recent community engagement
            </p>
          </div>
        }
        content={
          <div className="grid gap-4 p-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="group relative space-y-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-[#FC653C]/20 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-[#FC653C]" />
                  <div className="flex-1">
                    {activity.type === "member_joined" && (
                      <p className="font-medium text-[#2b0e4d]">
                        New Member: {activity.user}
                      </p>
                    )}
                    {activity.type === "discussion_started" && (
                      <p className="font-medium text-[#2b0e4d]">
                        New Discussion: {activity.title}
                      </p>
                    )}
                    {activity.type === "event_scheduled" && (
                      <p className="font-medium text-[#2b0e4d]">
                        New Event: {activity.title}
                      </p>
                    )}
                  </div>
                </div>
                <time className="text-xs text-slate-400">
                  {new Date(activity.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
          </div>
        }
      />

      {/* Upcoming Events */}
      <GeneralCard
        layout="stacked"
        title={
          <div className="border-b bg-[#2b0e4d] px-6 pb-8 pt-6 text-white">
            <p className="text-xs font-medium text-[#FC653C]">▬ EVENTS ▬</p>
            <h3 className="mt-2 text-xl font-bold">Upcoming Events</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Join group activities
            </p>
          </div>
        }
        content={
          <div className="grid gap-4 p-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group relative space-y-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-[#FC653C]/20 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#FC653C]" />
                  <div className="flex-1">
                    <p className="font-medium text-[#2b0e4d]">{event.title}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                      <span>{event.attendees} attending</span>
                      <time>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/* Recent Discussions */}
      <GeneralCard
        layout="stacked"
        className="col-span-full"
        title={
          <div className="border-b bg-[#2b0e4d] px-6 pb-8 pt-6 text-white">
            <p className="text-xs font-medium text-[#FC653C]">
              ▬ DISCUSSIONS ▬
            </p>
            <h3 className="mt-2 text-xl font-bold">Recent Topics</h3>
            <p className="mt-1 text-sm font-normal text-gray-300">
              Join the conversation
            </p>
          </div>
        }
        content={
          <div className="grid gap-4 p-4">
            {recentDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="group relative space-y-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-[#FC653C]/20 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#2b0e4d]">
                      {discussion.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      Started by {discussion.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {discussion.replies} replies
                    </Badge>
                    <p className="mt-1 text-xs text-slate-400">
                      Last active{" "}
                      {new Date(discussion.lastActive).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
