import { CheckCircle2, AlertCircle } from "lucide-react";

export default function MarketIntelligence() {
  return (
    <section className="bg-[#FAF9F5] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full global-pos">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Side Content */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#245B46] sm:text-xs mb-3">
              Market Intelligence
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#1B2A23] sm:text-4xl leading-tight">
              A little clarity before you choose.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[#7F8B84] sm:text-base">
              No more uncertainty about whether you are being overcharged. TrustHand analyzes recent completed jobs in your neighborhood to provide expected diagnostic and labor envelopes.
            </p>

            {/* Transparent Advisory Box */}
            <div className="mt-6 rounded-2xl border border-[#E6E7E3] bg-white p-5 shadow-sm">
              <h4 className="text-xs font-bold text-[#1B2A23] uppercase tracking-wider mb-2">
                Transparent Advisory:
              </h4>
              <p className="text-xs leading-relaxed text-[#7F8B84]">
                All matrix estimates are based on recent Dhaka neighborhood tickets. Final quotations depend on required genuine parts, copper pipe runs, and height access.
              </p>
            </div>
          </div>

          {/* Right Side Interactive/Preview Card */}
          <div className="rounded-[28px] border border-[#E6E7E3] bg-white p-6 shadow-sm sm:p-8">
            {/* Card Top Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#ECEDE8]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#245B46] animate-pulse" />
                <span className="text-xs font-bold text-[#1B2A23]">Live Benchmark Preview</span>
              </div>
              <span className="rounded-full bg-[#E5EFE6] px-3 py-1 text-[11px] font-bold text-[#245B46]">
                Banani: 28 completed jobs
              </span>
            </div>

            {/* Service & Location Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 my-6">
              <div className="rounded-xl bg-[#FAF9F5] p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8B84]">Service</span>
                <p className="mt-1 text-sm font-bold text-[#1B2A23]">Inverter AC Master Jet Wash</p>
                <p className="text-xs text-[#9BA8A0] mt-0.5">Split 1.5 - 2.0 Ton</p>
              </div>

              <div className="rounded-xl bg-[#FAF9F5] p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8B84]">Location Zone</span>
                <p className="mt-1 text-sm font-bold text-[#1B2A23]">Banani (Roads 1-27)</p>
                <p className="text-xs text-[#9BA8A0] mt-0.5">Residential apartments</p>
              </div>
            </div>

            {/* Indicative Price Banner */}
            <div className="rounded-2xl bg-[#184C3B] p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3C1B4]">
                  Indicative Labor & Diagnostic
                </span>
                <div className="mt-1 text-2xl font-black tracking-tight">
                  ৳1,400 – ৳1,800
                </div>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#2F6854] pt-3 sm:pt-0 sm:pl-4">
                <span className="text-xs font-bold block text-white">Full Jet Wash Included</span>
                <span className="text-[11px] text-[#A3C1B4]">Typical duration: ~90 mins</span>
              </div>
            </div>

            {/* Feature List Items */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#526159]">
                <CheckCircle2 size={15} className="shrink-0 text-[#245B46]" />
                <span>Includes indoor coil high-pressure wash with protective catchment bag</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#526159]">
                <CheckCircle2 size={15} className="shrink-0 text-[#245B46]" />
                <span>Outdoor condenser fin cleaning &amp; compressor amp draw testing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-[#7F8B84] pt-2 border-t border-[#ECEDE8]">
                <AlertCircle size={15} className="shrink-0 text-amber-500" />
                <span className="text-[11px]">Freon R32 / R410 refrigerant refill quoted separately if copper leak detected</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}