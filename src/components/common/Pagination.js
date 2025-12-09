import { Icon } from "@iconify/react";
import React from "react";

export default function Pagination({ totalPages, page, setPage, className }) {
  console.log(totalPages, page);
  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  function getPaginationPages(currentPage, totalPages) {
    const delta = 2;
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }

    const result = [];
    for (let i = 0; i < range.length; i++) {
      if (range[i] === "..." && range[i - 1] === "...") {
        continue;
      }
      result.push(range[i]);
    }

    return result;
  }

  return (
    <div className={`flex items-center justify-center gap-2 mb-6 ${className}`}>
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`text-gray-400 hover:text-gray-600 transition-colors ${
          page === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Icon icon="mdi:chevron-left" width={24} height={24} />
      </button>
      {getPaginationPages(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`px-3 py-1 transition-colors ${
              page === p
                ? "font-bold text-[#2b425b]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`text-gray-400 hover:text-gray-600 transition-colors ${
          page === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Icon icon="mdi:chevron-right" width={24} height={24} />
      </button>
    </div>
  );
}
