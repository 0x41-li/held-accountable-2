"use client";
import SectionTitle from "@/components/common/SectionTitle";
import Selection from "@/components/ui/Selection";
import Tabs from "@/components/ui/Tabs";
import React, { useEffect, useState } from "react";
import ViralCard from "./card/ViralCard";
import { Icon } from "@iconify/react";
import ViralSidebar from "./card/ViralSidebar";
import { getViralDetections } from "@/services/polls/polls";

export default function Snapshots() {
  const [viralData, setViralData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("24 Hours");
  const [platform, setPlatform] = useState("");
  const [platforms, setPlatforms] = useState(["All"]);
  const tabs = ["24 Hours", "Last Week", "Last Month"];

  //all platforms for filter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    // const now = Date.now() - 24 * 60 * 60 * 1000;
    // let endDate = (new Date(Date.now() - 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
    // let startDate = endDate;

    // if (activeTab === "24 Hours") {
    //   startDate = endDate;
    // } else if (activeTab === "Last Week") {
    //   startDate = (new Date(now - 7 * 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
    // } else if (activeTab === "Last Month") {
    //   startDate = (new Date(now - 30 * 24 * 60 * 60 * 1000)).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10);
    // }

    getViralDetections().then(d => setViralData(d));
  }, [activeTab]);

  useEffect(() => {
    setPlatforms([
      "All",
      ...new Set(
        viralData
          .map((item) => item.category)
          .filter(Boolean)
          .map((topic) => capitalize(topic))
      ),
    ]);
  }, [viralData]);

  return (
    <div className="flex flex-col md:mt-3 border-l border-t border-[#E4E7EC] md:rounded-tl-3xl h-full">
      <SectionTitle
        title="Viral Detection"
        subtitle="Top 5 most trending topics today!"
      />
      <div className="flex flex-col-reverse xl:flex-row w-full">
        <div className="flex flex-col py-6 px-4 w-full">
          {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Tabs
              options={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <Selection
              options={platforms}
              active={platform}
              setActive={setPlatform}
              placeholder="Select Category"
              className="min-w-[170px]"
            />
          </div> */}
          <div className="flex flex-col items-center gap-6 mt-6">
            {viralData.length > 0? 
                  <div className="flex flex-col gap-6">
                    {viralData.map((item, index) => (
                        <ViralCard data={item} key={index} />))}
            </div>:(
              <p className="font-semibold text-xl mt-12">No info</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
