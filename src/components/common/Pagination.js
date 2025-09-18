import { Icon } from "@iconify/react";
import React from "react";

export default function Pagination({ totalPages, page, setPage, className }) {
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
    <div className={`flex items-center justify-center mb-6 ${className}`}>
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`${page === 1 && "opacity-[0.5]"}`}
      >
        <Icon icon="ep:arrow-left-bold" width={24} height={24} />
      </button>
      {getPaginationPages(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`px-3 sm:px-4 py-2 rounded-lg ${
              page === p ? "bg-gray-200" : "bg-blue-500"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`${page === totalPages && "opacity-[0.5]"}`}
      >
        <Icon icon="ep:arrow-right-bold" width={24} height={24} />
      </button>
    </div>
  );
}
