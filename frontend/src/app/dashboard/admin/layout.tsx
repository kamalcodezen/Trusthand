// TrustHand SEO setup
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell role="admin">
      {children}
    </DashboardShell>
  );
}