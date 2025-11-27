"use client";
import { updatePoll, votePoll } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import Image from "next/image";
import { arrayRemove, arrayUnion, increment } from "firebase/firestore";

export default function GoldenInsightDetail({
  id,
  article,
  poll: initialPoll,
  selectedOptions: initialSelectedOptions,
  voted: initialVoted,
  back
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );
  const [copied, setCopied] = useState(false);
  const [poll, setPoll] = useState({
    ...initialPoll,
    likes: initialPoll.likes ?? 0,
    like_users: initialPoll.like_users ?? [],
    dislikes: initialPoll.dislikes ?? 0,
    dislike_users: initialPoll.dislike_users ?? [],
  });
  const [canLike, setCanLike] = useState(false);
  const [canDislike, setCanDislike] = useState(false);
  const url = `https://held-accountable.com/golden-insights/${id}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(article.title);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {}, [id]);

  const handleVote = async (optionId) => {
    setSelectedOptions(selectedOptions.map((o, i) => (i === 0 ? optionId : o)));
    setVoted(voted.map((o, i) => (i === 0 ? optionId : o)));
    try {
      const voted = await votePoll(poll.id, auth.currentUser.uid, 0, optionId);
      if (voted) {
        setSelectedOptions(
          selectedOptions.map((o, i) => (i === 0 ? optionId : o))
        );
        setVoted(voted.map((o, i) => (i === 0 ? optionId : o)));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLike = async () => {
    setCanLike(false);
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

  const handleDislike = async () => {
    setCanDislike(false);
    if (poll.dislike_users.includes(auth.currentUser.uid)) return;
    let additionalChange = {};

    if (poll.like_users.includes(auth.currentUser.uid)) {
        additionalChange = {
            likes: increment(-1),
            like_users: arrayRemove(auth.currentUser.uid)
        };
    }
    
    await updatePoll(poll.id, {
      dislikes: increment(1),
      dislike_users: arrayUnion(auth.currentUser.uid),
      ...additionalChange
    });

    additionalChange = {};
    if (poll.like_users.includes(auth.currentUser.uid)) {
        additionalChange = {
            likes: poll.likes - 1,
            like_users: poll.like_users.filter(uid => uid !== auth.currentUser.uid)
        };
    }
    setPoll({
        ...poll,
        dislikes: poll.dislikes + 1,
        dislike_users: [
            ...poll.dislike_users,
            auth.currentUser.uid
        ],
        ...additionalChange
    });
  }

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (user) {
        setCanLike(auth.currentUser ? !poll.like_users.includes(auth.currentUser.uid): false);
        setCanDislike(auth.currentUser ? !poll.dislike_users.includes(auth.currentUser.uid): false);
      }
    });
  }, []);

  useEffect(() => {
    setCanLike(auth.currentUser ? !poll.like_users.includes(auth.currentUser.uid): false);
    setCanDislike(auth.currentUser ? !poll.dislike_users.includes(auth.currentUser.uid): false);
  }, [poll]);

  if (!article) {
    return <></>;
  }

  return (
    <div className="w-full md:h-full overflow-scroll md:overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#3B88E3]">
      <div className="flex flex-col gap-6 px-[24px] py-[40px] border-b border-secondary items-center md:max-w-[80%] mx-auto">
        <div className="flex flex-col gap-[24px] flex-1 text-white w-full">
          <div className="text-[30px] leading-[38px] font-semibold text-center">
            {article.title}
          </div>
          <div className="text-[16px] leading-[24px] text-center">
            {poll.questions[0].question}
          </div>
          {poll.questions[0].summary ? (
            <button
              className="text-white flex gap-[2px] items-center text-center mx-auto"
              onClick={() => setShowSummary(!showSummary)}
            >
              Simplify <Icon icon="lsicon:down-outline" />
            </button>
          ) : (
            ""
          )}
          {poll.questions[0].summary && showSummary ? (
            <div className="px-[10px] md:px-[30px]">
              <div className="rounded-[7px] border-l-[2px] border-[#3B88E3] bg-[#3B88E326] text-white p-[14px]">
                {poll.questions[0].summary}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full mt-2">
          <div className="flex items-center gap-3">
            <Image
              src={poll.user?.avatar || "/images/logo.png"}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full object-cover border border-[#E4E7EC]"
            />
            <div className="flex flex-col">
              <span className="text-white text-xs opacity-80">
                {poll.createdAt &&
                  new Date(poll.createdAt * 1000).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button disabled={!canDislike} onClick={handleDislike} className="disabled:bg-[#E4E7EC] border border-[#E4E7EC] rounded-lg px-3 py-2 flex items-center gap-2 text-[#414651] text-sm bg-white hover:bg-[#F2F4F7] transition font-medium">
              <Icon
                icon="ic:baseline-thumb-down-alt"
                width={18}
                height={18}
                style={{ color: (canDislike ? "#a4a7ae": "#3B88E3") }}
              />{" "}
              Dislike
            </button>
            <button disabled={!canLike} onClick={handleLike} className="border border-[#E4E7EC] rounded-lg px-3 py-2 flex items-center gap-2 text-[#414651] text-sm bg-white hover:bg-[#F2F4F7] transition font-medium">
              <Icon
                icon="ic:baseline-thumb-up-alt"
                width={18}
                height={18}
                style={{ color: (canLike ? "#a4a7ae": "#3B88E3") }}
              />{" "}
              Like
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full h-full h-col gap-[32px] overflow-auto pt-[30px] bg-white">
        <div className="w-full px-[16px] md:px-[100px] flex flex-col gap-[20px] md:max-w-[80%] mx-auto">
          <p className="text-[24px] font-bold">Voting Section</p>
          <div className="pl-[15px] flex flex-col gap-[12px] w-full text-sm leading-sm font-medium bg-white">
            {selectedOptions[0] == -1
              ? poll.questions[0].options.map((option, i) => (
                  <button
                    onClick={() => handleVote(i)}
                    key={"option" + option.text + i}
                    className="border-secondary border p-[16px] w-full hover:bg-[#E4E7EC] rounded-[12px] cursor-pointer flex"
                  >
                    <div className="flex-1">{option.text}</div>
                    <div className="rounded-full w-[20px] h-[20px] border border-primary"></div>
                  </button>
                ))
              : poll.questions[0].options.map((option, i) => {
                  const isSelected = i === voted[0];
                  let percentage = 0;
                  if (option.votes) {
                    let votes = option.votes;
                    let totalVotes = poll.questions[0].totalVotes;
                    if (isSelected) {
                      votes = votes + 1;
                    }
                    if (voted[0] > -1) totalVotes = totalVotes + 1;
                    percentage = (votes / totalVotes) * 100;
                  } else if (isSelected) {
                    let votes = 1;
                    let totalVotes = poll.questions[0].totalVotes;
                    if (voted[0] > -1) totalVotes = totalVotes + 1;
                    percentage = (votes / totalVotes) * 100;
                  }

                  return (
                    <div
                      key={i}
                      className="relative border-secondary border p-[16px] w-full rounded-[12px] flex items-center"
                    >
                      <div
                        className="absolute inset-0 bg-[#3B88E357] rounded-[12px]"
                        style={{ width: `${percentage}%` }}
                      ></div>

                      <div className="relative flex-1">{option.text}</div>
                      <div className="relative font-bold">
                        {Math.round(percentage)}%
                      </div>
                    </div>
                  );
                })}
            <div className="w-full flex justify-center">
              <span className="text-[#949494] text-sm font-normal">
                {(selectedOptions[0] === voted[0] && voted[0] > -1
                  ? poll.questions[0].totalVotes + 1
                  : poll.questions[0].totalVotes
                ).toLocaleString()}{" "}
                Votes
              </span>
            </div>
          </div>
          <p className="text-[24px] font-bold mt-6">Introduction</p>
          {/* <img src={article.image} /> */}
          <div
            className="golden-insight-detail-content text-base font-normal text-[#535862] leading-[28px]"
            style={{ fontFamily: "'Inter', Arial, Helvetica, sans-serif" }}
            dangerouslySetInnerHTML={{ __html: marked(article.content) }}
          ></div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between pb-[30px] gap-[30px] items-center px-[50px] md:max-w-[80%] mx-auto">
          <div className="rounded-full bg-[#3B88E31F] min-w-[114px] h-[22px] flex items-center justify-center text-[#3B88E3] px-[10px]">
            <span className="text-xs leading-xs font-medium">{poll.topic}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
            <div className="flex gap-2 items-center">
              <button
                className={`border border-[#E4E7EC] rounded-lg px-3 py-2 flex items-center gap-2 text-sm bg-white transition-colors duration-200 ${
                  copied
                    ? "text-[#3B88E3] border-[#3B88E3] bg-[#F2F4F7]"
                    : "text-[#667085]"
                }`}
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <Icon icon="mdi:link-variant" width={16} height={16} />
                {copied ? "Copied" : "Copy link"}
              </button>
              <a 
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                <Icon icon="ri:twitter-x-fill" width={18} height={18} />
              </a>
              <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                <Icon icon="ic:baseline-facebook" width={18} height={18} />
              </a>
              <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#E4E7EC] rounded-lg w-8 h-8 flex items-center justify-center bg-white text-[#667085]">
                <Icon icon="mdi:linkedin" width={18} height={18} />
              </a>
            </div>
            {back && <button onClick={() => back()} className="border border-[#E4E7EC] rounded-lg py-1 px-6 flex items-center gap-1 text-[#667085]">
              <Icon icon='lets-icons:back' />Back
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
}
