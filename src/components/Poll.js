"use client";
import { votePoll } from "@/services/polls/polls";
import { formatDate, formatDateTime } from "@/utils/date";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../lib/firebase";
import Link from "next/link";

export default function Poll({ poll }) {
  const [showSummary, setShowSummary] = useState(false);
  const [like, setLike] = useState(false);
  if (!poll.questions) return "";

  const handleShowSummary = () => {
    setShowSummary(!showSummary);
  };

  const isNew = useMemo(() => {
    const created_at = new Date(poll.createdAt.seconds * 1000);
    return created_at > Date.now() - 2 * 60 * 60 * 1000;
  }, [poll]);

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
            Breaking News - {poll.questions[0].headline}
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
                <Link
                  href={`/golden-insights/${poll.id}`}
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
                        {insight.content.substring(0, 70) + "..."}
                      </p>
                    </div>
                  </div>
                </Link>
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
          onClick={() => setLike(!like)}
        >
          <Icon
            icon={like ? "flat-color-icons:like" : "icon-park-outline:like"}
            width={20}
            height={20}
          />
          {poll.likes} Likes
        </p>
        <p className="text-[#404040] flex items-center cursor-pointer select-none gap-1">
          <Icon icon="ix:share" width={20} height={20} />
          Share
        </p>
      </div>
    </div>
  );
}
