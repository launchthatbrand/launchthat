"use server";

import { signIn } from "@acme/auth-wsa";
import { createOrUpdateWordPressUser } from "@acme/auth-wsa/actions";

import type { WordPressLoginResponse } from "./queries";
import { env } from "~/env";
import { LOGIN_MUTATION } from "./queries";

export async function signInWithDiscord() {
  await signIn("discord");
}

export async function loginWithWordPress(data: {
  email: string;
  password: string;
}): Promise<{ email: string; password: string }> {
  const { email: username, password } = data;

  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  if (!env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    throw new Error("WordPress API URL not configured");
  }

  // First, authenticate with WordPress
  const response = await fetch(env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: {
        username,
        password,
      },
    }),
  });

  const wpResult = (await response.json()) as WordPressLoginResponse;

  if (wpResult.errors) {
    throw new Error(wpResult.errors[0]?.message ?? "Login failed");
  }

  const { user } = wpResult.data.login;
  const authToken = wpResult.data.login.authToken;

  // Create or update user in Clerk with WordPress auth token
  try {
    await createOrUpdateWordPressUser({
      email: user.email,
      name: user.name,
      id: user.id,
      password,
      authToken,
    });

    // Return the user information needed for frontend login
    return {
      email: user.email,
      password,
    };
  } catch (error) {
    console.error("Clerk error:", error);
    throw new Error("Error managing user account");
  }
}
