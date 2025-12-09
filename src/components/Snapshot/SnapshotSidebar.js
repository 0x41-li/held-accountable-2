"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getViralDetections } from "@/services/polls/polls";

export default function SnapshotSidebar() {
  const [viralData, setViralData] = useState([]);

  useEffect(() => {
    getViralDetections().then(data => {
      setViralData(data.slice(0, 3)); // Get first 3 viral detections
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Viral Detection Section */}
      <div className="flex flex-col gap-[27px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[27px]">
            <h3 className="text-[24px] font-[700] text-[#2B425B]">Viral Detection</h3>
            <img src="/images/hot_badge.png" alt="Hot" width={50} height={30} />
          </div>
          <Link href="/app/viral-detection" className="text-[12px] text-[#3d83ff] font-[700] hover:text-blue-600">
            ALL
          </Link>
        </div>
        <div className="flex flex-col gap-[34px] bg-[#F7F8FF80] rounded-[32px] p-4 md:p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
          {viralData.map((item) => (
            <div key={item.id} className="flex flex-col gap-1.5 p-3 transition-colors">
              <h4 className="text-[16px] leading-[24px] font-[500] text-[#2B425B] line-clamp-2">
                {item.title}
              </h4>
              <p className="text-[11px] leading-[20px] line-clamp-1 text-[#98A2B3]">
                {item.content?.replace(/\*/g, "").replace(/#/g, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="flex flex-col gap-[33px] w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-[24px] font-[700] text-[#2B425B]">Company</h3>
          <img src="/images/hot_badge.png" alt="Hot" width={50} height={30} />
        </div>
        <div className="flex flex-col gap-[18px] rounded-lg">
          <div className="flex gap-[16px] w-full items-start">
            <img src="/images/viralPage/companybg.png" />
            <p className="text-[16px] text-[#2b425b] font-[500] leading-6 flex-1">
              We approach every challenge with curiosity and rigor, digging beneath the surface
            </p>
          </div>
          <p className="text-[11px] text-[#2B425B54] leading-6">Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence</p>
          <Link
            href="/about-us"
            className="text-[#3d83ff] text-[12px] font-[700] hover:underline"
          >
            LEARN MORE
          </Link>
        </div>
      </div>
    </div>
  );
}

