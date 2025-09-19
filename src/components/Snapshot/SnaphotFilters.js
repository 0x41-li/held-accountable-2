"use client";

import { useState } from "react";
import { DatePicker } from "../ui/DatePicker";
import { MultiSelect } from "../ui/MultiSelect";

export function SnapshotFilters() {
  const [selectedDate, setSelectedDate] = useState({
    startDate: null,
    endDate: null,
  });

  const [selectedTopics, setSelectedTopics] = useState([]);

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
          selectedValues={selectedTopics}
          onChange={setSelectedTopics}
        />
      </div>
    </div>
  );
}
