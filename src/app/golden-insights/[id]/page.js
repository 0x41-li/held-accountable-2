'use client';
import Sidebar from "@/components/Sidebar";
import { getArticleById, getPollById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoldenInsightDetail() {
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const [poll, setPoll] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        getPollById(id).then(poll => {
            setArticle(poll.golden_insights[0]);
            setPoll(poll);
        }).catch(error => {
            console.log(error);
        });
    }, [id]);

    if (!article) {
        return <></>;
    }
    
    const goBack = () => {
        router.back();
    }
  return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
          <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
            <div className='flex flex-col gap-[4px] flex-1'>
              <div className='text-[30px] leading-[38px] font-semibold'>Golden Insights</div>
            </div>
            <div className='border border-secondary rounded-md overflow-hidden flex items-center gap-[8px] p-[10px]'>
              <Icon icon="ri:search-line" className='text-[#667085]' />
              <input type="text" placeholder='Search...' className='outline-none bg-white' />
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px]'>
            <div className="text-center text-[48px] leading-[60px]">
                {article.title}
            </div>
            <div className="flex justify-center gap-[10px]">
                <div className="rounded-full bg-[#5856D6] min-w-[114px] h-[22px] flex items-center justify-center text-white px-[10px]">
                    <span className="text-xs leading-xs font-medium">{poll.topic}</span>
                </div>
            </div>
            <div className="w-full px-[16px] md:px-[100px] flex flex-col gap-[20px]">
                {/* <img src={article.image} /> */}
                <div className="text-[18px] leading-[28px]" dangerouslySetInnerHTML={{ __html: marked(article.content) }}>
                </div>
            </div>
            <div className="flex justify-center pb-[30px] gap-[10px]">
                <button onClick={() => goBack()} className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]"><Icon icon='lets-icons:back' />Back</button>
                <Link href="/blog" className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]">Through My Eyes <Icon icon='ep:right' /></Link>
            </div>
          </div>
        </div>);
}