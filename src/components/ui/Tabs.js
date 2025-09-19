import React from "react";

export default function Tabs({ options, activeTab, setActiveTab }) {
  return (
    <div className="overflow-auto">
      <div className="flex overflow-hidden flex-nowrap w-[max-content] border border-primary rounded-[8px]">
        {options.map((item, index) => (
          <div
            key={index}
            className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${
              activeTab === item ? "bg-[#F4F4F4]" : "bg-white"
            } ${index != options.length - 1 ? " border-r border-primary" : ""}`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
