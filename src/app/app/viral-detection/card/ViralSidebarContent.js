"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Btn from "@/components/ui/Btn";
import { getSnapshots } from "@/services/polls/polls";

export default function ViralSidebarContent() {
  // Mock data for snapshots - in real app, this would come from props or API
  const [snapshots, setSnapshots] = useState([]);
  useEffect(() => {
    getSnapshots(null, 3).then(data => {
      setSnapshots(data.results);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Snapshots Section */}
      <div className="flex flex-col gap-[27px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[24px] font-[700] text-[#2B425B]">Snapshots</h3>
          <Link href="/app/snapshots" className="text-[12px] text-[#3d83ff] font-[700] hover:text-blue-600">
            ALL
          </Link>
        </div>
        <div className="flex flex-col gap-[34px] bg-[#F7F8FF80] rounded-[32px] p-[24px] shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
          {snapshots.map((snapshot) => (
            <div key={snapshot.id} className="flex flex-col gap-[6px] transition-colors">
              <h4 className="text-[16px] leading-[24px] font-[500] text-[#2B425B] line-clamp-3">
                {snapshot.title}
              </h4>
              <p className="text-[11px] leading-[20px] line-clamp-1 text-[#98A2B3]">{snapshot.content.replace(/\*/g, "").replace(/#/g, "")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="flex flex-col gap-[33px] w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-[24px] font-[700] text-[#2B425B]">Company</h3>
          <img src="/images/hot_badge.png" />
        </div>
        <div className="flex flex-col gap-[18px] rounded-lg">
          <div className="flex gap-[16px] w-full items-start">
            <img src="/images/viralPage/companybg.png" />
            <p className="text-[16px] text-[#2b425b] font-[500] leading-6 flex-1">
              We approach every challenge with curiosity and rigor, digging beneath the surface
            </p>
          </div>
          <p className="text-[11px] text-[#2B425B54] leading-6">Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence</p>
          <a
            href="#"
            className="text-[#3d83ff] text-[12px] font-[700]"
            onClick={() => window.location.href = "/about-us"}
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </div>
  );
}

