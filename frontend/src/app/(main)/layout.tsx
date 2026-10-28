import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
// TrustHand SEO setup
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Local Skilled Workers",

  description:
    "Find plumbers, electricians, cleaners, painters and AC service workers through TrustHand.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "TrustHand | Find Local Skilled Workers",
    description:
      "Explore services and discover local workers on TrustHand.",
    url: "/",
    type: "website",
  },
};

import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow bg-[#f4edff] transition-colors duration-300 dark:bg-[#2b1e42ec]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
