import { Icon } from "@iconify/react";
import React from "react";
import Btn from "../ui/Btn";
import { useRouter } from "next/navigation";

export default function CareersCard({ data }) {
  const router = useRouter();

  const goToDetails = (id) => {
    router.push(`/careers/${id}`);
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-3 bg-[#FFFFFF] p-4 border border-[#D5D7DA] rounded-xl">
      <div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center border border-[#D5D7DA] rounded-md">
            <Icon icon="tabler:briefcase-2" width={20} height={20} />
          </div>
          <p className="text-[#414651] font-semibold text-sm">{data.vacancy}</p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-2 lg:mt-0 lg:pl-14">
          <p className="text-[#535862] text-sm">{data.short_description.substring(0, 200)}...</p>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 font-semibold text-[#535862] text-sm">
              <Icon icon="ep:location" width={20} height={20} />
              {data.location}
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-[#535862] text-sm">
              <Icon icon="tabler:clock" width={20} height={20} />
              {data.type}
            </p>
            {/* <p className="flex items-center gap-1.5 font-semibold text-[#535862] text-sm">
              <Icon icon="mage:dollar" width={20} height={20} />
              {data.salary}
            </p> */}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Btn
          title="More Details"
          onClick={() => goToDetails(data.id)}
          className="bg-[#FFFFFF] border border-[#D5D7DA] text-[#414651] font-semibold text-sm"
        />
        {/* <Btn
          title="Apply"
          className="bg-[#3B88E3] border border-[Gradient/skeuemorphic-gradient-border] text-[#FFFFFF] font-semibold text-sm"
        /> */}
      </div>
    </div>
  );
}
