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