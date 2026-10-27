"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How does TrustHand verify technicians before they enter my home?",
    answer:
      "Every professional undergoes NID verification, local police background checks, and active reference checks from recent clients in Dhaka. We also maintain a strict 0-tolerance policy for safety violations.",
  },
  {
    question: "Are quotations fixed or negotiable?",
    answer:
      "TrustHand provides clear diagnostic and labor market rate benchmarks before booking. You negotiate and pay 100% directly to the artisan with 0% platform cuts.",
  },
  {
    question: "What if replacement spare parts are required during repair?",
    answer:
      "The technician will explain the required genuine spare parts and costs upfront before starting work. You can buy the parts yourself or inspect receipts provided by the artisan.",
  },
  {
    question: "Can I cancel a job request if my plans change?",
    answer:
      "Yes, you can cancel or reschedule any unassigned or assigned request directly through the app without cancellation fees up to 1 hour before scheduled arrival.",
  },
  {
    question: "Which neighborhoods in Dhaka are currently active?",
    answer:
      "We are currently operating in Gulshan, Banani, Baridhara, Dhanmondi, Lalmatia, Uttara (Sectors 1-14), Mirpur DOHS, and Bashundhara R/A.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[var(--color-trust-bg-light)] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-3xl global-pos">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-trust-green-main)] sm:text-xs mb-2">
            Clear Answers
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-trust-text-main)] sm:text-4xl">
            Frequently asked questions.
          </h2>
          <p className="mt-2 text-xs font-medium text-[var(--color-trust-text-muted)] sm:text-sm">
            Everything you need to know about safety, pricing, and bookings.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[var(--color-trust-border)] bg-white shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-[var(--color-trust-bg-surface)]"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-[var(--color-trust-text-main)] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--color-trust-text-muted)] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[var(--color-trust-green-main)]" : ""
                    }`}
                  />
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm leading-relaxed text-[var(--color-trust-text-subtle)] border-t border-[var(--color-trust-border-light)]">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}