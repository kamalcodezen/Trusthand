
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Link from "next/link";
import { apiJson } from "@/lib/trusthand-api";

import {
  apiAuth,
  type Worker,
} from "@/lib/dashboard-api";

export default function WorkerDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const router = useRouter();

  const [worker, setWorker] =
    useState<Worker | null>(null);

  const [serviceId, setServiceId] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [note, setNote] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    apiJson<Worker>(
      `/api/workers/${encodeURIComponent(id)}`
    )
      .then((w) => {
        setWorker(w);
        setServiceId(
          w.services?.[0]?._id || ""
        );
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : "Unable to load worker"
        );
      });
  }, [id]);

  async function book(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (
      !serviceId ||
      !address.trim() ||
      !scheduledAt
    ) {
      setError(
        "Choose service, address and preferred schedule."
      );
      return;
    }

    const date = new Date(scheduledAt);

    if (
      Number.isNaN(date.getTime()) ||
      date.getTime() <
        Date.now() + 15 * 60000
    ) {
      setError(
        "Choose a schedule at least 15 minutes in the future."
      );
      return;
    }

    setLoading(true);

    try {
      const me = await apiJson<{
        role: string;
      }>("/api/auth/me");

      if (me.role !== "customer") {
        setError(
          "Only customer accounts may request jobs."
        );
        return;
      }

      await apiAuth("/api/bookings", {
        method: "POST",

        body: JSON.stringify({
          workerId: id,
          serviceId,
          address,
          scheduledAt: date.toISOString(),
          note,
        }),
      });

      router.push(
        "/dashboard/customer/bookings"
      );
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Request failed";

      if (
        /login required|session invalid|HTTP 401/i
          .test(message)
      ) {
        router.push("/login");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[60vh] bg-[#f7faf8] px-5 py-14 text-[#153a2c]">
      <div className="mx-auto max-w-5xl">
        <Link
          className="text-sm underline"
          href="/find-workers"
        >
          ← All workers
        </Link>

        {error && (
          <p
            role="alert"
            className="my-5 rounded-xl bg-red-50 p-4 text-red-800"
          >
            {error}
          </p>
        )}

        {!worker && !error && (
          <p className="mt-5">
            Loading worker profile...
          </p>
        )}

        {worker && (
          <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <section className="rounded-2xl border bg-white p-7 shadow-sm">
              <h1 className="text-3xl font-extrabold">
                {worker.name}
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                {worker.district}
                {" "}
                {worker.area &&
                  `· ${worker.area}`}
                {" · "}
                {worker.experienceYears ?? 0}
                {" years' experience"}
              </p>

              <p className="mt-3 text-xs font-bold text-green-700">
                {worker.isDemo
                  ? "DEMO PROFILE — Fictional worker, not verified"
                  : "Admin-reviewed profile"}
                {" · "}
                {worker.available
                  ? "Available"
                  : "Not currently available"}
              </p>

              <h2 className="mt-7 text-lg font-bold">
                About
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                {worker.bio ||
                  "No biography added."}
              </p>

              <h2 className="mt-7 text-lg font-bold">
                Offered services
              </h2>

              <div className="mt-2 space-y-3">
                {worker.services?.map(
                  (s) => (
                    <p
                      key={s._id}
                      className="rounded-xl bg-[#f3f7f4] p-3 text-sm"
                    >
                      {s.name}
                      {" — "}
                      {s.category}
                    </p>
                  )
                )}
              </div>

              <p className="mt-6 text-xs text-gray-500">
                {worker.reviewCount ?? 0}
                {" reviews · "}
                {worker.completedJobs ?? 0}
                {" completed jobs. "}
                Approval is not a safety guarantee.
              </p>
            </section>

            <section className="h-fit rounded-2xl border bg-white p-7 shadow-sm">
              <h2 className="text-xl font-extrabold">
                Request a booking
              </h2>

              <p className="my-3 text-sm text-gray-600">
                Use your customer account to
                request a future visit. The
                final agreed scope may differ.
              </p>

              <form
                onSubmit={book}
                className="space-y-4"
              >
                <label className="block text-sm">
                  Service

                  <select
                    required
                    value={serviceId}
                    onChange={(e) =>
                      setServiceId(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  >
                    {worker.services?.map(
                      (s) => (
                        <option
                          key={s._id}
                          value={s._id}
                        >
                          {s.name}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="block text-sm">
                  Service address

                  <textarea
                    required
                    minLength={5}
                    maxLength={500}
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="block text-sm">
                  Preferred date & time

                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) =>
                      setScheduledAt(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <label className="block text-sm">
                  Notes (optional)

                  <textarea
                    maxLength={1000}
                    value={note}
                    onChange={(e) =>
                      setNote(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border p-3"
                  />
                </label>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !worker.available ||
                    !worker.services?.length
                  }
                  className="w-full rounded-xl bg-[#184C3B] p-3 font-bold text-white disabled:opacity-50"
                >
                  {loading
                    ? "Creating booking..."
                    : "Request booking"}
                </button>

                <p className="text-xs text-gray-500">
                  This sends a request only. The
                  worker will send a quotation for
                  your approval. No payment is
                  charged at this stage.
                </p>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
