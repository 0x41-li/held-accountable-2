'use client';
import Sidebar from "@/components/Sidebar";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { getPollsByUserId } from "@/services/polls/polls";
import { onAuthStateChanged } from "firebase/auth";
import CreatePoll from "@/components/CreatePoll";

const MyNarratives = () => {
    const [polls, setPolls] = useState([]);
    const [addPollDialogVisible, setAddPollDialogVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                return;
            }
            getPollsByUserId(auth.currentUser.uid).then((plist) => setPolls(plist));
        });

        return () => unsubscribe();
    }, []);

    const handleCreatePoll = () => {
      if (auth.currentUser)
        setAddPollDialogVisible(true);
      else {
        router.push("/auth/signin");
      }
    }

    const getStatusText = (status) => {
        if (status == 1) {
            return "Enabled";
        }
        else
            return "Disabled";
    }
      
    return (
        <div className='w-full h-full overflow-hidden md:rounded-tl-[40px] pt-[32px] border border-secondary flex flex-col bg-[#FCFCFD]'>
            <div className='flex px-[24px] pb-[20px] border-b border-secondary items-start'>
              <div className='flex flex-col gap-[4px] flex-1'>
                <div className='text-[30px] leading-[38px] font-semibold'>Narratives</div>
                <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Create your narratives, track your earning! </div>
              </div>
              <Link href="/new-narrative" className='hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px]' onClick={() => handleCreatePoll()}>
              + New Narrative
              </Link>
            </div>
            <div className='flex-1 flex h-full'>
              <div className='px-[32px] flex-1 pt-[24px] flex flex-col h-full'>
                <div className='flex flex-col gap-[24px] flex-1 h-full overflow-auto pb-[200px]'>
                    <div className="overflow-scroll flex flex-col">
                        <div className="flex gap-[12px] items-center p-4">
                            <div className="text-[18px] leading-[28px] font-semibold flex-1">My Narratives</div>
                        </div>
                        <table className="table-auto flex-1 overflow-auto">
                            <thead className="text-slate-500 border-b border-slate-300 bg-slate-50">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Topic / Poll</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Views</th>
                                    <th className="p-4">Revenue</th>
                                    <th className="p-4">&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
            </div>
          </div>);
}

export default MyNarratives;