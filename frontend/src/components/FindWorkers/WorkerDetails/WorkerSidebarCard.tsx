import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { WorkerData } from "@/components/FindWorkers/Card";

export default function WorkerSidebarCard({ worker }: { worker: WorkerData }) {
    return (
        <div className="space-y-6">
            {/* Main Booking / Callout Sidebar Card */}
            <div className="rounded-3xl bg-white border border-[var(--color-trust-border)] p-6 shadow-sm">
                <div className="flex items-center gap-3 pb-5 border-b border-[var(--color-trust-border-light)]">
                    <div className="relative size-12 rounded-xl overflow-hidden shrink-0 bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)]">
                        <Image src={worker.avatar} alt={worker.name} fill className="object-cover" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-[var(--color-trust-text-main)] flex items-center gap-1">
                            {worker.name}
                            <CheckCircle2 className="size-3.5 fill-[var(--color-trust-green-main)] text-white" />
                        </h3>
                        <p className="text-[11px] font-semibold text-[var(--color-trust-text-muted)]">
                            {worker.role} · Active-{worker.location.split(",")[0]}
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase text-[var(--color-trust-text-muted)]">Diagnostic Callout</span>
                        <div className="text-lg font-extrabold text-[var(--color-trust-text-main)]">৳{worker.diagnosticFee}</div>
                    </div>
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-trust-green-main)] font-medium">
                    100% credited to your final bill if work proceeds.
                </p>

                <div className="mt-6 space-y-3">
                    <div className="text-[11px] font-bold uppercase text-[var(--color-trust-text-muted)] tracking-wider">How Requests Work</div>
                    <div className="flex items-start gap-2.5 text-xs text-[var(--color-trust-text-subtle)]">
                        <span className="size-5 rounded-full bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border)] flex items-center justify-center font-bold text-[10px] text-[var(--color-trust-text-main)] shrink-0">1</span>
                        <span>Describe your electrical problem and upload a photo of the board or problem area.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-[var(--color-trust-text-subtle)]">
                        <span className="size-5 rounded-full bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border)] flex items-center justify-center font-bold text-[10px] text-[var(--color-trust-text-main)] shrink-0">2</span>
                        <span>{worker.name} inspects the issue on arrival and issues a binding, itemized quote via app.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-[var(--color-trust-text-subtle)]">
                        <span className="size-5 rounded-full bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border)] flex items-center justify-center font-bold text-[10px] text-[var(--color-trust-text-main)] shrink-0">3</span>
                        <span>Funds stay protected in Escrow until you test every switch and confirm satisfaction.</span>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <button className="w-full rounded-xl bg-[var(--color-trust-green-main)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-trust-green-dark)] cursor-pointer shadow-sm">
                        Request a Quote from {worker.name.split(" ")[0]} →
                    </button>
                    <Link href="/find-workers" className="w-full rounded-xl bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] py-2.5 text-xs font-bold text-[var(--color-trust-text-main)] transition-all hover:bg-[var(--color-trust-border-light)] flex items-center justify-center gap-2">
                        <ArrowLeft className="size-3.5" />
                        <span>Back to Craftsmen Directory</span>
                    </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-[var(--color-trust-border-light)] flex items-start gap-2.5">
                    <ShieldCheck className="size-4 text-[var(--color-trust-green-main)] shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[11px] font-bold text-[var(--color-trust-text-main)]">TrustHand Escrow Guarantee</div>
                        <p className="text-[10px] text-[var(--color-trust-text-muted)] mt-0.5">
                            100% money protected until milestone sign-off. Zero direct cash haggling on doorstep.
                        </p>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <span className="text-[10px] text-[var(--color-trust-text-muted)] hover:underline cursor-pointer">
                        Report this profile or flag credential discrepancy
                    </span>
                </div>
            </div>
        </div>
    );
}