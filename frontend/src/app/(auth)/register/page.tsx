
"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  MotionConfig,
  type Variants,
} from "motion/react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  BadgeDollarSign,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import {
  apiJson,
  saveAuth,
  type AuthResponse,
  type LocationOption,
} from "@/lib/trusthand-api";

// Trust Information
const TRUST = [
  {
    icon: ShieldCheck,
    title: "NID & police-cleared pros",
    text: "Every technician is verified before they can accept a job.",
  },
  {
    icon: BadgeDollarSign,
    title: "Fair price guidance",
    text: "Ward-level rate ranges help you spot overcharging.",
  },
  {
    icon: Lock,
    title: "Milestone escrow",
    text: "Your money is released only after you inspect and approve the work.",
  },
];

// Animation Variants
const list: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.7, 0.2, 1],
    },
  },
};

const inputCls =
  "h-12 w-full rounded-[10px] border-[1.5px] border-[#c9d6cf] bg-white pl-11 pr-3.5 text-[15px] font-medium text-[#14281f] outline-none transition placeholder:text-[#7b8f84] focus:border-[#1c6b4a] focus:ring-4 focus:ring-[#1c6b4a]/20";

// Reusable Input Component
function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-semibold text-[#2c4439]"
      >
        {label}
      </label>

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

  // User Information
  const [role, setRole] = useState<"customer" | "worker">(
    "customer"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Selected Location
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  // Backend Location Data
  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

  const [locationError, setLocationError] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Load Divisions
  useEffect(() => {
    let active = true;

    apiJson<LocationOption[]>("/api/locations/divisions")
      .then((result) => {
        if (active) {
          setDivisions(result);
          setLocationError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setLocationError(
            err instanceof Error
              ? err.message
              : "Could not load divisions"
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoadingLocations(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Load Districts by Division
  useEffect(() => {
    if (!division) return;

    let active = true;

    apiJson<LocationOption[]>(
      `/api/locations/districts?division=${encodeURIComponent(division)}`
    )
      .then((result) => {
        if (active) {
          setDistricts(result);
          setLocationError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setLocationError(
            err instanceof Error
              ? err.message
              : "Could not load districts"
          );
        }
      });

    return () => {
      active = false;
    };
  }, [division]);

  // Load Upazilas by District
  useEffect(() => {
    if (!division || !district) return;

    let active = true;

    apiJson<LocationOption[]>(
      `/api/locations/upazilas?division=${encodeURIComponent(
        division
      )}&district=${encodeURIComponent(district)}`
    )
      .then((result) => {
        if (active) {
          setUpazilas(result);
          setLocationError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setLocationError(
            err instanceof Error
              ? err.message
              : "Could not load upazilas"
          );
        }
      });

    return () => {
      active = false;
    };
  }, [division, district]);

  // Division Change
  function changeDivision(value: string) {
    setDivision(value);

    setDistrict("");
    setUpazila("");

    setDistricts([]);
    setUpazilas([]);

    setLocationError("");
  }

  // District Change
  function changeDistrict(value: string) {
    setDistrict(value);
    setUpazila("");
    setUpazilas([]);
    setLocationError("");
  }

  // Signup Submit
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!division || !district || !upazila) {
      setError(
        "Please select your Division, District and Upazila."
      );
      return;
    }

    const form = new FormData(e.currentTarget);

    setError("");
    setLoading(true);

    try {
      const response = await apiJson<AuthResponse>(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name: String(form.get("name") ?? "").trim(),
            email: String(form.get("email") ?? "").trim(),
            password: String(form.get("password") ?? ""),
            phone: String(form.get("phone") ?? "").trim(),

            // Backend-compatible location
            division,
            district,
            upazila,

            // Backend role: customer or worker
            role,
          }),
        }
      );

      saveAuth(response);

      // Update this after implementing dashboard routing.
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create your account. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid min-h-screen grid-cols-1 text-[#14281f] lg:grid-cols-[5fr_6fr]">

        {/* LEFT SIDE */}
        <section className="relative isolate flex flex-col justify-between gap-8 overflow-hidden bg-[#0f3d2e] px-6 py-8 text-white lg:px-14 lg:py-12">

          {/* Background Animation */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[url('/hero.jpg')] bg-cover bg-center"
            animate={{
              scale: [1, 1.08],
            }}
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
            variants={list}
            initial="hidden"
            animate="show"
            className="flex h-full flex-col justify-between gap-8"
          >

            {/* Logo */}
            <motion.div
              variants={item}
              className="flex items-center gap-2.5"
            >
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#e3f4ea] text-[#0f3d2e]">
                <ShieldCheck
                  size={20}
                  aria-hidden="true"
                />
              </span>

              <span className="text-xl font-bold">
                TrustHand
              </span>
            </motion.div>

            {/* Hero Content */}
            <div className="flex max-w-[480px] flex-col gap-5">

              <motion.span
                variants={item}
                className="text-xs font-semibold tracking-[0.12em] text-[#a8d9bf]"
              >
                TRUSTED LOCAL SERVICES ACROSS BANGLADESH
              </motion.span>

              <motion.h1
                variants={item}
                className="text-[40px] font-bold leading-[1.08] lg:text-[52px]"
              >
                Good help{" "}
                <span className="font-[family-name:var(--font-fraunces)] font-medium italic text-[#a8d9bf]">
                  starts here.
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="text-[17px] leading-relaxed text-[#d6eadf]"
              >
                Find verified neighbourhood craftsmen,
                get clear quotes, and pay safely in milestones.
              </motion.p>
            </div>

            {/* Trust Points */}
            <div className="flex max-w-[480px] flex-col gap-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <motion.div
                  key={title}
                  variants={item}
                  whileHover={{ x: 6 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                  }}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#a8d9bf]/25 bg-[#0c3426]/80 p-4 backdrop-blur-sm"
                >
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className="mt-0.5 flex-none text-[#a8d9bf]"
                  />

                  <div>
                    <div className="text-[15px] font-semibold">
                      {title}
                    </div>

                    <div className="mt-0.5 text-sm leading-normal text-[#cfe5d9]">
                      {text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={item}
              className="text-[13px] text-[#a8d9bf]"
            >
              TrustHand Civic Protocol
            </motion.div>
          </motion.div>
        </section>

        {/* RIGHT SIDE — SIGNUP FORM */}
        <section className="flex items-center justify-center bg-[#f7f8f5] px-5 py-8 lg:px-16 lg:py-12">

          <motion.form
            onSubmit={onSubmit}
            variants={list}
            initial="hidden"
            animate="show"
            className="flex w-full max-w-[440px] flex-col gap-[22px]"
          >

            {/* Customer / Worker Switch */}
            <motion.div
              variants={item}
              role="group"
              aria-label="Account type"
              className="relative grid grid-cols-2 gap-1 rounded-xl bg-[#e6ece8] p-1"
            >
              {(["customer", "worker"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={role === r}
                  onClick={() => setRole(r)}
                  className={`relative z-10 h-11 rounded-[9px] text-sm font-semibold transition-colors ${
                    role === r
                      ? "text-[#14583e]"
                      : "text-[#2c4439]"
                  }`}
                >
                  {role === r && (
                    <motion.span
                      layoutId="role-pill"
                      className="absolute inset-0 -z-10 rounded-[9px] bg-white shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}

                  {r === "customer"
                    ? "I need a service"
                    : "I offer services"}
                </button>
              ))}
            </motion.div>

            {/* Heading */}
            <motion.div variants={item}>
              <h2 className="text-[30px] font-bold leading-tight">
                Create your account
              </h2>

              <p className="mt-2 text-[15px] text-[#3d5247]">
                Find trusted local help across Bangladesh
                in under a minute.
              </p>
            </motion.div>

            {/* Registration Fields */}
            <div className="flex flex-col gap-4">

              {/* Full Name */}
              <motion.div variants={item}>
                <Field
                  id="name"
                  label="Full name"
                  icon={User}
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Begum Rokeya"
                    className={inputCls}
                  />
                </Field>
              </motion.div>

              {/* Email and Phone */}
              <motion.div
                variants={item}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <Field
                  id="email"
                  label="Email"
                  icon={Mail}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>

                <Field
                  id="phone"
                  label="Mobile number"
                  icon={Phone}
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    className={inputCls}
                  />
                </Field>
              </motion.div>

              {/* Dynamic Location Selectors */}
              <motion.div
                variants={item}
                className="flex flex-col gap-3"
              >

                {/* Division */}
                <Field
                  id="division"
                  label="Division"
                  icon={MapPin}
                >
                  <select
                    id="division"
                    name="division"
                    required
                    value={division}
                    onChange={(e) =>
                      changeDivision(e.target.value)
                    }
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="">
                      {loadingLocations
                        ? "Loading divisions…"
                        : "Select division"}
                    </option>

                    {divisions.map((d) => (
                      <option
                        key={d.name}
                        value={d.name}
                      >
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* District */}
                  <Field
                    id="district"
                    label="District"
                    icon={MapPin}
                  >
                    <select
                      id="district"
                      name="district"
                      required
                      value={district}
                      disabled={
                        !division || districts.length === 0
                      }
                      onChange={(e) =>
                        changeDistrict(e.target.value)
                      }
                      className={`${inputCls} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="">
                        Select district
                      </option>

                      {districts.map((d) => (
                        <option
                          key={d.name}
                          value={d.name}
                        >
                          {d.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]"
                    />
                  </Field>

                  {/* Upazila */}
                  <Field
                    id="upazila"
                    label="Upazila / Thana"
                    icon={MapPin}
                  >
                    <select
                      id="upazila"
                      name="upazila"
                      required
                      value={upazila}
                      disabled={
                        !district || upazilas.length === 0
                      }
                      onChange={(e) =>
                        setUpazila(e.target.value)
                      }
                      className={`${inputCls} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="">
                        Select upazila
                      </option>

                      {upazilas.map((u) => (
                        <option
                          key={u.name}
                          value={u.name}
                        >
                          {u.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6f8a7c]"
                    />
                  </Field>
                </div>

                {/* Location API Error */}
                {locationError && (
                  <p
                    role="alert"
                    className="text-sm text-red-700"
                  >
                    Location API: {locationError}
                  </p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={item}>
                <Field
                  id="password"
                  label="Password"
                  icon={Lock}
                >
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`${inputCls} pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
                    className="absolute right-1.5 top-1 flex size-10 items-center justify-center rounded-lg text-[#14583e] transition hover:bg-[#e6ece8]"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </Field>

                <p className="mt-1.5 text-[13px] text-[#3d5247]">
                  Use 8+ characters with a mix of letters
                  and numbers.
                </p>
              </motion.div>
            </div>

            {/* Terms */}
            <motion.label
              variants={item}
              className="flex items-start gap-2.5 text-sm leading-normal text-[#2c4439]"
            >
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-0.5 size-5 flex-none accent-[#14583e]"
              />

              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#14583e] underline"
                >
                  Terms of Service
                </Link>
                ,{" "}
                <Link
                  href="/privacy"
                  className="text-[#14583e] underline"
                >
                  Privacy Policy
                </Link>
                {" "}and{" "}
                <Link
                  href="/fair-price-code"
                  className="text-[#14583e] underline"
                >
                  Fair Price Code
                </Link>
                .
              </span>
            </motion.label>

            {/* Error Message */}
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x: [0, -6, 6, -4, 4, 0],
                }}
                transition={{ duration: 0.4 }}
                className="rounded-[10px] bg-[#fdecea] px-3.5 py-3 text-sm text-[#8a1f17]"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              variants={item}
              type="submit"
              disabled={loading}
              whileHover={
                loading
                  ? undefined
                  : {
                      y: -2,
                      boxShadow:
                        "0 8px 20px rgba(20,88,62,0.28)",
                    }
              }
              whileTap={
                loading
                  ? undefined
                  : { scale: 0.98 }
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

              {loading
                ? "Creating account…"
                : "Create account"}
            </motion.button>

            {/* Login Link */}
            <motion.p
              variants={item}
              className="text-center text-[15px] text-[#3d5247]"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#14583e] underline"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.form>
        </section>
      </div>
    </MotionConfig>
  );
}
