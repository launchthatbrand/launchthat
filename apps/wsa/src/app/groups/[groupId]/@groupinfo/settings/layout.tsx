"use client";

import { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("general");

  // Extract the current settings tab from the pathname
  useEffect(() => {
    const pathSegments = pathname.split("/");
    const settingsIndex = pathSegments.findIndex(
      (segment) => segment === "settings",
    );
    if (settingsIndex !== -1 && pathSegments[settingsIndex + 1]) {
      setActiveTab(pathSegments[settingsIndex + 1]);
    } else {
      // If no specific tab is in the URL, default to general
      const basePathSegments = pathname.split("/").slice(0, settingsIndex + 1);
      const basePath = basePathSegments.join("/");
      router.push(`${basePath}/general`);
    }
  }, [pathname, router]);

  const handleTabChange = (value: string) => {
    // Get the base path up to settings
    const pathSegments = pathname.split("/");
    const settingsIndex = pathSegments.findIndex(
      (segment) => segment === "settings",
    );
    const basePathSegments = pathname.split("/").slice(0, settingsIndex + 1);
    const basePath = basePathSegments.join("/");
    router.push(`${basePath}/${value}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Group Settings</h2>
        <p className="text-muted-foreground">Manage your group preferences</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex items-start gap-10"
        orientation="vertical"
      >
        <TabsList className="flex h-auto w-[200px] flex-col items-start bg-muted/50">
          <TabsTrigger value="general" className="w-full justify-start">
            General
          </TabsTrigger>
          <TabsTrigger value="members" className="w-full justify-start">
            Members
          </TabsTrigger>
          <TabsTrigger value="coverphoto" className="w-full justify-start">
            Cover Photo
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">{children}</div>
      </Tabs>
    </div>
  );
}
