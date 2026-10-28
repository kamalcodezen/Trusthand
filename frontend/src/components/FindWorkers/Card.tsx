import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";

export interface ServiceItem {
  title: string;
  badge: string;
  description: string;
  price: string;
  priceSub: string;
}

export interface WorkerData {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  rating: number;
  badgeText: string;
  avatar: string;
  tags: string[];
  completedJobs: number;
  diagnosticFee: number;
  verificationBadge: string;
  services?: ServiceItem[]; // ডাইনামিক সার্ভিসের জন্য
}

export default function Card({ worker }: { worker: WorkerData }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-trust-border)] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md font-['Manrope']">
      <div>
        {/* Cover Image & Badge */}
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[var(--color-trust-bg-surface)]">
          <Image
            src={worker.avatar}
            alt={worker.name}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 rounded-md bg-[var(--color-trust-green-main)] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow">
            {worker.badgeText}
          </span>
          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[var(--color-trust-text-main)] shadow flex items-center gap-1">
            <CheckCircle2 className="size-3 text-[var(--color-trust-green-main)]" />
            {worker.verificationBadge}
          </span>
        </div>

        {/* Info Header */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[var(--color-trust-text-main)] flex items-center gap-1">
              {worker.name}
              <CheckCircle2 className="size-3.5 fill-[var(--color-trust-green-main)] text-white" />
            </h3>
            <span className="flex items-center gap-0.5 text-xs font-bold text-[var(--color-trust-text-main)]">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {worker.rating}
            </span>
          </div>

          <p className="text-xs text-[var(--color-trust-text-muted)] mt-0.5">
            {worker.role} · {worker.experience}
          </p>
          <p className="text-[11px] text-[var(--color-trust-text-subtle)] flex items-center gap-1 mt-1">
            {worker.location}
          </p>
        </div>

        {/* Skill Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--color-trust-bg-light)] border border-[var(--color-trust-border-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-trust-text-subtle)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-[var(--color-trust-border-light)]">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-[var(--color-trust-text-muted)] text-[11px]">
            {worker.completedJobs} Completed Jobs
          </span>
          <span className="font-extrabold text-[var(--color-trust-text-main)]">
            Diag: ৳{worker.diagnosticFee}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/find-workers/${worker.id}`}
            className="rounded-xl border border-[var(--color-trust-border)] py-2 text-center text-xs font-bold text-[var(--color-trust-text-main)] transition-colors hover:bg-[var(--color-trust-bg-light)]"
          >
            View Profile
          </Link>
          <button className="rounded-xl bg-[var(--color-trust-green-main)] py-2 text-center text-xs font-bold text-white transition-colors hover:bg-[var(--color-trust-green-dark)] cursor-pointer">
            Quote →
          </button>
        </div>
      </div>
    </div>
  );
}