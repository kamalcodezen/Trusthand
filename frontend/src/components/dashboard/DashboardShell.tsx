
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
  const pathname = usePathname();

  const [current, setCurrent] =
    useState<Profile | null>(null);

  const [failure, setFailure] =
    useState("");

  const [signingOut, setSigningOut] =
    useState(false);

  useEffect(() => {
    let active = true;

    apiAuth<Profile>("/api/auth/me")
      .then((user) => {
        if (!active) return;

        if (user.role !== role) {
          router.replace(
            `/dashboard/${user.role}`
          );
          return;
        }

        setCurrent(user);
        setFailure("");
      })
      .catch((error: unknown) => {
        if (!active) return;

        const message =
          error instanceof Error
            ? error.message
            : "Account verification failed";

        if (
          /login required|session invalid|account not active|http 401|http 403/i
            .test(message)
        ) {
          router.replace("/login");
          return;
        }

        setFailure(
          "Unable to load your account. Check the backend and refresh."
        );
      });

    return () => {
      active = false;
    };
  }, [role, router]);

  async function signOut() {
    setFailure("");
    setSigningOut(true);

    try {
      await clearAuth();
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "Server logout could not be confirmed."
      );
    } finally {
      setSigningOut(false);
      router.replace("/login");
      router.refresh();
    }
  }

  if (!current) {
    return (
      <main className="min-h-[65vh] bg-[#f7faf8] p-10 text-center text-slate-600">
        {failure ||
          "Checking your TrustHand account..."}
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

        <p className="mb-5 mt-1 truncate text-xs text-gray-500">
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

            const selected =
              pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  selected ? "page" : undefined
                }
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  selected
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
            type="button"
            disabled={signingOut}
            onClick={signOut}
            className="rounded-xl border px-3 py-2.5 text-left text-sm text-red-700 disabled:opacity-50"
          >
            {signingOut
              ? "Signing out..."
              : "Sign out"}
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-9">
        {failure && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {failure}
          </p>
        )}

        {children}
      </main>
    </div>
  );
}
