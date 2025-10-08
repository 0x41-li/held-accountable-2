"use client";
import { updatePoll, votePoll } from "@/services/polls/polls";
import { formatDate, formatDateTime } from "@/utils/date";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { arrayUnion, increment } from "firebase/firestore";
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
    return [
      headline,
      <span style={{ color: "#1f65ceff"}}>{"(" + str.replace("publisher verified", "").replace(",", "").trim() + ")"}</span>
    ]
  }
  
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

  return (
    <div className="rounded-[12px] border border-secondary shadow-xs flex flex-col p-[16px] gap-[11px] md:gap-[20px] md:px-[24px] md:py-[17px] w-full bg-white">
      <div className="flex w-full gap-[8px] items-center w-full">
        <div className="flex flex-1 gap-[10px] items-center">
          <div className="rounded-full overflow-hidden">
            <img src="/images/logo.png" width={44} />
          </div>
          <span className="text-[14px] text-[#949494]">
            {formatDate(new Date(poll.createdAt.seconds * 1000))}
          </span>
          <div>
            <p className="leading-[20px] text-[14px] font-medium">
              {poll.user ? poll.user.fullname : ""}
            </p>
            <p className="leading-[16px] text-[12px]">
              {poll.user
                ? poll.user.username == ""
                  ? ""
                  : "@" + poll.user.username
                : ""}
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-[8px]">
          <Link
            href="/blog"
            className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white"
          >
            <Icon icon="mingcute:document-fill" />
            <span className="text-xs leading-xs font-medium">
              &nbsp;{poll.topic}
            </span>
          </Link>
        </div>
        {isNew && (
          <span className="text-3xl text-green-500">
            <Icon icon="mdi:new-box" />
          </span>
        )}
        <img src="/images/fire_icon.png" alt="Top" width={24} height={24} />
      </div>
      <div className="flex md:hidden gap-[8px]">
        <Link
          href="/blog"
          className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white"
        >
          <Icon icon="mingcute:document-fill" />
          <span className="text-xs leading-xs font-medium">
            &nbsp;{poll.topic}
          </span>
        </Link>
      </div>
      <div className="text-[16px] leading-[28px] font-medium pl-[15px]">
        {poll.questions[0].headline && (
          <p className="font-bold">
            {getHeadline(poll.questions[0].headline)}
          </p>
        )}
        {poll.questions[0].summary ? (
          <button
            className="text-blue flex gap-[2px] items-center"
            onClick={handleShowSummary}
          >
            Elaborate <Icon icon="lsicon:down-outline" />
          </button>
        ) : (
          ""
        )}
        {poll.questions[0].summary && showSummary ? (
          <div className="px-[30px]">
            <div className="rounded-[7px] border-l-[2px] border-[#3B88E3] bg-[#3B88E326] text-blue p-[14px]">
              {poll.questions[0].summary}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {poll.golden_insights ? (
        <div className="flex w-full flex-col pt-[12px]">
          <div className="hidden gap-[10px] items-center pb-[10px]">
            <Icon icon="mynaui:chat-messages" />
            <span>The Big Picture</span>
          </div>
          <div className="w-full overflow-auto">
            <div className="flex w-max gap-[10px]">
              {poll.golden_insights.map((insight, i) => (
                <button
                  onClick={() => onDetail(poll.id)}
                  key={insight.id + "_poll_link"}
                >
                  <div
                    key={i + "_golden_insights"}
                    className="group gap-[10px] border border-[#E6E6E6] rounded-[16px] overflow-hidden w-fit flex cursor-pointer"
                  >
                    <div className="w-[140px] relative">
                      <img
                        src="/images/narrative_detail.png"
                        className="w-[140px] h-[140px]"
                      />
                      <div className="bg-[#00000000] absolute top-0 left-0 bottom-0 right-0 group-hover:bg-[#00000055] flex items-center justify-center">
                        <p className="text-white hidden group-hover:block">
                          Read more
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[10px] max-w-[360px] p-[10px]">
                      <p className="font-semibold">{insight.title}</p>
                      <p className="flex-1">
                        {insight.content.replace(/\*/g, "").replace(/#/g, "").substring(0, 70) + "..."}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="flex items-center gap-5 text-[#404040] font-medium text-[12px] ml-auto">
        <p
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => handleLike()}
        >
          <Icon
            icon={like ? "flat-color-icons:like" : "icon-park-outline:like"}
            width={20}
            height={20}
          />
          {poll.likes} Likes
        </p>
        <button onClick={()=>setShowShareModal(true)} className="text-[#404040] flex items-center cursor-pointer select-none gap-1">
          <Icon icon="ix:share" width={20} height={20} />
          Share
        </button>
      </div>
      <ShareModal show={showShareModal} hideDialog={() => setShowShareModal(false)} data={{ id: poll.id, title: poll.questions[0].headline }} />
    </div>
  );
}
