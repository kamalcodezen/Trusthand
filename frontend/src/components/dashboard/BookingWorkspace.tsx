
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  apiAuth,
  displayDate,
  displayName,
  type Booking,
} from "@/lib/dashboard-api";

import type {
  UserRole,
} from "@/lib/trusthand-api";

type Quote = {
  amount: number;
  description: string;
  estimatedHours: number;
  offeredAt: string;
  acceptedAt?: string | null;
};

type WorkflowBooking = Booking & {
  quote?: Quote;
  estimatedAmount?: number;
  completionRequestedAt?: string | null;
  cancellationReason?: string;
};

const statuses: Record<string, string> = {
  pending: "Waiting for worker quote",
  quoted: "Quote ready for approval",
  confirmed: "Booking confirmed",
  in_progress: "Work in progress",
  awaiting_completion:
    "Waiting for customer confirmation",
  completed: "Completed",
  cancelled: "Cancelled",
};

const button =
  "rounded-xl bg-[#184c3b] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50";

const secondary =
  "rounded-xl border border-[#b6cdc0] bg-white px-4 py-2.5 text-sm font-semibold text-[#184c3b] disabled:opacity-40";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm";

export default function BookingWorkspace({
  role,
}: {
  role: UserRole;
}) {
  const [items, setItems] =
    useState<WorkflowBooking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busyId, setBusyId] =
    useState("");

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        amount: string;
        description: string;
        estimatedHours: string;
        reason: string;
      }
    >
  >({});

  const load = useCallback(async () => {
    const records =
      await apiAuth<WorkflowBooking[]>(
        "/api/bookings"
      );

    setItems(records);
  }, []);

  useEffect(() => {
    let active = true;

    apiAuth<WorkflowBooking[]>("/api/bookings")
      .then((records) => {
        if (active) {
          setItems(records);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Cannot load bookings"
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
  }, []);


function updateDraft(
  id: string,
  key:
    | "amount"
    | "description"
    | "estimatedHours"
    | "reason",
  value: string
) {
  setDrafts((prev) => {
    const current = prev[id] ?? {
      amount: "",
      description: "",
      estimatedHours: "1",
      reason: "",
    };

    return {
      ...prev,
      [id]: {
        ...current,
        [key]: value,
      },
    };
  });
}


  async function act(
    id: string,
    path: string,
    data: unknown
  ) {
    setBusyId(id);
    setError("");
    setNotice("");

    try {
      await apiAuth(path, {
        method: path.endsWith("/status")
          ? "PATCH"
          : "POST",
        body: JSON.stringify(data),
      });

      await load();

      setNotice(
        "Booking updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Update failed"
      );
    } finally {
      setBusyId("");
    }
  }

  async function submitQuote(
    booking: WorkflowBooking
  ) {
    const draft = drafts[booking._id];

    const amount = Number(draft?.amount);
    const estimatedHours = Number(
      draft?.estimatedHours || "1"
    );

    if (
      !Number.isSafeInteger(amount) ||
      amount < 1 ||
      !draft?.description.trim() ||
      draft.description.trim().length < 8 ||
      !Number.isFinite(estimatedHours) ||
      estimatedHours < 0.5
    ) {
      setError(
        "Enter a valid price, estimated hours and description of at least 8 characters."
      );
      return;
    }

    await act(
      booking._id,
      `/api/bookings/${booking._id}/quote`,
      {
        amount,
        description: draft.description.trim(),
        estimatedHours,
      }
    );
  }

  async function cancel(
    booking: WorkflowBooking
  ) {
    const reason = drafts[
      booking._id
    ]?.reason?.trim();

    if (!reason || reason.length < 4) {
      setError(
        "Write a cancellation reason first."
      );
      return;
    }

    await act(
      booking._id,
      `/api/bookings/${booking._id}/status`,
      {
        status: "cancelled",
        reason,
      }
    );
  }

  if (loading) {
    return (
      <p role="status" className="rounded-xl bg-white p-6">
        Loading booking records...
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#184c3b]">
            {role === "admin"
              ? "Platform bookings"
              : role === "worker"
                ? "Assigned jobs"
                : "My service requests"}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Agree on a quotation before confirming
            the final price.
          </p>
        </div>

        {role === "customer" && (
          <Link className={button} href="/find-workers">
            Find a worker
          </Link>
        )}

        <button
          type="button"
          className={secondary}
          disabled={Boolean(busyId)}
          onClick={() => {
            void load().catch((err) => {
              setError(
                err instanceof Error
                  ? err.message
                  : "Refresh failed"
              );
            });
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
          {notice}
        </p>
      )}

      {items.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
          {role === "customer"
            ? "No requests yet. Choose a worker to get started."
            : "No booking records available."}
        </div>
      )}

      <div className="space-y-4">
        {items.map((booking) => {
          const draft = drafts[booking._id];
          const busy = Boolean(busyId);

          const canCancel =
            (
              role === "customer" &&
              [
                "pending",
                "quoted",
                "confirmed",
              ].includes(booking.status)
            ) ||
            (
              role === "admin" &&
              [
                "pending",
                "quoted",
                "confirmed",
                "in_progress",
                "awaiting_completion",
              ].includes(booking.status)
            );

          const base =
            `/api/bookings/${booking._id}`;

          return (
            <article
              key={booking._id}
              className="space-y-4 rounded-2xl border border-[#e1eae3] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">
                    {displayName(booking.service)}
                  </h3>

                  <p className="text-sm text-slate-600">
                    Customer: {displayName(booking.customer)}
                    {" · "}
                    Worker: {displayName(booking.worker)}
                  </p>

                  <p className="text-sm text-slate-600">
                    Scheduled: {displayDate(booking.scheduledAt)}
                  </p>

                  <p className="text-sm text-slate-600">
                    {booking.address || "Location not provided"}
                  </p>

                  {booking.note && (
                    <p className="text-sm text-slate-700">
                      Issue: {booking.note}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-full bg-[#eaf3eb] px-3 py-1.5 text-xs font-bold text-[#184c3b]">
                    {statuses[booking.status] || booking.status}
                  </span>

                  <p className="mt-2 font-semibold">
                    {booking.amount > 0
                      ? `Agreed: ৳${booking.amount.toLocaleString("en-BD")}`
                      : `Starting estimate: ৳${Number(
                          booking.estimatedAmount || 0
                        ).toLocaleString("en-BD")}`}
                  </p>

                  {booking.amount === 0 && (
                    <p className="text-xs text-slate-500">
                      Not a final price
                    </p>
                  )}
                </div>
              </div>

              {booking.quote && (
                <div className="rounded-xl bg-[#f3f8f4] p-4 text-sm">
                  <p className="font-bold">
                    {booking.status === "pending"
                      ? "Previous quotation (not currently active)"
                      : "Worker quotation"}
                    {" — "}৳{booking.quote.amount.toLocaleString("en-BD")}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap">
                    {booking.quote.description}
                  </p>

                  <p className="mt-1 text-slate-600">
                    Estimated work time: {booking.quote.estimatedHours} hour(s)
                  </p>
                </div>
              )}

              {role === "worker" &&
                ["pending", "quoted"].includes(booking.status) && (
                  <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-3">
                    <label className="text-sm font-medium">
                      Your price (BDT)
                      <input
                        className={`${field} mt-1`}
                        type="number"
                        min="1"
                        step="1"
                        value={draft?.amount ?? ""}
                        onChange={(e) =>
                          updateDraft(
                            booking._id,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 1200"
                      />
                    </label>

                    <label className="text-sm font-medium">
                      Hours needed
                      <input
                        className={`${field} mt-1`}
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={draft?.estimatedHours ?? "1"}
                        onChange={(e) =>
                          updateDraft(
                            booking._id,
                            "estimatedHours",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label className="text-sm font-medium sm:col-span-3">
                      Scope & materials
                      <textarea
                        className={`${field} mt-1`}
                        rows={2}
                        maxLength={1000}
                        value={draft?.description ?? ""}
                        onChange={(e) =>
                          updateDraft(
                            booking._id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe what your quote includes"
                      />
                    </label>

                    <button
                      className={`${button} sm:col-span-3`}
                      disabled={busy}
                      type="button"
                      onClick={() =>
                        void submitQuote(booking)
                      }
                    >
                      {booking.status === "quoted"
                        ? "Revise quotation"
                        : "Send quotation"}
                    </button>
                  </div>
                )}

              <div className="flex flex-wrap gap-2">
                {role === "customer" &&
                  booking.status === "quoted" && (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        className={button}
                        onClick={() =>
                          void act(
                            booking._id,
                            `${base}/quote/respond`,
                            { decision: "accept" }
                          )
                        }
                      >
                        Accept quote & confirm
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        className={secondary}
                        onClick={() =>
                          void act(
                            booking._id,
                            `${base}/quote/respond`,
                            { decision: "decline" }
                          )
                        }
                      >
                        Ask for a new quote
                      </button>
                    </>
                  )}

                {role === "worker" &&
                  booking.status === "confirmed" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={button}
                      onClick={() =>
                        void act(
                          booking._id,
                          `${base}/status`,
                          { status: "in_progress" }
                        )
                      }
                    >
                      Start job
                    </button>
                  )}

                {role === "worker" &&
                  booking.status === "in_progress" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={button}
                      onClick={() =>
                        void act(
                          booking._id,
                          `${base}/status`,
                          { status: "awaiting_completion" }
                        )
                      }
                    >
                      Request completion confirmation
                    </button>
                  )}

                {role === "customer" &&
                  booking.status === "awaiting_completion" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={button}
                      onClick={() =>
                        void act(
                          booking._id,
                          `${base}/status`,
                          { status: "completed" }
                        )
                      }
                    >
                      Confirm work is completed
                    </button>
                  )}
              </div>

              {canCancel && (
                <div className="flex flex-wrap items-end gap-2 border-t pt-3">
                  <label className="min-w-[240px] flex-1 text-sm">
                    Reason for cancellation
                    <input
                      className={`${field} mt-1`}
                      maxLength={500}
                      value={draft?.reason ?? ""}
                      onChange={(e) =>
                        updateDraft(
                          booking._id,
                          "reason",
                          e.target.value
                        )
                      }
                      placeholder="Brief reason"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={busy}
                    className={secondary}
                    onClick={() =>
                      void cancel(booking)
                    }
                  >
                    Cancel booking
                  </button>
                </div>
              )}

              {booking.status === "cancelled" &&
                booking.cancellationReason && (
                  <p className="text-sm text-slate-600">
                    Cancellation reason: {booking.cancellationReason}
                  </p>
                )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
