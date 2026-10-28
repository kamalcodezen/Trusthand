import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TrustHand SEO setup
const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const isPublicProduction =
  process.env.NODE_ENV === "production" &&
  siteUrl.startsWith("https://") &&
  !siteUrl.includes("localhost");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "TrustHand | Find Local Skilled Workers",
    template: "%s | TrustHand",
  },

  description:
    "Find local skilled workers for plumbing, electrical repairs, cleaning, painting and AC servicing. Compare services, request quotes and manage bookings through TrustHand.",

  applicationName: "TrustHand",

  keywords: [
    "TrustHand",
    "local skilled workers",
    "home services Bangladesh",
    "electrician",
    "plumber",
    "cleaning services",
    "painting services",
    "AC servicing",
    "worker booking",
  ],

  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "TrustHand",
    title: "TrustHand | Find Local Skilled Workers",
    description:
      "Explore local services, find skilled workers and manage home-service bookings.",
  },

  twitter: {
    card: "summary",
    title: "TrustHand | Local Skilled Workers",
    description:
      "Discover local workers and request home services with TrustHand.",
  },

  robots: {
    index: isPublicProduction,
    follow: isPublicProduction,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        </body>
    </html>
  );
}
