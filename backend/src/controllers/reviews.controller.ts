import type { RequestHandler } from "express";
import { z } from "zod";

import { Review } from "../models/Review.js";
import { Booking } from "../models/Booking.js";

import {
  body,
  id,
  HttpError,
} from "../utils/http.js";

import type {
  Actor,
} from "../middlewares/auth.js";

const reviewSchema = z.object({
  bookingId: z.string(),

  rating: z.number()
    .int()
    .min(1)
    .max(5),

  comment: z.string()
    .trim()
    .max(1000)
    .default(""),
}).strict();

const editSchema = z.object({
  rating: z.number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  comment: z.string()
    .trim()
    .max(1000)
    .optional(),
}).strict();

export const createReview: RequestHandler =
  async (req, res) => {
    const input = body(
      reviewSchema,
      req.body
    );

    const actor = res.locals.actor as Actor;

    const booking = await Booking.findById(
      id(input.bookingId)
    );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    if (
      String(booking.customer) !== actor.id ||
      booking.status !== "completed"
    ) {
      throw new HttpError(
        403,
        "Only the customer can review completed jobs"
      );
    }

    const item = await Review.create({
      booking: booking._id,
      worker: booking.worker,
      customer: actor.id,
      rating: input.rating,
      comment: input.comment,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  };

export const listWorkerReviews: RequestHandler =
  async (req, res) => {
    const reviews = await Review.find({
      worker: id(req.params.workerId),
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: reviews,
    });
  };

export const myReviews: RequestHandler =
  async (_req, res) => {
    const actor = res.locals.actor as Actor;

    const items = await Review.find({
      customer: actor.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
    });
  };

export const editReview: RequestHandler =
  async (req, res) => {
    const input = body(
      editSchema,
      req.body
    );

    const actor = res.locals.actor as Actor;

    const review = await Review.findOneAndUpdate(
      {
        _id: id(req.params.id),
        customer: actor.id,
      },
      {
        $set: input,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!review) {
      throw new HttpError(
        404,
        "Your review not found"
      );
    }

    res.json({
      success: true,
      data: review,
    });
  };

export const deleteReview: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const result = await Review.deleteOne({
      _id: id(req.params.id),
      customer: actor.id,
    });

    if (!result.deletedCount) {
      throw new HttpError(
        404,
        "Your review not found"
      );
    }

    res.json({
      success: true,
      message: "Review deleted",
    });
  };