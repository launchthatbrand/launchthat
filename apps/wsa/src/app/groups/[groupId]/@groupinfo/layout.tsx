"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Get current tab from pathname by looking at the first segment after groupId
  const pathSegments = pathname.split("/");
  const groupIdIndex = pathSegments.findIndex((segment) =>
    segment.includes("YnBHcm91cDo"),
  );
  const currentTab = pathSegments[groupIdIndex + 1] || "dashboard";

  const handleTabChange = (value: string) => {
    // Get the base path up to groupId
    const basePathSegments = pathname.split("/").slice(0, groupIdIndex + 1);
    const basePath = basePathSegments.join("/");

    // For settings, maintain the sub-route if it exists
    if (value === "settings") {
      router.push(`${basePath}/settings/general`);
    } else {
      router.push(`${basePath}/${value}`);
    }
  };

  return (
    <div className="container py-8">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {children}
      </Tabs>
    </div>
  );
}
