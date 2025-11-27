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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#101828]">Snapshots</h3>
          <Link href="/app/snapshots" className="text-sm text-[#344054] font-medium hover:text-blue-600">
            ALL
          </Link>
        </div>
        <div className="flex flex-col gap-4 bg-[#F7F8FF80] rounded-[32px] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
          {snapshots.map((snapshot) => (
            <div key={snapshot.id} className="flex flex-col gap-2 p-4 transition-colors">
              <h4 className="text-sm font-semibold text-[#101828] line-clamp-2">
                {snapshot.title}
              </h4>
              <p className="text-xs text-[#98A2B3]">{snapshot.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 100) +
              (snapshot.content.length > 100 ? "..." : "")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#101828]">Company</h3>
          <img src="/images/hot_badge.png" />
        </div>
        <div className="flex flex-col gap-4 rounded-lg">
          <div className="flex gap-[16px] w-full items-center">
            <img src="/images/viralPage/companybg.png" />
            <p className="text-sm text-[#475467] leading-6 flex-1">
              We approach every challenge with curiosity and rigor, digging beneath the surface
            </p>
          </div>
          <p className="text-[12px] text-[#2B425B54] leading-6">Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence</p>
          <a
            href="#"
            className="text-[#3D83FF] text-[12px] font-bold"
            onClick={() => window.location.href = "/about-us"}
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </div>
  );
}

