"use client";

import { CardLoop } from "@acme/ui/general/CardLoop";
import { DefaultListView } from "@payloadcms/ui";
import type { ListViewServerProps } from "payload";

/**
 * A reusable layout component for PayloadCMS admin views
 * This allows us to define view components in the app while reusing the layout
 */
export function PayloadAdminLayout(props: ListViewServerProps) {
  const { data } = props;

  console.log("table", props.Table);

  return (
    <div>
      <h1>Payload Admin Layout</h1>
      <CardLoop items={[]} />
    </div>
  );
}
