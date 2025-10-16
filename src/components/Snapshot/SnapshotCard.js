import { formatDate } from "@/utils/date";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export function SnapshotCard({ snapshot, showManage, changeSnapshotStatus, deleteSnapshot }) {
  return (
    <div
      key={snapshot.id}
      className="flex flex-col lg:flex-row sm:w-[80%] lg:w-full mx-auto gap-6 lg:gap-0 lg:items-center border border-[#e9eaeb] rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col px-6 pb-6 lg:pb-6 lg:pt-9 w-full">
        <div className="flex items-center justify-between w-full gap-2 mt-6 lg:mt-0">
          <div className="flex gap-[0.625rem] items-center">
            {/* <div className="rounded-full overflow-hidden">
              <img
                src={snapshot.user?.avatar ?? "/images/snapshot/AlishLane.png"}
                width={32}
                height={32}
                alt="Author Avatar"
              />
            </div> */}
            <div className="flex flex-col gap-0">
              <p className="font-medium text-[#101828] text-sm">
                {snapshot.user ? snapshot.user.fullname : ""}
              </p>
              <span className="text-xs text-[#7c7c7c]">
                {
                  formatDate(new Date(snapshot.createdAt.seconds * 1000)).split(
                    "●"
                  )[1]
                }
              </span>
            </div>
          </div>
          <button>
            <Icon
              icon="mdi:bookmark-plus-outline"
              width={18}
              height={18}
              style={{ color: "#6b6366" }}
            />
          </button>
        </div>

        <p className="text-lg font-semibold text-[#181d27] leading-[156%] mt-2 line-clamp-1">
          {snapshot.title}
        </p>
        <p className="text-[#535862] text-base leading-[150%] mt-1 line-clamp-2">
            {snapshot.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 100) +
              (snapshot.content.length > 100 ? "..." : "")}
        </p>

        <div className="flex items-center w-full mt-6 mb-6 lg:mb-0 justify-between flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
          {snapshot.tags.map((tag, index) => (
            <div
              key={index}
              className={`rounded-full border  flex justify-center items-center px-3 py-1 ${
                index === 0
                  ? "border-[#e9d7fe] bg-[#F9F5FF]"
                  : "border-[#c7d7fe] bg-[#eef4ff]"
              }`}
            >
              <p
                className={`leading-[143%] text-sm font-medium ${
                  index === 0 ? "text-[#6941C6]" : "text-[#3538cd]"
                }`}
              >
                {tag}
              </p>
            </div>
          ))}
          </div>
          <div className="flex items-center gap-4">
            {showManage && <button className="text-sm font-medium leading-[143%] flex items-center" onClick={() => {changeSnapshotStatus(snapshot)}}>
              {snapshot.enabled ? <span className="text-sm inline-flex items-center gap-1 text-green-600"><Icon icon="streamline-sharp:visible" /> Enabled</span> : <span className="text-sm inline-flex items-center gap-1 text-red-600"><Icon icon="streamline-flex:invisible-1" /> Disabled</span>}
            </button>}
            {showManage && <button className="text-sm font-medium leading-[143%] flex items-center gap-1 text-red-600" onClick={() => {deleteSnapshot(snapshot.id)}}>
              <Icon icon="tabler:trash" /> Delete
            </button> }
            <Link href={"/snapshots/" + snapshot.id} className="flex items-center gap-1">
              <p className="text-sm font-medium leading-[143%] text-[#525252]">
                Read More
              </p>
              <Icon
                icon="line-md:arrow-up"
                className={"transition-transform duration-300 rotate-90"}
                style={{ color: "#525252" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
