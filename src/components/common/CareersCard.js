import { Icon } from "@iconify/react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CareersCard({ data }) {
  const router = useRouter();

  const goToDetails = (id) => {
    router.push(`/careers/${id}`);
  }

  // Map industry to display format
  const getCategoryLabel = (industry) => {
    if (industry === "Engineering") return "ENGINEERING";
    if (industry === "Marketing") return "MARKETING";
    if (industry === "AI/ML") return "AI/ML";
    return industry?.toUpperCase() || "";
  };

  const categoryColors = {
    "AI/ML": "text-[#3538cd]",
    "ENGINEERING": "text-[#026AA2]",
    "MARKETING": "text-[#C11574]",
  };

  const categoryLabel = getCategoryLabel(data.industry);
  const categoryColor = categoryColors[categoryLabel] || "text-[#0E9384]";

  return (
    <div className="card-item relative flex flex-col w-full rounded-[32px] border border-[#E9EAEB] p-6 hover:border-blue-300 transition-colors bg-[#F7F8FF] overflow-hidden">
      {/* Arrow button positioned at top right */}
      <Link 
        href={`/careers/${data.id}`}
        className="hidden md:flex absolute top-0 right-0 flex items-center justify-center z-10"
      >
        <div className="w-16 h-16 bg-[rgba(247, 248, 255, 0.5)] flex items-center justify-center rounded-bl-[32px] border-gray-200/50"
          style={{
            boxShadow: "0px 20px 50px 0px rgba(27, 53, 132, 0.1)",
          }}
        >
          <Icon icon="mdi:arrow-top-right" width={20} height={20} className="text-[#2B425B66]" />
        </div>
      </Link>

      {/* Top row: Category (left) | Time + Location (right) */}
      <div className="flex items-center justify-between mb-4 pr-20">
        <span className={`text-[11px] md:text-sm font-medium ${categoryColor}`}>
          {categoryLabel}
        </span>
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1.5 text-[#98A2B3] text-[11px] md:text-sm font-medium">
            <Icon icon="tabler:clock" width={14} height={14} />
            {data.type?.toUpperCase() || ""}
          </p>
          <p className="flex items-center gap-1.5 text-[#98A2B3] text-[11px] md:text-sm font-medium">
            <Icon icon="ep:location" width={14} height={14} />
            {data.location?.toUpperCase() || ""}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-[18px] md:text-xl font-semibold text-[#414651] mb-3 line-clamp-2 pr-20">
        {data.vacancy}
      </h3>

      {/* Job Description */}
      <p className="text-[#535862] text-[12px] md:text-base leading-6 line-clamp-3 mb-4">
        {data.short_description?.substring(0, 200)}...
      </p>

      {/* Mobile link */}
      <Link 
        href={`/careers/${data.id}`}
        className="md:hidden text-[#1D74D6] font-bold text-sm hover:text-blue-700"
      >
        MORE DETAILS
      </Link>
    </div>
  );
}
