import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Label from "../ui/Label";
import { formatDateTime } from "@/utils/date";
import Link from "next/link";

export default function HomePoll({ data }) {
  const [like, setLike] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [imgSrc, setImgSrc] = useState(data?.user?.avatar || "");
  const postedDate = new Date(data.createdAt.seconds * 1000);

  const isNew = useMemo(() => {
    const created_at = new Date(data.createdAt.seconds * 1000);
    return created_at > Date.now() - 2 * 60 * 60 * 1000;
  }, [data]);

  return (
    <div className="flex flex-col items-start pt-3 md:pt-6 pb-4 px-3 md:px-6 rounded-lg border border-secondary shadow-xs w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-between w-full mb-2 md:mb-0">
        <div className="flex items-center gap-3">
          <Image
            src={imgSrc || "/images/olivar_avatar.png"}
            alt={data?.user?.fullname || "Aliah Lane"}
            width={32}
            height={32}
            className="rounded-full"
            onError={() => setImgSrc("/images/olivar_avatar.png")}
          />
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium text-[#101828]">
              {data?.user?.fullname || "Aliah Lane"}
            </p>
            <span className="text-[#7C7C7C] text-[12px]">
              {data?.user?.username || "@aliahlane_official"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:bookmark-plus-outline"
            className="cursor-pointer"
            width={24}
            height={24}
          />
          {isNew && (
            <span className="text-3xl text-[#3B88E3]">
              <Icon icon="mdi:new-box" />
            </span>
          )}
          <Label
            icon="mingcute:document-fill"
            text={data.topic}
            className="bg-[#5856D6] border border-[#3A38BE]"
          />
          <Label
            icon="tabler:heart-filled"
            text="Tip Author"
            className="bg-[#34C759] border border-[#25B048] cursor-pointer select-none"
            onClick={() => console.log("tip")}
          />
          {/* {data.questions.length > 0 && (
            <Label
              text={data.questions.length}
              className="bg-[#3B88E3] !px-3.5"
            />
          )} */}
          <Image src="/images/fire_icon.png" alt="Top" width={24} height={24} />
        </div>
      </div>

      <div className="flex flex-col py-1 md:py-5 px1 md:px-4 w-full">
        <div className="flex flex-col">
          <p className="font-medium leading-7">{data.questions[0].headline}</p>
          {data.questions[0] ? (
            <button
              className="text-blue flex gap-[2px] items-center mt-1"
              onClick={() => setShowMore(!showMore)}
            >
              Read More{" "}
              <Icon
                icon="lsicon:down-outline"
                className={`transition-transform duration-300 ${
                  showMore ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : null}

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              showMore ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-3">
              <div className="rounded-lg border-l-2 border-[#3B88E3] bg-[#3B88E326] text-blue p-[14px]">
                {data.questions[0].summary}
              </div>
            </div>
          </div>
        </div>

        {data.golden_insights.length > 0 && (
          <div className="mt-8 flex flex-col items-start gap-3 w-full">
            <div className="flex items-center gap-3">
              <Icon
                icon="hugeicons:message-multiple-02"
                width={29}
                height={29}
              />
              <p className="font-medium text-[#101828]">Community Narratives</p>
              <Label
                text="Premium"
                className="!text-[#175CD3] bg-[#EFF8FF] border border-[#B2DDFF]"
              />
            </div>
            <div className="flex items-center gap-6 overflow-x-auto flex-nowrap w-full pb-3">
              {data.golden_insights.map((item) => (
                <Link
                  key={data.id + "_poll_link"}
                  href={`/narrative-insights/${data.id}`}
                >
                  <div className="relative flex items-center gap-4 border border-[#E6E6E6] rounded-2xl flex-shrink-0 h-[140px] md:h-[184px] cursor-pointer group">
                    <Image
                      src={item?.img || "/images/homeCarousel/image1.png"}
                      alt="Preview"
                      width={276}
                      height={184}
                      className="w-[210px] md:w-[276px] rounded-2xl flex-shrink-0 object-cover"
                      unoptimized
                    />

                    <div className="absolute top-0 left-0 w-[210px] md:w-[276px] h-full bg-black bg-opacity-0 rounded-2xl flex items-center justify-center text-white font-semibold text-lg transition-all duration-300 group-hover:bg-opacity-50 group-hover:opacity-100 opacity-0">
                      Read More
                    </div>

                    <div className="flex flex-col py-0 md:py-4 pr-3 flex-1 w-[300px] h-[max-content]">
                      <p className="font-bold text-[#181D27] line-clamp-1">
                        {item.title}
                      </p>
                      <span className="text-[#535862] text-sm pt-2 line-clamp-3">
                        {item.content}
                      </span>
                      <div className="flex items-center mt-1 md:mt-5 flex-wrap gap-2">
                        <p className="flex items-center font-medium text-[#C00F06]">
                          {item?.dislikes ?? 0}{" "}
                          <Icon
                            icon="iconamoon:dislike"
                            width={20}
                            height={20}
                          />
                        </p>
                        <p className="flex items-center font-medium text-[#34C759]">
                          <Icon icon="iconamoon:like" width={20} height={20} />
                          {item?.likes ?? 0}{" "}
                        </p>
                        <p className="flex items-center font-medium text-[#525252] text-sm ml-auto gap-1">
                          Click to vote
                          <Icon
                            icon="line-md:arrow-right"
                            width={16}
                            height={16}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-2">
        <div className="text-sm text-[#949494]">
          <p>
            {data.totalVotes ? data.totalVotes.toLocaleString("en-US") : 0}{" "}
            Votes Poll ends {data.activeDate.to}
          </p>
          <p>Posted {formatDateTime(postedDate)}</p>
        </div>
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
            {data?.likes ? data.likes.toLocaleString("en-US") : 0} Likes
          </p>
          <p className="text-[#404040] flex items-center cursor-pointer select-none gap-1">
            <Icon icon="ix:share" width={20} height={20} />
            Share
          </p>
        </div>
      </div>
    </div>
  );
}
