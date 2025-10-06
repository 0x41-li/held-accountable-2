'use client';
import Sidebar from "@/components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../../lib/firebase";
import { addArticleToPoll, createSnapshot, getUserById, updateUserById } from "@/services/polls/polls";
import { onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MultiSelect } from "@/components/ui/MultiSelect";

export default function NewSnapshotPage() {
    const [title, setTitle] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [content, setContent] = useState("");
    const fileRef = useRef(null);
    const [image, setImage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [postDate, setPostDate] = useState((new Date()).toLocaleString("en-CA", { timeZone: "America/New_York" }).substring(0, 10));
    const router = useRouter();

    const handleUploadImage = (e) => {
        let formData = new FormData();
        formData.append("key", "60d2ec5533289541d56128c844b52204");
        formData.append("image", e.target.files[0]);
        fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        }).then(res => res.json())
        .then(res => {
            setImage(res.data.image.url);
        });
    }

    const onSave = async () => {
        if (isPosting) {
            return;
        }

        setIsPosting(true);
        const userDoc = await getUserById(auth.currentUser.uid);
        const snapshot = await createSnapshot({
            title,
            content,
            image,
            tags: selectedTopics,
            post_date: postDate,
            user: {
                id: auth.currentUser.uid,
                fullname: auth.currentUser.displayName,
                username: userDoc.username,
                avatar: userDoc.avatar ?? "" 
            },
            view_count: 0,
            status: 1
        });
        toast.success("Successfully created");
        router.back();
        setIsPosting(false);
    }

    return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
        <div className='flex flex-col md:flex-row gap-[10px] px-[24px] pb-[20px] border-b border-secondary items-start'>
          <div className='flex flex-col gap-[4px] flex-1'>
            <div className='text-[30px] leading-[38px] font-semibold'>New Snapshot</div>
          </div>
          <div className="flex gap-[10px]  items-center">
            <button className="bg-blue rounded-[10px] text-white  w-[200px] py-[14px]" disabled={isPosting} onClick={() => onSave()}>{isPosting?"Publishing...":"Publish"}</button>
          </div>
        </div>
        <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px] pl-[24px]'>
            <div className="flex flex-col gap-[16px] w-full pr-[20px] md:pr-[0px] pb-[20px] md:pb-[0px] md:w-[640px]">
                <div className="text-[18px] leading-[38px]">Content</div>
                <div className="flex gap-[32px] flex-col md:flex-row">
                    <span className="w-[160px]">Title</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter the snapshot title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex gap-[32px] flex-col md:flex-row">
                    <span className="w-[160px]">Date</span>
                    <input type="date" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Select date" value={postDate} onChange={(e) => setPostDate(e.target.value)} />
                </div>
                <div className="flex gap-[32px] flex-col md:flex-row">
                    <span className="w-[160px]">Tags</span>
                    <div className="flex-1">
                        <MultiSelect
                            options={[
                                "Gaming",
                                "Technology",
                                "Health",
                                "Science",
                                "Education",
                                "Design",
                                "Research",
                            ]}
                            placeholder="Filter Tags"
                            selectedValues={selectedTopics}
                            onChange={setSelectedTopics}
                        />
                    </div>
                </div>
                <div className="flex gap-[32px] flex-col md:flex-row">
                    <span className="w-[160px]">Header Photo</span>
                    <input type="file" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Select header photo" ref={fileRef} onChange={(e) => handleUploadImage(e)} />
                </div>
                <div className="flex gap-[32px] flex-col md:flex-row">
                    <span className="w-[160px]">Main Text</span>
                    <textarea className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary min-h-[300px]" placeholder="Insert the main text" value={content} onChange={(e) => setContent(e.target.value)}>
                    </textarea>
                </div>
            </div>
        </div>
      </div>);
}