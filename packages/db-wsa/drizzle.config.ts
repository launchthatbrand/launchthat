import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL_WSA) {
  throw new Error("Missing POSTGRES_URL_WSA");
}
console.log("process.env.POSTGRES_URL_WSA", process.env.POSTGRES_URL_WSA);
const nonPoolingUrl = process.env.POSTGRES_URL_WSA.replace(":6543", ":5432");

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
} satisfies Config;
