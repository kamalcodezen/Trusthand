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
  HttpError
} from "../utils/http.js";

import type { Actor } from "../middlewares/auth.js";
import { optionalAddress } from "../services/location.service.js";

const createSchema = z.object({
  workerId: z.string(),
  serviceId: z.string(),

  address: z.string()
    .trim()
    .min(5)
    .max(500),

  scheduledAt: z.coerce.date(),

  note: z.string()
    .max(1000)
    .default(""),

  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional()
}).strict();

const statusSchema = z.object({
  status: z.enum([
    "confirmed",
    "in_progress",
    "completed",
    "cancelled"
  ])
}).strict();

const populate = [
  {
    path: "customer",
    select: "name email"
  },
  {
    path: "worker",
    select: "name area"
  },
  {
    path: "service",
    select: "name category"
  }
];

export const createBooking: RequestHandler =
  async (req, res) => {
    const input = body(createSchema, req.body);
    const actor = res.locals.actor as Actor;

    if (input.scheduledAt.getTime() <= Date.now()) {
      throw new HttpError(
        400,
        "Please choose a future schedule"
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

    const loc = await optionalAddress({
      division: input.division,
      district: input.district,
      upazila: input.upazila
    });

    const location = loc.division
      ? loc
      : {
          division: customer.division,
          district: customer.district,
          upazila: customer.upazila
        };

    const [worker, service, settings] =
      await Promise.all([
        User.findOne({
          _id: workerId,
          role: "worker",
          status: "active",
          verificationStatus: "approved",
          available: true,
          services: serviceId
        }),

        Service.findOne({
          _id: serviceId,
          active: true
        }),

        getSettings()
      ]);

    if (!worker) {
      throw new HttpError(
        400,
        "Worker is unavailable, unverified or does not offer this service"
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
        "Worker currently serves a different district"
      );
    }

    const conflict = await Booking.exists({
      worker: workerId,

      status: {
        $in: [
          "pending",
          "confirmed",
          "in_progress"
        ]
      },

      scheduledAt: {
        $gte: new Date(
          input.scheduledAt.getTime() -
          60 * 60 * 1000
        ),

        $lte: new Date(
          input.scheduledAt.getTime() +
          60 * 60 * 1000
        )
      }
    });

    if (conflict) {
      throw new HttpError(
        409,
        "Worker already has a booking near this time; choose another slot"
      );
    }

    const amount = Math.max(
      service.basePrice,
      worker.startingPrice
    );

    const booking = await Booking.create({
      customer: actor.id,
      worker: workerId,
      service: serviceId,
      address: input.address,
      ...location,
      note: input.note,
      scheduledAt: input.scheduledAt,
      amount
    });

    const platformFee =
      Math.round(
        amount * settings.serviceFeePercent
      ) / 100;

    try {
      await Payment.create({
        booking: booking._id,
        customer: actor.id,
        worker: workerId,
        amount,
        platformFee,
        status: "pending",
        method: "cash"
      });
    } catch (error) {
      await Booking.deleteOne({
        _id: booking._id
      });

      throw error;
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  };

export const listBookings: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const filter =
      actor.role === "admin"
        ? {}
        : actor.role === "worker"
          ? { worker: actor.id }
          : { customer: actor.id };

    const items = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate(populate)
      .lean();

    res.json({
      success: true,
      data: items
    });
  };

export const getBooking: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const item = await Booking.findById(
      id(req.params.id)
    ).populate(populate);

    if (!item) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    const customer = (
      item.customer as any
    )._id.toString();

    const worker = (
      item.worker as any
    )._id.toString();

    if (
      actor.role !== "admin" &&
      actor.id !== customer &&
      actor.id !== worker
    ) {
      throw new HttpError(
        403,
        "Access denied"
      );
    }

    res.json({
      success: true,
      data: item
    });
  };

export const updateBookingStatus: RequestHandler =
  async (req, res) => {
    const { status } = body(
      statusSchema,
      req.body
    );

    const actor = res.locals.actor as Actor;

    const booking = await Booking.findById(
      id(req.params.id)
    );

    if (!booking) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    const isCustomer =
      String(booking.customer) === actor.id;

    const isWorker =
      String(booking.worker) === actor.id;

    if (actor.role !== "admin") {
      if (
        actor.role === "customer" &&
        (
          !isCustomer ||
          status !== "cancelled" ||
          !["pending", "confirmed"].includes(
            booking.status
          )
        )
      ) {
        throw new HttpError(
          403,
          "Customer may cancel only pending/confirmed bookings"
        );
      }

      const workerTransitions: Record<
        string,
        string[]
      > = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["in_progress", "cancelled"],
        in_progress: ["completed"]
      };

      if (
        actor.role === "worker" &&
        (
          !isWorker ||
          !workerTransitions[
            booking.status
          ]?.includes(status)
        )
      ) {
        throw new HttpError(
          403,
          "Worker cannot perform this status transition"
        );
      }
    }

    if (
      ["completed", "cancelled"].includes(
        booking.status
      )
    ) {
      throw new HttpError(
        409,
        "Closed booking cannot be changed"
      );
    }

    const allowed: Record<string, string[]> = {
      pending: [
        "confirmed",
        "cancelled"
      ],

      confirmed: [
        "in_progress",
        "cancelled"
      ],

      in_progress: [
        "completed",
        "cancelled"
      ]
    };

    if (
      !allowed[booking.status]?.includes(status)
    ) {
      throw new HttpError(
        409,
        "Invalid booking transition"
      );
    }

    const updated =
      await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          status: booking.status
        },
        {
          $set: { status }
        },
        {
          new: true
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
      data: updated
    });
  };

export const deleteBooking: RequestHandler =
  async (req, res) => {
    const actor = res.locals.actor as Actor;

    const booking = await Booking.findOne({
      _id: id(req.params.id),
      customer: actor.id
    });

    if (!booking) {
      throw new HttpError(
        404,
        "Booking not found"
      );
    }

    if (
      !["pending", "cancelled"].includes(
        booking.status
      )
    ) {
      throw new HttpError(
        409,
        "Only pending/cancelled bookings can be deleted"
      );
    }

    await Booking.deleteOne({
      _id: booking._id
    });

    await Payment.deleteOne({
      booking: booking._id,
      status: "pending"
    });

    res.json({
      success: true,
      message: "Booking deleted"
    });
  };