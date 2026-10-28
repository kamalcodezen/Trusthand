// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore plumbing, electrical repair, cleaning, painting and AC servicing available through TrustHand.",

  alternates: {
    canonical: "/services",
  },

  openGraph: {
    title: "Our Services",
    description: "Explore plumbing, electrical repair, cleaning, painting and AC servicing available through TrustHand.",
    url: "/services",
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