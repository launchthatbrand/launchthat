import * as schema from "./schema";

import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

if (!process.env.WSA_POSTGRES_URL) {
  throw new Error("Missing WSA_POSTGRES_URL environment variable");
}

const pool = createPool({
  connectionString: process.env.WSA_POSTGRES_URL,
});

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
