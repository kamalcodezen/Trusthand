// TrustHand SEO setup
import type { Metadata } from "next";
import type { ReactNode } from "react";

type WorkerData = {
  name?: string;
  area?: string;
  district?: string;
  isDemo?: boolean;
  services?: Array<{ name?: string }>;
};

type Props = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

const backend = (
  process.env.BACKEND_URL ||
  "http://127.0.0.1:5000"
).replace(/\/+$/, "");

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const fallback: Metadata = {
    title: "Worker Profile",
    description: "View a local worker profile on TrustHand.",
    robots: {
      index: false,
      follow: false,
    },
  };

  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return fallback;
  }

  try {
    const response = await fetch(
      `${backend}/api/workers/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as {
      data?: WorkerData;
    };

    const worker = payload.data;

    if (!worker?.name) {
      return fallback;
    }

    const serviceNames = (
      worker.services || []
    )
      .map((service) => service.name)
      .filter(Boolean)
      .join(", ");

    const location = [
      worker.area,
      worker.district,
    ]
      .filter(Boolean)
      .join(", ");

    const isDemo = worker.isDemo === true;

    const title = isDemo
      ? `${worker.name} - Demo Worker Profile`
      : `${worker.name} - Worker Profile`;

    const description = isDemo
      ? `Demo worker profile for ${worker.name} on TrustHand. This is test data, not an independently verified worker.`
      : `View ${worker.name}'s worker profile${location ? ` in ${location}` : ""}${serviceNames ? ` for ${serviceNames}` : ""}. Explore services and request a booking through TrustHand.`;

    const siteUrl =
      process.env.NEXT_PUBLIC_APP_URL || "";

    const canIndex =
      !isDemo &&
      process.env.NODE_ENV === "production" &&
      siteUrl.startsWith("https://") &&
      !siteUrl.includes("localhost");

    return {
      title,
      description,

      alternates: {
        canonical: `/find-workers/${id}`,
      },

      openGraph: {
        title: `${title} | TrustHand`,
        description,
        url: `/find-workers/${id}`,
        type: "website",
      },

      robots: {
        index: canIndex,
        follow: canIndex,
      },
    };
  } catch {
    return fallback;
  }
}

export default function WorkerSeoLayout({
  children,
}: Props) {
  return children;
}