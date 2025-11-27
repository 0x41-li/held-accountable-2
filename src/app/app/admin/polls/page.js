'use client';
import Poll from "@/components/Poll";
import { getLatestPolls, updatePoll } from "@/services/polls/polls";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function pollsAdminPage() {
    const [preview, setPreview] = useState(null);
    const [polls, setPolls] = useState([]);
    const [start, setStart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
  
    const { ref, inView } = useInView();
  
    const loadPolls = async () => {
      setLoading(true);
      const { result: poll_list, lastDoc } = await getLatestPolls(start);
  
      if (poll_list.length === 0) {
        setLoading(false);
        setHasMore(false);
        return;
      }
  
      if (polls.findIndex(p => p.id === poll_list[0].id) >= 0) {
        setLoading(false);
        return;
      }
  
      setStart(lastDoc);
      setPolls([...polls, ...poll_list]);
      setLoading(false);
    }

    const getStatusText = (status) => {
        if (status == 1) {
            return "Enabled";
        }
        else
            return "Disabled";
    }

    const changeStatus = (p) => {
        let status = p.status;
        if (status == 1)
            status = 0;
        else
            status = 1;
        setPolls(polls.map(poll => poll.id === p.id ? {...p, status}: poll));
        updatePoll(p.id, {
            ...p,
            status
        });
    }
  
    useEffect(() => {
      if (!loading && inView && hasMore)
        loadPolls();
    }, [inView, loading, hasMore]);

    return <div className="mx-auto max-w-[1280px] flex flex-col gap-[20px] h-full">
        <div className="flex flex-col gap-[20px]">
            <div className="text-blue text-[20px]">Preview</div>
            <div className="border border-primary p-4">
                {preview?<Poll poll={preview} />:<></>}
            </div>
        </div>
        <table className="table-auto flex-1 h-full">
            <thead>
                <tr className="text-slate-500 border-b border-slate-300 bg-slate-50">
                    <th className="p-4">
                        Topic Name
                    </th>
                    <th className="p-4">
                        Question Count
                    </th>
                    <th className="p-4">
                        Start Date
                    </th>
                    <th className="p-4">
                        Close Date
                    </th>
                    <th className="p-4">
                        Status
                    </th>
                    <th className="p-4">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    polls.map(poll => <tr key={poll.id} className="hover:bg-slate-50">
                        <td className="p-4">{poll.topic}</td>
                        <td className="p-4">{poll.questions.length}</td>
                        <td className="p-4">{poll.activeDate.from}</td>
                        <td className="p-4">{poll.activeDate.to}</td>
                        <td className="p-4"><button onClick={() => changeStatus(poll)} className={"rounded-full px-2 py-1 text-white text-xs " + (poll.status == 1 ? ' bg-[#00ff00]': 'bg-[#ff0000]')}>{getStatusText(poll.status)}</button></td>
                        <td className="p-4"><button onClick={() => setPreview(poll)}>Preview</button></td>
                    </tr>)
                }
            </tbody>
        </table>
        <div ref={ref} className="h-10" />
    </div>;
}