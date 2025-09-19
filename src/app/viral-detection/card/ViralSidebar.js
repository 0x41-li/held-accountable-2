import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function ViralSidebar({ platforms,viralData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full xl:max-w-[334px] w-full border-l border-[#E9EAEB]">
      <div
        className="flex items-center justify-between p-6 cursor-pointer xl:cursor-default border-b border-[#E9EAEB] xl:border-none select-none"
        onClick={() => {
          if (window.innerWidth < 1280) {
            setOpen(!open);
          }
        }}
      >
        <p className="text-lg font-semibold">What’s happening now?</p>
        <Icon
          icon="oui:arrow-down"
          width={20}
          height={20}
          className={`flex xl:hidden text-[#667085] transition-transform duration-300 ${
            open && "rotate-180"
          }`}
        />
      </div>
      <div
        className={`overflow-hidden border-b border-[#E9EAEB] xl:border-none
       transition-all duration-200 ease-in-out
       ${
         open
           ? "opacity-100 max-h-[1000px] scale-y-100"
           : "opacity-0 max-h-0 scale-y-0"
       } 
       xl:opacity-100 xl:max-h-[1000px] xl:scale-y-100
     `}
      >
        <div className="flex flex-col p-6 items-start gap-4">
          {platforms.map((item, index) => {
            if (item === "All") return;
            return (
              <div
                key={index}
                className="flex items-center justify-between w-full gap-4"
              >
                <div className="flex flex-col items-start text-[#475467]">
                  <p className="text-[13px]">{item} • Trending</p>
                  <span className="text-sm font-semibold text-[#344054]">
                    2026 World Cup
                  </span>
                  <span className="text-[13px]">
                    {viralData
                      .filter((v) => v.topic === item.toLowerCase())
                      .length.toLocaleString("en-US")}{" "}
                    Posts
                  </span>
                </div>
                <Icon
                  icon="mdi:eye-outline"
                  width={24}
                  height={24}
                  className="text-[#A4A7AE] cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
