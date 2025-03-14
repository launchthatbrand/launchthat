"use client";

import type { Metadata, Viewport } from "next";
import {
  Sidebar,
  SidebarInset,
  SidebarRail,
} from "@acme/ui/components/sidebar";

import AppHeader from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

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
}) {
  console.log(props.sidebar);
  const sidebarToggle = props.sidebar !== undefined;
  return (
    <div className="flex flex-1">
      {props.sidebar !== undefined ? (
        <AppSidebar sidebar={props.sidebar} className="list-none" />
      ) : null}
      <SidebarInset className="flex max-h-[calc(100vh-20px)] flex-1 flex-col overflow-auto overflow-y-scroll">
        {props.topbar !== undefined ? props.topbar : null}
        <AppHeader
          appName={props.appName}
          sidebarToggle={sidebarToggle}
          className="sticky top-0 p-2"
        />
        <div className="TEST flex flex-1 flex-col items-stretch justify-center">
          {props.children}
        </div>
      </SidebarInset>
    </div>
  );
}
