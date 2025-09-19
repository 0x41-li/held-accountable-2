import Label from "@/components/ui/Label";
import { formatDateTime } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ViralCard({ data }) {
  const postedDate = new Date(data.createdAt * 1000);

  return (
    <div className="flex flex-col lg:flex-row sm:w-[80%] lg:w-full mx-auto gap-6 lg:gap-0 lg:items-center rounded-xl border border-[#E9EAEB] lg:max-h-[177px]">
      <Image
        src={data.img}
        width={265}
        height={177}
        className="h-full w-auto rounded-bl-none rounded-br-none rounded-tr-xl rounded-tl-xl lg:rounded-xl"
        alt={data.title}
      />
      <div className="flex flex-col items-start px-6 w-full">
        <div className="flex items-center justify-between w-full gap-2">
          <p className="text-lg font-semibold line-clamp-1">{data.title}</p>
          <span className="text-[10px] text-[#667085] text-nowrap w-[max-content]">{formatDateTime(postedDate)}</span>
        </div>
        <span className="text-[#535862] line-clamp-2 mt-1">{data.descr}</span>
        <div className="flex items-center gap-2 w-full mt-6 mb-6 lg:mb-0">
          {data.instagram && (
            <Link
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Label
                text="Instagram"
                className="bg-[#FDF2FA] border border-[#FCCEEE] text-[#C11574] !py-[2px]"
              />
            </Link>
          )}
          {data.x && (
            <Link href={data.x} target="_blank" rel="noopener noreferrer">
              <Label
                text="X (Twitter)"
                className="bg-[#FAFAFA] border border-[#E9EAEB] !text-[#414651] !py-[2px]"
              />
            </Link>
          )}
          <Link href="/" className="ml-auto">
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
