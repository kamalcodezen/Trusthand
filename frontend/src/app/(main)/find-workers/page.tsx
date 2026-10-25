"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, CheckCircle2 } from "lucide-react";

import Sidebar, { FilterState } from "@/components/FindWorkers/Sidebar";
import FilterHeader from "@/components/FindWorkers/FilterHeader";
import Pagination from "@/components/FindWorkers/Pagination";
import Card, { WorkerData } from "@/components/FindWorkers/Card";

// Each mock worker must have a unique ID
const mockWorkersData: WorkerData[] = [
    {
        id: "worker-1",
        name: "Md. Rafiqul Islam",
        role: "Master Electrician",
        experience: "12 yrs exp", // Matches: 10+ Yrs
        location: "Gulshan 1 & 2, Banani",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
        tags: ["3-Phase DB Board", "Concealed Wiring", "Solar Inverter"],
        completedJobs: 118,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
    },
    {
        id: "worker-2",
        name: "Tanveer Hossain",
        role: "Senior AC Technician",
        experience: "8 yrs exp", // Matches: 6–10 Yrs
        location: "Banani & Baridhara Diplomatic",
        rating: 4.9,
        badgeText: "TOP RATED",
        avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        tags: ["Jet Wash Overhaul", "R32 Gas Refill", "PCB Repair"],
        completedJobs: 94,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)", // Test for Police Cleared filter
    },
    {
        id: "worker-3",
        name: "Sumon Mia",
        role: "Master Plumber & Sanitary",
        experience: "4 yrs exp", // Matches: 3–5 Yrs
        location: "Gulshan 1, Niketan, Tejgaon",
        rating: 4.8,
        badgeText: "EMERGENCY READY",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        tags: ["PPR Pipe Leak", "Booster Pump Setup", "Concealed Cistern"],
        completedJobs: 162,
        diagnosticFee: 300,
        verificationBadge: "Ward Certified", // Test for Ward Certified filter
    },
    {
        id: "worker-4",
        name: "Jahangir Alam",
        role: "Appliance Specialist",
        experience: "7 yrs exp", // Matches: 6–10 Yrs
        location: "Banani DOHS, Mohakhali",
        rating: 4.7,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        tags: ["Inverter Refrigerator", "Microwave Magnetron", "Washing Drum"],
        completedJobs: 87,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
    },
    {
        id: "worker-5",
        name: "Kabir Ahmed",
        role: "House Painter & Duco Polish",
        experience: "15 yrs exp", // Matches: 10+ Yrs
        location: "Gulshan 2 & Baridhara",
        rating: 5.0,
        badgeText: "MASTER PAINTER",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
        tags: ["Anti-Damp Treatment", "Duco Spray", "Italian Texture"],
        completedJobs: 210,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)", // Test for Police Cleared filter
    },
    {
        id: "worker-6",
        name: "Nasir Uddin",
        role: "Master Mason & Tiler",
        experience: "3 yrs exp", // Matches: 3–5 Yrs
        location: "Banani, Gulshan 1, Badda",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        tags: ["Granite Fitting", "Waterproofing Epoxy", "Bathroom Slope"],
        completedJobs: 140,
        diagnosticFee: 450,
        verificationBadge: "Ward Certified", // Test for Ward Certified filter
    },
    {
        id: "worker-7",
        name: "Arifur Rahman",
        role: "Master Electrician",
        experience: "9 yrs exp", // Matches: 6–10 Yrs
        location: "Gulshan 1 & 2, Banani",
        rating: 4.9,
        badgeText: "SENIOR ARTISAN",
        avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
        tags: ["3-Phase DB Board", "Concealed Wiring", "Solar Inverter"],
        completedJobs: 118,
        diagnosticFee: 350,
        verificationBadge: "100% NID Verified",
    },
    {
        id: "worker-8",
        name: "Kamal Hossain",
        role: "Senior AC Technician",
        experience: "5 yrs exp", // Matches: 3–5 Yrs
        location: "Banani & Baridhara Diplomatic",
        rating: 4.9,
        badgeText: "TOP RATED",
        avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        tags: ["Jet Wash Overhaul", "R32 Gas Refill", "PCB Repair"],
        completedJobs: 94,
        diagnosticFee: 400,
        verificationBadge: "Police Cleared (DMP)",
    },
    {
        id: "worker-9",
        name: "Rakib Hasan",
        role: "Master Plumber & Sanitary",
        experience: "11 yrs exp", // Matches: 10+ Yrs
        location: "Gulshan 1, Niketan, Tejgaon",
        rating: 4.8,
        badgeText: "EMERGENCY READY",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        tags: ["PPR Pipe Leak", "Booster Pump Setup", "Concealed Cistern"],
        completedJobs: 162,
        diagnosticFee: 300,
        verificationBadge: "Ward Certified",
    },
];

const ITEMS_PER_PAGE = 3;

export default function FindWorkersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [zoneQuery, setZoneQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({
        trades: [],
        zone: "All Zones",
        maxFee: 800,
        verification: [],
        experience: [],
    });
    const [sortBy, setSortBy] = useState("rating");
    const [currentPage, setCurrentPage] = useState(1);

    // Dynamic Filtering Logic including Verification & Experience
    const filteredWorkers = useMemo(() => {
        return mockWorkersData
            .filter((worker) => {
                const matchesSkill =
                    searchQuery === "" ||
                    worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    worker.tags.some((t) =>
                        t.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                const matchesZoneInput =
                    zoneQuery === "" ||
                    worker.location.toLowerCase().includes(zoneQuery.toLowerCase());

                const matchesTrade =
                    filters.trades.length === 0 || filters.trades.includes(worker.role);

                const matchesRadioZone =
                    filters.zone === "All Zones" ||
                    worker.location
                        .toLowerCase()
                        .includes(filters.zone.toLowerCase().replace(" zone", ""));

                const matchesVerification =
                    filters.verification.length === 0 ||
                    filters.verification.includes(worker.verificationBadge);

                const matchesExperience =
                    filters.experience.length === 0 ||
                    filters.experience.some((expRange) => {
                        const years = parseInt(worker.experience);
                        if (expRange.includes("3–5") && years >= 3 && years <= 5) return true;
                        if (expRange.includes("6–10") && years >= 6 && years <= 10) return true;
                        if (expRange.includes("10+") && years >= 10) return true;
                        return false;
                    });

                const matchesFee = worker.diagnosticFee <= filters.maxFee;

                return (
                    matchesSkill &&
                    matchesZoneInput &&
                    matchesTrade &&
                    matchesRadioZone &&
                    matchesVerification &&
                    matchesExperience &&
                    matchesFee
                );
            })
            .sort((a, b) => {
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "jobs") return b.completedJobs - a.completedJobs;
                if (sortBy === "fee") return a.diagnosticFee - b.diagnosticFee;
                return 0;
            });
    }, [searchQuery, zoneQuery, filters, sortBy]);

    const totalPages = Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE) || 1;
    const paginatedWorkers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredWorkers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredWorkers, currentPage]);

    const handleResetFilters = () => {
        setFilters({
            trades: [],
            zone: "All Zones",
            maxFee: 800,
            verification: [],
            experience: [],
        });
        setSearchQuery("");
        setZoneQuery("");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[var(--color-trust-bg-light)] font-['Manrope']">
            {/* Top Header */}
            <div className="border-b border-[var(--color-trust-border)] bg-white py-4 px-4 sm:px-6 lg:px-10">
                <div className="mx-auto w-full global-pos">
                    <nav className="flex items-center gap-2 text-xs text-[var(--color-trust-text-muted)]">
                        <Link href="/" className="hover:text-[var(--color-trust-text-main)]">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-[var(--color-trust-text-main)]">
                            Find Workers
                        </span>
                    </nav>

                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-trust-green-badge)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-trust-green-text)]">
                                    <span className="size-1.5 rounded-full bg-[var(--color-trust-green-main)] animate-pulse" />
                                    FIND LOCAL PROFESSIONALS
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-trust-text-main)]">
                                The right hands for your next project.
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-trust-text-subtle)]">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="size-4 text-[var(--color-trust-green-main)]" />
                                100% ID Verified
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="size-4 text-[var(--color-trust-green-main)]" />
                                Fair Price Code
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="py-6 px-4 sm:px-6 lg:px-10">
                <div className="mx-auto w-full global-pos">
                    <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-[var(--color-trust-border)] grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                        <div className="flex items-center border-b md:border-b-0 md:border-r border-[var(--color-trust-border-light)] pb-2 md:pb-0 md:pr-4">
                            <Search className="size-5 text-[var(--color-trust-text-muted)] ml-2 mr-3" />
                            <div className="w-full">
                                <label className="block text-[10px] font-bold uppercase text-[var(--color-trust-text-muted)]">
                                    Skill or Problem
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="e.g. Electrician, Plumbing, PCB"
                                    className="w-full text-xs sm:text-sm font-semibold text-[var(--color-trust-text-main)] outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center pb-2 md:pb-0 md:pr-4">
                            <MapPin className="size-5 text-[var(--color-trust-text-muted)] ml-2 mr-3" />
                            <div className="w-full">
                                <label className="block text-[10px] font-bold uppercase text-[var(--color-trust-text-muted)]">
                                    Neighbourhood Zone
                                </label>
                                <input
                                    type="text"
                                    value={zoneQuery}
                                    onChange={(e) => {
                                        setZoneQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="e.g. Gulshan, Banani, Uttara"
                                    className="w-full text-xs sm:text-sm font-semibold text-[var(--color-trust-text-main)] outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setCurrentPage(1)}
                            className="rounded-xl bg-[var(--color-trust-green-main)] px-6 py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-trust-green-dark)] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                            <Search className="size-4 text-white" />
                            <span>Search Craftsmen</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="pb-16 px-4 sm:px-6 lg:px-10">
                <div className="mx-auto w-full global-pos grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Dynamic Sidebar */}
                    <Sidebar
                        filters={filters}
                        setFilters={(newFilters) => {
                            setFilters(newFilters);
                            setCurrentPage(1);
                        }}
                        onReset={handleResetFilters}
                        workers={mockWorkersData}
                    />

                    {/* Cards & Controls */}
                    <div>
                        <FilterHeader
                            totalCount={filteredWorkers.length}
                            activeTradeFilters={filters.trades}
                            activeZone={filters.zone}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            removeTradeFilter={(trade) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    trades: prev.trades.filter((t) => t !== trade),
                                }));
                                setCurrentPage(1);
                            }}
                            resetZoneFilter={() => {
                                setFilters((prev) => ({ ...prev, zone: "All Zones" }));
                                setCurrentPage(1);
                            }}
                            clearAll={handleResetFilters}
                        />

                        {paginatedWorkers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
                                {paginatedWorkers.map((worker) => (
                                    <Card key={worker.id} worker={worker} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-8 rounded-2xl border border-[var(--color-trust-border)] bg-white p-12 text-center">
                                <p className="text-sm font-bold text-[var(--color-trust-text-main)]">
                                    No technicians found matching your filters.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-3 text-xs font-extrabold text-[var(--color-trust-green-main)] hover:underline"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredWorkers.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}