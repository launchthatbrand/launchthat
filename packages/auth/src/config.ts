import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Discord from "next-auth/providers/discord";

import { db } from "@acme/db/client";
import { Account, Session, User } from "@acme/db/schema";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
});

// Use a function to determine secure context to avoid direct env access
export const getIsSecureContext = () => {
  try {
    // Only access env in a try-catch to avoid client-side errors
    return env.NODE_ENV !== "development";
  } catch {
    // Default to secure on client-side
    return true;
  }
};

// Factory function to create auth config, only called server-side
export const createAuthConfig = (): NextAuthConfig => {
  const isSecure = getIsSecureContext();

  return {
    adapter,
    // In development, we need to skip checks to allow Expo to work
    ...(!isSecure
      ? {
          skipCSRFCheck: skipCSRFCheck,
          trustHost: true,
        }
      : {}),
    secret: env.AUTH_SECRET,
    providers: [Discord],
    callbacks: {
      session: (opts) => {
        if (!("user" in opts))
          throw new Error("unreachable with session strategy");

        return {
          ...opts.session,
          user: {
            ...opts.session.user,
            id: opts.user.id,
          },
        };
      },
    },
  };
};

// Base config without environment variables for client-side
export const authConfig: NextAuthConfig = {
  callbacks: {
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
  providers: [Discord],
};

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
