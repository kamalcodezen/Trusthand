
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brush,
  Droplet,
  Fan,
  PaintRoller,
  Refrigerator,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface TradeService {
  title: string;
  description: string;
  price: string;
  workers: string;
  slug: string;
  icon: LucideIcon;
}

const services: TradeService[] = [
  {
    title: "Electrical Repair",
    description:
      "Concealed wiring, circuit breaker trip diagnostics, DB board maintenance, and generator changeovers.",
    price: "From ৳350",
    workers: "Browse 38+ Pros",
    slug: "electrical-repair",
    icon: Zap,
  },
  {
    title: "Plumbing & Water",
    description:
      "Leak detection behind tiles, pressure booster pump repair, geyser installation, and PPR re-routing.",
    price: "From ৳400",
    workers: "Browse 29+ Pros",
    slug: "plumbing-water",
    icon: Droplet,
  },
  {
    title: "Inverter AC Care",
    description:
      "Jet master pressure wash, nitrogen leak isolation, R32/R410 gas refills, and PCB board repairs.",
    price: "From ৳500",
    workers: "Browse 45+ Pros",
    slug: "inverter-ac-care",
    icon: Fan,
  },
  {
    title: "Appliance Repair",
    description:
      "Inverter refrigerators, front-loading washing machines, microwave magnetrons, and water purifiers.",
    price: "From ৳400",
    workers: "Browse 22+ Pros",
    slug: "appliance-repair",
    icon: Refrigerator,
  },
  {
    title: "Painting & Finishing",
    description:
      "Anti-damp wall treatment, fine luxury acrylic finishes, and artisanal wood polish & lacquer work.",
    price: "Free Estimate",
    workers: "Browse 31+ Pros",
    slug: "painting-finishing",
    icon: PaintRoller,
  },
  {
    title: "Deep Cleaning",
    description:
      "Post-renovation apartment overhaul, deep kitchen degreasing, and fabric sofa steam disinfection.",
    price: "From ৳1,200",
    workers: "Browse 18+ Crews",
    slug: "deep-cleaning",
    icon: Brush,
  },
];

const cardMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Service() {
  return (
    <section
      id="services"
      className="bg-[#F4F2EE] px-[4.1%] pb-[71px] pt-[78px] font-['Manrope'] text-[#1B2A23]"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[8px] font-extrabold uppercase tracking-[0.8px] text-[#245B46]">
              Our Services
            </p>

            <h2 className="mt-[6px] text-[22px] font-extrabold leading-[1.25] tracking-[-0.65px]">
              Thoughtful craft for every corner of your home.
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-[4px] pb-[2px] text-[9px] font-extrabold text-[#245B46] transition-opacity hover:opacity-70"
          >
            View all trade categories
            <ArrowRight size={10} strokeWidth={1.7} />
          </Link>
        </motion.div>

        {/* Service grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.075 }}
          className="mt-[40px] grid grid-cols-1 gap-x-[20px] gap-y-[28px] sm:grid-cols-2 md:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.slug}
                variants={cardMotion}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
                whileHover={{ y: -5 }}
                className="flex min-h-[198px] flex-col rounded-[17px] border border-[#E6E7E3] bg-[#FAF9F5] px-[20px] pb-[18px] pt-[20px] shadow-[0_1px_1px_rgba(27,42,35,0.035)]"
              >
                {/* Service icon */}
                <span className="grid size-[30px] shrink-0 place-items-center rounded-[10px] bg-[#E5EFE6] text-[#245B46]">
                  <Icon
                    size={16}
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                </span>

                {/* Service heading */}
                <h3 className="mt-[16px] text-[13px] font-extrabold leading-[17px] tracking-[-0.22px]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-[6px] text-[9.5px] font-medium leading-[14.5px] text-[#7F8B84]">
                  {service.description}
                </p>

                {/* Bottom pricing and link */}
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#ECEDE8] pt-[10px]">
                  <span className="whitespace-nowrap rounded-full bg-[#E5EFE6] px-[7px] py-[3px] text-[9px] font-extrabold leading-[12px] text-[#245B46]">
                    {service.price}
                  </span>

                  <Link
                    href={`/services?category=${service.slug}`}
                    aria-label={`Browse ${service.title} professionals`}
                    className="inline-flex items-center gap-[3px] whitespace-nowrap text-[9px] font-bold text-[#526159] transition-colors hover:text-[#184C3B]"
                  >
                    {service.workers}
                    <ArrowRight
                      size={10}
                      strokeWidth={1.7}
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
