"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOME_LATEST,
  getHomePolls,
  getPollsByTopic,
  getUserById,
} from "@/services/polls/polls";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import Tabs from "@/components/ui/Tabs";
import Poll from "@/components/Poll";
import GoldenInsightDetail from "@/components/GoldenInsightDetail";
import GoldenInsightDetailPage from "@/app/app/golden-insights/[id]/page";

const carousel = [
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image1.png",
    descr: "Carousel Subtitle goes here and here",
    category: "trend",
    id: 1,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image2.png",
    descr: "Carousel Subtitle goes here and here",
    category: "events",
    id: 2,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image1.png",
    descr: "Carousel Subtitle goes here and here",
    category: "trend",
    id: 3,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image2.png",
    descr: "Carousel Subtitle goes here and here",
    category: "events",
    id: 4,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image1.png",
    descr: "Carousel Subtitle goes here and here",
    category: "trend",
    id: 5,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image2.png",
    descr: "Carousel Subtitle goes here and here",
    category: "events",
    id: 6,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image1.png",
    descr: "Carousel Subtitle goes here and here",
    category: "trend",
    id: 7,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image2.png",
    descr: "Carousel Subtitle goes here and here",
    category: "events",
    id: 8,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image1.png",
    descr: "Carousel Subtitle goes here and here",
    category: "trend",
    id: 9,
  },
  {
    title: "Carousel title here and here",
    img: "/images/homeCarousel/image2.png",
    descr: "Carousel Subtitle goes here and here",
    category: "events",
    id: 10,
  },
];

const navTopic = ["All", "AI", "Finance", "Politics", "Crypto"];

export default function Home() {
  const [viewType, setViewType] = useState(HOME_LATEST);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentTopic, setCurrentTopic] = useState("All");
  const [detailId,  setDetailId] = useState(-1);

  const timerInterval = useRef(null);

  const { ref, inView } = useInView();

  const loadNewPolls = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      let poll_list = [],
        lastDoc;

      if (currentTopic === "All") {
        const { result } = await getHomePolls(viewType, null);
        poll_list = result;
      } else {
        const { result } = await getPollsByTopic(currentTopic, null);
        poll_list = result;
      }

      if (poll_list.length === 0) {
        return;
      }

      if (poll_list.length > 0) {
        setPolls((prevPolls) => [
          ...poll_list.filter((p) => !prevPolls.some((p1) => p1.id === p.id)),
          ...prevPolls,
        ]);
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentTopic, viewType]);

  const updateRemainingSeconds = useCallback(() => {
    if (polls.length > 0) {
      const rs = 300 - parseInt((Date.now() - polls[0].createdAt.seconds * 1000) / 1000);
      if (rs <= 0 && !loading) {
        loadNewPolls().catch((err) => {
          console.error("Error loading new polls:", err);
        });
      }
      setRemainingSeconds(rs > 0 ? rs : 0);
      return;
    }
    setRemainingSeconds(0);
  }, [setRemainingSeconds, polls, loading, loadNewPolls]);
  useEffect(() => {
    timerInterval.current = setInterval(() => {
      updateRemainingSeconds();
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [loadNewPolls]);

  const loadPolls = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      let poll_list = [],
        lastDoc;

      if (currentTopic === "All") {
        const { result, lastDoc: last } = await getHomePolls(viewType, start);
        poll_list = result;
        lastDoc = last;
      } else {
        const { result, lastDoc: last } = await getPollsByTopic(
          currentTopic,
          start
        );
        poll_list = result;
        lastDoc = last;
      }

      if (poll_list.length === 0) {
        setHasMore(false);
        return;
      }

      if (poll_list.length > 0) {
        setStart(lastDoc);
        setPolls((prevPolls) => [
          ...prevPolls,
          ...poll_list.filter((p) => !prevPolls.some((p1) => p1.id === p.id))
        ]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentTopic, viewType, start]);

  const onRefresh = useCallback(() => {
    setStart(null);
    setHasMore(true);
    setPolls([]);
  }, []);

  useEffect(() => {
    if (!loading && inView && hasMore) loadPolls();
  }, [inView, loading, hasMore, currentTopic, loadPolls]);

  return (
    <div className="w-full h-full">
      <div className={`${detailId == -1 ? "flex" : "hidden"} w-full h-full overflow-hidden md:rounded-tl-[40px] flex-col`}>
        <div className="flex-1 flex h-full">
          <div className="w-full flex-1 flex flex-col h-full">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-end gap-[19px]">
                <div className="text-[24px] md:text-[36px] font-[700] text-[#2b425b]">
                  What's happening now?
                </div>
                <p className="font-[500] text-[14px] text-[#2B425B66]">
                  Live updates{" "}
                  <span className="text-[#2B425B]">
                    {parseInt(remainingSeconds / 60)} min {remainingSeconds % 60}{" "}
                    sec
                  </span>{" "}
                  until next breaking news
                </p>
              </div>
              
              {/* Category Tabs */}
              <div className="flex gap-1 mt-2">
                {navTopic.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setCurrentTopic(topic);
                      setStart(null);
                      setHasMore(true);
                      setPolls([]);
                    }}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      currentTopic === topic
                        ? "text-blue-700 md:border border-dashed border-[#2B425B40] rounded-full px-4 py-2"
                        : "text-[#2b425b] hover:text-[#101828]"
                    }`}
                  >
                    {topic}
                    {currentTopic === topic && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="px-16 w-full mx-auto xl:max-w-[80%]  flex flex-col gap-[24px] flex-1 h-full overflow-auto pb-[200px]">
              {polls.map((poll) => (
                <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
              ))}
              {/* Intersection Observer Trigger */}
              <div ref={ref} className="h-10" />
            </div>
          </div>
        </div>
      </div>
      {
        detailId != -1 && <GoldenInsightDetailPage key={`detail_page_${detailId}`} data={{id: detailId, back: () => setDetailId(-1)}} />
      }
    </div>
  );
}
