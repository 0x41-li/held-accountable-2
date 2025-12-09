"use client";
import { updatePoll, votePoll } from "@/services/polls/polls";
import { formatDate, formatDateTime } from "@/utils/date";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { arrayUnion, arrayRemove, increment } from "firebase/firestore";
import ShareModal from "./ShareModal";
import Image from "next/image";

export default function Poll({ poll: initialPoll, showDetail }) {
  const [poll, setPoll] = useState(initialPoll);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  if (!poll.questions) return "";

  const handleShowSummary = () => {
    setShowSummary(!showSummary);
  };

  const isNew = useMemo(() => {
    const created_at = new Date(poll.createdAt.seconds * 1000);
    return created_at > Date.now() - 2 * 60 * 60 * 1000;
  }, [poll]);

  const like = useMemo(() => {
    return poll.like_users.includes(auth.currentUser.uid);
  }, [poll]);

  const onDetail = (id) => {
    console.log(id);
    if (!showDetail) {
      router.push(`/golden-insights/${id}`);
      return;
    }
    showDetail(id);
  }

  const getHeadline = (headline) => {
    let str = headline.split("(")[1].split(")")[0];
    headline = headline.replace("(" + str + ")", "");
    headline = headline.replace("Breaking News — ", "");
    return [
      headline,
      <span style={{ color: "#1f65ceff"}}>{"(" + str.replace("publisher verified", "").replace(",", "").trim() + ")"}</span>
    ]
  }

  const formatDateForCard = (date) => {
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
    return `${time}, ${formattedDate}`;
  };

  const categoryColors = {
    CRYPTO: "text-[#C11574]",
    POLITICS: "text-[#6941C6]",
    AI: "text-[#3538cd]",
    FINANCE: "text-[#026AA2]",
  };

  const category = poll.topic ? poll.topic.toUpperCase() : "";
  const categoryColor = categoryColors[category] || "text-[#C11574]";
  
  const firstInsight = poll.golden_insights && poll.golden_insights.length > 0 ? poll.golden_insights[0] : null;
  
  const handleLike = async () => {
    if (poll.like_users.includes(auth.currentUser.uid)) return;
    let additionalChange = {};

    if (poll.dislike_users.includes(auth.currentUser.uid)) {
        additionalChange = {
            dislikes: increment(-1),
            dislike_users: arrayRemove(auth.currentUser.uid)
        };
    }

    await updatePoll(poll.id, {
      likes: increment(1),
      like_users: arrayUnion(auth.currentUser.uid),
      ...additionalChange
    });

    additionalChange = {};
    if (poll.dislike_users.includes(auth.currentUser.uid)) {
        additionalChange = {
            dislikes: poll.dislikes - 1,
            dislike_users: poll.dislike_users.filter(uid => uid !== auth.currentUser.uid)
        };
    }

    setPoll({
        ...poll,
        likes: poll.likes + 1,
        like_users: [
            ...poll.like_users,
            auth.currentUser.uid
        ],
        ...additionalChange
    });
  }

  const postedDate = new Date(poll.createdAt.seconds * 1000);
  
  const getHeadlineText = (headline) => {
    if (!headline) return '';
    try {
      let str = headline.split("(")[1]?.split(")")[0] || '';
      let cleanHeadline = headline.replace("(" + str + ")", "");
      cleanHeadline = cleanHeadline.replace("Breaking News — ", "");
      return cleanHeadline.trim();
    } catch (e) {
      return headline.replace("Breaking News — ", "").trim();
    }
  };
  
  const headlineText = poll.questions[0].headline ? getHeadlineText(poll.questions[0].headline) : '';

  return (
    <div className="relative flex flex-row w-full rounded-[32px] border border-[#E9EAEB] p-0 hover:border-blue-300 transition-colors bg-[#F7F8FF80] shadow-[0_20px_50px_0_rgba(27,53,132,0.2)] overflow-hidden">
      {/* Learn in 2 min & Invest button positioned at top right of card */}
      {firstInsight && (
        <Link 
          href={`/golden-insights/${poll.id}`}
          onClick={(e) => {
            if (showDetail) {
              e.preventDefault();
              showDetail(poll.id);
            }
          }}
          className="hidden md:flex absolute uppercase top-0 right-0 flex items-center gap-2 text-[#1D74D6] font-bold text-sm hover:text-blue-700 transition-colors z-10"
        >
          Learn in 2 min & Invest
          <div className="w-16 h-16 bg-[rgba(247, 248, 255, 0.5)] flex items-center justify-center rounded-bl-[32px] border-gray-200/50"
            style={{
              boxShadow: "0px 20px 50px 0px rgba(27, 53, 132, 0.1)",
            }}
          >
            <Icon icon="mdi:arrow-top-right" width={20} height={20} className="text-[#2B425B66]" />
          </div>
        </Link>
      )}
      
      {/* Image on the left */}
      <div className="flex flex-shrink-0 self-stretch items-stretch relative">
        <div className="relative w-[140px] md:w-[250px] h-full">
          <Image
            src="/images/narrative_detail.png"
            alt="Narrative"
            fill
            className="rounded-[32px] object-cover p-2"
          />
          {/* Heart icon overlay on top right of image */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLike();
            }}
            className="absolute top-4 right-4 bg-[#0909091A] rounded-full p-1.5 shadow-md z-10 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Icon
              icon={like ? "icon-park-solid:like" : "icon-park-outline:like"}
              width={16}
              height={16}
              className={"text-white"}
            />
          </button>
        </div>
      </div>
      
      {/* Content on the right */}
      <div className="flex-1 flex flex-col relative p-2 md:p-6">
        <div className="flex items-center gap-2 mb-4 md:pr-32">
        <span className={`text-[11px] md:text-sm font-medium ${categoryColor}`}>
          {category}
        </span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">|</span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">
          {formatDateForCard(postedDate)}
        </span>
      </div>
      
      <h3 className="text-[16px] md:text-[18px] md:text-xl font-[500] text-[#101828] mb-2 line-clamp-2 md:pr-32">
        {headlineText}
      </h3>
      
      {firstInsight ? (
        <p className="text-[#2B425B66] text-[11px] md:text-[12px] md:text-base leading-6 mb-2 line-clamp-1 md:line-clamp-2">
          {firstInsight.content.replace(/\*/g, "").replace(/#/g, "")}
        </p>
      ) : (
        <p className="text-[#2B425B66] text-[12px] md:text-base leading-6 mb-4 line-clamp-3">
          {poll.questions[0].summary || "No content available"}
        </p>
      )}
      
      <div className="hidden items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-[#404040] font-medium text-[12px]">
          <p
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => handleLike()}
          >
            <Icon
              icon={like ? "flat-color-icons:like" : "icon-park-outline:like"}
              width={20}
              height={20}
            />
            {poll.likes || 0} Likes
          </p>
          <button 
            onClick={()=>setShowShareModal(true)} 
            className="text-[#404040] flex items-center cursor-pointer select-none gap-1"
          >
            <Icon icon="ix:share" width={20} height={20} />
            Share
          </button>
        </div>
      </div>
      
        {firstInsight && (
          <Link 
            href={`/golden-insights/${poll.id}`}
            onClick={(e) => {
              if (showDetail) {
                e.preventDefault();
                showDetail(poll.id);
              }
            }}
            className="md:hidden uppercase text-[#1D74D6] font-bold text-[11px] hover:text-blue-700"
          >
          Learn in 2 min & Invest
          </Link>
        )}
        
        <ShareModal show={showShareModal} hideDialog={() => setShowShareModal(false)} data={{ id: poll.id, title: poll.questions[0].headline }} />
      </div>
    </div>
  );
}
