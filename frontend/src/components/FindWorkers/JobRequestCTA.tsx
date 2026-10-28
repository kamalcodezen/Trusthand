"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function JobRequestCTA() {
  return (
    <section className="font-['Manrope'] w-full">
      <div className="rounded-3xl bg-[var(--color-trust-bg-surface)] p-6 sm:p-8 md:p-10 border border-[var(--color-trust-border-light)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        {/* Left Text Content */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--color-trust-green-main)]">
            Not seeing what you need?
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--color-trust-text-main)] leading-snug">
            Can’t find the right service or exact specialist?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-trust-text-muted)] leading-relaxed">
            Post a direct job request with your problem description and photos. Verified
            neighbourhood craftsmen will submit transparent custom quotes within 30 minutes.
          </p>

          {/* Badges / Guarantees */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[var(--color-trust-text-main)] pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[var(--color-trust-green-main)]" />
              Zero Platform Surcharge
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[var(--color-trust-green-main)]" />
              Escrow Retained
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/jobs/create"
            className="rounded-xl bg-[var(--color-trust-green-main)] px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[var(--color-trust-green-dark)] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Create a Job Request</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/pricing-info"
            className="rounded-xl bg-white border border-[var(--color-trust-border)] px-6 py-3.5 text-xs sm:text-sm font-bold text-[var(--color-trust-text-main)] transition-colors hover:bg-[var(--color-trust-bg-light)] text-center cursor-pointer shadow-sm"
          >
            How Pricing Works
          </Link>
        </div>
      </div>
    </section>
  );
}