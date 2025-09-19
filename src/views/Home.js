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
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import HomeCarousel from "@/components/common/HomeCarousel";
import HomePoll from "@/components/common/HomePoll";
import Tabs from "@/components/ui/Tabs";

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

const navTopic = ["All", "AI", "Economics", "Travel", "Politics", "Crypto"];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [viewType, setViewType] = useState(HOME_LATEST);
  const [addPollDialogVisible, setAddPollDialogVisible] = useState(false);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentTopic, setCurrentTopic] = useState("All");
  const [trendingData, setTrendingData] = useState([]);

  const timerInterval = useRef(null);
  const pollInterval = useRef(null);

  const { ref, inView } = useInView();

  const changeTopic = useCallback((t) => {
    setCurrentTopic(t);
    setStart(null);
    setHasMore(true);
    setPolls([]);
  }, []);

  const handleCreatePoll = () => {
    if (auth.currentUser) {
      getUserById(auth.currentUser.uid).then((u) => {
        if (u.status === 1) {
          setAddPollDialogVisible(true);
        } else {
          toast.error("You are not eligible to create a poll at this time.");
        }
      });
    } else {
      router.push("/auth/signin");
    }
  };

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

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    pollInterval.current = setInterval(() => {
      loadTrendingData();
      loadNewPolls()
        .then(() => {
          setRemainingSeconds(300);
        })
        .catch((err) => {
          console.error("Error loading new polls:", err);
          setRemainingSeconds(300);
        });
    }, 300 * 1000);

    setRemainingSeconds(300);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (pollInterval.current) clearInterval(pollInterval.current);
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
        setPolls((prevPolls) => [...prevPolls, ...poll_list]);
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

  const loadTrendingData = useCallback(() => {
    fetch("/api/trending")
      .then((res) => res.json())
      .then((data) => {
        setTrendingData(data.symbols);
      })
      .catch((error) => {
        console.error("Error loading trending data:", error);
      });
  }, [setTrendingData]);

  useEffect(() => {
    loadTrendingData();
  }, [loadTrendingData]);

  useEffect(() => {
    if (!loading && inView && hasMore) loadPolls();
  }, [inView, loading, hasMore, currentTopic, loadPolls]);

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full overflow-hidden md:rounded-tl-[40px] border border-secondary flex-col bg-[#FCFCFD]">
        <div className="flex-1 flex h-full">
          <div className="w-full flex-1 flex flex-col h-full">
            <div className="flex flex-col items-start">
              <HomeCarousel title="Trending" data={trendingData} speed={30} />
              <HomeCarousel
                trend={false}
                title="Upcoming Event"
                className="border-[#E4E7EC] border-t-[1px] border-b-[1px]"
                data={carousel.filter((item) => item.category === "events")}
                speed={35}
              />
            </div>

            <div className="px-4 pt-4 w-full flex items-center justify-between flex-col md:flex-row gap-3">
              <div className="w-full overflow-auto">
                <Tabs
                  options={navTopic}
                  activeTab={currentTopic}
                  setActiveTab={changeTopic}
                />
              </div>
            </div>

            <div className="px-4 py-4 font-bold">
              Live updates{" "}
              <span className="text-red-400">
                {parseInt(remainingSeconds / 60)} min {remainingSeconds % 60}{" "}
                sec
              </span>{" "}
              until next breaking news
            </div>

            <div className="px-4 w-full mx-auto xl:max-w-[80%]  flex flex-col gap-[24px] flex-1 h-full overflow-auto pb-[200px]">
              {polls.map((poll) => (
                <HomePoll data={poll} key={poll.id} />
              ))}
              {/* Intersection Observer Trigger */}
              <div ref={ref} className="h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
