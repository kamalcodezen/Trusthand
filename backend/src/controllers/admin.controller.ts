
import type { RequestHandler } from "express";
import { z } from "zod";

import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import {
  getSettings,
  Settings,
} from "../models/Settings.js";

import {
  body,
  id,
  HttpError,
  dateString,
} from "../utils/http.js";

import {
  updateBookingStatus,
} from "./bookings.controller.js";

const mode = "mongo";

const formatUser = (v: any) => ({
  id: String(v._id),
  name: v.name,
  email: v.email,
  phone: v.phone ?? "",
  area: v.area ?? "",
  division: v.division ?? "",
  district: v.district ?? "",
  upazila: v.upazila ?? "",
  role: v.role,
  status: v.status,
  verificationStatus: v.verificationStatus,
  joinedAt: dateString(v.createdAt),
});

const formatBooking = (v: any) => ({
  id: String(v._id),
  service: v.service?.name ?? "Service",
  customer: v.customer?.name ?? "Unknown",
  worker: v.worker?.name ?? "Unknown",
  scheduledAt: dateString(v.scheduledAt),
  amount: v.amount,
  status: v.status,
});

const formatPayment = (v: any) => ({
  id: String(v._id),
  bookingId: String(
    v.booking?._id ?? v.booking ?? ""
  ),
  customer: v.customer?.name ?? "Unknown",
  amount: v.amount,
  platformFee: v.platformFee,
  status: v.status,
  paidAt: dateString(v.paidAt),
});

const includeBooking = [
  {
    path: "service",
    select: "name",
  },
  {
    path: "customer",
    select: "name",
  },
  {
    path: "worker",
    select: "name",
  },
];

export const listUsers: RequestHandler =
  async (_req, res) => {
    const users = await User.find({
      role: "customer",
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json({
      data: users.map(formatUser),
      mode,
    });
  };

export const listWorkersAdmin: RequestHandler =
  async (_req, res) => {
    const users = await User.find({
      role: "worker",
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json({
      data: users.map(formatUser),
      mode,
    });
  };

export const listBookingsAdmin: RequestHandler =
  async (_req, res) => {
    const items = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate(includeBooking)
      .lean();

    res.json({
      data: items.map(formatBooking),
      mode,
    });
  };

export const listPaymentsAdmin: RequestHandler =
  async (_req, res) => {
    const items = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("customer", "name")
      .lean();

    res.json({
      data: items.map(formatPayment),
      mode,
    });
  };

export const getAdminSettings: RequestHandler =
  async (_req, res) => {
    const item = await getSettings();

    res.json({
      data: {
        serviceFeePercent: item.serviceFeePercent,
        supportEmail: item.supportEmail,
      },
      mode,
    });
  };

export const updateAdminSettings: RequestHandler =
  async (req, res) => {
    const input = body(
      z.object({
        serviceFeePercent: z.number()
          .min(0)
          .max(30),

        supportEmail: z.string()
          .email()
          .max(254),
      }).strict(),
      req.body
    );

    const item = await Settings.findOneAndUpdate(
      { key: "main" },
      { $set: input },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    if (!item) {
      throw new HttpError(
        500,
        "Unable to update settings"
      );
    }

    res.json({
      data: {
        serviceFeePercent: item.serviceFeePercent,
        supportEmail: item.supportEmail,
      },
    });
  };

export const updateUserStatus: RequestHandler =
  async (req, res) => {
    const input = body(
      z.object({
        status: z.enum([
          "active",
          "suspended",
        ]),
      }).strict(),
      req.body
    );

    const user = await User.findOneAndUpdate(
      {
        _id: id(req.params.id),
        role: "customer",
      },
      {
        $set: input,
      },
      {
        new: true,
      }
    );

    if (!user) {
      throw new HttpError(
        404,
        "Customer not found"
      );
    }

    res.json({
      data: formatUser(user),
    });
  };

export const updateWorkerStatus: RequestHandler =
  async (req, res) => {
    const input = body(
      z.object({
        verificationStatus: z.enum([
          "pending",
          "approved",
          "rejected",
        ]),
      }).strict(),
      req.body
    );

    const user = await User.findOneAndUpdate(
      {
        _id: id(req.params.id),
        role: "worker",
      },
      {
        $set: input,
      },
      {
        new: true,
      }
    );

    if (!user) {
      throw new HttpError(
        404,
        "Worker not found"
      );
    }

    res.json({
      data: formatUser(user),
    });
  };

export const adminChangeBooking =
  updateBookingStatus;

export const getOverview: RequestHandler =
  async (_req, res) => {
    const [
      customers,
      workers,
      pendingVerifications,
      approvedWorkers,
      bookings,
      activeBookings,
      completedBookings,
      paidStats,
      recent,
      newWorkers,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "worker",
      }),

      User.countDocuments({
        role: "worker",
        verificationStatus: "pending",
      }),

      User.countDocuments({
        role: "worker",
        verificationStatus: "approved",
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: {
          $in: [
            "pending",
            "quoted",
            "confirmed",
            "in_progress",
            "awaiting_completion",
          ],
        },
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            grossPayments: {
              $sum: "$amount",
            },
            earnedFees: {
              $sum: "$platformFee",
            },
          },
        },
      ]),

      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate(includeBooking)
        .lean(),

      User.find({
        role: "worker",
        verificationStatus: "pending",
      })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
    ]);

    res.json({
      data: {
        customers,
        workers,
        pendingVerifications,
        approvedWorkers,
        bookings,
        activeBookings,
        completedBookings,

        grossPayments:
          paidStats[0]?.grossPayments ?? 0,

        earnedFees:
          paidStats[0]?.earnedFees ?? 0,

        recentBookings:
          recent.map(formatBooking),

        newWorkers:
          newWorkers.map(formatUser),

        isSample: false,
        limitedTo: 200,
      },
      mode,
    });
  };
