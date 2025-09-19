import React from "react";
import Input from "../ui/Input";

export default function SectionTitle({ value, setValue, input=false, title, subtitle, className }) {
  return (
    <div className={`flex flex-col pb-5 pt-5 px-6 border-b border-[#E4E7EC] bg-[#FCFCFD] rounded-tl-3xl ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-3xl font-semibold text-nowrap">{title}</p>
        {input && (
          <Input
            icon="iconoir:search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
          />
        )}
      </div>
      {subtitle && <span className="text-[#7C7C7C]">{subtitle}</span>}
    </div>
  );
}
