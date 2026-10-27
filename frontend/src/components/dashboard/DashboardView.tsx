
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import type {
  UserRole,
} from "@/lib/trusthand-api";

import TrustAI from "@/components/ai/TrustAI";

import {
  apiAuth,
  displayDate,
  displayName,
  patchJSON,
  postJSON,
  putJSON,
  type Booking,
  type Overview,
  type Payment,
  type Person,
  type Profile,
  type Service,
} from "@/lib/dashboard-api";

const valid: Record<UserRole, string[]> = {
  customer: [
    "overview",
    "bookings",
    "payments",
    "reviews",
    "profile",
    "ai",
  ],

  worker: [
    "overview",
    "bookings",
    "payments",
    "profile",
    "ai",
  ],

  admin: [
    "overview",
    "customers",
    "workers",
    "bookings",
    "payments",
    "services",
    "settings",
    "ai",
  ],
};

const inputStyle =
  "w-full rounded-xl border border-[#dbe5dd] bg-white p-3 text-sm outline-[#184c3b]";

const primary =
  "rounded-xl bg-[#184c3b] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";

const secondary =
  "rounded-xl border border-[#b6cdc0] bg-white px-3 py-2 text-sm font-semibold text-[#184c3b] hover:bg-[#eef6f0] disabled:opacity-40";

const panel =
  "rounded-2xl border border-[#e0e8e2] bg-white p-5 shadow-sm";

type Review = {
  _id: string;
  booking: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

type AdminRow =
  | Person
  | {
      id: string;
      bookingId?: string;
      customer?: string;
      worker?: string;
      service?: string;
      scheduledAt?: string;
      amount?: number;
      platformFee?: number;
      paidAt?: string;
      status: string;
    };

export default function DashboardView({
  role,
  section,
}: {
  role: UserRole;
  section: string;
}) {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [overview, setOverview] =
    useState<Overview | null>(null);

  const [settings, setSettings] = useState<{
    serviceFeePercent: number;
    supportEmail: string;
  } | null>(null);

  const [form, setForm] =
    useState<Record<string, string>>({});

  const [selectedServices, setSelectedServices] =
    useState<string[]>([]);

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  const allowed = valid[role].includes(section);

  useEffect(() => {
    if (!allowed || section === "ai") {
      setLoading(false);
      return;
    }

    let active = true;

    setLoading(true);
    setError("");
    setNotice("");

    const load = async () => {
      if (role === "admin") {
        if (section === "overview") {
          const result = await apiAuth<Overview>(
            "/api/admin/overview"
          );

          if (active) setOverview(result);
        } else if (section === "settings") {
          const result = await apiAuth<{
            serviceFeePercent: number;
            supportEmail: string;
          }>("/api/admin/settings");

          if (active) setSettings(result);
        } else if (section === "services") {
          const result = await apiAuth<Service[]>(
            "/api/services?all=true"
          );

          if (active) setServices(result);
        } else {
          const endpoint =
            section === "customers"
              ? "users"
              : section;

          const result = await apiAuth<AdminRow[]>(
            `/api/admin/${endpoint}`
          );

          if (active) setRows(result);
        }
      } else {
        if (
          section === "overview" ||
          section === "bookings"
        ) {
          const result = await apiAuth<Booking[]>(
            "/api/bookings"
          );

          if (active) setBookings(result);
        }

        if (
          section === "payments" ||
          section === "overview"
        ) {
          const result = await apiAuth<Payment[]>(
            "/api/payments"
          );

          if (active) setPayments(result);
        }

        if (section === "reviews") {
          const result = await apiAuth<Review[]>(
            "/api/reviews/mine"
          );

          if (active) setReviews(result);
        }

        if (
          section === "profile" ||
          section === "overview"
        ) {
          const result = await apiAuth<Profile>(
            role === "worker"
              ? "/api/workers/me"
              : "/api/auth/me"
          );

          if (active) {
            setProfile(result);

            setSelectedServices(
              (result.services ?? []).map(
                (s) => s._id
              )
            );
          }
        }

        if (
          section === "profile" &&
          role === "worker"
        ) {
          const result = await apiAuth<Service[]>(
            "/api/services"
          );

          if (active) setServices(result);
        }

        if (section === "reviews") {
          const result = await apiAuth<Booking[]>(
            "/api/bookings"
          );

          if (active) setBookings(result);
        }
      }
    };

    load()
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Loading failed"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [role, section, allowed, reload]);

  async function action(
    path: string,
    method: "PATCH" | "POST" | "PUT",
    payload: unknown
  ) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const config =
        method === "POST"
          ? postJSON(payload)
          : method === "PUT"
            ? putJSON(payload)
            : patchJSON(payload);

      await apiAuth(path, config);

      setNotice("Updated successfully.");
      setReload((v) => v + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Update failed"
      );
    } finally {
      setBusy(false);
    }
  }

  const onForm = (
    field: string,
    value: string
  ) => {
    setForm((v) => ({
      ...v,
      [field]: value,
    }));
  };

  if (!allowed) {
    return (
      <div className={panel}>
        <h1 className="text-xl font-bold">
          Page not found
        </h1>

        <Link
          className="underline"
          href={`/dashboard/${role}`}
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#58796a]">
          TrustHand / {role}
        </p>

        <h1 className="mt-2 text-3xl font-extrabold capitalize">
          {section === "ai"
            ? `${role} AI assistant`
            : section.replaceAll("-", " ")}
        </h1>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-[#e6f4e8] p-4 text-sm text-[#184c3b]"
        >
          {notice}
        </p>
      )}

      {loading && (
        <p className={panel}>
          Loading live TrustHand records...
        </p>
      )}

      {section === "ai" && (
        <TrustAI kind={role} />
      )}

      {/* ADMIN OVERVIEW */}
      {!loading &&
        section === "overview" &&
        role === "admin" &&
        overview && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Customers", overview.customers],
                ["Workers", overview.workers],
                ["Bookings", overview.bookings],
                ["Open bookings", overview.activeBookings],
                [
                  "Pending verification",
                  overview.pendingVerifications,
                ],
                [
                  "Approved workers",
                  overview.approvedWorkers,
                ],
                [
                  "Completed jobs",
                  overview.completedBookings,
                ],
                [
                  "Fees recorded (BDT)",
                  overview.earnedFees,
                ],
              ].map(([label, count]) => (
                <div className={panel} key={label}>
                  <p className="text-sm text-gray-500">
                    {label}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {count}
                  </p>
                </div>
              ))}
            </div>

            <section className={panel}>
              <h2 className="mb-4 text-lg font-bold">
                Recent bookings
              </h2>

              {overview.recentBookings.map((b) => (
                <p
                  className="border-t py-3 text-sm"
                  key={b.id}
                >
                  {b.service} — {b.customer} /
                  {b.worker} — <b>{b.status}</b>
                </p>
              ))}

              <Link
                className="mt-4 inline-block underline"
                href="/dashboard/admin/ai"
              >
                Ask Admin AI to analyze operational
                issues
              </Link>
            </section>
          </>
        )}

      {/* CUSTOMER AND WORKER OVERVIEW */}
      {!loading &&
        section === "overview" &&
        role !== "admin" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className={panel}>
                <p className="text-sm text-gray-500">
                  All my bookings
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {bookings.length}
                </p>
              </div>

              <div className={panel}>
                <p className="text-sm text-gray-500">
                  Active jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    bookings.filter((b) =>
                      [
                        "pending",
                        "confirmed",
                        "in_progress",
                      ].includes(b.status)
                    ).length
                  }
                </p>
              </div>

              <div className={panel}>
                <p className="text-sm text-gray-500">
                  Completed jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    bookings.filter(
                      (b) =>
                        b.status === "completed"
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className={panel}>
              <h2 className="text-xl font-bold">
                Welcome
                {profile ? `, ${profile.name}` : ""}
              </h2>

              <p className="my-3 text-sm text-gray-600">
                See your actual job records and get
                role-specific guidance.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  className={secondary}
                  href={`/dashboard/${role}/bookings`}
                >
                  View jobs
                </Link>

                <Link
                  className={primary}
                  href={`/dashboard/${role}/ai`}
                >
                  Ask{" "}
                  {role === "worker"
                    ? "Worker Copilot"
                    : "Customer Assist"}{" "}
                  AI
                </Link>

                {role === "customer" && (
                  <Link
                    className={secondary}
                    href="/find-workers"
                  >
                    Find a professional
                  </Link>
                )}
              </div>
            </div>

            {role === "worker" &&
              profile?.verificationStatus !==
                "approved" && (
                <p className="rounded-xl bg-amber-50 p-4 text-sm">
                  Your verification status is{" "}
                  <b>
                    {profile?.verificationStatus}
                  </b>
                  . Public search and booking
                  require admin approval.
                </p>
              )}
          </>
        )}

      {/* BOOKINGS */}
      {!loading &&
        section === "bookings" && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              {role === "admin"
                ? "Platform bookings"
                : "Your bookings"}
            </h2>

            {role === "admin" ? (
              rows.length === 0 ? (
                <p>No bookings recorded.</p>
              ) : (
                rows.map((b) => {
                  const r = b as {
                    id: string;
                    customer?: string;
                    worker?: string;
                    service?: string;
                    status: string;
                    scheduledAt?: string;
                  };

                  const transitions:
                    Record<string, string[]> = {
                      pending: [
                        "confirmed",
                        "cancelled",
                      ],
                      confirmed: [
                        "in_progress",
                        "cancelled",
                      ],
                      in_progress: [
                        "completed",
                        "cancelled",
                      ],
                    };

                  const choices = [
                    r.status,
                    ...(transitions[r.status] ?? []),
                  ];

                  return (
                    <div
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-3 border-t py-4 text-sm"
                    >
                      <div>
                        <b>{r.service}</b>

                        <p>
                          {r.customer} → {r.worker}
                        </p>

                        <p>
                          {displayDate(r.scheduledAt)}
                          {" · "}
                          {r.status}
                        </p>
                      </div>

                      <select
                        aria-label={`Change booking ${r.id} status`}
                        className={secondary}
                        disabled={
                          busy ||
                          [
                            "completed",
                            "cancelled",
                          ].includes(r.status)
                        }
                        value={r.status}
                        onChange={(e) =>
                          void action(
                            `/api/admin/bookings/${r.id}`,
                            "PATCH",
                            {
                              status:
                                e.target.value,
                            }
                          )
                        }
                      >
                        {choices
                          .filter(
                            (s, i, a) =>
                              a.indexOf(s) === i
                          )
                          .map((s) => (
                            <option key={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    </div>
                  );
                })
              )
            ) : bookings.length === 0 ? (
              <p>
                No bookings found.{" "}
                {role === "customer"
                  ? "Find a worker to start."
                  : "New assigned jobs will appear here."}
              </p>
            ) : (
              bookings.map((b) => {
                const workerTransitions:
                  Record<string, string[]> = {
                    pending: [
                      "confirmed",
                      "cancelled",
                    ],
                    confirmed: [
                      "in_progress",
                      "cancelled",
                    ],
                    in_progress: ["completed"],
                  };

                const transitions =
                  role === "worker"
                    ? workerTransitions[
                        b.status
                      ] ?? []
                    : role === "customer" &&
                        [
                          "pending",
                          "confirmed",
                        ].includes(b.status)
                      ? ["cancelled"]
                      : [];

                return (
                  <article
                    className="border-t py-4"
                    key={b._id}
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <h3 className="font-bold">
                          {displayName(
                            b.service
                          )}
                        </h3>

                        <p className="text-sm text-gray-600">
                          {role === "worker"
                            ? `Customer: ${displayName(b.customer)}`
                            : `Worker: ${displayName(b.worker)}`}
                        </p>

                        <p className="text-xs text-gray-500">
                          {displayDate(
                            b.scheduledAt
                          )}
                          {" · "}৳{b.amount}
                          {" · "}
                          {b.status}
                        </p>

                        {role === "worker" && (
                          <p className="text-xs text-gray-500">
                            Address: {b.address}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {transitions.map(
                          (status) => (
                            <button
                              key={status}
                              disabled={busy}
                              className={
                                secondary
                              }
                              onClick={() =>
                                void action(
                                  `/api/bookings/${b._id}/status`,
                                  "PATCH",
                                  { status }
                                )
                              }
                            >
                              {status.replaceAll(
                                "_",
                                " "
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {role === "customer" &&
                      b.status ===
                        "completed" && (
                        <Link
                          href="/dashboard/customer/reviews"
                          className="mt-3 inline-block text-sm font-semibold underline"
                        >
                          Review this job
                        </Link>
                      )}
                  </article>
                );
              })
            )}
          </section>
        )}

      {/* PAYMENTS */}
      {!loading &&
        section === "payments" && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Payment records
            </h2>

            {(role === "admin"
              ? rows
              : payments
            ).length === 0 ? (
              <p>No payments recorded.</p>
            ) : (
              (role === "admin"
                ? rows
                : payments
              ).map((value, i) => {
                const item = value as Payment & {
                  id?: string;
                  customer?: string;
                };

                const key =
                  item.id ||
                  item._id ||
                  String(i);

                return (
                  <div
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-4 border-t py-4 text-sm"
                  >
                    <div>
                      <b>৳{item.amount}</b>

                      <span className="ml-2 text-gray-500">
                        {item.status}
                      </span>

                      <p className="text-gray-500">
                        {role === "admin"
                          ? `Customer: ${item.customer || "Unknown"} · Fee: ৳${item.platformFee}`
                          : `Booking: ${
                              typeof item.booking ===
                              "string"
                                ? item.booking.slice(
                                    -6
                                  )
                                : item.booking?._id?.slice(
                                    -6
                                  )
                            }`}
                      </p>
                    </div>

                    {role === "admin" &&
                      [
                        "pending",
                        "paid",
                      ].includes(item.status) && (
                        <button
                          disabled={busy}
                          className={
                            secondary
                          }
                          onClick={() =>
                            void action(
                              `/api/payments/${key}`,
                              "PATCH",
                              {
                                status:
                                  item.status ===
                                  "pending"
                                    ? "paid"
                                    : "refunded",
                              }
                            )
                          }
                        >
                          Mark{" "}
                          {item.status ===
                          "pending"
                            ? "paid"
                            : "refunded"}
                        </button>
                      )}
                  </div>
                );
              })
            )}

            <p className="mt-4 text-xs text-gray-500">
              Payments are manual cash
              records; marking paid does not
              transfer money.
            </p>
          </section>
        )}

      {/* CUSTOMER REVIEWS */}
      {!loading &&
        section === "reviews" &&
        role === "customer" && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              My reviews
            </h2>

            {reviews.map((r) => (
              <div
                className="border-b py-3 text-sm"
                key={r._id}
              >
                ★ {r.rating}/5 —{" "}
                {r.comment || "No comment"}
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="mb-4 text-sm text-gray-500">
                No reviews yet.
              </p>
            )}

            <h3 className="mt-5 font-bold">
              Review a completed booking
            </h3>

            <form
              className="mt-3 grid gap-3 sm:grid-cols-2"
              onSubmit={(
                e: FormEvent<HTMLFormElement>
              ) => {
                e.preventDefault();

                void action(
                  "/api/reviews",
                  "POST",
                  {
                    bookingId:
                      form.bookingId,
                    rating: Number(
                      form.rating || 5
                    ),
                    comment:
                      form.comment || "",
                  }
                );
              }}
            >
              <select
                required
                className={inputStyle}
                value={
                  form.bookingId || ""
                }
                onChange={(e) =>
                  onForm(
                    "bookingId",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Choose completed booking
                </option>

                {bookings
                  .filter(
                    (b) =>
                      b.status ===
                        "completed" &&
                      !reviews.some(
                        (r) =>
                          String(
                            r.booking
                          ) === b._id
                      )
                  )
                  .map((b) => (
                    <option
                      key={b._id}
                      value={b._id}
                    >
                      {displayName(
                        b.service
                      )}
                      {" — "}
                      {displayDate(
                        b.scheduledAt
                      )}
                    </option>
                  ))}
              </select>

              <select
                className={inputStyle}
                value={
                  form.rating || "5"
                }
                onChange={(e) =>
                  onForm(
                    "rating",
                    e.target.value
                  )
                }
              >
                {[5, 4, 3, 2, 1].map(
                  (n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n} stars
                    </option>
                  )
                )}
              </select>

              <textarea
                maxLength={1000}
                placeholder="Share your experience"
                className={`${inputStyle} sm:col-span-2`}
                value={
                  form.comment || ""
                }
                onChange={(e) =>
                  onForm(
                    "comment",
                    e.target.value
                  )
                }
              />

              <button
                disabled={busy}
                className={primary}
              >
                Submit review
              </button>
            </form>
          </section>
        )}

      {/* CUSTOMER / WORKER PROFILE */}
      {!loading &&
        section === "profile" &&
        profile && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Manage profile
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Email: {profile.email}
              {role === "worker" &&
                ` · Verification: ${profile.verificationStatus}`}
            </p>

            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(
                e: FormEvent<HTMLFormElement>
              ) => {
                e.preventDefault();

                const payload =
                  role === "worker"
                    ? {
                        phone:
                          form.phone ??
                          profile.phone ??
                          "",

                        bio:
                          form.bio ??
                          profile.bio ??
                          "",

                        experienceYears:
                          Number(
                            form.experienceYears ??
                              profile.experienceYears ??
                              0
                          ),

                        available:
                          (form.available ??
                            String(
                              profile.available ??
                                true
                            )) === "true",

                        services:
                          selectedServices,
                      }
                    : {
                        name:
                          form.name ??
                          profile.name,

                        phone:
                          form.phone ??
                          profile.phone ??
                          "",
                      };

                void action(
                  role === "worker"
                    ? "/api/workers/me"
                    : "/api/users/me",
                  "PATCH",
                  payload
                );
              }}
            >
              {role === "customer" && (
                <label className="text-sm">
                  Name

                  <input
                    className={
                      inputStyle
                    }
                    value={
                      form.name ??
                      profile.name
                    }
                    onChange={(e) =>
                      onForm(
                        "name",
                        e.target.value
                      )
                    }
                  />
                </label>
              )}

              <label className="text-sm">
                Phone

                <input
                  className={
                    inputStyle
                  }
                  value={
                    form.phone ??
                    profile.phone ??
                    ""
                  }
                  onChange={(e) =>
                    onForm(
                      "phone",
                      e.target.value
                    )
                  }
                />
              </label>

              {role === "worker" && (
                <>
                  <label className="text-sm sm:col-span-2">
                    Professional bio

                    <textarea
                      className={
                        inputStyle
                      }
                      maxLength={1000}
                      value={
                        form.bio ??
                        profile.bio ??
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        onForm(
                          "bio",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="text-sm">
                    Years of experience

                    <input
                      type="number"
                      min="0"
                      max="70"
                      className={
                        inputStyle
                      }
                      value={
                        form.experienceYears ??
                        String(
                          profile.experienceYears ??
                            0
                        )
                      }
                      onChange={(
                        e
                      ) =>
                        onForm(
                          "experienceYears",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="text-sm">
                    Availability

                    <select
                      className={
                        inputStyle
                      }
                      value={
                        form.available ??
                        String(
                          profile.available ??
                            true
                        )
                      }
                      onChange={(
                        e
                      ) =>
                        onForm(
                          "available",
                          e.target.value
                        )
                      }
                    >
                      <option value="true">
                        Available
                      </option>
                      <option value="false">
                        Not available
                      </option>
                    </select>
                  </label>

                  <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-bold">
                      My offered services
                    </legend>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map(
                        (s) => (
                          <label
                            key={s._id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(
                                s._id
                              )}
                              onChange={(
                                e
                              ) =>
                                setSelectedServices(
                                  (
                                    current
                                  ) =>
                                    e.target
                                      .checked
                                      ? [
                                          ...current,
                                          s._id,
                                        ]
                                      : current.filter(
                                          (
                                            id
                                          ) =>
                                            id !==
                                            s._id
                                        )
                                )
                              }
                            />

                            {s.name}
                          </label>
                        )
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Changing services
                      may require admin
                      re-verification.
                    </p>
                  </fieldset>
                </>
              )}

              <div>
                <button
                  disabled={busy}
                  className={
                    primary
                  }
                >
                  Save changes
                </button>
              </div>
            </form>
          </section>
        )}

      {/* ADMIN CUSTOMERS AND WORKERS */}
      {!loading &&
        role === "admin" &&
        [
          "customers",
          "workers",
        ].includes(section) && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              {section === "workers"
                ? "Verify workers"
                : "Manage customers"}
            </h2>

            {rows.length === 0 && (
              <p>No records found.</p>
            )}

            {rows.map((row) => {
              const item =
                row as Person;

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-t py-4 text-sm"
                >
                  <div>
                    <b>
                      {item.name}
                    </b>{" "}

                    <span className="text-gray-500">
                      ({item.email})
                    </span>

                    <p>
                      {item.district ||
                        "Area not set"}
                      {" · "}

                      {section ===
                      "workers"
                        ? item.verificationStatus
                        : item.status}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {section ===
                    "workers" ? (
                      [
                        "approved",
                        "rejected",
                        "pending",
                      ].map((s) => (
                        <button
                          disabled={
                            busy ||
                            item.verificationStatus ===
                              s
                          }
                          key={s}
                          className={
                            secondary
                          }
                          onClick={() =>
                            void action(
                              `/api/admin/workers/${item.id}`,
                              "PATCH",
                              {
                                verificationStatus:
                                  s,
                              }
                            )
                          }
                        >
                          {s}
                        </button>
                      ))
                    ) : (
                      <button
                        disabled={busy}
                        className={
                          secondary
                        }
                        onClick={() =>
                          void action(
                            `/api/admin/users/${item.id}`,
                            "PATCH",
                            {
                              status:
                                item.status ===
                                "active"
                                  ? "suspended"
                                  : "active",
                            }
                          )
                        }
                      >
                        {item.status ===
                        "active"
                          ? "Suspend"
                          : "Activate"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {section === "workers" && (
              <p className="mt-4 text-xs text-gray-500">
                Do not approve from AI
                suggestions alone; verify
                credentials through your
                established human process.
              </p>
            )}
          </section>
        )}

      {/* ADMIN SERVICE MANAGEMENT */}
      {!loading &&
        role === "admin" &&
        section === "services" && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Service catalog
            </h2>

            {services.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between gap-4 border-t py-3 text-sm"
              >
                <div>
                  <b>{s.name}</b>

                  <p className="text-gray-500">
                    {s.category}
                    {" · "}৳
                    {s.basePrice}
                    {" · "}
                    {s.active
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>

                {s.active && (
                  <button
                    disabled={busy}
                    className={
                      secondary
                    }
                    onClick={() =>
                      void action(
                        `/api/services/${s._id}`,
                        "PATCH",
                        {
                          active:
                            false,
                        }
                      )
                    }
                  >
                    Disable
                  </button>
                )}
              </div>
            ))}

            <h3 className="my-4 font-bold">
              Add service
            </h3>

            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();

                void action(
                  "/api/services",
                  "POST",
                  {
                    name:
                      form.serviceName,
                    slug:
                      form.slug,
                    category:
                      form.category,
                    description:
                      form.description ||
                      "",
                    basePrice:
                      Number(
                        form.basePrice
                      ),
                    active:
                      true,
                  }
                );
              }}
            >
              {[
                [
                  "serviceName",
                  "Name",
                ],
                [
                  "slug",
                  "Slug (e.g. ac-repair)",
                ],
                [
                  "category",
                  "Category",
                ],
                [
                  "basePrice",
                  "Base price (BDT)",
                ],
                [
                  "description",
                  "Description",
                ],
              ].map(
                ([
                  key,
                  placeholder,
                ]) => (
                  <input
                    key={key}
                    required={
                      key !==
                      "description"
                    }
                    type={
                      key ===
                      "basePrice"
                        ? "number"
                        : "text"
                    }
                    min={
                      key ===
                      "basePrice"
                        ? "0"
                        : undefined
                    }
                    className={
                      inputStyle
                    }
                    placeholder={
                      placeholder
                    }
                    value={
                      form[key] || ""
                    }
                    onChange={(
                      e
                    ) =>
                      onForm(
                        key,
                        e.target.value
                      )
                    }
                  />
                )
              )}

              <button
                disabled={busy}
                className={primary}
              >
                Create service
              </button>
            </form>
          </section>
        )}

      {/* ADMIN SETTINGS */}
      {!loading &&
        role === "admin" &&
        section === "settings" &&
        settings && (
          <section className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Platform settings
            </h2>

            <form
              className="max-w-xl space-y-4"
              onSubmit={(e) => {
                e.preventDefault();

                void action(
                  "/api/admin/settings",
                  "PUT",
                  {
                    serviceFeePercent:
                      Number(
                        form.serviceFeePercent ??
                          settings.serviceFeePercent
                      ),

                    supportEmail:
                      form.supportEmail ??
                      settings.supportEmail,
                  }
                );
              }}
            >
              <label className="block text-sm">
                Service fee %

                <input
                  className={
                    inputStyle
                  }
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={
                    form.serviceFeePercent ??
                    String(
                      settings.serviceFeePercent
                    )
                  }
                  onChange={(
                    e
                  ) =>
                    onForm(
                      "serviceFeePercent",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="block text-sm">
                Support email

                <input
                  className={
                    inputStyle
                  }
                  type="email"
                  value={
                    form.supportEmail ??
                    settings.supportEmail
                  }
                  onChange={(
                    e
                  ) =>
                    onForm(
                      "supportEmail",
                      e.target.value
                    )
                  }
                />
              </label>

              <button
                disabled={busy}
                className={primary}
              >
                Save settings
              </button>
            </form>
          </section>
        )}
    </div>
  );
}
