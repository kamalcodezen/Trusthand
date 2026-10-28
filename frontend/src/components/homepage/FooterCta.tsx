import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function FooterCta() {
  return (
    <section className="bg-[var(--color-trust-green-dark)] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-10 border-b border-[#2A4D3E]">
      <div className="mx-auto w-full global-pos text-center">

        {/* Shield Icon Badge */}
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-[var(--color-trust-green-main)] text-[var(--color-trust-green-badge)] shadow-inner">
          <ShieldCheck size={24} strokeWidth={2} />
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
          The right help is closer than you think.
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-trust-green-badge)] sm:text-base">
          Stop wondering where to find reliable hands in your Dhaka neighborhood. Browse verified craftsmen or post a job in under a minute.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/find-workers"
            className="w-full sm:w-auto rounded-full bg-white px-7 py-3.5 text-xs font-extrabold text-[var(--color-trust-green-dark)] transition-all duration-300 hover:bg-[var(--color-trust-bg-light)] hover:scale-105 shadow-md text-center"
          >
            Explore All Workers in Dhaka
          </Link>

          <Link
            href="/find-workers"
            className="w-full sm:w-auto rounded-full border border-[#2A4D3E] bg-[var(--color-trust-footer)] px-7 py-3.5 text-xs font-extrabold text-white transition-all duration-300 hover:bg-[var(--color-trust-green-main)] text-center"
          >
            Choose a Worker to Request
          </Link>
        </div>

      </div>
    </section>
  );
}