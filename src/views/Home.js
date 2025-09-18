"use client";
import { useCallback, useEffect, useState } from "react";
import Poll from "@/components/Poll";
import {
  HOME_LATEST,
  getHomePolls,
  getPollsByTopic,
  getUserById,
} from "@/services/polls/polls";
import CreatePoll from "@/components/CreatePoll";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import GoldenInsightDetail from "@/components/GoldenInsightDetail";
import HomeCarousel from "@/components/common/HomeCarousel";
import HomePoll from "@/components/common/HomePoll";
import Input from "@/components/ui/Input";

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
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [intervalId, setIntervalId] = useState(-1);
  const [currentGoldenInsight, setCurrentGoldenInsight] = useState(null);
  const [currentTopic, setCurrentTopic] = useState("All");

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

  // const loadNewPolls = useCallback(async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   try {
  //     let poll_list = [],
  //       lastDoc;

  //     if (currentTopic === "All") {
  //       const { result } = await getHomePolls(viewType, null);
  //       poll_list = result;
  //     } else {
  //       const { result } = await getPollsByTopic(
  //         currentTopic,
  //         null
  //       );
  //       poll_list = result;
  //     }

  //     if (poll_list.length === 0) {
  //       return;
  //     }

  //     if (poll_list.length > 0) {
  //       setPolls((prevPolls) => [...poll_list.filter(p => !prevPolls.some(p1 => p1.id === p.id)), ...prevPolls]);
  //     }
  //   } catch (error) {
  //     console.error("Error loading polls:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [loading, currentTopic, viewType, start]);

  // const loadPolls = useCallback(async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   try {
  //     let poll_list = [],
  //       lastDoc;

  //     if (currentTopic === "All") {
  //       const { result, lastDoc: last } = await getHomePolls(viewType, start);
  //       poll_list = result;
  //       lastDoc = last;
  //     } else {
  //       const { result, lastDoc: last } = await getPollsByTopic(
  //         currentTopic,
  //         start
  //       );
  //       poll_list = result;
  //       lastDoc = last;
  //     }

  //     if (poll_list.length === 0) {
  //       setHasMore(false);
  //       return;
  //     }

  //     if (poll_list.length > 0) {
  //       setStart(lastDoc);
  //       setPolls((prevPolls) => [...prevPolls, ...poll_list]);
  //     } else {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.error("Error loading polls:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [loading, currentTopic, viewType, start]);

  // const onRefresh = useCallback(() => {
  //   setStart(null);
  //   setHasMore(true);
  //   setPolls([]);
  // }, []);

  // useEffect(() => {
  //   if (polls.length > 0)
  //     setRemainingSeconds(parseInt(((polls[0].createdAt.seconds + 300) * 1000 - Date.now()) / 1000));
  // }, [polls]);

  // useEffect(() => {
  //   if (!loading && inView && hasMore) loadPolls();
  // }, [inView, loading, hasMore, currentTopic, loadPolls, setIntervalId]);

  // useEffect(() => {
  //   if (intervalId == -1)
  //     setIntervalId(setInterval(() => {
  //       setRemainingSeconds((prev) => {
  //         if (prev < 0) {
  //           if (!loading)
  //             loadNewPolls();
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //   }, 1000));
  // }, [setIntervalId, setRemainingSeconds]);

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

  useEffect(() => {
    if (!loading && inView && hasMore) loadPolls();
  }, [inView, loading, hasMore, currentTopic, loadPolls]);

  return (
    <div className="w-full h-full">
      <div className={`${currentGoldenInsight ? "hidden": "flex"} w-full h-full overflow-hidden md:rounded-tl-[40px] border border-secondary flex-col bg-[#FCFCFD]`}>
        <div className="flex-1 flex h-full">
          <div className="w-full flex-1 flex flex-col h-full">
            <div className="flex flex-col pb-5 pt-5 px-6 border-b border-[#E4E7EC]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-3xl font-semibold text-nowrap">
                  Latest Polls
                </p>
                <Input
                  icon="iconoir:search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search"
                />
              </div>
              <span className="text-[#7C7C7C]">
                You can see the latest polls submitted to Poll Mania{" "}
              </span>
            </div>

            <div className="flex flex-col items-start">
              <HomeCarousel
                title="Trending"
                data={carousel.filter((item) => item.category === "trend")}
                speed={30}
              />
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
                <div className="flex rounded-[8px] overflow-hidden border border-primary flex-nowrap w-fit">
                  {navTopic.map((topic, i) => (
                    <div
                      key={topic + "_" + i}
                      className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${
                        currentTopic === topic ? "bg-[#F4F4F4]" : "bg-white"
                      } ${
                        i != navTopic.length - 1
                          ? " border-r border-primary"
                          : ""
                      }`}
                      onClick={() => changeTopic(topic)}
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px] text-nowrap"
                onClick={() => handleCreatePoll()}
              >
                + Create Poll
              </button>
              <button
                className="rounded-full block fixed right-[40px] text-xl bottom-[40px] w-[40px] h-[40px] md:hidden bg-blue text-white"
                onClick={() => handleCreatePoll()}
              >
                +
              </button>
              <CreatePoll
                show={addPollDialogVisible}
                hideDialog={() => setAddPollDialogVisible(false)}
                onRefresh={onRefresh}
              />
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
              {/* {polls.map((poll) =>
                poll.questions ? (
                  <Poll key={poll.id + "_poll_component"} poll={poll} showGoldenInsight={setCurrentGoldenInsight} />
                ) : (
                  poll
                )
              )} */}

              {polls.map((poll) => (
                <HomePoll data={poll} key={poll.id + "_poll_component"} showGoldenInsight={setCurrentGoldenInsight}/>
              ))}

              {/* Intersection Observer Trigger */}
              <div ref={ref} className="h-10" />
            </div>
          </div>
        </div>
      </div>
      {currentGoldenInsight ? (
        <GoldenInsightDetail
          id={currentGoldenInsight}
          goBack={() => setCurrentGoldenInsight(null)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
