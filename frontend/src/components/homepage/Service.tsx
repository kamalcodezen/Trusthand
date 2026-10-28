
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { apiJson } from "@/lib/trusthand-api";
import type { Service as ServiceType } from "@/lib/dashboard-api";

export default function Service() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiJson<ServiceType[]>("/api/services")
      .then((data) => {
        if (active) setServices(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Services could not be loaded."
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

  return (
    <section
      id="services"
      className="bg-[#F4F2EE] px-5 py-20 text-[#1B2A23]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#245B46]">
              Our services
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Services for your home.
            </h2>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-2 text-sm font-bold text-[#245B46]"
          >
            View all services
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading && (
          <p className="mt-8" role="status">
            Loading service catalog...
          </p>
        )}

        {error && (
          <p className="mt-8 text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="mt-8 rounded-xl border bg-white p-6">
            No active services are configured. Add services
            through the existing admin catalog or run the
            initial service seed.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <article
              key={service._id}
              className="flex min-h-52 flex-col rounded-2xl border border-[#E6E7E3] bg-[#FAF9F5] p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#E5EFE6] text-[#245B46]">
                <Wrench size={20} />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase text-[#245B46]">
                {service.category}
              </p>

              <h3 className="mt-1 text-lg font-extrabold">
                {service.name}
              </h3>

              {service.description?.trim() && (
                <p className="mt-2 text-sm text-gray-600">
                  {service.description}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="text-sm font-bold">
                  {service.basePrice > 0
                    ? `From ৳${service.basePrice.toLocaleString("en-BD")}`
                    : "Quotation required"}
                </span>

                <Link
                  href={`/find-workers?service=${service._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#245B46]"
                >
                  Find workers
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
