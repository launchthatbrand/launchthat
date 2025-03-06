"use server";

import { createClerkClient, currentUser } from "@clerk/nextjs/server";

import { env } from "../env";

interface CreateOrUpdateUserParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
  privateMetadata?: Record<string, unknown>;
}

const clerk = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function createOrUpdateClerkUser({
  email,
  password,
  firstName,
  lastName,
  externalId,
  privateMetadata = {},
}: CreateOrUpdateUserParams) {
  // First try to find existing user
  const users = await clerk.users.getUserList({
    emailAddress: [email],
  });

  const existingUser = users.data[0];

  if (existingUser) {
    // Update existing user with new metadata
    return await clerk.users.updateUser(existingUser.id, {
      privateMetadata: {
        ...existingUser.privateMetadata,
        ...privateMetadata,
      },
    });
  }

  // Create new user if none exists
  return await clerk.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    externalId,
    privateMetadata,
  });
}

// WordPress specific helper
export async function createOrUpdateWordPressUser({
  email,
  password,
  name,
  id,
  authToken,
}: {
  email: string;
  password: string;
  name: string;
  id: string;
  authToken: string;
}) {
  const names = name.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1).join(" ") || undefined;

  return createOrUpdateClerkUser({
    email,
    password,
    firstName,
    lastName,
    externalId: id,
    privateMetadata: {
      wpAuthToken: authToken,
    },
  });
}

// Helper to get WordPress auth token for current user
export async function getWordPressAuthToken() {
  const user = await getCurrentUser();
  const token = user.privateMetadata.wpAuthToken;
  if (!token) throw new Error("WordPress auth token not found");
  return token as string;
}
