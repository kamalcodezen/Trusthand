import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";

export interface Artisan {
  name: string;
  role: string;
  username: string;
  avatar: string;
  quote: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  verificationType: "NID Verified" | "Police Checked";
  slug: string;
}

interface ArtisanCardProps {
  artisan: Artisan;
}

export default function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E6E7E3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div>
        {/* Profile Header */}
        <div className="flex items-start gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#E5EFE6]">
            <Image
              src={artisan.avatar}
              alt={artisan.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-sm font-bold text-[#1B2A23]">
                {artisan.name}
              </h3>
              <CheckCircle2 size={14} className="shrink-0 fill-[#245B46] text-white" />
            </div>
            <p className="text-xs font-medium text-[#7F8B84]">
              {artisan.role}
            </p>
            <p className="text-[11px] text-[#9BA8A0]">
              {artisan.username}
            </p>
          </div>
        </div>

        {/* Quote Bubble */}
        <div className="mt-4 rounded-xl bg-[#FAF9F5] p-3 text-xs leading-relaxed text-[#526159]">
          &ldquo;{artisan.quote}&rdquo;
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {artisan.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#E5EFE6] px-2 py-1 text-[10px] font-semibold text-[#245B46]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-[#ECEDE8]">
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1 font-bold text-[#1B2A23]">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{artisan.rating.toFixed(1)}</span>
            <span className="font-normal text-[#7F8B84]">({artisan.reviewsCount})</span>
          </div>
          <span className="font-semibold text-[#526159]">
            {artisan.verificationType}
          </span>
        </div>

        <button className="w-full rounded-xl bg-[#245B46] py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-[#184C3B]">
          Request Quote
        </button>
      </div>
    </div>
  );
}