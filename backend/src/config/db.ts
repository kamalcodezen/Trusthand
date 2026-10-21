import mongoose from "mongoose";
import { env } from "./env.js";

export default async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DATABASE,
    });

    console.log("MongoDB connected successfully");
    console.log("Mongoose connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );

    process.exit(1);
  }
}
