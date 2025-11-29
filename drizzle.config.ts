import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",      // path to your schema file
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // your Postgres connection string
  },
});
