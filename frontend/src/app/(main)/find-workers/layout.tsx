// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Find Local Workers",
  description: "Browse local worker profiles, filter by service and compare available home-service providers on TrustHand.",

  alternates: {
    canonical: "/find-workers",
  },

  openGraph: {
    title: "Find Local Workers",
    description: "Browse local worker profiles, filter by service and compare available home-service providers on TrustHand.",
    url: "/find-workers",
    type: "website",
  },
};

export default function SeoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}