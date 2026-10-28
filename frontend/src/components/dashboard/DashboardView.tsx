
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import TrustAI from "@/components/ai/TrustAI";
import BookingWorkspace from "@/components/dashboard/BookingWorkspace";
import type { UserRole } from "@/lib/trusthand-api";

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

const allowed: Record<UserRole, string[]> = {
  customer: [
    "overview", "bookings", "payments",
    "reviews", "profile", "ai",
  ],
  worker: [
    "overview", "bookings", "payments",
    "profile", "ai",
  ],
  admin: [
    "overview", "customers", "workers",
    "bookings", "payments", "services",
    "settings", "ai",
  ],
};

const panel =
  "rounded-2xl border border-[#e0e8e2] bg-white p-5 shadow-sm";

const input =
  "w-full rounded-xl border border-[#dbe5dd] bg-white p-3 text-sm";

const button =
  "rounded-xl bg-[#184c3b] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50";

const outline =
  "rounded-xl border border-[#b6cdc0] bg-white px-3 py-2 text-sm font-semibold text-[#184c3b] disabled:opacity-40";

type Review = {
  _id: string;
  booking: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

type AdminPayment = {
  id: string;
  customer: string;
  amount: number;
  platformFee: number;
  status: string;
  paidAt?: string;
};

type Settings = {
  serviceFeePercent: number;
  supportEmail: string;
};

export default function DashboardView({
  role,
  section,
}: {
  role: UserRole;
  section: string;
}) {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [adminPayments, setAdminPayments] =
    useState<AdminPayment[]>([]);

  const [people, setPeople] =
    useState<Person[]>([]);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [services, setServices] =
    useState<Service[]>([]);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [overview, setOverview] =
    useState<Overview | null>(null);

  const [settings, setSettings] =
    useState<Settings | null>(null);

  const [form, setForm] =
    useState<Record<string, string>>({});

  const [selectedServices, setSelectedServices] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [reload, setReload] =
    useState(0);

  const valid = allowed[role].includes(section);

  const setField = (
    key: string,
    value: string
  ) => {
    setForm((v) => ({
      ...v,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (
      !valid ||
      section === "bookings" ||
      section === "ai"
    ) {
      setLoading(false);
      return;
    }

    let active = true;

    setLoading(true);
    setError("");

    const read = async () => {
      if (role === "admin") {
        if (section === "overview") {
          const value = await apiAuth<Overview>(
            "/api/admin/overview"
          );

          if (active) {
            setOverview(value);
          }
        } else if (section === "settings") {
          const value = await apiAuth<Settings>(
            "/api/admin/settings"
          );

          if (active) {
            setSettings(value);
          }
        } else if (section === "services") {
          const value = await apiAuth<Service[]>(
            "/api/services?all=true"
          );

          if (active) {
            setServices(value);
          }
        } else if (section === "payments") {
          const value =
            await apiAuth<AdminPayment[]>(
              "/api/admin/payments"
            );

          if (active) {
            setAdminPayments(value);
          }
        } else if (
          section === "customers" ||
          section === "workers"
        ) {
          const path =
            section === "customers"
              ? "users"
              : "workers";

          const value =
            await apiAuth<Person[]>(
              `/api/admin/${path}`
            );

          if (active) {
            setPeople(value);
          }
        }
      } else {
        if (
          section === "overview" ||
          section === "reviews"
        ) {
          const value =
            await apiAuth<Booking[]>(
              "/api/bookings"
            );

          if (active) {
            setBookings(value);
          }
        }

        if (
          section === "overview" ||
          section === "payments"
        ) {
          const value =
            await apiAuth<Payment[]>(
              "/api/payments"
            );

          if (active) {
            setPayments(value);
          }
        }

        if (
          section === "profile" ||
          section === "overview"
        ) {
          const value =
            await apiAuth<Profile>(
              role === "worker"
                ? "/api/workers/me"
                : "/api/auth/me"
            );

          if (active) {
            setProfile(value);

            setSelectedServices(
              (value.services || []).map(
                (s) => s._id
              )
            );
          }
        }

        if (
          section === "profile" &&
          role === "worker"
        ) {
          const value =
            await apiAuth<Service[]>(
              "/api/services"
            );

          if (active) {
            setServices(value);
          }
        }

        if (section === "reviews") {
          const value =
            await apiAuth<Review[]>(
              "/api/reviews/mine"
            );

          if (active) {
            setReviews(value);
          }
        }
      }
    };

    void read()
      .catch((e) => {
        if (active) {
          setError(
            e instanceof Error
              ? e.message
              : "Loading failed"
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [role, section, valid, reload]);

  async function act(
    path: string,
    method: "POST" | "PATCH" | "PUT",
    payload: unknown
  ) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await apiAuth(
        path,
        method === "POST"
          ? postJSON(payload)
          : method === "PUT"
            ? putJSON(payload)
            : patchJSON(payload)
      );

      setNotice("Saved successfully.");
      setReload((x) => x + 1);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Update failed"
      );
    } finally {
      setBusy(false);
    }
  }

  if (!valid) {
    return (
      <div className={panel}>
        Page not found.{" "}
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
    <div className="mx-auto max-w-6xl space-y-6 text-[#16382d]">
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
          className="rounded-xl bg-[#e6f4e8] p-4 text-sm"
        >
          {notice}
        </p>
      )}

      {loading && (
        <div className={panel}>
          Loading TrustHand records...
        </div>
      )}

      {section === "ai" && (
        <TrustAI kind={role} />
      )}

      {section === "bookings" && (
        <BookingWorkspace role={role} />
      )}

      {!loading &&
        section === "overview" &&
        role === "admin" &&
        overview && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                ["Customers", overview.customers],
                ["Workers", overview.workers],
                ["Bookings", overview.bookings],
                ["Open bookings", overview.activeBookings],
                [
                  "Pending worker reviews",
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
                  "Recorded fees (BDT)",
                  overview.earnedFees,
                ],
              ] as const).map(([name, count]) => (
                <div className={panel} key={name}>
                  <p className="text-sm text-gray-500">
                    {name}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {count}
                  </p>
                </div>
              ))}
            </div>

            <div className={panel}>
              <h2 className="mb-3 text-lg font-bold">
                Recent bookings
              </h2>

              {overview.recentBookings.map((b) => (
                <p
                  key={b.id}
                  className="border-t py-3 text-sm"
                >
                  {b.service} — {b.customer} /
                  {b.worker} — <b>{b.status}</b>
                </p>
              ))}

              <Link
                className="underline"
                href="/dashboard/admin/bookings"
              >
                Manage bookings
              </Link>
            </div>
          </>
        )}

      {!loading &&
        section === "overview" &&
        role !== "admin" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {([
                ["All bookings", bookings.length],
                [
                  "Active",
                  bookings.filter((b) =>
                    [
                      "pending",
                      "quoted",
                      "confirmed",
                      "in_progress",
                      "awaiting_completion",
                    ].includes(b.status)
                  ).length,
                ],
                [
                  "Completed",
                  bookings.filter(
                    (b) => b.status === "completed"
                  ).length,
                ],
              ] as const).map(([name, count]) => (
                <div key={name} className={panel}>
                  <p className="text-sm text-gray-500">
                    {name}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {count}
                  </p>
                </div>
              ))}
            </div>

            <div className={panel}>
              <h2 className="text-xl font-bold">
                Welcome
                {profile ? `, ${profile.name}` : ""}
              </h2>

              <p className="my-3 text-sm text-gray-600">
                Follow your jobs and payment records.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  className={button}
                  href={`/dashboard/${role}/bookings`}
                >
                  View jobs
                </Link>

                <Link
                  className={outline}
                  href={`/dashboard/${role}/ai`}
                >
                  Ask AI assistant
                </Link>

                {role === "customer" && (
                  <Link
                    className={outline}
                    href="/find-workers"
                  >
                    Find workers
                  </Link>
                )}
              </div>
            </div>

            {role === "worker" &&
              profile?.verificationStatus !==
                "approved" && (
                <p className="rounded-xl bg-amber-50 p-4">
                  Worker approval pending. You cannot
                  receive public booking requests yet.
                </p>
              )}
          </>
        )}

      {!loading &&
        section === "payments" && (
          <div className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Cash / manual payment records
            </h2>

            {(role === "admin"
              ? adminPayments
              : payments
            ).length === 0 && (
              <p className="text-sm">
                No payment records yet.
              </p>
            )}

            {(role === "admin"
              ? adminPayments
              : payments
            ).map((p, i) => {
              const value =
                p as Payment & AdminPayment;

              const key =
                value.id ||
                value._id ||
                String(i);

              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 border-t py-4 text-sm"
                >
                  <div>
                    <b>
                      ৳{value.amount?.toLocaleString("en-BD")}
                    </b>
                    {" · "}
                    {value.status}

                    <p className="text-xs text-gray-500">
                      {role === "admin"
                        ? `Customer: ${value.customer || "Unknown"} · Fee: ৳${value.platformFee}`
                        : `Booking: ${
                            typeof value.booking === "string"
                              ? value.booking.slice(-6)
                              : value.booking?._id?.slice(-6)
                          }`}
                    </p>
                  </div>

                  {role === "admin" &&
                    ["pending", "paid"].includes(
                      value.status
                    ) && (
                      <button
                        className={outline}
                        disabled={busy}
                        onClick={() =>
                          void act(
                            `/api/payments/${key}`,
                            "PATCH",
                            {
                              status:
                                value.status === "pending"
                                  ? "paid"
                                  : "refunded",
                            }
                          )
                        }
                      >
                        {value.status === "pending"
                          ? "Mark cash as received"
                          : "Record manual refund"}
                      </button>
                    )}
                </div>
              );
            })}

            <p className="mt-3 text-xs text-gray-500">
              These are bookkeeping records.
              No wallet or bank transfer is
              made by TrustHand.
            </p>
          </div>
        )}

      {!loading &&
        role === "customer" &&
        section === "reviews" && (
          <div className={panel}>
            <h2 className="mb-3 text-xl font-bold">
              My reviews
            </h2>

            {reviews.map((r) => (
              <p
                key={r._id}
                className="border-b py-3 text-sm"
              >
                ★ {r.rating}/5 —{" "}
                {r.comment || "No comment"}
              </p>
            ))}

            {!reviews.length && (
              <p className="text-sm text-gray-500">
                You have not left a review.
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

                void act("/api/reviews", "POST", {
                  bookingId: form.bookingId,
                  rating: Number(form.rating || 5),
                  comment: form.comment || "",
                });
              }}
            >
              <select
                required
                className={input}
                value={form.bookingId || ""}
                onChange={(e) =>
                  setField(
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
                      b.status === "completed" &&
                      !reviews.some(
                        (r) =>
                          String(r.booking) === b._id
                      )
                  )
                  .map((b) => (
                    <option
                      key={b._id}
                      value={b._id}
                    >
                      {displayName(b.service)}
                      {" — "}
                      {displayDate(b.scheduledAt)}
                    </option>
                  ))}
              </select>

              <select
                className={input}
                value={form.rating || "5"}
                onChange={(e) =>
                  setField(
                    "rating",
                    e.target.value
                  )
                }
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>

              <textarea
                className={`${input} sm:col-span-2`}
                maxLength={1000}
                placeholder="Share your experience"
                value={form.comment || ""}
                onChange={(e) =>
                  setField(
                    "comment",
                    e.target.value
                  )
                }
              />

              <button
                disabled={busy}
                className={button}
              >
                Submit review
              </button>
            </form>
          </div>
        )}

      {!loading &&
        section === "profile" &&
        role !== "admin" &&
        profile && (
          <div className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Manage profile
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Email: {profile.email}
              {role === "worker" &&
                ` · Review: ${profile.verificationStatus}`}
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
                        experienceYears: Number(
                          form.experienceYears ??
                            profile.experienceYears ??
                            0
                        ),
                        available:
                          (
                            form.available ??
                            String(
                              profile.available ?? true
                            )
                          ) === "true",
                        services: selectedServices,
                      }
                    : {
                        name:
                          form.name ?? profile.name,
                        phone:
                          form.phone ??
                          profile.phone ??
                          "",
                      };

                void act(
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
                    className={input}
                    value={
                      form.name ?? profile.name
                    }
                    onChange={(e) =>
                      setField(
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
                  className={input}
                  value={
                    form.phone ??
                    profile.phone ??
                    ""
                  }
                  onChange={(e) =>
                    setField(
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
                      className={input}
                      maxLength={1000}
                      value={
                        form.bio ??
                        profile.bio ??
                        ""
                      }
                      onChange={(e) =>
                        setField(
                          "bio",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="text-sm">
                    Years of experience
                    <input
                      className={input}
                      type="number"
                      min="0"
                      max="70"
                      value={
                        form.experienceYears ??
                        String(
                          profile.experienceYears ?? 0
                        )
                      }
                      onChange={(e) =>
                        setField(
                          "experienceYears",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label className="text-sm">
                    Availability
                    <select
                      className={input}
                      value={
                        form.available ??
                        String(
                          profile.available ?? true
                        )
                      }
                      onChange={(e) =>
                        setField(
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
                      Offered services
                    </legend>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map((s) => (
                        <label
                          className="flex gap-2 text-sm"
                          key={s._id}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(
                              s._id
                            )}
                            onChange={(e) =>
                              setSelectedServices(
                                (current) =>
                                  e.target.checked
                                    ? [
                                        ...current,
                                        s._id,
                                      ]
                                    : current.filter(
                                        (id) =>
                                          id !== s._id
                                      )
                              )
                            }
                          />
                          {s.name}
                        </label>
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Service changes may require
                      admin review.
                    </p>
                  </fieldset>
                </>
              )}

              <div>
                <button
                  disabled={busy}
                  className={button}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        )}

      {!loading &&
        role === "admin" &&
        (
          section === "customers" ||
          section === "workers"
        ) && (
          <div className={panel}>
            <h2 className="mb-3 text-xl font-bold">
              {section === "workers"
                ? "Review worker applications"
                : "Manage customers"}
            </h2>

            {!people.length && (
              <p>No records found.</p>
            )}

            {people.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 border-t py-4 text-sm"
              >
                <div>
                  <b>{p.name}</b>
                  {" ("}
                  {p.email}
                  {")"}

                  <p className="text-xs text-gray-500">
                    {p.district || "Area not set"}
                    {" · "}
                    {section === "workers"
                      ? p.verificationStatus
                      : p.status}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {section === "workers" ? (
                    [
                      "approved",
                      "rejected",
                      "pending",
                    ].map((v) => (
                      <button
                        key={v}
                        className={outline}
                        disabled={
                          busy ||
                          p.verificationStatus === v
                        }
                        onClick={() =>
                          void act(
                            `/api/admin/workers/${p.id}`,
                            "PATCH",
                            {
                              verificationStatus: v,
                            }
                          )
                        }
                      >
                        {v}
                      </button>
                    ))
                  ) : (
                    <button
                      className={outline}
                      disabled={busy}
                      onClick={() =>
                        void act(
                          `/api/admin/users/${p.id}`,
                          "PATCH",
                          {
                            status:
                              p.status === "active"
                                ? "suspended"
                                : "active",
                          }
                        )
                      }
                    >
                      {p.status === "active"
                        ? "Suspend"
                        : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {section === "workers" && (
              <p className="mt-4 text-xs text-gray-500">
                Check credentials manually.
                AI suggestions do not establish
                identity verification.
              </p>
            )}
          </div>
        )}

      {!loading &&
        role === "admin" &&
        section === "services" && (
          <div className={panel}>
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
                    {" · ৳"}
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
                    className={outline}
                    onClick={() =>
                      void act(
                        `/api/services/${s._id}`,
                        "PATCH",
                        {
                          active: false,
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
              onSubmit={(
                e: FormEvent<HTMLFormElement>
              ) => {
                e.preventDefault();

                void act(
                  "/api/services",
                  "POST",
                  {
                    name: form.serviceName,
                    slug: form.slug,
                    category: form.category,
                    description:
                      form.description || "",
                    basePrice: Number(
                      form.basePrice
                    ),
                    active: true,
                  }
                );
              }}
            >
              {([
                ["serviceName", "Name"],
                ["slug", "Slug (e.g. ac-repair)"],
                ["category", "Category"],
                ["basePrice", "Base price (BDT)"],
                ["description", "Description"],
              ] as const).map(
                ([key, placeholder]) => (
                  <input
                    key={key}
                    className={input}
                    placeholder={placeholder}
                    required={
                      key !== "description"
                    }
                    type={
                      key === "basePrice"
                        ? "number"
                        : "text"
                    }
                    min={
                      key === "basePrice"
                        ? "0"
                        : undefined
                    }
                    value={form[key] || ""}
                    onChange={(e) =>
                      setField(
                        key,
                        e.target.value
                      )
                    }
                  />
                )
              )}

              <button
                disabled={busy}
                className={button}
              >
                Create service
              </button>
            </form>
          </div>
        )}

      {!loading &&
        role === "admin" &&
        section === "settings" &&
        settings && (
          <div className={panel}>
            <h2 className="mb-4 text-xl font-bold">
              Platform settings
            </h2>

            <form
              className="max-w-xl space-y-4"
              onSubmit={(
                e: FormEvent<HTMLFormElement>
              ) => {
                e.preventDefault();

                void act(
                  "/api/admin/settings",
                  "PUT",
                  {
                    serviceFeePercent: Number(
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
                  className={input}
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
                  onChange={(e) =>
                    setField(
                      "serviceFeePercent",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="block text-sm">
                Support email

                <input
                  className={input}
                  type="email"
                  value={
                    form.supportEmail ??
                    settings.supportEmail
                  }
                  onChange={(e) =>
                    setField(
                      "supportEmail",
                      e.target.value
                    )
                  }
                />
              </label>

              <button
                disabled={busy}
                className={button}
              >
                Save settings
              </button>
            </form>
          </div>
        )}
    </div>
  );
}
