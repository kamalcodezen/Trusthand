import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArtisanCard, { Artisan } from "./ArtisanCard";

// next API data dynamic data replace.
const artisans: Artisan[] = [
  {
    name: "Md. Rafiqul Islam",
    role: "Master Electrician • 12y",
    username: "@rafiqul.islam",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "Specialist in 3-phase circuits, sub-meters, and DB board layouts.",
    tags: ["Short Circuits", "Rewiring"],
    rating: 4.9,
    reviewsCount: 142,
    verificationType: "NID Verified",
    slug: "md-rafiqul-islam",
  },
  {
    name: "Tanveer Hossain",
    role: "Certified AC Tech • 4y",
    username: "@tanveer.hossain",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Daikin & Gree inverter specialist. Jet-spray wash & R32 refills.",
    tags: ["Jet Wash", "PCB Repair"],
    rating: 5.0,
    reviewsCount: 98,
    verificationType: "Police Checked",
    slug: "tanveer-hossain",
  },
  {
    name: "Suman Mia",
    role: "Master Plumber • 10y",
    username: "@suman.mia",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "Water pressure boosters, concealed mixer repairs, and geysers.",
    tags: ["Pumps", "Leak Fix"],
    rating: 4.8,
    reviewsCount: 115,
    verificationType: "NID Verified",
    slug: "suman-mia",
  },
  {
    name: "Jahangir Alam",
    role: "Appliance Tech • 7y",
    username: "@jahangir.alam",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    quote: "No-frost refrigerators, front-load washers, and ovens.",
    tags: ["Inverter Refrig.", "Washers"],
    rating: 4.9,
    reviewsCount: 89,
    verificationType: "Police Checked",
    slug: "jahangir-alam",
  },
];

export default function TopArtisans() {
  return (
    <section className="bg-[#FAF9F5] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full global-pos">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end mb-10">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#245B46] sm:text-xs mb-2">
              Local Artisans
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1B2A23] sm:text-3xl">
              Dhaka&apos;s highest-rated neighbourhood hands.
            </h2>
          </div>

          <Link
            href="/workers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245B46] transition-opacity hover:opacity-75"
          >
            Explore all 240+ verified workers
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.slug} artisan={artisan} />
          ))}
        </div>
      </div>
    </section>
  );
}