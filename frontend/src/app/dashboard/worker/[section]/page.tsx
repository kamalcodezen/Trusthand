import DashboardView from "@/components/dashboard/DashboardView";

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  return (
    <DashboardView
      role="worker"
      section={section}
    />
  );
}