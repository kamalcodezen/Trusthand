
"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  clearAuth,
  getAuthToken,
  type UserRole,
} from "@/lib/trusthand-api";

import {
  apiAuth,
  type Profile,
} from "@/lib/dashboard-api";

const menus: Record<
  UserRole,
  Array<[string, string]>
> = {
  customer: [
    ["Overview", ""],
    ["My Bookings", "bookings"],
    ["Payments", "payments"],
    ["My Reviews", "reviews"],
    ["My Profile", "profile"],
    ["Customer AI", "ai"],
  ],

  worker: [
    ["Overview", ""],
    ["Assigned Jobs", "bookings"],
    ["Payments", "payments"],
    ["My Skills & Profile", "profile"],
    ["Worker AI", "ai"],
  ],

  admin: [
    ["Overview", ""],
    ["Customers", "customers"],
    ["Workers", "workers"],
    ["Bookings", "bookings"],
    ["Payments", "payments"],
    ["Services", "services"],
    ["Settings", "settings"],
    ["Admin AI", "ai"],
  ],
};

export default function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();

  const [current, setCurrent] =
    useState<Profile | null>(null);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }

    apiAuth<Profile>("/api/auth/me")
      .then((user) => {
        if (user.role !== role) {
          router.replace(
            `/dashboard/${user.role}`
          );
          return;
        }

        setCurrent(user);
      })
      .catch(() => {
        clearAuth();
        setFailed(true);
        router.replace("/login");
      });
  }, [role, router]);

  if (!current) {
    return (
      <main className="min-h-[65vh] bg-[#f7faf8] p-10 text-center text-slate-600">
        {failed
          ? "Redirecting to sign in..."
          : "Checking your TrustHand account..."}
      </main>
    );
  }

  return (
    <div className="min-h-[75vh] bg-[#f6f8f6] text-[#16382d] md:flex">
      <aside className="border-b bg-white p-5 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <h2 className="text-lg font-extrabold">
          {role.charAt(0).toUpperCase() +
            role.slice(1)}{" "}
          Portal
        </h2>

        <p className="mt-1 mb-5 truncate text-xs text-gray-500">
          {current.name}
        </p>

        <nav
          aria-label="Dashboard navigation"
          className="grid grid-cols-2 gap-2 md:grid-cols-1"
        >
          {menus[role].map(([label, section]) => {
            const href = `/dashboard/${role}${
              section ? `/${section}` : ""
            }`;

            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  path === href
                    ? "page"
                    : undefined
                }
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  path === href
                    ? "bg-[#184C3B] text-white"
                    : "hover:bg-[#e5f0e9]"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/find-workers"
            className="rounded-xl px-3 py-2.5 text-sm hover:bg-[#e5f0e9]"
          >
            Find workers
          </Link>

          <button
            className="rounded-xl border px-3 py-2.5 text-left text-sm text-red-700"
            onClick={() => {
              clearAuth();
              router.replace("/login");
            }}
          >
            Sign out
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-9">
        {children}
      </main>
    </div>
  );
}
