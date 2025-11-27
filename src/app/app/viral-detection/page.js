"use client";
import React, { useEffect, useState } from "react";
import ViralCard from "./card/ViralCard";
import { Icon } from "@iconify/react";
import ViralSidebarContent from "./card/ViralSidebarContent";
import { getViralDetections } from "@/services/polls/polls";
import Btn from "@/components/ui/Btn";

export default function ViralDetection() {
  const [viralData, setViralData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const categories = ["ALL", "FINANCE", "CRYPTO", "POLITICS", "AI"];

  useEffect(() => {
    getViralDetections().then(d => {
      setViralData(d);
      setFilteredData(d);
    });
  }, []);

  useEffect(() => {
    if (activeCategory === "ALL") {
      setFilteredData(viralData);
    } else {
      setFilteredData(
        viralData.filter(
          (item) => item.category?.toUpperCase() === activeCategory
        )
      );
    }
  }, [activeCategory, viralData]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start flex-1 justify-between gap-4">
            <div className="flex items-center gap-3 mt-4 flex-col md:flex-row">
              <div className="flex gap-[16px] items-center">
                <h1 className="text-3xl font-bold text-[#101828]">Viral Detection</h1>
                <img src="/images/hot_badge.png" />
              </div>
              <p className="text-[#475467] text-base text-right">Top 5 most trending topics today!</p>
            </div>
          
            <button
                className="hidden md:block gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => window.location.href = "/app/subscription"}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex flex-col flex-1">
            {/* Category Tabs */}
            <div className="flex gap-1 mt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeCategory === category
                      ? "text-blue-700 md:border border-[#2B425B40] rounded-full px-4 py-2"
                      : "text-[#475467] hover:text-[#101828]"
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                  )}
                </button>
              ))}
            </div>
            {/* Left Column - Articles */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-col gap-6">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <ViralCard data={item} key={item.id || index} />
                  ))
                ) : (
                  <p className="font-semibold text-xl mt-12 text-center text-[#98A2B3]">
                    No articles found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:w-[400px]">
            <ViralSidebarContent />
          </div>
        </div>
      </div>
    </div>
  );
}
