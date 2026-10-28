import Image from "next/image";

const trustFeatures = [
    {
        title: "NID Database Authentication",
        description:
            "Every artisan is verified with official ID records, residence addresses, and verified peer references.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        ),
    },
    {
        title: "Direct Technician Rates",
        description:
            "Zero commission surprises. 100% of your labor fee goes straight to the craftsman who did the hard work.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M3 10h18M8 15h3" />
            </svg>
        ),
    },
    {
        title: "Police & Background Checked",
        description:
            "Clear police records ensure peace of mind before any service professional steps across your threshold.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        title: "Milestone Accountability",
        description:
            "Technicians follow clear standards, diagnostics, and agreed pricing. No arbitrary invoices or surprise extra fees.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z" />
                <path d="M12 8v4m0 3h.01" />
            </svg>
        ),
    },
];

export default function TrustStandards() {
    return (
        <section className="bg-[#f5f2ed] px-4 py-12 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full global-pos items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                {/* Technician Image */}
                <div className="mx-auto w-full max-w-[450px] lg:max-w-none">
                    <div className="rounded-[24px] border border-white bg-white p-2 shadow-sm">
                        <div className="relative h-[320px] w-full sm:h-[390px] lg:h-[420px]">
                            <Image
                                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85"
                                alt="Professional technician working with electrical equipment"
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
                                className="rounded-[18px] object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Trust Standards Content */}
                <div className="w-full">
                    <div className="mb-7">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#27664f] sm:text-xs">
                            Uncompromising Standards
                        </p>

                        <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#202923] sm:text-4xl">
                            More confidence in every connection.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#777870] sm:text-base">
                            For years, finding skilled hands meant blind neighborhood
                            word-of-mouth. TrustHand brings dignity, verification, and
                            honest accountability back to urban home maintenance.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {trustFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-white/80 bg-white/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9ded3] hover:bg-white hover:shadow-md sm:p-6"
                            >
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f0e9] text-[#28664f]">
                                    {feature.icon}
                                </div>

                                <h3 className="text-sm font-bold leading-6 text-[#28332c] sm:text-base">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-xs leading-6 text-[#85857e] sm:text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}