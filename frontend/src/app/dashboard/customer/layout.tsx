// TrustHand SEO setup
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Dashboard",
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
    <DashboardShell role="customer">
      {children}
    </DashboardShell>
  );
}