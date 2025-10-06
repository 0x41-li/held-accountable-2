import Label from "@/components/ui/Label";
import { formatDateTime } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ViralCard({ data }) {
  const postedDate = new Date(data.createdAt * 1000);

  return (
    <div className="flex flex-col lg:flex-row sm:w-[80%] lg:w-full mx-auto gap-6 lg:gap-0 lg:items-center rounded-xl border border-[#E9EAEB] lg:max-h-[177px] py-4">
      <div className="flex flex-col items-start px-6 w-full">
        <div className="flex items-center justify-between w-full gap-2">
          <p className="text-lg font-semibold line-clamp-1">{data.title}</p>
        </div>
        <span className="text-[#535862] line-clamp-2 mt-1">{data.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 100)}</span>
        <div className="flex items-center gap-2 w-full mt-6 mb-6 lg:mb-0">
          {data.category && (
              <Label
                text={data.category}
                className="bg-[#FDF2FA] border border-[#FCCEEE] !text-[#C11574] !py-[2px]"
              />
          )}
          <Link href={"/viral-detection/" + data.id} className="ml-auto">
            <Label
              text="Read more"
              icon="formkit:arrowright"
              className="!text-[#525252] flex-row-reverse"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
