import mongoose from "mongoose";
import { env } from "./env.js";

export default async function connectDB(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DATABASE,
    serverSelectionTimeoutMS: 8000
  });

  console.log(
    "MongoDB connected:",
    env.MONGODB_DATABASE
  );
}