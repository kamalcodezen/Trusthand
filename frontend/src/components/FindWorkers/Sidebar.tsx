"use client";

import { useMemo } from "react";
import { PhoneCall, SlidersHorizontal} from "lucide-react";
import { WorkerData } from "./Card";

export interface FilterState {
  trades: string[];
  zone: string;
  maxFee: number;
  verification: string[];
  experience: string[];
}

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  workers: WorkerData[];
}

export default function Sidebar({
  filters,
  setFilters,
  onReset,
  workers,
}: SidebarProps) {
  // 1. Dynamic Trade Discipline List & Counts
  const dynamicTrades = useMemo(() => {
    const tradeMap: Record<string, number> = {};
    workers.forEach((worker) => {
      const tradeName = worker.role;
      tradeMap[tradeName] = (tradeMap[tradeName] || 0) + 1;
    });
    return Object.entries(tradeMap).map(([name, count]) => ({
      name,
      count,
    }));
  }, [workers]);

  // 2. Dynamic Parent Cluster Area
  const dynamicParentZones = useMemo(() => {
    const extractParentZone = (location: string) => {
      const locLower = location.toLowerCase();
      if (locLower.includes("gulshan")) return "Gulshan Zone";
      if (locLower.includes("banani") || locLower.includes("baridhara"))
        return "Banani & Baridhara";
      if (locLower.includes("uttara")) return "Uttara Zone";
      if (locLower.includes("dhanmondi") || locLower.includes("lalmatia"))
        return "Dhanmondi & Lalmatia";
      if (locLower.includes("mirpur") || locLower.includes("dohs"))
        return "Mirpur & DOHS";
      if (locLower.includes("bashundhara")) return "Bashundhara R/A";
      return location.split(",")[0].trim();
    };
    return Array.from(new Set(workers.map((w) => extractParentZone(w.location))));
  }, [workers]);

  const toggleTrade = (tradeName: string) => {
    setFilters((prev) => {
      const exists = prev.trades.includes(tradeName);
      return {
        ...prev,
        trades: exists
          ? prev.trades.filter((t) => t !== tradeName)
          : [...prev.trades, tradeName],
      };
    });
  };

  const toggleVerification = (ver: string) => {
    setFilters((prev) => {
      const exists = prev.verification.includes(ver);
      return {
        ...prev,
        verification: exists
          ? prev.verification.filter((v) => v !== ver)
          : [...prev.verification, ver],
      };
    });
  };

  const toggleExperience = (exp: string) => {
    setFilters((prev) => {
      const exists = prev.experience.includes(exp);
      return {
        ...prev,
        experience: exists
          ? prev.experience.filter((e) => e !== exp)
          : [...prev.experience, exp],
      };
    });
  };

  const totalActiveFilters =
    filters.trades.length +
    (filters.zone !== "All Zones" ? 1 : 0) +
    filters.verification.length +
    filters.experience.length;

  return (
    <aside className="space-y-6 font-['Manrope']">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[var(--color-trust-text-main)] flex items-center gap-2">
          <SlidersHorizontal className="size-4" /> Filters
          <span className="flex size-5 items-center justify-center rounded-full bg-[var(--color-trust-green-main)] text-[10px] text-white">
            {totalActiveFilters}
          </span>
        </h2>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-[var(--color-trust-text-muted)] hover:text-[var(--color-trust-text-main)] transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Trade Discipline */}
      <div className="rounded-2xl bg-white p-4 border border-[var(--color-trust-border)] space-y-3">
        <h3 className="text-xs font-bold uppercase text-[var(--color-trust-text-muted)] tracking-wider">
          Trade Discipline
        </h3>
        {dynamicTrades.map((item) => {
          const isChecked = filters.trades.includes(item.name);
          return (
            <label
              key={item.name}
              className="flex items-center justify-between text-xs cursor-pointer text-[var(--color-trust-text-main)]"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTrade(item.name)}
                  className="size-4 rounded border-[var(--color-trust-border)] accent-[var(--color-trust-green-main)] cursor-pointer"
                />
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] font-semibold text-[var(--color-trust-text-muted)] bg-[var(--color-trust-bg-light)] px-1.5 py-0.5 rounded">
                {item.count}
              </span>
            </label>
          );
        })}
      </div>

      {/* Cluster Area */}
      <div className="rounded-2xl bg-white p-4 border border-[var(--color-trust-border)] space-y-3">
        <h3 className="text-xs font-bold uppercase text-[var(--color-trust-text-muted)] tracking-wider">
          Cluster Area
        </h3>
        <label className="flex items-center gap-2 text-xs cursor-pointer text-[var(--color-trust-text-main)]">
          <input
            type="radio"
            name="zone"
            checked={filters.zone === "All Zones"}
            onChange={() => setFilters((prev) => ({ ...prev, zone: "All Zones" }))}
            className="size-4 accent-[var(--color-trust-green-main)] cursor-pointer"
          />
          <span>All Zones</span>
        </label>
        {dynamicParentZones.map((zone) => (
          <label
            key={zone}
            className="flex items-center gap-2 text-xs cursor-pointer text-[var(--color-trust-text-main)]"
          >
            <input
              type="radio"
              name="zone"
              checked={filters.zone === zone}
              onChange={() => setFilters((prev) => ({ ...prev, zone }))}
              className="size-4 accent-[var(--color-trust-green-main)] cursor-pointer"
            />
            <span>{zone}</span>
          </label>
        ))}
      </div>

      {/* SAFETY & VERIFICATION */}
      <div className="rounded-2xl bg-white p-4 border border-[var(--color-trust-border)] space-y-3">
        <h3 className="text-xs font-bold uppercase text-[var(--color-trust-text-muted)] tracking-wider">
          Safety &amp; Verification
        </h3>
        {[
          { title: "100% NID Verified", sub: "Govt Database biometric checked" },
          { title: "Police Cleared (DMP)", sub: "Zero neighborhood infractions" },
          { title: "Ward Certified", sub: "Registered Trade Master" },
        ].map((item) => {
          const isChecked = filters.verification.includes(item.title);
          return (
            <label
              key={item.title}
              className="flex items-start gap-2.5 text-xs cursor-pointer text-[var(--color-trust-text-main)]"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleVerification(item.title)}
                className="mt-0.5 size-4 rounded border-[var(--color-trust-border)] accent-[var(--color-trust-green-main)] cursor-pointer shrink-0"
              />
              <div>
                <span className="font-bold block text-[var(--color-trust-text-main)]">
                  {item.title}
                </span>
                <span className="text-[11px] text-[var(--color-trust-text-muted)] block leading-tight">
                  {item.sub}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* EXPERIENCE LEVEL */}
      <div className="rounded-2xl bg-white p-4 border border-[var(--color-trust-border)] space-y-3">
        <h3 className="text-xs font-bold uppercase text-[var(--color-trust-text-muted)] tracking-wider">
          Experience Level
        </h3>
        {[
          "3–5 Yrs (Certified Artisan)",
          "6–10 Yrs (Senior Craftsman)",
          "10+ Yrs (Master Tradesperson)",
        ].map((exp) => {
          const isChecked = filters.experience.includes(exp);
          return (
            <label
              key={exp}
              className="flex items-center gap-2 text-xs cursor-pointer text-[var(--color-trust-text-main)]"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleExperience(exp)}
                className="size-4 rounded border-[var(--color-trust-border)] accent-[var(--color-trust-green-main)] cursor-pointer"
              />
              <span className="font-medium text-[var(--color-trust-text-main)]">
                {exp}
              </span>
            </label>
          );
        })}
      </div>

      {/* Diagnostic Ceiling */}
      <div className="rounded-2xl bg-white p-4 border border-[var(--color-trust-border)] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--color-trust-text-main)]">
          <span>Diagnostic Ceiling</span>
          <span>Up to ৳{filters.maxFee}</span>
        </div>
        <input
          type="range"
          min="200"
          max="800"
          step="50"
          value={filters.maxFee}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxFee: Number(e.target.value) }))
          }
          className="w-full accent-[var(--color-trust-green-main)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-semibold text-[var(--color-trust-text-muted)]">
          <span>৳200</span>
          <span>৳800</span>
        </div>
      </div>

      {/* Dispatch Hotline */}
      <div className="rounded-2xl bg-[#F4F2EE] p-5 border border-[var(--color-trust-border)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-trust-text-main)]">
          <PhoneCall className="size-4 text-[var(--color-trust-green-main)]" />
          <span>Dispatch Hotline</span>
        </div>
        <p className="text-xs text-[var(--color-trust-text-muted)] leading-relaxed">
          Need emergency assistance for water bursts or main power failures?
        </p>
        <a
          href="tel:+8801700000000"
          className="inline-block text-xs font-extrabold text-[var(--color-trust-green-main)] hover:underline pt-1"
        >
          Call +880 1700-TRUSTH →
        </a>
      </div>
    </aside>
  );
}