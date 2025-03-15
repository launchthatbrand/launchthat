"use client";

import { CardLoop } from "@acme/ui/general/CardLoop";

// Type for the props our client component accepts
type ClientCardListProps = {
  items: any[];
  collectionSlug?: string;
};

// Simple date formatter function
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function ClientCardList({ items, collectionSlug }: ClientCardListProps) {
  // This is a client component so we can define functions here
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

  // Define cell renderer function inside the client component
  const renderCreatedCell = ({ row }: any) =>
    row.original.createdAt ? formatDate(row.original.createdAt) : "";

  return (
    <div className="mt-4">
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
    </div>
  );
}
