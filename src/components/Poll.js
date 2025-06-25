'use client';
import { votePoll } from "@/services/polls/polls";
import { formatDate, formatDateTime } from "@/utils/date";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import TipAuthor from "./TipAuthor";
import { toast } from "react-toastify";

const NARRATIVES = [
    {
        "id": 1,
        "title": "Narrative Title here...",
        "description": "How do you create compelling presentations that wow your colleagues and impress your managers?",
        "user": {
            "avatar": "/images/olivar_avatar.png",
            "username": "Olivia Rhye",
        },
        "created_at": "20 Jan 2025",
        "vote_up": 120,
        "vote_down": 120
    },
    {
        "id": 2,
        "title": "Narrative Title here...",
        "description": "How do you create compelling presentations that wow your colleagues and impress your managers?",
        "user": {
            "avatar": "/images/olivar_avatar.png",
            "username": "Olivia Rhye",
        },
        "created_at": "20 Jan 2025",
        "vote_up": 120,
        "vote_down": 120
    }
]
export default function Poll({poll}) {
    const [curQueId, setCurQueId] = useState(0);
    const [voted, setVoted] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [tipDlgShow, setTipDlgShow] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const handleVote = async (optionId) => {
        setSelectedOptions(selectedOptions.map((o, i) => i === curQueId ? optionId : o));
        setVoted(voted.map((o, i) => i === curQueId ? optionId : o));
        try {
            const voted = await votePoll(poll.id, auth.currentUser.uid, curQueId, optionId);
            if (voted) {
                setSelectedOptions(selectedOptions.map((o, i) => i === curQueId ? optionId : o));
                setVoted(voted.map((o, i) => i === curQueId ? optionId : o));
            }
        }
        catch (e) {
        }
    }


    if (!poll.questions)
        return "";

    useEffect(() => {
        setSelectedOptions(poll.questions.map(q => q.users ? (q.users.findIndex(u => u === auth.currentUser.uid) >= 0 ? 1 : -1): -1));
        setVoted(poll.questions.map(q => -1));
    }, [poll]);

    const handleShowSummary = () => {
        setShowSummary(!showSummary);
    }

    const isNew = useMemo(() => {
        const created_at = new Date(poll.createdAt.seconds * 1000)
        return created_at > Date.now() - 2 * 60 * 60 * 1000;
    }, [poll]);

    return <div className="rounded-[12px] border border-secondary shadow-xs flex flex-col p-[16px] gap-[11px] md:gap-[20px] md:px-[24px] md:py-[17px] w-full bg-white">
        {/* <div className="flex w-full text-[14px] leading-[7px] text-[#949494]">
        </div> */}
        <div className="flex w-full gap-[8px] items-center w-full">
            <div className="flex flex-1 gap-[10px] items-center">
                <div className="rounded-full overflow-hidden">
                    {poll.user.avatar ? <img src={poll.user.avatar} className="w-[44px] h-[44px]" />:<Icon icon="mynaui:user-solid" className="text-[32px]" />}
                </div>
                <span className="text-[14px] text-[#949494]">{formatDate(new Date(poll.createdAt.seconds * 1000))}</span>
                <div>
                    <p className="leading-[20px] text-[14px] font-medium">{poll.user ? poll.user.fullname: ""}</p>
                    <p className="leading-[16px] text-[12px]">{poll.user ? ((poll.user.username == "")?"":("@" + poll.user.username)): ""}</p>
                </div>
            </div>
            <div className="hidden md:flex gap-[8px]">
                {/* <button className="text-xl"><Icon icon="mdi:bookmark-plus-outline" /></button> */}
                <Link href="/blog" className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white">
                    <Icon icon="mingcute:document-fill" />
                    <span className="text-xs leading-xs font-medium">&nbsp;{poll.topic}</span>
                </Link>
                {/* {poll.user.id === "" ? "" : <button className="rounded-full bg-[#34C759] w-[114px] h-[22px] flex items-center justify-center text-white" onClick={() => setTipDlgShow(true)}>
                    <Icon icon="tabler:heart-filled" />
                    <span className="text-xs leading-xs font-medium">Tip Author</span>
                </button>} */}
            </div>
            {/* <div className="rounded-full bg-[#3B88E3] py-[2px] px-[14px] h-[22px] flex items-center justify-center text-white">
                <span className="text-xs leading-xs font-medium">{curQueId + 1}/{poll.questions.length}</span>
            </div> */}
            {isNew && <span className="text-3xl text-green-500"><Icon icon="mdi:new-box" /></span>}
            <img src="/images/fire_icon.png" />
        </div>
        <div className="flex md:hidden gap-[8px]">
            <Link href="/blog" className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white">
                <Icon icon="mingcute:document-fill" />
                <span className="text-xs leading-xs font-medium">&nbsp;{poll.topic}</span>
            </Link>
            {/* <button className="rounded-full bg-[#34C759] w-[114px] h-[22px] flex items-center justify-center text-white" onClick={() => setTipDlgShow(true)}>
                <Icon icon="tabler:heart-filled" />
                <span className="text-xs leading-xs font-medium">Tip Author</span>
            </button> */}
        </div>
        <div className="text-[16px] leading-[28px] font-medium pl-[15px]">
            {poll.questions[curQueId].headline && <p className="font-bold">Breaking News - {poll.questions[curQueId].headline}</p>}
            {poll.questions[curQueId].question}
            { poll.questions[curQueId].summary ? <button className="text-blue flex gap-[2px] items-center" onClick={handleShowSummary}>Elaborate <Icon icon="lsicon:down-outline" /></button>: ""}
        </div>
        {
            poll.questions[curQueId].summary && showSummary ? <div className="px-[30px]">
                <div className="rounded-[7px] border-l-[2px] border-[#3B88E3] bg-[#3B88E326] text-blue p-[14px]">
                    {poll.questions[curQueId].summary}
                </div>
            </div>:""
        }
        <div className="pl-[15px] flex flex-col gap-[12px] w-full text-sm leading-sm font-medium">
            {selectedOptions[curQueId] == -1 ? poll.questions[curQueId].options.map((option,i) => <button onClick={()=>handleVote(i)} key={"option" + option.text + i} className="border-secondary border p-[16px] w-full hover:bg-[#E4E7EC] rounded-[12px] cursor-pointer flex">
                <div className="flex-1">{option.text}</div>
                <div className="rounded-full w-[20px] h-[20px] border border-primary"></div>
            </button>): (
                    poll.questions[curQueId].options.map((option, i) => {
                        const isSelected = i === voted[curQueId];
                        let percentage = 0;
                        if (option.votes) {
                            let votes = option.votes;
                            let totalVotes = poll.questions[curQueId].totalVotes;
                            if (isSelected) {
                                votes = votes + 1;
                            }
                            if (voted[curQueId] > -1)
                                totalVotes = totalVotes + 1;
                            percentage = (votes / totalVotes) * 100;
                        }
                        else if (isSelected) {
                            let votes = 1;
                            let totalVotes = poll.questions[curQueId].totalVotes;
                            if (voted[curQueId] > -1)
                                totalVotes = totalVotes + 1;
                            percentage = (votes / totalVotes) * 100;
                        }

                        return (
                            <div key={i} className="relative border-secondary border p-[16px] w-full rounded-[12px] flex items-center">
                                {/* Progress Bar */}
                                <div className="absolute inset-0 bg-[#3B88E357] rounded-[12px]" style={{ width: `${percentage}%` }}></div>

                                <div className="relative flex-1">{option.text}</div>
                                <div className="relative font-bold">{Math.round(percentage)}%</div>
                            </div>
                        );
                    })
                )}
        </div>
        {poll.questions.length > 0 ?
        <div className="flex items-center justify-center text-sm leading-sm gap-[17px]">
            <span>Questions:</span>
            {poll.questions.map((question, i) => <button key={question.question + i} onClick={() => setCurQueId(i)} className={`rounded-full p-[8px] w-[36px] text-center border border-primary ${curQueId === i ? 'bg-blue text-white': ''}`}>{i + 1}</button>)}
        </div>: ""}
        {poll.golden_insights?<div className="flex w-full flex-col pt-[12px]">
            <div className="flex gap-[10px] items-center pb-[10px]">
                <Icon icon="mynaui:chat-messages" />
                <span>Golden Insights</span>
                {/* <div className="rounded-[50px] border border-[#B2DDFF] bg-[#EFF8FF] text-[#175CD3] text-xs px-[10px]">Premium</div> */}
            </div>
            <div className="w-full overflow-auto">
                <div className="flex w-max gap-[10px]">
                {
                    poll.golden_insights.map((narrative, i) => <Link href={"/golden-insights/" + poll.id} key={i + "_golden_insights"} className="group gap-[10px] border border-[#E6E6E6] rounded-[16px] overflow-hidden w-fit flex cursor-pointer">
                        <div className="w-[225px] relative">
                            <img src="/images/narrative_detail.jpg" className="w-[225px] h-[200px]" />
                            <div className="bg-[#00000000] absolute top-0 left-0 bottom-0 right-0 group-hover:bg-[#00000055] flex items-center justify-center">
                                <p className="text-white hidden group-hover:block">Read more</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[10px] max-w-64 p-[10px]">
                            <p className="font-semibold">{narrative.title}</p>
                            <p className="flex-1">{narrative.content.substring(0, 100) + "..."}</p>
                        </div>
                    </Link>)
                }
                </div>
            </div>
        </div>: ""}
        {/* <TipAuthor selectedUser={poll.user} show={tipDlgShow} hideDialog={() => setTipDlgShow(false)} /> */}
    </div>;
}