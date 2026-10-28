import { Info, ShieldCheck } from "lucide-react";
import { WorkerData } from "@/components/FindWorkers/Card";

export default function WorkerAboutCard({ worker }: { worker: WorkerData }) {
  return (
    <div className="rounded-3xl bg-white border border-[var(--color-trust-border)] p-6 sm:p-8 shadow-sm space-y-4">
      <h2 className="text-lg font-extrabold text-[var(--color-trust-text-main)] flex items-center gap-2">
        <Info className="size-5 text-[var(--color-trust-green-main)]" />
        About the Professional
      </h2>

      <p className="text-xs sm:text-sm text-[var(--color-trust-text-subtle)] leading-relaxed">
        Trained formally at certified technical institutes, {worker.name} is a specialist {worker.role} with {worker.experience} hands-on field expertise serving residences, corporate suites, and commercial projects across {worker.location}.
      </p>

      <p className="text-xs sm:text-sm text-[var(--color-trust-text-subtle)] leading-relaxed">
        Unlike informal contractors who depend on rough visual guesswork, {worker.name} utilizes advanced professional gear and proven methodologies—expertly handling tasks related to {worker.tags.join(", ")} to ensure total safety and precision.
      </p>

      <div className="rounded-2xl bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] p-3.5 flex items-start gap-2.5 text-xs text-[var(--color-trust-text-main)]">
        <ShieldCheck className="size-4 text-[var(--color-trust-green-main)] shrink-0 mt-0.5" />
        <span>
          <strong>Civic Verification Note:</strong> All credentials, background checks, and trade identification records for {worker.name} were physical-document verified by the TrustHand Field Integrity Team.
        </span>
      </div>
    </div>
  );
}