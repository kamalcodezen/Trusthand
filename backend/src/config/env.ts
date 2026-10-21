import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  FRONTEND_URL: z.string().url(),

  BETTER_AUTH_URL: z.string().url(),

  BETTER_AUTH_SECRET: z.string().min(32),

  MONGODB_URI: z.string().min(1),

  MONGODB_DATABASE: z.string().min(1).default("trusthand"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(result.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = result.data;
