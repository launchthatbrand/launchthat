"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  Download,
  LayoutDashboard,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@acme/ui/components/collapsible";
import { ScrollArea } from "@acme/ui/components/scroll-area";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@acme/ui/components/sidebar";
import { cn } from "@acme/ui/lib/utils";

import { GET_COURSES } from "~/app/course/queries";

interface Course {
  id: string;
  title: string;
}

export default function WordPressSidebar() {
  const pathname = usePathname();

  // Fetch courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_WSA_WORDPRESS_API_URL2!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: GET_COURSES,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.data.courses;
    },
  });

  const courses = coursesData?.nodes ?? [];

  return (
    <div className="flex h-full flex-col">
      <SidebarGroup>
        <SidebarGroupLabel>WordPress</SidebarGroupLabel>
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname === "/wordpress" && "bg-accent text-accent-foreground",
              )}
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Courses Dropdown */}
          <SidebarMenuItem>
            <Collapsible defaultOpen className="w-full">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ScrollArea className="h-[300px]">
                  <div className="pl-6 pt-2">
                    {isLoading ? (
                      // Loading state
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-8 w-full animate-pulse rounded-md bg-muted"
                          />
                        ))}
                      </div>
                    ) : (
                      // Courses list
                      courses.map((course: Course) => (
                        <SidebarMenuButton
                          key={course.id}
                          asChild
                          className={cn(
                            "h-8 text-sm",
                            pathname === `/wordpress/course/${course.id}` &&
                              "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href={`/wordpress/course/${course.id}`}>
                            <span>{course.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Downloads */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname === "/wordpress/downloads" &&
                  "bg-accent text-accent-foreground",
              )}
            >
              <Link href="/wordpress/downloads">
                <Download className="h-4 w-4" />
                <span>Downloads</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
