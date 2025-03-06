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
}) {
  return (
    <div className="flex flex-1">
      <AppSidebar sidebar={props.sidebar} />
      <SidebarInset className="overflow-hidden">
        <main className="flex max-h-[calc(100vh-20px)] flex-1 flex-col overflow-auto">
          <AppHeader appName={props.appName} className="sticky top-0" />
          <div className="TEST flex flex-1 flex-col items-center justify-center">
            {props.children}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
