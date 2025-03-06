import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

import { env } from "~/env";

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});
const WORDPRESS_API = env.NEXT_PUBLIC_WORDPRESS_API_URL;

const LOGIN_MUTATION = `
  mutation LoginUser($username: String!, $password: String!) {
    login(input: {
      clientMutationId: "uniqueId",
      username: $username,
      password: $password
    }) {
      authToken
      user {
        id
        name
        email
      }
    }
  }
`;

interface LoginResponse {
  data: {
    login: {
      authToken: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
  errors?: { message: string }[];
}

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as LoginRequest;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    if (!WORDPRESS_API) {
      return NextResponse.json(
        { message: "WordPress API URL not configured" },
        { status: 500 },
      );
    }

    // First, authenticate with WordPress
    const response = await fetch(WORDPRESS_API, {
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
    console.log("Response:", response);

    const data = (await response.json()) as LoginResponse;

    if (data.errors) {
      return NextResponse.json(
        { message: data.errors[0]?.message ?? "Login failed" },
        { status: 401 },
      );
    }

    const { authToken, user } = data.data.login;

    // Check if user exists in Clerk
    let clerkUser;
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [user.email],
      });
      clerkUser = users.data[0];

      // If user doesn't exist in Clerk, create them
      if (!clerkUser) {
        clerkUser = await clerkClient.users.createUser({
          emailAddress: [user.email],
          password: password,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ").slice(1).join(" ") || undefined,
          externalId: user.id,
        });
      }

      // Return the user information needed for frontend login
      return NextResponse.json({
        email: user.email,
        password: password,
        wordpressToken: authToken,
      });
    } catch (error) {
      console.error("Clerk error:", error);
      return NextResponse.json(
        { message: "Error managing user account" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
