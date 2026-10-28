
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";
import {
  BadgeDollarSign,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  apiJson,
  saveAuth,
  type AuthResponse,
} from "@/lib/trusthand-api";

const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.2, 0.7, 0.2, 1],
    },
  },
};

const fields =
  "h-12 w-full rounded-[10px] border-[1.5px] border-[#c9d6cf] bg-white pl-11 pr-12 text-[15px] font-medium text-[#14281f] outline-none transition placeholder:text-[#7b8f84] focus:border-[#1c6b4a] focus:ring-4 focus:ring-[#1c6b4a]/20";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    setError("");
    setLoading(true);

    try {
      const result = await apiJson<AuthResponse>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: String(form.get("email") ?? "").trim(),
            password: String(form.get("password") ?? ""),
          }),
        }
      );

      saveAuth(result);

      router.replace(
        `/dashboard/${result.user.role}`
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="grid min-h-screen grid-cols-1 text-[#14281f] lg:grid-cols-[5fr_6fr]">

        {/* LEFT SIDE */}
        <section className="relative isolate flex min-h-[360px] flex-col justify-between gap-10 overflow-hidden bg-[#0f3d2e] px-6 py-8 text-white lg:min-h-screen lg:px-14 lg:py-12">

          {/* Background Image */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[url('/hero.jpg')] bg-cover bg-center"
            animate={{ scale: [1, 1.08] }}
            transition={{
              duration: 22,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[#092a1e]/80 via-[#092a1e]/60 to-[#092a1e]/95"
          />

          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="flex h-full flex-col justify-between gap-8"
          >

            {/* Logo */}
            <motion.div
              variants={reveal}
              className="flex items-center gap-2.5"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#e3f4ea] text-[#0f3d2e]">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>

              <span className="text-xl font-bold">
                TrustHand
              </span>
            </motion.div>

            {/* Heading */}
            <div className="max-w-[480px] space-y-5">
              <motion.span
                variants={reveal}
                className="block text-xs font-semibold tracking-[0.12em] text-[#a8d9bf]"
              >
                TRUSTED LOCAL SERVICES ACROSS BANGLADESH
              </motion.span>

              <motion.h1
                variants={reveal}
                className="text-[40px] font-bold leading-[1.08] lg:text-[52px]"
              >
                Welcome{" "}
                <span className="font-[family-name:var(--font-fraunces)] font-medium italic text-[#a8d9bf]">
                  back.
                </span>
              </motion.h1>

              <motion.p
                variants={reveal}
                className="text-[17px] leading-relaxed text-[#d6eadf]"
              >
                Access your account, manage service bookings,
                and connect with local professionals.
              </motion.p>
            </div>

            {/* Trust Features */}
            <motion.div
              variants={reveal}
              className="max-w-[480px] space-y-3"
            >
              <div className="flex items-start gap-3 rounded-2xl border border-[#a8d9bf]/25 bg-[#0c3426]/80 p-4 backdrop-blur-sm">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-[#a8d9bf]"
                  size={22}
                />

                <div>
                  <p className="font-semibold">
                    People you can trust
                  </p>
                  <p className="text-sm text-[#cfe5d9]">
                    Find local professionals and manage jobs
                    from one account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[#a8d9bf]/25 bg-[#0c3426]/80 p-4 backdrop-blur-sm">
                <BadgeDollarSign
                  className="mt-0.5 shrink-0 text-[#a8d9bf]"
                  size={22}
                />

                <div>
                  <p className="font-semibold">
                    Clear service information
                  </p>
                  <p className="text-sm text-[#cfe5d9]">
                    Stay informed from booking to completion.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              className="text-[13px] text-[#a8d9bf]"
            >
              TrustHand Civic Protocol
            </motion.div>
          </motion.div>
        </section>

        {/* RIGHT SIDE — LOGIN FORM */}
        <section className="flex items-center justify-center bg-[#f7f8f5] px-5 py-12 lg:px-16">
          <motion.form
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            onSubmit={onSubmit}
            className="flex w-full max-w-[440px] flex-col gap-6"
          >

            <motion.div variants={reveal}>
              <h2 className="text-[30px] font-bold leading-tight">
                Sign in to TrustHand
              </h2>

              <p className="mt-2 text-[15px] text-[#3d5247]">
                Your neighbourhood service account, in one place.
              </p>
            </motion.div>

            {/* Email */}
            <motion.div variants={reveal}>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-semibold text-[#2c4439]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={fields}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={reveal}>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-semibold text-[#2c4439]"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={fields}
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-1.5 top-1 flex size-10 items-center justify-center rounded-lg text-[#14583e] transition hover:bg-[#e6ece8]"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.p
                variants={reveal}
                role="alert"
                className="rounded-[10px] bg-[#fdecea] px-3.5 py-3 text-sm text-[#8a1f17]"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              variants={reveal}
              type="submit"
              disabled={loading}
              whileHover={
                loading ? undefined : { y: -2 }
              }
              whileTap={
                loading ? undefined : { scale: 0.98 }
              }
              className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#14583e] text-base font-semibold text-white transition-colors hover:bg-[#0f4631] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#b7e0c9] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}

              {loading ? "Signing in…" : "Sign in"}
            </motion.button>

            {/* Signup Link */}
            <motion.p
              variants={reveal}
              className="text-center text-[15px] text-[#3d5247]"
            >
              New to TrustHand?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#14583e] underline"
              >
                Create an account
              </Link>
            </motion.p>

          </motion.form>
        </section>
      </main>
    </MotionConfig>
  );
}
