import React from "react";

import { Sidebar, SidebarRail } from "@acme/ui/components/sidebar";

export function AppSidebar({
  sidebar,
  ...props
}: React.ComponentProps<typeof Sidebar> & { sidebar: React.ReactNode }) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset" className="bg-white">
      {sidebar}
      <SidebarRail />
    </Sidebar>
  );
}
