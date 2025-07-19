import { formatDate } from "@/utils/date";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const Blog = ({blog}) => {
    const router = useRouter();

    const gotoDetailPage = () => {
        router.push("/blog/" + blog.id);
    }

    const isNew = useMemo(() => {
        const created_at = new Date(blog.createdAt.seconds * 1000)
        return created_at > Date.now() - 2 * 60 * 60 * 1000;
    }, [blog]);

    return <div className="rounded-[12px] border border-secondary shadow-xs flex flex-col p-[16px] gap-[11px] md:gap-[20px] md:px-[24px] md:py-[17px] w-full bg-white cursor-pointer" onClick={() => gotoDetailPage()}>
        <div className="flex w-full gap-[8px] items-center w-full">
            <div className="flex flex-1">
                <div className="rounded-full">
                    <Icon icon="mynaui:user-solid" className="text-[32px]" />
                </div>
                <div>
                    <p className="leading-[20px] text-[14px] font-medium">{blog.user ? blog.user.fullname: ""}</p>
                    <p className="leading-[16px] text-[12px]">@{blog.user ? blog.user.username: ""}</p>
                </div>
            </div>
            {blog.topic ? <div className="rounded-full bg-[#5856D6] w-[114px] h-[22px] flex items-center justify-center text-white">
                <span className="text-xs leading-xs font-medium">{blog.topic}</span>
            </div>: ""}
            {isNew && <span className="text-3xl text-green-500"><Icon icon="mdi:new-box" /></span>}
        </div>
        <div className="flex gap-[20px]">
            <img src={blog.image} className="w-[215px]" />
            <div className="flex-1 flex flex-col gap-[16px]">
                <div className="text-[24px] leading-[32px]">{blog.title}</div>
                <div className="text-[16px] leading-[28px]">{blog.content}</div>
            </div>
        </div>
        <div className="flex w-full text-[14px] leading-[7px] text-[#949494]">
            <span className="flex-1 flex gap-[4px] items-center">
                <Icon icon="solar:eye-outline" />&nbsp;{blog.view_count ?? 0}
            </span>
            <span>{formatDate(new Date(blog.createdAt.seconds * 1000))}</span>
        </div>
    </div>;
}

export default Blog;
