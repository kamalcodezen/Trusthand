import "dotenv/config";

const base =
  `http://localhost:${process.env.PORT || 5000}`;

const unique = Date.now().toString();

async function call(
  path: string,
  method = "GET",
  value?: unknown,
  token?: string
) {
  const headers: Record<string, string> = {};

  if (value !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (value !== undefined) {
    options.body = JSON.stringify(value);
  }

  const response = await fetch(
    base + path,
    options
  );

  const json: any = await response.json();

  if (!response.ok) {
    throw new Error(
      `${method} ${path}: HTTP ${response.status} ${
        json.message || JSON.stringify(json)
      }`
    );
  }

  return json.data;
}

try {
  const locs = await call(
    "/api/locations/divisions"
  );

  if (locs.length !== 8) {
    throw new Error(
      "Run npm run seed:locations first"
    );
  }

  const districts = await call(
    `/api/locations/districts?division=${encodeURIComponent(locs[0].name)}`
  );

  const upazilas = await call(
    `/api/locations/upazilas?division=${encodeURIComponent(locs[0].name)}&district=${encodeURIComponent(districts[0].name)}`
  );

  const geo = {
    division: locs[0].name,
    district: districts[0].name,
    upazila: upazilas[0].name
  };

  const services = await call(
    "/api/services"
  );

  if (!services.length) {
    throw new Error(
      "Run npm run seed to create service categories first"
    );
  }

  const service = services[0];

  const worker = await call(
    "/api/auth/register",
    "POST",
    {
      name: "Smoke Worker",
      email: `w${unique}@example.test`,
      password: "TestPassword-123!",
      role: "worker",
      ...geo
    }
  );

  const customer = await call(
    "/api/auth/register",
    "POST",
    {
      name: "Smoke Customer",
      email: `c${unique}@example.test`,
      password: "TestPassword-123!",
      role: "customer",
      ...geo
    }
  );

  if (
    !process.env.SMOKE_ADMIN_EMAIL ||
    !process.env.SMOKE_ADMIN_PASSWORD
  ) {
    throw new Error(
      "Set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD before running smoke"
    );
  }

  const admin = await call(
    "/api/auth/login",
    "POST",
    {
      email: process.env.SMOKE_ADMIN_EMAIL,
      password: process.env.SMOKE_ADMIN_PASSWORD
    }
  );

  await call(
    "/api/workers/me",
    "PATCH",
    {
      bio: "Home service specialist",
      services: [service._id],
      startingPrice: service.basePrice,
      experienceYears: 3
    },
    worker.token
  );

  await call(
    `/api/admin/workers/${worker.user.id}`,
    "PATCH",
    {
      verificationStatus: "approved"
    },
    admin.token
  );

  const booking = await call(
    "/api/bookings",
    "POST",
    {
      workerId: worker.user.id,
      serviceId: service._id,
      address: "House 10, Road 4, Dhanmondi, Dhaka",
      scheduledAt: new Date(
        Date.now() + 86400000
      ).toISOString()
    },
    customer.token
  );

  for (
    const status of [
      "confirmed",
      "in_progress",
      "completed"
    ]
  ) {
    await call(
      `/api/bookings/${booking._id}/status`,
      "PATCH",
      { status },
      worker.token
    );
  }

  const review = await call(
    "/api/reviews",
    "POST",
    {
      bookingId: booking._id,
      rating: 5,
      comment: "Very good service"
    },
    customer.token
  );

  const payments = await call(
    "/api/payments",
    "GET",
    undefined,
    admin.token
  );

  const payment = payments.find(
    (p: any) =>
      String(p.booking._id) ===
      String(booking._id)
  );

  if (!payment) {
    throw new Error(
      "Booking payment was not created"
    );
  }

  await call(
    `/api/payments/${payment._id}`,
    "PATCH",
    {
      status: "paid"
    },
    admin.token
  );

  const overview = await call(
    "/api/admin/overview",
    "GET",
    undefined,
    admin.token
  );

  if (
    !overview.completedBookings ||
    !overview.earnedFees
  ) {
    throw new Error(
      "Overview did not update"
    );
  }

  console.log(
    "PASS: auth → worker profile → admin approval → booking → completion → review → payment → admin overview"
  );

  console.log({
    bookingId: String(booking._id),
    reviewId: String(review._id),
    platformFees: overview.earnedFees
  });
} catch (error) {
  console.error(
    "SMOKE TEST FAILED:",
    error
  );

  process.exitCode = 1;
}