
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden border-b border-[#EBEDE9] bg-[#F5F5F5] font-['Manrope']">
      <div className="mx-auto grid min-h-[438px] max-w-[1440px] grid-cols-1 items-center gap-12 px-[5.2%] py-[65px] md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:gap-[5%] lg:py-[75px]">

        {/* LEFT CONTENT */}
        <div className="flex flex-col items-start">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-[7px] rounded-full bg-[#E5EFE6] px-[10px] py-[5px]">
            <span className="size-[5px] rounded-full bg-[#1A7A50]" />
            <span className="text-[8px] font-extrabold uppercase tracking-[0.25px] text-[#245B46]">
              Neighbourhood Skilled Trades · Dhaka
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-[21px] text-[36px] font-extrabold leading-[1.08] tracking-[-1.8px] text-[#1B2A23] sm:text-[42px] md:text-[clamp(34px,4.3vw,58px)]">
            Good hands. Great work.
            <span className="mt-[2px] block font-serif text-[1.06em] font-normal italic leading-[1.1] tracking-[-1.6px] text-[#184C3B]">
              Right around you.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-[24px] max-w-[385px] text-[11px] font-medium leading-[19px] text-[#708078] sm:text-[12px] sm:leading-[20px]">
            From emergency electrical repairs to inverter AC
            servicing, connect directly with verified
            neighborhood craftsmen in Dhaka. Compare honest
            quotes with total transparency.
          </p>

          {/* Trust Indicators */}
          <div className="mt-[39px] flex flex-wrap items-center gap-x-[17px] gap-y-[12px]">

            <div className="flex items-center gap-[4px]">
              <CheckCircle2
                size={11}
                strokeWidth={1.8}
                className="text-[#16915C]"
              />
              <span className="whitespace-nowrap text-[8px] font-medium text-[#607269]">
                100% NID Authenticated
              </span>
            </div>

            <div className="flex items-center gap-[4px]">
              <LockKeyhole
                size={10}
                strokeWidth={1.8}
                className="text-[#16915C]"
              />
              <span className="whitespace-nowrap text-[8px] font-medium text-[#607269]">
                Zero Upfront Brokerage
              </span>
            </div>

            <div className="flex items-center gap-[4px]">
              <Star
                size={11}
                strokeWidth={1.8}
                className="text-[#16915C]"
              />
              <span className="whitespace-nowrap text-[8px] font-medium text-[#607269]">
                4.9/5 Average Review Score
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mx-auto w-full max-w-[460px] md:ml-auto">

          {/* Image Frame */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[17px] border-[6px] border-white bg-[#E9ECE8] shadow-[0_12px_35px_rgba(27,42,35,0.04)]">

            {/* Replace image with your own */}
            <Image
              src="/images/hero-worker.jpg"
              alt="TrustHand verified skilled electrician working"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 40vw"
              className="rounded-[11px] object-cover object-center"
            />

            {/* Animated verification card */}
            <motion.div
              initial={false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -4, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[10px] left-[10px] right-[10px] z-10"
            >
              <div className="flex items-center justify-between gap-[7px] rounded-[13px] border border-white/80 bg-[#FAFBF9]/95 px-[10px] py-[10px] shadow-[0_5px_20px_rgba(20,50,35,0.10)] backdrop-blur-sm">

                {/* Worker Details */}
                <div className="flex min-w-0 items-center gap-[8px]">

                  <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#E5EFE6]">
                    <ShieldCheck
                      size={14}
                      strokeWidth={1.9}
                      className="text-[#184C3B]"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-[3px]">
                      <h3 className="truncate text-[9px] font-extrabold text-[#1B2A23]">
                        Md. Rafiqul Islam
                      </h3>

                      <BadgeCheck
                        size={11}
                        fill="#18885B"
                        stroke="white"
                        strokeWidth={2}
                        className="shrink-0"
                      />
                    </div>

                    <p className="mt-[3px] truncate text-[7px] font-medium text-[#839087]">
                      Gulshan 2 · Master Electrician
                    </p>
                  </div>

                </div>

                {/* NID Verified */}
                <div className="flex shrink-0 items-center gap-[3px] rounded-full bg-[#E6F1E8] px-[6px] py-[5px]">
                  <CheckCircle2
                    size={9}
                    strokeWidth={2}
                    className="text-[#168153]"
                  />

                  <span className="whitespace-nowrap text-[7px] font-bold text-[#245B46]">
                    100% NID Checked
                  </span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
