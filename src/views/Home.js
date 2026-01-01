"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOME_LATEST,
  getUserById,
  getViralDetections,
} from "@/services/polls/polls";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import Tabs from "@/components/ui/Tabs";
import Poll from "@/components/Poll";
import PollDetailPage from "@/app/app/polls/[id]/page";
import { Icon } from "@iconify/react";
import { FAMOUS_COMPANIES_DATA } from "@/services/const";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import NotificationDropdown from "@/components/NotificationDropdown";
import PremiumModal from "@/components/PremiumModal";
import CrownIcon from "@/assets/icons/crown.svg";

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

const FORTUNE_LISTS = [
  { id: 20, name: "Fortune 20", color: "bg-white" },
  { id: 500, name: "Fortune 500", color: "bg-gray-600" },
  { id: 1000, name: "Fortune 1000", color: "bg-orange-500" }
];

// Fortune 20 is free, so it's the default
const DEFAULT_FORTUNE_LIST = FORTUNE_LISTS[0]; // Fortune 20

export default function Home() {
  const [viewType, setViewType] = useState(HOME_LATEST);
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [start, setStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [selectedFortuneList, setSelectedFortuneList] = useState(DEFAULT_FORTUNE_LIST);
  const [showFortuneDropdown, setShowFortuneDropdown] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [detailId, setDetailId] = useState(-1);
  const [viralData, setViralData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  const timerInterval = useRef(null);
  const fortuneDropdownRef = useRef(null);
  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);

  const { ref, inView } = useInView();

  // Load user data and check premium status
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) {
        setUser(null);
        setIsPremium(false);
        return;
      }

      try {
        const userData = await getUserById(auth.currentUser.uid);
        if (userData) {
          setUser(userData);
          // Check if user has premium subscription
          const hasPremium = userData.subscripted_at && userData.subscripted_at > Date.now();
          setIsPremium(hasPremium);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadUserData();
    });

    return () => unsubscribe();
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

  // Handle Fortune list selection
  const handleFortuneListSelect = (fortuneList) => {
    // Check if user is premium
    if (!isPremium && !auth.currentUser) {
      router.push('/auth/signin');
      return;
    }

    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    // User is premium, allow selection
    setSelectedFortuneList(fortuneList);
    setShowFortuneDropdown(false);

    // Reset polls and reload
    setStart(null);
    setHasMore(true);
    setPolls([]);
    setCurrentPage(1);
    setPageCursors({});
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fortuneDropdownRef.current && !fortuneDropdownRef.current.contains(event.target)) {
        setShowFortuneDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch polls from API with pagination
  const fetchPollsFromAPI = useCallback(async (fortuneListId = null, page = 1, limit = 10) => {
    try {
      let url = '/api/company-polls?';
      const params = new URLSearchParams();

      // TODO: Add Fortune list filtering when API supports it
      // For now, fetch all polls - filtering by Fortune list can be added later
      if (fortuneListId) {
        // params.append('fortune_list', fortuneListId.toString());
      }

      params.append('status', '1'); // Only active polls
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      url += params.toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }

      const data = await response.json();
      let polls = data.polls || [];

      // TODO: Filter by Fortune list client-side when API doesn't support it
      // For now, return all polls

      // Return polls with pagination metadata
      return {
        polls,
        pagination: data.pagination || {
          page,
          limit,
          totalCount: polls.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    } catch (error) {
      console.error('Error fetching polls from API:', error);
      return { polls: [], pagination: null };
    }
  }, []);

  // Transform API poll data to match Firebase format expected by Poll component
  const transformPollData = useCallback((apiPoll) => {
    // Parse section_ids and section_titles if they're JSON strings
    let sectionIds = [];
    let sectionTitles = [];

    try {
      if (apiPoll.section_ids) {
        sectionIds = typeof apiPoll.section_ids === 'string'
          ? JSON.parse(apiPoll.section_ids)
          : apiPoll.section_ids;
      }
      if (apiPoll.section_titles) {
        sectionTitles = typeof apiPoll.section_titles === 'string'
          ? JSON.parse(apiPoll.section_titles)
          : apiPoll.section_titles;
      }
    } catch (e) {
      console.warn('Error parsing section data:', e);
    }

    // Convert createdAt string to Firebase timestamp format
    const createdAt = apiPoll.created_at ? new Date(apiPoll.created_at) : new Date();

    return {
      id: apiPoll.id.toString(),
      title: apiPoll.title || '',
      content: apiPoll.content || '',
      category: apiPoll.category || '',
      topic: apiPoll.category || '', // Map category to topic for compatibility
      company: apiPoll.company_id || null,
      url: apiPoll.url || '',
      image_url: apiPoll.image_url || '',
      status: apiPoll.status || 0,
      vote_result: apiPoll.vote_result || 0,
      comment_count: apiPoll.comment_count || 0,
      sections_ids: sectionIds,
      sections_titles: sectionTitles,
      createdAt: {
        seconds: Math.floor(createdAt.getTime() / 1000),
        nanoseconds: (createdAt.getTime() % 1000) * 1000000
      },
      updatedAt: apiPoll.updated_at ? {
        seconds: Math.floor(new Date(apiPoll.updated_at).getTime() / 1000),
        nanoseconds: 0
      } : null,
      // Default values for fields that Poll component might expect
      // Poll component expects questions array with at least one question
      questions: apiPoll.questions || [{
        headline: apiPoll.title || '',
        summary: apiPoll.content.replace(/<[^>]*>?/g, '').replace(/\*/g, "").replace(/#/g, ""),
      }],
      like_users: apiPoll.like_users || [],
      dislike_users: apiPoll.dislike_users || [],
      likes: apiPoll.likes || 0,
      dislikes: apiPoll.dislikes || 0,
      trendScore: 0,
      user: {
        id: '',
        fullname: '',
        username: '',
        avatar: ''
      },
      golden_insights: apiPoll.golden_insights || []
    };
  }, []);

  const loadNewPolls = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await fetchPollsFromAPI(
        selectedFortuneList?.id || null,
        1,
        10
      );

      if (result.polls.length === 0) {
        return;
      }

      const transformedPolls = result.polls.map(transformPollData);

      if (transformedPolls.length > 0) {
        setPolls((prevPolls) => [
          ...transformedPolls.filter((p) => !prevPolls.some((p1) => p1.id === p.id)),
          ...prevPolls,
        ]);
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, selectedFortuneList, fetchPollsFromAPI, transformPollData]);

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
    if (loading || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      // Determine items per page based on mobile/desktop
      const itemsPerPage = (isMobile && isPageLoad) ? 5 : 10;

      // Fetch polls with pagination from API
      const result = await fetchPollsFromAPI(
        null,
        pageNum,
        itemsPerPage
      );

      const transformedPolls = result.polls.map(transformPollData);
      const pagination = result.pagination;

      if (isMobile && isPageLoad) {
        // For mobile pagination, replace polls instead of appending
        setPolls(transformedPolls);

        // Use pagination metadata from API
        if (pagination) {
          setTotalPages(pagination.totalPages > 0 ? pagination.totalPages : 1);
        } else {
          // Fallback: estimate total pages
          const calculatedTotalPages = transformedPolls.length < itemsPerPage
            ? pageNum
            : pageNum + 1;
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        }

        return;
      } else if (!isMobile && !isPageLoad) {
        // Desktop infinite scroll behavior - only when not mobile and not a page load
        if (transformedPolls.length === 0) {
          setHasMore(false);
          return;
        }
        if (transformedPolls.length > 0) {
          // For desktop, we'll track the last loaded page
          setStart(pageNum);
          setPolls((prevPolls) => {
            const newPolls = [
              ...prevPolls,
              ...transformedPolls.filter((p) => !prevPolls.some((p1) => p1.id === p.id))
            ];

            return newPolls;
          });

          // Use pagination metadata to determine if there are more pages
          if (pagination) {
            setHasMore(pagination.hasNextPage);
          } else {
            // Fallback: if we got fewer items than requested, we've reached the end
            if (transformedPolls.length < itemsPerPage) {
              setHasMore(false);
            }
          }
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [loading, selectedFortuneList, isMobile, fetchPollsFromAPI, transformPollData]);

  const onRefresh = useCallback(() => {
    setStart(null);
    setHasMore(true);
    setPolls([]);
    setCompanyPollAssignments([]);
  }, []);

  // Desktop infinite scroll
  useEffect(() => {
    if (!isMobile && !loading && inView && hasMore) {
      // Use start as page number for API pagination
      const nextPage = start ? start + 1 : 1;
      loadPolls(null, false, nextPage);
    }
  }, [inView, loading, hasMore, viewType, isMobile, start, loadPolls]);

  // Mobile pagination - load data when page changes or filters change
  useEffect(() => {
    if (isMobile && !loadingRef.current && initialLoadDone.current) {
      // Use a small delay to batch state updates and prevent multiple rapid calls
      const timeoutId = setTimeout(() => {
        if (!loadingRef.current) {
          loadPolls(null, true, currentPage);
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isMobile, selectedFortuneList]); // Include Fortune filter to refetch when it changes


  // Initial load of polls - only run once on mount
  useEffect(() => {
    if (!initialLoadDone.current && polls.length === 0 && !loading) {
      initialLoadDone.current = true;
      loadPolls(null, isMobile, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount


  useEffect(() => {
    getViralDetections().then(data => {
      setViralData(data.slice(0, 3)); // Get first 3 viral detections
    });
  }, []);


  return (
    <div className="w-full h-full">
      <div className={`${detailId == -1 ? "flex" : "hidden"} w-full h-full overflow-hidden flex flex-col shadow-sm`}>
        {/* Header */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start flex-1 justify-between gap-4">
            <div className="flex md:items-end gap-3 md:mt-4 flex-col md:flex-row flex-1">
              <div className="flex gap-[16px] items-center">
                <h1 className="text-[30px] md:text-3xl font-bold text-[#2b425b]">What&apos;s happening now?</h1>
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

            <div className="hidden md:flex items-center gap-4">
              <NotificationDropdown />
              <button
                className="gradient-button text-white font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
                onClick={() => router.push("/app/subscription")}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">
          <div className="flex flex-col flex-1">
            {/* Fortune List Filter */}
            <div className="flex flex-row gap-2 items-center justify-center md:justify-start md:gap-4 px-2 md:px-6">
              <div className="flex gap-3 relative items-center w-full md:w-auto" ref={fortuneDropdownRef}>
                <div className="flex flex-col p-[12px] bg-[#F7F8FF80] rounded-[12px]">
                  <button
                    onClick={() => setShowFortuneDropdown(!showFortuneDropdown)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2b425b] hover:bg-[#F7F8FF] rounded-[12px] transition-colors bg-[#C1D4F0A8] border border-[#E4E7EC] w-full md:w-auto justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {selectedFortuneList ? (
                        <>
                          <div className={`w-[40px] h-[40px] text-[10px] ${selectedFortuneList.color} rounded flex items-center justify-center ${selectedFortuneList.color === "bg-white" ? "text-[#2b425b]" : "text-white"} font-bold text-sm`}>
                            {selectedFortuneList.id}
                          </div>
                          <span className="hidden sm:inline">{selectedFortuneList.name}</span>
                          <span className="sm:hidden">{selectedFortuneList.name}</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:filter-linear" width={20} height={20} />
                          <span>Select Fortune List</span>
                        </>
                      )}
                    </div>
                    <Icon
                      icon={showFortuneDropdown ? "mdi:chevron-up" : "mdi:chevron-down"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {/* Fortune List Dropdown */}
                {showFortuneDropdown && (
                  <>
                    {/* Backdrop for mobile */}
                    {isMobile && (
                      <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setShowFortuneDropdown(false)}
                      />
                    )}
                    <div className={`${isMobile ? 'fixed flex items-center justify-center' : 'absolute top-full'} ${isMobile ? 'left-4 right-4' : 'left-0 bg-[#F7F8FF80]'} mt-2 backdrop-blur-md rounded-r-[32px] rounded-bl-[32px] p-4 shadow-lg z-50 w-full md:w-[450px] max-w-[calc(100vw-2rem)] md:max-w-[90vw]`}>
                      <div className="flex flex-col gap-2">
                        {FORTUNE_LISTS.map((fortuneList) => (
                          <button
                            key={fortuneList.id}
                            onClick={() => handleFortuneListSelect(fortuneList)}
                            className={`flex items-center justify-between p-3 rounded-xl transition-colors`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-[40px] h-[40px] ${fortuneList.color} rounded-[8px] text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${fortuneList.color === "bg-white" ? "text-[#2b425b]" : "text-white"}`}>
                                {fortuneList.id}
                              </div>
                              <div className="flex flex-col items-start min-w-0 flex-1">
                                <span className={`text-sm font-bold text-[#2b425b]`}>
                                  {fortuneList.name}
                                </span>
                                <span className="text-xs text-[#515151] line-clamp-1">
                                  Lorem ipsum dolor sit amet, consectetur
                                </span>
                              </div>
                            </div>
                            {selectedFortuneList?.id === fortuneList.id && (
                              <span className="text-xs font-medium text-[#3D83FF] bg-[#3D83FF]/10 px-3 py-1 rounded-full whitespace-nowrap ml-2 flex-shrink-0">
                                Following
                              </span>
                            )}
                            {selectedFortuneList?.id !== fortuneList.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFortuneListSelect(fortuneList);
                                }}
                                className="gradient-button text-xs font-medium text-white px-3 py-1 rounded-full hover:bg-[#3D83FF]/20 transition-colors whitespace-nowrap ml-2 flex-shrink-0 flex items-center gap-2"
                              >
                                <CrownIcon />
                                Follow
                              </button>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Left Column - Polls */}
            <div className={`flex-1 ${isMobile ? 'overflow-visible' : 'overflow-auto'} px-6 md:px-10 pt-[20px]`}>
              <div className="flex flex-col gap-6">
                {polls.map((poll) => (
                  <Poll poll={poll} key={poll.id} showDetail={setDetailId} />
                ))}
                {/* Infinite scroll trigger for desktop only */}
                {!isMobile && <div ref={ref} className="h-10" />}
                {/* Pagination for mobile only */}
                {isMobile && totalPages >= 1 && (
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
                    Jacinda Ardern&apos;s Glasgow Visit and the Continued Influence of Former Visit and the Continued Influence
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
        detailId != -1 && <PollDetailPage key={`detail_page_${detailId}`} data={{ id: detailId, back: () => setDetailId(-1) }} />
      }

      {/* Premium Modal */}
      <PremiumModal show={showPremiumModal} hideDialog={() => setShowPremiumModal(false)} />
    </div>
  );
}
