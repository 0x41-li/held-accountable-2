"use client";
import SectionTitle from "@/components/common/SectionTitle";
import Selection from "@/components/ui/Selection";
import Tabs from "@/components/ui/Tabs";
import React, { useState } from "react";
import ViralCard from "./card/ViralCard";
import { Icon } from "@iconify/react";
import ViralSidebar from "./card/ViralSidebar";

const viralData = [
  {
    title: "Migrating to Linear 101T",
    descr:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.",
    img: "/images/viralPage/viralCard.png",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    topic: "technology",
    createdAt: Math.floor(Date.now() / 1000) - 22 * 60 * 60,
  },

  {
    title: "Migrating to Linear 101p",
    descr:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.",
    img: "/images/viralPage/viralCard.png",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    topic: "politics",
    createdAt: Math.floor(Date.now() / 1000) - 6 * 24 * 60 * 60,
  },
  {
    title: "Migrating to Linear 101s",
    descr:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.",
    img: "/images/viralPage/viralCard.png",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    topic: "sports",
    createdAt: Math.floor(Date.now() / 1000) - 27 * 24 * 60 * 60,
  },
  {
    title: "Migrating to Linear 101s",
    descr:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.",
    img: "/images/viralPage/viralCard.png",
    instagram: "https://www.instagram.com/",
    x: "https://x.com/",
    topic: "sports",
    createdAt: Math.floor(Date.now() / 1000) - 27 * 24 * 60 * 60,
  },
];
export default function Snapshots() {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("Last Month");
  const [platform, setPlatform] = useState("");
  const tabs = ["24 Hours", "Last Week", "Last Month"];

  //all platforms for filter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const platforms = [
    "All",
    ...new Set(
      viralData
        .map((item) => item.topic)
        .filter(Boolean)
        .map((topic) => capitalize(topic))
    ),
  ];

  const filterByTab = (item) => {
    const now = Date.now();
    const createdMs = item.createdAt * 1000;

    if (activeTab === "24 Hours") {
      return createdMs >= now - 24 * 60 * 60 * 1000;
    } else if (activeTab === "Last Week") {
      return createdMs >= now - 7 * 24 * 60 * 60 * 1000;
    } else if (activeTab === "Last Month") {
      return createdMs >= now - 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  };

  const displayedTopics = (
    platform && platform !== "All"
      ? [platform]
      : platforms.filter((p) => p !== "All")
  ).filter((topic) =>
    viralData.some(
      (item) => capitalize(item.topic) === topic && filterByTab(item)
    )
  );

  console.log(displayedTopics)
  return (
    <div className="flex flex-col md:mt-3 border-l border-t border-[#E4E7EC] md:rounded-tl-3xl h-full">
      <SectionTitle
        title="Viral Detection"
        subtitle="The latest trends around the world, right in your sight."
        input
        value={searchValue}
        setValue={setSearchValue}
      />
      <div className="flex flex-col-reverse xl:flex-row w-full">
        <div className="flex flex-col py-6 px-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Tabs
              options={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <Selection
              options={platforms}
              active={platform}
              setActive={setPlatform}
              placeholder="Select Platform"
              className="min-w-[170px]"
            />
          </div>
          <div className="flex flex-col items-center gap-6 mt-6">
            {displayedTopics.length > 0? (
              displayedTopics.map((topic) => (
                <div key={topic} className="w-full gap-6 flex flex-col">
                  <p className="font-semibold text-xl">{topic}</p>
                  <div className="flex flex-col gap-6">
                    {viralData
                      .filter(
                        (item) =>
                          capitalize(item.topic) === topic && filterByTab(item)
                      )
                      .map((item, index) => (
                        <ViralCard data={item} key={index} />
                      ))}
                  </div>
                </div>
              ))
            ):(
              <p className="font-semibold text-xl mt-12">No info</p>
            )}
          </div>
        </div>

        <ViralSidebar platforms={platforms} viralData={viralData} />
      </div>
    </div>
  );
}
