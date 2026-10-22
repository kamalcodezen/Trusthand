"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, MotionConfig, type Variants } from "motion/react";
import {
  User, Mail, Phone, MapPin, Lock, ShieldCheck, BadgeDollarSign,
  Eye, EyeOff, Loader2, ChevronDown, type LucideIcon,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { ROLE_HOME, type SignupRole } from "@/lib/roles";

const AREAS = ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Mohammadpur"];

const TRUST = [
  { icon: ShieldCheck, title: "NID & police-cleared pros", text: "Every technician is verified before they can accept a job." },
  { icon: BadgeDollarSign, title: "Fair price guidance", text: "Ward-level rate ranges help you spot overcharging." },
  { icon: Lock, title: "Milestone escrow", text: "Your money is released only after you inspect and approve the work." },
];

/* ---------- Motion variants ---------- */
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

const inputCls =
  "h-12 w-full rounded-[10px] border-[1.5px] border-[#c9d6cf] bg-white pl-11 pr-3.5 text-[15px] font-medium text-[#14281f] outline-none transition placeholder:text-[#7b8f84] focus:border-[#1c6b4a] focus:ring-4 focus:ring-[#1c6b4a]/20";

function Field({
  id, label, icon: Icon, children,
}: { id: string; label: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#2c4439]">{label}</label>
      <div className="group relative">
        <Icon
          size={20}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c] transition group-focus-within:scale-110 group-focus-within:text-[#14583e]"
        />
        {children}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    setLoading(true);

    const { error } = await signUp.email({
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      password: String(f.get("password")),
      phone: String(f.get("phone")).trim(),
      area: String(f.get("area")),
      role, // server-এ lib/auth.ts আবার যাচাই করে
    });

    setLoading(false);
    if (error) {
      setError(error.message ?? "Could not create your account. Try again.");
      return;
    }
    router.push(ROLE_HOME[role]);
    router.refresh();
  }

  return (
    // reducedMotion="user": যাদের সিস্টেমে "reduce motion" চালু, তাদের জন্য অ্যানিমেশন বন্ধ থাকবে
    <MotionConfig reducedMotion="user">
      <div className="grid min-h-screen grid-cols-1 text-[#14281f] lg:grid-cols-[5fr_6fr]">
        {/* ================= Left: photo + trust points ================= */}
        <section className="relative isolate flex flex-col justify-between gap-8 overflow-hidden bg-[#0f3d2e] px-6 py-8 text-white lg:px-14 lg:py-12">
          {/* Photo (ধীরে zoom হয়) */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[url('/hero.jpg')] bg-cover bg-center"
            animate={{ scale: [1, 1.08] }}
            transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#092a1e]/80 via-[#092a1e]/60 to-[#092a1e]/95" />

          <motion.div variants={list} initial="hidden" animate="show" className="flex h-full flex-col justify-between gap-8">
            <motion.div variants={item} className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#e3f4ea] text-[#0f3d2e]">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <span className="text-xl font-bold">TrustHand</span>
            </motion.div>

            <div className="flex max-w-[480px] flex-col gap-5">
              <motion.span variants={item} className="text-xs font-semibold tracking-[0.12em] text-[#a8d9bf]">
                DHAKA METROPOLITAN TRADES
              </motion.span>
              <motion.h1 variants={item} className="text-[40px] font-bold leading-[1.08] lg:text-[52px]">
                Good help{" "}
                <span className="font-[family-name:var(--font-fraunces)] font-medium italic text-[#a8d9bf]">starts here.</span>
              </motion.h1>
              <motion.p variants={item} className="text-[17px] leading-relaxed text-[#d6eadf]">
                Find verified neighbourhood craftsmen, get clear quotes, and pay safely in milestones.
              </motion.p>
            </div>

            <div className="flex max-w-[480px] flex-col gap-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <motion.div
                  key={title}
                  variants={item}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#a8d9bf]/25 bg-[#0c3426]/80 p-4 backdrop-blur-sm"
                >
                  <Icon size={22} aria-hidden="true" className="mt-0.5 flex-none text-[#a8d9bf]" />
                  <div>
                    <div className="text-[15px] font-semibold">{title}</div>
                    <div className="mt-0.5 text-sm leading-normal text-[#cfe5d9]">{text}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={item} className="text-[13px] text-[#a8d9bf]">TrustHand Civic Protocol</motion.div>
          </motion.div>
        </section>

        {/* ================= Right: form ================= */}
        <section className="flex items-center justify-center bg-[#f7f8f5] px-5 py-8 lg:px-16 lg:py-12">
          <motion.form
            onSubmit={onSubmit}
            variants={list}
            initial="hidden"
            animate="show"
            className="flex w-full max-w-[440px] flex-col gap-[22px]"
          >
            {/* Account type switch: সাদা pill স্লাইড করে */}
            <motion.div
              variants={item}
              role="group"
              aria-label="Account type"
              className="relative grid grid-cols-2 gap-1 rounded-xl bg-[#e6ece8] p-1"
            >
              {(["customer", "tradesperson"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={role === r}
                  onClick={() => setRole(r)}
                  className={`relative z-10 h-11 rounded-[9px] text-sm font-semibold transition-colors ${
                    role === r ? "text-[#14583e]" : "text-[#2c4439]"
                  }`}
                >
                  {role === r && (
                    <motion.span
                      layoutId="role-pill"
                      className="absolute inset-0 -z-10 rounded-[9px] bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {r === "customer" ? "I need a service" : "I'm a tradesperson"}
                </button>
              ))}
            </motion.div>

            <motion.div variants={item}>
              <h2 className="text-[30px] font-bold leading-tight">Create your account</h2>
              <p className="mt-2 text-[15px] text-[#3d5247]">Find trusted local help in Dhaka in under a minute.</p>
            </motion.div>

            <div className="flex flex-col gap-4">
              <motion.div variants={item}>
                <Field id="name" label="Full name" icon={User}>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="e.g. Begum Rokeya" className={inputCls} />
                </Field>
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field id="email" label="Email" icon={Mail}>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
                </Field>
                <Field id="phone" label="Mobile number" icon={Phone}>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+880 1XXX-XXXXXX" className={inputCls} />
                </Field>
              </motion.div>

              <motion.div variants={item}>
                <Field id="area" label="Neighbourhood / zone" icon={MapPin}>
                  <select id="area" name="area" required defaultValue="" className={`${inputCls} appearance-none pr-10`}>
                    <option value="" disabled>Select your area</option>
                    {AREAS.map((a) => (<option key={a} value={a}>{a}</option>))}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]" />
                </Field>
              </motion.div>

              <motion.div variants={item}>
                <Field id="password" label="Password" icon={Lock}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1.5 top-1 flex size-10 items-center justify-center rounded-lg text-[#14583e] transition hover:bg-[#e6ece8]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </Field>
                <p className="mt-1.5 text-[13px] text-[#3d5247]">Use 8+ characters with a mix of letters and numbers.</p>
              </motion.div>
            </div>

            <motion.label variants={item} className="flex items-start gap-2.5 text-sm leading-normal text-[#2c4439]">
              <input type="checkbox" name="terms" required className="mt-0.5 size-5 flex-none accent-[#14583e]" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[#14583e] underline">Terms of Service</Link>,{" "}
                <Link href="/privacy" className="text-[#14583e] underline">Privacy Policy</Link> and{" "}
                <Link href="/fair-price-code" className="text-[#14583e] underline">Fair Price Code</Link>.
              </span>
            </motion.label>

            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
                className="rounded-[10px] bg-[#fdecea] px-3.5 py-3 text-sm text-[#8a1f17]"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              variants={item}
              type="submit"
              disabled={loading}
              whileHover={loading ? undefined : { y: -2, boxShadow: "0 8px 20px rgba(20,88,62,0.28)" }}
              whileTap={loading ? undefined : { scale: 0.98 }}
              className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#14583e] text-base font-semibold text-white transition-colors hover:bg-[#0f4631] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#b7e0c9] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {loading ? "Creating account…" : "Create account"}
            </motion.button>

            <motion.p variants={item} className="text-center text-[15px] text-[#3d5247]">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-[#14583e] underline">Sign in</Link>
            </motion.p>
          </motion.form>
        </section>
      </div>
    </MotionConfig>
  );
}