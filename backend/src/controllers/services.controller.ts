import type { RequestHandler } from "express";
import { z } from "zod";

import { Service } from "../models/Service.js";

import {
  body,
  id,
  HttpError,
  q
} from "../utils/http.js";

const schema = z.object({
  name: z.string().trim().min(2).max(90),

  slug: z.string().trim().regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  ),

  description: z.string()
    .max(1000)
    .default(""),

  category: z.string()
    .trim()
    .min(2)
    .max(80),

  basePrice: z.number().min(0),

  active: z.boolean().default(true)
}).strict();

export const listServices: RequestHandler =
  async (req, res) => {
    const filter =
      q(req, "all") === "true"
        ? {}
        : { active: true };

    const items = await Service.find(filter)
      .sort({ category: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: items
    });
  };

export const getService: RequestHandler =
  async (req, res) => {
    const item = await Service.findById(
      id(req.params.id)
    );

    if (!item) {
      throw new HttpError(
        404,
        "Service not found"
      );
    }

    res.json({
      success: true,
      data: item
    });
  };

export const createService: RequestHandler =
  async (req, res) => {
    const input = body(
      schema,
      req.body
    );

    const item = await Service.create(input);

    res.status(201).json({
      success: true,
      data: item
    });
  };

export const updateService: RequestHandler =
  async (req, res) => {
    const input = body(
      schema.partial(),
      req.body
    );

    const item = await Service.findByIdAndUpdate(
      id(req.params.id),
      { $set: input },
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      throw new HttpError(
        404,
        "Service not found"
      );
    }

    res.json({
      success: true,
      data: item
    });
  };

export const deleteService: RequestHandler =
  async (req, res) => {
    const item = await Service.findByIdAndUpdate(
      id(req.params.id),

      { $set: { active: false } },

      { new: true }
    );

    if (!item) {
      throw new HttpError(
        404,
        "Service not found"
      );
    }

    res.json({
      success: true,
      message: "Service disabled; old bookings preserved"
    });
  };