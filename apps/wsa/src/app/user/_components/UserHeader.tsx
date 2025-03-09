"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";

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

interface UserHeaderProps {
  userId: string;
  userData: UserResponse | null;
  isLoading: boolean;
}

export function UserHeader({ userId, userData, isLoading }: UserHeaderProps) {
  if (isLoading) {
    return (
      <div className="relative flex h-80 flex-col justify-end bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20">
        <div className="bg-background">
          <div className="container relative">
            <div className="flex h-32 flex-col items-center justify-between gap-6 bg-background md:flex-row">
              <div className="-mt-24 h-40 w-40 animate-pulse rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-8 w-48 animate-pulse rounded" />
                <div className="mt-1 flex items-center gap-4">
                  <div className="h-4 w-32 animate-pulse rounded" />
                  <div className="h-4 w-48 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return null;
  }

  const user = {
    ...userData.user,
    avatar:
      userData.user.avatar?.url ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.name}`,
    location: "Miami Florida, USA", // Mock data
    tradingExperience: "5+ Years Trading Experience", // Mock data
  };

  return (
    <div className="relative flex h-80 flex-col justify-end bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20">
      <div className="bg-background">
        <div className="container relative">
          <div className="flex h-32 flex-col items-center justify-between gap-6 bg-background md:flex-row">
            <Avatar className="-mt-24 h-40 w-40 border-4 border-purple-500/20 shadow-xl">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500">
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                <span>📍 {user.location}</span>
                <span>⌛ {user.tradingExperience}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
