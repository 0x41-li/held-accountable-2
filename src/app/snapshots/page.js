import { SnapshotFilters } from "@/components/Snapshot/SnaphotFilters";
import { SnapshotCard } from "@/components/Snapshot/SnapshotCard";
import { Fragment } from "react";

const snapshot = {
  id: 1,
  createdAt: { seconds: 1672531199 },
  user: {
    fullname: "Aliah Lane",
    username: "aliahlane",
  },
  snapshotUrl: "/images/snapshot/SnapshotCardImage.png",
  title: "Building your API stack",
  subtitle:
    "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
  topics: [
    { title: "Design", type: 0 },
    { title: "Research", type: 1 },
  ],
};

export default function Snapshot() {
  const snapshots = new Array(5)
    .fill(snapshot)
    .map((snapshot, index) => ({ ...snapshot, id: index + 1 }));

  return (
    <div className="w-full h-full overflow-hidden md:rounded-tl-[2.5rem] pt-8 border border-secondary flex flex-col bg-[#FCFCFD] overflow-y-auto pb-8">
      <div className="flex px-4 md:px-6 pb-5 border-b border-secondary items-start">
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-2xl md:text-[1.875rem] leading-[2.375rem] font-semibold">
            Snapshots
          </div>
          <div className="text-sm md:text-base leading-6 text-[#7C7C7C]">
            See what were discussed in previous days.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-6 w-full px-4 md:w-[95%] lg:w-[85%] lg:max-w-[85%] md:mx-auto">
        <SnapshotFilters />
        {snapshots.map((snapshot) => (
          <Fragment key={snapshot.id}>
            <SnapshotCard snapshot={snapshot} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
