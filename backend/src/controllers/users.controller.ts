import type { RequestHandler } from "express";
import { z } from "zod";

import {
  body,
  HttpError,
} from "../utils/http.js";

import { User } from "../models/User.js";

import type {
  Actor,
} from "../middlewares/auth.js";

import {
  optionalAddress,
} from "../services/location.service.js";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  area: z.string().trim().max(120).optional(),

  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
}).strict();

export const updateMe: RequestHandler =
  async (req, res) => {
    const changes = body(updateSchema, req.body);
    const actor = res.locals.actor as Actor;

    const location = await optionalAddress({
      division: changes.division,
      district: changes.district,
      upazila: changes.upazila,
    });

    Object.assign(changes, location);

    if (location.upazila) {
      changes.area = location.upazila;
    }

    const user = await User.findByIdAndUpdate(
      actor.id,
      { $set: changes },
      {
        new: true,
        runValidators: true,
      }
    );

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