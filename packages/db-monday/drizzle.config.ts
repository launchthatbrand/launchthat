import type { Config } from "drizzle-kit";

if (!process.env.MONDAY_POSTGRES_URL) {
  throw new Error("Missing MONDAY_POSTGRES_URL");
}

const nonPoolingUrl = process.env.MONDAY_POSTGRES_URL.replace(":6543", ":5432");

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
} satisfies Config;
