import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import mongoose from "mongoose";

import authRoutes from "./api/auth.routes.js";
import locationRoutes from "./api/locations.routes.js";
import userRoutes from "./api/users.routes.js";
import workerRoutes from "./api/workers.routes.js";
import serviceRoutes from "./api/services.routes.js";
import bookingRoutes from "./api/bookings.routes.js";
import reviewRoutes from "./api/reviews.routes.js";
import paymentRoutes from "./api/payments.routes.js";
import adminRoutes from "./api/admin.routes.js";

import {
  errorHandler,
  notFound
} from "./middlewares/error.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(
  express.json({
    limit: "100kb"
  })
);

if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false
  }),
  authRoutes
);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "TrustHand API online",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

app.use("/api/locations", locationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;