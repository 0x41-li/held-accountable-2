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
import Input from "@/components/ui/Input";
import HomeCarousel from "@/components/common/HomeCarousel";
import HomePoll from "@/components/common/HomePoll";

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

const pollData = [
  {
    id: 1,
    author: {
      image: "/images/olivar_avatar.png",
      name: "Aliah Lane",
      username: "@aliahlane_official",
    },
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",
    descr:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",

    topic: "AI",

    questions: [
      {
        id: 1,
        question: "Narrative Title here and here darrative Title here and here",
        descr:
          "How do you create compelling presentations that wow your colleagues and impress your managers?, How do you create compelling presentations that wow your colleagues and impress your managers?",
        img: "/images/homeCarousel/image1.png",
        dislikes: 120,
        likes: 120,
      },
      {
        id: 2,
        question: "Narrative Title here and here",
        descr:
          "How do you create compelling presentations that wow your colleagues and impress your managers?",
        img: "/images/homeCarousel/image1.png",
        dislikes: 10,
        likes: 110,
      },
    ],

    info: {
      votesCount: 1200,
      likes: 3500,
      posted: 1737261000,
      pollStart: 1737261600,
      pollEnd: 1737265200,
    },
  },
  {
    id: 2,
    author: {
      image: "/images/olivar_avatar.png",
      name: "AA dd",
      username: "@ddddd",
    },
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",
    descr: "",
    topic: "Frontend",

    questions: [
      {
        id: 1,
        question: "Narrative Title here and here",
        descr:
          "How do you create compelling presentations that wow your colleagues and impress your managers?",
        img: "/images/homeCarousel/image1.png",
        dislikes: 120,
        likes: 120,
      },
      {
        id: 2,
        question: "Narrative Title here and here",
        descr:
          "How do you create compelling presentations that wow your colleagues and impress your managers?",
        img: "/images/homeCarousel/image1.png",
        dislikes: 10,
        likes: 110,
      },
    ],

    info: {
      votesCount: 200,
      likes: 84,
      posted: 1737261000,
      pollStart: 1737261600,
      pollEnd: 1737265200,
    },
  },
  {
    id: 3,
    author: {
      image: "/images/olivar_avatar.png",
      name: "AA bb",
      username: "@a22f2",
    },
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",
    descr:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?",
    topic: "Read Articles",

    questions: [],
    info: {
      likes: 14,
      posted: 1737261000,
      pollStart: 1737261600,
      pollEnd: 1737265200,
    },
  },
];

const navTopic = ["Trending", "Latest", "Most Answered"];

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
    "Health",
    "Economics",
    "Travel",
    "Politics",
    "Life Style",
    "Products",
    "Entertainment",
    "Crypto",
  ]);
  const [currentTopic, setCurrentTopic] = useState("Trending");

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
  //   if (!loading && inView && hasMore) loadPolls();
  // }, [inView, loading, hasMore, currentTopic, loadPolls]);

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full h-full overflow-hidden md:rounded-tl-3xl border border-secondary flex flex-col bg-[#FCFCFD]">
      <div className="flex-1 flex h-full">
        <div className="w-full flex-1 flex flex-col h-full">
          <div className="flex flex-col pb-5 pt-5 px-6 border-b border-[#E4E7EC]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-3xl font-semibold text-nowrap">Latest Polls</p>
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

          <div className="px-4 w-full flex items-center justify-between flex-col md:flex-row pt-5 gap-2">
            <div className="w-full overflow-auto border border-primary rounded-md md:w-[max-content]">
              <div className="flex overflow-hidden flex-nowrap w-fit">
                {/* {trendingTopics.map((topic, i) => ( */}

                {navTopic.map((topic, i) => (
                  <div
                    key={topic + "_" + i}
                    className={`py-2 px-4 cursor-pointer text-nowrap ${
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
            <button
              className="hidden md:block rounded-md bg-blue text-white py-2.5 px-3.5 text-nowrap"
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
              // onRefresh={onRefresh}
            />
          </div>

          <div className="px-4 w-full flex flex-col gap-6 mt-6 flex-1 h-full overflow-auto pb-[200px] md:max-w-[90%] mx-auto overflow-x-hidden">
            {/* {polls.map((poll) =>
              poll.questions ? (
                <Poll key={poll.id + "_poll_component"} poll={poll} />
              ) : (
                poll
              )
            )} */}

            {pollData.map((poll) => (
              <HomePoll data={poll} key={poll.id} />
            ))}
            {/* Intersection Observer Trigger */}
            <div ref={ref} className="h-10" />
          </div>
        </div>
        {/* <div className="border-l border-secondary px-[26px] hidden gap-[24px] flex-col md:flex">
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
        </div> */}
      </div>
    </div>
  );
}
