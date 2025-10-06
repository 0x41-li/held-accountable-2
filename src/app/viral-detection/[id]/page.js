'use client';
import Sidebar from "@/components/Sidebar";
import { getViralDetectionById } from "@/services/polls/polls";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetail() {
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        getViralDetectionById(id).then(blog => {
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
              <div className='text-[30px] leading-[38px] font-semibold'>Viral Detection</div>
              <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Top 5 most trending topics today!</div>
            </div>
          </div>
          <div className='flex-1 flex flex-col w-full md:w-auto h-full h-col gap-[32px] overflow-auto md:pt-[30px]'>
            <div className="text-center text-[32px] md:text-[48px] md:leading-[60px] ">
                {article.title}
            </div>
            <div className="flex justify-center gap-[10px]">
                {[article.category].map((tag, index) => (
                    <div
                    key={index}
                    className={`rounded-full border  flex justify-center items-center px-3 py-1 ${
                        index === 0
                        ? "border-[#e9d7fe] bg-[#F9F5FF]"
                        : "border-[#c7d7fe] bg-[#eef4ff]"
                    }`}
                    >
                    <p
                        className={`leading-[143%] text-sm font-medium ${
                        index === 0 ? "text-[#6941C6]" : "text-[#3538cd]"
                        }`}
                    >
                        {tag}
                    </p>
                    </div>
                ))}
            </div>
            <div className="w-full px-[20px] md:px-[100px] flex flex-col gap-[20px]">
                <div className="text-[18px] leading-[28px] golden-insight-detail-content" dangerouslySetInnerHTML={{ __html: marked(article.content)}}>
                </div>
            </div>
            <div className="flex justify-center pb-[30px]">
                <button onClick={() => goBack()} className="border border-secondary px-[16px] py-[8px] flex items-center gap-[2px]"><Icon icon='lets-icons:back' />Back</button>
            </div>
          </div>
        </div>);
}