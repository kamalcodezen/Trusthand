import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-trust-footer)] text-white font-['Manrope'] pt-16 pb-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full global-pos">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-16 border-b border-[#2A4D3E]">
          
          {/* Brand Info (Takes 2 columns on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-[var(--color-trust-footer)]">
                <Wrench size={18} strokeWidth={2.2} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                TrustHand
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              Reliable help. Right around you.
            </p>

            <p className="text-xs leading-relaxed text-[#A3C1B4] max-w-sm">
              Elevating informal neighborhood services into verified, dignified, and accountable livelihoods across urban Dhaka with police-checked professionals and fair rate benchmarks.
            </p>
          </div>

          {/* Column 1: Skilled Trades */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Skilled Trades
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
              <li>
                <Link href="/services/electricians" className="transition-colors hover:text-white">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/services/plumbers" className="transition-colors hover:text-white">
                  Plumbers &amp; Sanitary
                </Link>
              </li>
              <li>
                <Link href="/services/ac-care" className="transition-colors hover:text-white">
                  Inverter AC Care
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="transition-colors hover:text-white">
                  Appliance Mechanics
                </Link>
              </li>
              <li>
                <Link href="/services/painting" className="transition-colors hover:text-white">
                  Painting &amp; Polish
                </Link>
              </li>
              <li>
                <Link href="/services/carpentry" className="transition-colors hover:text-white">
                  Carpentry &amp; Woodwork
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
              <li>
                <Link href="/workers" className="transition-colors hover:text-white">
                  Explore Craftsmen
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="transition-colors hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="transition-colors hover:text-white">
                  Trust &amp; Safety
                </Link>
              </li>
              <li>
                <Link href="/onboarding/professional" className="transition-colors hover:text-white">
                  Worker Onboarding
                </Link>
              </li>
              <li>
                <Link href="/pricing-guide" className="transition-colors hover:text-white">
                  Fair Pricing Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dhaka Zones */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Dhaka Zones
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3C1B4]">
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Gulshan 1 &amp; 2</span>
              </li>
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Banani &amp; Baridhara</span>
              </li>
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Dhanmondi &amp; Lalmatia</span>
              </li>
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Uttara (Sectors 1-14)</span>
              </li>
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Mirpur DOHS</span>
              </li>
              <li>
                <span className="transition-colors hover:text-white cursor-pointer">Bashundhara R/A</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3C1B4]">
          <p>© 2026 TrustHand Bangladesh Technologies Ltd. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/worker-code-of-conduct" className="transition-colors hover:text-white">
              Worker Code of Conduct
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}