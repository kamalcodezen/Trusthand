
import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function WorkerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell role="worker">
      {children}
    </DashboardShell>
  );
}
