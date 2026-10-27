import type {
  Request,
  RequestHandler
} from "express";

import { z } from "zod";
import mongoose from "mongoose";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function body<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown
): z.infer<T> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new HttpError(
      400,
      parsed.error.issues
        .map(
          i =>
            `${i.path.join(".") || "body"}: ${i.message}`
        )
        .join("; ")
    );
  }

  return parsed.data;
}

export function id(
  value: unknown
): mongoose.Types.ObjectId {
  if (
    typeof value !== "string" ||
    !mongoose.isValidObjectId(value)
  ) {
    throw new HttpError(400, "Invalid ID");
  }

  return new mongoose.Types.ObjectId(value);
}

export function q(
  req: Request,
  name: string
): string {
  return typeof req.query[name] === "string"
    ? req.query[name] as string
    : "";
}

export const handle = (
  fn: RequestHandler
): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const dateString = (d: unknown) =>
  d instanceof Date
    ? d.toISOString().slice(0, 10)
    : d
      ? String(d).slice(0, 10)
      : "";