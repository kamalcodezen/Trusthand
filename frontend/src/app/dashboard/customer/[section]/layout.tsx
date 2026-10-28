// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ section: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { section } = await params;

  const sectionNames: Record<string, string> = {
    overview: "Overview",
    bookings: "Bookings",
    payments: "Payments",
    reviews: "Reviews",
    customers: "Customers",
    workers: "Workers",
    services: "Services",
    settings: "Settings",
    profile: "Profile",
    ai: "AI Assistant",
  };

  const label =
    sectionNames[section] || "Dashboard";

  return {
    title: label + " - Customer Dashboard",

    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function SectionSeoLayout({
  children,
}: Props) {
  return children;
}