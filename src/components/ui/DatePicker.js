import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export function DatePicker({
  startDate: initialStartDate,
  endDate: initialEndDate,
  onDateSelect,
}) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (startDate) {
      setSelectedMonth(
        new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      );
    }
  }, [startDate]);

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

  const handleDateSelect = (date) => {
    if (!startDate || (endDate && date < startDate)) {
      setStartDate(date);
      onDateSelect({ startDate: date, endDate });
      if (endDate && date > endDate) {
        setEndDate(null);
        onDateSelect({ startDate: date, endDate: null });
      }
    } else if (!endDate || (startDate && date > endDate)) {
      setEndDate(date);
      onDateSelect({ startDate, endDate: date });
    } else {
      const distanceToStart = Math.abs(
        date.getTime() - (startDate ? startDate.getTime() : 0)
      );
      const distanceToEnd = Math.abs(
        date.getTime() - (endDate ? endDate.getTime() : 0)
      );

      if (distanceToStart < distanceToEnd) {
        setStartDate(date);
        onDateSelect({ startDate: date, endDate });
      } else {
        setEndDate(date);
        onDateSelect({ startDate, endDate: date });
      }
    }
  };

  const isSelected = (day) => {
    return (
      day.getTime() === startDate?.getTime() ||
      day.getTime() === endDate?.getTime()
    );
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

  const selectedLabel =
    startDate && endDate
      ? `${formatDate(startDate)} to ${formatDate(endDate)}`
      : startDate
      ? formatDate(startDate)
      : endDate
      ? `to ${formatDate(endDate)}`
      : "Select Date";

  const handleClearDate = (e) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    onDateSelect({ startDate: null, endDate: null });
  };

  return (
    <div className="relative w-full">
      <div
        className="flex gap-2 items-center border border-[#d0d5dd] rounded-lg px-3 py-3 w-full cursor-pointer relative"
        onClick={() => setCalendarOpen(true)}
      >
        <Icon
          icon="uil:calendar"
          width={18}
          height={20}
          style={{ color: "#667085" }}
        />
        <p className="text-[#667085] text-base leading-[150%] font-normal mr-6">
          {selectedLabel}
        </p>
        {(startDate || endDate) && (
          <button
            onClick={handleClearDate}
            type="button"
            className="absolute right-3 text-[#667085] hover:text-red-500"
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
            className="absolute left-0 top-full mt-2 z-50"
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
                  const selected = isSelected(day);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={[
                        "w-8 h-8 md:w-9 md:h-9 flex flex-col items-center justify-center rounded-full border transition relative",
                        selected
                          ? "font-medium bg-gray-100 border-transparent"
                          : "bg-white text-gray-900 border-transparent hover:bg-gray-100 font-normal",
                      ].join(" ")}
                    >
                      <span>{day.getDate()}</span>
                      {selected && (
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
