// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/drizzle/schema.ts",
//   out: "./src/drizzle/migrations",
//   dialect: "sqlite",
//   dbCredentials: {
//     url: process.env.DATABASE_URL as string,
//   },
//   verbose: true,
//   strict: true,
// });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: "./sqlite.db"
  }
});