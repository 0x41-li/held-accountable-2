"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef, useMemo } from "react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getViralDetections } from "@/services/polls/polls";
import PollComments from "./PollComments";
import BearishIcon from "@/assets/icons/bearish.svg";
import BullishIcon from "@/assets/icons/bullish.svg";

export default function PollDetail({
  poll,
  back
}) {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState(null); // null = not voted, 0 = bullish, 1 = bearish
  const [selectedVote, setSelectedVote] = useState(null); // Selected vote option before submitting (null, 0 = bullish, 1 = bearish)
  const [voteCount, setVoteCount] = useState({ bullish: 0, bearish: 0, total: 0 });
  const [userVote, setUserVote] = useState(null);
  const [userVotePoints, setUserVotePoints] = useState(0); // Points earned by user for this vote
  const [viralData, setViralData] = useState([]);
  const [relatedPolls, setRelatedPolls] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const viewedSectionsRef = useRef(new Set());
  const observerRef = useRef(null);
  const contentRef = useRef(null);
  const timeoutIdsRef = useRef([]);

  if (!poll) {
    return <></>;
  }

  // Parse section_ids and section_titles if they're JSON strings - use useMemo to ensure it's reactive
  const sectionIds = useMemo(() => {
    try {
      if (poll.section_ids) {
        return typeof poll.section_ids === 'string'
          ? JSON.parse(poll.section_ids)
          : poll.section_ids;
      }
    } catch (e) {
      console.warn('Error parsing section_ids:', e);
    }
    return [];
  }, [poll.section_ids]);

  const sectionTitles = useMemo(() => {
    try {
      if (poll.section_titles) {
        return typeof poll.section_titles === 'string'
          ? JSON.parse(poll.section_titles)
          : poll.section_titles;
      }
    } catch (e) {
      console.warn('Error parsing section_titles:', e);
    }
    return [];
  }, [poll.section_titles]);

  // Convert createdAt to Date
  const createdAt = poll.created_at ? new Date(poll.created_at) : new Date();
  const formattedTime = createdAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const url = typeof window !== 'undefined' ? `${window.location.origin}/app/polls/${poll.id}` : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(poll.title || '');

  // Track viewed sections using scroll-based approach
  useEffect(() => {
    if (!auth.currentUser || sectionIds.length === 0) return;

    // Reset viewed sections when poll changes
    viewedSectionsRef.current.clear();

    const markSectionAsViewed = async (sectionId) => {
      if (viewedSectionsRef.current.has(sectionId)) return;

      viewedSectionsRef.current.add(sectionId);

      try {
        const response = await fetch(`/api/polls/${poll.id}/mark-section-viewed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: auth.currentUser.uid,
            section_id: sectionId
          })
        });
        if (response.ok) {
          console.log(`Section ${sectionId} marked as viewed`);
        }
      } catch (error) {
        console.error('Error marking section as viewed:', error);
      }
    };

    // Function to check which sections are in view or have been scrolled past
    const checkSectionsInView = () => {
      const container = contentRef.current;
      if (!container) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const triggerPoint = scrollTop + viewportHeight * 0.3; // 30% from top

      sectionIds.forEach((sectionId) => {
        // Try multiple ways to find the element
        let element = document.getElementById(sectionId);
        if (!element && container) {
          element = container.querySelector(`#${sectionId}`);
        }
        // Try partial match
        if (!element && container) {
          const allElementsWithId = container.querySelectorAll('[id]');
          element = Array.from(allElementsWithId).find(
            el => el.id === sectionId || el.id.includes(sectionId) || sectionId.includes(el.id)
          );
        }

        if (element) {
          const elementTop = element.getBoundingClientRect().top + scrollTop;

          // Mark as viewed if the element has been scrolled past the trigger point
          if (elementTop <= triggerPoint && !viewedSectionsRef.current.has(sectionId)) {
            markSectionAsViewed(sectionId);
          }
        }
      });
    };

    // Initial check after content loads
    const initialTimeout = setTimeout(() => {
      checkSectionsInView();
    }, 1000);

    // Throttled scroll handler
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkSectionsInView, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also check periodically in case user is reading without scrolling
    const intervalId = setInterval(checkSectionsInView, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(scrollTimeout);
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [poll.id, poll.content, sectionIds, auth.currentUser]);

  // Load votes for this poll
  useEffect(() => {
    const loadVotes = async () => {
      try {
        const response = await fetch(`/api/company-polls/${poll.id}/votes`);
        if (response.ok) {
          const data = await response.json();
          const votes = data.votes || [];

          // Count votes (assuming vote: 0 = bullish, 1 = bearish)
          const bullish = votes.filter(v => v.vote === 0 || v.vote === null).length;
          const bearish = votes.filter(v => v.vote === 1).length;

          setVoteCount({
            bullish,
            bearish,
            total: votes.length
          });

          // Check if current user has voted
          if (auth.currentUser) {
            const userVoteData = votes.find(v => v.user_id === auth.currentUser.uid);
            if (userVoteData) {
              setUserVote(userVoteData.vote);
              setVoted(userVoteData.vote === 0 ? 0 : 1);
              setUserVotePoints(userVoteData.points || 0);
            }
          }
        }
      } catch (error) {
        console.error('Error loading votes:', error);
      }
    };

    if (poll.id) {
      loadVotes();
    }
  }, [poll.id, poll.vote_result]); // Reload when vote_result changes

  // Load viral detections
  useEffect(() => {
    getViralDetections().then(data => {
      setViralData(data.slice(0, 3));
    });
  }, []);

  // Load related polls
  useEffect(() => {
    const loadRelatedPolls = async () => {
      try {
        const response = await fetch(`/api/company-polls?category=${poll.category || ''}&limit=3&status=1`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current poll
          const related = (data.polls || []).filter(p => p.id.toString() !== poll.id.toString()).slice(0, 3);
          setRelatedPolls(related);
        }
      } catch (error) {
        console.error('Error loading related polls:', error);
      }
    };

    if (poll.category) {
      loadRelatedPolls();
    }
  }, [poll.category, poll.id]);

  // Check if user liked
  useEffect(() => {
    if (auth.currentUser && poll.like_users) {
      setLiked(poll.like_users.includes(auth.currentUser.uid));
    }
  }, [poll.like_users]);

  const handleSelectVote = (voteType) => {
    if (voted !== null) return; // Already voted, can't change
    setSelectedVote(voteType);
  };

  const handleVote = async () => {
    if (!auth.currentUser) {
      router.push('/auth/signin');
      return;
    }

    if (selectedVote === null) {
      return; // No option selected
    }

    try {
      const response = await fetch(`/api/company-polls/${poll.id}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: auth.currentUser.uid,
          vote: selectedVote, // 0 = bullish, 1 = bearish
          points: 0
        })
      });

      if (response.ok) {
        setVoted(selectedVote);
        setUserVote(selectedVote);
        setSelectedVote(null); // Clear selection after voting
        setVoteCount(prev => ({
          ...prev,
          bullish: selectedVote === 0 ? prev.bullish + 1 : prev.bullish,
          bearish: selectedVote === 1 ? prev.bearish + 1 : prev.bearish,
          total: prev.total + 1
        }));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleLike = async () => {
    if (!auth.currentUser) {
      router.push('/auth/signin');
      return;
    }

    // TODO: Implement like functionality via API
    setLiked(!liked);
  };

  // Calculate time remaining (24 hours from creation)
  const hoursRemaining = Math.max(0, Math.floor((24 * 60 * 60 * 1000 - (Date.now() - createdAt.getTime())) / (60 * 60 * 1000)));
  const isVotingExpired = hoursRemaining === 0;
  const votingFinished = isVotingExpired || (poll.vote_result !== null && poll.vote_result !== undefined && poll.vote_result !== -1);
  const voteResult = poll.vote_result !== null && poll.vote_result !== undefined && poll.vote_result !== -1 ? poll.vote_result : null;

  // Calculate percentages
  const totalVotes = voteCount.total || 1; // Avoid division by zero
  const bullishPercentage = totalVotes > 0 ? Math.round((voteCount.bullish / totalVotes) * 100) : 0;
  const bearishPercentage = totalVotes > 0 ? Math.round((voteCount.bearish / totalVotes) * 100) : 0;

  // Check if user voted correctly
  const userVotedCorrectly = votingFinished && voteResult !== null && voted !== null && voted === voteResult;

  const categoryColors = {
    CRYPTO: "text-[#C11574]",
    POLITICS: "text-[#6941C6]",
    AI: "text-[#3538cd]",
    FINANCE: "text-[#026AA2]",
  };

  const category = poll.category ? poll.category.toUpperCase() : '';
  const categoryColor = categoryColors[category] || "text-[#C11574]";

  console.log(userVotedCorrectly, userVotePoints, voteResult, voted);

  return (
    <div className='w-full h-full overflow-hidden pt-[32px] flex flex-col'>
      {/* Header with Title and Actions */}
      <div className='w-full px-6 md:px-10 py-6'>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#101828] leading-tight">
              {poll.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`text-sm font-medium ${categoryColor}`}>
                {category}
              </span>
              <span className="text-sm text-[#98A2B3]">|</span>
              <span className="text-sm text-[#98A2B3] whitespace-nowrap">
                {formattedTime}, {formattedDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link
              href="/app/subscription"
              className="gradient-button text-white font-bold px-4 md:px-6 py-2 rounded-full text-xs md:text-sm whitespace-nowrap"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex flex-col 2xl:flex-row gap-6 px-6 md:px-10 py-6 overflow-auto">

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          {/* Poll Image */}
          {poll.image_url && (
            <div className="w-full mb-8">
              <img
                src={poll.image_url}
                alt={poll.title}
                className="w-full md:h-[300px] rounded-[32px] object-cover shadow-sm overflow-hidden"
              />
            </div>
          )}
          <div className="flex gap-[140px]">
            {/* Left Sidebar - Section Navigation */}
            {sectionIds.length > 0 && sectionTitles.length > 0 && (
              <div className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-6">
                  <nav className="flex flex-col gap-3">
                    {sectionIds.map((sectionId, index) => (
                      <a
                        key={sectionId}
                        href={`#${sectionId}`}
                        className="text-[14px] leading-[22px] text-[#2B425B66] hover:text-[#2B425B] transition-colors py-1.5 pl-3"
                      >
                        {sectionTitles[index] || sectionId}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}
            {/* Article Content */}
            <div
              ref={contentRef}
              className="poll-detail-content text-base font-normal text-[#535862] leading-[28px] prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: poll.content ? poll.content : '<p>No content available</p>'
              }}
            ></div>

          </div>
          {/* Comments Section */}
          <PollComments pollId={poll.id} />
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[400px] flex-shrink-0">
          <div className="sticky flex flex-col gap-8 p-2 md:p-6">
            {/* Voting Section */}
            <div className="rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[24px] font-bold text-[#2B425B]">Voting</h3>
                <span className="text-[11px] font-medium text-[#2B425B66]">{voteCount.total} VOTES</span>
              </div>
              <p className="text-[11px] text-[#2B425B66] mb-4">Votes are final. Please read the article first. Your vote affects your accuracy rate.</p>

              {votingFinished ? (
                // Finished voting - show progress bars
                <div className="flex flex-col gap-3 mb-4">
                  {/* Bullish Option */}
                  <div className={`relative rounded-xl overflow-hidden border-2`}>
                    <div className="relative w-full bg-white/50 rounded-lg overflow-hidden h-[60px]">
                      <div
                        className={`absolute left-0 top-0 h-full ${voteResult === 0 ? "bg-correct-vote" : "bg-gray-300"} rounded-lg transition-all duration-500`}
                        style={{ width: `${bullishPercentage}%` }}
                      >
                        {voteResult === 0 && bullishPercentage > 0 && (
                          <div className="absolute right-[60px] top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Icon icon="mdi:sparkles" width={16} height={16} className="text-white" />
                            <Icon icon="mdi:trophy" width={16} height={16} className="text-yellow-300" />
                          </div>
                        )}
                      </div>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#2B425B]">
                        {bullishPercentage}%
                      </span>
                      <div className="absolute left-4 flex items-center gap-3 top-0 bottom-0">
                        <BullishIcon />
                        <span className={`font-medium text-[#2B425B]`}>
                          Bullish
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bearish Option */}
                  <div className={`relative rounded-xl overflow-hidden border-2`}>
                    <div className="relative w-full bg-white/50 rounded-lg overflow-hidden h-[60px]">
                      <div
                        className={`absolute left-0 top-0 h-full ${voteResult === 1 ? "bg-correct-vote" : "bg-gray-300"} rounded-lg transition-all duration-500`}
                        style={{ width: `${bearishPercentage}%` }}
                      >
                        {voteResult === 1 && bearishPercentage > 0 && (
                          <div className="absolute right-[60px] top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Icon icon="mdi:sparkles" width={16} height={16} className="text-white" />
                            <Icon icon="mdi:trophy" width={16} height={16} className="text-yellow-300" />
                          </div>
                        )}
                      </div>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#2B425B]">
                        {bearishPercentage}%
                      </span>
                      <div className="absolute left-4 flex items-center gap-3 top-0 bottom-0">
                        <BearishIcon />
                        <span className={`font-medium text-[#2B425B]`}>
                          Bearish
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Congratulations Message */}
                  {userVotedCorrectly && userVotePoints > 0 && (
                    <div className="flex items-center gap-3 mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon icon="mdi:check" width={16} height={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-700 flex-1">
                        Congratulations! Your vote was correct.
                      </span>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                        +{userVotePoints}pts
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Active voting - show buttons
                <div className="flex flex-col gap-3 mb-4">
                  <button
                    onClick={() => handleSelectVote(0)}
                    disabled={voted !== null}
                    className={`flex items-center gap-3 p-4 transition-all rounded-[24px] ${selectedVote === 0 || voted === 0
                      ? "card-item"
                      : voted === null
                        ? "border-[#2B425B66] border border-dashed hover:border-white card-item-hover cursor-pointer"
                        : "bg-white border-[#2B425B66] opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <BullishIcon />
                    <span className="font-medium text-[#2B425B]">Bullish</span>
                  </button>
                  <button
                    onClick={() => handleSelectVote(1)}
                    disabled={voted !== null}
                    className={`flex items-center gap-3 p-4 transition-all rounded-[24px] ${selectedVote === 1 || voted === 1
                      ? "card-item"
                      : voted === null
                        ? "border-[#2B425B66] border border-dashed hover:border-white card-item-hover cursor-pointer"
                        : "bg-white border-[#2B425B66] opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <BearishIcon />
                    <span className="font-medium text-[#2B425B]">Bearish</span>
                  </button>
                </div>
              )}
              {!votingFinished && hoursRemaining > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#667085]">
                    {hoursRemaining} Hours left to vote
                  </span>
                  {voted === null ? (
                    <button
                      onClick={handleVote}
                      disabled={selectedVote === null}
                      className="gradient-button text-white text-[13px] font-bold px-[36px] py-[16px] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Vote
                    </button>
                  ) : (<span className="text-sm font-medium text-[#6941C6]">
                    Voted {voted === 0 ? 'Bullish' : 'Bearish'}
                  </span>)}
                </div>
              )}
              {votingFinished && (
                <div className="text-center">
                  <span className="text-sm text-[#667085]">
                    Voting has ended
                  </span>
                </div>
              )}
            </div>

            {/* Viral Detection Section */}
            <div className="flex flex-col gap-[27px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[27px]">
                  <h3 className="text-[24px] font-[700] text-[#2B425B]">Viral Detection</h3>
                  <img src="/images/hot_badge.png" alt="Hot" width={50} height={30} />
                </div>
                <Link href="/app/viral-detection" className="text-[12px] text-[#3d83ff] font-[700] hover:text-blue-600">
                  ALL
                </Link>
              </div>
              <div className="flex flex-col gap-[34px] bg-[#F7F8FF80] rounded-[32px] p-4 md:p-6 shadow-[0_20px_50px_0_rgba(27,53,132,0.2)]">
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
                  <p className="text-[11px] text-[#98A2B3] text-center py-4">No viral detections yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      {back && (
        <div className="flex justify-center pb-[30px] pt-6 border-t border-[#E4E7EC]">
          <button
            onClick={() => back()}
            className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]"
          >
            <Icon icon='lets-icons:back' />Back
          </button>
        </div>
      )}
    </div>
  );
}
