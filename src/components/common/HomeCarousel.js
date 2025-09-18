import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

export default function HomeCarousel({ trend = true, title, speed=25, className, data }) {
  return (
    <div className={`flex items-center py-4 gap-3 pl-4 w-full ${className}`}>
      <div
        className={`flex items-center justify-center py-0.5 gap-1 w-[160px] rounded-lg border-[1px] ${
          trend
            ? "border-[#F9DBAF] bg-[#FEF6EE]"
            : "border-[#B9E6FE] bg-[#F0F9FF]"
        } `}
      >
        {trend ? (
          <Icon
            icon="iconamoon:trend-up"
            width={12}
            height={12}
            color="#EF6820"
          />
        ) : (
          <Icon
            icon="lucide:chevron-up"
            width={12}
            height={12}
            color="#0BA5EC"
          />
        )}
        <p
          className={`${
            trend ? "text-[#B93815]" : "text-[#026AA2]"
          } font-medium text-sm text-nowrap`}
        >
          {title}
        </p>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="flex w-max animate-marquee gap-6" style={{ animationDuration: `${speed}s` }}>
          {data.concat(data).map((item, index) => (
              trend ? <p className="flex items-center gap-[4px]">{item.change >= 0 ? <Icon icon="icon-park-solid:up-one" className="text-green-400" />:<Icon icon="icon-park-solid:down-one" className="text-red-400" />} {item.symbol} {item.price}</p>
            :<div
              key={index}
              className="w-[266px] flex items-center gap-1 shrink-0"
            >
              <Image src={item.img} alt={item.title} width={66} height={44} />
              <div className="flex flex-col">
                <p className="truncate w-[155px] text-[#344054] font-[600]">
                  {item.title}
                </p>
                <span className="truncate w-[195px] text-[#7C7C7C] text-sm">
                  {item.descr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
