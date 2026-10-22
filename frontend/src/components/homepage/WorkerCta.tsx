import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function WorkerCta() {
  return (
    <section className="bg-[var(--color-trust-bg-light)] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full global-pos">
        {/* Main Dark Green Banner Box */}
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-trust-footer)] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 text-white shadow-xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            
            {/* Left Content */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#A3C1B4] sm:text-xs mb-3">
                For Skilled Tradespeople
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
                Your craft deserves to be valued.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#A3C1B4] sm:text-base max-w-xl">
                Are you an experienced electrician, plumber, AC expert, or appliance mechanic in Dhaka? Join TrustHand to connect directly with dignified homeowners with 0% platform commission cuts.
              </p>

              {/* Feature Checkpoints */}
              <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#4E9F74]" />
                  <span>Build verified reputation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#4E9F74]" />
                  <span>100% direct payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#4E9F74]" />
                  <span>Work close to home</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <Link
                  href="/onboarding/professional"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-[var(--color-trust-footer)] transition-transform duration-300 hover:scale-105 shadow-md"
                >
                  Apply as a Professional
                  <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </div>

            {/* Right Side Professional Image (New High Quality Electrician/Technician Image) */}
            <div className="mx-auto w-full max-w-[380px] lg:max-w-none flex justify-center">
              <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[340px] rounded-2xl overflow-hidden border border-[#2A4D3E] shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=85"
                  alt="Skilled technician working professionally"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}