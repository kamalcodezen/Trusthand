"use client";

import { X } from "lucide-react";

interface FilterHeaderProps {
  totalCount: number;
  activeTradeFilters: string[];
  activeZone: string;
  sortBy: string;
  setSortBy: (val: string) => void;
  removeTradeFilter: (trade: string) => void;
  resetZoneFilter: () => void;
  clearAll: () => void;
}

export default function FilterHeader({
  totalCount,
  activeTradeFilters,
  activeZone,
  sortBy,
  setSortBy,
  removeTradeFilter,
  resetZoneFilter,
  clearAll,
}: FilterHeaderProps) {
  const hasActiveFilters =
    activeTradeFilters.length > 0 || activeZone !== "All Zones";

  return (
    <div className="space-y-4 font-['Manrope']">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-trust-text-muted)]">
          <span className="font-bold text-[var(--color-trust-text-main)]">
            Showing {totalCount} skilled professionals
          </span>
          <span>• Dhaka Metro</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--color-trust-text-muted)] font-semibold">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-[var(--color-trust-border)] bg-white px-2.5 py-1.5 font-bold text-[var(--color-trust-text-main)] outline-none cursor-pointer"
          >
            <option value="rating">Highest Rated (★ 4.8+)</option>
            <option value="jobs">Most Completed Jobs</option>
            <option value="fee">Lowest Diagnostic Fee</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {activeTradeFilters.map((trade) => (
            <span
              key={trade}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[var(--color-trust-border)] px-3 py-1 text-[11px] font-semibold text-[var(--color-trust-text-subtle)] shadow-sm"
            >
              Trade: {trade}
              <X
                onClick={() => removeTradeFilter(trade)}
                className="size-3 cursor-pointer hover:text-red-500 transition-colors"
              />
            </span>
          ))}

          {activeZone !== "All Zones" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[var(--color-trust-border)] px-3 py-1 text-[11px] font-semibold text-[var(--color-trust-text-subtle)] shadow-sm">
              Zone: {activeZone}
              <X
                onClick={resetZoneFilter}
                className="size-3 cursor-pointer hover:text-red-500 transition-colors"
              />
            </span>
          )}

          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-[var(--color-trust-green-main)] hover:underline ml-1"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}