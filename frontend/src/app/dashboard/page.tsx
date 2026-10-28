
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  apiAuth,
  type Profile,
} from "@/lib/dashboard-api";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    apiAuth<Profile>("/api/auth/me")
      .then((user) => {
        if (active) {
          router.replace(
            `/dashboard/${user.role}`
          );
        }
      })
      .catch(() => {
        if (active) {
          router.replace("/login");
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="p-10 text-center text-slate-600">
      Opening your dashboard...
    </main>
  );
}
