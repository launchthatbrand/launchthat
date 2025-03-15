"use client";

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

  // Also defined in the client component
  const renderCreatedCell = ({ row }: any) =>
    row.original.createdAt ? formatDate(row.original.createdAt) : "";

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
        initialViewMode="grid"
        showViewToggle={true}
        gridCols={{ default: 1, sm: 2, lg: 3 }}
        tableColumns={[
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "createdAt",
            header: "Created",
            cell: renderCreatedCell,
          },
        ]}
      />

      <div className="mt-4 text-sm text-gray-500">
        Showing {items.length} of {totalDocs || items.length} items
      </div>
    </div>
  );
}
