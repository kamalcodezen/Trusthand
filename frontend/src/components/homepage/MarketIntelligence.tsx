
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/trusthand-api";
import type { Service } from "@/lib/dashboard-api";

export default function MarketIntelligence() {
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiJson<Service[]>("/api/services")
      .then((items) => {
        if (!active) return;

        setServices(items);
        if (items.length) setSelected(items[0]._id);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Pricing data could not be loaded."
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

  const service = services.find(
    (item) => item._id === selected
  );

  return (
    <section className="bg-[#FAF9F5] px-5 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#245B46]">
            Pricing guidance
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-[#1B2A23]">
            Understand the starting price.
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            Browse current starting prices from the
            TrustHand service catalog. These are indicative
            base prices, not final worker quotations or
            calculated neighborhood market averages.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-7 shadow-sm">
          {loading && (
            <p role="status">Loading current catalog...</p>
          )}

          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && !service && (
            <p>
              No active pricing records are available.
              Configure the service catalog first.
            </p>
          )}

          {service && (
            <>
              <label className="block text-sm font-semibold">
                Select a service
                <select
                  className="mt-2 w-full rounded-xl border p-3"
                  value={selected}
                  onChange={(event) =>
                    setSelected(event.target.value)
                  }
                >
                  {services.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-6 rounded-2xl bg-[#184C3B] p-6 text-white">
                <p className="text-xs uppercase tracking-wider text-[#B8D4C6]">
                  Catalog starting price
                </p>

                <p className="mt-2 text-3xl font-extrabold">
                  {service.basePrice > 0
                    ? `৳${service.basePrice.toLocaleString("en-BD")}`
                    : "Quotation required"}
                </p>

                <p className="mt-2 text-xs text-[#D1E5DA]">
                  {service.name}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                Final price depends on the worker's
                quotation and the customer's acceptance.
                No payment is charged by this preview.
              </p>

              <Link
                href={`/find-workers?service=${service._id}`}
                className="mt-5 inline-block rounded-xl bg-[#245B46] px-5 py-3 text-sm font-bold text-white"
              >
                Find professionals
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
