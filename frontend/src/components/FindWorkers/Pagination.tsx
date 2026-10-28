"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-trust-border)] pt-6 font-['Manrope']">
      <span className="text-xs text-[var(--color-trust-text-muted)]">
        Showing {startItem}–{endItem} of {totalItems} verified technicians
      </span>

      <div className="flex items-center gap-1 text-xs font-semibold text-[var(--color-trust-text-main)]">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex size-8 items-center justify-center rounded-lg border border-[var(--color-trust-border)] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`size-8 rounded-lg font-bold transition-colors ${
              currentPage === page
                ? "bg-[var(--color-trust-footer)] text-white"
                : "hover:bg-white"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex size-8 items-center justify-center rounded-lg border border-[var(--color-trust-border)] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}