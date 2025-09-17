'use client';
import Sidebar from "@/components/Sidebar";
import { getArticleById, getPollById, votePoll } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function GoldenInsightDetail({ id, goBack }) {
    const [article, setArticle] = useState(null);
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState([]);
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        getPollById(id).then(poll => {
            setArticle(poll.golden_insights[0]);
            setPoll(poll);
            setSelectedOptions(poll.questions.map(q => q.users ? (q.users.findIndex(u => u === auth.currentUser.uid) >= 0 ? 1 : -1): -1));
            setVoted(poll.questions.map(q => -1));
        }).catch(error => {
            console.log(error);
        });
    }, [id]);

    const handleVote = async (optionId) => {
        setSelectedOptions(selectedOptions.map((o, i) => i === 0 ? optionId : o));
        setVoted(voted.map((o, i) => i === 0 ? optionId : o));
        try {
            const voted = await votePoll(poll.id, auth.currentUser.uid, 0, optionId);
            if (voted) {
                setSelectedOptions(selectedOptions.map((o, i) => i === 0 ? optionId : o));
                setVoted(voted.map((o, i) => i === 0 ? optionId : o));
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    if (!article) {
        return <></>;
    }
    
  return (
    <div className='w-full md:h-full overflow-scroll md:overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#3B88E3]'>
          <div className='flex px-[24px] py-[40px] border-b border-secondary items-start md:max-w-[80%] mx-auto'>
            <div className='flex flex-col gap-[24px] flex-1 text-white'>
              <div className='text-[30px] leading-[38px] font-semibold text-center'>{article.title}</div>
              <div className='text-[16px] leading-[24px] text-center'>{poll.questions[0].question}</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col w-full h-full h-col gap-[32px] overflow-auto pt-[30px] bg-white'>
            <div className="w-full px-[16px] md:px-[100px] flex flex-col gap-[20px] md:max-w-[80%] mx-auto">
                <p className="text-[24px] font-bold">Voting Section</p>
                <div className="pl-[15px] flex flex-col gap-[12px] w-full text-sm leading-sm font-medium bg-white">
                    {selectedOptions[0] == -1 ? poll.questions[0].options.map((option,i) => <button onClick={()=>handleVote(i)} key={"option" + option.text + i} className="border-secondary border p-[16px] w-full hover:bg-[#E4E7EC] rounded-[12px] cursor-pointer flex">
                        <div className="flex-1">{option.text}</div>
                        <div className="rounded-full w-[20px] h-[20px] border border-primary"></div>
                    </button>): (
                            poll.questions[0].options.map((option, i) => {
                                const isSelected = i === voted[0];
                                let percentage = 0;
                                if (option.votes) {
                                    let votes = option.votes;
                                    let totalVotes = poll.questions[0].totalVotes;
                                    if (isSelected) {
                                        votes = votes + 1;
                                    }
                                    if (voted[0] > -1)
                                        totalVotes = totalVotes + 1;
                                    percentage = (votes / totalVotes) * 100;
                                }
                                else if (isSelected) {
                                    let votes = 1;
                                    let totalVotes = poll.questions[0].totalVotes;
                                    if (voted[0] > -1)
                                        totalVotes = totalVotes + 1;
                                    percentage = (votes / totalVotes) * 100;
                                }

                                return (
                                    <div key={i} className="relative border-secondary border p-[16px] w-full rounded-[12px] flex items-center">
                                        <div className="absolute inset-0 bg-[#3B88E357] rounded-[12px]" style={{ width: `${percentage}%` }}></div>

                                        <div className="relative flex-1">{option.text}</div>
                                        <div className="relative font-bold">{Math.round(percentage)}%</div>
                                    </div>
                                );
                            })
                        )}
                </div>
                <p className="text-[24px] font-bold">Introduction</p>
                {/* <img src={article.image} /> */}
                <div className="text-[18px] leading-[28px]" dangerouslySetInnerHTML={{ __html: marked(article.content) }}>
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between pb-[30px] gap-[30px] items-center px-[50px] md:max-w-[80%] mx-auto">
                <div className="rounded-full bg-[#3B88E31F] min-w-[114px] h-[22px] flex items-center justify-center text-[#3B88E3] px-[10px]">
                    <span className="text-xs leading-xs font-medium">{poll.topic}</span>
                </div>
                <div className="flex gap-[20px]">
                    <button onClick={() => goBack()} className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]"><Icon icon='lets-icons:back' />Back</button>
                    <Link href="/blog" className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]">Through My Eyes <Icon icon='ep:right' /></Link>
                </div>
            </div>
          </div>
        </div>);
}