import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function Selection({
  options,
  active,
  setActive,
  placeholder,
  className,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`flex relative bg-white ${className}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-2 py-2 px-3.5 border border-[#D0D5DD] rounded-md cursor-pointer w-full select-none">
        <p className={`text-black ${!active && "!text-[#667085]"} text-nowrap`}>
          {active || placeholder}
        </p>
        <Icon
          icon="oui:arrow-down"
          width={20}
          height={20}
          className={`text-[#667085] transition-transform duration-300 ${
            open && "rotate-180"
          }`}
        />
      </div>
      <div
        className={`absolute top-[110%] left-0 w-full flex flex-col border bg-white border-[#D0D5DD] rounded-md transform transition-transform duration-300 origin-top ${
          open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        {options.map((item, index) => (
          <div
            key={index}
            className={`py-2 px-3.5 hover:bg-[#dddddd] ${
              active === item && "bg-[#efefef]"
            } cursor-pointer`}
            onClick={() => setActive(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
