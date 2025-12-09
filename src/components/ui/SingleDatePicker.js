"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export function SingleDatePicker({
  selectedDate,
  onDateSelect,
}) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [date, setDate] = useState(selectedDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    setDate(selectedDate);
    if (selectedDate) {
      setSelectedMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      );
    }
  }, [selectedDate]);

  const endOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0
  );

  const daysInMonth = Array.from(
    { length: endOfMonth.getDate() },
    (_, index) =>
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), index + 1)
  );

  const handleDateSelect = (selectedDay) => {
    setDate(selectedDay);
    onDateSelect(selectedDay);
    setCalendarOpen(false);
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
    );
  };

  const formatDate = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : "";

  const handleClearDate = (e) => {
    e.stopPropagation();
    setDate(null);
    onDateSelect(null);
  };

  return (
    <div className="relative w-full">
      <div
        className="flex items-center gap-2 md:px-3 py-2.5 w-full cursor-pointer"
        onClick={() => setCalendarOpen(true)}
      >
        <span className="text-[#101828] text-sm md:font-medium font-bold">DATE:</span>
        <Icon
          icon="uil:calendar"
          width={18}
          height={18}
          className="text-[#475467]"
        />
        <span className="text-[#101828] text-sm font-normal flex-1 min-w-[100px]">
          {date ? formatDate(date) : ""}
        </span>
        {date && (
          <button
            onClick={handleClearDate}
            type="button"
            className="text-[#475467] hover:text-red-500"
          >
            <Icon icon="material-symbols-light:close" width={18} height={18} />
          </button>
        )}
      </div>

      {calendarOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setCalendarOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 w-80 max-w-xs md:max-w-sm select-none relative">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePreviousMonth}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-lg"
                  type="button"
                >
                  <Icon
                    icon="mdi:chevron-left"
                    width={18}
                    height={18}
                    style={{ color: "#667085" }}
                  />
                </button>
                <div className="font-semibold text-[#414651] text-sm">
                  {selectedMonth.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-lg"
                  type="button"
                >
                  <Icon
                    icon="mdi:chevron-right"
                    width={18}
                    height={18}
                    style={{ color: "#667085" }}
                  />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-1 text-center">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-1 font-medium text-sm text-[#414651]"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm text-center">
                {daysInMonth.map((day) => {
                  const isSelected = date && day.getTime() === date.getTime();
                  return (
                    <button
                      key={day.toLocaleString("en-CA", { timeZone: "America/New_York" })}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={[
                        "w-8 h-8 md:w-9 md:h-9 flex flex-col items-center justify-center rounded-full border transition relative",
                        isSelected
                          ? "font-medium bg-gray-100 border-transparent"
                          : "bg-white text-gray-900 border-transparent hover:bg-gray-100 font-normal",
                      ].join(" ")}
                    >
                      <span>{day.getDate()}</span>
                      {isSelected && (
                        <span
                          className={
                            "absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#3b88e3] mt-0.5"
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

