"use client";

import { useState } from "react";
import { DatePicker } from "../ui/DatePicker";
import { MultiSelect } from "../ui/MultiSelect";

export function SnapshotFilters({setSelectedDate, setSelectedTopics, selectedDate, selectedTopics}) {
  return (
    <div className="flex flex-row flex-wrap gap-3 items-center">
      <div className="w-full sm:w-[20rem]">
        <DatePicker
          startDate={selectedDate.startDate}
          endDate={selectedDate.endDate}
          onDateSelect={setSelectedDate}
        />
      </div>
      <div className="w-full sm:w-[20rem]">
        <MultiSelect
          options={[
            "Gaming",
            "Technology",
            "Health",
            "Science",
            "Education",
            "Design",
            "Research",
          ]}
          placeholder="Filter Topics"
          selectedValues={selectedTopics}
          onChange={setSelectedTopics}
        />
      </div>
    </div>
  );
}
