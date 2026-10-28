
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { env } from "../config/env.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";

const password = process.env.DEMO_PASSWORD;

const API = (
  process.env.API_BASE ||
  "http://127.0.0.1:5000"
).replace(/\/$/, "");

if (
  !/^mongodb:\/\/(?:[^@/]+@)?(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|,|\?|$)/i
    .test(env.MONGODB_URI)
) {
  throw new Error(
    "Smoke test restricted to local MongoDB"
  );
}

if (
  !/^http:\/\/(?:127\.0\.0\.1|localhost):5000$/
    .test(API)
) {
  throw new Error(
    "Smoke API_BASE must point to local port 5000"
  );
}

if (!password) {
  throw new Error(
    "Set DEMO_PASSWORD to demo seed password"
  );
}

let temporaryBookingId: string | undefined;

async function call(
  path: string,
  token?: string,
  method = "GET",
  input?: unknown
) {
  const response = await fetch(
    `${API}/api${path}`,
    {
      method,
      headers: {
        Accept: "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(input === undefined
          ? {}
          : {
              "Content-Type": "application/json",
            }),
      },
      ...(input === undefined
        ? {}
        : {
            body: JSON.stringify(input),
          }),
    }
  );

  const json = await response.json() as {
    success?: boolean;
    message?: string;
    data?: any;
  };

  return {
    status: response.status,
    ...json,
  };
}

async function login(email: string) {
  const result = await call(
    "/auth/login",
    undefined,
    "POST",
    {
      email,
      password,
    }
  );

  if (
    result.status !== 200 ||
    !result.data?.token
  ) {
    throw new Error(
      `Login failed for ${email}: ${result.status} ${result.message}`
    );
  }

  return result.data.token as string;
}

function check(
  value: boolean,
  message: string
) {
  if (!value) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

async function run() {
  const guest = await call("/bookings");

  check(
    guest.status === 401,
    "Guest cannot list bookings"
  );

  const [
    customer,
    other,
    worker,
    admin,
  ] = await Promise.all([
    login("demo.customer@example.test"),
    login("demo.customer2@example.test"),
    login("demo.electrician@example.test"),
    login("demo.admin@example.test"),
  ]);

  const who = await call(
    "/workers/me",
    worker
  );

  const workerId = String(
    who.data?._id
  );

  const serviceId = String(
    who.data?.services?.[0]?._id
  );

  check(
    Boolean(
      who.data &&
      workerId !== "undefined" &&
      serviceId !== "undefined"
    ),
    "Demo worker has a service"
  );

  const scheduledAt = new Date(
    Date.now() + 21 * 86400000 + 11 * 3600000
  ).toISOString();

  const created = await call(
    "/bookings",
    customer,
    "POST",
    {
      workerId,
      serviceId,
      address: "Demo address, Dhanmondi, Dhaka",
      scheduledAt,
      note: "PHASE23_SMOKE_TEMPORARY",
    }
  );

  check(
    created.status === 201 &&
    created.data?.status === "pending",
    "Customer requests job without confirmed price"
  );

  temporaryBookingId = String(
    created.data._id
  );

  const route = `/bookings/${temporaryBookingId}`;

  const forbidden = await call(
    route,
    other
  );

  check(
    forbidden.status === 403,
    "Another customer cannot view booking"
  );

  const forbiddenQuote = await call(
    `${route}/quote`,
    customer,
    "POST",
    {
      amount: 900,
      description: "Test quote details",
      estimatedHours: 1,
    }
  );

  check(
    forbiddenQuote.status === 403,
    "Customer cannot impersonate worker to quote"
  );

  const offer = await call(
    `${route}/quote`,
    worker,
    "POST",
    {
      amount: 1200,
      description: "Replace socket and test wiring",
      estimatedHours: 1.5,
    }
  );

  check(
    offer.status === 200 &&
    offer.data?.status === "quoted",
    "Worker sends quotation"
  );

  const outsiderAccept = await call(
    `${route}/quote/respond`,
    other,
    "POST",
    {
      decision: "accept",
    }
  );

  check(
    outsiderAccept.status === 403,
    "Another customer cannot accept the quote"
  );

  const accepted = await call(
    `${route}/quote/respond`,
    customer,
    "POST",
    {
      decision: "accept",
    }
  );

  check(
    accepted.status === 200 &&
    accepted.data?.status === "confirmed" &&
    accepted.data?.amount === 1200,
    "Customer accepts quote and locks agreed amount"
  );

  const payment = await call(
    "/payments",
    customer
  );

  const record = payment.data?.find(
    (p: {
      booking?: string | { _id?: string };
    }) => {
      const booking = p.booking;

      return String(
        typeof booking === "string"
          ? booking
          : booking?._id
      ) === temporaryBookingId;
    }
  );

  check(
    payment.status === 200 &&
    record?.status === "pending" &&
    record?.amount === 1200,
    "Manual payment record is pending"
  );

  const tooEarly = await call(
    `/payments/${record._id}`,
    admin,
    "PATCH",
    {
      status: "paid",
    }
  );

  check(
    tooEarly.status === 409,
    "Admin cannot mark paid before completion"
  );

  const begun = await call(
    `${route}/status`,
    worker,
    "PATCH",
    {
      status: "in_progress",
    }
  );

  check(
    begun.status === 200,
    "Worker starts job"
  );

  const requested = await call(
    `${route}/status`,
    worker,
    "PATCH",
    {
      status: "awaiting_completion",
    }
  );

  check(
    requested.status === 200,
    "Worker requests completion approval"
  );

  const wrongParty = await call(
    `${route}/status`,
    worker,
    "PATCH",
    {
      status: "completed",
    }
  );

  check(
    wrongParty.status === 403,
    "Worker cannot self-approve completion"
  );

  const done = await call(
    `${route}/status`,
    customer,
    "PATCH",
    {
      status: "completed",
    }
  );

  check(
    done.status === 200 &&
    done.data?.status === "completed",
    "Customer confirms completion"
  );

  const paid = await call(
    `/payments/${record._id}`,
    admin,
    "PATCH",
    {
      status: "paid",
    }
  );

  check(
    paid.status === 200 &&
    paid.data?.status === "paid",
    "Admin records cash payment only"
  );
}

run()
  .then(() => {
    console.log(
      "Phase 2+3 smoke tests PASSED"
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (temporaryBookingId) {
      await connectDB();

      await Payment.deleteMany({
        booking: temporaryBookingId,
      });

      await Booking.deleteOne({
        _id: temporaryBookingId,
        note: "PHASE23_SMOKE_TEMPORARY",
      });

      console.log(
        "Temporary smoke booking cleaned up"
      );
    }

    await mongoose.disconnect();
  });
