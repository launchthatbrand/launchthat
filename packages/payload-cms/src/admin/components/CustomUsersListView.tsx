"use client";

import { Button, Gutter } from "@payloadcms/ui";

import { DefaultTemplate } from "@payloadcms/next/templates";
import Link from "next/link";
import React from "react";

/**
 * This is a simple example of what a custom view component looks like.
 * In real applications, you would typically create this component in your app,
 * not in the shared payload-cms package.
 *
 * @deprecated Use PayloadAdminLayout from ./PayloadAdminLayout instead
 */
export function CustomUsersListView(props: any) {
  const { initPageResult, params, searchParams } = props;

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale as any} // Type cast to avoid type issues
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Example Custom View</h1>
          <Link href="/admin/collections/users/create">
            <Button buttonStyle="primary">Create New</Button>
          </Link>
        </div>

        <div className="mt-4 rounded border p-4">
          <p>
            This is an example of a custom view component. In a real
            application, you would create this component in your app and use the
            PayloadAdminLayout component to provide the standard layout.
          </p>
          <p className="mt-2">
            See the PayloadAdminLayout component for a reusable layout that you
            can use in your app's custom views.
          </p>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}
