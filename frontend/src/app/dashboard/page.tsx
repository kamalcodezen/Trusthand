"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getAuthToken,
} from "@/lib/trusthand-api";

import {
  apiAuth,
  type Profile,
} from "@/lib/dashboard-api";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }

    apiAuth<Profile>("/api/auth/me")
      .then((user) =>
        router.replace(
          `/dashboard/${user.role}`
        )
      )
      .catch(() =>
        router.replace("/login")
      );
  }, [router]);

  return (
    <p className="p-10">
      Opening your dashboard...
    </p>
  );
}