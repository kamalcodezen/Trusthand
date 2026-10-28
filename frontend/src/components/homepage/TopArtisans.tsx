
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { apiJson } from "@/lib/trusthand-api";
import type { Worker } from "@/lib/dashboard-api";

export default function TopArtisans() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiJson<Worker[]>("/api/workers")
      .then((data) => {
        if (active) setWorkers(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load workers."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featured = workers
    .filter(
      (worker) =>
        worker.name?.trim() &&
        worker.services?.length > 0
    )
    .sort((a, b) => {
      const ratingDifference =
        (b.rating ?? 0) - (a.rating ?? 0);

      return ratingDifference ||
        (b.completedJobs ?? 0) -
          (a.completedJobs ?? 0);
    })
    .slice(0, 4);

  return (
    <section className="bg-[#FAF9F5] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full global-pos">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#245B46]">
              Local professionals
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1B2A23]">
              Find skilled hands near you.
            </h2>
          </div>

          <Link
            href="/find-workers"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#245B46]"
          >
            Explore all workers
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading && (
          <p role="status">Loading worker profiles...</p>
        )}

        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && featured.length === 0 && (
          <p className="rounded-xl border bg-white p-6 text-sm">
            No complete, approved worker profiles are
            available. Worker profiles will appear after
            registration, profile completion and approval.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((worker) => (
            <article
              key={worker._id}
              className="flex flex-col rounded-2xl border border-[#E6E7E3] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E5EFE6] font-bold text-[#245B46]">
                  {worker.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-[#1B2A23]">
                    {worker.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {worker.area || worker.district}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#245B46]">
                {worker.isDemo
                  ? "DEMO PROFILE — Not independently verified"
                  : "Admin-approved profile"}
              </p>

              {worker.bio?.trim() && (
                <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                  {worker.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {worker.services.map((service) => (
                  <span
                    key={service._id}
                    className="rounded-full bg-[#E5EFE6] px-3 py-1 text-xs text-[#245B46]"
                  >
                    {service.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-6">
                {Boolean(worker.reviewCount) && (
                  <p className="mb-3 flex items-center gap-1 text-sm">
                    <Star
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />
                    {(worker.rating ?? 0).toFixed(1)}
                    <span className="text-gray-500">
                      ({worker.reviewCount} reviews)
                    </span>
                  </p>
                )}

                {(worker.startingPrice ?? 0) > 0 && (
                  <p className="mb-3 text-sm font-semibold">
                    Starting price: ৳
                    {worker.startingPrice?.toLocaleString("en-BD")}
                  </p>
                )}

                <Link
                  href={`/find-workers/${worker._id}`}
                  className="block rounded-xl bg-[#245B46] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  View profile & request
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
