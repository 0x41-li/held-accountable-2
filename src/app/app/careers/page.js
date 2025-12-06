"use client";

import CareersCard from "@/components/common/CareersCard";
import Pagination from "@/components/common/Pagination";
import SectionTitle from "@/components/common/SectionTitle";
import Tabs from "@/components/ui/Tabs";
import { CAREERS_DATA } from "@/services/const";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";


export default function Careers() {
  const filters = [
    "View All",
    "AI/ML",
    "Marketing",
    "Engineering",
  ];
  const [activeFilter, setActiveFilter] = useState("View All");
  const [page, setPage] = useState(1);
  const itmsToShow = 6;

  const filteredData =
    activeFilter === "View All"
      ? CAREERS_DATA
      : CAREERS_DATA.filter((item) => item.industry === activeFilter);
  const totalPages = Math.ceil(filteredData.length / itmsToShow);
  const paginatedData = filteredData.slice(
    (page - 1) * itmsToShow,
    page * itmsToShow
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <div className="flex flex-col mb-[40px] md:border-l border-t border-[#E4E7EC] mt-3 h-full w-full md:rounded-tl-3xl bg-[#FCFCFD]">
      <SectionTitle title='Careers'/>
      <div className="flex flex-col items-start lg:items-center mt-6 md:mt-10 w-[95%] lg:w-[90%] mx-auto px-4 md:px-0">
        <div className="flex items-center rounded-full p-1 gap-2 bg-[#3B88E31A] border-[#C1D8F5] cursor-pointer text-[#3B88E3] text-xs md:text-sm font-medium">
          <p className="border-[#C1D8F5] rounded-full bg-white px-2 md:px-2.5 py-1">
            We're hiring!
          </p>
          <p className="flex items-center gap-1 pr-1">
            Join our team
            <Icon icon="iconamoon:arrow-right-1" width={14} height={14} className="md:w-4 md:h-4" />
          </p>
        </div>
        <div className="flex flex-col lg:flex-row mt-4 lg:mt-6 items-center lg:gap-4 w-full">
          <div className="flex flex-col max-w-[800px] w-full items-start">
            <p className="font-semibold text-2xl md:text-4xl xl:text-6xl text-[#181D27]">
              Be a part of our mission at Held-Accountable
            </p>
            <span className="text-sm md:text-base xl:text-xl leading-6 mt-3 md:mt-5 text-[#535862]">
              We&apos;re looking for passionate people to join us on our
              mission. We value flat hierachies, clear communications, and full
              ownership and responsibility
            </span>
          </div>
          <Image
            src="/images/careersBanner.png"
            width={396}
            height={388}
            className="w-full max-w-[396px] mt-6 lg:mt-0"
            alt="We're hiring!"
          />
        </div>
      </div>

      <div className="flex flex-col w-[95%] lg:w-[85%] mx-auto mt-6 md:mt-8 px-4 md:px-0">
        <div className="mb-6 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <Tabs options={filters} activeTab={activeFilter} setActiveTab={handleFilterChange}/>
        </div>
        <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-10">
          {paginatedData.map((item, index) => (
            <CareersCard data={{...item, id: index}} key={index} />
          ))}
        </div>

        <Pagination setPage={setPage} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
