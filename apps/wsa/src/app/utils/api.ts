"use server";

import { currentUser } from "@clerk/nextjs/server";
import { env } from "../../env";

// const clerkClient = createClerkClient({
//   secretKey: env.CLERK_SECRET_KEY,
// });

interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

export async function fetchWordPress<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  const user = await currentUser();
  const wpAuthToken = user?.privateMetadata.wpAuthToken as string | undefined;
  console.log(wpAuthToken);

  const response = await fetch(env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(wpAuthToken && { Authorization: `Bearer ${wpAuthToken}` }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error(result.errors[0]?.message ?? "GraphQL Error");
  }

  return result.data;
}
