
import type { RequestHandler } from "express";
import { z } from "zod";

import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { getSettings } from "../models/Settings.js";

import {
  body,
  id,
  HttpError,
} from "../utils/http.js";

import type { Actor } from "../middlewares/auth.js";
import { optionalAddress } from "../services/location.service.js";

const createSchema = z.object({
  workerId: z.string(),
  serviceId: z.string(),
  address: z.string().trim().min(5).max(500),
  scheduledAt: z.coerce.date(),
  note: z.string().trim().max(1000).default(""),
  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
}).strict();

const quoteSchema = z.object({
  amount: z.number().int().min(1).max(10000000),
  description: z.string().trim().min(8).max(1000),
  estimatedHours: z.number()
    .min(0.5)
    .max(240)
    .default(1),
}).strict();

const statusSchema = z.object({
  status: z.enum([
    "in_progress",
    "awaiting_completion",
    "completed",
    "cancelled",
  ]),
  reason: z.string().trim().max(500).optional(),
}).strict();

const populate = [
  { path: "customer", select: "name" },
  { path: "worker", select: "name area" },
  { path: "service", select: "name category" },
];

async function readBooking(rawId: unknown) {
  const item = await Booking.findById(id(rawId));

  if (!item) {
    throw new HttpError(404, "Booking not found");
  }

  return item;
}

function owned(
  booking: any,
  actor: Actor,
  role: "customer" | "worker"
) {
  if (
    actor.role !== role ||
    String(booking[role]) !== actor.id
  ) {
    throw new HttpError(
      403,
      "You cannot change someone else's booking"
    );
  }
}

export const createBooking: RequestHandler =
  async (req, res) => {
    const input = body(createSchema, req.body);
    const actor = res.locals.actor as Actor;

    if (
      input.scheduledAt.getTime() <=
      Date.now() + 15 * 60000
    ) {
      throw new HttpError(
        400,
        "Schedule must be at least 15 minutes in the future"
      );
    }

    const workerId = id(input.workerId);
    const serviceId = id(input.serviceId);

    const customer = await User.findById(actor.id);

    if (!customer) {
      throw new HttpError(
        404,
        "Customer not found"
      );
    }

    const chosen = await optionalAddress({
      division: input.division,
      district: input.district,
      upazila: input.upazila,
    });

    const location = chosen.division
      ? chosen
      : {
          division: customer.division,
          district: customer.district,
          upazila: customer.upazila,
        };

    const [worker, service] = await Promise.all([
      User.findOne({
        _id: workerId,
        role: "worker",
        status: "active",
        verificationStatus: "approved",
        available: true,
        services: serviceId,
      }),

      Service.findOne({
        _id: serviceId,
        active: true,
      }),
    ]);

    if (!worker) {
      throw new HttpError(
        400,
        "Worker is unavailable or not approved for this service"
      );
    }

    if (!service) {
      throw new HttpError(
        404,
        "Service not found"
      );
    }

    if (
      location.district &&
      worker.district &&
      (
        location.division !== worker.division ||
        location.district !== worker.district
      )
    ) {
      throw new HttpError(
        400,
        "Worker serves a different district"
      );
    }

    const near = await Booking.exists({
      worker: workerId,
      status: {
        $in: [
          "pending",
          "quoted",
          "confirmed",
          "in_progress",
          "awaiting_completion",
        ],
      },
      scheduledAt: {
        $gte: new Date(
          input.scheduledAt.getTime() - 3600000
        ),
        $lte: new Date(
          input.scheduledAt.getTime() + 3600000
        ),
      },
    });

    if (near) {
      throw new HttpError(
        409,
        "Worker already has a nearby request; select another time"
      );
    }

    const estimatedAmount = Math.max(
      service.basePrice,
      worker.startingPrice
    );

    const item = await Booking.create({
      customer: actor.id,
      worker: workerId,
      service: serviceId,
      address: input.address,
      ...location,
      note: input.note,
      scheduledAt: input.scheduledAt,
      estimatedAmount,
      amount: 0,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  };

export const listBookings: RequestHandler =
  async (_req, res) => {
    const actor = res.locals.actor as Actor;

    const filter =
      actor.role === "admin"
        ? {}
        : { [actor.role]: actor.id };

    const items = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate(populate)
      .lean();

    res.json({
      success: true,
      data: items,
    });
  };

export const getBooking: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;
    const item = await readBooking(req.params.id);

    if (
      actor.role !== "admin" &&
      String(item.customer) !== actor.id &&
      String(item.worker) !== actor.id
    ) {
      throw new HttpError(403, "Access denied");
    }

    await item.populate(populate);

    res.json({
      success: true,
      data: item,
    });
  };

export const sendQuote: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;
    const input = body(quoteSchema, req.body);

    const item = await readBooking(req.params.id);

    owned(item, actor, "worker");

    if (!["pending", "quoted"].includes(item.status)) {
      throw new HttpError(
        409,
        "Booking is not accepting quotes"
      );
    }

    if (
      new Date(item.scheduledAt).getTime() <= Date.now()
    ) {
      throw new HttpError(
        409,
        "The requested schedule has passed; ask customer to create a new request"
      );
    }

    const worker = await User.findOne({
      _id: actor.id,
      role: "worker",
      status: "active",
      verificationStatus: "approved",
    });

    if (!worker) {
      throw new HttpError(
        403,
        "Worker account is not approved"
      );
    }

    const offeredAt = new Date();

    const updated = await Booking.findOneAndUpdate(
      {
        _id: item._id,
        worker: actor.id,
        status: {
          $in: ["pending", "quoted"],
        },
        updatedAt: item.updatedAt,
      },
      {
        $set: {
          status: "quoted",
          quote: {
            ...input,
            offeredAt,
            acceptedAt: null,
            declinedAt: null,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new HttpError(
        409,
        "Booking changed; refresh and retry"
      );
    }

    res.json({
      success: true,
      data: updated,
    });
  };

export const respondQuote: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const input = body(
      z.object({
        decision: z.enum(["accept", "decline"]),
      }).strict(),
      req.body
    );

    const item = await readBooking(req.params.id);
    owned(item, actor, "customer");

    if (
      item.status !== "quoted" ||
      !item.quote?.amount ||
      !item.quote?.offeredAt
    ) {
      throw new HttpError(
        409,
        "No current quote to respond to"
      );
    }

    if (
      input.decision === "accept" &&
      new Date(item.scheduledAt).getTime() <= Date.now()
    ) {
      throw new HttpError(
        409,
        "The requested time has passed; create a new request"
      );
    }

    if (
      input.decision === "accept" &&
      !await User.exists({
        _id: item.worker,
        role: "worker",
        status: "active",
        verificationStatus: "approved",
        available: true,
      })
    ) {
      throw new HttpError(
        409,
        "Worker is no longer available or approved"
      );
    }

    if (input.decision === "decline") {
      const updated = await Booking.findOneAndUpdate(
        {
          _id: item._id,
          customer: actor.id,
          status: "quoted",
          "quote.offeredAt": item.quote.offeredAt,
        },
        {
          $set: {
            status: "pending",
            "quote.declinedAt": new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updated) {
        throw new HttpError(
          409,
          "Quote changed; refresh"
        );
      }

      res.json({
        success: true,
        data: updated,
      });
      return;
    }

    const amount = Number(item.quote.amount);
    const now = new Date();

    const updated = await Booking.findOneAndUpdate(
      {
        _id: item._id,
        customer: actor.id,
        status: "quoted",
        "quote.offeredAt": item.quote.offeredAt,
        "quote.amount": amount,
      },
      {
        $set: {
          status: "confirmed",
          amount,
          "quote.acceptedAt": now,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new HttpError(
        409,
        "Quote changed; refresh before approving"
      );
    }

    // Creates a manual record only.
    // No payment provider is contacted.
    const settings = await getSettings();

    const platformFee =
      Math.round(
        amount * settings.serviceFeePercent
      ) / 100;

    try {
      await Payment.updateOne(
        {
          booking: updated._id,
          status: "pending",
        },
        {
          $set: {
            amount,
            platformFee,
            method: "cash",
            customer: updated.customer,
            worker: updated.worker,
          },
          $setOnInsert: {
            booking: updated._id,
            status: "pending",
          },
        },
        {
          upsert: true,
          runValidators: true,
        }
      );
    } catch (error) {
      await Booking.updateOne(
        {
          _id: updated._id,
          status: "confirmed",
          "quote.acceptedAt": now,
        },
        {
          $set: {
            status: "quoted",
            amount: 0,
            "quote.acceptedAt": null,
          },
        }
      );

      console.error(
        "Payment record creation failed for booking",
        String(updated._id),
        error
      );

      throw new HttpError(
        503,
        "Could not create the payment record; please retry quote approval"
      );
    }

    res.json({
      success: true,
      data: updated,
    });
  };

export const updateBookingStatus: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;
    const input = body(statusSchema, req.body);

    const item = await readBooking(req.params.id);

    const customer =
      String(item.customer) === actor.id;

    const worker =
      String(item.worker) === actor.id;

    const status = input.status;

    const permitted =
      (
        actor.role === "worker" &&
        worker &&
        (
          (
            item.status === "confirmed" &&
            status === "in_progress"
          ) ||
          (
            item.status === "in_progress" &&
            status === "awaiting_completion"
          )
        )
      ) ||
      (
        actor.role === "customer" &&
        customer &&
        (
          (
            item.status === "awaiting_completion" &&
            status === "completed"
          ) ||
          (
            [
              "pending",
              "quoted",
              "confirmed",
            ].includes(item.status) &&
            status === "cancelled"
          )
        )
      ) ||
      (
        actor.role === "admin" &&
        status === "cancelled" &&
        [
          "pending",
          "quoted",
          "confirmed",
          "in_progress",
          "awaiting_completion",
        ].includes(item.status)
      );

    if (!permitted) {
      throw new HttpError(
        403,
        "This status change is not allowed for your role"
      );
    }

    if (
      status === "in_progress" &&
      !await Payment.exists({
        booking: item._id,
        status: "pending",
      })
    ) {
      throw new HttpError(
        409,
        "Booking payment record is not ready; contact support"
      );
    }

    if (
      status === "cancelled" &&
      (
        !input.reason ||
        input.reason.length < 4
      )
    ) {
      throw new HttpError(
        400,
        "Cancellation requires a reason (at least 4 characters)"
      );
    }

    const next =
      status === "cancelled"
        ? {
            status,
            cancellationReason: input.reason,
            cancelledAt: new Date(),
          }
        : status === "awaiting_completion"
          ? {
              status,
              completionRequestedAt: new Date(),
            }
          : status === "completed"
            ? {
                status,
                completedAt: new Date(),
              }
            : { status };

    const updated = await Booking.findOneAndUpdate(
      {
        _id: item._id,
        status: item.status,
        updatedAt: item.updatedAt,
      },
      {
        $set: next,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new HttpError(
        409,
        "Booking changed; refresh and retry"
      );
    }

    if (status === "cancelled") {
      await Payment.updateOne(
        {
          booking: updated._id,
          status: "pending",
        },
        {
          $set: {
            status: "void",
          },
        }
      );
    }

    res.json({
      success: true,
      data: updated,
    });
  };

export const deleteBooking: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const item = await Booking.findOne({
      _id: id(req.params.id),
      customer: actor.id,
    });

    if (!item) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    if (
      item.status !== "pending" ||
      item.amount !== 0
    ) {
      throw new HttpError(
        409,
        "Only an unquoted pending request can be deleted"
      );
    }

    if (
      await Payment.exists({
        booking: item._id,
      })
    ) {
      throw new HttpError(
        409,
        "Booking has a payment record"
      );
    }

    await Booking.deleteOne({
      _id: item._id,
      customer: actor.id,
      status: "pending",
      amount: 0,
    });

    res.json({
      success: true,
      message: "Request deleted",
    });
  };
