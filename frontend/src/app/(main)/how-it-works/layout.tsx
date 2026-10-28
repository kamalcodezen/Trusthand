// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How TrustHand Works",
  description: "Learn how to discover workers, request services, receive quotes and manage home-service bookings on TrustHand.",

  alternates: {
    canonical: "/how-it-works",
  },

  openGraph: {
    title: "How TrustHand Works",
    description: "Learn how to discover workers, request services, receive quotes and manage home-service bookings on TrustHand.",
    url: "/how-it-works",
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