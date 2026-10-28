
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

// ============================
// FORMAT USERS
// ============================

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
  isDemo: v.isDemo === true,
  verificationStatus: v.verificationStatus,
  joinedAt: dateString(v.createdAt),
});

// ============================
// FORMAT BOOKINGS
// ============================

const formatBooking = (v: any) => ({
  id: String(v._id),
  service: v.service?.name ?? "Service",
  customer: v.customer?.name ?? "Unknown",
  worker: v.worker?.name ?? "Unknown",
  scheduledAt: dateString(v.scheduledAt),
  amount: v.amount,
  status: v.status,
  isDemo:
    v.customer?.isDemo === true ||
    v.worker?.isDemo === true,
});

// ============================
// FORMAT PAYMENTS
// ============================

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
  isDemo:
    v.customer?.isDemo === true ||
    v.worker?.isDemo === true,
});

// ============================
// POPULATE BOOKING DETAILS
// ============================

const includeBooking = [
  {
    path: "service",
    select: "name",
  },
  {
    path: "customer",
    select: "name isDemo",
  },
  {
    path: "worker",
    select: "name isDemo",
  },
];

// ============================
// LIST CUSTOMERS
// ============================

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

// ============================
// LIST WORKERS
// ============================

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

// ============================
// LIST BOOKINGS
// ============================

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

// ============================
// LIST PAYMENTS
// ============================

export const listPaymentsAdmin: RequestHandler =
  async (_req, res) => {
    const items = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("customer", "name isDemo")
      .populate("worker", "name isDemo")
      .lean();

    res.json({
      data: items.map(formatPayment),
      mode,
    });
  };

// ============================
// GET ADMIN SETTINGS
// ============================

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

// ============================
// UPDATE ADMIN SETTINGS
// ============================

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

// ============================
// UPDATE CUSTOMER STATUS
// ============================

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

// ============================
// UPDATE WORKER STATUS
// ============================

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

// ============================
// ADMIN BOOKING STATUS
// ============================

export const adminChangeBooking =
  updateBookingStatus;

// ============================
// ADMIN OVERVIEW
// ============================

export const getOverview: RequestHandler =
  async (_req, res) => {
    const activeStatuses = [
      "pending",
      "quoted",
      "confirmed",
      "in_progress",
      "awaiting_completion",
    ];

    // Original total statistics.
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
          $in: activeStatuses,
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

    // ============================
    // IDENTIFY DEMO ACCOUNTS
    // ============================

    const demoUserIds = await User.distinct(
      "_id",
      {
        isDemo: true,
      }
    );

    // A booking is demo if either participant is demo.
    const demoBookingFilter = {
      $or: [
        {
          customer: {
            $in: demoUserIds,
          },
        },
        {
          worker: {
            $in: demoUserIds,
          },
        },
      ],
    };

    const demoPaymentFilter = {
      $or: [
        {
          customer: {
            $in: demoUserIds,
          },
        },
        {
          worker: {
            $in: demoUserIds,
          },
        },
      ],
    };

    // ============================
    // DEMO STATISTICS
    // ============================

    const [
      demoCustomers,
      demoWorkers,
      demoPendingVerifications,
      demoApprovedWorkers,
      demoBookings,
      demoActiveBookings,
      demoCompletedBookings,
      demoPaidStats,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
        isDemo: true,
      }),

      User.countDocuments({
        role: "worker",
        isDemo: true,
      }),

      User.countDocuments({
        role: "worker",
        isDemo: true,
        verificationStatus: "pending",
      }),

      User.countDocuments({
        role: "worker",
        isDemo: true,
        verificationStatus: "approved",
      }),

      Booking.countDocuments(
        demoBookingFilter
      ),

      Booking.countDocuments({
        ...demoBookingFilter,
        status: {
          $in: activeStatuses,
        },
      }),

      Booking.countDocuments({
        ...demoBookingFilter,
        status: "completed",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "paid",
            ...demoPaymentFilter,
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
    ]);

    // ============================
    // CALCULATE FINANCIAL TOTALS
    // ============================

    const grossPayments =
      paidStats[0]?.grossPayments ?? 0;

    const earnedFees =
      paidStats[0]?.earnedFees ?? 0;

    const demoGrossPayments =
      demoPaidStats[0]?.grossPayments ?? 0;

    const demoEarnedFees =
      demoPaidStats[0]?.earnedFees ?? 0;

    // ============================
    // DEMO BREAKDOWN
    // ============================

    const demo = {
      customers: demoCustomers,
      workers: demoWorkers,
      pendingVerifications:
        demoPendingVerifications,
      approvedWorkers:
        demoApprovedWorkers,
      bookings: demoBookings,
      activeBookings:
        demoActiveBookings,
      completedBookings:
        demoCompletedBookings,
      grossPayments:
        demoGrossPayments,
      earnedFees:
        demoEarnedFees,
    };

    // ============================
    // REAL BREAKDOWN
    // ============================

    const real = {
      customers:
        customers - demoCustomers,

      workers:
        workers - demoWorkers,

      pendingVerifications:
        pendingVerifications -
        demoPendingVerifications,

      approvedWorkers:
        approvedWorkers -
        demoApprovedWorkers,

      bookings:
        bookings - demoBookings,

      activeBookings:
        activeBookings - demoActiveBookings,

      completedBookings:
        completedBookings -
        demoCompletedBookings,

      grossPayments:
        grossPayments - demoGrossPayments,

      earnedFees:
        earnedFees - demoEarnedFees,
    };

    // ============================
    // API RESPONSE
    // ============================

    res.json({
      data: {
        customers,
        workers,
        pendingVerifications,
        approvedWorkers,
        bookings,
        activeBookings,
        completedBookings,

        grossPayments,
        earnedFees,

        recentBookings:
          recent.map(formatBooking),

        newWorkers:
          newWorkers.map(formatUser),

        isSample:
          demoCustomers > 0 ||
          demoWorkers > 0 ||
          demoBookings > 0,

        real,
        demo,

        limitedTo: 200,
      },
      mode,
    });
  };
