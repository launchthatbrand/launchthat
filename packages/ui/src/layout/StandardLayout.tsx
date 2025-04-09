"use client";

import type { Metadata, Viewport } from "next";
import {
  Sidebar,
  SidebarInset,
  SidebarRail,
} from "@acme/ui/components/sidebar";

import AppHeader from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { cn } from "../lib/utils";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function StandardLayout(props: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  appName: string;
  topbar?: React.ReactNode;
  className?: string;
  header?: boolean;
}) {
  const sidebarToggle = props.sidebar !== undefined;
  return (
    <div className={cn("flex flex-1", props.className)}>
      {props.sidebar !== undefined ? (
        <AppSidebar sidebar={props.sidebar} className="list-none" />
      ) : null}
      <SidebarInset className="flex max-h-[calc(100vh-20px)] flex-1 flex-col overflow-auto overflow-y-scroll">
        {props.topbar !== undefined ? props.topbar : null}
        {props.header !== false && (
          <AppHeader
            appName={props.appName}
            sidebarToggle={sidebarToggle}
            className="sticky top-0 p-2"
          />
        )}
        <div className="flex flex-1 flex-col items-center justify-center">
          {props.children}
        </div>
      </SidebarInset>
    </div>
  );
}
