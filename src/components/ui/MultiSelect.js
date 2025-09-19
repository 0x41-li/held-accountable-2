import { useState } from "react";
import { Icon } from "@iconify/react";

export function MultiSelect({ options, selectedValues, onChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const removeTag = (option) => {
    onChange(selectedValues.filter((value) => value !== option));
  };

  return (
    <div className="w-full relative">
      <div
        className="w-full border border-[#d0d5dd] rounded-lg px-2 py-2 flex items-center bg-white cursor-pointer"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={() => setDropdownOpen(true)}
      >
        <Icon
          icon="mingcute:search-line"
          className="ml-1 text-[#667085] flex-shrink-0"
          width={18}
          height={18}
        />
        <div
          className="flex flex-nowrap gap-1 items-center w-full overflow-x-auto multi-select-hide-scrollbar pl-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            .multi-select-hide-scrollbar::-webkit-scrollbar { display: none; }
            .multi-select-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {selectedValues.map((option) => (
            <span
              key={option}
              className="flex items-center border border-[#d5d7da] text-[#344054] rounded-md px-2 py-0.5 text-sm mr-1"
            >
              {option}
              <button
                type="button"
                className="ml-1 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(option);
                }}
              >
                <Icon icon="material-symbols:close" width={16} height={16} />
              </button>
            </span>
          ))}
          <div
            className="text-[#667085] text-base font-normal py-1 px-2 whitespace-nowrap select-none"
            style={{
              minWidth: selectedValues.length === 0 ? "5rem" : "0",
              opacity: selectedValues.length === 0 ? 1 : 0,
            }}
          >
            Filter Topics
          </div>
        </div>
      </div>
      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute mt-2 left-0 z-50 w-full bg-white border border-[#d0d5dd] rounded-lg shadow-lg max-h-56 overflow-y-auto">
            <div className="flex flex-col gap-1 mt-1">
              {options.length === 0 && (
                <div className="px-4 py-2 text-gray-400">No topics found</div>
              )}
              {options.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div
                    key={option}
                    className={`flex items-center px-4 py-2 mx-1 cursor-pointer hover:bg-gray-100 rounded-md ${
                      isSelected ? "bg-[#fafafa]" : ""
                    }`}
                    onClick={() => toggleOption(option)}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2" />
                    <span className="flex-1 text-[#344054]">{option}</span>
                    {selectedValues.includes(option) && (
                      <Icon
                        icon="material-symbols:check"
                        width={18}
                        height={18}
                        className="text-blue-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
