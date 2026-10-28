
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Wrench, X } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Find Workers", "/find-workers"],
  ["How It Works", "/how-it-works"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfebe2] bg-[#fcfdfb] text-[#184c3b] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold"
        >
          <Wrench size={21} />
          TrustHand
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-5 xl:flex"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-semibold hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden gap-3 sm:flex">
          <Link
            className="rounded-lg border px-3 py-2 text-xs font-bold"
            href="/login"
          >
            Sign in
          </Link>

          <Link
            className="rounded-lg bg-[#184c3b] px-3 py-2 text-xs font-bold text-white"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        <button
          aria-label={
            open ? "Close menu" : "Open menu"
          }
          className="xl:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="grid gap-1 border-t bg-white p-5 xl:hidden"
        >
          {[
            ...links,
            ["Sign in", "/login"],
            ["My dashboard", "/dashboard"],
          ].map(([label, href]) => (
            <Link
              href={href}
              key={href}
              className="rounded-lg px-3 py-2 text-sm hover:bg-[#e5f0e9]"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
