import type {
  ErrorRequestHandler,
  RequestHandler
} from "express";

import mongoose from "mongoose";
import { ZodError } from "zod";
import { HttpError } from "../utils/http.js";

export const notFound: RequestHandler =
  (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.path}`
    });
  };

export const errorHandler: ErrorRequestHandler =
  (error: unknown, _req, res, _next) => {
    let status =
      error instanceof HttpError
        ? error.status
        : 500;

    let message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    if (
      error instanceof mongoose.Error.ValidationError ||
      error instanceof mongoose.Error.CastError ||
      error instanceof ZodError
    ) {
      status = 400;
    }

    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === 11000
    ) {
      status = 409;
      message = "Duplicate record";
    }

    if (status >= 500) {
      console.error(error);
      message = "Internal server error";
    }

    res.status(status).json({
      success: false,
      message
    });
  };