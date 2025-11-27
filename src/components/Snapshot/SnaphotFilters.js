"use client";

import { SingleDatePicker } from "../ui/SingleDatePicker";

export function SnapshotFilters({setSelectedDate, selectedDate}) {
  return (
    <div className="flex flex-row flex-wrap gap-3 items-center">
      <div className="w-full sm:w-[20rem]">
        <SingleDatePicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  );
}
