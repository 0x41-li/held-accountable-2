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

export default function Home() {
  const [viewType, setViewType] = useState(HOME_LATEST);
  const [addPollDialogVisible, setAddPollDialogVisible] = useState(false);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState([
    "All",
    "AI",
    "Economics",
    "Travel",
    "Politics",
    "Crypto",
  ]);
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
    <div className="w-full h-full overflow-hidden md:rounded-tl-[40px] border border-secondary flex flex-col bg-[#FCFCFD]">
      <div className="flex-1 flex h-full">
        <div className="w-full flex-1 pt-[24px] flex flex-col h-full mt-4">
          <div className="px-4 w-full flex items-center justify-between flex-col md:flex-row">
            <div className="w-full overflow-auto">
              <div className="flex rounded-[8px] overflow-hidden border border-primary flex-nowrap w-fit">
                {trendingTopics.map((topic, i) => (
                  <div
                    key={topic + "_" + i}
                    className={`py-[8px] px-[16px] cursor-pointer text-nowrap ${
                      currentTopic === topic ? "bg-[#F4F4F4]" : "bg-white"
                    } ${
                      i != trendingTopics.length - 1
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
            {/* <button className='hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px] text-nowrap' onClick={() => handleCreatePoll()}>
                  + Create Poll
                </button>
                <button className='rounded-full block fixed right-[40px] text-xl bottom-[40px] w-[40px] h-[40px] md:hidden bg-blue text-white' onClick={() => handleCreatePoll()}>
                  +
                </button> */}
            <CreatePoll
              show={addPollDialogVisible}
              hideDialog={() => setAddPollDialogVisible(false)}
              onRefresh={onRefresh}
            />
          </div>
          <div className="px-4 w-full flex flex-col gap-[24px] pt-[24px] flex-1 h-full overflow-auto pb-[200px]">
            {polls.map((poll) =>
              poll.questions ? (
                <Poll key={poll.id + "_poll_component"} poll={poll} />
              ) : (
                poll
              )
            )}
            {/* Intersection Observer Trigger */}
            <div ref={ref} className="h-10" />
          </div>
        </div>
        <div className="border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex">
          <div className="flex items-center pt-[20px]">
            <div className="text-lg leading-lg font-semibold w-[219px]">
              Latest Polls
            </div>
            <Link
              href="/"
              className="text-[#475467] text-[14px] leading-[20px] font-semibold"
            >
              View all
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
