import type { RequestHandler } from "express";
import { z } from "zod";

import { Payment } from "../models/Payment.js";
import { Booking } from "../models/Booking.js";

import {
  body,
  id,
  HttpError
} from "../utils/http.js";

import type { Actor } from "../middlewares/auth.js";

const paymentSchema = z.object({
  status: z.enum([
    "paid",
    "refunded"
  ])
}).strict();

export const listPayments: RequestHandler =
  async (_req, res) => {
    const actor = res.locals.actor as Actor;

    const filter =
      actor.role === "admin"
        ? {}
        : actor.role === "worker"
          ? { worker: actor.id }
          : { customer: actor.id };

    const items = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate(
        "booking",
        "status scheduledAt"
      );

    res.json({
      success: true,
      data: items
    });
  };

export const markPayment: RequestHandler =
  async (req, res) => {
    const { status } = body(
      paymentSchema,
      req.body
    );

    const payment = await Payment.findById(
      id(req.params.id)
    );

    if (!payment) {
      throw new HttpError(
        404,
        "Payment not found"
      );
    }

    const booking = await Booking.findById(
      payment.booking
    );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    if (
      status === "paid" &&
      (
        payment.status !== "pending" ||
        booking.status !== "completed"
      )
    ) {
      throw new HttpError(
        409,
        "Complete the booking before confirming cash received"
      );
    }

    if (
      status === "refunded" &&
      payment.status !== "paid"
    ) {
      throw new HttpError(
        409,
        "Only paid records can be marked refunded"
      );
    }

    payment.status = status;

    payment.paidAt =
      status === "paid"
        ? new Date()
        : payment.paidAt;

    await payment.save();

    res.json({
      success: true,
      data: payment,
      message: "Manual payment record updated; no money was transferred"
    });
  };