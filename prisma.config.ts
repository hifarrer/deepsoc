import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load environment variables
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
});
