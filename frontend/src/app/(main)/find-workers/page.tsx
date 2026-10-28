
"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import {
  apiJson,
} from "@/lib/trusthand-api";

import type {
  Service,
  Worker,
} from "@/lib/dashboard-api";

function Directory() {
  const params = useSearchParams();

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [services, setServices] =
    useState<Service[]>([]);

  const [service, setService] = useState(
    params.get("service") || ""
  );

  const [search, setSearch] = useState("");
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<Service[]>("/api/services")
      .then(setServices)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;

    const qs = new URLSearchParams();

    if (service) {
      qs.set("service", service);
    }

    if (search.trim()) {
      qs.set("search", search.trim());
    }

    if (available) {
      qs.set("available", "true");
    }

    const timer = setTimeout(() => {
      if (!active) return;

      setLoading(true);
      setError("");

      apiJson<Worker[]>(
        `/api/workers?${qs}`
      )
        .then((result) => {
          if (active) setWorkers(result);
        })
        .catch((err) => {
          if (active) {
            setError(
              err instanceof Error
                ? err.message
                : "Search failed"
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [service, search, available]);

  return (
    <main className="min-h-[65vh] bg-[#f7faf8] px-5 py-14 text-[#183e30]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold">
          Find local workers
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Browse admin-approved database profiles. Demo workers are clearly labeled and are not identity-verified.
        </p>

        <div className="my-8 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-3">
          <input
            aria-label="Search worker names"
            className="rounded-xl border p-3 text-sm"
            placeholder="Search name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            aria-label="Filter services"
            className="rounded-xl border p-3 text-sm"
            value={service}
            onChange={(e) =>
              setService(e.target.value)
            }
          >
            <option value="">
              All services
            </option>

            {services.map((s) => (
              <option
                key={s._id}
                value={s._id}
              >
                {s.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) =>
                setAvailable(e.target.checked)
              }
            />

            Available now (profile status)
          </label>
        </div>

        {loading && (
          <p>Loading workers...</p>
        )}

        {error && (
          <p
            role="alert"
            className="text-red-700"
          >
            {error}
          </p>
        )}

        {!loading &&
          workers.length === 0 &&
          !error && (
            <p>
              No approved workers match your filters.
            </p>
          )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => (
            <article
              key={w._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1c7046]">
                  {w.isDemo ? "DEMO PROFILE — Not verified" : "Admin-approved profile"}
                </span>

                <span className="text-xs text-gray-500">
                  {w.available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <h2 className="text-xl font-bold">
                {w.name}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {w.area ||
                  w.district ||
                  "Area not specified"}
                {" · "}
                {w.experienceYears || 0}
                {" years' experience"}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {w.services
                  ?.map((s) => s.name)
                  .join(", ") ||
                  "No services added"}
              </p>

              <p className="mt-4 text-xs text-gray-500">
                {w.reviewCount ?? 0} reviews
                {" · "}
                {w.completedJobs ?? 0}
                {" completed jobs"}
              </p>

              <Link
                href={`/find-workers/${w._id}`}
                className="mt-5 inline-block rounded-xl bg-[#184C3B] px-5 py-3 text-sm font-bold text-white"
              >
                View profile & request
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function FindWorkersPage() {
  return (
    <Suspense
      fallback={
        <p className="p-10">
          Loading workers...
        </p>
      }
    >
      <Directory />
    </Suspense>
  );
}
