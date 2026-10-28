
"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import {
  apiJson,
  type UserRole,
} from "@/lib/trusthand-api";

type Kind = "public" | UserRole;

type Line = {
  role: "user" | "assistant";
  content: string;
};

const starters: Record<Kind, string[]> = {
  public: [
    "My circuit breaker keeps tripping. What should I do safely?",
    "Water is leaking under my sink. Which professional do I need?",
    "What should I ask an AC technician before booking?",
  ],

  customer: [
    "Explain my latest booking status.",
    "What should I check before the worker arrives?",
    "How should I report an incomplete job?",
  ],

  worker: [
    "Prepare a safety checklist for my next job.",
    "What questions should I ask before visiting?",
    "How can I improve my worker profile?",
  ],

  admin: [
    "Which operational issues need attention?",
    "Explain recent cancellations and pending jobs.",
    "What should I check before approving a worker?",
  ],
};

const labels: Record<Kind, string> = {
  public: "Trust AI",
  customer: "Customer Assist AI",
  worker: "Worker Copilot AI",
  admin: "Operations Insight AI",
};

export default function TrustAI({
  kind = "public",
  floating = false,
}: {
  kind?: Kind;
  floating?: boolean;
}) {
  const [open, setOpen] =
    useState(!floating);

  const [lines, setLines] =
    useState<Line[]>([]);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function send(
    event?: FormEvent<HTMLFormElement>,
    preset?: string
  ) {
    event?.preventDefault();

    const text = (
      preset ?? question
    ).trim();

    if (
      !text ||
      loading
    ) {
      return;
    }

    const old = lines;

    setQuestion("");
    setError("");
    setLoading(true);

    setLines([
      ...old,
      {
        role: "user",
        content: text,
      },
    ]);

    try {
      const result = await apiJson<{
        answer: string;
      }>(`/api/ai/${kind}`, {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: old.slice(-6),
        }),
      });

      setLines((current) => [
        ...current,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "AI request failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        floating
          ? "fixed bottom-5 right-5 z-[70] w-[min(380px,calc(100vw-32px))]"
          : "w-full max-w-3xl"
      }
    >
      {floating && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-full bg-[#184C3B] px-5 py-4 font-bold text-white shadow-2xl"
        >
          <Sparkles size={19} />
          Ask Trust AI
        </button>
      )}

      {open && (
        <section className="overflow-hidden rounded-3xl border border-[#d7e6df] bg-white text-[#20382c] shadow-xl">
          <div className="flex items-center justify-between bg-[#184C3B] p-4 text-white">
            <div>
              <div className="flex items-center gap-2 font-bold">
                <Bot size={21} />
                {labels[kind]}
              </div>

              <p className="mt-1 text-xs text-white/75">
                Helpful guidance • AI may be mistaken
              </p>
            </div>

            {floating && (
              <button
                type="button"
                aria-label="Close AI assistant"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div
            aria-live="polite"
            className="h-[330px] space-y-3 overflow-y-auto bg-[#f8fbf9] p-4 sm:h-[390px]"
          >
            {lines.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm leading-6">
                  Ask a question about services,
                  bookings, safety or your available
                  TrustHand data.
                </p>

                {starters[kind].map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() =>
                      void send(undefined, text)
                    }
                    className="block w-full rounded-xl border bg-white p-3 text-left text-sm hover:border-[#184C3B]"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {lines.map((line, index) => (
              <div
                key={index}
                className={`max-w-[95%] whitespace-pre-wrap rounded-2xl p-3 text-sm leading-6 ${
                  line.role === "user"
                    ? "ml-auto bg-[#184C3B] text-white"
                    : "border bg-white"
                }`}
              >
                {line.content}
              </div>
            ))}

            {loading && (
              <p className="flex items-center gap-2 text-sm">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Thinking...
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="text-sm text-red-700"
              >
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t p-3"
          >
            <input
              aria-label="Ask AI a question"
              value={question}
              maxLength={1200}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Describe your question..."
              className="min-w-0 flex-1 rounded-xl border px-3 py-3 text-sm outline-[#184C3B]"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !question.trim()
              }
              aria-label="Send message"
              className="rounded-xl bg-[#184C3B] p-3 text-white disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>

          <p className="px-4 pb-3 text-[11px] text-gray-500">
            Do not share passwords or sensitive
            documents. AI cannot perform account changes.
          </p>
        </section>
      )}
    </div>
  );
}
