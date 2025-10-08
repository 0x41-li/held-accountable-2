import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import Marquee from "react-fast-marquee";

export default function HomeCarousel({ trend = true, title, speed=25, className, data }) {

  return (
    <div className={`flex items-center py-1 gap-3 pl-6 w-full ${className} text-xs`}>
      {/* <div
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
          } font-medium text-xs text-nowrap`}
        >
          {title}
        </p>
      </div> */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-white to-transparent z-10"></div>
        <Marquee speed={speed}>
          {data.concat(data).map((item, index) => (
              trend ? <div key={index} className="flex shrink-0 items-center gap-2 mr-4">
                        {item.change >= 0?<Icon icon="icon-park-solid:up-one" className="text-green-400" />:<Icon icon="icon-park-solid:down-one" className="text-red-400" />}
                        <span>{item.symbol}</span>
                        <span>
                        {item.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                        </span>
                      </div>
            :<div
              key={index}
              className="flex items-center gap-2 shrink-0 mr-4"
            >
              <p className="text-[#344054] font-bold">
                {item.eventDate}
              </p>
              <p className="text-[#344054]">
                {item.title.eng}
              </p>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
