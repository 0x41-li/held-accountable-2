import { Icon } from "@iconify/react";
import React from "react";

export default function Input({
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  iconStyle = "",
  type = "text",
  disabled = false,
}) {
  return (
    <div className="relative">
      <input
        type={type}
        className={`border border-[#D0D5DD] rounded-md py-2.5 px-3.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          icon && "pl-10"
        } ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {icon && (
        <Icon
          icon={icon}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] w-5 h-5 ${iconStyle}`}
        />
      )}
    </div>
  );
}
