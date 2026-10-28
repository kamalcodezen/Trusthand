
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { Review } from "../models/Review.js";

import { hashPassword } from "../utils/security.js";
import { env } from "../config/env.js";

async function main() {
  if (
    env.NODE_ENV === "production" ||
    process.env.DEMO_SEED !== "yes"
  ) {
    throw new Error(
      "Demo seeding requires non-production NODE_ENV and DEMO_SEED=yes"
    );
  }

  const localDatabase =
    /^mongodb:\/\/(?:[^@/]+@)?(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|,|\?|$)/i
      .test(env.MONGODB_URI);

  if (!localDatabase) {
    throw new Error(
      "Demo seeding is restricted to local MongoDB."
    );
  }

  const password = process.env.DEMO_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error(
      "Set DEMO_PASSWORD to a strong password of at least 12 characters."
    );
  }

  await connectDB();

  const services = await Service.find({
    active: true,
  });

  if (!services.length) {
    throw new Error(
      "Run npm run seed first."
    );
  }

  const serviceBySlug = new Map(
    services.map((service) => [
      service.slug,
      service,
    ])
  );

  const hashed = await hashPassword(password);

  const specs = [
    {
      name: "Demo Admin",
      email: "demo.admin@example.test",
      role: "admin",
    },
    {
      name: "Demo Customer One",
      email: "demo.customer@example.test",
      role: "customer",
    },
    {
      name: "Demo Customer Two",
      email: "demo.customer2@example.test",
      role: "customer",
    },
    {
      name: "Demo Electrician",
      email: "demo.electrician@example.test",
      role: "worker",
      slug: "electrical-repair",
      price: 850,
    },
    {
      name: "Demo Plumber",
      email: "demo.plumber@example.test",
      role: "worker",
      slug: "plumbing",
      price: 750,
    },
    {
      name: "Demo AC Technician",
      email: "demo.ac@example.test",
      role: "worker",
      slug: "ac-servicing",
      price: 1250,
    },
    {
      name: "Demo Cleaner",
      email: "demo.cleaner@example.test",
      role: "worker",
      slug: "home-cleaning",
      price: 1000,
    },
  ] as const;

  const users: Record<string, any> = {};

  for (const spec of specs) {
    const worker = spec.role === "worker";

    const service = worker
      ? serviceBySlug.get(spec.slug)
      : null;

    if (worker && !service) {
      throw new Error(
        `Missing service: ${spec.slug}`
      );
    }

    const user = await User.findOneAndUpdate(
      { email: spec.email },
      {
        $setOnInsert: {
          name: spec.name,
          email: spec.email,
          passwordHash: hashed,
          role: spec.role,
          isDemo: true,
          status: "active",
          verificationStatus: worker
            ? "approved"
            : "pending",
          division: "Dhaka",
          district: "Dhaka",
          upazila: "Dhanmondi",
          area: "Dhanmondi",
          bio: worker
            ? "DEMO ONLY: Fictional worker. Identity and professional credentials have not been verified."
            : "",
          services: service
            ? [service._id]
            : [],
          experienceYears: worker ? 4 : 0,
          startingPrice: worker
            ? spec.price
            : 0,
          available: true,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    if (
      !user ||
      !user.isDemo ||
      user.role !== spec.role
    ) {
      throw new Error(
        `Refusing to modify non-demo account: ${spec.email}`
      );
    }

    users[spec.email] = user;
  }

  const customer =
    users["demo.customer@example.test"];

  const workers = specs.filter(
    (spec) => spec.role === "worker"
  );

  const statuses = [
    "completed",
    "pending",
    "confirmed",
    "in_progress",
  ] as const;

  for (let i = 0; i < workers.length; i++) {
    const spec = workers[i]!;
    const worker = users[spec.email];
    const service = serviceBySlug.get(spec.slug)!;

    const scheduledAt = new Date(
      Date.now() +
      (i === 0 ? -3 : i + 1) * 86400000
    );

    const existing = await Booking.findOne({
      customer: customer._id,
      worker: worker._id,
      note: "DEMO TEST BOOKING",
    });

    const booking = existing ||
      await Booking.create({
        customer: customer._id,
        worker: worker._id,
        service: service._id,
        address: "Demo address, Dhanmondi, Dhaka",
        division: "Dhaka",
        district: "Dhaka",
        upazila: "Dhanmondi",
        note: "DEMO TEST BOOKING",
        scheduledAt,
        status: statuses[i],
        amount: Math.max(
          worker.startingPrice,
          service.basePrice
        ),
      });

    await Payment.updateOne(
      { booking: booking._id },
      {
        $setOnInsert: {
          booking: booking._id,
          customer: customer._id,
          worker: worker._id,
          amount: booking.amount,
          platformFee: booking.amount * 0.1,
          status: i === 0
            ? "paid"
            : "pending",
          method: "cash",
          paidAt: i === 0
            ? new Date()
            : null,
        },
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (i === 0) {
      await Review.updateOne(
        { booking: booking._id },
        {
          $setOnInsert: {
            booking: booking._id,
            customer: customer._id,
            worker: worker._id,
            rating: 5,
            comment: "DEMO TEST REVIEW",
          },
        },
        {
          upsert: true,
          runValidators: true,
        }
      );
    }
  }

  console.log(
    "Demo data created: 1 admin, 2 customers, 4 workers, 4 bookings, payments and 1 review."
  );

  console.log(
    "All demo accounts use DEMO_PASSWORD."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
