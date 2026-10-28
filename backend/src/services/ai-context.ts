
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Review } from "../models/Review.js";
import { Payment } from "../models/Payment.js";
import type { Actor } from "../middlewares/auth.js";

const date = (value: unknown) =>
  value ? new Date(String(value)).toISOString() : null;

export async function buildAIContext(
  kind: "public" | Actor["role"],
  actor?: Actor
) {
  // Public assistant: active service catalog only
  if (kind === "public") {
    const services = await Service.find({ active: true })
      .select("name category description")
      .limit(40)
      .lean();

    return {
      services: services.map((s) => ({
        name: s.name,
        category: s.category,
        description: s.description,
      })),
    };
  }

  if (!actor || actor.role !== kind) {
    throw new Error("AI context access denied");
  }

  // Customer assistant: own bookings + public worker info
  if (kind === "customer") {
    const [user, bookings, workers] = await Promise.all([
      User.findById(actor.id)
        .select("name district upazila")
        .lean(),

      Booking.find({ customer: actor.id })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate("service", "name category")
        .populate("worker", "name")
        .lean(),

      User.find({
        role: "worker",
        status: "active",
        verificationStatus: "approved",
        available: true,
      })
        .select("name district upazila services")
        .populate("services", "name")
        .limit(40)
        .lean(),
    ]);

    return {
      myDistrict: user?.district ?? "",

      myBookings: bookings.map((b: any) => ({
        id: String(b._id),
        service: b.service?.name ?? "Unknown",
        worker: b.worker?.name ?? "Unknown",
        status: b.status,
        scheduledAt: date(b.scheduledAt),
        createdAt: date(b.createdAt),
      })),

      availableWorkers: workers
        .filter(
          (w: any) =>
            !user?.district || w.district === user.district
        )
        .slice(0, 12)
        .map((w: any) => ({
          name: w.name,
          district: w.district,
          services: (w.services ?? []).map(
            (s: any) => s.name
          ),
        })),
    };
  }

  // Worker assistant: own profile + assigned jobs
  if (kind === "worker") {
    const [profile, bookings, completed] = await Promise.all([
      User.findById(actor.id)
        .select(
          "name bio experienceYears services available verificationStatus district"
        )
        .populate("services", "name category")
        .lean(),

      Booking.find({
        worker: actor.id,
        status: {
          $in: ["pending", "confirmed", "in_progress"],
        },
      })
        .sort({ scheduledAt: 1 })
        .limit(12)
        .populate("service", "name category")
        .lean(),

      Booking.countDocuments({
        worker: actor.id,
        status: "completed",
      }),
    ]);

    return {
      profile: {
        bio: profile?.bio ?? "",
        experienceYears: profile?.experienceYears ?? 0,
        available: profile?.available ?? false,
        verificationStatus: profile?.verificationStatus,
        services: (profile?.services ?? []).map(
          (s: any) => s.name
        ),
      },

      completedJobs: completed,

      activeJobs: bookings.map((b: any) => ({
        id: String(b._id),
        service: b.service?.name,
        status: b.status,
        scheduledAt: date(b.scheduledAt),
        district: b.district,
      })),
    };
  }

  // Admin assistant: operational patterns without PII
  const since = new Date(Date.now() - 30 * 86400000);

  const [
    total,
    pending,
    late,
    cancelled,
    lowRated,
    payments,
    byStatus,
    recent,
  ] = await Promise.all([
    Booking.countDocuments({
      createdAt: { $gte: since },
    }),

    User.countDocuments({
      role: "worker",
      verificationStatus: "pending",
    }),

    Booking.countDocuments({
      status: "pending",
      scheduledAt: { $lt: new Date() },
    }),

    Booking.countDocuments({
      status: "cancelled",
      createdAt: { $gte: since },
    }),

    Review.countDocuments({
      rating: { $lte: 2 },
      createdAt: { $gte: since },
    }),

    Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]),

    Booking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    Booking.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("status scheduledAt createdAt")
      .populate("service", "name")
      .lean(),
  ]);

  return {
    period:
      "Last 30 days, except payment totals (all time)",

    bookingsCreated: total,
    pendingWorkerVerifications: pending,
    pendingBookingsPastScheduledTime: late,
    cancelledBookings: cancelled,
    reviewsWithRating1Or2: lowRated,

    paymentsByStatus: payments,
    bookingsByStatus: byStatus,

    recentBookings: recent.map((b: any) => ({
      service: b.service?.name ?? "Unknown",
      status: b.status,
      scheduledAt: date(b.scheduledAt),
      createdAt: date(b.createdAt),
    })),
  };
}
