"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOME_LATEST,
  getHomePolls,
  getPollsByTopic,
  getUserById,
  getViralDetections,
} from "@/services/polls/polls";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import Tabs from "@/components/ui/Tabs";
import Poll from "@/components/Poll";
import GoldenInsightDetail from "@/components/GoldenInsightDetail";
import GoldenInsightDetailPage from "@/app/app/golden-insights/[id]/page";
import { Icon } from "@iconify/react";
import { FAMOUS_COMPANIES_DATA } from "@/services/const";
import Link from "next/link";

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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [viralData, setViralData] = useState([]);

  const timerInterval = useRef(null);
  const companyDropdownRef = useRef(null);

  const { ref, inView } = useInView();

  // Get first 6 companies for the filter
  const filterCompanies = FAMOUS_COMPANIES_DATA.slice(0, 6);

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

  useEffect(() => {
    getViralDetections().then(data => {
      setViralData(data.slice(0, 3)); // Get first 3 viral detections
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className={`${detailId == -1 ? "flex" : "hidden"} w-full h-full overflow-hidden flex flex-col shadow-sm`}>
        {/* Header */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start flex-1 justify-between gap-4">
            <div className="flex items-end gap-3 mt-4 flex-col md:flex-row flex-1">
              <div className="flex gap-[16px] items-center">
                <h1 className="text-3xl font-bold text-[#2b425b]">What's happening now?</h1>
              </div>
              <p className="text-[#475467] text-sm md:text-base text-left md:text-right">
                Live updates{" "}
                <span className="text-[#2B425B]">
                  {parseInt(remainingSeconds / 60)} min {remainingSeconds % 60}{" "}
                  sec
                </span>{" "}
                until next breaking news
              </p>
            </div>
          
            <button
                className="hidden md:block gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => router.push("/app/subscription")}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex flex-col flex-1">
            {/* Company Filter and Category Tabs */}
            <div className="flex flex-col md:flex-row gap-4 px-6">
              {/* Company Filter */}
              <div className="flex flex-1 items-center gap-3 relative" ref={companyDropdownRef}>
                <button
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2b425b] hover:bg-[#F7F8FF] rounded-lg transition-colors"
                >
                  <Icon icon="mdi:cog" width={20} height={20} />
                  <span>MANAGE</span>
                </button>
                
                {selectedCompany && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F8FF] rounded-full border border-[#E4E7EC]">
                    <span className="text-sm font-medium text-[#2b425b]">
                      {FAMOUS_COMPANIES_DATA.find(c => c.id === selectedCompany)?.name || selectedCompany}
                    </span>
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className="text-[#98A2B3] hover:text-[#2b425b]"
                    >
                      <Icon icon="mdi:close" width={16} height={16} />
                    </button>
                  </div>
                )}

                {/* Company Dropdown */}
                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl p-6 shadow-lg border border-[#E4E7EC] z-50 w-[400px] max-w-[90vw]">
                    <div className="grid grid-cols-3 gap-4">
                      {filterCompanies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => {
                            setSelectedCompany(company.id);
                            setShowCompanyDropdown(false);
                          }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                            selectedCompany === company.id
                              ? "bg-[#F7F8FF] border-2 border-[#3D83FF]"
                              : "bg-[#F9FAFB] border border-transparent hover:bg-[#F7F8FF]"
                          }`}
                        >
                          <Icon 
                            icon={company.logo} 
                            className={`${selectedCompany === company.id ? "text-[#3D83FF]" : ""}`}
                            width={48} 
                            height={48} 
                          />
                          <span className={`text-xs font-medium ${
                            selectedCompany === company.id ? "text-[#3D83FF]" : "text-[#2b425b]"
                          }`}>
                            {company.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

            {/* Left Column - Polls */}
            <div className="flex-1 overflow-auto px-6 md:px-10 pt-[20px]">
              <div className="flex flex-col gap-6">
                {polls.map((poll) => (
                  <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                ))}
                {/* Intersection Observer Trigger */}
                <div ref={ref} className="h-10" />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden xl:flex xl:w-[400px] border-l border-[#E4E7EC] flex-col">
            <div className="flex flex-col gap-8 p-6 overflow-auto">
              {/* Viral Detection Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#101828]">Viral Detection</h3>
                    <img src="/images/hot_badge.png" alt="Hot" width={32} height={20} />
                  </div>
                  <Link href="/app/viral-detection" className="text-sm text-[#344054] font-medium hover:text-blue-600">
                    ALL
                  </Link>
                </div>
                <div className="flex flex-col gap-4 bg-[#F7F8FF80] rounded-[32px] p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
                  {viralData.length > 0 ? (
                    viralData.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-4 transition-colors">
                        <h4 className="text-sm font-semibold text-[#101828] line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#98A2B3]">
                          {item.content?.replace(/\*/g, "").replace(/#/g, "").substring(0, 100) +
                          (item.content?.length > 100 ? "..." : "")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#98A2B3] text-center py-4">No viral detections yet</p>
                  )}
                </div>
              </div>

              {/* Company Section */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#101828]">Company</h3>
                  <img src="/images/hot_badge.png" alt="Hot" width={32} height={20} />
                </div>
                <div className="flex flex-col gap-4 rounded-lg">
                  <div className="flex gap-[16px] w-full items-center">
                    <img src="/images/viralPage/companybg.png" alt="Company" className="flex-shrink-0" />
                    <p className="text-sm text-[#475467] leading-6 flex-1">
                      We approach every challenge with curiosity and rigor, digging beneath the surface
                    </p>
                  </div>
                  <p className="text-[12px] text-[#2B425B54] leading-6">
                    Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence
                  </p>
                  <Link
                    href="/about-us"
                    className="text-[#3D83FF] text-[12px] font-bold hover:underline"
                  >
                    LEARN MORE
                  </Link>
                </div>
              </div>
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
