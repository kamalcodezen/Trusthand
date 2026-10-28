// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Register for a TrustHand customer or worker account.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthSeoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}