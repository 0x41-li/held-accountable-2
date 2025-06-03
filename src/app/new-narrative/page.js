'use client';
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { getUserById, updateUserById } from "@/services/polls/polls";
import { onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Profile() {
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(null);

    return (
    <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
        <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
          <div className='flex flex-col gap-[4px] flex-1'>
            <div className='text-[30px] leading-[38px] font-semibold'>New Narrative</div>
            <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Create your narratives, track your earning! </div>
          </div>
          <div className="flex gap-[10px]  items-center">
          <button className="border border-primary rounded-[10px] w-[200px] py-[14px]">Save Draft</button>
            <button className="bg-blue rounded-[10px] text-white  w-[200px] py-[14px]">Publish</button>
          </div>
        </div>
        <div className='flex-1 flex flex-col h-full h-col gap-[32px] overflow-auto pt-[30px] pl-[24px]'>
            <div className="flex flex-col gap-[16px] w-full pr-[20px] md:pr-[0px] pb-[20px] md:pb-[0px] md:w-[640px]">
                <div className="text-[18px] leading-[38px]">Content</div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Title</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Enter the narrative title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Targeted Poll / Topic</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Search" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Header Photo</span>
                    <input type="file" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Select header photo" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Main Text</span>
                    <textarea className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Insert the main text of narrative" value={title} onChange={(e) => setTitle(e.target.value)}>
                    </textarea>
                </div>
                <hr />
                <div className="text-[18px] leading-[38px]">Donation Detail</div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Wallet 1</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Wallet Address 1" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex gap-[32px]">
                    <span className="w-[160px]">Wallet 2</span>
                    <input type="text" className="px-[14px] py-[10px] rounded-[8px] flex-1 md:w-[448px] border border-primary" placeholder="Wallet Address 1" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <button className="text-blue">+ Add Wallet</button>
            </div>
        </div>
      </div>);
}