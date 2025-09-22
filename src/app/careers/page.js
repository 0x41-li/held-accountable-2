"use client";

import CareersCard from "@/components/common/CareersCard";
import Pagination from "@/components/common/Pagination";
import SectionTitle from "@/components/common/SectionTitle";
import Tabs from "@/components/ui/Tabs";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";

const data = [
  // {
  //   vacancy: "Senior UX Designer - AI Products",
  //   descr:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //   location: "Remote",
  //   type: "Full-time",
  //   salary: "$80 - $100k",
  //   industry: "Marketing",
  // },
];

export default function Careers() {
  const filters = [
    "View All",
    "Development",
    "Design",
    "Operation",
    "Finance",
    "Marketing",
  ];
  const [activeFilter, setActiveFilter] = useState("View All");
  const [page, setPage] = useState(1);
  const itmsToShow = 6;

  const filteredData =
    activeFilter === "View All"
      ? data
      : data.filter((item) => item.industry === activeFilter);
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
      <div className="flex flex-col items-start lg:items-center mt-10 w-[95%] lg:w-[90%] mx-auto">
        <div className="flex items-center rounded-full p-1 gap-2 bg-[#3B88E31A] border-[#C1D8F5] cursor-pointer text-[#3B88E3] text-sm font-medium">
          <p className="border-[#C1D8F5] rounded-full bg-white px-2.5 py-1">
            We’re hiring!
          </p>
          <p className="flex items-center gap-1 pr-1">
            Join our team
            <Icon icon="iconamoon:arrow-right-1" width={16} height={16} />
          </p>
        </div>
        <div className="flex flex-col lg:flex-row mt-2 lg:mt-0 items-center lg:gap-4">
          <div className="flex flex-col max-w-[800px] w-full items-start">
            <p className="font-semibold text-4xl xl:text-6xl text-[#181D27]">
              Be a part of our mission at Held-Accountable
            </p>
            <span className="text-1xl xl:text-xl leading-6 mt-5 text-[#535862]">
              We&apos;re looking for passionate people to join us on our
              mission. We value flat hierachies, clear communications, and full
              ownership and responsibility
            </span>
          </div>
          <Image
            src="/images/careersBanner.png"
            width={396}
            height={388}
            className="w-full"
            alt="We’re hiring!"
          />
        </div>
      </div>

      <div className="flex flex-col w-[95%] lg:w-[85%] mx-auto mt-6">
        <div className="mb-6">
          {/* <div className="flex overflow-hidden flex-nowrap w-[max-content] border border-primary rounded-[8px]">
            {filters.map((item, index) => (
              <div
                key={index}
                className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${
                  activeFilter === item ? "bg-[#F4F4F4]" : "bg-white"
                } ${
                  index != filters.length - 1 ? " border-r border-primary" : ""
                }`}
                onClick={() => handleFilterChange(item)}
              >
                {item}
              </div>
            ))}
          </div> */}
          <Tabs options={filters} activeTab={activeFilter} setActiveTab={handleFilterChange}/>
        </div>
        <div className="flex flex-col gap-6 mb-10">
          {paginatedData.map((item, index) => (
            <CareersCard data={item} key={index} />
          ))}
        </div>

        <Pagination setPage={setPage} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
