
import type { RequestHandler } from "express";
import { User } from "../models/User.js";
import { HttpError } from "../utils/http.js";
import { parseToken } from "../utils/security.js";

export type Actor = {
  id: string;
  role: "customer" | "worker" | "admin";
};

export const requireAuth: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const match = /^Bearer (\S+)$/i.exec(
      req.header("authorization") || ""
    );

    if (!match?.[1]) {
      throw new HttpError(401, "Login required");
    }

    const claims = parseToken(match[1]);

    const user = await User.findById(claims.sub)
      .select("role status +sessionVersion")
      .lean();

    if (
      !user ||
      user.status !== "active" ||
      user.role !== claims.role ||
      Number(user.sessionVersion ?? 0) !== claims.sv
    ) {
      throw new HttpError(401, "Session invalid");
    }

    res.locals.actor = {
      id: String(user._id),
      role: user.role,
    } as Actor;

    next();
  } catch (error) {
    next(error);
  }
};

export const roles =
  (...allowed: Actor["role"][]): RequestHandler =>
  (_req, res, next) => {
    const actor = res.locals.actor as
      | Actor
      | undefined;

    if (
      !actor ||
      !allowed.includes(actor.role)
    ) {
      return next(
        new HttpError(403, "Access denied")
      );
    }

    next();
  };
