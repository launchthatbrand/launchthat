import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

// Default Users collection configuration
export const UsersBase: CollectionConfig = {
  slug: "users",
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "name",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
  timestamps: true,
};

// Interface for custom component paths
export interface UserComponentPaths {
  list?: string;
  edit?: string;
}

// Factory function to create a users collection with custom components
export function createUsersCollection(
  componentPaths?: UserComponentPaths,
): CollectionConfig {
  const users = JSON.parse(JSON.stringify(UsersBase)) as CollectionConfig;

  // Only add custom components if provided
  if (componentPaths) {
    if (!users.admin) users.admin = {};
    if (!users.admin.components) users.admin.components = {};

    users.admin.components = {
      ...users.admin.components,
      views: {
        ...(users.admin.components as any)?.views,
        ...(componentPaths.list
          ? {
              list: {
                Component: componentPaths.list,
              },
            }
          : {}),
        ...(componentPaths.edit
          ? {
              edit: {
                default: {
                  Component: componentPaths.edit,
                },
              },
            }
          : {}),
      },
    };
  }

  return users;
}

// Export the default Users collection for backward compatibility
export const Users = UsersBase;
