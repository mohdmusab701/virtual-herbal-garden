import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z.string().url(),
  MONGODB_TEST_URI: z.string().url().optional(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  AI_SERVICE_URL: z.string().url().default("http://127.0.0.1:8000"),
  MAX_IMAGE_SIZE_MB: z.coerce.number().int().min(1).max(50).default(10),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  MOCK_AI_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.format());
  process.exit(1);
}

export const env = _env.data;
