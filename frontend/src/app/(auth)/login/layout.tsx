// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your TrustHand account.",

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