'use client';
import Sidebar from "@/components/Sidebar";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { getPollsByUserId } from "@/services/polls/polls";
import { onAuthStateChanged } from "firebase/auth";
import CreatePoll from "@/components/CreatePoll";

const Manage = () => {
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
                <div className='text-[30px] leading-[38px] font-semibold'>Poll Management</div>
                <div className='text-[16px] leading-[24px] text-[#7C7C7C]'>Insight and management </div>
              </div>
            </div>
            <div className='flex-1 flex h-full'>
              <div className='px-[32px] flex-1 pt-[24px] flex flex-col h-full'>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='rounded-[8px] overflow-hidden border border-primary p-6'>
                    <h6 className="text-sm font-medium">Active Polls</h6>
                    <h4 className="text-[28px] font-medium mt-2">{polls.filter(p => p.status == 1).length} / {polls.length}</h4>
                  </div>
                  <div className='rounded-[8px] overflow-hidden border border-primary p-6'>
                    <h6 className="text-sm font-medium">Questions</h6>
                    <h4 className="text-[28px] font-medium mt-2">{polls.reduce((s, p) => s + p.questions.length, 0)}</h4>
                  </div>
                  <div className='rounded-[8px] overflow-hidden border border-primary p-6'>
                    <h6 className="text-sm font-medium">Total Votes</h6>
                    <h4 className="text-[28px] font-medium mt-2">{polls.reduce((s, p) => s + p.totalVotes, 0)}</h4>
                  </div>
                </div>
                <div className='flex flex-col gap-[24px] pt-[24px] flex-1 h-full overflow-auto pb-[200px]'>
                    <div className="border border-primary rounded-[12px] overflow-scroll bg-white flex flex-col">
                        <div className="flex gap-[12px] items-center p-4">
                            <div className="text-[18px] leading-[28px] font-semibold flex-1">My Polls</div>
                            <button className='hidden md:block rounded-[8px] bg-blue text-white py-[10px] px-[14px]' onClick={() => handleCreatePoll()}>
                            + Create Poll
                            </button>
                            <button className='rounded-full block fixed right-[40px] text-xl bottom-[40px] w-[40px] h-[40px] md:hidden bg-blue text-white' onClick={() => handleCreatePoll()}>
                            +
                            </button>
                            <CreatePoll show={addPollDialogVisible} hideDialog={() => setAddPollDialogVisible(false)} />
                        </div>
                        <table className="table-auto flex-1 overflow-auto">
                            <thead className="text-slate-500 border-b border-slate-300 bg-slate-50">
                                <tr>
                                    <th className="p-4">Topic Name</th>
                                    <th className="p-4">Question Count</th>
                                    <th className="p-4">Close Date</th>
                                    <th className="p-4">State</th>
                                    <th className="p-4">&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    polls.map(poll => <tr key={poll.id} className="hover:bg-slate-50">
                                        <td className="p-4 text-center">{poll.topic}</td>
                                        <td className="p-4 text-center">{poll.questions.length}</td>
                                        <td className="p-4 text-center">{poll.activeDate.to}</td>
                                        <td className="p-4 flex justify-center items-center"><div className={"rounded-full px-2 py-1 text-white text-xs " + (poll.status == 1 ? ' bg-[#00ff00]': 'bg-[#ff0000]')}>{getStatusText(poll.status)}</div></td>
                                        <td className="p-4 text-center"><Link href={"/manage/" + poll.id}><Icon icon="solar:eye-outline" /></Link></td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
              <div className='border-l border-secondary px-[26px] flex gap-[24px] flex-col'>
                <div className='flex items-center pt-[20px]'>
                  <div className='text-lg leading-lg font-semibold w-[219px]'>Recent Activity</div>
                </div>
              </div>
            </div>
          </div>);
}

export default Manage;