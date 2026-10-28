
"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  apiJson,
} from "@/lib/trusthand-api";

import type {
  Service,
} from "@/lib/dashboard-api";

const topics = {
  "how-it-works": {
    title: "How TrustHand Works",
    subtitle:
      "From finding the right service to reviewing a completed job.",

    points: [
      [
        "1. Explore",
        "Browse active services and profiles of workers approved to appear in search.",
      ],
      [
        "2. Choose a professional",
        "Review their offered services, area and customer reviews where available.",
      ],
      [
        "3. Request a booking",
        "Sign in as a customer, choose a listed service, provide an address and a future time.",
      ],
      [
        "4. Follow the job",
        "Your worker can confirm, start and complete the booking. Track status in your dashboard.",
      ],
      [
        "5. Give feedback",
        "After the job is completed, submit a review. Keep your booking record for reference.",
      ],
    ],
  },

  "trust-safety": {
    title: "Trust & Safety",
    subtitle:
      "Know what is checked, what is not, and how to keep a booking safe.",

    points: [
      [
        "Approval is not a guarantee",
        "Only admin-approved active workers appear in directory results. TrustHand does not currently establish police verification, insurance or a guarantee via these APIs.",
      ],
      [
        "Check the scope first",
        "Agree on the problem, work scope, required materials and payment expectations before work starts.",
      ],
      [
        "Protect personal information",
        "Never share passwords or identification documents in AI chats. Communicate only what a worker needs for the visit.",
      ],
      [
        "Dangerous situations",
        "Gas leaks, sparking wires, smoke and severe flooding require immediate professional or emergency assistance, not AI troubleshooting.",
      ],
      [
        "Human decisions",
        "Admins approve workers and handle disputes; the AI gives suggestions but cannot enforce penalties, handle payments or guarantee safety.",
      ],
    ],
  },

  "become-a-professional": {
    title: "Become a TrustHand Professional",
    subtitle:
      "Build a profile, add genuine skills, and manage assigned jobs.",

    points: [
      [
        "Register as a worker",
        "Choose Worker during registration and provide accurate contact and location details.",
      ],
      [
        "Complete your profile",
        "Add your bio, services, experience and availability in your worker dashboard.",
      ],
      [
        "Admin review",
        "Your account needs approval before appearing in the public worker directory.",
      ],
      [
        "Manage bookings",
        "Review upcoming bookings, update their statuses and keep customers informed.",
      ],
      [
        "Use Worker Copilot AI",
        "Get safety checklists and practical preparation guidance based on the jobs assigned to you.",
      ],
    ],
  },
} as const;

export default function PublicPages({
  topic,
}: {
  topic:
    | keyof typeof topics
    | "services"
    | "pricing-guide";
}) {
  const [services, setServices] =
    useState<Service[]>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    if (
      topic !== "services" &&
      topic !== "pricing-guide"
    ) {
      return;
    }

    apiJson<Service[]>("/api/services")
      .then(setServices)
      .catch((e) =>
        setError(
          e instanceof Error
            ? e.message
            : "Unable to load services"
        )
      );
  }, [topic]);

  const info =
    topic in topics
      ? topics[topic as keyof typeof topics]
      : null;

  return (
    <main className="min-h-[65vh] bg-[#f6f8f6] px-5 py-16 text-[#20372d]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-widest text-[#26734d]">
          TrustHand
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          {info?.title ||
            (topic === "services"
              ? "Explore services"
              : "Service pricing guide")}
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          {info?.subtitle ||
            (topic === "services"
              ? "Browse the real active services available in TrustHand."
              : "These are catalog starting prices only. Confirm work scope and final amount before booking.")}
        </p>

        {error && (
          <p
            className="mt-8 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {info ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {info.points.map(
              ([heading, description]) => (
                <article
                  key={heading}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold">
                    {heading}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {description}
                  </p>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s._id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#26734d]">
                  {s.category}
                </p>

                <h2 className="mt-2 text-lg font-bold">
                  {s.name}
                </h2>

                <p className="mt-3 text-sm text-gray-600">
                  {s.description}
                </p>

                <p className="mt-4 text-lg font-bold">
                  Catalog base: ৳{s.basePrice}
                </p>

                <Link
                  href={`/find-workers?service=${s._id}`}
                  className="mt-4 inline-block text-sm font-bold text-[#184C3B] underline"
                >
                  Find professionals
                </Link>
              </article>
            ))}

            {!services.length && !error && (
              <p className="text-sm text-gray-500">
                No active services available yet.
              </p>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/find-workers"
            className="rounded-xl bg-[#184C3B] px-5 py-3 text-sm font-bold text-white"
          >
            Find a professional
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-[#184C3B] px-5 py-3 text-sm font-bold"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
