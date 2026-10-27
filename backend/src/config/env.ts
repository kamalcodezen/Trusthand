import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]).default("development"),

  PORT: z.coerce.number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  FRONTEND_URL: z.string()
    .url()
    .default("http://localhost:3000"),

  MONGODB_URI: z.string().min(1),

  MONGODB_DATABASE: z.string()
    .default("trusthand"),

  JWT_SECRET: z.string().min(32)
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid backend .env:",
    result.error.flatten().fieldErrors
  );

  throw new Error("Check backend/.env");
}

export const env = result.data;