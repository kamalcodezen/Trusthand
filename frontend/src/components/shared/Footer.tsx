
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";

import { apiJson } from "@/lib/trusthand-api";
import type {
  Service,
  Worker,
} from "@/lib/dashboard-api";

type WorkerArea = {
  name: string;
  demoOnly: boolean;
};

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [servicesLoading, setServicesLoading] =
    useState(true);

  const [workersLoading, setWorkersLoading] =
    useState(true);

  const [servicesError, setServicesError] =
    useState(false);

  const [workersError, setWorkersError] =
    useState(false);

  // Get active services and approved workers from MongoDB
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [serviceResult, workerResult] =
        await Promise.allSettled([
          apiJson<Service[]>("/api/services"),
          apiJson<Worker[]>("/api/workers"),
        ]);

      if (!active) return;

      if (serviceResult.status === "fulfilled") {
        setServices(
          serviceResult.value.filter(
            (service) => service.active
          )
        );
        setServicesError(false);
      } else {
        setServicesError(true);
      }

      if (workerResult.status === "fulfilled") {
        setWorkers(workerResult.value);
        setWorkersError(false);
      } else {
        setWorkersError(true);
      }

      setServicesLoading(false);
      setWorkersLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  // Derive actual worker areas from database records
  const workerAreas = useMemo<WorkerArea[]>(() => {
    const areaMap = new Map<string, WorkerArea>();

    workers.forEach((worker) => {
      const area =
        worker.area?.trim() ||
        worker.district?.trim();

      if (!area) return;

      const key = area.toLowerCase();
      const existing = areaMap.get(key);

      if (!existing) {
        areaMap.set(key, {
          name: area,
          demoOnly: worker.isDemo === true,
        });
      } else if (worker.isDemo !== true) {
        existing.demoOnly = false;
      }
    });

    return Array.from(areaMap.values())
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      .slice(0, 6);
  }, [workers]);

  const footerLinkClass =
    "transition-colors hover:text-white";

  const footerTextClass =
    "text-xs leading-relaxed text-[#A3C1B4]";

  return (
    <footer
      className="
        bg-[var(--color-trust-footer)]
        text-white
        font-['Manrope']
        pt-16 pb-10
        px-4 sm:px-6 lg:px-10
      "
    >
      <div className="mx-auto w-full global-pos">

        {/* MAIN FOOTER GRID */}
        <div
          className="
            grid grid-cols-1
            gap-10
            md:grid-cols-2
            lg:grid-cols-5
            pb-16
            border-b border-[#2A4D3E]
          "
        >

          {/* BRAND INFORMATION */}
          <div className="lg:col-span-2 space-y-4">

            <Link
              href="/"
              className="flex w-fit items-center gap-2.5"
            >
              <div
                className="
                  flex size-8 items-center
                  justify-center rounded-lg
                  bg-white
                  text-[var(--color-trust-footer)]
                "
              >
                <Wrench
                  size={18}
                  strokeWidth={2.2}
                />
              </div>

              <span
                className="
                  text-lg font-extrabold
                  tracking-tight text-white
                "
              >
                TrustHand
              </span>
            </Link>

            <p className="text-sm font-semibold text-white">
              Reliable help. Right around you.
            </p>

            <p
              className="
                max-w-sm text-xs
                leading-relaxed text-[#A3C1B4]
              "
            >
              TrustHand connects customers with
              admin-approved local service workers.
              Explore worker profiles, request
              quotations, track service bookings,
              and review completed work.
            </p>
          </div>

          {/* DYNAMIC SERVICES */}
          <div>
            <h4
              className="
                mb-4 text-xs font-extrabold
                uppercase tracking-wider text-white
              "
            >
              Skilled Trades
            </h4>

            {servicesLoading ? (
              <p
                role="status"
                className={footerTextClass}
              >
                Loading services...
              </p>
            ) : servicesError ? (
              <p
                role="alert"
                className={footerTextClass}
              >
                Services are temporarily unavailable.
              </p>
            ) : services.length === 0 ? (
              <p className={footerTextClass}>
                No active services available.
              </p>
            ) : (
              <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
                {services.slice(0, 6).map((service) => (
                  <li key={service._id}>
                    <Link
                      href={`/find-workers?service=${encodeURIComponent(
                        service._id
                      )}`}
                      className={footerLinkClass}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {services.length > 6 && !servicesError && (
              <Link
                href="/services"
                className="
                  mt-4 inline-block
                  text-xs font-semibold
                  text-white hover:underline
                "
              >
                View all services
              </Link>
            )}
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h4
              className="
                mb-4 text-xs font-extrabold
                uppercase tracking-wider text-white
              "
            >
              Platform
            </h4>

            <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
              <li>
                <Link
                  href="/find-workers"
                  className={footerLinkClass}
                >
                  Find Workers
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className={footerLinkClass}
                >
                  All Services
                </Link>
              </li>

              <li>
                <Link
                  href="/how-it-works"
                  className={footerLinkClass}
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className={footerLinkClass}
                >
                  Worker Registration
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className={footerLinkClass}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* DYNAMIC WORKER AREAS */}
          <div>
            <h4
              className="
                mb-4 text-xs font-extrabold
                uppercase tracking-wider text-white
              "
            >
              Worker Locations
            </h4>

            {workersLoading ? (
              <p
                role="status"
                className={footerTextClass}
              >
                Loading locations...
              </p>
            ) : workersError ? (
              <p
                role="alert"
                className={footerTextClass}
              >
                Worker locations are temporarily
                unavailable.
              </p>
            ) : workerAreas.length === 0 ? (
              <p className={footerTextClass}>
                No approved worker locations available.
              </p>
            ) : (
              <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
                {workerAreas.map((area) => (
                  <li
                    key={area.name.toLowerCase()}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <span>{area.name}</span>

                    {area.demoOnly && (
                      <span
                        className="
                          rounded border
                          border-[#557565]
                          px-1.5 py-0.5
                          text-[10px]
                          text-[#C1D6CB]
                        "
                      >
                        Demo
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/find-workers"
              className="
                mt-5 inline-block
                text-xs font-semibold
                text-white hover:underline
              "
            >
              Browse worker directory
            </Link>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div
          className="
            mt-8 flex flex-col
            items-center justify-between
            gap-4 text-xs text-[#A3C1B4]
            sm:flex-row
          "
        >
          <p>
            © {new Date().getFullYear()} TrustHand.
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className={footerLinkClass}
            >
              Home
            </Link>

            <Link
              href="/services"
              className={footerLinkClass}
            >
              Services
            </Link>

            <Link
              href="/how-it-works"
              className={footerLinkClass}
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
