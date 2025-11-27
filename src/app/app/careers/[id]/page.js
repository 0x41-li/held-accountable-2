'use client';
import { CAREERS_DATA } from "@/services/const";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import { useParams } from "next/navigation";

export default function CareerDetailsPage() {
  const {id} = useParams();
  const job = CAREERS_DATA[id];

  return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Careers</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px] px-[30px]'>
            <div className='flex flex-col gap-[16px]'>
                <p className="text-[26px] font-bold">{job.vacancy}</p>
                <div className="flex items-center gap-3">
                    <p className="flex items-center gap-1.5 font-semibold text-[#535862] text-sm">
                        <Icon icon="ep:location" width={20} height={20} />
                        {job.location}
                    </p>
                    <p className="flex items-center gap-1.5 font-semibold text-[#535862] text-sm">
                        <Icon icon="tabler:clock" width={20} height={20} />
                        {job.type}
                    </p>
                </div>
            </div>
            <hr className="border-t border-secondary" />
            <div className="flex gap-[20px] items-start justify-start flex-col md:flex-row">
                <img src="/images/careersPage/requirements.png" />
                <div className="golden-insight-detail-content" dangerouslySetInnerHTML={{ __html: marked(job.qualifications)}}>

                </div>
            </div>
            <hr className="border-t border-secondary" />
            <div className="flex gap-[20px] items-start justify-start flex-col md:flex-row">
                <img src="/images/careersPage/about.png" />
                <div className="golden-insight-detail-content" dangerouslySetInnerHTML={{ __html: marked(job.about)}}>

                </div>
            </div>
            <hr className="border-t border-secondary" />
            <div className="flex gap-[20px] items-start justify-start flex-col md:flex-row">
                <img src="/images/careersPage/responsibilities.png" />
                <div className="golden-insight-detail-content" dangerouslySetInnerHTML={{ __html: marked(job.responsibilities)}}>

                </div>
            </div>
          </div>
        </div>);
}