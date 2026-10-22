import type { ErrorRequestHandler, RequestHandler } from "express";

// Handle requests that do not match any registered route
export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Handle errors raised while processing requests
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Request error:", error);

  const statusCode =
    typeof error?.status === "number" &&
    error.status >= 400 &&
    error.status < 600
      ? error.status
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message || "Request failed",
  });
};
