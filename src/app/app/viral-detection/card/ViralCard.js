import Link from "next/link";
import React from "react";
import { Icon } from "@iconify/react";

export default function ViralCard({ data }) {
  const postedDate = new Date(data.createdAt * 1000);
  
  // Format date as "3:21 PM, 21 OCT 2025"
  const formatDateForCard = (date) => {
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
    return `${time}, ${formattedDate}`;
  };

  const categoryColors = {
    CRYPTO: "text-[#C11574]",
    POLITICS: "text-[#6941C6]",
    AI: "text-[#3538cd]",
    FINANCE: "text-[#026AA2]",
  };

  const category = data.category ? data.category.toUpperCase() : "";
  const categoryColor = categoryColors[category] || "text-[#C11574]";

  return (
    <div className="card-item relative flex flex-col w-full rounded-[32px] border border-[#E9EAEB] px-6 py-4 md:p-6 hover:border-blue-300 transition-colors bg-[#F7F8FF80] shadow-[0_20px_50px_0_rgba(27,53,132,0.2)] overflow-hidden">
      {/* READ MORE button positioned at top right */}
      <Link 
        href={"/app/viral-detection/" + data.id} 
        className="hidden md:flex absolute top-0 right-0 flex items-center gap-2 text-[#1D74D6] font-bold text-sm hover:text-blue-700 transition-colors z-10"
      >
        READ MORE
        <div className="w-16 h-16 bg-[rgba(247, 248, 255, 0.5)] flex items-center justify-center rounded-bl-[32px] border-gray-200/50"
          style={{
            boxShadow: "0px 20px 50px 0px rgba(27, 53, 132, 0.1)",
          }}
        >
          <Icon icon="mdi:arrow-top-right" width={20} height={20} className="text-[#2B425B66]" />
        </div>
      </Link>
      
      <div className="flex items-center gap-2 mb-2 md:mb-4 pr-32">
        <span className={`text-[11px] md:text-sm font-medium ${categoryColor}`}>
          {category}
        </span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">|</span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">
          {formatDateForCard(postedDate)}
        </span>
      </div>
      <h3 className="text-[16px] md:text-[18px] md:text-xl font-[500] text-[#101828] mb-2 md:mb-4 line-clamp-1 md:line-clamp-2 md:pr-32">
        {data.title}
      </h3>
      <p className="text-[#475467] text-[12px] md:text-base leading-6 mb-2 md:mb-4 line-clamp-1 md:line-clamp-3">
        {data.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 200)}
        {data.content.length > 200 ? "..." : ""}
      </p>
      <Link 
        href={"/app/viral-detection/" + data.id} 
        className="md:hidden text-[#1D74D6] font-bold text-sm hover:text-blue-700"
      >
        READ MORE
      </Link>
    </div>
  );
}
