import app from "./app.js";

import connectDB from "./config/db.js";
import { env } from "./config/env.js";

import mongoose from "mongoose";

async function start() {
  try {
    await connectDB();

    const server = app.listen(
      env.PORT,
      () => {
        console.log(
          `TrustHand backend: http://localhost:${env.PORT}`
        );
      }
    );

    const stop = () => {
      server.close(() =>
        mongoose.disconnect().then(() =>
          process.exit(0)
        )
      );
    };

    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  } catch (error) {
    console.error("Start failed:", error);
    process.exit(1);
  }
}

void start();