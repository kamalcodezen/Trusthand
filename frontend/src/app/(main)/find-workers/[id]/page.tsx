import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, CheckCircle2, ShieldCheck, Wrench, Zap, ShieldAlert } from "lucide-react";
import { WorkerData } from "@/components/FindWorkers/Card";
import InstantDispatchCard from "@/components/FindWorkers/WorkerDetails/InstantDispatchCard";
import WorkerSidebarCard from "@/components/FindWorkers/WorkerDetails/WorkerSidebarCard";
import WorkerAboutCard from "@/components/FindWorkers/WorkerDetails/WorkerAboutCard";

// Mock Workers Data with Dynamic Services
const mockWorkersData: WorkerData[] = [
    {
        id: "worker-1",
        name: "Md. Rafiqul Islam",
        role: "Master Electrician",
        experience: "12 yrs exp",
        location: "Gulshan 1 & 2, Banani",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
        tags: ["3-Phase DB Board", "Concealed Wiring", "Solar Inverter"],
        completedJobs: 118,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
        services: [
            {
                title: "Emergency Short Circuit & Tripping Diagnosis",
                badge: "60-min SLA",
                description: "Complete multimeter & megger leak identification, phase imbalance checks, and isolation of shorted circuits.",
                price: "৳350",
                priceSub: "Credited toward repair invoice",
            },
            {
                title: "Full DB Board Rewiring & MCB Upgrade",
                badge: "Comprehensive",
                description: "Removal of hazardous burnt busbars, phase comb installation, Schneider/Hager MCB mounting, and complete circuit labeling.",
                price: "৳1,800 – ৳3,200",
                priceSub: "Labor only (Varies by circuits)",
            },
            {
                title: "Inverter / IPS Heavy Load Wiring",
                badge: "Custom Relay",
                description: "Segregation of non-inverter loads (ACs/Geysers) to prevent battery deep-discharge tripping; bypass knife-switch calibration.",
                price: "৳1,200 – ৳2,000",
                priceSub: "Depending on switchboard runs",
            },
        ],
    },
    {
        id: "worker-2",
        name: "Tanveer Hossain",
        role: "Senior AC Technician",
        experience: "8 yrs exp",
        location: "Banani & Baridhara Diplomatic",
        rating: 4.9,
        badgeText: "TOP RATED",
        avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        tags: ["Jet Wash Overhaul", "R32 Gas Refill", "PCB Repair"],
        completedJobs: 94,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)",
        services: [
            {
                title: "AC Deep Jet Wash & Chemical Servicing",
                badge: "Standard",
                description: "High-pressure indoor coil wash, outdoor condenser chemical cleaning, and drainage pipe flushing.",
                price: "৳800 – ৳1,200",
                priceSub: "Per indoor & outdoor unit",
            },
            {
                title: "Gas Leak Detection & R32/R410 Refill",
                badge: "Critical",
                description: "Pressure testing with nitrogen, brazing leak points, vacuum evacuation, and accurate refrigerant top-up.",
                price: "৳1,500 – ৳3,500",
                priceSub: "Includes gas weight calculation",
            },
        ],
    },
    {
        id: "worker-3",
        name: "Sumon Mia",
        role: "Master Plumber & Sanitary",
        experience: "4 yrs exp",
        location: "Gulshan 1, Niketan, Tejgaon",
        rating: 4.8,
        badgeText: "EMERGENCY READY",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        tags: ["PPR Pipe Leak", "Booster Pump Setup", "Concealed Cistern"],
        completedJobs: 162,
        diagnosticFee: 300,
        verificationBadge: "Ward Certified",
        services: [
            {
                title: "PPR / UPVC Pipe Leak Repair",
                badge: "Emergency",
                description: "Hot-gun welding for concealed or surface leakage points with pressure testing.",
                price: "৳500 – ৳1,000",
                priceSub: "Per joint/fitting",
            },
        ],
    },
    {
        id: "worker-4",
        name: "Jahangir Alam",
        role: "Appliance Specialist",
        experience: "7 yrs exp",
        location: "Banani DOHS, Mohakhali",
        rating: 4.7,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        tags: ["Inverter Refrigerator", "Microwave Magnetron", "Washing Drum"],
        completedJobs: 87,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
        services: [
            {
                title: "Inverter Refrigerator Gas & Compressor Diagnostic",
                badge: "Advanced",
                description: "Checking dual-inverter PCB signals, capillary choking, and copper brazing.",
                price: "৳1,200 – ৳3,000",
                priceSub: "Excludes parts",
            },
        ],
    },
    {
        id: "worker-5",
        name: "Kabir Ahmed",
        role: "House Painter & Duco Polish",
        experience: "15 yrs exp",
        location: "Gulshan 2 & Baridhara",
        rating: 5.0,
        badgeText: "MASTER PAINTER",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
        tags: ["Anti-Damp Treatment", "Duco Spray", "Italian Texture"],
        completedJobs: 210,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)",
        services: [
            {
                title: "Anti-Damp Chemical Wall Treatment",
                badge: "Heavy Duty",
                description: "Drilling, damp-proof liquid injection, plaster scraping, and waterproof skim coating.",
                price: "৳250 – ৳450",
                priceSub: "Per sq. ft.",
            },
        ],
    },
    {
        id: "worker-6",
        name: "Nasir Uddin",
        role: "Master Mason & Tiler",
        experience: "3 yrs exp",
        location: "Banani, Gulshan 1, Badda",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        tags: ["Granite Fitting", "Waterproofing Epoxy", "Bathroom Slope"],
        completedJobs: 140,
        diagnosticFee: 450,
        verificationBadge: "Ward Certified",
        services: [
            {
                title: "Bathroom Floor Waterproofing & Tiling",
                badge: "Epoxy",
                description: "Complete chemical membrane coating and precision slope correction for water drainage.",
                price: "৳3,500 – ৳7,000",
                priceSub: "Per standard bathroom",
            },
        ],
    },
    {
        id: "worker-7",
        name: "Arifur Rahman",
        role: "Master Electrician",
        experience: "9 yrs exp",
        location: "Gulshan 1 & 2, Banani",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
        tags: ["3-Phase DB Board", "Concealed Wiring", "Solar Inverter"],
        completedJobs: 118,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
        services: [
            {
                title: "Emergency Short Circuit & Tripping Diagnosis",
                badge: "60-min SLA",
                description: "Complete multimeter & megger leak identification, phase imbalance checks, and isolation of shorted circuits.",
                price: "৳350",
                priceSub: "Credited toward repair invoice",
            },
        ],
    },
    {
        id: "worker-8",
        name: "Kamal Hossain",
        role: "Senior AC Technician",
        experience: "5 yrs exp",
        location: "Banani & Baridhara Diplomatic",
        rating: 4.9,
        badgeText: "TOP RATED",
        avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        tags: ["Jet Wash Overhaul", "R32 Gas Refill", "PCB Repair"],
        completedJobs: 94,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)",
        services: [
            {
                title: "AC Deep Jet Wash & Chemical Servicing",
                badge: "Standard",
                description: "High-pressure indoor coil wash, outdoor condenser chemical cleaning, and drainage pipe flushing.",
                price: "৳800 – ৳1,200",
                priceSub: "Per indoor & outdoor unit",
            },
        ],
    },
    {
        id: "worker-9",
        name: "Rakib Hasan",
        role: "Master Plumber & Sanitary",
        experience: "11 yrs exp",
        location: "Gulshan 1, Niketan, Tejgaon",
        rating: 4.8,
        badgeText: "EMERGENCY READY",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        tags: ["PPR Pipe Leak", "Booster Pump Setup", "Concealed Cistern"],
        completedJobs: 162,
        diagnosticFee: 300,
        verificationBadge: "Ward Certified",
        services: [
            {
                title: "PPR / UPVC Pipe Leak Repair",
                badge: "Emergency",
                description: "Hot-gun welding for concealed or surface leakage points with pressure testing.",
                price: "৳500 – ৳1,000",
                priceSub: "Per joint/fitting",
            },
        ],
    },
];

interface WorkerDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WorkerDetailsPage({ params }: WorkerDetailsPageProps) {
    const { id } = await params;
    const worker = mockWorkersData.find((w) => w.id === id);

    if (!worker) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[var(--color-trust-bg-light)] font-['Manrope'] pb-16">
            {/* Top Verification Banner */}
            <div className="bg-[var(--color-trust-bg-surface)] border-b border-[var(--color-trust-border-light)] py-2.5 px-4 sm:px-6 lg:px-10 text-xs font-semibold text-[var(--color-trust-text-muted)]">
                <div className="mx-auto w-full global-pos flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[var(--color-trust-green-main)]">
                        <span className="size-2 rounded-full bg-[var(--color-trust-green-main)] animate-pulse" />
                        VERIFIED ARTISAN IDENTITY:{" "}
                        <span className="text-[var(--color-trust-text-main)] font-medium">
                            Dhaka North Municipal Clearance Validated for Q2 2025
                        </span>
                    </span>
                    <span className="flex items-center gap-1 text-[var(--color-trust-text-subtle)]">
                        <ShieldCheck className="size-4 text-[var(--color-trust-green-main)]" />
                        Secure Escrow Protection Guarantee
                    </span>
                </div>
            </div>

            <div className="py-6 px-4 sm:px-6 lg:px-10">
                <div className="mx-auto w-full global-pos">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-[var(--color-trust-text-muted)] mb-6">
                        <Link href="/" className="hover:text-[var(--color-trust-text-main)]">Home</Link>
                        <span>/</span>
                        <Link href="/find-workers" className="hover:text-[var(--color-trust-text-main)]">Find Workers</Link>
                        <span>/</span>
                        <span className="font-semibold text-[var(--color-trust-text-main)]">
                            {worker.name} ({worker.role})
                        </span>
                    </nav>

                    {/* Main Layout Grid: Left Content & Right Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                        
                        {/* Left Main Content Area */}
                        <div className="space-y-8">
                            {/* Main Hero Card */}
                            <div className="rounded-3xl bg-white border border-[var(--color-trust-border)] p-6 sm:p-8 shadow-sm">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="relative size-32 sm:size-36 rounded-2xl overflow-hidden shrink-0 bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] shadow-sm">
                                            <Image src={worker.avatar} alt={worker.name} fill className="object-cover" />
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-trust-green-main)] px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-white shadow">
                                                ● ON DUTY NOW
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                                <h1 className="text-2xl font-extrabold text-[var(--color-trust-text-main)]">{worker.name}</h1>
                                                <CheckCircle2 className="size-5 fill-[var(--color-trust-green-main)] text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-[var(--color-trust-text-muted)]">
                                                {worker.role} · {worker.experience} · {worker.location}
                                            </p>
                                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1.5 pt-1">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-trust-text-subtle)]">
                                                    <CheckCircle2 className="size-3 text-[var(--color-trust-green-main)]" />
                                                    {worker.verificationBadge}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] p-3.5 flex items-center gap-4 shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="size-5 fill-amber-400 text-amber-400" />
                                            <div>
                                                <div className="text-base font-extrabold text-[var(--color-trust-text-main)]">{worker.rating}</div>
                                                <div className="text-[9px] text-[var(--color-trust-text-muted)] font-semibold uppercase">Rating</div>
                                            </div>
                                        </div>
                                        <div className="h-6 w-px bg-[var(--color-trust-border)]" />
                                        <div>
                                            <div className="text-xs font-extrabold text-[var(--color-trust-text-main)]">{worker.completedJobs} Jobs</div>
                                            <div className="text-[10px] text-[var(--color-trust-green-main)] font-semibold">99.4% On-time</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] p-4 italic text-xs font-medium text-[var(--color-trust-text-main)]">
                                    “Specialized in {worker.tags.join(", ")} with zero arbitrary callout markups.”
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-[var(--color-trust-border-light)]">
                                    <div className="p-3 rounded-xl bg-[var(--color-trust-bg-surface)]">
                                        <div className="text-[9px] font-bold uppercase text-[var(--color-trust-text-muted)]">Track Record</div>
                                        <div className="text-sm font-extrabold text-[var(--color-trust-text-main)] mt-0.5">{worker.experience}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[var(--color-trust-bg-surface)]">
                                        <div className="text-[9px] font-bold uppercase text-[var(--color-trust-text-muted)]">Trust Execution</div>
                                        <div className="text-sm font-extrabold text-[var(--color-trust-text-main)] mt-0.5">{worker.completedJobs} Orders</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[var(--color-trust-bg-surface)]">
                                        <div className="text-[9px] font-bold uppercase text-[var(--color-trust-text-muted)]">Inspection Fee</div>
                                        <div className="text-sm font-extrabold text-[var(--color-trust-text-main)] mt-0.5">৳{worker.diagnosticFee} Callout</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[var(--color-trust-bg-surface)]">
                                        <div className="text-[9px] font-bold uppercase text-[var(--color-trust-text-muted)]">Response Velocity</div>
                                        <div className="text-sm font-extrabold text-[var(--color-trust-text-main)] mt-0.5">45-Min SLA</div>
                                    </div>
                                </div>
                            </div>

                            {/* About Component */}
                            <WorkerAboutCard worker={worker} />

                            {/* Core Competencies */}
                            <div className="rounded-3xl bg-white border border-[var(--color-trust-border)] p-6 sm:p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-extrabold text-[var(--color-trust-text-main)] flex items-center gap-2">
                                        <Zap className="size-5 text-[var(--color-trust-green-main)]" />
                                        Core Competencies
                                    </h2>
                                    <span className="text-[10px] font-bold text-[var(--color-trust-text-muted)]">Click tags for scope details</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {worker.tags.map((tag, idx) => (
                                        <span key={idx} className="rounded-xl bg-[var(--color-trust-bg-surface)] border border-[var(--color-trust-border-light)] px-3.5 py-2 text-xs font-bold text-[var(--color-trust-text-main)] flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-[var(--color-trust-green-main)]" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Services & Standard Pricing (DYNAMIC) */}
                            <div className="rounded-3xl bg-white border border-[var(--color-trust-border)] p-6 sm:p-8 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-extrabold text-[var(--color-trust-text-main)] flex items-center gap-2">
                                        <Wrench className="size-5 text-[var(--color-trust-green-main)]" />
                                        Services & Standard Pricing
                                    </h2>
                                    <span className="rounded-full bg-[var(--color-trust-green-badge)] px-3 py-1 text-[10px] font-bold text-[var(--color-trust-green-text)]">
                                        Transparent Dhaka Benchmark
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--color-trust-text-muted)]">
                                    Rates reflect verified regional standards for licensed master craftsmen. Actual materials are supplied at merchant cost with physical cash receipts.
                                </p>

                                <div className="space-y-3 pt-2">
                                    {worker.services && worker.services.length > 0 ? (
                                        worker.services.map((service, idx) => (
                                            <div key={idx} className="rounded-2xl border border-[var(--color-trust-border-light)] bg-[var(--color-trust-bg-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xs font-extrabold text-[var(--color-trust-text-main)]">{service.title}</h3>
                                                        <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-[var(--color-trust-text-muted)] border border-[var(--color-trust-border-light)]">{service.badge}</span>
                                                    </div>
                                                    <p className="text-[11px] text-[var(--color-trust-text-subtle)] mt-1">{service.description}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-sm font-extrabold text-[var(--color-trust-text-main)]">{service.price}</div>
                                                    <div className="text-[10px] text-[var(--color-trust-green-main)] font-bold">{service.priceSub}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[var(--color-trust-text-muted)] py-4 text-center">No specific services listed for this technician yet.</p>
                                    )}
                                </div>

                                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900 mt-4">
                                    <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Zero Arbitrary Markups:</strong> Final quote is permanently locked after on-site diagnostic review. No middleman brokerage, no doorstep extortion, and all funds are safely held in TrustHand escrow until your full operational satisfaction.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Area */}
                        <div className="space-y-6">
                            <WorkerSidebarCard worker={worker} />
                            <InstantDispatchCard worker={worker} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}