import { WorkerData } from "@/components/FindWorkers/Card";

export default function InstantDispatchCard({ worker }: { worker: WorkerData }) {
    return (
        <div className="rounded-3xl bg-[var(--color-trust-text-main)] text-white p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Instant Dispatch</span>
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-base font-extrabold">Need him right now?</h4>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                {worker.name.split(" ")[0]} carries standard spares (Hager MCBs, 2.5m cables, multi-gang switch components) in his mobile carrier toolkit.
            </p>
            <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Current ETA:</span>
                <span className="font-extrabold text-emerald-400">~35 Minutes in {worker.location.split(",")[0]}</span>
            </div>
        </div>
    );
}