'use client';
import Sidebar from "@/components/Sidebar";
import { getArticleById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetail() {
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        getArticleById(id).then(blog => {
            setArticle(blog);
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
              <div className='text-[30px] leading-[38px] font-semibold'>Thought Leadership</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>The latest industry news, interviews, technologies, and resources.</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px]'>
            <div className="text-center text-[48px] leading-[60px]">
                {article.title}
            </div>
            <div className="flex justify-center gap-[10px]">
                {article.topic ? <div className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white">
                    <span className="text-xs leading-xs font-medium">{article.topic}</span>
                </div>: ""}
            </div>
            <div className="w-full px-[100px] flex flex-col gap-[20px]">
                <img src={article.image} />
                <div className="text-[18px] leading-[28px]">
                    {article.content}
                </div>
            </div>
            <div className="flex justify-center pb-[30px]">
                <button onClick={() => goBack()} className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]"><Icon icon='lets-icons:back' />Back</button>
            </div>
          </div>
        </div>);
}