import { formatDate } from "@/utils/date";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export function SnapshotCard({ snapshot, showManage, changeSnapshotStatus, deleteSnapshot }) {
  
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

  const category = snapshot.tags ? snapshot.tags[0].toUpperCase() : "";
  const categoryColor = categoryColors[category] || "text-[#C11574]";

  return (
    
    <div className="relative flex flex-col w-full py-[22px] px-[30px] card-item overflow-hidden">
      {/* READ MORE button positioned at top right */}
      <Link 
        href={"/app/snapshots/" + snapshot.id} 
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
      
      <div className="flex items-center gap-2 mb-4 pr-32">
        <span className={`text-[11px] md:text-sm font-medium ${categoryColor}`}>
          {category}
        </span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">|</span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">
          {formatDateForCard(new Date(snapshot.createdAt.seconds * 1000))}
        </span>
      </div>
      <h3 className="text-[18px] md:text-xl font-[500] text-[#101828] mb-4 line-clamp-2 pr-32">
        {snapshot.title}
      </h3>
      <p className="text-[#475467] text-[12px] md:text-base leading-6 mb-4 line-clamp-3">
        {snapshot.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 200)}
        {snapshot.content.length > 200 ? "..." : ""}
      </p>
      <Link 
        href={"/app/snapshots/" + snapshot.id} 
        className="md:hidden text-[#1D74D6] font-bold text-sm hover:text-blue-700"
      >
        READ MORE
      </Link>
    </div>
  );
}
