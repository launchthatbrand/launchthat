"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Download,
  LayoutDashboard,
  TerminalSquare,
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
import { NavMain } from "@acme/ui/general/nav-main";
import { cn } from "@acme/ui/lib/utils";

import { useLearndash } from "~/app/hooks/useLearndash";

interface Course {
  id: string;
  title: string;
  status?: string;
}

export default function WordPressSidebar() {
  const pathname = usePathname();
  const { courses, isLoadingCourses } = useLearndash();

  const navItems = [
    {
      title: "Dashboard",
      url: `/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "All Courses",
      url: `/courses`,
      icon: TerminalSquare,
      items: courses.map((course: Course) => ({
        title: course.title,
        url: `/course/${course.id}`,
      })),
    },
  ];

  return (
    <div className="px-2 py-2">
      <NavMain items={navItems} />
    </div>
  );
}
