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
    <div className="relative flex flex-col w-full rounded-[32px] border border-[#E9EAEB] p-6 hover:border-blue-300 transition-colors bg-[#F7F8FF80] shadow-[0_20px_50px_0_rgba(27,53,132,0.2)] overflow-hidden">
      {/* READ MORE button positioned at top right */}
      {firstInsight && (
        <Link 
          href={`/golden-insights/${poll.id}`}
          onClick={(e) => {
            if (showDetail) {
              e.preventDefault();
              showDetail(poll.id);
            }
          }}
          className="hidden md:flex absolute top-0 right-0 flex items-center gap-2 text-[#1D74D6] font-bold text-sm hover:text-blue-700 transition-colors z-10"
        >
          READ MORE
          <div className="w-16 h-16 bg-[rgba(247, 248, 255, 0.5)] flex items-center justify-center rounded-bl-[32px] border-gray-200/50"
            style={{
              boxShadow: "0px 20px 50px 0px rgba(27, 53, 132, 0.1)",
            }}
          >
            <Icon icon="mdi:arrow-top-right" width={20} height={20} className="text-[#2B425B66]" />
          </div>
        </Link>
      )}
      
      <div className="flex items-center gap-2 mb-4 pr-32">
        <span className={`text-[11px] md:text-sm font-medium ${categoryColor}`}>
          {category}
        </span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">|</span>
        <span className="text-[11px] md:text-sm text-[#98A2B3]">
          {formatDateForCard(postedDate)}
        </span>
        {isNew && (
          <span className="text-green-500 ml-2">
            <Icon icon="mdi:new-box" width={16} height={16} />
          </span>
        )}
      </div>
      
      <h3 className="text-[18px] md:text-xl font-[500] text-[#101828] mb-4 line-clamp-2 pr-32">
        {headlineText}
      </h3>
      
      {firstInsight ? (
        <p className="text-[#475467] text-[12px] md:text-base leading-6 mb-4 line-clamp-3">
          {firstInsight.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 200)}
          {firstInsight.content.replace(/\*/g, "").replace(/#/g, "").length > 200 ? "..." : ""}
        </p>
      ) : (
        <p className="text-[#475467] text-[12px] md:text-base leading-6 mb-4 line-clamp-3">
          {poll.questions[0].summary || "No content available"}
        </p>
      )}
      
      <div className="flex items-center justify-between mb-4">
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
          className="md:hidden text-[#1D74D6] font-bold text-sm hover:text-blue-700"
        >
          READ MORE
        </Link>
      )}
      
      <ShareModal show={showShareModal} hideDialog={() => setShowShareModal(false)} data={{ id: poll.id, title: poll.questions[0].headline }} />
    </div>
  );
}
