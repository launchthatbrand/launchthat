"use client";

import { useMemo } from "react";

import { CardLoop } from "@acme/ui/general/CardLoop";

// Define a type that only includes serializable data
type PayloadAdminLayoutProps = {
  // Only include serializable fields from the original props
  items: any[];
  collectionSlug?: string;
  collectionLabel?: string;
  totalDocs?: number;
  canCreate?: boolean;
};

// Simple date formatter function
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Client component that only receives serializable data
export default function PayloadAdminLayout({
  items,
  collectionSlug,
  collectionLabel,
  totalDocs,
  canCreate,
}: PayloadAdminLayoutProps) {
  // This function is defined in the client component, not passed from server
  console.log("items", items);

  // Generate dynamic table columns based on the data
  const dynamicTableColumns = useMemo(() => {
    // If no items, return empty array
    if (!items || !items.length) return [];

    // Get the first item to analyze its fields
    const sampleItem = items[0];
    const columns = [];

    // Common field detection and prioritization
    // Always add id field if it exists
    if ("id" in sampleItem) {
      columns.push({
        accessorKey: "id",
        header: "ID",
      });
    }

    // Priority fields - add these first if they exist
    const priorityFields = ["name", "title", "email", "slug"];
    priorityFields.forEach((field) => {
      if (field in sampleItem) {
        columns.push({
          accessorKey: field,
          header: field.charAt(0).toUpperCase() + field.slice(1),
        });
      }
    });

    // Date fields with special formatting
    const dateFields = ["createdAt", "updatedAt", "publishedAt", "date"];
    dateFields.forEach((field) => {
      if (field in sampleItem) {
        columns.push({
          accessorKey: field,
          header:
            field === "createdAt"
              ? "Created"
              : field === "updatedAt"
                ? "Updated"
                : field === "publishedAt"
                  ? "Published"
                  : "Date",
          cell: ({ row }: any) =>
            row.original[field] ? formatDate(row.original[field]) : "",
        });
      }
    });

    // Status fields
    if ("status" in sampleItem) {
      columns.push({
        accessorKey: "status",
        header: "Status",
      });
    }

    // Add any boolean fields that might be important
    if ("_isLocked" in sampleItem) {
      columns.push({
        accessorKey: "_isLocked",
        header: "Locked",
        cell: ({ row }: any) => (row.original._isLocked ? "Yes" : "No"),
      });
    }

    // If we didn't find any fields, add generic ones
    if (columns.length === 0) {
      // Get the first 3-4 fields from the object
      const keys = Object.keys(sampleItem).slice(0, 4);
      keys.forEach((key) => {
        // Skip complex objects and functions
        const value = sampleItem[key];
        if (typeof value !== "object" && typeof value !== "function") {
          columns.push({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1),
          });
        }
      });
    }

    return columns;
  }, [items]);

  const renderItem = (item: any) => (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-medium">
          {item.name?.charAt(0) || item.title?.charAt(0) || "?"}
        </div>
        <div>
          <h3 className="text-lg font-medium">
            {item.name || item.title || "Untitled"}
          </h3>
          {item.email && <p className="text-gray-500">{item.email}</p>}
          <div className="mt-1 text-sm text-gray-400">
            {item.createdAt && `Created: ${formatDate(item.createdAt)}`}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <a
          href={`/admin/collections/${collectionSlug}/${item.id}`}
          className="text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          View Details
        </a>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">{collectionLabel || "Items"}</h1>

      {canCreate && (
        <div className="mb-4">
          <a
            href={`/admin/collections/${collectionSlug}/create`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create New
          </a>
        </div>
      )}

      <CardLoop
        items={items}
        renderItem={renderItem}
        showFilter={true}
        enableHoverEffects={false}
        initialViewMode="table"
        showViewToggle={true}
        gridCols={{ default: 1, sm: 2, lg: 3 }}
        tableColumns={dynamicTableColumns}
      />

      <div className="mt-4 text-sm text-gray-500">
        Showing {items.length} of {totalDocs || items.length} items
      </div>
    </div>
  );
}
