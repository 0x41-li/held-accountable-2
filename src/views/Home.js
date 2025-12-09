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
import Pagination from "@/components/common/Pagination";

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
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState([]);
  const [viralData, setViralData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [companyPollAssignments, setCompanyPollAssignments] = useState([]);

  const timerInterval = useRef(null);
  const companyDropdownRef = useRef(null);

  const { ref, inView } = useInView();

  // Get first 6 companies for the filter
  const filterCompanies = FAMOUS_COMPANIES_DATA.slice(0, 6);

  // Function to assign polls to companies (defined early to avoid initialization error)
  const assignPollsToCompanies = useCallback((pollsList) => {
    // Randomly assign 2-5 polls per company (only once)
    const assignments = [];
    const filterCompanies = FAMOUS_COMPANIES_DATA.slice(0, 6);
    let pollIndex = 0;
    
    filterCompanies.forEach((company) => {
      // Random number between 2 and 5
      const pollsCount = Math.floor(Math.random() * 4) + 2; // 2-5 polls
      const companyPolls = pollsList.slice(pollIndex, pollIndex + pollsCount);
      
      if (companyPolls.length > 0) {
        assignments.push({
          company,
          polls: companyPolls,
          startIndex: pollIndex,
          endIndex: pollIndex + companyPolls.length
        });
        pollIndex += companyPolls.length;
      }
    });
    
    setCompanyPollAssignments(assignments);
  }, []);

  // Mobile detection
  useEffect(() => {
    let wasMobile = window.innerWidth < 768;
    setIsMobile(wasMobile);
    
    const checkMobile = () => {
      const nowMobile = window.innerWidth < 768;
      
      // Reset state when switching between mobile and desktop
      if (wasMobile !== nowMobile) {
        setPolls([]);
        setStart(null);
        setHasMore(true);
        setCurrentPage(1);
        setPageCursors({});
        setTotalPages(1);
        wasMobile = nowMobile;
      }
      setIsMobile(nowMobile);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (showCompanyModal) {
      setTempSelectedCompanies([...selectedCompanies]);
    }
  }, [showCompanyModal]);

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

  const loadPolls = useCallback(async (from = null, isPageLoad = false, pageNum = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      let poll_list = [],
        lastDoc,
        totalCount;

      // Determine items per page based on mobile/desktop
      const itemsPerPage = (isMobile && isPageLoad) ? 5 : 10;
      const cursor = isMobile && isPageLoad ? from : (from || start);

      if (currentTopic === "All") {
        const { result, lastDoc: last, totalCount: count } = await getHomePolls(viewType, cursor, itemsPerPage);
        poll_list = result;
        lastDoc = last;
        totalCount = count;
      } else {
        const { result, lastDoc: last, totalCount: count } = await getPollsByTopic(
          currentTopic,
          cursor,
          itemsPerPage
        );
        poll_list = result;
        lastDoc = last;
        totalCount = count;
      }

      if (isMobile && isPageLoad) {
        // For mobile pagination, replace polls instead of appending
        setPolls(poll_list);
        // Store cursor for next page
        if (lastDoc) {
          setPageCursors(prev => ({ ...prev, [pageNum + 1]: lastDoc }));
        }
        // Calculate total pages from total count
        const calculatedTotalPages = Math.ceil(totalCount / 5);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        // Assign polls to companies only on first page load and only if not already assigned
        if (pageNum === 1 && companyPollAssignments.length === 0) {
          assignPollsToCompanies(poll_list);
        }
        
        // Don't update start cursor on mobile to prevent desktop scroll from interfering
        return;
      } else if (!isMobile && !isPageLoad) {
        // Desktop infinite scroll behavior - only when not mobile and not a page load
        if (poll_list.length === 0) {
          setHasMore(false);
          return;
        }
        if (poll_list.length > 0) {
          setStart(lastDoc);
          setPolls((prevPolls) => {
            const newPolls = [
              ...prevPolls,
              ...poll_list.filter((p) => !prevPolls.some((p1) => p1.id === p.id))
            ];
            
            // Assign polls to companies only on first load (when prevPolls is empty)
            if (prevPolls.length === 0 && companyPollAssignments.length === 0) {
              assignPollsToCompanies(newPolls);
            }
            
            return newPolls;
          });
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentTopic, viewType, start, isMobile, assignPollsToCompanies, companyPollAssignments.length]);

  const onRefresh = useCallback(() => {
    setStart(null);
    setHasMore(true);
    setPolls([]);
    setCompanyPollAssignments([]);
  }, []);

  // Desktop infinite scroll
  useEffect(() => {
    if (!isMobile && !loading && inView && hasMore) {
      loadPolls(start, false, 1);
    }
  }, [inView, loading, hasMore, currentTopic, viewType, isMobile, start, loadPolls]);

  // Mobile pagination - load data when page changes
  useEffect(() => {
    if (isMobile) {
      const cursor = currentPage === 1 ? null : pageCursors[currentPage];
      if (currentPage === 1 || cursor !== undefined) {
        loadPolls(cursor, true, currentPage);
      }
    }
  }, [currentPage, currentTopic, viewType, isMobile, loadPolls]);

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
            <div className="flex md:items-end gap-3 md:mt-4 flex-col md:flex-row flex-1">
              <div className="flex gap-[16px] items-center">
                <h1 className="text-[30px] md:text-3xl font-bold text-[#2b425b]">What's happening now?</h1>
              </div>
              <p className="text-[#475467] text-sm md:text-base text-left md:text-right">
                Live updates{" "}
                <span className="text-[#2B425B] font-bold">
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
            <div className="flex flex-row gap-2 items-center justify-center md:justify-between md:gap-4 px-2 md:px-6">
              {/* Company Filter */}
              <div className="flex gap-3 relative items-center justify-center" ref={companyDropdownRef}>
                <button
                  onClick={() => {
                    if (isMobile) {
                      setShowCompanyModal(true);
                    } else {
                      setShowCompanyDropdown(!showCompanyDropdown);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2b425b] hover:bg-[#F7F8FF] rounded-lg transition-colors"
                >
                  <Icon icon="solar:filter-linear" width={20} height={20} />
                  <span className="hidden md:inline">MANAGE</span>
                </button>
                
                {selectedCompanies.length > 0 && (
                  <div className="hidden md:flex items-center gap-2 flex-wrap">
                    {selectedCompanies.map((companyId) => {
                      const company = FAMOUS_COMPANIES_DATA.find(c => c.id === companyId);
                      if (!company) return null;
                      return (
                        <div key={companyId} className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F8FF] rounded-full border border-[#E4E7EC]">
                          <span className="text-sm font-medium text-[#2b425b]">
                            {company.name.toUpperCase()}
                          </span>
                          <button
                            onClick={() => setSelectedCompanies(selectedCompanies.filter(id => id !== companyId))}
                            className="text-[#98A2B3] hover:text-[#2b425b]"
                          >
                            <Icon icon="mdi:close" width={16} height={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Company Dropdown (Desktop) */}
                {showCompanyDropdown && !isMobile && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl p-6 shadow-lg border border-[#E4E7EC] z-50 w-[400px] max-w-[90vw]">
                    <div className="grid grid-cols-3 gap-4">
                      {filterCompanies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => {
                            if (selectedCompanies.includes(company.id)) {
                              setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
                            } else {
                              setSelectedCompanies([...selectedCompanies, company.id]);
                            }
                          }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                            selectedCompanies.includes(company.id)
                              ? "bg-[#F7F8FF] border-2 border-[#3D83FF]"
                              : "bg-[#F9FAFB] border border-transparent hover:bg-[#F7F8FF]"
                          }`}
                        >
                          <Icon 
                            icon={company.logo} 
                            className={`${selectedCompanies.includes(company.id) ? "text-[#3D83FF]" : ""}`}
                            width={48} 
                            height={48} 
                          />
                          <span className={`text-xs font-medium ${
                            selectedCompanies.includes(company.id) ? "text-[#3D83FF]" : "text-[#2b425b]"
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
                      setCurrentPage(1);
                      setPageCursors({});
                      setCompanyPollAssignments([]);
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
            <div className={`flex-1 ${isMobile ? 'overflow-visible' : 'overflow-auto'} px-6 md:px-10 pt-[20px]`}>
              <div className="flex flex-col gap-6">
                {/* Group polls by company - Test View */}
                {/* Only show company groupings on first page of mobile, or always on desktop */}
                {companyPollAssignments.length > 0 && (!isMobile || currentPage === 1) ? (
                  <>
                    {companyPollAssignments.map(({ company, polls: companyPolls }) => {
                      // On mobile page 1, use assigned polls directly
                      // On desktop or mobile page 1, check if polls exist in current polls array
                      const validPolls = isMobile && currentPage === 1 
                        ? companyPolls 
                        : companyPolls.filter(poll => polls.some(p => p.id === poll.id));
                      
                      if (validPolls.length === 0) return null;
                      
                      return (
                        <div key={company.id} className="flex flex-col gap-4">
                          {/* Company Title */}
                          <div className="flex items-center gap-3 pb-2">
                            <Icon icon={company.logo} width={32} height={32} className="text-[#2B425B]" />
                            <h2 className="text-2xl font-bold text-[#2B425B]">{company.name}</h2>
                          </div>
                          {/* Company Polls */}
                          <div className="flex flex-col gap-6">
                            {validPolls.map((poll) => (
                              <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {/* Remaining polls (if any) - polls beyond assigned ones */}
                    {(() => {
                      if (isMobile && currentPage === 1) {
                        const totalAssigned = companyPollAssignments.reduce((sum, assignment) => sum + assignment.polls.length, 0);
                        const remainingPolls = polls.slice(totalAssigned);
                        return remainingPolls.length > 0 ? (
                          <div className="flex flex-col gap-6">
                            {remainingPolls.map((poll) => (
                              <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                            ))}
                          </div>
                        ) : null;
                      } else if (!isMobile) {
                        // On desktop, show remaining polls that aren't in any company assignment
                        const assignedPollIds = new Set(
                          companyPollAssignments.flatMap(assignment => assignment.polls.map(p => p.id))
                        );
                        const remainingPolls = polls.filter(poll => !assignedPollIds.has(poll.id));
                        return remainingPolls.length > 0 ? (
                          <div className="flex flex-col gap-6">
                            {remainingPolls.map((poll) => (
                              <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                            ))}
                          </div>
                        ) : null;
                      }
                      return null;
                    })()}
                  </>
                ) : (
                  // Fallback: show polls normally if assignments not ready or on mobile page > 1
                  polls.map((poll) => (
                    <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                  ))
                )}
                {/* Infinite scroll trigger for desktop only */}
                {!isMobile && <div ref={ref} className="h-10" />}
                {/* Pagination for mobile only */}
                {isMobile && totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    page={currentPage}
                    setPage={setCurrentPage}
                    className="mt-6"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="flex xl:w-[400px] flex-col">
            <div className="flex flex-col gap-8 p-6 overflow-auto">
              {/* Viral Detection Section */}
              <div className="flex flex-col gap-[27px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[24px] font-[700] text-[#2B425B]">Viral Detection</h3>
                    <img src="/images/hot_badge.png" alt="Hot" width={50} height={30} />
                  </div>
                  <Link href="/app/viral-detection" className="text-[12px] text-[#3d83ff] font-[700] hover:text-blue-600">
                    ALL
                  </Link>
                </div>
                <div className="flex flex-col gap-[34px] bg-[#F7F8FF80] rounded-[32px] p-[24px] shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
                  {viralData.length > 0 ? (
                    viralData.map((item) => (
                      <div key={item.id} className="flex flex-col gap-1.5 p-3 transition-colors">
                        <h4 className="text-[16px] leading-[24px] font-[500] text-[#2B425B] line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] leading-[20px] line-clamp-1 text-[#98A2B3]">
                          {item.content?.replace(/\*/g, "").replace(/#/g, "")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] leading-[20px] text-[#98A2B3] text-center py-4">No viral detections yet</p>
                  )}
                </div>
              </div>

              {/* Company Section */}
              <div className="flex flex-col gap-[33px] w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-[24px] font-[700] text-[#2B425B]">Company</h3>
                  <img src="/images/hot_badge.png" alt="Hot" width={50} height={30} />
                </div>
                <div className="flex flex-col gap-[18px] rounded-lg">
                  <div className="flex gap-[16px] w-full items-start">
                    <img src="/images/viralPage/companybg.png" />
                    <p className="text-[16px] text-[#2b425b] font-[500] leading-6 flex-1">
                      We approach every challenge with curiosity and rigor, digging beneath the surface
                    </p>
                  </div>
                  <p className="text-[11px] text-[#2B425B54] leading-6">
                    Jacinda Ardern's Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence
                  </p>
                  <Link
                    href="/about-us"
                    className="text-[#3d83ff] text-[12px] font-[700] hover:underline"
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

      {/* Company Selection Modal (Mobile) */}
      {showCompanyModal && isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#2B425B] bg-opacity-30 backdrop-blur-sm"
            onClick={() => setShowCompanyModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
              <h2 className="text-xl font-bold text-[#101828]">Manage</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTempSelectedCompanies([])}
                  className="text-sm font-medium text-[#3D83FF] hover:text-[#2B5FCC]"
                >
                  CLEAR ALL
                </button>
                <button
                  onClick={() => setShowCompanyModal(false)}
                  className="text-[#98A2B3] hover:text-[#2b425b]"
                >
                  <Icon icon="mdi:close" width={24} height={24} />
                </button>
              </div>
            </div>

            {/* Selected Tags */}
            {tempSelectedCompanies.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 border-b border-[#E4E7EC]">
                {tempSelectedCompanies.map((companyId) => {
                  const company = FAMOUS_COMPANIES_DATA.find(c => c.id === companyId);
                  if (!company) return null;
                  return (
                    <div key={companyId} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] rounded-lg border border-[#E4E7EC]">
                      <span className="text-sm font-medium text-[#2b425b]">
                        {company.name.toUpperCase()}
                      </span>
                      <button
                        onClick={() => setTempSelectedCompanies(tempSelectedCompanies.filter(id => id !== companyId))}
                        className="text-[#98A2B3] hover:text-[#2b425b]"
                      >
                        <Icon icon="mdi:close" width={16} height={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Company Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {filterCompanies.map((company) => {
                  const isSelected = tempSelectedCompanies.includes(company.id);
                  return (
                    <button
                      key={company.id}
                      onClick={() => {
                        if (isSelected) {
                          setTempSelectedCompanies(tempSelectedCompanies.filter(id => id !== company.id));
                        } else {
                          setTempSelectedCompanies([...tempSelectedCompanies, company.id]);
                        }
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                        isSelected
                          ? "bg-white border-2 border-[#2B425B] shadow-sm"
                          : "bg-[#F9FAFB] border border-dashed border-[#E4E7EC]"
                      }`}
                    >
                      <Icon 
                        icon={company.logo} 
                        className={isSelected ? "text-[#2B425B]" : "text-gray-400"}
                        width={48} 
                        height={48} 
                      />
                      <span className={`text-sm font-medium ${
                        isSelected ? "text-[#2B425B]" : "text-[#98A2B3]"
                      }`}>
                        {company.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#E4E7EC]">
              <button
                onClick={() => {
                  setSelectedCompanies([...tempSelectedCompanies]);
                  setShowCompanyModal(false);
                }}
                className="gradient-button w-full rounded-full text-white font-bold py-3 transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
