"use client";
import { useCallback, useEffect, useState } from "react";
import HomeCarousel from "@/components/common/HomeCarousel";

export default function TrendingEventsBar() {
  const [trendingData, setTrendingData] = useState([]);
  const [eventData, setEventData] = useState([]);

  const loadTrendingData = useCallback(() => {
    fetch("/api/trending")
      .then((res) => res.json())
      .then((data) => {
        setTrendingData(data.symbols);
      })
      .catch((error) => {
        console.error("Error loading trending data:", error);
      });
  }, []);

  const loadEventData = useCallback(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEventData(data.data.filter((ev) => ev.title.eng));
      })
      .catch((error) => {
        console.error("Error loading event data:", error);
      });
  }, []);

  useEffect(() => {
    loadTrendingData();
    loadEventData();
  }, [loadTrendingData, loadEventData]);

  return (
    <div className="flex flex-col items-start">
      <HomeCarousel title="" data={trendingData} speed={30} />
      <HomeCarousel
        trend={false}
        title=""
        className="border-[#E4E7EC] border-t-[1px] border-b-[1px]"
        data={eventData}
        speed={35}
      />
    </div>
  );
}

