
"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Clock3,
  ThumbsUp,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  footnote: string;
  icon: LucideIcon;
  emphasis?: boolean;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Describe Work",
    description:
      "Provide a short note of what needs fixing, pick your sector, and attach photos or voice details.",
    footnote: "60 seconds",
    icon: Clock3,
  },
  {
    number: "02",
    title: "Get Guidance",
    description:
      "Instantly view calibrated indicative price ranges based on completed Dhaka tickets.",
    footnote: "Fair pricing shield",
    icon: TrendingUp,
    emphasis: true,
  },
  {
    number: "03",
    title: "Compare Quotes",
    description:
      "Receive quotes directly from nearby verified artisans. Check ratings, NID status, and badges.",
    footnote: "Direct artisan pricing",
    icon: BriefcaseBusiness,
  },
  {
    number: "04",
    title: "Track Milestone",
    description:
      'Accept a technician and follow clear live statuses from "On The Way" through repair diagnostics.',
    footnote: "Live arrival alerts",
    icon: TriangleAlert,
  },
  {
    number: "05",
    title: "Sign Off & Pay",
    description:
      "Inspect completed repair work, settle directly via cash or bKash, and leave an authentic review.",
    footnote: "Dignified livelihood",
    icon: ThumbsUp,
    emphasis: true,
  },
];

const itemMotion = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Process() {
  return (
    <section
      id="how-it-works"
      className="bg-[#FAF9F5] px-[5.6%] pb-[75px] pt-[76px] font-['Manrope'] text-[#1B2A23]"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-[510px] text-center"
        >
          <p className="text-[8px] font-extrabold uppercase tracking-[1px] text-[#245B46]">
            Transparent Process
          </p>

          <h2 className="mx-auto mt-[7px] max-w-[470px] text-[23px] font-extrabold leading-[1.15] tracking-[-0.8px] sm:text-[24px]">
            From problem to solved, without the guesswork.
          </h2>

          <p className="mx-auto mt-[9px] max-w-[440px] text-[10px] font-medium leading-[15px] text-[#7F8B84]">
            No street bargaining or unpredictable stranger calls.
            Direct clarity from request to completion.
          </p>
        </motion.div>

        {/* Five process cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.09 }}
          className="mt-[51px] grid grid-cols-1 gap-[15px] sm:grid-cols-2 md:grid-cols-5"
        >
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                variants={itemMotion}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4 }}
                className="flex min-h-[165px] flex-col rounded-[17px] border border-[#E6E7E3] bg-white px-[15px] pb-[14px] pt-[16px] shadow-[0_1px_1px_rgba(27,42,35,0.04)]"
              >
                <div>
                  <span className="inline-flex rounded-full bg-[#E5EFE6] px-[8px] py-[3px] text-[8px] font-extrabold leading-[12px] text-[#245B46]">
                    Step {step.number}
                  </span>

                  <h3 className="mt-[12px] text-[10px] font-extrabold leading-[15px] tracking-[-0.15px] text-[#1B2A23]">
                    {step.title}
                  </h3>

                  <p className="mt-[6px] text-[8px] font-medium leading-[12.5px] text-[#7F8B84]">
                    {step.description}
                  </p>
                </div>

                {/* Bottom divider and label */}
                <div
                  className={`mt-auto flex items-center gap-[3px] border-t border-[#EFF0EC] pt-[9px] text-[7.5px] font-semibold leading-[12px] ${
                    step.emphasis
                      ? "text-[#23644B]"
                      : "text-[#9BA8A0]"
                  }`}
                >
                  <Icon
                    size={10}
                    strokeWidth={1.75}
                    className="shrink-0"
                  />
                  <span>{step.footnote}</span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
