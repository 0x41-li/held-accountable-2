import React from "react";
import Input from "../ui/Input";

export default function SectionTitle({ value, setValue, input=false, title, subtitle, className }) {
  return (
    <div className={`flex flex-col md:flex-row items-end gap-[10px] pb-5 pt-5 px-6 ${className}`}>
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
