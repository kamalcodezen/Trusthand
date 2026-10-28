
import type { RequestHandler } from "express";
import { z } from "zod";

import { User } from "../models/User.js";
import { body, HttpError } from "../utils/http.js";

import {
  hashPassword,
  issueToken,
  verifyPassword,
} from "../utils/security.js";

import type { Actor } from "../middlewares/auth.js";
import { optionalAddress } from "../services/location.service.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().email().max(254).toLowerCase(),

  password: z.string().min(8).max(100),

  phone: z.string().trim().max(30).optional(),
  area: z.string().trim().max(120).optional(),

  role: z.enum(["customer", "worker"])
    .default("customer"),

  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
}).strict();

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
}).strict();

const publicUser = (u: any) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  phone: u.phone,
  area: u.area,
  division: u.division,
  district: u.district,
  upazila: u.upazila,
  role: u.role,
  status: u.status,
  verificationStatus: u.verificationStatus,
});

export const register: RequestHandler = async (
  req,
  res
) => {
  const data = body(registerSchema, req.body);

  if (await User.exists({ email: data.email })) {
    throw new HttpError(
      409,
      "Email is already registered"
    );
  }

  const location = await optionalAddress({
    division: data.division,
    district: data.district,
    upazila: data.upazila,
  });

  const user = await User.create({
    ...data,
    ...location,
    area: location.upazila || data.area || "",
    passwordHash: await hashPassword(data.password),
  });

  res.status(201).json({
    success: true,
    data: {
      user: publicUser(user),
      token: issueToken({
        id: String(user._id),
        role: data.role,
        sessionVersion: Number(
          user.sessionVersion ?? 0
        ),
      }),
    },
  });
};

export const login: RequestHandler = async (
  req,
  res
) => {
  const { email, password } = body(
    loginSchema,
    req.body
  );

  const user = await User.findOne({ email })
    .select("+passwordHash +sessionVersion");

  if (
    !user ||
    !(await verifyPassword(
      password,
      user.passwordHash
    ))
  ) {
    throw new HttpError(
      401,
      "Incorrect credentials"
    );
  }

  if (user.status !== "active") {
    throw new HttpError(
      403,
      "Account suspended"
    );
  }

  res.json({
    success: true,
    data: {
      user: publicUser(user),
      token: issueToken({
        id: String(user._id),
        role: user.role,
        sessionVersion: Number(
          user.sessionVersion ?? 0
        ),
      }),
    },
  });
};

export const me: RequestHandler = async (
  _req,
  res
) => {
  const actor = res.locals.actor as Actor;

  const user = await User.findById(actor.id)
    .populate("services", "name slug");

  if (!user) {
    throw new HttpError(
      404,
      "User not found"
    );
  }

  res.json({
    success: true,
    data: user,
  });
};

export const logout: RequestHandler = async (
  _req,
  res
) => {
  const actor = res.locals.actor as Actor;

  await User.updateOne(
    { _id: actor.id, status: "active" },
    { $inc: { sessionVersion: 1 } }
  );

  res.json({
    success: true,
    data: { loggedOut: true },
  });
};
