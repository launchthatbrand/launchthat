"use client";

import { CardLoop } from "@acme/ui/general/CardLoop";

// Define the shape of the user data
type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _isLocked: boolean;
  _userEditing: null | string;
  loginAttempts: number;
};

// Props for our client component - only serializable data, no functions
type ClientUserTableProps = {
  userData: {
    docs: any[];
    totalDocs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    totalPages: number;
  };
};

// Simple date formatter function
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ClientUserTable({ userData }: ClientUserTableProps) {
  // Get the users from the serialized data
  const users = userData.docs;

  // Render user card - this function is defined inside the client component
  const renderUserCard = (user: any) => (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-medium text-gray-700">
          {user.name?.charAt(0) || "?"}
        </div>
        <div>
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-1 flex space-x-2">
            {user._isLocked && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                Locked
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500">
        Created: {formatDate(user.createdAt)}
      </div>
      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <a
          href={`/admin/collections/users/${user.id}`}
          className="text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          View Profile
        </a>
      </div>
    </div>
  );

  // Define cell renderer function inside the client component
  const renderCreatedCell = ({
    row,
  }: {
    row: { original: { createdAt: string } };
  }) => {
    return formatDate(row.original.createdAt);
  };

  return (
    <div className="mt-8 p-4">
      <h2 className="mb-6 text-2xl font-bold">User Management</h2>
      <CardLoop
        items={users}
        renderItem={renderUserCard}
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
        Showing {users.length} of {userData.totalDocs} users
      </div>
    </div>
  );
}
