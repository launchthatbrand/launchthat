"use client";

import { CardLoop } from "@acme/ui/general/CardLoop";

// Create mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-05-15T08:30:00.000Z",
    updatedAt: "2023-05-15T08:30:00.000Z",
    _isLocked: false,
    _userEditing: null,
    loginAttempts: 0,
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    createdAt: "2023-06-22T14:45:00.000Z",
    updatedAt: "2023-07-10T09:15:00.000Z",
    _isLocked: false,
    _userEditing: null,
    loginAttempts: 0,
    role: "Editor",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    createdAt: "2023-04-10T11:20:00.000Z",
    updatedAt: "2023-09-05T16:30:00.000Z",
    _isLocked: false,
    _userEditing: null,
    loginAttempts: 0,
    role: "Writer",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "s.williams@example.com",
    createdAt: "2023-08-18T13:10:00.000Z",
    updatedAt: "2023-08-18T13:10:00.000Z",
    _isLocked: false,
    _userEditing: null,
    loginAttempts: 0,
    role: "Guest",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.brown@example.com",
    createdAt: "2023-07-30T10:05:00.000Z",
    updatedAt: "2023-10-12T15:25:00.000Z",
    _isLocked: true,
    _userEditing: null,
    loginAttempts: 2,
    role: "Admin",
  },
];

// Simple date formatter function
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ClientTest() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">User Management Demo</h1>

      <CardLoop
        items={mockUsers}
        renderItem={(user) => (
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-medium text-gray-700">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-1 flex space-x-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {user.role}
                  </span>
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
              <button className="text-sm font-medium text-blue-500 hover:text-blue-700">
                View Profile
              </button>
            </div>
          </div>
        )}
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
            accessorKey: "role",
            header: "Role",
          },
          {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => formatDate(row.original.createdAt),
          },
        ]}
      />
    </div>
  );
}
